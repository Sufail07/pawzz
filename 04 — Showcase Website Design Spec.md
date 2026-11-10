# 04 — Showcase Website: Design Spec

*Design and build specification for a single-page site that presents the three submitted systems · Depends on Docs 00 to 03*

## 1. Purpose and audience

**Purpose:** One link that presents all three systems (the discovery MVP, the AI course landing page, and the carousel content system) as working products, with the reasoning behind each.

**Primary audience:** the founder or evaluator reviewing the submission, usually in a few minutes and often on a phone. Secondary audience: anyone the founder forwards the link to.

**The site succeeds if a reviewer can, within about 90 seconds:**

1. Understand what each system is and who it serves
2. Open each live prototype in one tap
3. See which evaluation criteria each system demonstrates
4. Find the supporting specs and files

The site is evidence-first. Every claim links to something live or downloadable, and every number is a fact about what was built, never a performance claim.

## 2. Decisions taken

| Area | Decision | Why |
| --- | --- | --- |
| Structure | Single scrolling page with hash anchors (`#discovery`, `#course`, `#carousel`) | Reviewers skim. One page means one link to share and no lost context. |
| Live previews | Framed live iframe of each deployed prototype, with a screenshot fallback and an Open full site button | Interaction is the proof, but some hosts block embedding, so the fallback is mandatory. |
| Visual chrome | Neutral warm base with ink text. Each system section borrows its own accent from Doc 00. | The site reads as one author's work while each product keeps its identity. |
| Content | All copy, links and asset paths live in one `content.ts` file | Deployed URLs change. Updating them must not touch components. |
| Numbers | Only facts from Docs 01 to 03 (counts of provider types, stages, layouts). No traffic, conversion or user figures. | Nothing has launched, so nothing may be implied. |
| Analytics | None by default | No cookies or consent banner needed. |
| Hosting | Free static host (Vercel, Netlify or GitHub Pages) | Matches the rest of the stack in Doc 00. |

## 3. Information architecture

| # | Section | Anchor | Purpose | CTA |
| --- | --- | --- | --- | --- |
| 1 | Sticky navigation | n/a | Orientation and quick jumps | Open all live links |
| 2 | Hero | `#top` | State what this is in five seconds | See the three systems |
| 3 | Three systems at a glance | `#overview` | One card per system with facts and links | Open live, Jump to case study |
| 4 | How they connect | `#connect` | Show the shared system and the content-to-product loop | None |
| 5 | System 1: Discovery MVP | `#discovery` | Case study | Open live prototype |
| 6 | System 2: Course landing page | `#course` | Case study | Open live prototype, Download syllabus |
| 7 | System 3: Carousel content system | `#carousel` | Case study | Open Carousel Studio, Download sample |
| 8 | Evaluation map | `#criteria` | Map each criterion to evidence | Jump links |
| 9 | Stack and process | `#stack` | Tools chosen and time spent | None |
| 10 | Honest notes and next steps | `#notes` | Limits, assumptions, what comes next | Open specs |
| 11 | Footer | `#contact` | Links and contact | Contact |

## 4. Visual design system

Reuse the tokens from Doc 00. Only the showcase chrome is new.

### 4.1 Chrome tokens

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#FBF8F1` | Page background |
| `--surface` | `#FFFFFF` | Cards and device frames |
| `--ink` | `#14152B` | Text and the dark carousel section |
| `--muted` | `#5A5C7A` | Secondary text |
| `--line` | `#E6E1D3` | Borders and dividers |

### 4.2 Section themes

| Section | Background | Accent | Source tokens |
| --- | --- | --- | --- |
| Hero and overview | `--bg` | Both accents as small chips | Doc 00 |
| Discovery | `--pfa-surface` | Teal primary, amber for CTAs | `--pfa-*` |
| Course | `--edu-surface` | Indigo primary, lime highlight | `--edu-*` |
| Carousel | `--ink` (dark) | Lime and amber highlights on dark | Both families |
| Criteria, stack, notes | `--bg` | Indigo | `--edu-primary` |

Alternating light, tinted, tinted and dark backgrounds give the page rhythm and signal which system the reader is in. Lime and amber are fills behind dark text, never text on light backgrounds. All pairings meet AA contrast.

### 4.3 Type, spacing and shape

