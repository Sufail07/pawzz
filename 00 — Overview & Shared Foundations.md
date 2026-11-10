# 00 — Overview & Shared Foundations

*Candidate assignment: Product Development, Design & AI Systems Intern · Scope and architecture document · Working title: Practo for Animals*

## 1. Purpose of this document set

The assignment has three deliverables that share one founder, one brand family and one tool stack. Rather than three disconnected write-ups, the work is split into four scoped documents. This document holds everything the other three depend on, so decisions are made once.

| Doc | Scope | Brief section | Main evaluation criteria served |
| --- | --- | --- | --- |
| **00 Overview & Foundations** | Locked decisions, design system, tool stack, time budget, submission checklist | Cross-cutting | Initiative and communication (10%) |
| **01 Animal-Care Discovery MVP** | Homepage, results and provider-profile prototype for the discovery platform | #1 | UI/UX (30%), product thinking and CTAs (20%) |
| **02 AI Course Landing Page** | Landing page and lead-capture journey for AI and digital-skills programmes | #2 | UI/UX (30%), product thinking and CTAs (20%) |
| **03 AI Carousel Content System** | Idea-to-carousel pipeline, tool choices, automation, one sample carousel | #3 | AI workflow and automation (25%), technical execution (15%) |

Read 00 first, then 01 to 03 in any order.

## 2. Decisions locked during scoping

| Area | Decision | Why |
| --- | --- | --- |
| Prototype delivery | Coded, mobile-responsive prototypes built with opencode and deployed to a free host (Vercel, Netlify or GitHub Pages). Figma holds the design system and key wireframes. | Gives live, clickable links within the 4–5 hour budget, and Figma shows design process. |
| Brand | Invented identity: a warm teal family for Practo for Animals, a sibling indigo family for AI Education. Shared type, spacing and radius. | No assets were provided. A shared system makes the submission look intentional. |
| MVP priority | Balanced discovery with an emergency fast-lane above the main search | Pet owners arrive both with planned needs and with urgent ones. |
| Market and data | India-first. Fictional but realistic sample providers in Kerala and Bengaluru, clearly labelled as sample data. | Avoids publishing unverified real business details. |
| Course primary CTA | Book a free intro session or counselling call | Lowest-friction conversion for students and early-career buyers, and it lets the founder qualify leads personally. |
| Automation approach | Script-based pipeline plus a small review UI ("Carousel Studio"). No n8n or Make. | Those tools are not available. Make and n8n are documented as the scale-up path. |
| Design editing for the founder | Canva free with a hand-built locked template set as the fallback editor | Canva free has no Bulk Create, Brand Kit or Magic Resize, so handoff to Canva is manual. |
| Sample carousel topic | "5 signs your pet needs a vet today" | Educational, shareable, and consistent with the animal-care brand. |
| Naming | "Practo for Animals" is treated as a working title. | Practo is an existing healthcare brand. The founder should confirm naming and trademark before any public launch. |

## 3. Shared design system

Built once in Figma as variables and styles, then mirrored as CSS custom properties in code.

### 3.1 Colour tokens

**Animal-care (teal family)**

| Token | Value | Use |
| --- | --- | --- |
| `--pfa-primary` | `#0F6B63` | Primary actions, headers |
| `--pfa-primary-dark` | `#0A4F49` | Hover and pressed states |
| `--pfa-accent` | `#F2A33A` | Key CTA highlights, badges |
| `--pfa-surface` | `#FBF6EC` | Page background (warm cream) |
| `--pfa-card` | `#FFFFFF` | Cards and sheets |
| `--pfa-ink` | `#1D2B2A` | Body text |
| `--pfa-muted` | `#5E6F6C` | Secondary text |
| `--pfa-border` | `#E4DDCC` | Dividers and outlines |
| `--pfa-emergency` | `#D64545` | Emergency strip and 24x7 badges only |
| `--pfa-success` | `#2E8B57` | Verified badges |

**AI Education (indigo family)**

