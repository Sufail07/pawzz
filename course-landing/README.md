# Lumen AI Academy — Course Landing Page

A mobile-first prototype of the AI and digital-skills course landing page described in `02 — AI Course Landing Page.md`, built with the shared foundations from `00 — Overview & Shared Foundations.md`.

A visitor can understand the offer in the first screen, switch between three programme tracks, see track-specific outcomes, compare tracks and pricing (clearly marked placeholders), read the FAQ, and book a free intro session or download the syllabus. Leads are captured through one reusable form and land in the founder's Google Sheet when an Apps Script endpoint is configured.

`Lumen AI Academy` is a fictional working brand invented for this assignment. It is not affiliated with any existing academy.

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
| `npm test` | Unit and component tests (Vitest) |
| `npm run smoke` | Browser checks for the primary journeys (Playwright; needs the dev server running) |
| `npm run a11y` | axe-core WCAG A/AA scan, including open dialogs (needs the dev server running) |

If Playwright browsers are not installed, run `npx playwright install chromium` first.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Full landing page: hero, outcomes, tracks, how it works, projects, mentors, pricing, testimonials, FAQ, final CTA |
| `/privacy` | Privacy note linked from every consent line |
| `/styleguide` | Coded design system: tokens, type, buttons, chips, badges, fields |
| `*` | Friendly not-found page |

The page is a single scroll with anchor navigation (`#programmes`, `#projects`, `#pricing`, `#faq`) and a sticky mobile action bar that is always one tap from the form.

## Architecture

```text
src/
  app/Layout.tsx            skip link, header, main, footer, sticky bar, dialog
  content/
    course.ts               tracks, outcomes, steps, projects, mentors, testimonials, FAQs
    site.ts                 brand, WhatsApp number, nav, syllabus path
    extra.ts                track -> sample project mapping for the hero mockup
  lib/
    lead.ts                 validation, phone normalisation, labels
    submit.ts               endpoint POST + localStorage fallback
    utm.ts                  first-touch UTM capture and read
    whatsapp.ts             deep links with a pre-filled message
    cn.ts                   class-name helper
  components/
    layout/                 header, footer, brand mark
    lead/                   lead context, dialog, intro form, syllabus form, success, sticky CTA
    ui/                     button, fields, badges/cards, chip, accordion, reveal, section, placeholder
  features/landing/         one component per page section
  pages/                    Home, Privacy, Styleguide, NotFound
  styles                    design tokens in src/index.css (Tailwind v4 @theme)
```

## Lead capture

One form is reused in four places: header button, hero and pricing CTAs, track cards (track pre-selected), and the inline final-CTA form. The syllabus flow is a second form with its own endpoint payload.

### Endpoint configuration

```bash
cp .env.example .env
# VITE_FORMS_ENDPOINT=https://script.google.com/macros/s/…/exec
# VITE_WHATSAPP_NUMBER=91XXXXXXXXXX
```

- **Endpoint set:** the form POSTs JSON and the success state says the lead was sent.
- **Endpoint unset:** the submission is stored in `localStorage` under `lumen.leads.v1` and the success state says so explicitly. The same payload shape is used, so wiring the endpoint needs no front-end changes.

### Sample Google Apps Script

`apps-script/Code.gs` is a ready sample:

1. Create a Google Sheet with a `Leads` tab (headers are added on first run).
2. Extensions → Apps Script → paste the file, set `SHEET_ID`.
3. Deploy → New deployment → Web app → Execute as **Me**, access **Anyone**.
4. Put the `/exec` URL in `VITE_FORMS_ENDPOINT` and redeploy the site.

It appends a row per lead. It does not send email: the syllabus PDF downloads directly in the browser, and the supplied email is recorded on the lead. Intro calls are followed up manually on WhatsApp, per Doc 02 §6.1.

### Sheet columns

`timestamp`, `name`, `whatsapp`, `email`, `segment`, `track`, `preferred_time`, `lead_type`, `utm_source`, `utm_medium`, `utm_campaign`, `page_variant`, `consent`, `status`, `owner`, `notes`

