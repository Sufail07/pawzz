# 02 — AI Course Landing Page

*Scope and architecture for the landing page and lead-capture journey for practical AI and digital-skills programmes · Depends on Doc 00*

## 1. Goal and conversion definition

**Goal:** Turn students and young professionals who are curious about AI into qualified conversations with the founder's team.

**Primary conversion:** A visitor books a **free intro session or counselling call**.

**Secondary conversion:** A visitor downloads the programme syllabus. This captures people who are interested but not ready to talk.

**Success criteria for the prototype**

1. A visitor understands what is offered, who it is for, and what happens next within the first screen
2. The primary CTA is reachable from any scroll position on mobile
3. A lead can be captured in under 45 seconds and ten fields or fewer are never needed (the form has four)
4. Every submitted lead lands in the founder's Google Sheet with source information, and the visitor receives a confirmation

## 2. Audience and positioning

| Segment | Situation | What they want | Objection to answer |
| --- | --- | --- | --- |
| **Students** (college, final year) | Worried that degree alone won't stand out | Practical skills and projects for a portfolio | "Is it too technical? Is it worth the money?" |
| **Young professionals** (0–5 years) | Seeing AI change their field | Use AI to work faster and move up | "I have no time. Will it be useful at my job?" |

The page serves both through a track switcher in the hero. The structure stays identical. Outcomes, example projects and testimonial placeholders swap by track.

## 3. Value proposition

**Core message:** Learn AI by building real things, with a small cohort and a clear outcome, not by watching theory videos.

**Draft hero copy (to refine):**

- Headline: *Learn AI by building real things.*
- Subhead: *Practical AI and digital-skills programmes for students and young professionals. Live cohorts, real projects, no coding background needed.*
- Primary CTA: **Book a free intro session**
- Secondary CTA: **Download the syllabus**

**Proof pillars (the "why us" in three lines):** project-based, small cohorts with live mentoring, skills you can show in a portfolio.

**Illustrative programme tracks** (names, durations and prices are placeholders for the founder to confirm):

| Track | For | Illustrative outcome |
| --- | --- | --- |
| AI Foundations | Students | Use AI tools confidently for study, research and a first portfolio project |
| AI at Work | Young professionals | Automate repeat tasks and produce better work faster |
| Digital Skills Studio | Both | Build a simple website, create content and run basic automations |

## 4. Page structure

| # | Section | Purpose | Content | CTA |
| --- | --- | --- | --- | --- |
| 1 | Sticky header | Orientation | Logo, three anchor links, **Book a free intro** button | Primary |
| 2 | Hero | Clarity in five seconds | Headline, subhead, track switcher, illustration or product-style visual, trust line | Primary and secondary |
| 3 | Outcomes | Answer "what will I be able to do?" | Four to six outcome cards that change by track | None |
| 4 | Programme tracks | Help choose | Three track cards: audience, duration, format, key projects | **Talk to us about this track** (pre-fills the form) |
| 5 | How it works | Reduce uncertainty | Four steps: intro call, join cohort, build projects, showcase | None |
| 6 | Project showcase | Prove it is practical | Three example projects with tool badges, labelled as sample projects | None |
| 7 | Who teaches | Credibility | Founder and mentor cards with placeholder bios | None |
| 8 | Cohort dates and pricing | Reduce friction | Next cohort date, seats note, price band placeholder, "free intro session first" reassurance | **Book a free intro session** |
| 9 | Testimonials | Social proof | Clearly marked placeholders until real ones exist | None |
| 10 | FAQ | Remove objections | Eight to ten questions: prerequisites, time, certificate, payment, refunds, laptops | None |
| 11 | Final CTA band | Close | Repeat the value proposition and the primary form inline | Primary |
| 12 | Footer | Trust and contact | WhatsApp, email, social links, privacy | Contact |

**Mobile:** a sticky bottom bar holds the primary CTA and a WhatsApp button at all times, hiding while the form is on screen.

## 5. CTA strategy

| Level | CTA | Where | Behaviour |
| --- | --- | --- | --- |
| Primary | **Book a free intro session** | Header, hero, pricing, final band, mobile sticky bar | Opens the lead form as a modal on desktop and a bottom sheet on mobile |
| Secondary | **Download the syllabus** | Hero, tracks section | Collects name and email, then reveals a download link and records the lead as a lower-intent lead |
| Tertiary | **Chat on WhatsApp** | Sticky bar, footer, FAQ | Opens WhatsApp with a pre-filled message, including the visitor's chosen track if known |
| Contextual | **Talk to us about this track** | Track cards | Opens the same form with the track pre-selected |

