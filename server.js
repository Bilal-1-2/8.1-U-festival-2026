// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 8080;

// Database connection local
// const pool = mysql
//   .createPool({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "u_festival",

//   })
//   .promise();



  // TO DOMAIN ↓↓↓

// For PRODUCTION (your domain):
const pool = mysql.createPool({
  host: "localhost",  // Get this from your hosting
  user: "u240653_u_festival",            // Get this from your hosting
  password: "r9rZG7HtHR7tujh6PCxd",    // Get this from your hosting
  database: "u240653_u_festival",          // Your database name
}).promise();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve your frontend

// Store active connections and subscriptions
const userSubscriptions = new Map(); // socketId -> { day, stage, artist }

// API endpoint for initial lineup - FIXED VERSION
app.get("/api/lineup", async (req, res) => {
  const lang = req.query.lang || "nl";

  try {
    const [days] = await pool.query(
      "SELECT id, slug, name_nl, name_en FROM days ORDER BY id",
    );
    const result = [];

    for (const day of days) {
      const [acts] = await pool.query(
        `
        SELECT 
            a.name,
            a.tagline_nl,
            a.tagline_en,
            a.description_nl,
            a.description_en,
            a.video_url,
            TIME_FORMAT(a.begin_time, '%H:%i') as begin_time,
            TIME_FORMAT(a.end_time, '%H:%i') as end_time,
            s.slug as stage,
            ar.id as artist_id,
            ar.genre,
            ar.origin_nl,
            ar.origin_en,
            ar.photo_url
        FROM acts a
        JOIN stages s ON a.stage_id = s.id
        LEFT JOIN artists ar ON a.artist_id = ar.id
        WHERE a.day_id = ?
        ORDER BY a.begin_time
        `,
        [day.id],
      );

      // Format acts to match what frontend expects
      const formattedActs = [];

      for (const act of acts) {
        // Get socials if artist exists
        let socials = {};
        if (act.artist_id) {
          const [socialRows] = await pool.query(
            "SELECT platform, handle_or_id FROM artist_socials WHERE artist_id = ?",
            [act.artist_id],
          );
          socialRows.forEach((s) => {
            socials[s.platform] = s.handle_or_id;
          });
        }

        // Build the artist object exactly as frontend expects
        const artistObj = act.artist_id
          ? {
              photo: act.photo_url || "",
              genre: act.genre || "",
              origin: lang === "nl" ? act.origin_nl || "" : act.origin_en || "",
              origin_en: act.origin_en || "",
              socials: socials,
            }
          : null;

        formattedActs.push({
          name: act.name,
          tagline: lang === "nl" ? act.tagline_nl || "" : act.tagline_en || "",
          tagline_en: act.tagline_en || "",
          description:
            lang === "nl" ? act.description_nl || "" : act.description_en || "",
          description_en: act.description_en || "",
          videoUrl: act.video_url,
          "begin-time": act.begin_time,
          "end-time": act.end_time,
          stage: act.stage,
          artist: artistObj,
        });
      }

      result.push({
        day: day.slug,
        acts: formattedActs,
      });
    }

    res.json(result);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Database error: " + error.message });
  }
});

