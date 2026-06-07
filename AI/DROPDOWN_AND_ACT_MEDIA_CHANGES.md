# Act photos were implemented



### What changed



## 1) Add act photos without manually editing every `info.json` entry

### Current situation

- Many entries in **`info.json`** had `artist.photo: ""`.
- Photo files already existed in **`assets/images/acts/`**.

### What changed

- **`assets/js/script.js`** (`openActSheet`):
  - After setting the base artist fields, if `ar.photo` is empty:
    - map the act `name` to an existing file in `assets/images/acts/*.png`
    - set `actArtistPhoto` to an `<img>` using that path

Example mapping used:

- `Armin van Buuren` → `assets/images/acts/Armin_van_Buuren.png`
- `Kensington` → `assets/images/acts/Kensington,.png`
- `Chef'Special` → `assets/images/acts/Chef_Special.png`

### Result

- Photos appear automatically when the act `name` matches one of the mapped names.
- No need to update `info.json` for every act.

## Files touched

- `index.html`
- `assets/js/infoDropdown.js`
- `assets/css/info.css`
- `assets/js/script.js`

## Notes / gotchas

- The photo fallback uses a name→filename mapping. If you add new acts or rename acts/files, update the mapping in `openActSheet` accordingly.