Rule: one form, reused everywhere, so there is a single data pipeline and consistent lead records.

## 6. Registration and lead-capture journey

### 6.1 Journey steps

1. **Arrive** from Instagram, LinkedIn, WhatsApp or search. UTM parameters are captured on load.
2. **Engage.** The visitor picks a track and scrolls. The page remembers the selected track.
3. **Click the CTA.** The lead form opens.
4. **Submit the form.** The form validates inline and posts to a Google Apps Script endpoint.
5. **Confirmation.** The page shows "You're booked in. We'll message you on WhatsApp within a few hours," with an optional slot picker for a preferred time window.
6. **Automated confirmation email** is sent from the Apps Script, containing what happens next and a link to the syllabus.
7. **Human follow-up.** The founder or counsellor messages on WhatsApp using a standard template, runs the intro call and records the outcome in the sheet.
8. **Convert or nurture.** Interested leads receive cohort and payment details. Others move to a nurture list for the next cohort.

### 6.2 Lead form fields

| Field | Type | Notes |
| --- | --- | --- |
| Full name | Text | Required |
| WhatsApp number | Phone | Required, India format validation |
| I am a... | Select | Student, working professional |
| Track of interest | Select | Pre-filled from the page context |
| Preferred call time | Select | Optional: morning, afternoon, evening |
| Consent | Checkbox | "I agree to be contacted about this programme." Required, with a link to the privacy note. |

Email is collected only on the syllabus download form, to keep the primary form short.

### 6.3 Lead sheet columns

`timestamp`, `name`, `whatsapp`, `segment`, `track`, `preferred_time`, `lead_type` (intro\_call or syllabus), `utm_source`, `utm_medium`, `utm_campaign`, `page_variant`, `consent`, `status` (new, contacted, call\_booked, call\_done, enrolled, nurture, lost), `owner`, `notes`

### 6.4 Follow-up standards

- First WhatsApp response target: within a few hours during working hours
- A standard three-message sequence: confirmation, reminder before the call, post-call follow-up
- Weekly review of status counts to see where leads drop off

### 6.5 Upgrade path

The same flow moves to Make or n8n when volume grows, adding automatic WhatsApp messaging through an official business API, calendar booking, reminder sequences and a CRM. None of that is needed for the prototype.

## 7. Trust and honesty rules

- No invented testimonials, student numbers or placement claims. Placeholders are visibly marked.
- Programme names, durations and prices are illustrative and flagged for the founder to confirm.
- A consent line sits next to every form, and the privacy note says what is collected and why.

## 8. Visual direction

- **Palette:** the education tokens from Doc 00, with indigo as the primary, near-black indigo for dark sections, and lime used as a highlight behind dark text.
- **Tone:** confident, young, practical. Large type, generous whitespace, bold numerals for outcomes.
- **Imagery:** product-style UI mockups and tool badges rather than stock photos of people.
- **Motion:** subtle scroll reveals and a track-switch transition, with reduced-motion support.
- **Layout:** single column on mobile, with alternating two-column sections at 1024 px and above.

## 9. Prototype build specification

- **Stack:** React with Vite and Tailwind CSS, using the shared tokens. Deployed to a free static host.
- **Working interactions:** track switcher that changes hero and outcome content, form modal and bottom sheet, inline validation, success state, sticky CTA bar, FAQ accordion, UTM capture, and a WhatsApp deep link.
- **Lead capture:** a Google Apps Script web app that appends rows to a Google Sheet and sends the confirmation email. The endpoint address is read from an environment variable.
- **Figma deliverable:** the desktop and mobile page layouts and the form states.

## 10. Acceptance checklist

- Primary CTA visible on first load and reachable at any scroll position on mobile
- Track switcher updates the hero and outcomes
- Form validates, submits, and produces both a sheet row and a confirmation email
- UTM values appear in the sheet row
- All placeholder content is labelled
- No horizontal scroll at 375 px, AA contrast, keyboard-accessible form and modal

## 11. Metrics to track after launch

Visit to form-open rate, form-open to submit rate, submit to call-booked rate, call-booked to enrolled rate, and lead cost by source.

## 12. Out of scope

Online payment, learner login, learning platform, automated WhatsApp messaging, multi-language pages, A/B testing infrastructure.