// API to get current and upcoming shows
app.get("/api/now-playing", async (req, res) => {
  const currentTime = new Date().toTimeString().slice(0, 5);

  try {
    const [current] = await pool.query(
      `
            SELECT 
                a.name,
                TIME_FORMAT(a.begin_time, '%H:%i') as begin_time,
                TIME_FORMAT(a.end_time, '%H:%i') as end_time,
                s.slug as stage,
                ar.name as artist_name
            FROM acts a
            JOIN stages s ON a.stage_id = s.id
            LEFT JOIN artists ar ON a.artist_id = ar.id
            WHERE a.begin_time <= ? AND a.end_time >= ?
            ORDER BY a.begin_time
        `,
      [currentTime, currentTime],
    );

    // Get upcoming shows (next 2 hours)
    const [upcoming] = await pool.query(
      `
            SELECT 
                a.name,
                TIME_FORMAT(a.begin_time, '%H:%i') as begin_time,
                TIME_FORMAT(a.end_time, '%H:%i') as end_time,
                s.slug as stage,
                ar.name as artist_name,
                TIMESTAMPDIFF(MINUTE, ?, a.begin_time) as minutes_until
            FROM acts a
            JOIN stages s ON a.stage_id = s.id
            LEFT JOIN artists ar ON a.artist_id = ar.id
            WHERE a.begin_time > ? 
            AND a.begin_time <= DATE_ADD(?, INTERVAL 2 HOUR)
            ORDER BY a.begin_time
            LIMIT 10
        `,
      [currentTime, currentTime, currentTime],
    );

    res.json({ current, upcoming });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// WebSocket connection for real-time updates
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User subscribes to notifications
  socket.on("subscribe", (data) => {
    userSubscriptions.set(socket.id, data);
    console.log(
      `User ${socket.id} subscribed to ${data.stage || "all"} stages`,
    );
  });

  // User unsubscribes
  socket.on("unsubscribe", () => {
    userSubscriptions.delete(socket.id);
  });

  socket.on("disconnect", () => {
    userSubscriptions.delete(socket.id);
    console.log("User disconnected:", socket.id);
  });
});

// Function to check for upcoming shows and send notifications
async function checkUpcomingShows() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  try {
    // Find shows starting in the next 5-10 minutes
    const [upcomingShows] = await pool.query(
      `
            SELECT 
                a.id,
                a.name,
                TIME_FORMAT(a.begin_time, '%H:%i') as begin_time,
                TIME_FORMAT(a.end_time, '%H:%i') as end_time,
                s.slug as stage,
                s.name_nl as stage_name,
                ar.id as artist_id,
                ar.name as artist_name,
                TIMESTAMPDIFF(MINUTE, ?, a.begin_time) as minutes_until
            FROM acts a
            JOIN stages s ON a.stage_id = s.id
            LEFT JOIN artists ar ON a.artist_id = ar.id
            WHERE a.begin_time > ?
            AND a.begin_time <= DATE_ADD(?, INTERVAL 10 MINUTE)
            AND TIMESTAMPDIFF(MINUTE, ?, a.begin_time) <= 10
            AND TIMESTAMPDIFF(MINUTE, ?, a.begin_time) > 0
        `,
      [currentTime, currentTime, currentTime, currentTime, currentTime],
    );

    // Send notifications to subscribed users
    for (const show of upcomingShows) {
      for (const [socketId, subscription] of userSubscriptions) {
        // Only send if user cares about this stage/artist
        if (!subscription.stage || subscription.stage === show.stage) {
          const message = {
            type: "show_starting_soon",
            show: show,
            message: `${show.artist_name || show.name} starts in ${show.minutes_until} minutes on ${show.stage_name} stage!`,
            minutes: show.minutes_until,
          };
          io.to(socketId).emit("notification", message);
        }
      }
    }

    // Also check for shows that just started
    const [justStarted] = await pool.query(
      `
            SELECT 
                a.name,
                TIME_FORMAT(a.begin_time, '%H:%i') as begin_time,
                s.slug as stage,
                s.name_nl as stage_name,
                ar.name as artist_name
            FROM acts a
            JOIN stages s ON a.stage_id = s.id
            LEFT JOIN artists ar ON a.artist_id = ar.id
            WHERE a.begin_time <= ?
            AND a.begin_time > DATE_SUB(?, INTERVAL 5 MINUTE)
        `,
      [currentTime, currentTime],
    );

    for (const show of justStarted) {
      for (const [socketId, subscription] of userSubscriptions) {
        if (!subscription.stage || subscription.stage === show.stage) {
          io.to(socketId).emit("notification", {
            type: "show_started",
            show: show,
            message: `🔥 ${show.artist_name || show.name} is NOW PLAYING on ${show.stage_name}!`,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error checking shows:", error);
  }
}

// Broadcast general announcements
async function sendAnnouncement(title, message, importance = "info") {
  io.emit("announcement", {
    id: Date.now(),
    title,
    message,
    importance, // 'info', 'warning', 'emergency'
    timestamp: new Date().toISOString(),
  });
}

// Check every minute for upcoming shows
setInterval(checkUpcomingShows, 60000);

// Also check on the half-minute for more precise timing
setInterval(checkUpcomingShows, 30000);

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket enabled for real-time updates`);

  // Example: Schedule announcements
  // sendAnnouncement('Lost & Found', 'Lost phone? Check info desk at main entrance', 'info');
});