- **Headings:** Fraunces for the hero and section titles. **Everything else:** Plus Jakarta Sans. System fallback stacks on both.
- **Scale (px):** hero 56 (36 on mobile), section title 44 (32 mobile), subhead 24, body 16, caption 13.
- **Layout:** 12-column grid on desktop, 4-column on mobile, content max-width 1200 px, 16 px side padding on mobile.
- **Section padding:** 96 px vertical on desktop, 64 px on mobile.
- **Radius:** 20 px cards, 12 px inputs, 999 px chips. Soft, low-opacity shadows only.
- **Icons:** Lucide. **Imagery:** real screenshots in CSS device frames. No stock photography.

## 5. Section specifications

### 5.1 Navigation

Sticky, 64 px high, translucent with blur. Left: wordmark `{{CANDIDATE_NAME}} · Submission`. Centre: anchors for Systems, Discovery, Course, Carousel, Criteria, Notes, with the active section highlighted on scroll. Right: **Open all live links**, a small menu listing the three live URLs.

On mobile the anchors move into a horizontally scrolling chip row under the bar. The bar respects the top safe-area inset.

### 5.2 Hero

- **Headline (primary):** *From rough idea to working system. Three times.*
- **Headline (alternate):** *Three systems, built to ship.*
- **Subhead:** *A discovery platform for animal care, an AI course page with a real lead pipeline, and a content engine that turns one idea into a carousel.*
- **Chips:** three status chips, each with a green dot and the word Live, linking to the section.
- **CTAs:** primary **See the three systems** (`#overview`), secondary **Read the specs** (`#notes`).
- **Visual:** three overlapping frames in a gentle stagger: a phone showing the discovery results page, a laptop showing the course page, and a 4:5 slide card from the sample carousel. Static on reduced motion.

### 5.3 Three systems at a glance

Three equal cards (stacked on mobile). Each shows number, name, one-line description, three facts, and two buttons.

| Card | Facts (all verifiable from Docs 01 to 03) | Buttons |
| --- | --- | --- |
| 01 Animal-care discovery MVP | 6 provider types · 3-screen clickable flow · emergency fast-lane | Open live, Case study |
| 02 AI course landing page | 12-section page · 2 audience tracks · lead form to Google Sheet | Open live, Case study |
| 03 AI carousel content system | 7-stage pipeline · 2 human review gates · 6 slide layouts | Open Carousel Studio, Case study |

### 5.4 How they connect

A single SVG diagram with three layers:

1. **Top:** the Carousel system produces posts for Instagram and LinkedIn.
2. **Middle:** posts reach two audiences. Pet owners go to the Discovery platform. Students and professionals go to the Course page.
3. **Bottom:** a full-width bar labelled *One design system, one tool stack* connects under all three.

Lines draw in as the section enters view. Caption: *Content feeds both products, and the same tokens and tools sit under all three.*

### 5.5 Case-study module (repeated for systems 1 to 3)

One reusable component, so the three sections stay consistent.

**Desktop layout:** text column (5 of 12) and preview column (7 of 12), alternating sides per system. **Mobile:** text first, then preview, full width.

**Text column, in order:**

1. Eyebrow, for example *System 1 · Discovery*
2. Title and a status badge (Live prototype)
3. One sentence on the problem it solves
4. **What I built:** three short bullets
5. **Decisions that mattered:** three Decision cards, each a bold title and one or two sentences
6. Evaluation-criteria tags, for example *UI/UX*, *CTA strategy*
7. Stack chips
8. Link row: Open live, View spec, View Figma

**Preview column:** a DeviceFrame holding either the live iframe or a screenshot, with tabs for the screens or states (defined per system below). A small **Open full site** link sits under the frame.

### 5.6 System 1: Discovery MVP

- **Tabs:** Home, Results, Provider profile, each in a phone frame (desktop frame optional).
- **Hotspots:** numbered pins on the screenshot that reveal a tooltip on hover or tap. Pins: Emergency fast-lane, Open now and 24x7 filters, Verified badge with last-verified date, Submit a Correction link, Sticky call bar.
- **Mini CTA map:** a compact table of the seven CTAs and where each lives, collapsed by default.
- **Decisions to feature:** (1) emergency fast-lane above the main search, (2) trust through verification level and last-verified date, (3) booking and reviews deliberately deferred until the directory has density.
- **Tags:** UI/UX, Product thinking, CTA strategy.

### 5.7 System 2: Course landing page

