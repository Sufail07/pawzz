# 03 — AI Carousel Content System

*Scope and architecture for a repeatable idea-to-carousel workflow the founder can run without a designer · Depends on Doc 00*

## 1. Goal and success criteria

**Goal:** The founder types a raw idea and, in about 30 minutes of mostly review time, exports a publish-ready Instagram and LinkedIn carousel that is on-brand, fact-checked and editable.

**The system succeeds if:**

1. The only founder inputs are an idea, an audience and a platform choice
2. Every carousel uses the same brand templates, with no design decisions needed
3. Every statistic or health claim is shown with its source before export
4. The founder can fix wording inline and re-export in under two minutes
5. The same system works for both brands (animal-care and AI education) through a theme switch

## 2. Workflow overview

Seven stages, with two human gates.

| # | Stage | Input | Tool | Output | Gate |
| --- | --- | --- | --- | --- | --- |
| 1 | **Intake** | Raw idea, audience, platform, theme | Carousel Studio form | Brief JSON | None |
| 2 | **Research and structure** | Brief | LLM with web search | Outline, key points, sources list | None |
| 3 | **Fact check** | Outline and sources | Carousel Studio review panel | Approved or edited key points | **Human gate 1** |
| 4 | **Copywriting** | Approved outline | LLM | Three headline options, slide-by-slide copy, caption, hashtags | None |
| 5 | **Visual direction** | Slide copy | LLM, constrained to the template library | Layout choice, icon or illustration per slide | None |
| 6 | **Render** | Slide JSON | HTML and CSS templates, Playwright or html-to-image | Live preview, then PNG and PDF | None |
| 7 | **Review and export** | Preview | Carousel Studio inline editor | Final PNG set (Instagram 4:5), PDF (LinkedIn), copy deck | **Human gate 2** |

The fact-check gate sits before copywriting on purpose: it is cheaper to correct a key point than to rewrite a finished carousel.

## 3. Data contract

Every stage reads and writes one slide JSON document, so tools are interchangeable and the founder's edits are never lost.

```json
{
  "brief": { "idea": "", "audience": "", "platform": "instagram|linkedin|both", "theme": "animal|edu" },
  "research": { "key_points": [{ "text": "", "source_url": "", "confidence": "high|check" }] },
  "headline_options": ["", "", ""],
  "chosen_headline": "",
  "slides": [
    { "n": 1, "layout": "hook", "title": "", "body": "", "icon": "", "notes": "" }
  ],
  "caption": "",
  "hashtags": [],
  "status": "draft|facts_approved|final"
}
```

The LLM must return valid JSON that matches this contract. A validator rejects and retries malformed output.

## 4. Template library

Six fixed layouts. The AI selects layouts and fills fields. It never invents layout or styling, which is what keeps output consistent without a designer.

| Layout | Use | Fields and limits |
| --- | --- | --- |
| **Hook** | Slide 1 | Title (max 60 characters), subtitle (max 90), brand mark |
| **Statement** | One idea per slide | Title (max 50), body (max 140) |
| **List** | Three to four short points | Title (max 40), up to four items (max 60 each) |
| **Stat** | One striking number | Number, label (max 60), source line |
| **Quote or tip** | Practical advice | Tip text (max 120), small label |
| **CTA** | Last slide | Action line (max 50), handle or link, brand mark |

Character limits are enforced in the prompt and again by the validator, so text never overflows a slide.

**Default structure:** 1 Hook, 5 to 7 content slides, 1 CTA (7 to 9 slides total).

**Imagery rule:** brand illustrations and Lucide icons by default. AI-generated images are optional and manual, because inconsistent AI art across slides undermines the brand.

## 5. Prompt architecture

Three prompts, one per LLM stage. Each has a fixed system prompt and a JSON-only output rule.

- **Research prompt:** "You are a research assistant for \[theme\]. Given the brief, find three to six accurate, citable key points from reputable sources. Return each with its source URL and mark anything you are unsure about as `check`."
- **Copy prompt:** "Using only the approved key points, write three headline options and slide copy that follows the template library and its character limits. Tone: warm, clear, practical. No claims that are not in the approved points."
- **Visual direction prompt:** "For each slide choose a layout from the six allowed and one icon from the allowed icon list. Do not invent layouts."

The copy prompt accepts only approved key points, which prevents unsourced claims from entering the final carousel.

## 6. Tool selection

