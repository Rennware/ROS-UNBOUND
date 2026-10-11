# ROS: Unbound — Command Deck site

Single-page static site for **Rules of Survival: Unbound** (`https://github.com/Rennware/ROS-UNBOUND`).
Live: `https://rennware.github.io/ROS-UNBOUND/`

## What's here

| File | Purpose |
|------|---------|
| `index.html` | Asymmetric hero + boot line, Pipeline meters, milestone Devlog, Intel cards, Target (modes/maps), Access panel (tester apply), FAQ, legal footer |
| `css/styles.css` | Chakra Petch + cobalt palette from the official marks, shark motifs (tooth cards, fin dividers), responsive |
| `js/devlog.js` | **Auto-generated** milestone feed — do not edit by hand |
| `js/main.js` | Scroll progress + swimming fin, boot typing, reveals, counters, devlog render/filter, accordions, magnetic buttons, scramble headings, emblem tilt, map glare |
| `assets/img/*` | User-supplied marks (emblem, wordmark) — ours, not NetEase assets |
| `assets/favicon*` / `og-image.png` | Derived from our emblem |

## Devlog feed

`js/devlog.js` is generated from `PROGRESS.md` (milestone entries only):

```powershell
# from notes/Website-Agent/
python tools/build-devlog.py
```

Re-run whenever new milestones land in `PROGRESS.md`. Entries carry `date / title / tag / done[]`
with `tag` ∈ `DECODE | SERVER | AUTH | CLIENT | LAUNCHER`.

## Palette (sampled from the official marks)

| Token | Hex |
|-------|-----|
| `--cobalt` | `#385090` |
| `--cobalt-bright` | `#4A6AB8` |
| `--cobalt-accent` | `#5B82D6` |
| `--cobalt-deep` | `#203868` |
| `--steel` | `#98989A` |
| `--bg` | `#0A0C10` |

## Preview locally

```powershell
python -m http.server 8080 --directory .
# → http://localhost:8080  (or just open index.html via file://)
```

## Deploy

Site files live at the **repo root** (`main` branch) — GitHub Pages publishes automatically.
Copy from `notes/Website-Agent/public/` → repo root, commit, push `main`.

## Legal

Footer disclaimer on every page: fan preservation project, not affiliated with NetEase;
original game © NetEase, Inc.; no redistribution of original assets. Keep it on every page.
