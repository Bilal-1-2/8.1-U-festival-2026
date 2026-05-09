# 8.1-U-festival-2026

## Projectbeschrijving

**U Festival 2026** is een Progressive Web App (PWA) voor een festival die bezoekers een complete mobiele ervaring biedt. De app richt zich op het benutten van moderne smartphone-mogelijkheden om het festivalbezoek te verrijken, van navigatie en programmering tot informatie en interactie.

---

## Functionaliteiten

### Kernfuncties

- **Geen login vereist**: De app kan direct worden gebruikt zonder aanmelden of inloggen.
- **PWA via QR-code**: Bezoekers kunnen de app installeren op hun device door een QR-code te scannen.
- **Responsive design**: Werkt optimaal op mobiele telefoons met verschillende afmetingen en schermverhoudingen.
- **Tweetalig**: Ondersteunt Nederlands en Engels. De taal kan op elk moment worden gewijzigd via een vlaggetje dat altijd zichtbaar is.
- **Light- / Darkmode**: Een schakelaar om te wisselen tussen licht en donker thema.
- **Festivalinformatie**: Algemene informatie over het festival, beschikbaar via een accordion-element.
- **Interactieve kaart**: Een kaart van het festivalterrein inclusief eigen locatie via GPS.
- **Interactief blokschema**: Een overzichtelijk schedule van het festivalprogramma.
- **Makkelijk uitbreidbaar**: Line-up, programmering, floorplan en algemene informatie kunnen in de toekomst eenvoudig worden aangepast of uitgebreid.

### Nice to have

- **Interactie met locaties en bezoekers**: Mogelijkheid om te interacteren met locaties op het festivalterrein en andere festivalgangers. _(Nog niet definitief bepaald; indien tijd over is, kan hier aan worden gewerkt.)_

---

## Technologieën & Talen

### Frontend

| Taal / Framework      | Toepassing                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React.js**          | Bouwen van een dynamische, component-gebaseerde gebruikersinterface. React maakt het eenvoudig om herbruikbare UI-componenten te maken zoals het schedule, de kaart en nieuwsblokjes. |
| **HTML5**             | Structuur en semantiek van de webpagina's, inclusief ondersteuning voor nieuwe formuliertypes en media-elementen.                                                                     |
| **CSS3**              | Styling, lay-out, responsief ontwerp en animaties voor een vloeiende gebruikerservaring op elk schermformaat.                                                                         |
| **JavaScript (ES6+)** | Interactiviteit, API-aanroepen, manipulatie van de DOM en logica voor telefoonfuncties zoals camera en GPS.                                                                           |
| **Anime.js**          | Bibliotheek voor beweging en animatie bij schermwisselingen en interactie.                                                                                                            |

### Backend

| Taal / Framework | Toepassing                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js**      | Server-side runtime om een snelle, schaalbare backend te draaien. Node.js is ideaal voor real-time applicaties zoals live updates tijdens het festival. |
| **MySQL**        | Relationele database voor het opslaan van gebruikersgegevens, programma's, favoriete artiesten, reviews en locatiegegevens.                             |

### PWA & Tools

- **Progressive Web App (PWA)**: De app wordt als PWA opgezet, zodat deze geïnstalleerd kan worden via een QR-code en offline functionaliteit biedt.
- **Service Worker**: Voor caching en offline ondersteuning.
- **Web App Manifest**: Voor installatie op het homescreen en native app-ervaring.

---

## Telefoonfuncties & Integratie

De app maakt optimaal gebruik van de hardware-mogelijkheden van smartphones om het festivalbezoek interactief en persoonlijk te maken.

### 📷 Camera

- **QR-code scanner**: Snel de app installeren of toegangskaarten en vouchers scannen bij de ingang.
- **Festival-momenten**: Direct foto's maken van optredens en deze eventueel delen.

### 📍 GPS (Locatiebepaling)

- **Festivalkaart**: Real-time navigatie over het festivalterrein met je huidige locatie.
- **Podium-navigatie**: Routebeschrijving naar verschillende podia, eetkraampjes en voorzieningen.
- **Vrienden zoeken (nice to have)**: Bekijk waar je vrienden zich bevinden op het terrein (indien ingeschakeld).

### 📱 Touchscreen & Gebarenherkenning

- **Touch-bediening**: Volledig geoptimaliseerd voor touchscreens — swipen door het programma, tikken om artiesten aan favorieten toe te voegen, en sleepgebaren op de kaart.
- **Gebarenherkenning (Gesture Recognition)**:
  - **Swipe links/rechts**: Navigeren tussen tabbladen (Home, Info, Schedule, Map).
  - **Pinch-to-zoom**: In- en uitzoomen op de festivalkaart.
  - **Tik & Houd vast**: Snel voorvertoningen van artiesten of locaties bekijken.
  - **Shake**: Schudden met je telefoon om een willekeurige artiest uit het programma te ontdekken.

---

## Design Guidelines

### Logo

De app gebruikt zowel de zwarte als witte variant van het festivallogo, beschikbaar in **PNG** en **SVG**.

- `logo_black.svg` / `logoBlack.png`
- `logo_white.svg` / `logoWhite.png`

### Typografie