| Need | Chosen tool | Why | Alternative |
| --- | --- | --- | --- |
| Research and copy | Claude API (default) | Strong structured writing and reliable JSON output | Gemini free tier as the zero-cost option, behind the same config key |
| Orchestration | A small Node or Python script inside Carousel Studio | Free, no extra accounts, version-controlled | Make or n8n for scheduling and multi-step integrations as volume grows |
| Review and editing UI | Carousel Studio (built with opencode) | Gives the founder one place for gates, inline edits and export | Canva free for visual-only tweaks |
| Rendering | HTML and CSS templates with Playwright or html-to-image | Pixel-exact, brand-locked, automatable | Canva templates, manual |
| Visual fallback editor | Canva free, with a hand-built locked template set | Familiar editor for non-technical tweaks | Figma |
| Icons | Lucide | Free, consistent style | Phosphor |
| Storage and history | Local folder of JSON files, optionally synced to Google Drive | Simple and portable | Airtable or Notion |

**Canva free limitation:** Bulk Create, Brand Kit and Magic Resize are not available on the free plan, so Canva stays outside the automated path. The founder pastes the exported copy deck into the Canva template when a manual visual change is needed.

## 7. Carousel Studio specification

**Screens**

1. **New brief:** idea, audience, platform and theme fields
2. **Fact check:** key points with source links, each editable, with approve and remove controls
3. **Draft:** headline picker and a slide strip with live preview, inline text editing, layout switcher and slide reorder
4. **Export:** Instagram PNG set, LinkedIn PDF, caption and hashtags to copy, and the copy deck as text

**Technical notes**

- Built with opencode as a small web app with one server route that calls the LLM and validates JSON
- API key stored in an environment variable and never exposed to the browser
- Templates are plain HTML and CSS using the shared design tokens from Doc 00
- Export sizes: Instagram 1080 × 1350, LinkedIn document PDF at the same ratio
- Every run saves its JSON, so a past carousel can be reopened, edited and re-exported

## 8. Quality controls

| Check | When | How |
| --- | --- | --- |
| Source check | Gate 1 | Every key point shows its source. Anything marked `check` must be resolved or removed. |
| Domain accuracy | Gate 1 | Health content must be reviewed by a licensed vet before real publication. |
| Length and overflow | Automatic | Validator enforces character limits, and a preview flags overflow. |
| Brand consistency | Automatic | Only template-library layouts and token colours are possible. |
| Contrast and legibility | Automatic | Templates are built to AA contrast, with minimum font sizes enforced. |
| Final read | Gate 2 | Founder reads every slide on a phone-sized preview. |

## 9. Sample carousel: "5 signs your pet needs a vet today"

This is the one sample carousel produced with the workflow, in the animal-care theme, Instagram and LinkedIn formats. The slide plan below is the draft that goes through the pipeline. The research stage must source each sign before the copy is finalised.

| Slide | Layout | Draft copy direction |
| --- | --- | --- |
| 1 | Hook | "5 signs your pet needs a vet today" with subtitle "Don't wait and wonder." |
| 2 | Statement | Not eating or drinking for a day or more |
| 3 | Statement | Repeated vomiting or diarrhoea, especially with weakness |
| 4 | Statement | Laboured breathing, or breathing that looks like effort |
| 5 | Statement | Limping, crying out when touched, or a sudden change in energy |
| 6 | Statement | A sudden behaviour change, such as hiding, aggression or restlessness |
| 7 | Quote or tip | "If you're worried, call a vet. A quick call is always better than guessing." |
| 8 | CTA | "Find a vet near you" with the Practo for Animals handle |

The final wording and any added detail must come from the sourced key points. The carousel carries a note that it is general information and not a substitute for veterinary advice, and it should be reviewed by a licensed vet before any real publication.

## 10. Repeatable operating routine

1. Keep a running list of raw ideas in a note or spreadsheet
2. Pick one idea, open Carousel Studio, fill the brief
3. Spend about 10 minutes on the fact-check gate
4. Pick a headline, skim the slides, edit inline
5. Export, copy the caption, and post or schedule
6. Log the carousel and its results (reach, saves, comments) in the history sheet to learn which topics work

## 11. Scale-up path

When volume or team size grows: move orchestration to Make or n8n for scheduled batches, post-to-draft automation to Instagram and LinkedIn scheduling tools, and a content calendar in Airtable or Notion. Upgrade Canva to a paid plan to use Bulk Create and Brand Kit, so non-technical team members can edit in Canva directly.

## 12. Acceptance checklist

- Idea to exported files with only the two human gates
- Output JSON always matches the contract, and malformed output retries
- Both themes render correctly from the same templates
- Exports at the correct pixel sizes with no text overflow
- Sample carousel exported in both formats, with sources recorded
- A past carousel can be reopened, edited and re-exported

## 13. Out of scope

Direct auto-posting to social platforms, video or reel generation, performance analytics integration, multi-user accounts, AI image generation as a default path.
