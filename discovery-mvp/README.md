# Pawzz — Animal-Care Discovery MVP

A mobile-first prototype of the discovery platform described in `01 — Animal-Care Discovery MVP.md`, built with the shared foundations from `00 — Overview & Shared Foundations.md`.

A pet owner can search for care, use an emergency fast-lane, filter results, compare trust signals, open a provider profile, call or WhatsApp directly, shortlist providers on the device, list a business, and submit a correction — without an account.

The prototype has two clearly separated data modes, switchable from the top banner:

- **OSM live (default):** real providers fetched from OpenStreetMap, with honest source, last-edited and missing-data states.
- **Sample demo:** 16 fictional providers that exercise every acceptance criterion in Doc 01 — all six categories, verification badges, phones, 24x7 emergency results and full filters.

Sample records are always labelled fictional. OSM records are always labelled with source and attribution. The two datasets never mix.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check and production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Domain, hours, URL-state and form tests (Vitest) |
| `npm run smoke` | Browser smoke checks for both data modes against a running dev server (Playwright) |
| `npm run fetch:osm` | Refresh the checked-in OpenStreetMap snapshot |
| `npm run a11y` | axe-core WCAG A/AA scan against a running dev server |

`npm run smoke` and `npm run a11y` expect `http://localhost:5173` to be running. If Playwright browsers are not installed, run `npx playwright install chromium` first.

## Screens and routes

| Route | Purpose |
| --- | --- |
| `/` | Emergency strip, hero search, six categories, popular needs, featured providers, trust/source explainer, provider CTA, corrections |
| `/results?…` | Search, count, sort, filters, applied chips, list/map, shortlist, skeleton and empty states |
| `/provider/:id` | Profile, sticky mobile Call/WhatsApp/Directions bar, services, species, hours, map, type-specific details, correction and claim prompts |
| `/list-business` | New listing and claim form (`?mode=claim&provider=:id`) |
| `/correction` | Four-field correction form (`?provider=:id`) |
| `/styleguide` | Coded design system: tokens, type, components, states |
| `*` | Friendly not-found page |

Search state is encoded in the URL (`q`, `location`, `type`, `species`, `open`, `x24`, `dist`, `verified`, `home`, `lang`, `services`, `sort`, `emergency`), so results are shareable and back/forward works.

## Architecture

```text
src/
  app/                  router layout, scroll restoration
  components/
    layout/             header, footer
    ui/                 buttons, chips, cards, badges, fields, sheet, toggle, sticky bar
    provider/           provider card, illustrative photo, species icons
    forms/              form shell, success state, consent, demo note
  features/
    home/               homepage sections
    results/            filter panel, lazy Leaflet map
  data/                 provider types, 16 sample records, OSM snapshot + data-source context
  lib/                  search/filter/sort, geo/distance, OSM adapter/cache, form submission
  hooks/                shortlist (localStorage), live clock
  pages/                route screens
  styles                design tokens in src/index.css (Tailwind v4 @theme)
```

### Product logic

- **Emergency fast-lane** = `emergency=1`, which returns only providers that are `24x7` and open at the current Asia/Kolkata time.
- **Open now** is computed from per-weekday hours, supports overnight ranges, and refreshes every minute.
- **Distance** is measured from the resolved search area (or Kochi by default) using the haversine formula. "Use my location" uses the browser geolocation API and snaps to the nearest demo city.
- **Verification** is three-level: unverified, phone-verified, visited. Every card and profile shows the level and the last-verified date, and every profile links to a correction form.
- **Shortlist** is device-only (`localStorage`) and survives reloads, with no account.
- **Data modes** live in `src/data/DataSourceContext.tsx`. The choice is persisted in `localStorage` and can be changed from the banner at any time.
- **OSM data** is mapped in `src/lib/osm.ts`. Unknown hours stay unknown (`isOpenAt` returns `null`) instead of being shown as closed. Missing phone numbers, verification, species and services are never invented.
- **Snapshot + live refresh:** the app ships `src/data/osm-snapshot.json` so live mode works instantly and offline. The banner’s Refresh button queries Overpass in the browser and caches the result for 24 hours; on failure the last snapshot stays in place.
- **OSM-friendly search:** because OSM rarely tags services, terms such as “vaccination”, “boarding”, “lab” or “ambulance” map to the relevant provider category, and empty live searches offer “Search all areas” and the sample demo.

### Forms and the Google Sheet path

Both forms validate inline and show a reference and success state. Submission behaviour is controlled by one environment variable:

```bash
cp .env.example .env
# VITE_FORMS_ENDPOINT=https://script.google.com/macros/s/…/exec
```

- **Endpoint set:** the form POSTs JSON `{ reference, kind, submittedAt, ...fields }`.
- **Endpoint unset:** the submission is stored in `localStorage` under `pawzz.submissions.v1` and the success state clearly says it is saved in the demo browser only.

A Google Apps Script web app can accept the POST and append a row to a Sheet; the payload shape is stable, so no front-end changes are needed when wiring it up.

### OpenStreetMap data

