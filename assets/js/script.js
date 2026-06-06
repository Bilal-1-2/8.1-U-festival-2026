// ═══════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════
let currentLang = localStorage.getItem("ufest-lang") || "nl";
let currentTheme = localStorage.getItem("ufest-theme") || "light";
let favorites = JSON.parse(localStorage.getItem("ufest-favs") || "[]");
let currentAct = null;
let allActsByDay = {}; // { zaterdag: [...], zondag: [...] }

// ═══════════════════════════════════════════════
//  THEME
// ═══════════════════════════════════════════════
function applyTheme(t) {
  currentTheme = t;
  document.documentElement.setAttribute("data-theme", t);
  document.getElementById("themeIcon").textContent = t === "dark" ? "☀️" : "🌙";
  localStorage.setItem("ufest-theme", t);
}
function toggleTheme() {
  applyTheme(currentTheme === "dark" ? "light" : "dark");
}

// ═══════════════════════════════════════════════
//  LANGUAGE
// ═══════════════════════════════════════════════
// Update applyLang function
function applyLang(lang) {
  currentLang = lang;
  document.documentElement.setAttribute("data-lang", lang);
  document.getElementById("langLabel").textContent =
    lang === "nl" ? "EN" : "NL";
  localStorage.setItem("ufest-lang", lang);
  
  // Reload lineup with new language
  loadAndRenderLineup();
  
  // Swap all [data-nl][data-en] text nodes
  document.querySelectorAll("[data-nl]").forEach((el) => {
    el.innerHTML =
      lang === "nl" ? el.dataset.nl : el.dataset.en || el.dataset.nl;
  });
}
function toggleLang() {
  applyLang(currentLang === "nl" ? "en" : "nl");
}

// ═══════════════════════════════════════════════
//  FAVORITES
// ═══════════════════════════════════════════════
function favKey(act) {
  return `${act.stage}|${act.name}|${act["begin-time"]}`;
}
function isFav(act) {
  return favorites.includes(favKey(act));
}
function saveFavs() {
  localStorage.setItem("ufest-favs", JSON.stringify(favorites));
}

function toggleFav(act) {
  const k = favKey(act);
  favorites = isFav(act) ? favorites.filter((x) => x !== k) : [...favorites, k];
  saveFavs();
  refreshFavUI();
}
function toggleFavFromSheet() {
  if (currentAct) toggleFav(currentAct);
}

function refreshFavUI() {
  // update heart in open sheet
  const btn = document.getElementById("actFavBtn");
  if (btn && currentAct) {
    const fav = isFav(currentAct);
    btn.textContent = fav ? "♥" : "♡";
    btn.classList.toggle("is-fav", fav);
  }
  // update all act bars
  document.querySelectorAll(".lineup-act-bar[data-favkey]").forEach((bar) => {
    const star = bar.querySelector(".bar-fav");
    if (star)
      star.textContent = favorites.includes(bar.dataset.favkey) ? "♥" : "";
  });
  // update footer heart badge
  const footerHeart = document.querySelector(".fav-footer-icon");
  if (footerHeart) footerHeart.textContent = favorites.length > 0 ? "♥" : "♡";
}

