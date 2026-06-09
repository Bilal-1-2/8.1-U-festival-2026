// ═══════════════════════════════════════════════
//  MAP INTERACTION — pan, pinch-zoom, markers
// ═══════════════════════════════════════════════
(function () {
  // ── MARKER DATA ─────────────────────────────────────────────
  // x/y = percentage of SVG (2330 × 1353). Adjust to your map.
  const MARKERS = [
    { id: "poton", label: "Poton Stage", x: 21, y: 63, color: "#e3b505" },
    { id: "lake", label: "Lake Stage", x: 53, y: 48, color: "#f03228" },
    { id: "club", label: "Club Stage", x: 70, y: 42, color: "#247ba0" },
    { id: "hanggar", label: "Hanggar Stage", x: 90.5, y: 20, color: "#50c878" },
    {
      id: "ingang",
      label: "Ingang / Entrance",
      x: 69,
      y: 86,
      color: "#6a4c93",
    },
    { id: "ehbo", label: "EHBO / First Aid", x: 18.2, y: 33, color: "#fff" },

    { id: "merchandise", label: "Merchandise", x: 18, y: 80, color: "#8d99ae" },
    { id: "merchandise", label: "Merchandise", x: 32, y: 42, color: "#8d99ae" },
    {
      id: "merchandise",
      label: "Merchandise",
      x: 65,
      y: 42.5,
      color: "#8d99ae",
    },
    { id: "locker", label: "Lockers", x: 24, y: 84, color: "#8d99ae" },
    { id: "locker", label: "Lockers", x: 30.4, y: 83, color: "#8d99ae" },
    { id: "bar", label: "Bar", x: 72, y: 31, color: "#8d99ae" },
    { id: "bar", label: "Bar", x: 81, y: 30, color: "#8d99ae" },
    { id: "bar", label: "Bar", x: 51, y: 43, color: "#8d99ae" },
    { id: "bar", label: "Bar", x: 12, y: 75, color: "#8d99ae" },
    { id: "toiletten", label: "Toiletten", x: 7.7, y: 80, color: "#8d99ae" },
    { id: "toiletten", label: "Toiletten", x: 93, y: 27, color: "#8d99ae" },
    { id: "toiletten", label: "Toiletten", x: 49, y: 30, color: "#8d99ae" },

    { id: "eten", label: "Food & Drinks", x: 12, y: 63, color: "#f4a261" },
    { id: "eten", label: "Food & Drinks", x: 35.4, y: 46, color: "#f4a261" },
    { id: "icecream", label: "Ice Cream", x: 39, y: 44, color: "#f4a261" },
    { id: "icecream", label: "Ice Cream", x: 62.4, y: 36, color: "#f4a261" },
    { id: "icecream", label: "Ice Cream", x: 84, y: 19, color: "#f4a261" },
    { id: "icecream", label: "Ice Cream", x: 27, y: 68.5, color: "#f4a261" },
  ];

  const SVG_W = 2330.58;
  const SVG_H = 1353.19;
  const MIN_SCALE = 0.2;
  const MAX_SCALE = 4;

  let scale = 2,
    panX = 0,
    panY = 0;
  let dragging = false,
    lastX = 0,
    lastY = 0;
  let pinchDist = null;
  let activePopup = null;
  let booted = false;

  // ── HELPERS ──────────────────────────────────────────────────
  function el(id) {
    return document.getElementById(id);
  }

  // Scale markers inversely to keep them visually readable, and optionally
  // enlarge them when zooming out.
  function updateMarkerSizes() {
    const wrapper = el("map-wrapper");
    if (!wrapper) return;
    const icons = wrapper.querySelectorAll(".map-marker-svg");

    icons.forEach((img) => {
      // Example behavior: when user zooms out (scale < 1), make markers bigger.
      // When zooming in, markers shrink a bit to avoid covering the map.
      const k = 1 / Math.max(scale, 0.01);
      let ns = Math.min(2.2, Math.max(0.65, k));

      // Make entrance marker bigger than the others.
      if (img.alt === "Ingang / Entrance") {
        ns = Math.min(100, ns * 1.85 + 1);
      }

      img.style.transform = `scale(${ns})`;
    });
  }

  function applyTransform() {
    // matrix(sx,0,0,sy,tx,ty) — transform-origin irrelevant
    el("map-canvas").style.transform =
      `matrix(${scale},0,0,${scale},${panX},${panY})`;

    // markers are inside the transformed canvas; counter-scale them to
    // remain consistent and grow on zoom-out.
    updateMarkerSizes();
  }

  function fitToScreen() {
    const w = el("map-wrapper");
    if (!w) return;
    const ww = w.clientWidth;
    const wh = w.clientHeight;
    if (!ww || !wh) return; // still hidden — skip
    scale = Math.min(ww / SVG_W, wh / SVG_H);
    panX = (ww - SVG_W * scale) / 2;
    panY = (wh - SVG_H * scale) / 2;
    applyTransform();
  }

  // Prevent a transform that can move the map completely out of view
  function safeResetTransform() {
    scale = 1;
    panX = 0;
    panY = 0;
    applyTransform();
  }

  function clamp() {
    const w = el("map-wrapper");
    if (!w) return;
    const ww = w.clientWidth;
    const wh = w.clientHeight;
    const mw = SVG_W * scale;
    const mh = SVG_H * scale;

    // Keep at least 80px of the map edge visible on screen
    const pad = 80;
    if (mw <= ww) {
      panX = (ww - mw) / 2; // center when smaller than viewport
    } else {
      panX = Math.min(panX, pad); // can't slide right past left edge
      panX = Math.max(panX, ww - mw - pad); // can't slide left past right edge — FIXED: was allowing -1940
    }
    if (mh <= wh) {
      panY = (wh - mh) / 2;
    } else {
      panY = Math.min(panY, pad);
      panY = Math.max(panY, wh - mh - pad);
    }
  }

  function zoom(factor, ox, oy) {
    const w = el("map-wrapper");
    if (!w) return;
    if (ox == null) ox = w.clientWidth / 2;
    if (oy == null) oy = w.clientHeight / 2;
    const ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
    if (ns === scale) return;
    panX = ox - (ox - panX) * (ns / scale);
    panY = oy - (oy - panY) * (ns / scale);
    scale = ns;
    clamp();
    applyTransform();
  }

  // ── MARKERS ──────────────────────────────────────────────────
  function markerSvgFor(m) {
    // Use the downloaded marker SVGs (in assets/images/map/)
    const MAP = {
      poton: "marker_stage1_ponton.svg",
      lake: "marker_stage2_the_lake.svg",
      club: "marker_stage3_the_club.svg",
      hanggar: "marker_stage4_hangar.svg",
      ingang: "marker_entrance_exit.svg",
      ehbo: "marker_first_aid.svg",
      eten: "marker_food.svg",
      icecream: "marker_ice_cream.svg",
      bar: "marker_bar.svg",
      locker: "marker_locker.svg",
      toiletten: "marker_toilet.svg",
      merchandise: "marker_merchandise.svg",
    };
    return MAP[m.id] || "marker_generic.svg";
  }

  function buildMarkers() {
    const canvas = el("map-canvas");

    // Show label only once per marker type (m.id).
    // This avoids duplicated “Toiletten”/“Food & Drinks” labels when multiple pins exist.
    const labelShown = new Set();

    MARKERS.forEach((m) => {
      const pin = document.createElement("div");
      pin.className = "map-marker";
      pin.dataset.id = m.id;
      pin.style.left = m.x + "%";
      pin.style.top = m.y + "%";

      const img = document.createElement("img");
      img.className = "map-marker-svg";
      img.src = `assets/images/map/${markerSvgFor(m)}`;
      img.alt = m.label;
      img.draggable = false;

      // const lbl = document.createElement("div");
      // lbl.className = "map-marker-label";

      // Only render label text for the first occurrence of that type.
      // (If you want “Toiletten” only once overall, keep ids identical for all toilet pins.)
      // if (!labelShown.has(m.id)) {
      //   lbl.textContent = m.label;
      //   labelShown.add(m.id);
      // } else {
      //   lbl.textContent = "";
      // }

      pin.appendChild(img);
      // pin.appendChild(lbl);

      pin.addEventListener("click", (e) => {
        e.stopPropagation();
        openPopup(m);
      });

      canvas.appendChild(pin);
    });

    canvas.addEventListener("click", closePopup);
  }

  function openPopup(m) {
    closePopup();
    const p = document.createElement("div");
    p.className = "map-popup";
    p.style.left = m.x + "%";
    p.style.top = m.y + "%";
    p.innerHTML = `
      <div class="map-popup-dot" style="background:${m.color}"></div>
      <strong>${m.label}</strong>
      <button class="map-popup-close">✕</button>`;
    p.querySelector(".map-popup-close").addEventListener("click", (e) => {
      e.stopPropagation();
      closePopup();
    });
    el("map-canvas").appendChild(p);
    activePopup = p;
  }

  function closePopup() {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
  }

  // ── MOUSE ────────────────────────────────────────────────────
  function onMouseDown(e) {
    if (e.button !== 0) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    el("map-wrapper").style.cursor = "grabbing";
  }
  function onMouseMove(e) {
    if (!dragging) return;
    panX += e.clientX - lastX;
    panY += e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    clamp();
    applyTransform();
  }
  function onMouseUp() {
    dragging = false;
    const w = el("map-wrapper");
    if (w) w.style.cursor = "grab";
  }
  function onWheel(e) {
    e.preventDefault();
    const r = el("map-wrapper").getBoundingClientRect();
    zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top);
  }

  // ── TOUCH ────────────────────────────────────────────────────
  function dist(t) {
    return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  }
  function mid(t) {
    return {
      x: (t[0].clientX + t[1].clientX) / 2,
      y: (t[0].clientY + t[1].clientY) / 2,
    };
  }
  function onTouchStart(e) {
    if (e.touches.length === 1) {
      dragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      pinchDist = null;
    } else if (e.touches.length === 2) {
      dragging = false;
      pinchDist = dist(e.touches);
    }
  }
  function onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1 && dragging) {
      panX += e.touches[0].clientX - lastX;
      panY += e.touches[0].clientY - lastY;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      clamp();
      applyTransform();
    } else if (e.touches.length === 2 && pinchDist) {
      const nd = dist(e.touches);
      const m = mid(e.touches);
      const r = el("map-wrapper").getBoundingClientRect();
      zoom(nd / pinchDist, m.x - r.left, m.y - r.top);
      pinchDist = nd;
    }
  }
  function onTouchEnd(e) {
    if (e.touches.length < 2) pinchDist = null;
    if (e.touches.length === 0) dragging = false;
  }

  // ── BOOT ─────────────────────────────────────────────────────
  function boot() {
    if (booted) return;
    const wrapper = el("map-wrapper");
    const canvas = el("map-canvas");
    const svg = el("map-svg");
    if (!wrapper || !canvas || !svg) return;
    booted = true;

    buildMarkers();

    wrapper.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    wrapper.addEventListener("wheel", onWheel, { passive: false });
    wrapper.addEventListener("touchstart", onTouchStart, { passive: false });
    wrapper.addEventListener("touchmove", onTouchMove, { passive: false });
    wrapper.addEventListener("touchend", onTouchEnd);

    el("map-zoom-in")?.addEventListener("click", () => zoom(1.3));
    el("map-zoom-out")?.addEventListener("click", () => zoom(1 / 1.3));
    el("map-reset")?.addEventListener("click", () => {
      safeResetTransform();
      fitToScreen();
    });

    // Wait two rAF ticks so the browser has painted and clientWidth is real
    function fitWhenVisible() {
      requestAnimationFrame(() => requestAnimationFrame(fitToScreen));
    }

    // 1. Hook the footer map button — fires before script.js shows the screen
    const mapBtn = document.querySelector('[data-target="map"]');
    if (mapBtn) {
      const btnEl = mapBtn.closest("button") || mapBtn;
      btnEl.addEventListener("click", fitWhenVisible);
    }

    // 2. MutationObserver as backup — script.js sets display:flex on the active screen
    const screen = document.querySelector('[data-screen="map"]');
    if (screen) {
      new MutationObserver(() => {
        if (wrapper.clientWidth) fitWhenVisible();
      }).observe(screen, { attributes: true, attributeFilter: ["style"] });
    }

    // 3. Map is already the active tab on load
    if (wrapper.clientWidth) fitToScreen();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