- Source: `© OpenStreetMap contributors`, licensed under [ODbL](https://www.openstreetmap.org/copyright). Attribution is shown in the banner, on every OSM profile, on the map and in the footer.
- Snapshot date and coverage are visible in the banner. Re-run `npm run fetch:osm` to refresh the checked-in snapshot.
- Query: `nwr` for `amenity=veterinary`, `amenity=animal_boarding`, `amenity=animal_shelter`, veterinary hospitals/labs and `emergency=animal_ambulance`, with `out meta center`.
- Runtime fetch order: `maps.mail.ru` → `overpass.private.coffee` → `overpass-api.de`, 40-second timeout per endpoint, both cities in parallel. Requests are cached and never run on every keystroke.
- Real OSM coverage at snapshot time: ~103 mapped providers around Kochi and Bengaluru. Only 5 have phone tags, ~10 have opening-hours tags, and boarding/ambulance/lab coverage is sparse. The UI states this rather than filling gaps with sample data.
- Sample mode remains the complete demonstration of the Doc 01 acceptance checklist.

### Missing phones and opening hours

OSM simply does not publish most clinic phone numbers or hours. No free, keyless source mirrors that data. The prototype handles this in three ways:

1. **Never invent contact details.** Cards and profiles show “Phone not listed” and “Hours not listed” instead of fake replacements.
2. **Contact overlay.** `src/data/osm-contact-overlay.json` lets you add verified phone/hours/website details for specific OSM listings without a backend. Key entries by provider id (`osm-node-…` / `osm-way-…`):

```json
{
  "entries": {
    "osm-node-8084286408": {
      "phone": "+91 484 000 0000",
      "openingHours": "Mo-Sa 09:00-18:00",
      "sourceName": "Clinic website",
      "sourceUrl": "https://example.org/clinic",
      "checkedOn": "2026-11-10"
    }
  }
}
```

The overlay is displayed with its source and checked date and never changes the listing’s OSM source. Add only details you have genuinely verified.

3. **Corrections and OSM edits.** Every OSM profile has an “Add missing details” CTA that opens the correction form with “Missing phone or hours” preselected, plus a link to the source element on OSM. These submissions go to the same moderation queue.

For broader coverage, the clean upgrade is Place Details (New) from the Google Places API, which returns phone numbers and opening hours. It requires an API key and billing, plus Google attribution/terms compliance; it is not wired in because there is no key in this project. A one-time enrichment script could merge Google Place IDs and contact fields into the overlay.

## Design system

Tokens from Doc 00 live in `src/index.css` as Tailwind v4 theme values and CSS custom properties: teal family, amber conversion accent, cream surface, 20 px cards, 12 px inputs, pill chips, 44 px tap targets, Plus Jakarta Sans body and Fraunces display (animal-care only).

One deliberate adjustment: the emergency red was darkened from `#D64545` to `#C23A3A` so white text on red meets WCAG AA at normal sizes. It is still reserved for emergency use only.

## Quality checks performed

- `npm run build` clean.
- 58 unit/component tests pass (sample schema, OSM mapping/dedupe/hours parsing, snapshot sanity, Asia/Kolkata hours including unknown/overnight, every filter and sort, URL round-trips, form validation and submission).
- Browser smoke run covers both modes: sample-mode acceptance flows, plus OSM banner, real results, source badges, no-phone Directions fallback, OSM profile, emergency empty state and mode switching. Console errors are checked.
- axe-core scan across home, results, profile, both forms and the styleguide: **0 WCAG A/AA violations**.
- No horizontal scroll at 375 px on every screen in both modes.
- Skeleton loading, empty/no-results state with nearest 24x7 fallback, focus-visible styles, skip link, reduced-motion support, labelled icons and semantic headings.

## Deployment

The app is a static SPA. Config is included for both hosts:

- **Vercel:** import the repo; `vercel.json` rewrites all routes to `index.html`.
- **Netlify:** `netlify.toml` and `public/_redirects` do the same.
- **GitHub Pages:** set Vite `base` to the repo path and add an SPA fallback if used; Vercel or Netlify is simpler.

Set `VITE_FORMS_ENDPOINT` in the host's environment variables when the Apps Script URL is ready.

## Scope and known limits

Deliberately out of scope, per Doc 01: accounts, reviews/ratings, booking, payments, provider dashboard, real scraping, push notifications and native apps.

- The physical Figma file is not included; `/styleguide` is the coded source of truth for tokens and components and is ready to mirror into Figma.
- Map tiles come from OpenStreetMap; if tile loading is blocked the pins and layout still work.
- "Practo for Animals" remains an unconfirmed working title and is not affiliated with Practo. The prototype uses the neutral "Pawzz" brand.
- **Sample mode** is entirely fictional and must stay labelled as such.
- **OSM live mode** contains real business names and addresses. It is not Pawzz-verified, and many records lack phone numbers or hours. Emergency and call-first flows are therefore best demonstrated in sample mode.
- Real OSM data is collected by volunteers and may be outdated. Users are told to confirm before visiting, and every OSM profile links to the source element for correction.
- The Overpass mirrors are public, best-effort services. Refresh requests are cached, rate-limited by user action and never used for autocomplete. For a production launch, self-host or use a commercial Overpass provider instead of public mirrors.
- Veterinary copy would need review by a licensed vet before real publication.
- Confirm India data-protection requirements before collecting real personal data.