function openFavScreen() {
  const overlay = document.getElementById("favOverlay");
  const screen = document.getElementById("favScreen");
  const list = document.getElementById("favList");
  list.innerHTML = "";

  const favActs = [];
  Object.entries(allActsByDay).forEach(([day, acts]) => {
    acts.forEach((act) => {
      if (isFav(act)) favActs.push({ act, day });
    });
  });

  if (favActs.length === 0) {
    list.innerHTML = `<p class="fav-empty">${currentLang === "nl" ? "Nog geen favorieten toegevoegd." : "No favourites added yet."}</p>`;
  } else {
    favActs.forEach(({ act, day }) => {
      const dayLabel =
        day === "zaterdag"
          ? currentLang === "nl"
            ? "Zaterdag"
            : "Saturday"
          : currentLang === "nl"
            ? "Zondag"
            : "Sunday";
      const item = document.createElement("div");
      item.className = "fav-item";
      item.innerHTML = `
        <div class="fav-item-left" onclick='openActSheet(${JSON.stringify(act).replace(/'/g, "&#39;")})'>
          <span class="fav-stage-dot stage-${act.stage}"></span>
          <div class="fav-item-info">
            <strong>${act.name}</strong>
            <span class="fav-item-sub">${STAGE_LABELS[act.stage] || act.stage} · ${dayLabel} ${act["begin-time"]}–${act["end-time"]}</span>
          </div>
        </div>
        <button class="fav-item-remove" onclick="removeFav('${favKey(act).replace(/'/g, "\\'")}', this)">✕</button>`;
      list.appendChild(item);
    });
  }

  overlay.style.display = "block";
  requestAnimationFrame(() => {
    overlay.classList.add("open");
    screen.classList.add("open");
  });
}

function closeFavScreen() {
  const overlay = document.getElementById("favOverlay");
  const screen = document.getElementById("favScreen");
  overlay.classList.remove("open");
  screen.classList.remove("open");
  setTimeout(() => {
    overlay.style.display = "none";
  }, 320);
}

function removeFav(key, btn) {
  favorites = favorites.filter((k) => k !== key);
  saveFavs();
  refreshFavUI();
  const item = btn.closest(".fav-item");
  item.remove();
  const list = document.getElementById("favList");
  if (!list.querySelector(".fav-item"))
    list.innerHTML = `<p class="fav-empty">${currentLang === "nl" ? "Nog geen favorieten toegevoegd." : "No favourites added yet."}</p>`;
}

// ═══════════════════════════════════════════════
//  QR CODE
// ═══════════════════════════════════════════════
let qrBuilt = false;
function openQR() {
  const overlay = document.getElementById("qrOverlay");
  const sheet = document.getElementById("qrSheet");
  overlay.style.display = "block";
  requestAnimationFrame(() => {
    overlay.classList.add("open");
    sheet.classList.add("open");
  });

  if (!qrBuilt) {
    const url = window.location.href;
    document.getElementById("qrUrlLabel").textContent = url;
    new QRCode(document.getElementById("qrCanvas"), {
      text: url,
      width: 200,
      height: 200,
      colorDark: currentTheme === "dark" ? "#ffffff" : "#111111",
      colorLight: "rgba(0,0,0,0)",
      correctLevel: QRCode.CorrectLevel.H,
    });
    qrBuilt = true;
  }
}
function closeQR() {
  document.getElementById("qrSheet").classList.remove("open");
  document.getElementById("qrOverlay").classList.remove("open");
  setTimeout(() => {
    document.getElementById("qrOverlay").style.display = "none";
  }, 380);
}

// ═══════════════════════════════════════════════
//  FOOTER NAV
// ═══════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  const footerBtns = document.querySelectorAll("footer .footer-btns");
  const screens = document.querySelectorAll("main .screen[data-screen]");

  const hideAll = () => screens.forEach((s) => (s.style.display = "none"));
  const showScr = (id) => {
    const el = document.querySelector(`main .screen[data-screen="${id}"]`);
    if (el) el.style.display = "flex";
  };
  const setActive = (btn) => {
    footerBtns.forEach((b) => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
  };

  const activate = (btn) => {
    if (!btn) return;
    const target =
      btn.getAttribute("data-target") ||
      btn.querySelector("[data-target]")?.getAttribute("data-target");
    if (!target) return;
    setActive(btn);
    hideAll();
    showScr(target);
  };

  footerBtns.forEach((btn) => {
    // skip the fav button (it has no data-target)
    if (btn.id === "favBtn") return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      activate(btn);
    });
  });

  // default: home
  const homeBtn =
    document
      .querySelector('footer .footer-btns [data-target="home"]')
      ?.closest(".footer-btns") || footerBtns[0];
  activate(homeBtn);

  // apply persisted prefs
  applyTheme(currentTheme);
  applyLang(currentLang);
  refreshFavUI();
});

