# ROS: Unbound — Coming Soon site

Single-page static teaser for **Rules of Survival: Unbound** (`https://github.com/Rennware/ROS-UNBOUND`).

## What's here

| File | Purpose |
|------|---------|
| `index.html` | Nav, hero (emblem + tagline), status stats, Discord CTA, legal footer |
| `css/styles.css` | Cobalt palette sampled from `ROSU.png`, dark theme, responsive |
| `js/main.js` | Nav scroll state, entrance reveals, hero logo parallax (desktop) |
| `assets/img/rosu.png` | Official mark (source: `../ROSU.png`) |
| `assets/favicon*` / `og-image.png` | Derived from the mark (emblem crop) |

## Palette (sampled from ROSU.png)

| Token | Hex | Source |
|-------|-----|--------|
| `--cobalt` | `#285090` | Wings + UNBOUND wordmark |
| `--cobalt-bright` | `#4068B0` | Highlight blues |
| `--cobalt-deep` | `#102858` | Wing shadow |
| `--steel` | `#98989A` | Emblem metal frame |
| `--bg` | `#0A0C10` | Near-black |

## Preview locally

Just open `index.html` in a browser (`file://` works), or:

```powershell
python -m http.server 8080 --directory .
# → http://localhost:8080
```

## Deploy to GitHub Pages

Repo: `https://github.com/Rennware/ROS-UNBOUND`

**Option A — publish from a branch folder (simplest):**
1. Push these `public/` contents to a `gh-pages` branch (root of that branch).
2. Repo → *Settings → Pages → Source*: `Deploy from a branch` → `gh-pages` / `/ (root)`.

**Option B — Actions workflow** (if you prefer main-branch pushes): add a Pages workflow that uploads this `public/` directory. Ask and one can be added.

**Option C — root publishing:** copy `public/*` to the repo root of a `site` branch if you want `<user>.github.io/ROS-UNBOUND/`.

Custom domain later: add a `CNAME` file in the published root.

## Legal

Footer includes the required disclaimer: fan preservation project, not affiliated with NetEase; original game © NetEase, Inc.; no redistribution of original assets. Keep this on every page.
