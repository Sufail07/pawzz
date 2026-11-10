# 01 — Animal-Care Discovery MVP

*Scope and architecture for the Practo for Animals homepage, results page and provider profile prototype · Depends on Doc 00*

## 1. Goal and success criteria

**Goal:** Let a pet owner in India find the right animal-care provider quickly, whether the need is planned (a vaccination, boarding for a trip) or urgent (an injured stray, a pet that won't eat), and trust what they find.

**The prototype succeeds if a first-time visitor can:**

1. Reach a relevant provider list in two taps or fewer from the homepage
2. Reach an emergency provider in one tap from the homepage
3. Judge a provider's fit from the card alone (type, distance, open now, verified)
4. Contact a provider from the profile in one tap (call or WhatsApp)
5. Report wrong information without creating an account

## 2. Users and jobs to be done

| User | Job to be done | Design implication |
| --- | --- | --- |
| Pet owner, planned need | "Find a trusted vet or boarding near me that fits my pet and budget." | Strong search, filters, comparison-friendly cards |
| Pet owner, urgent need | "My pet needs help right now. Who is open and close?" | Emergency fast-lane, open-now and 24x7 as first-class signals |
| Rescuer or animal lover | "I found an injured animal. Who can take it in?" | NGO and ambulance categories, plain language, call-first CTAs |
| Provider or NGO | "Get my services listed and keep them accurate." | List Your Business CTA, lightweight claim flow |
| Community contributor | "This listing is wrong. Let me fix it." | Submit a Correction on every profile |

## 3. MVP feature set

| Priority | Feature |
| --- | --- |
| **Must** | Homepage with search hero and category chips for all six provider types |
| **Must** | Emergency fast-lane (24x7 vets, ambulances) |
| **Must** | Results page with list view, filters, sort and result count |
| **Must** | Provider profile with contact CTAs, services, hours, location and verification status |
| **Must** | List Your Business form |
| **Must** | Submit a Correction form |
| **Should** | Map view toggle on results |
| **Should** | Species filter (dog, cat, birds, exotics, livestock) |
| **Should** | Shortlist (save providers on the device, no login) |
| **Later** | User accounts, reviews, online booking, payments, provider dashboard |
| **Later** | Multi-language support (English-first, language toggle shown as roadmap) |

The MVP is a directory with trust signals. Booking and reviews are deliberately deferred: they need supply density and moderation before they add value.

## 4. Information architecture

**Screens in the clickable prototype**

1. **Homepage** → 2. **Results** → 3. **Provider profile**
2. **List Your Business** and **Submit a Correction** open as full-screen sheets on mobile and modals on desktop.

**Provider categories (six):** Veterinary clinics, Animal hospitals, Boarding and daycare, Diagnostics and labs, Ambulances, NGOs and rescue.

## 5. Homepage specification

Section order, top to bottom:

1. **Emergency strip.** Red, always visible. Copy: "Emergency? Find 24x7 vets and ambulances near you." One tap opens results pre-filtered to 24x7 and open now.
2. **Hero search.** Headline, then a two-field search (What do you need? Where?) with a location detect button. Primary CTA: **Find a Vet**.
3. **Category chips.** Six tiles with icons. Secondary CTA: **Explore Services**.
4. **Popular needs.** Quick links such as Vaccination, Spay and neuter, Boarding while travelling, Blood tests, Rescue help.
5. **Featured and verified providers.** Horizontal card scroller using sample data.
6. **How it works and trust.** Three steps, plus the verification explainer (what "Verified" means and when each listing was last checked).
7. **For providers and NGOs.** Block with the **List Your Business** CTA.
8. **Community corrections strip.** Short explainer with the **Submit a Correction** CTA.
9. **Footer.** About, contact, privacy, language toggle (roadmap).

## 6. Search and filter model

**Search inputs:** service or provider type (free text with suggestions), location (city, area or pin code, plus detect location), optional species.

**Universal filters (all provider types)**

| Filter | Type |
| --- | --- |
| Open now | Toggle |
| 24x7 | Toggle |
| Distance | Slider (1, 3, 5, 10, 25 km) |
| Species treated | Multi-select chips |
| Verified only | Toggle |
| Home visit or pickup available | Toggle |
| Languages spoken | Multi-select |
| Sort | Relevance, Nearest, Open now first, Recently verified |

**Type-specific filters**

| Provider type | Extra filters |
| --- | --- |
| Clinics and hospitals | Services (vaccination, surgery, dental, dermatology, X-ray, ICU), emergency admission, specialist available |
| Boarding and daycare | Dogs or cats, cage-free, AC, CCTV, daily updates, vaccination required, price band |
| Diagnostics | Test type (blood, imaging, pathology), home sample collection, report turnaround |
| Ambulances | Response time band, oxygen support, large-animal capable, 24x7 |
| NGOs and rescue | Rescue, shelter, adoption, sterilisation drives, accepts donations, volunteer needed |

On mobile, filters open in a bottom sheet with an applied-filters chip row above results and a sticky "Show N results" button.

## 7. Provider data schema

**Core fields (every provider)**

`id`, `name`, `type`, `description`, `address`, `area`, `city`, `pin_code`, `lat`, `lng`, `phone`, `whatsapp`, `website`, `opening_hours` (per weekday, with 24x7 flag), `species_treated[]`, `languages[]`, `services[]`, `photos[]`, `verification_status` (unverified, phone-verified, visited), `last_verified_on`, `claimed` (boolean), `source`

**Type-specific extensions**

- Hospital: `emergency_admission`, `icu`, `specialists[]`
- Boarding: `price_per_day_range`, `facility_features[]`, `vaccination_requirements`
- Diagnostics: `test_catalogue[]`, `home_collection`, `turnaround_hours`
- Ambulance: `service_area_km`, `typical_response_minutes`, `equipment[]`, `large_animal`
- NGO: `focus[]` (rescue, shelter, adoption, sterilisation), `donation_link`, `volunteer_contact`, `registration_number`

Verification status and last-verified date are shown on every card. This is the main trust mechanism for a directory that starts with imperfect data.

## 8. Provider card and profile content

**Card (results list):** photo, name, type badge, distance, open-now or closed status, verified badge, two to three key service tags, one primary action (Call). Type-specific line: response time for ambulances, price from for boarding, adoption available for NGOs.

**Profile page, in order:**

1. Header: name, badges (Verified, 24x7), rating placeholder omitted in MVP
2. Sticky action bar on mobile: **Call**, **WhatsApp**, **Directions**
3. Services and species treated
4. Hours with today highlighted
5. Location map and address
6. Type-specific block (facilities, test list, equipment, or how to help)
7. "Last verified on" line with **Submit a Correction** link
8. Provider claim prompt: "Is this your business? List or update it"

## 9. CTA map

| CTA | Placement | Role | Destination | Metric |
| --- | --- | --- | --- | --- |
| **Find a Vet** | Hero search | Primary | Results, filtered to vets | Search starts |
| **Emergency help** | Red strip, nav | Primary (urgent) | Results, 24x7 and open now | Emergency taps |
| **Explore Services** | Category tiles | Secondary | Results by category | Category clicks |
| **Call, WhatsApp, Directions** | Card and profile | Conversion | Phone, WhatsApp, maps | Contact clicks per profile |
| **List Your Business** | Header, homepage block, footer | Supply growth | Provider form | Form submissions |
| **Submit a Correction** | Every profile, homepage strip | Data quality | Correction form | Corrections submitted |
| **Save to shortlist** | Cards | Retention | Local device storage | Shortlist adds |

CTA hierarchy rule: one primary action per screen region, amber fill for the main conversion, teal outline for secondary, red reserved for emergency only.

## 10. Trust and data quality strategy

- Three-level verification badge with a plain-language explainer
- "Last verified on" date on every listing
- Submit a Correction: a four-field form (what is wrong, correct information, optional proof link, optional contact) that needs no login
- Providers can claim and update listings through List Your Business
- Corrections and new listings enter a moderation queue, which in the prototype is a Google Sheet

## 11. Making it attractive, intuitive and mobile-friendly

- **Mobile-first layout:** design at 375 px first, then scale up to a two-column results layout with a sticky map at 1024 px and above.
- **Thumb zone:** primary actions sit in the bottom third. The profile has a sticky action bar and results have a sticky filter and map toggle.
- **Visual warmth:** cream surfaces, rounded cards, real-feeling illustration for empty states, and friendly microcopy. The emergency colour is used sparingly so it keeps its meaning.
- **Clarity:** icons always paired with labels, skeleton loading states, a no-results state that suggests widening filters or calling the nearest 24x7 provider.
- **Performance:** static site, optimised images, lazy-loaded map.
- **Accessibility:** AA contrast, 44 px tap targets, visible focus states, semantic headings, reduced-motion support.

## 12. Prototype build specification

- **Stack:** React with Vite and Tailwind CSS, using the design tokens from Doc 00. Hosted on a free static host.
- **Data:** A local JSON file of about 14 fictional providers, covering all six types across Kerala and Bengaluru, with a visible "Sample data" label.
- **Working interactions:** category chips, text and location search against sample data, all universal filters, sort, result count, list and map toggle, shortlist saved on the device, provider profile routing, and both forms with validation and a success state. Forms write to a Google Sheet through the same Apps Script pattern as Doc 02.
- **Map:** Leaflet with OpenStreetMap tiles. If it threatens the time budget, fall back to a styled static map illustration.
- **Figma deliverable:** tokens, the three key screens at mobile and desktop widths, and the card component variants.

## 13. Acceptance checklist

- Homepage to emergency results in one tap
- Homepage to filtered results in two taps or fewer
- All six provider types appear with correct card variants
- Filters change results and counts correctly
- Sticky call bar present on mobile profiles
- Both forms submit and show confirmation
- No horizontal scroll at 375 px, AA contrast on all text
- Every sample record labelled as fictional

## 14. Out of scope

User accounts, reviews and ratings, online booking, payments, provider dashboard, real data scraping, push notifications, native apps.
