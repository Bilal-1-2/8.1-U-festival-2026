// Auto-fill artist.photo paths (if empty) based on folder assets/images/acts/<Name>.png
// Usage: include this file BEFORE assets/js/script.js (or call applyInfoPhotos() from script.js).
(function () {
  function normalizeNameToFile(name) {
    if (!name) return null;
    // keep underscores/spaces exactly as in file names; only trim
    return String(name).trim();
  }

  function applyInfoPhotos() {
    // info.json is fetched in script.js, so this helper is unused by default.
    // Kept here in case you want to switch to a pre-processing approach.
  }

  window.applyInfoPhotos = applyInfoPhotos;
})();
