# What I changed: Footer click switches screens (no PHP)

This update makes your footer buttons actually switch the visible content inside `index.html`.

## What you had before

- `assets/js/script.js` only toggled the `active` class on footer buttons.
- Your `<main>` screens existed, but they were not shown/hidden by JavaScript.

## What I changed now

### 1) Updated `assets/js/script.js`

On `DOMContentLoaded`, the script:

- finds footer buttons and screens
- on click: removes `.active` from all buttons, adds `.active` to the clicked one, then hides all screens and shows the matching screen

Key robustness fix: in your HTML the `data-target` attribute is on the **img** inside the button (not always on the `<button>` itself). The updated JS reads `data-target` from either the button or its child element, so switching works reliably.

1. Finds all footer buttons: `footer .footer-btns`
2. Finds all screens: `main .screen[data-screen]`
3. On click:
   - removes `active` from all buttons
   - adds `active` to the clicked one
   - hides all screens (`display: none`)
   - shows the matching screen (`display: block`) using `data-target` → `data-screen`
4. Initializes to **Home** on page load.

### Example line of code used (the core switching logic)

```js
const el = document.querySelector(`main .screen[data-screen="${id}"]`);
```

Another example line that hides all screens:

```js
s.style.display = "none";
```

### Full example of how the mapping works

- Footer button has: `data-target="info"`
- Screen section has: `data-screen="info"`
- JS reads the button’s `data-target` and shows the matching screen.

## Required markup (already added in your `index.html` for the demo)

Each footer button should contain:

```html
<button class="footer-btns" data-target="info">...</button>
```

Each screen should contain:

```html
<section class="screen" data-screen="info">...</section>
```

## Testing

1. Refresh the page.
2. Click **Home / Info / Lineup / Map**.
3. You should see:
   - the button highlights (`.active`)
   - only the matching `<p>Hi (...)</p>` is visible

## Why no PHP

Because this switching is purely UI state (front-end). PHP is only useful if you need server-side data (MySQL, authentication, admin content, etc.).
