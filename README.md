# Lineo

Lineo is a free image editing and drawing app that runs in your web browser. It is made for
turning photos of paintings into clean outlines, and for editing and drawing on top of them.

> **Status:** Lineo is still in development. Things may change and some rough edges remain.

## Features

- **Outlines from photos of paintings** – trace the shapes of a painting as clean vector lines.
- **Local AI selection** – click an object and the AI (Segment Anything) selects it. The model
  runs in your browser, and the selection becomes an editable vector outline.
- **Pen tool** – draw and edit vector outlines point by point, with Bézier handles.
- **Layers** – raster and vector layers with visibility, locking, ordering and opacity.
- **Drawing tools** – brush, marker, eraser, fill, gradient and eyedropper.
- **Selections and transforms** – rectangle, lasso and magic wand selections,
  copy/cut/paste, transform and crop.
- **Adjustments and filters** – brightness/contrast, hue/saturation, levels, curves,
  black and white, invert, blur, sharpen and more.
- **Export** – PNG, JPG or SVG (vector outlines). Projects can be saved as `.lineo` files with all layers.
- **Installable app (PWA)** – works offline once installed, on desktop and mobile.

## Privacy

Everything happens in your browser. **Your images never leave your computer** – there is
no server and no upload. Only the AI library (from jsDelivr) and the AI model weights
(from Hugging Face) are downloaded the first time you use AI selection; after that they are
cached by the browser.

## Installation

There is nothing to build and no dependencies to install.

- **Quickest:** download or clone this repository and open `index.html` in a browser.
  The AI selection may not load this way in every browser; use a local server if it doesn't.
- **Local server:** in the project folder run `python3 -m http.server 8000` and open
  `http://localhost:8000`.
- **Host it yourself:** deploy the folder as a static site, for example on Netlify or
  GitHub Pages (no build command, publish the repository root).
- **Install as an app:** when Lineo is served over HTTPS or from localhost, use the install
  icon in the address bar (Chrome / Edge), or *Share → Add to Home Screen* in Safari on iPhone and iPad.

## Usage

The app's interface is currently in Finnish. Button names are shown below with an English translation.

1. Open an image with **Avaa kuva** (Open image, Ctrl+O), by dragging it onto the page, or by pasting (Ctrl+V).
2. Make outlines with the **Kynä** (Pen, P) tool by clicking points, or with **Tekoälyrajaus**
   (AI selection, W) by clicking an object. Press **Enter** to finish.
3. Draw, adjust and organise your work in layers using the toolbar and the side panel.
4. Save your work with **Tiedosto → Tallenna projekti** (File → Save project, Ctrl+S), or export it
   with **Vie** (Export, Ctrl+E) as PNG, JPG or SVG.

Press **?** in the app to see all keyboard shortcuts. A detailed user guide in Finnish is in
[OHJE.md](OHJE.md), and the development plan in [SUUNNITELMA.md](SUUNNITELMA.md).

## Project structure

```
index.html          app shell
css/app.css         app layout
js/app.js           user interface, layers, view, export
js/brush.js         brush, marker and eraser
js/select.js        selection math (masks, magic wand, borders)
js/filters.js       adjustments and filters
js/files.js         project file format and SVG export
js/edge-core.js     edge detection (runs in a Web Worker)
js/vector.js        mask → vector outline, Bézier path editing
js/sam.js           AI selection (Segment Anything via transformers.js)
shared/             shared theme and logo
manifest.json       PWA manifest
sw.js               service worker (offline cache)
icons/              app icons and their SVG sources
```

## License

[MIT](LICENSE) © 2026 kimmo-luo