// ═══════════════════════════════════════════════
//  INFO DROPDOWNS
// ═══════════════════════════════════════════════
function myFunction() {
  document
    .getElementById("info-algemeen-myDropdown")
    .classList.toggle("show-algemeen");
}
function myFunction2() {
  document
    .getElementById("info-Bereikbaarheid-myDropdown")
    .classList.toggle("show-Bereikbaarheid");
}

// ═══════════════════════════════════════════════
//  DAY SWITCHER
// ═══════════════════════════════════════════════
function showLineupDay(day) {
  ["zaterdag", "zondag"].forEach((d) => {
    const el = document.getElementById(`lineup-${d}`);
    if (el) el.style.display = d === day ? "flex" : "none";
  });
  document
    .querySelectorAll(".lineup-dag-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.day === day));
}

// ═══════════════════════════════════════════════
//  LINEUP CONSTANTS
// ═══════════════════════════════════════════════
const DAY_START_MIN = 10 * 60;
const DAY_END_MIN = 24 * 60;
const PX_PER_15MIN = 57.5;
const PX_PER_MIN = PX_PER_15MIN / 15;
const STAGE_ORDER = ["poton", "club", "lake", "hanggar"];
const STAGE_LABELS = {
  poton: "Poton",
  club: "Club",
  lake: "Lake",
  hanggar: "Hanggar",
};
const STAGE_COLORS = {
  poton: "#e3b505",
  club: "#247ba0",
  lake: "#f03228",
  hanggar: "#50c878",
};
const TOTAL_TICKS = (DAY_END_MIN - DAY_START_MIN) / 15;

function parseMin(t) {
  const [h, m] = String(t ?? "")
    .trim()
    .split(":")
    .map(Number);
  return isNaN(h) || isNaN(m) ? NaN : h * 60 + m;
}

function buildTimeHeader() {
  const hdr = document.createElement("div");
  hdr.className = "lineup-time-header";
  for (let i = 0; i <= TOTAL_TICKS; i++) {
    const tick = document.createElement("div");
    tick.className = "lineup-time-tick";
    const min = DAY_START_MIN + i * 15;
    tick.textContent = `${String(Math.floor(min / 60) % 24).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
    hdr.appendChild(tick);
  }
  return hdr;
}

function renderActsForDay(dayKey, acts) {
  const container = document.getElementById(`lineup-${dayKey}`);
  if (!container) return;
  container.innerHTML = "";
  container.style.cssText = "display:flex;flex-direction:column;";

  const table = document.createElement("div");
  table.className = "lineup-table";

  // Stage label column
  const stagesCol = document.createElement("div");
  stagesCol.className = "lineup-stages";
  STAGE_ORDER.forEach((k) => {
    const lbl = document.createElement("div");
    lbl.className = "lineup-stage-label";
    lbl.textContent = STAGE_LABELS[k];
    stagesCol.appendChild(lbl);
  });

  // Schedule column
  const schedCol = document.createElement("div");
  schedCol.className = "lineup-schedule";
  schedCol.appendChild(buildTimeHeader());

  const byStage = {};
  STAGE_ORDER.forEach((k) => (byStage[k] = []));
  (acts || []).forEach((a) => {
    if (a?.stage && byStage[a.stage]) byStage[a.stage].push(a);
  });

  STAGE_ORDER.forEach((stageKey) => {
    const row = document.createElement("div");
    row.className = "lineup-row";
    row.style.width = `${TOTAL_TICKS * PX_PER_15MIN}px`;

    (byStage[stageKey] || []).forEach((act) => {
      const start = parseMin(act["begin-time"]);
      const end = parseMin(act["end-time"]);
      if (isNaN(start) || isNaN(end) || end <= start) return;
      const leftPx = (start - DAY_START_MIN) * PX_PER_MIN;
      const widthPx = (end - start) * PX_PER_MIN;
      if (!isFinite(leftPx) || widthPx <= 0) return;

      const bar = document.createElement("div");
      bar.className = "lineup-act-bar";
      bar.style.left = `${leftPx}px`;
      bar.style.width = `${widthPx}px`;
      bar.style.background = STAGE_COLORS[stageKey] || "#247ba0";
      bar.dataset.favkey = favKey(act);

      const nm = document.createElement("span");
      nm.className = "act-name";
      nm.textContent = act.name || "Act";
      const tm = document.createElement("span");
      tm.className = "act-time";
      tm.textContent = `${act["begin-time"]} – ${act["end-time"]}`;
      const fv = document.createElement("span");
      fv.className = "bar-fav";
      fv.textContent = isFav(act) ? "♥" : "";

      bar.appendChild(nm);
      bar.appendChild(tm);
      bar.appendChild(fv);
      bar.addEventListener("click", () => openActSheet(act));
      row.appendChild(bar);
    });
    schedCol.appendChild(row);
  });

  table.appendChild(stagesCol);
  table.appendChild(schedCol);
  container.appendChild(table);
}

// ═══════════════════════════════════════════════
//  ACT SHEET
// ═══════════════════════════════════════════════
const STAGE_NAMES = {
  poton: "Poton",
  club: "Club",
  lake: "Lake",
  hanggar: "Hanggar",
};

function getEmbedUrl(url) {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0&autoplay=1` : null;
}

function openActSheet(act) {
  if (typeof act === "string") act = JSON.parse(act);
  currentAct = act;

  const sheet = document.getElementById("actSheet");
  const overlay = document.getElementById("actSheetOverlay");
  sheet.dataset.stage = act.stage || "";

  // basic fields
  document.getElementById("actSheetStage").textContent =
    STAGE_NAMES[act.stage] || act.stage || "";
  document.getElementById("actSheetName").textContent = act.name || "";
  document.getElementById("actSheetTagline").textContent =
    currentLang === "en" && act.tagline_en ? act.tagline_en : act.tagline || "";
  document.getElementById("actSheetTime").textContent =
    `${String(act["begin-time"]).trim()} – ${String(act["end-time"]).trim()}`;
  document.getElementById("actSheetDescription").textContent =
    currentLang === "en" && act.description_en
      ? act.description_en
      : act.description || "";

  // placeholders
  document.getElementById("actPractical").textContent =
    currentLang === "en" ? "To be added later." : "Wordt later aangevuld.";
  document.getElementById("actMoreInfo").textContent =
    currentLang === "en" ? "To be added later." : "Wordt later aangevuld.";

  // artist block
  const ar = act.artist || {};
  const genre = ar.genre || "";
  const origin =
    currentLang === "en" && ar.origin_en ? ar.origin_en : ar.origin || "";

  const photoEl = document.getElementById("actArtistPhoto");
  photoEl.innerHTML = ar.photo
    ? `<img src="${ar.photo}" alt="${act.name}"/>`
    : "🎤";
  document.getElementById("actGenre").textContent = genre;
  document.getElementById("actOrigin").textContent = origin;
  document.getElementById("actGenreRow").style.display = genre
    ? "flex"
    : "none";
  document.getElementById("actOriginRow").style.display = origin
    ? "flex"
    : "none";
  document.getElementById("actArtistBlock").style.display =
    genre || origin || ar.photo ? "block" : "none";

  // socials
  const socialsEl = document.getElementById("actSocials");
  socialsEl.innerHTML = "";
  if (ar.socials?.instagram) {
    const a = document.createElement("a");
    a.href = `https://instagram.com/${ar.socials.instagram}`;
    a.target = "_blank";
    a.className = "act-social-btn";
    a.textContent = "📷 Instagram";
    socialsEl.appendChild(a);
  }
  if (ar.socials?.spotify) {
    const a = document.createElement("a");
    a.href = `https://open.spotify.com/artist/${ar.socials.spotify}`;
    a.target = "_blank";
    a.className = "act-social-btn spotify";
    a.textContent = "🎵 Spotify";
    socialsEl.appendChild(a);
  }

  // video
  const embed = getEmbedUrl(act.videoUrl);
  document.getElementById("actSheetVideoWrap").style.display = embed
    ? "block"
    : "none";
  document.getElementById("actSheetImgWrap").style.display = embed
    ? "none"
    : "block";
  document.getElementById("actSheetIframe").src = embed || "";

  refreshFavUI();

  overlay.style.display = "block";
  requestAnimationFrame(() => {
    overlay.classList.add("open");
    sheet.classList.add("open");
  });
  document.body.style.overflow = "hidden";
}

function closeActSheet() {
  document.getElementById("actSheet").classList.remove("open");
  document.getElementById("actSheetOverlay").classList.remove("open");
  document.getElementById("actSheetIframe").src = "";
  setTimeout(() => {
    document.getElementById("actSheetOverlay").style.display = "none";
    document.body.style.overflow = "";
  }, 380);
}

// ═══════════════════════════════════════════════
//  LOAD DATA
// ═══════════════════════════════════════════════
// Replace the loadAndRenderLineup function in script.js
async function loadAndRenderLineup() {
  try {
    // Change this line from "info.json" to your API endpoint
    const res = await fetch(`/api/lineup?lang=${currentLang}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) return;

    data.forEach((d) => {
      allActsByDay[d.day] = d.acts;
    });
    Object.entries(allActsByDay).forEach(([day, acts]) =>
      renderActsForDay(day, acts),
    );

    document.getElementById("lineup-zondag").style.display = "none";
    document
      .querySelectorAll(".lineup-dag-btn")
      .forEach((b) =>
        b.classList.toggle("active", b.dataset.day === "zaterdag"),
      );
  } catch (e) {
    console.error("Error loading from API:", e);
    // Fallback to info.json if API fails
    try {
      const fallbackRes = await fetch("info.json");
      const fallbackData = await fallbackRes.json();
      fallbackData.forEach((d) => {
        allActsByDay[d.day] = d.acts;
      });
      Object.entries(allActsByDay).forEach(([day, acts]) =>
        renderActsForDay(day, acts),
      );
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
    }
  }
}
document.addEventListener("DOMContentLoaded", loadAndRenderLineup);

// Add Socket.IO client
const socketScript = document.createElement("script");
socketScript.src = "https://cdn.socket.io/4.6.0/socket.io.min.js";
socketScript.onload = () => {
  console.log("Socket.IO loaded");

  // Initialize WebSocket
  let socket = io("http://localhost:8080");

  socket.on("connect", () => {
    console.log("✅ Connected to real-time server");
    socket.emit("subscribe", {});
  });

  socket.on("notification", (data) => {
    console.log("📢 Notification:", data);

    // Show notification in browser
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("U Festival", { body: data.message });
    }

    // Show in-app notification
    const notifDiv = document.createElement("div");
    notifDiv.className = "live-notification";
    notifDiv.innerHTML = `
            <div class="notification-content">
                <span>${data.type === "show_starting_soon" ? "⏰" : "🔴"}</span>
                <span>${data.message}</span>
                <button onclick="this.parentElement.parentElement.remove()">✕</button>
            </div>
        `;
    document.body.insertBefore(notifDiv, document.body.firstChild);
    setTimeout(() => notifDiv.remove(), 10000);

    // Update homepage if live status changed
    if (data.type === "show_starting_soon") {
      const homeScreen = document.querySelector('[data-screen="home"]');
      if (homeScreen && homeScreen.style.display !== "none") {
        let liveCard = document.getElementById("live-status-card");
        if (!liveCard) {
          liveCard = document.createElement("div");
          liveCard.id = "live-status-card";
          homeScreen.insertBefore(liveCard, homeScreen.firstChild);
        }
        liveCard.innerHTML = `
                    <div class="upcoming-notice">
                        <strong>⏰ ${data.message}</strong>
                        <div class="countdown-bar"></div>
                    </div>
                `;
      }
    }
  });

  // Request notification permission
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
};
document.head.appendChild(socketScript);
