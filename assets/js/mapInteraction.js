// ═══════════════════════════════════════════════
//  MAP INTERACTION — pan, pinch-zoom, markers
// ═══════════════════════════════════════════════
(function () {

  // ── MARKER DATA ─────────────────────────────────────────────
  // x/y are percentages of the SVG viewBox (2330.58 × 1353.19)
  // Adjust these to match real locations on your map.
  const MARKERS = [
    { id: "poton",      label: "Poton Stage",          x: 28,  y: 38,  color: "#e63946" },
    { id: "club",       label: "Club Stage",            x: 55,  y: 52,  color: "#457b9d" },
    { id: "lake",       label: "Lake Stage",            x: 72,  y: 30,  color: "#2a9d8f" },
    { id: "hanggar",    label: "Hanggar Stage",         x: 42,  y: 65,  color: "#e9c46a" },
    { id: "ingang",     label: "Ingang / Entrance",     x: 18,  y: 80,  color: "#6a4c93" },
    { id: "ehbo",       label: "EHBO / First Aid",      x: 35,  y: 20,  color: "#ffffff" },
    { id: "toiletten",  label: "Toiletten",             x: 60,  y: 70,  color: "#8d99ae" },
    { id: "eten",       label: "Food & Drinks",         x: 48,  y: 45,  color: "#f4a261" },
    { id: "fiets",      label: "Fietsenstalling",       x: 15,  y: 60,  color: "#52b788" },
  ];

  // ── STATE ────────────────────────────────────────────────────
  const SVG_W = 2330.58;
  const SVG_H = 1353.19;
  const MIN_SCALE = 0.3;
  const MAX_SCALE = 4;

  let scale    = 1;
  let panX     = 0;
  let panY     = 0;
  let isDragging = false;
  let lastMX   = 0, lastMY = 0;
  let pinchDist = null;
  let activePopup = null;

  // ── INIT ─────────────────────────────────────────────────────
  function init() {
    const wrapper = document.getElementById("map-wrapper");
    const canvas  = document.getElementById("map-canvas");
    const svg     = document.getElementById("map-svg");
    if (!wrapper || !canvas || !svg) return;

    buildMarkers(canvas, svg);
    fitToScreen(wrapper, canvas);

    // ── MOUSE EVENTS ──
    wrapper.addEventListener("mousedown",  onMouseDown);
    window.addEventListener("mousemove",   onMouseMove);
    window.addEventListener("mouseup",     onMouseUp);
    wrapper.addEventListener("wheel",      onWheel, { passive: false });

    // ── TOUCH EVENTS ──
    wrapper.addEventListener("touchstart", onTouchStart, { passive: false });
    wrapper.addEventListener("touchmove",  onTouchMove,  { passive: false });
    wrapper.addEventListener("touchend",   onTouchEnd);

    // ── CONTROL BUTTONS ──
    document.getElementById("map-zoom-in")?.addEventListener("click",  () => zoom(1.3));
    document.getElementById("map-zoom-out")?.addEventListener("click", () => zoom(1 / 1.3));
    document.getElementById("map-reset")?.addEventListener("click",    () => fitToScreen(wrapper, canvas));
  }

  // ── BUILD MARKERS ─────────────────────────────────────────────
  function buildMarkers(canvas, svg) {
    MARKERS.forEach((m) => {
      const pin = document.createElement("div");
      pin.className = "map-marker";
      pin.dataset.id = m.id;
      pin.title = m.label;

      // position as % of SVG canvas
      pin.style.left  = m.x + "%";
      pin.style.top   = m.y + "%";

      // colored dot
      const dot = document.createElement("div");
      dot.className = "map-marker-dot";
      dot.style.background = m.color;
      dot.style.borderColor = shadeColor(m.color, -30);

      // label bubble
      const lbl = document.createElement("div");
      lbl.className = "map-marker-label";
      lbl.textContent = m.label;

      pin.appendChild(dot);
      pin.appendChild(lbl);

      pin.addEventListener("click", (e) => {
        e.stopPropagation();
        openPopup(m, pin);
      });

      canvas.appendChild(pin);
    });

    // close popup on canvas click
    canvas.addEventListener("click", closePopup);
  }

  function openPopup(m, pin) {
    closePopup();
    const popup = document.createElement("div");
    popup.className = "map-popup";
    popup.innerHTML = `
      <button class="map-popup-close">✕</button>
      <div class="map-popup-dot" style="background:${m.color}"></div>
      <strong>${m.label}</strong>
    `;
    popup.querySelector(".map-popup-close").addEventListener("click", (e) => {
      e.stopPropagation();
      closePopup();
    });

    // position popup above the pin
    popup.style.left = m.x + "%";
    popup.style.top  = m.y + "%";

    document.getElementById("map-canvas").appendChild(popup);
    activePopup = popup;
  }

  function closePopup() {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
  }

  // ── FIT TO SCREEN ─────────────────────────────────────────────
  function fitToScreen(wrapper, canvas) {
    const ww = wrapper.clientWidth  || window.innerWidth;
    const wh = wrapper.clientHeight || (window.innerHeight - 120); // header+footer
    scale = Math.min(ww / SVG_W, wh / SVG_H, 1);
    panX  = (ww - SVG_W * scale) / 2;
    panY  = (wh - SVG_H * scale) / 2;
    applyTransform(canvas);
  }

  // ── TRANSFORM ────────────────────────────────────────────────
  function applyTransform(canvas) {
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  function clampPan(wrapper, canvas) {
    // allow panning so the map can't fully leave the viewport
    const ww = wrapper.clientWidth;
    const wh = wrapper.clientHeight;
    const mw = SVG_W * scale;
    const mh = SVG_H * scale;
    const marginX = Math.min(ww * 0.8, mw * 0.8);
    const marginY = Math.min(wh * 0.8, mh * 0.8);
    panX = Math.min(panX,  marginX);
    panX = Math.max(panX,  ww - mw - marginX + mw);
    panY = Math.min(panY,  marginY);
    panY = Math.max(panY,  wh - mh - marginY + mh);
  }

  function zoom(factor, originX, originY) {
    const wrapper = document.getElementById("map-wrapper");
    const canvas  = document.getElementById("map-canvas");
    if (!wrapper || !canvas) return;

    const ww = wrapper.clientWidth;
    const wh = wrapper.clientHeight;
    const ox = originX ?? ww / 2;
    const oy = originY ?? wh / 2;

    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
    if (newScale === scale) return;

    // zoom toward origin
    panX = ox - (ox - panX) * (newScale / scale);
    panY = oy - (oy - panY) * (newScale / scale);
    scale = newScale;

    clampPan(wrapper, canvas);
    applyTransform(canvas);
  }

  // ── MOUSE ─────────────────────────────────────────────────────
  function onMouseDown(e) {
    if (e.button !== 0) return;
    isDragging = true;
    lastMX = e.clientX;
    lastMY = e.clientY;
    document.getElementById("map-wrapper").style.cursor = "grabbing";
  }
  function onMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - lastMX;
    const dy = e.clientY - lastMY;
    panX += dx;
    panY += dy;
    lastMX = e.clientX;
    lastMY = e.clientY;
    const wrapper = document.getElementById("map-wrapper");
    const canvas  = document.getElementById("map-canvas");
    clampPan(wrapper, canvas);
    applyTransform(canvas);
  }
  function onMouseUp() {
    isDragging = false;
    const w = document.getElementById("map-wrapper");
    if (w) w.style.cursor = "grab";
  }
  function onWheel(e) {
    e.preventDefault();
    const rect = document.getElementById("map-wrapper").getBoundingClientRect();
    const ox = e.clientX - rect.left;
    const oy = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    zoom(factor, ox, oy);
  }

  // ── TOUCH ──────────────────────────────────────────────────────
  function getTouchDist(t) {
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.hypot(dx, dy);
  }
  function getTouchMid(t) {
    return {
      x: (t[0].clientX + t[1].clientX) / 2,
      y: (t[0].clientY + t[1].clientY) / 2,
    };
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      lastMX = e.touches[0].clientX;
      lastMY = e.touches[0].clientY;
      pinchDist = null;
    } else if (e.touches.length === 2) {
      isDragging = false;
      pinchDist = getTouchDist(e.touches);
    }
  }
  function onTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - lastMX;
      const dy = e.touches[0].clientY - lastMY;
      panX += dx;
      panY += dy;
      lastMX = e.touches[0].clientX;
      lastMY = e.touches[0].clientY;
      const wrapper = document.getElementById("map-wrapper");
      const canvas  = document.getElementById("map-canvas");
      clampPan(wrapper, canvas);
      applyTransform(canvas);
    } else if (e.touches.length === 2 && pinchDist !== null) {
      const newDist = getTouchDist(e.touches);
      const factor  = newDist / pinchDist;
      pinchDist = newDist;
      const mid  = getTouchMid(e.touches);
      const rect = document.getElementById("map-wrapper").getBoundingClientRect();
      zoom(factor, mid.x - rect.left, mid.y - rect.top);
    }
  }
  function onTouchEnd(e) {
    if (e.touches.length < 2) pinchDist = null;
    if (e.touches.length === 0) isDragging = false;
  }

  // ── UTIL ───────────────────────────────────────────────────────
  function shadeColor(hex, pct) {
    // lighten/darken a hex colour
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    if (isNaN(r)) return hex;
    r = Math.max(0, Math.min(255, r + pct));
    g = Math.max(0, Math.min(255, g + pct));
    b = Math.max(0, Math.min(255, b + pct));
    return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
  }

  // ── BOOT ───────────────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // re-fit when the map screen becomes visible
  const mapScreen = document.querySelector('[data-screen="map"]');
  if (mapScreen) {
    const observer = new MutationObserver(() => {
      const wrapper = document.getElementById("map-wrapper");
      const canvas  = document.getElementById("map-canvas");
      if (wrapper && canvas && mapScreen.style.display !== "none") {
        fitToScreen(wrapper, canvas);
      }
    });
    observer.observe(mapScreen, { attributes: true, attributeFilter: ["style"] });
  }

})();
