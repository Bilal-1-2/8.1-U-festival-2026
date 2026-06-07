// server.js (NO DATABASE: reads lineup from info.json)
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

// server.js kept only as a legacy placeholder.
// This project serves directly from static files (info.json) without running a Node server.
// Delete or ignore this file.

module.exports = {};

function loadInfoJson() {
  const infoPath = path.join(__dirname, "info.json");
  const raw = fs.readFileSync(infoPath, "utf8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

// API endpoint for lineup (file-based)
app.get("/api/lineup", (req, res) => {
  const lang = req.query.lang === "en" ? "en" : "nl";

  const info = loadInfoJson();

  // info.json already matches the frontend structure.
  // Normalize multilingual fields to be consistent with what the UI expects.
  const result = info.map((day) => {
    const acts = (day.acts || []).map((act) => {
      const artist = act.artist || null;

      return {
        ...act,
        tagline:
          lang === "en"
            ? act.tagline_en || act.tagline || ""
            : act.tagline_nl || act.tagline || "",
        description:
          lang === "en"
            ? act.description_en || act.description || ""
            : act.description_nl || act.description || "",
        artist:
          artist &&
          (lang === "en"
            ? {
                ...artist,
                origin: artist.origin_en || artist.origin || "",
              }
            : artist),
      };
    });

    return { day: day.day, acts };
  });

  res.json(result);
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`ℹ️  Lineup served from info.json (no database)`);
});
