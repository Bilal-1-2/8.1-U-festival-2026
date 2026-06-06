/*
  Importer: reads info.json and inserts data into MySQL (schema from create_festival_db.sql).

  Usage (after installing mysql2):
    node sql/import_info_json_to_mysql.js --host=localhost --user=root --password=YOURPASS --db=u_festival

  This script:
  - upserts days + stages
  - upserts artists (by name)
  - upserts acts (by a unique natural key: day+stage+name+begin_time)
  - inserts/updates artist_socials
*/

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function parseArgs(argv) {
  const out = {};
  argv.slice(2).forEach((a) => {
    const [k, v] = a.split("=");
    if (!k || v === undefined) return;
    out[k.replace(/^--/, "")] = v;
  });
  return out;
}

async function main() {
  const args = parseArgs(process.argv);
  const host = args.host || "localhost";
  const user = args.user || "root";
  const password = args.password || "";
  const db = args.db || "u_festival";

  const infoPath = path.join(process.cwd(), "info.json");
  const raw = fs.readFileSync(infoPath, "utf8");
  const data = JSON.parse(raw);

  const conn = await mysql.createConnection({
    host,
    user,
    password,
    database: db,
  });

  // Upsert helpers
  async function upsertDay(slug, name_nl, name_en) {
    const [res] = await conn.execute(
      `INSERT INTO days (slug, name_nl, name_en)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name_nl = VALUES(name_nl), name_en = VALUES(name_en)`,
      [slug, name_nl, name_en],
    );
    const [rows] = await conn.execute(`SELECT id FROM days WHERE slug = ?`, [
      slug,
    ]);
    return rows[0].id;
  }

  async function upsertStage(slug, name_nl, name_en) {
    const [rows] = await conn.execute(`SELECT id FROM stages WHERE slug = ?`, [
      slug,
    ]);
    if (rows.length) return rows[0].id;

    const [ins] = await conn.execute(
      `INSERT INTO stages (slug, name_nl, name_en) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name_nl = VALUES(name_nl), name_en = VALUES(name_en)`,
      [slug, name_nl, name_en],
    );

    const [rows2] = await conn.execute(`SELECT id FROM stages WHERE slug = ?`, [
      slug,
    ]);
    return rows2[0].id;
  }

  async function upsertArtistByName(artist) {
    const name = artist && artist.name ? artist.name : null;
    // In your JSON, artist object exists only with fields: photo/genre/origin/socials,
    // but the "name" of the act is the performer name.
    // We'll store a pseudo-artist with act name.
    return null;
  }

  // Actual artist upsert: by genre+origin is not reliable; by name we use act.name
  async function upsertArtistForAct(act) {
    const ar = act.artist || {};
    const name = act.name; // natural mapping
    const genre = ar.genre || null;
    const origin_nl = ar.origin || null;
    const origin_en = ar.origin_en || null;
    const photo_url = ar.photo || null;

    await conn.execute(
      `INSERT INTO artists (name, genre, origin_nl, origin_en, photo_url)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         genre = COALESCE(VALUES(genre), genre),
         origin_nl = COALESCE(VALUES(origin_nl), origin_nl),
         origin_en = COALESCE(VALUES(origin_en), origin_en),
         photo_url = COALESCE(VALUES(photo_url), photo_url)`,
      [name, genre, origin_nl, origin_en, photo_url],
    );

    // artists table currently has no UNIQUE(name) in schema.
    // We'll fetch by name; if duplicates exist, take the first.
    const [rows] = await conn.execute(
      `SELECT id FROM artists WHERE name = ? ORDER BY id LIMIT 1`,
      [name],
    );
    return rows[0].id;
  }

  async function upsertAct({ day_id, stage_id, act }) {
    const artist_id = act.artist ? await upsertArtistForAct(act) : null;

    // Unique key strategy: day+stage+name+begin_time (not enforced in schema).
    // We'll delete-insert for simplicity, but safely within transaction.
    await conn.execute(
      `DELETE FROM acts
       WHERE day_id = ? AND stage_id = ? AND name = ? AND begin_time = ?`,
      [day_id, stage_id, act.name, act["begin-time"]],
    );

    await conn.execute(
      `INSERT INTO acts (
         day_id, stage_id,
         name,
         tagline_nl, tagline_en,
         description_nl, description_en,
         video_url,
         begin_time, end_time,
         artist_id
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        day_id,
        stage_id,
        act.name,
        act.tagline || null,
        act.tagline_en || null,
        act.description || null,
        act.description_en || null,
        act.videoUrl || null,
        act["begin-time"],
        act["end-time"],
        artist_id,
      ],
    );
  }

  await conn.beginTransaction();

  try {
    for (const dayObj of data) {
      const daySlug = dayObj.day;
      const dayNameNl =
        daySlug === "zaterdag"
          ? "Zaterdag"
          : daySlug === "zondag"
            ? "Zondag"
            : daySlug;
      const dayNameEn =
        daySlug === "zaterdag"
          ? "Saturday"
          : daySlug === "zondag"
            ? "Sunday"
            : daySlug;
      const day_id = await upsertDay(daySlug, dayNameNl, dayNameEn);

      for (const act of dayObj.acts || []) {
        const stageSlug = act.stage;
        const stage_id = await upsertStage(
          stageSlug,
          stageSlug === "poton" ? "Poton" : stageSlug,
          stageSlug === "poton" ? "Poton" : stageSlug,
        );

        await upsertAct({ day_id, stage_id, act });

        // socials: insert/ignore after act artist insert.
        // Fetch last inserted act's artist_id to associate socials.
        const [actRows] = await conn.execute(
          `SELECT id, artist_id FROM acts
           WHERE day_id = ? AND stage_id = ? AND name = ? AND begin_time = ?
           ORDER BY id DESC LIMIT 1`,
          [day_id, stage_id, act.name, act["begin-time"]],
        );
        const actRow = actRows[0];
        const artist_id = actRow?.artist_id;
        if (!artist_id) continue;

        const socials = act.artist?.socials || {};
        const instagram = socials.instagram || null;
        const spotify = socials.spotify || null;

        if (instagram) {
          await conn.execute(
            `INSERT INTO artist_socials (artist_id, platform, handle_or_id)
             VALUES (?, 'instagram', ?)
             ON DUPLICATE KEY UPDATE handle_or_id = VALUES(handle_or_id)`,
            [artist_id, instagram],
          );
        }
        if (spotify) {
          await conn.execute(
            `INSERT INTO artist_socials (artist_id, platform, handle_or_id)
             VALUES (?, 'spotify', ?)
             ON DUPLICATE KEY UPDATE handle_or_id = VALUES(handle_or_id)`,
            [artist_id, spotify],
          );
        }
      }
    }

    await conn.commit();
    console.log("Import completed successfully.");
  } catch (e) {
    await conn.rollback();
    console.error("Import failed:", e);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