- **Preview:** desktop frame by default, with a toggle to a phone frame.
- **Lead journey:** the eight-step journey from Doc 02 as a horizontal stepper (vertical on mobile). Each step expands to show what happens, including the four form fields and the Google Sheet row.
- **Syllabus:** a **Download the sample syllabus** button linking to the PDF, with a small cover thumbnail beside it.
- **Decisions to feature:** (1) one primary CTA, the free intro session, (2) one form reused everywhere so there is one data pipeline, (3) clearly marked placeholders instead of invented social proof.
- **Tags:** UI/UX, CTA strategy, Technical execution.

### 5.8 System 3: Carousel content system

Dark section.

- **Pipeline stepper:** the seven stages in a row (a vertical list on mobile). Stages 3 and 7 carry a lime badge reading *Human gate*. Selecting a stage shows its input, tool and output in a panel below, taken from the table in Doc 03.
- **Slide viewer:** the eight-slide sample carousel in a 4:5 frame. Controls: arrows, swipe, keyboard left and right, dots, and a counter. Beside it, a **Download PDF** button and a collapsible code card showing the slide JSON contract.
- **Caption under the viewer:** *Sample carousel made with this workflow. Health content is general information and needs veterinary review before real publication.*
- **Decisions to feature:** (1) a fixed template library instead of free-form design, (2) fact-check gate placed before copywriting, (3) a free-tier stack with a documented scale-up path.
- **Tags:** AI workflow and automation, Technical execution, Tool selection.

### 5.9 Evaluation map

Five rows, one per criterion. Each row has the criterion name, a horizontal bar sized to its weight (30, 20, 25, 15, 10), and two or three links to the exact evidence (section anchors or documents). Bars animate to width once on entering view.

### 5.10 Stack and process

- A tool table taken from Doc 00 (layer, tool, used in), shown as cards on mobile.
- A single stacked bar for the time budget: 30, 90, 60, 90 and 30 minutes, each labelled.
- Tool chips link to the tool's site only where it adds value.

### 5.11 Honest notes and next steps

Two columns: **Limits and assumptions** and **If I had another week**.

- *Limits:* all providers, prices and programme details are sample data. Testimonials and student counts are placeholders. The working title needs trademark review. Health copy needs veterinary review. Canva free has no Bulk Create, so that handoff is manual.
- *Next:* real provider data pipeline and claim flow, online booking after supply density, Make or n8n for scheduled carousel batches, automated WhatsApp follow-up for course leads.

A link row at the bottom opens Docs 00 to 04 as PDFs.

### 5.12 Footer

Name, one-line sign-off, links (Figma, repository, the five documents), contact placeholder, and *Built with the same tokens it describes.*

## 6. Interaction and motion

| Element | Behaviour |
| --- | --- |
| Section entrance | 12 px upward fade, 300 ms, once per element |
| Nav active state | Updates as sections cross 40 percent of the viewport |
| Device tabs | Cross-fade, 200 ms |
| Hotspots | Tooltip on hover, focus or tap, closes on outside tap or Escape |
| Pipeline stepper | Selected stage scales slightly and the panel content cross-fades |
| Slide viewer | Swipe on touch, arrows and keys on desktop, wraps never (stops at first and last) |
| Diagram and bars | Draw or grow once on entering view |

All motion is disabled under `prefers-reduced-motion`, and nothing depends on motion to be understood.

## 7. Responsive behaviour

| Breakpoint | Layout |
| --- | --- |
| 375 to 639 px | Single column, chip-row nav, stacked modules, frames full width |
| 640 to 1023 px | Single column with wider frames, two-column fact rows |
| 1024 px and above | Alternating two-column case studies, three-column overview cards |
| 1280 px and above | Content capped at 1200 px, larger hero composition |

No horizontal page scroll at any width. Wide tables and code scroll inside their own container.

## 8. Content model

All copy and links come from one typed file so the site can be updated without touching components.

```ts
interface System {
  id: 'discovery' | 'course' | 'carousel';
  number: string;
  name: string;
  oneLiner: string;
  problem: string;
  built: string[];                // three bullets
  decisions: { title: string; body: string }[]; // three items
  criteria: string[];             // evaluation tags
  stack: string[];
  facts: string[];                // three verifiable facts
  links: { live: string; spec: string; figma?: string; download?: string };
  previews: { label: string; image: string; mobileImage?: string }[];
}
```

