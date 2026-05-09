# Switch pages (Home/Info/Lineup/Map) — Step-by-step (Front-end only)

This project currently uses a **single `index.html`** and JavaScript/CSS to simulate navigation between screens.

## Goal

When you tap a footer button:

- the tapped button gets the `active` class (so it highlights)
- the matching screen inside `<main>` becomes visible

No PHP and no extra HTML files are required for this.

---

## Step 1: Prepare 4 screens in `index.html`

1. Open `index.html`.
2. Find this line:
   - `<main></main>`
3. Replace it with 4 containers (one per footer button) like this:

```html
<main>
  <section class="screen" data-screen="home">Home content goes here</section>
  <section class="screen" data-screen="info">Info content goes here</section>
  <section class="screen" data-screen="lineup">
    Lineup content goes here
  </section>
  <section class="screen" data-screen="map">Map content goes here</section>
</main>
```

### Notes

- `data-screen="home"` etc must match the values you will use in `data-target` on the footer buttons.
- Put your real HTML content inside each section.

---

## Step 2: Add `data-target` to each footer button in `index.html`

1. In `index.html`, find the footer buttons:
   - `<button class="footer-btns"> ... </button>`
2. Add `data-target` to each one:

Example (update all 4):

```html
<button class="footer-btns" data-target="home">...</button>
<button class="footer-btns" data-target="info">...</button>
<button class="footer-btns" data-target="lineup">...</button>
<button class="footer-btns" data-target="map">...</button>
```

### Important

- The value of `data-target` must match the section’s `data-screen`.

---

## Step 3: Ensure CSS hides non-active screens

1. Open `assets/css/style.css`.
2. Add this CSS (append anywhere):

```css
main .screen {
  display: none;
}
```

### Why

- JS will set one screen to `display: block` when it’s selected.

---

## Step 4: Use the existing JS logic (switch + active class)

1. Open `assets/js/script.js`.
2. Confirm it has the logic that:
   - selects `footer .footer-btns`
   - selects `main [data-screen]`
   - toggles `.active` on buttons
   - hides all screens and shows the one matching the button’s `data-target`

Your current setup is meant to do exactly that.

### One requirement

- This JS only works correctly after you add the `data-target` attributes on footer buttons and `data-screen` on the sections.

---

## Exactly how switching works (so you know what to expect)

1. Your footer buttons must have: `data-target="home"` / `"info"` / `"lineup"` / `"map"`.
2. Your screens inside `<main>` must have: `data-screen="home"` / `"info"` / `"lineup"` / `"map"`.
3. When you click a footer button, JavaScript:
   - removes `.active` from all footer buttons
   - adds `.active` to the clicked button
   - hides all `main [data-screen]` sections
   - shows only the section whose `data-screen` matches the clicked button’s `data-target`

So “switching” is done by **CSS `display: none/block`**, plus the `.active` class for styling.

---

## Step 5: Testing

1. Save all files.
2. Refresh the page.
3. Click each footer button.

You should see:

- Button highlight (via `.active`)
- Only one screen visible at a time

---

## When to use PHP later

Use PHP later only if you need:

- dynamic content from a database (MySQL)
- admin editing
- user login/accounts

If your screens are static festival UI, **keep it front-end**.

---

## Common mistakes

- **Forgetting `data-target`** on footer buttons → clicking won’t switch screens.
- **Forgetting `data-screen`** on sections → JS can’t find the screen.
- **Mismatched names** (`data-target="info"` but `data-screen="information"`) → screen won’t show.
- **Not hiding screens in CSS** → multiple sections may overlap.
