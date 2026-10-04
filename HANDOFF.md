# Handoff: what's left before this site goes live

Arham — Asaad rebuilt your portfolio site with Claude. The design is finished and it looks right on desktop and phone. What's left is mostly things only you can supply (your own words, a few facts) plus getting it deployed. This file lists all of it so you can finish it yourself with Claude.

**Fastest way to use this:** open the repo in Claude Code and say:

> Read HANDOFF.md and help me work through it from the top. Ask me for anything you need from me.

## Where things stand

- The new site lives on the `feat/redesign` branch. **None of it is committed yet** — it's all uncommitted changes in the working tree. `master` still has the old Jekyll site, which is what's live at arhamahmed.github.io.
- It's a Vite + React + TypeScript + Tailwind site. The old Jekyll files (`_config.yml`, `_layouts/`, `css/`, `Gemfile`…) are deleted on this branch.
- To run it: `npm install`, then `npm run dev` (opens on http://localhost:5174). `npm run build` type-checks and builds into `dist/`. `npm run lint` runs the linter.

## Where to edit things

Almost all of your content is in one file: **`src/config.ts`** — name, location, quote, links, every job, projects, articles, education. Change it there and the page updates.

| What | Where |
| --- | --- |
| All text content | `src/config.ts` |
| Page layout and section order | `src/App.tsx` |
| Header (photo, name, links, time/weather) | `src/components/Header.tsx`, `LocalInfo.tsx`, `WeatherIcon.tsx` |
| Experience map, plane, logo strip | `src/components/ExperienceMap.tsx` |
| Yellow train track down the left side | `src/components/Track.tsx` |
| Rows for Education / Articles / Projects | `src/components/Rows.tsx` |
| Logos | files in `public/logos/`, registered in `src/components/Logo.tsx` |
| Colours, fonts, animations | `src/index.css` |
| Your photo | `public/avatar.jpg` (copied from your GitHub profile picture) |

## Must do before it goes public

### 1. Set up deployment — pushing to `master` right now would break the live site

The old site was plain files that GitHub Pages served as-is. This one has to be built first, and no deploy step exists yet. If this branch were merged to `master` today, the live site would be a blank page.

What's needed: a GitHub Actions workflow that runs `npm ci` and `npm run build` on push to `master` and publishes `dist/` to GitHub Pages, plus switching the repo's Pages setting (Settings → Pages → Source) to "GitHub Actions". The site is served from the domain root, so no base-path change is needed in `vite.config.ts`.

### 2. Commit the work

Review the changes, then commit on `feat/redesign` and open a PR into `master` (after step 1 is in place).

### 3. Replace the placeholder under every job

Each job in the Experience section shows a line under the role that currently reads **"What did I do here?"** for all eight jobs. In `src/config.ts`, each entry in `experience` has a `summary` field — write one short line per job on what you built or owned. If you'd rather not have that line at all, ask Claude to remove it from `ExperienceMap.tsx`.

### 4. Fix the quote

Under your location in the header there's an italic quote: *"I'm going to finish what Einstein started."* That is Asaad's memory of your graduation quote, **not your actual wording**. It's the `quote` field in `src/config.ts` (there's a TODO comment on the line above). Put in the real one, or have Claude remove the quote.

### 5. Confirm the Amazon internship location

The Amazon entry in `src/config.ts` says Seattle and has a "TODO confirm office" note. If it was somewhere else, change `city`. If it was outside the Seattle area, also change `airport` to the nearest airport's code — the map groups jobs by airport, and a new airport needs its coordinates added to `AIRPORTS` in `src/components/geo.ts`.

### 6. Check the facts in `src/config.ts`

Everything in there was carried over from the old site and LinkedIn-style guesses. Worth a two-minute read: job titles, years, cities, the two article links, the six projects (three are marked `pinned` and show by default), degrees and years, and `updated: 'October 2026'` (shown in the footer — bump it when you edit).

## Worth doing

### 7. Analytics is gone

The old site had Google Analytics; the new one has no tracking. The old snippet used the retired "Universal Analytics" version, so it can't just be copied over. If you want visit stats, create a GA4 property and give Claude the measurement ID (looks like `G-XXXXXXX`), or pick another analytics tool.

### 8. Resume PDF

The header and footer link to `public/Arham_Ahmed_Resume.pdf`, which is the same file the old site had. Replace it if it's out of date (keep the filename, or update `links.resume` in the config).

### 9. Leftover files to delete

Not used by the site, safe to remove:

- `src/components/WindingPath.tsx` and `src/components/TransitMap.tsx` — earlier design experiments.
- `public/icons.svg` — came with the project template.
- `README.md` is still the default Vite template text. Replace it with a few lines about the site, or point it at this file.

### 10. The link-preview image only works once deployed

`public/og.png` is the card shown when the link is shared on LinkedIn or in messages (your photo, name, title). The tag in `index.html` points at `https://arhamahmed.github.io/og.png`, so it starts working after deploy. It was generated by hand, so if your title changes it needs regenerating — it does not update from the config.

## Things to know (not problems, just so you're not surprised)

- **The plane is the ✈️ emoji.** Emoji are drawn by each operating system, so it looks different on Windows and Android than on a Mac or iPhone, and on some systems it may fly at a slight angle. Swapping back to an icon is a small change in `ExperienceMap.tsx`.
- **Weather is live.** Clicking the time next to "Sunnyvale, CA" swaps to the current weather there. Each visitor's browser fetches it from Open-Meteo (free, no account or key). If the request fails, only the time shows. The location and timezone come from `coords` and `timezone` in the config — update both, plus `location`, if you move.
- **Logos are local files** in `public/logos/`, taken from each company's or school's own brand assets where one existed. Two caveats:
  - **Waterloo:** the shield is cropped out of the official logo, which their brand guidelines say not to do. Fine for a personal site, but you should know.
  - **Amazon and Innovasium:** these are the sites' own small icons (48px and 57px), so they may look slightly soft on very sharp screens. Innovasium's site no longer has a better mark.
  - Any company not listed in `src/components/Logo.tsx` falls back to Google's favicon service.
- **The map's land dots are a generated file** (`src/components/geo.ts`). The script that produced it is not in the repo. Adding a new city only needs a coordinate added to `AIRPORTS` in that file; changing the map's crop or zoom would mean regenerating it (Claude can rebuild the script — it samples Natural Earth land data on a grid).
- **The train track** on the left is hidden on screens narrower than 720px, because there's no margin to put it in.
- **Theme:** the site follows the visitor's system light/dark setting until they click the sun/moon button; after that their choice is remembered.
- **One font option is on site-wide:** Inter's single-storey "a" (set in `src/index.css`). It was a deliberate choice; remove the `font-feature-settings` line if you don't like it.
