// Footer active button handling + screen switching

document.addEventListener("DOMContentLoaded", () => {
  const footerButtons = document.querySelectorAll("footer .footer-btns");
  const screens = document.querySelectorAll("main .screen[data-screen]");

  if (!footerButtons.length || !screens.length) return;

  const hideAllScreens = () => {
    screens.forEach((s) => {
      s.style.display = "none";
    });
  };

  const showScreen = (id) => {
    const el = document.querySelector(`main .screen[data-screen="${id}"]`);
    if (!el) return;
    el.style.display = "block";
  };

  const setActive = (activeBtn) => {
    footerButtons.forEach((btn) => btn.classList.remove("active"));
    if (activeBtn) activeBtn.classList.add("active");
  };

  const activateFromButton = (btn) => {
    if (!btn) return;

    // data-target may be on the <button> or on its child <img>
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

  // Initialize to Home
  const homeBtn =
    document.querySelector('footer .footer-btns[data-target="lineup"]') ||
    document
      .querySelector('footer .footer-btns [data-target="lineup"]')
      ?.closest(".footer-btns") ||
    footerButtons[0];

  activateFromButton(homeBtn);
});

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

// Close all dropdowns when one is opened (optional, but prevents multiple sections staying open)
function closeAllInfoDropdowns() {
  document
    .getElementById("info-algemeen-myDropdown")
    ?.classList.remove("show-algemeen");

  document
    .getElementById("info-Bereikbaarheid-myDropdown")
    ?.classList.remove("show-Bereikbaarheid");
}

// --- Lineup horizontal positioning (acts) ---
// 15 min = 60px (so 1 hour = 240px)
const LINEUP_DAY_START_MIN = 10 * 60; // 10:00
const PX_PER_MIN = 57.5 / 15;

function parseTimeToMinutes(t) {
  // expects "HH:MM"
  const [h, m] = t.split(":").map((n) => Number(n));
  return h * 60 + m;
}

// Example placeholder: create a bar at a specific time.
// Replace the data with your real lineup data.
function renderExampleActs(dayKey) {
  const layer = document.getElementById(`acts-layer-${dayKey}`);
  if (!layer) return;

  layer.innerHTML = "";

  // Example: one act from 12:15 to 15:15
  const start = parseTimeToMinutes("12:15");
  const end = parseTimeToMinutes("15:15");
  // const start = parseTimeToMinutes("12:15");
  // const end = parseTimeToMinutes("15:15");

  const startMin = start - LINEUP_DAY_START_MIN;
  const endMin = end - LINEUP_DAY_START_MIN;

  const leftPx = startMin * PX_PER_MIN;
  const widthPx = (endMin - startMin) * PX_PER_MIN;

  const bar = document.createElement("div");
  bar.className = "lineup-act-bar";
  bar.style.left = `${leftPx}px`;
  bar.style.width = `${widthPx}px`;
  bar.textContent = "Act (12:15-15:15)";

  layer.appendChild(bar);
}

document.addEventListener("DOMContentLoaded", () => {
  // render example bars for both days
  renderExampleActs("zaterdag");
  renderExampleActs("zondag");
});
