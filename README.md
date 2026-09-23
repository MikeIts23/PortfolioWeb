# MikeB — Portfolio

Portfolio site for **MikeB** — producer, samplemaker and drummer from Torino.
Beat and loop catalog with an in-page player, genre filters, reels, and a direct
A&R contact route.

Implemented from the Claude Design prototype `MikeBeatzz.dc.html`.

## Stack

Plain HTML, CSS and vanilla JavaScript — no build step, no dependencies to
install. Open `index.html` and it runs.

Two libraries load from a CDN, both decorative and both optional: **three.js**
for the animated backdrop and **GSAP + ScrollTrigger** for the scroll reveals.
If either fails to load, the site still renders and works.

## Local preview

```bash
npx http-server -c-1 -p 8000
# → http://localhost:8000
```

Use a server that supports HTTP range requests, as `http-server` and GitHub
Pages do. Without them the browser cannot seek inside an audio file, so clicking
the progress bar jumps back to 0:00. `python3 -m http.server` does not support
range requests: fine for checking layout, not for testing the player.

## Layout

```
index.html                 markup for every section
assets/css/style.css       design tokens + all styles
assets/js/data.js          catalog content — edit this to add beats/loops
assets/js/main.js          player, filters, carousels, nav, form, reveals
assets/js/background.js    three.js backdrop
assets/img/                logo, portrait, reel covers
assets/audio/              beat and loop previews (see the README in there)
```

## Editing content

Everything the site says about the catalog lives in `assets/js/data.js`.

**Add a beat** — append a row to `BEATS`:

```js
['NEW BEAT', '140', 'C min', 'TRAP SOUL', ORANGE, 'trap-soul'],
```

Columns are title, BPM, key, display tag, chip color, genre slug. The genre slug
must match one of the filter buttons (`trap-soul`, `dark-trap`, `atmo-rnb`,
`rnb`, `drill`, `uk-garage`). Numbering, the mailto subject line, the audio path
and the "Beats 33" counter all derive from the list automatically.

**Loops** work the same way via `LOOPS`, with one extra column for
instrumentation.

Email and Instagram handle are the `EMAIL` and `INSTAGRAM` constants at the top
of the same file; they feed the contact section, the footer and every
"Request →" link.

## Audio

Previews are looked up at `assets/audio/<slug>.mp3` — see
[`assets/audio/README.md`](assets/audio/README.md) for the naming rule.

**Until those files exist the player streams royalty-free demo tracks**, carried
over from the prototype, so the interface can be demoed end to end. Once the
real previews are uploaded, set `DEMO_FALLBACK = false` in `assets/js/data.js`.

## Deploying to GitHub Pages

Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/`
(root). The site then serves from `https://<user>.github.io/PortfolioWeb/`.

All asset paths are relative, so it works from a subdirectory without changes.
For a custom domain, add a `CNAME` file at the repository root and update the
`og:image` and canonical URL in `index.html`.

## Accessibility and motion

Keyboard: `Tab` reaches every control, `Enter` plays the focused track, `Space`
toggles the current track, `←`/`→` seek, `Esc` closes the mobile drawer.

`prefers-reduced-motion` disables the marquees, the scroll reveals and the
three.js backdrop entirely.

## Known follow-ups

- `assets/img/me.jpg` is the original 4032×3024 camera file (~1.3 MB). Worth
  resizing to ~1600 px wide and converting to WebP for mobile load time.
- Reel tiles link to the Instagram profile, not to individual posts — the
  prototype had no per-reel URLs. Add a `url` field per reel when they exist.
- The contact form opens the visitor's mail client via `mailto:`. A hosted form
  endpoint would be more reliable for people on webmail.