Placeholders to replace before launch: `{{CANDIDATE_NAME}}`, `{{DISCOVERY_URL}}`, `{{COURSE_URL}}`, `{{STUDIO_URL}}`, `{{FIGMA_URL}}`, `{{REPO_URL}}`, `{{CONTACT}}`.

## 9. Asset checklist

| Asset | Spec | Used in |
| --- | --- | --- |
| Discovery screenshots | Home, Results, Profile; 390 × 844 mobile WebP, plus 1440 × 900 desktop WebP | 5.6 |
| Course screenshots | Full page desktop (1440 wide) and mobile (390 wide) WebP | 5.7 |
| Sample syllabus PDF | `AI_Skills_Studio_Sample_Syllabus.pdf` and a cover thumbnail PNG | 5.7 |
| Carousel slides | 8 PNGs at 1080 × 1350, plus 720 × 900 WebP for display | 5.8 |
| Carousel PDF | LinkedIn document export | 5.8 |
| Pipeline diagram data | Stage content as JSON, drawn in code | 5.8 |
| Connection diagram | Inline SVG | 5.4 |
| Slide JSON sample | Short excerpt of the real output | 5.8 |
| Document exports | Docs 00 to 04 as PDF | 5.11 |
| Social image | 1200 × 630 PNG for link previews | Meta tags |
| Favicon | SVG | Meta tags |

Every image needs descriptive alt text, and files should stay under 250 KB each where possible.

## 10. Technical specification

- **Stack:** React with Vite, TypeScript and Tailwind CSS, using the tokens from Doc 00 as CSS variables. Static output, no backend.
- **Structure:** `src/content.ts`, `src/components/` (Nav, Hero, SystemCard, CaseStudy, DeviceFrame, Hotspots, PipelineStepper, SlideViewer, CriteriaMap, StackSection, Notes, Footer), `public/assets/`.
- **Iframes:** lazy-loaded with `loading='lazy'`, a sandbox attribute limited to what the prototypes need, and a timed fallback to the screenshot if the frame fails to load.
- **Performance targets:** Lighthouse 90 or above on mobile for performance, accessibility, best practices and SEO. Fonts preloaded and subset, images lazy-loaded below the fold.
- **Accessibility:** AA contrast, visible focus states, 44 px tap targets, semantic headings, keyboard-operable tabs, stepper and slide viewer with proper roles and labels, reduced-motion support.
- **SEO and sharing:** descriptive title and meta description, Open Graph and Twitter card tags, canonical URL, `robots` allowing indexing only if the founder agrees.
- **Deployment:** free static host with the default subdomain. A custom domain is optional.

## 11. Build plan for opencode

| Step | Task | Time |
| --- | --- | --- |
| 1 | Scaffold Vite, React, TypeScript and Tailwind. Add tokens as CSS variables and load fonts. | 20 min |
| 2 | Create `content.ts` with real copy from Docs 01 to 03 and placeholder URLs | 15 min |
| 3 | Build the shell: Nav, section wrapper with theme prop, Footer | 20 min |
| 4 | Hero and Three systems at a glance | 25 min |
| 5 | CaseStudy module with DeviceFrame, tabs and iframe fallback | 30 min |
| 6 | Hotspots (System 1), lead stepper and syllabus download (System 2), pipeline stepper and slide viewer (System 3) | 45 min |
| 7 | Connection diagram, evaluation map, stack section, notes | 25 min |
| 8 | Motion, accessibility pass, meta tags, Lighthouse check, deploy | 25 min |

Total is roughly three hours. That sits **outside the original 4 to 5 hour assignment budget**, so treat this site as an extra. If time is tight, cut in this order: connection diagram animation, hotspots, live iframes (screenshots only), then the time-budget bar.

## 12. Acceptance checklist

- All three live prototypes open from the nav, overview cards and each case study
- Every iframe falls back to a screenshot if blocked
- No placeholder token such as `{{...}}` appears on the deployed site
- Every number on the page can be traced to Docs 01 to 03
- Slide viewer works by swipe, arrows and keyboard, and has a PDF download
- Syllabus PDF downloads from the course section
- Evaluation map links land on the right evidence
- No horizontal scroll at 375 px, AA contrast on all text
- Reduced-motion setting removes all animation
- Lighthouse targets met on mobile
- Link preview shows the social image and correct title

## 13. Out of scope

Contact forms and backends, CMS, blog, analytics and cookie banners, multi-language support, user accounts, comments, and any performance or traffic claims.