| Element                    | Stijl                      |
| -------------------------- | -------------------------- |
| Kopteksten                 | Sansation Bold 700         |
| Leesteksten                | Sansation Regular 400      |
| Knoppen en overige teksten | Sansation Light 300 Italic |

> Alle teksten moeten goed leesbaar zijn op een mobiel device.

### Kleurenpalet

| Rol           | Kleur     | Hex       | Toepassing                             |
| ------------- | --------- | --------- | -------------------------------------- |
| **Accent**    | Vermilion | `#F03228` | Knoppen en interactieve onderdelen     |
| **Base**      | White     | `#FFFFFF` | Leesteksten of achtergrond (lightmode) |
| **Primary**   | Black     | `#000000` | Leesteksten of achtergrond (darkmode)  |
| **Secondary** | Cerulean  | `#247BA0` | Kopteksten                             |
| **Info**      | Saffron   | `#E3B505` | Informatie of waarschuwingen           |

### Vormentaal en vormgeving

- **Stijl**: Eenvoudig en minimalistisch.
- **Knoppen en interactieve elementen**: Minimaal, maar zichtbaar afgerond.
- **Consistentie**: De vormgeving is consistent en sober door de hele app heen.

### Icons

Voor icons wordt gebruik gemaakt van [Google Fonts Icons](https://fonts.google.com/icons).

### Motion / Animation

Waar mogelijk wordt gebruik gemaakt van beweging en animatie bij:

- Schermwisselingen
- Interactie met elementen
- Overgangen tussen light- en darkmode

---

## Schermen & Navigatie

De app bestaat uit **4 hoofdschermen**, bereikbaar via de onderste navigatiebalk:

| Scherm       | Beschrijving                                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Home**     | Meldingen en nieuws over het festival tijdens het evenement. Weergegeven als blokjes onder elkaar. _(Inhoud nog niet definitief.)_ |
| **Info**     | Algemene festivalinformatie, weergegeven in een accordion-element.                                                                 |
| **Schedule** | Interactief blokschema van het festivalprogramma.                                                                                  |
| **Map**      | Interactieve kaart van het festivalterrein inclusief GPS-locatie.                                                                  |

### Taalwissel & Thema

- Een **vlaggetje** is altijd zichtbaar om de taal (NL/EN) te wisselen.
- Een **light-/darkmode switch** maakt het mogelijk om van thema te veranderen.

---

## Content & Data

De volgende content is beschikbaar en moet eenvoudig aanpasbaar blijven:

- **[Festival informatie](https://www.notion.so/Festival-informatie-eb469bb8092d83ebbc7901db5a333560?pvs=21)**
- **[Line-up en programmering](https://www.notion.so/Line-up-en-programmering-a9e69bb8092d826db3e68179e6bc926e?pvs=21)**
- **[Floorplan](https://www.notion.so/Floorplan-35169bb8092d820086b781077d271847?pvs=21)**
- **[Acts](https://www.notion.so/Acts-d3d69bb8092d82bd88b501c361c6ede2?pvs=21)**
- **[Assets](https://www.notion.so/Assets-73c69bb8092d83dbb2ef81a952edca88?pvs=21)**

> **Let op:** Op dit moment zijn de line-up, programmering en het floorplan nog niet definitief. Het is belangrijk dat deze in de toekomst eenvoudig kunnen worden aangepast of uitgebreid.

---

## Projectstructuur

```
8.1-U-festival-2026/
├── index.html              # Hoofdpagina van de applicatie
├── README.md               # Projectdocumentatie
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── assets/
│   ├── css/
│   │   └── style.css       # Globale styling en thema's
│   ├── js/
│   │   └── script.js       # Frontend JavaScript logica
│   └── images/
│       ├── light-mode.png
│       ├── night-mode.png
│       └── logo/
│           ├── logo_black.svg
│           └── logo_white.svg
└── test/
    ├── index.html          # Test/testomgeving
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    └── images/
        └── logo/
            ├── logo_black.svg
            └── logo_white.svg
```

---

## Installatie & Opstarten

1. Clone of plaats het project in je lokale webserver-map (bijv. `c:/xampp-4/htdocs/`).
2. Zorg dat je **Node.js** en **MySQL** geïnstalleerd hebt voor de backend-functionaliteiten.
3. Open `index.html` in je browser of start een lokale server om de app te bekijken.
4. Scan de QR-code met je telefoon om de PWA te installeren.

---

## Nuttige Bronnen & Suggesties

- [How to build PWAs using Laravel](https://dev.to/aaronreddix/how-to-build-progressive-web-apps-pwas-using-laravel-1f6o)
- [Create React App — Making a Progressive Web App](https://create-react-app.dev/docs/making-a-progressive-web-app/)
- [Onsen UI PWA Guide](https://onsen.io/v2/guide/pwa/intro.html)
- [Create PWA with Vue 3 + Vite](https://alexop.dev/posts/create-pwa-vue3-vite-4-steps/)
- [Anime.js](https://animejs.com/)
- [Google Fonts — Sansation](https://fonts.google.com/specimen/Sansation)
- [Google Fonts Icons](https://fonts.google.com/icons)
- [Bootstrap Accordion](https://getbootstrap.com/docs/5.0/components/accordion/)

---

## Ontwikkeld voor

Eindproject / assessment 8.1 — U Festival 2026
