// ── Footer navigation ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const footerButtons = document.querySelectorAll("footer .footer-btns");
  const screens = document.querySelectorAll("main .screen[data-screen]");

  if (!footerButtons.length || !screens.length) return;

  const hideAllScreens = () =>
    screens.forEach((s) => (s.style.display = "none"));

  const showScreen = (id) => {
    const el = document.querySelector(`main .screen[data-screen="${id}"]`);
    if (el) el.style.display = "flex";
  };

  const setActive = (activeBtn) => {
    footerButtons.forEach((btn) => btn.classList.remove("active"));
    if (activeBtn) activeBtn.classList.add("active");
  };

  const activateFromButton = (btn) => {
    if (!btn) return;
    const target =
      btn.getAttribute("data-target") ||
      btn.querySelector("[data-target]")?.getAttribute("data-target");
    if (!target) return;
    setActive(btn);
    hideAllScreens();
    showScreen(target);
  };

  footerButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      activateFromButton(btn);
    });
  });

  // Default: home
  const homeBtn =
    document.querySelector('footer .footer-btns[data-target="home"]') ||
    document
      .querySelector('footer .footer-btns [data-target="home"]')
      ?.closest(".footer-btns") ||
    footerButtons[0];
  activateFromButton(homeBtn);
});

// ── Info dropdowns ─────────────────────────────────────────────────────────
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

// ── Day switcher ───────────────────────────────────────────────────────────
function showLineupDay(day) {
  ["zaterdag", "zondag"].forEach((d) => {
    const el = document.getElementById(`lineup-${d}`);
    if (el) el.style.display = d === day ? "flex" : "none";
  });

  document.querySelectorAll(".lineup-dag-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.day === day);
  });
}

// ── Lineup rendering ───────────────────────────────────────────────────────
const DAY_START_MIN = 10 * 60; // 10:00
const DAY_END_MIN = 24 * 60; // 24:00 (last tick shown)
const PX_PER_15MIN = 57.5;
const PX_PER_MIN = PX_PER_15MIN / 15;
const STAGE_ORDER = ["poton", "club", "lake", "hangar"];
const STAGE_LABELS = {
  poton: "Poton",
  club: "Club",
  lake: "Lake",
  hangar: "Hangar",
};
const TOTAL_MINUTES = DAY_END_MIN - DAY_START_MIN; // 840 min
const TOTAL_TICKS = TOTAL_MINUTES / 15; // 56 ticks
const STAGE_COLORS = {
  poton: "#e3b505", // yellow
  club: " #247ba0;", // blue
  lake: "#f03228", // red
  hangar: "#50c878", // green

};

function parseMin(t) {
  const [h, m] = String(t ?? "")
    .trim()
    .split(":")
    .map(Number);
  return isNaN(h) || isNaN(m) ? NaN : h * 60 + m;
}

function buildTimeHeader() {
  const header = document.createElement("div");
  header.className = "lineup-time-header";

  for (let i = 0; i <= TOTAL_TICKS; i++) {
    const tick = document.createElement("div");
    tick.className = "lineup-time-tick";
    const totalMin = DAY_START_MIN + i * 15;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    tick.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    header.appendChild(tick);
  }
  return header;
}

function renderActsForDay(dayKey, acts) {
  const container = document.getElementById(`lineup-${dayKey}`);
  if (!container) return;

  // Clear previous render (keep the structure intact if already built)
  container.innerHTML = "";
  container.style.display = "flex";
  container.style.flexDirection = "column";

  // ── Table ──
  const table = document.createElement("div");
  table.className = "lineup-table";
  container.appendChild(table);

  // Stage labels column
  const stagesCol = document.createElement("div");
  stagesCol.className = "lineup-stages";
  STAGE_ORDER.forEach((key) => {
    const lbl = document.createElement("div");
    lbl.className = "lineup-stage-label";
    lbl.textContent = STAGE_LABELS[key];
    stagesCol.appendChild(lbl);
  });

  // Schedule column
  const scheduleCol = document.createElement("div");
  scheduleCol.className = "lineup-schedule";

  scheduleCol.appendChild(buildTimeHeader());

  // Group acts by stage
  const byStage = {};
  STAGE_ORDER.forEach((k) => (byStage[k] = []));
  (acts || []).forEach((a) => {
    if (a?.stage && byStage[a.stage]) byStage[a.stage].push(a);
  });

  STAGE_ORDER.forEach((stageKey) => {
    const row = document.createElement("div");
    row.className = "lineup-row";
    // Width = total ticks × px/tick
    row.style.width = `${TOTAL_TICKS * PX_PER_15MIN}px`;

    byStage[stageKey].forEach((act) => {
      const start = parseMin(act["begin-time"]);
      const end = parseMin(act["end-time"]);
      if (isNaN(start) || isNaN(end) || end <= start) return;

      const leftPx = (start - DAY_START_MIN) * PX_PER_MIN + 10;
      const widthPx = (end - start) * PX_PER_MIN - 2; // 2px gap

      if (!isFinite(leftPx) || !isFinite(widthPx) || widthPx <= 0) return;

      const bar = document.createElement("div");
      bar.className = "lineup-act-bar";
      bar.style.left = `${leftPx}px`;
      bar.style.background = STAGE_COLORS[stageKey] || "#247ba0";
      bar.style.width = `${widthPx}px`;
      if (act.description) bar.title = act.description;

      const name = document.createElement("span");
      name.className = "act-name";
      name.textContent = act.name || "Act";

      const time = document.createElement("span");
      time.className = "act-time";
      time.textContent = `${String(act["begin-time"]).trim()} – ${String(act["end-time"]).trim()}`;

      bar.appendChild(name);
      bar.appendChild(time);
      row.appendChild(bar);
    });

    scheduleCol.appendChild(row);
  });

  table.appendChild(stagesCol);
  table.appendChild(scheduleCol);
}

async function loadAndRenderLineup() {
  try {
    const res = await fetch("info.json");
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) return;

    const byDay = Object.fromEntries(data.map((d) => [d.day, d.acts]));
    renderActsForDay("zaterdag", byDay["zaterdag"] ?? []);
    renderActsForDay("zondag", byDay["zondag"] ?? []);

    // Show Saturday by default; hide Sunday
    const zondag = document.getElementById("lineup-zondag");
    if (zondag) zondag.style.display = "none";

    // Mark Saturday button active
    const btns = document.querySelectorAll(".lineup-dag-btn");
    btns.forEach((b) =>
      b.classList.toggle("active", b.dataset.day === "zaterdag"),
    );
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadAndRenderLineup);
