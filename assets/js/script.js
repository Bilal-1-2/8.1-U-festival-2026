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
  // Swap icon (light-mode.png for light, dark-mode.png for dark)
  const themeIcon = document.getElementById("themeIcon");
  if (themeIcon) {
    themeIcon.src =
      t === "dark"
        ? "assets/images/night-mode.png"
        : "assets/images/light-mode.png";
  }

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

  // Swap language flag
  const flagEl = document.getElementById("langLabel");
  if (flagEl) {
    flagEl.src =
      lang === "en"
        ? "assets/images/Flag_of_the_United_Kingdom_(3-5).svg"
        : "assets/images/Flag_of_the_Netherlands.svg";
  }
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

  // photo fallback (if artist.photo is empty)
  const expectedPhoto = (() => {
    const name = act?.name || "";
    // If you later rename files, adjust here.
    // Current files in assets/images/acts/*.png
    const fileByName = {
      "Armin van Buuren": "Armin_van_Buuren.png",
      Kensington: "Kensington,.png",
      "De Staat": "De_Staat.png",
      Navarone: "Navarone.png",
      Dotan: "Dotan.png",
      Froukje: "Froukje.png",
      "Martin Garrix": "Martin_Garrix.png",
      "Within Temptation": "Within_Temptation.png",
      "Chef'Special": "Chef_Special.png",
      "Eefje de Visser": "Eefje_de_Visser.png",
      Spinvis: "Spinvis.png",
    };

    const file = fileByName[name];
    return file ? `assets/images/acts/${file}` : null;
  })();

  if (!ar.photo && expectedPhoto) {
    photoEl.innerHTML = `<img src="${expectedPhoto}" alt="${act.name}"/>`;
  }

  // video
  const embed = getEmbedUrl(act.videoUrl);
  const videoWrap = document.getElementById("actSheetVideoWrap");
  const imgWrap = document.getElementById("actSheetImgWrap");
  const iframeEl = document.getElementById("actSheetIframe");

  if (embed) {
    // show video, hide the fallback image/gradient
    videoWrap.style.display = "block";
    imgWrap.style.display = "none";
    iframeEl.src = embed;
  } else {
    // if there is no video: show only the info (no extra background blocks)
    videoWrap.style.display = "none";
    imgWrap.style.display = "none";
    iframeEl.src = "";
  }

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
    const res = await fetch("info.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) return;

    // reset to avoid duplicates on language refresh
    allActsByDay = {};

    data.forEach((d) => {
      allActsByDay[d.day] = d.acts;
    });
    Object.entries(allActsByDay).forEach(([day, acts]) =>
      renderActsForDay(day, acts),
    );

    // default day: zaterdag (show only one day)
    showLineupDay("zaterdag");

    // ensure only Saturday container is visible
    const sat = document.getElementById("lineup-zaterdag");
    const sun = document.getElementById("lineup-zondag");
    if (sat) sat.style.display = "flex";
    if (sun) sun.style.display = "none";
  } catch (e) {
    console.error("Error loading info.json:", e);
  }
}
document.addEventListener("DOMContentLoaded", loadAndRenderLineup);

// ── PWA INSTALL BUTTON ───────────────────────────────
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById("installBtn");

  console.log("beforeinstallprompt: install button shown");
});

function promptInstall() {
  const btn = document.getElementById("installBtn");
  if (!deferredPrompt) {
    // fallback: show install instructions via UA (simple)
    if (btn) btn.textContent = "Open in browser";
    return;
  }

  deferredPrompt.prompt();
  deferredPrompt.userChoice.finally(() => {
    deferredPrompt = null;
    if (btn) btn.textContent = "App";
  });
}