- `lead_type` is `intro_call` or `syllabus`.
- `status` starts as `new`; the team updates it to `contacted`, `call_booked`, `call_done`, `enrolled`, `nurture` or `lost`.
- UTM values are captured on first load, kept for the session, and attached to every submission.
- `page_variant` is `course-landing-v1` so other landing variants can share the sheet later.

### Confirmation

- Intro lead: "You're booked in. We'll message you on WhatsApp within a few hours", with the chosen track and preferred call window, plus a direct WhatsApp link.
- Syllabus lead: the PDF downloads immediately, with a visible download button as a fallback, and the lead is recorded as lower intent. Name and email are still required to unlock it, but nothing is emailed.

## Design system

Tokens from Doc 00 live in `src/index.css` as Tailwind v4 theme values and CSS custom properties: indigo primary, near-black indigo ink, lime highlight, light indigo surface. All headlines use Plus Jakarta Sans at weight 800 (the education brand does not use Fraunces). Radii are 12 px inputs, 20 px cards and pill chips. Every interactive target is at least 44 × 44 px.

Contrast notes:

- Lime and amber are fills behind dark text only, never text on light backgrounds.
- White on the indigo primary and on the darker WhatsApp green both meet WCAG AA at body size.
- The muted text token is checked against the surface colour.

## Trust and honesty rules

- No invented testimonials, student counts or placement claims. Testimonial cards are visibly marked **Placeholder**.
- Programme names, durations, formats, dates, cohort sizes and prices are illustrative and marked with a **Placeholder** tag. The founder must confirm them.
- Placeholder mentor bios and social links are labelled as such.
- Every form requires an explicit consent checkbox and links to the privacy note.
- The hero visual is a CSS-built product mockup, not a stock photo of people, and is hidden from assistive technology.
- Sample projects are labelled "Sample project".

## Accessibility

- Semantic landmarks, one `h1`, ordered headings, skip link.
- Track switcher is a keyboard-operable `radiogroup` with arrow-key support and a screen-reader status update.
- Dialog traps focus, closes on Escape or backdrop click, restores focus, and locks background scroll.
- Fields have programmatic labels, hints and `role="alert"` errors; forms submit with `noValidate` plus explicit validation.
- Reduced-motion support disables scroll reveals and transitions.
- No horizontal scroll at 375 px.

## Checks performed

- `npm run build` clean.
- `npm test` covers phone/email/name/consent validation, UTM capture and merging, WhatsApp links, track content integrity, endpoint and fallback submission, form validation → success, syllabus reveal and track switching.
- `npm run smoke` covers mobile and desktop: first-load CTA, sticky bar at scroll, track switching, dialog pre-selection, inline validation, intro submission with UTM in the stored payload, syllabus download, FAQ toggle, no horizontal overflow, Escape-to-close, privacy and styleguide routes, and console errors.
- `npm run a11y` runs axe-core WCAG A/AA across home, styleguide, privacy, the intro dialog (default and with validation errors) and the syllabus dialog.

## Deployment

The app is a static SPA. Config is included for both hosts:

- **Vercel:** import the repo; `vercel.json` rewrites all routes to `index.html`.
- **Netlify:** `netlify.toml` and `public/_redirects` do the same.
- **GitHub Pages:** set Vite `base` to the repo path and add an SPA fallback if used; Vercel or Netlify is simpler.

Set `VITE_FORMS_ENDPOINT` and `VITE_WHATSAPP_NUMBER` in the host's environment variables.

## Out of scope and known limits

Per Doc 02: online payment, learner login, a learning platform, automated WhatsApp messaging, multi-language pages and A/B testing infrastructure are out of scope.

- The Figma file is not included; `/styleguide` is the coded source of truth for tokens and components, ready to mirror into Figma.
- The WhatsApp number and email address are placeholders.
- The syllabus PDF is a sample document at `public/AI_Skills_Studio_Sample_Syllabus.pdf`.
- Use of a real number, email or sheet requires confirmation of India's data-protection requirements and consent wording.
- Make/n8n orchestration, official WhatsApp Business API messaging and calendar booking are the documented upgrade path, not part of this prototype.