| Token | Value | Use |
| --- | --- | --- |
| `--edu-primary` | `#3B3FD9` | Primary actions |
| `--edu-ink` | `#14152B` | Text and dark sections |
| `--edu-highlight` | `#C6F432` | Highlights and key numbers |
| `--edu-surface` | `#F6F6FF` | Page background |

All text and interactive colour pairings must meet WCAG AA contrast (4.5:1 for body text). Amber and lime are used as fills behind dark text, never as text on light backgrounds.

### 3.2 Typography

- **Body and UI:** Plus Jakarta Sans (Google Fonts)
- **Display headlines, animal-care only:** Fraunces. The education brand uses Plus Jakarta Sans at weight 800 for headlines.
- **Scale (px):** 12, 14, 16, 18, 24, 32, 44, 56. Mobile headlines step down one size.
- Every font has a system fallback stack.

### 3.3 Layout primitives

- 4 px spacing grid, with 8, 16, 24 and 40 as the common steps
- Radius: 12 (inputs), 20 (cards), 999 (chips and pills)
- Minimum tap target 44 × 44 px
- Content max-width 1200 px, 16 px side padding on mobile
- Shared components: button (primary, secondary, ghost), chip, card, input, badge, bottom sheet, sticky action bar

## 4. Tool stack

| Layer | Tool | Used in |
| --- | --- | --- |
| Design system, wireframes | Figma (free) | 01, 02, 03 |
| Prototype build | opencode (coding agent), React with Vite and Tailwind CSS | 01, 02, Carousel Studio |
| Hosting | Vercel, Netlify or GitHub Pages (free tier) | 01, 02 |
| LLM for research and copy | Claude API by default. Free-tier Gemini as the zero-cost alternative. Provider-agnostic behind one config key. | 03 |
| Slide rendering | HTML and CSS templates exported to PNG and PDF (Playwright or html-to-image) | 03 |
| Manual visual edits | Canva free with locked template set | 03 |
| Lead capture | Static form posting to Google Apps Script, writing to Google Sheets | 02 |
| Fonts and icons | Google Fonts, Lucide icons | All |

## 5. Time budget (4–5 hours)

| Block | Time |
| --- | --- |
| Foundations: design tokens, Figma setup, repo scaffolding | 30 min |
| Doc 01 build: discovery MVP prototype | 1 h 30 min |
| Doc 02 build: course landing page and lead-capture wiring | 1 h |
| Doc 03 build: Carousel Studio, sample carousel, workflow write-up | 1 h 30 min |
| Final write-up, link check, submission | 30 min |

If time runs short, cut in this order: map view in 01, project showcase animation in 02, optional AI imagery in 03. Never cut the review gates or the lead-capture wiring.

## 6. Submission checklist mapped to evaluation criteria

| Criterion (weight) | Evidence in the submission |
| --- | --- |
| UI/UX and visual design (30%) | Two deployed prototypes, Figma file with tokens, responsive at 375 px and 1280 px |
| Product thinking and CTA strategy (20%) | CTA maps in Docs 01 and 02, filter and data-schema reasoning, trust and correction flows |
| AI workflow and automation (25%) | Doc 03 pipeline, slide JSON contract, working Carousel Studio, sample carousel |
| Technical execution and tool selection (15%) | Tool table with rationale and alternatives, working lead-capture pipeline |
| Initiative and communication (10%) | This document set, the decisions log, and clearly stated risks |

## 7. Risks and assumptions

- **Trademark:** The working title borrows from an existing brand. Flagged for the founder.
- **Sample data:** Every provider, review count and statistic in the prototypes is fictional and labelled as such.
- **No fabricated social proof:** Testimonials, student counts and placement claims on the course page are placeholders and marked as such.
- **Veterinary content accuracy:** Any health-related carousel copy needs review by a licensed vet before real publication. The sample carousel carries that note.
- **Lead-capture compliance:** The form includes an explicit consent line. Requirements under India's data protection law should be confirmed before collecting real personal data.
- **Canva free limits:** Locked layouts and bulk handoff are not available, so Canva stays a manual fallback rather than part of the automated path.
