// Map sidebar (collapsible) with bilingual NL/EN labels and marker thumbnails.
// Works together with assets/js/mapInteraction.js
(function () {
  const SIDEBAR_ID = "map-sidebar";
  const LIST_ID = "map-sidebar-list";

  function el(id) {
    return document.getElementById(id);
  }

  function ensureSidebar() {
    const mapSection = document.querySelector(
      'main .screen[data-screen="map"]',
    );
    if (!mapSection) return null;

    let sidebar = document.getElementById(SIDEBAR_ID);
    if (sidebar) return sidebar;

    sidebar = document.createElement("aside");
    sidebar.id = SIDEBAR_ID;
    sidebar.className = "map-sidebar is-open";
    sidebar.innerHTML = `
      <div class="map-sidebar-header">
        <div class="map-sidebar-title">Plekken</div>
        <button class="map-sidebar-close" type="button" aria-label="Sluiten">×</button>
      </div>
      <div class="map-sidebar-list" id="${LIST_ID}"></div>
    `;

    mapSection.insertBefore(sidebar, mapSection.firstChild);

    const closeBtn = sidebar.querySelector(".map-sidebar-close");
    const toggleBtn = sidebar.querySelector(".map-sidebar-toggle");

    closeBtn?.addEventListener("click", () => {
      sidebar.classList.add("is-closed");
      sidebar.classList.remove("is-open");
    });

    toggleBtn?.addEventListener("click", () => {
      sidebar.classList.add("is-open");
      sidebar.classList.remove("is-closed");
    });

    // Create arrow toggle to reopen sidebar when collapsed
    const existingArrow = document.querySelector(".map-sidebar-arrow-toggle");
    const arrowBtn = existingArrow || document.createElement("button");
    arrowBtn.className = "map-sidebar-arrow-toggle";
    arrowBtn.type = "button";
    arrowBtn.setAttribute("aria-label", "Open sidebar");
    arrowBtn.textContent = "›";

    if (!existingArrow) {
      // Append after sidebar inside the map screen so selector/pure positioning works
      mapSection.appendChild(arrowBtn);
    }

    arrowBtn.addEventListener("click", () => {
      sidebar.classList.add("is-open");
      sidebar.classList.remove("is-closed");
    });

    return sidebar;
  }

  function getMarkerItems() {
    // mapInteraction.js renders one <img.map-marker-svg> per marker pin.
    // We create one sidebar entry per unique SVG type.
    const markerImgs = document.querySelectorAll("#map-canvas .map-marker-svg");
    const items = [];

    const seen = new Set();
    markerImgs.forEach((img) => {
      const src = img.getAttribute("src") || "";
      const alt = img.getAttribute("alt") || "";
      const key = src || alt;
      if (!key || seen.has(key)) return;
      seen.add(key);
      items.push({ src, alt });
    });

    return items;
  }

  function labelToNL(str) {
    if (!str) return "";
    // When mapInteraction.js sets img.alt to the English label (m.label),
    // translate to NL for the NL column / aria-label.
    return MAP_EN_TO_NL[str] || str;
  }

  function labelToEN(str) {
    return str || "";
  }

  const MAP_EN_TO_NL = {
    "Poton Stage": "Poton",
    "Lake Stage": "Lake",
    "Club Stage": "Club",
    "Hanggar Stage": "Hanggar",
    "Entrance": "Ingang",
    "First Aid": "EHBO",
    Merchandise: "Koopwaar",
    Lockers: "Kluisjes",
    Bar: "Bar",
    Toiletten: "WC",
    "Food & Drinks": "Eten & Drinken",
    "Ice Cream": "IJs",
  };

  function buildSidebar() {
    const sidebar = ensureSidebar();
    if (!sidebar) return;

    const list = el(LIST_ID);
    if (!list) return;

    const items = getMarkerItems();
    list.innerHTML = "";

    if (!items.length) {
      const p = document.createElement("div");
      p.className = "map-sidebar-empty";
      p.textContent = "Geen punten";
      list.appendChild(p);
      return;
    }

    items.forEach((it, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "map-sidebar-entry map-sidebar-entry-only";
      btn.setAttribute(
        "aria-label",
        `${labelToNL(it.alt)} / ${labelToEN(it.alt)}`,
      );

      const currentLang =
        document.documentElement.getAttribute("data-lang") || "nl";
      const nlLabel = labelToNL(it.alt);
      const enLabel = labelToEN(it.alt);

      btn.innerHTML = `
        <div class="map-sidebar-entry-left">
          <img class="map-sidebar-thumb" src="${it.src}" alt="" draggable="false" />
          <div class="map-sidebar-entry-text">
            <div class="map-sidebar-label-nl" style="display:${currentLang === "nl" ? "block" : "none"}">${nlLabel}</div>
            <div class="map-sidebar-label-en" style="display:${currentLang === "en" ? "block" : "none"}">${enLabel}</div>
          </div>
        </div>
      `;

      btn.addEventListener("click", () => {
        const pins = Array.from(
          document.querySelectorAll("#map-canvas .map-marker"),
        ).filter((p) => {
          const img = p.querySelector(".map-marker-svg");
          return img && img.getAttribute("src") === it.src;
        });

        if (pins[0]) {
          pins[0].dispatchEvent(
            new MouseEvent("click", { bubbles: true, cancelable: true }),
          );
        }
      });

      list.appendChild(btn);
    });
  }

  function boot() {
    let built = false;

    ensureSidebar();

    const tryBuild = () => {
      const markerImgs = document.querySelectorAll(
        "#map-canvas .map-marker-svg",
      );
      if (markerImgs.length && !built) {
        built = true;
        buildSidebar();
      }
    };

    tryBuild();

    const canvas = document.getElementById("map-canvas");
    if (canvas) {
      const obs = new MutationObserver(() => {
        tryBuild();
      });
      obs.observe(canvas, { childList: true, subtree: true });
    }

    // script.js updates language but only swaps [data-nl]/[data-en] and reloads lineup.
    // The map sidebar should update too, so listen to a few possible signals.
    window.addEventListener("ufest:langchange", () => {
      built = false;
      buildSidebar();
    });

    // Fallback: rebuild when toggleLang() runs (language button)
    const langBtn = document.getElementById("langBtn");
    langBtn?.addEventListener("click", () => {
      built = false;
      buildSidebar();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
