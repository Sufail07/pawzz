# Pawzz Monorepo

Monorepo containing the Pawzz project applications and product specification documents.

## Applications

| Workspace | Folder | Description | Vercel Deployment |
|---|---|---|---|
| `discovery-mvp` (`pawzz`) | [`discovery-mvp/`](./discovery-mvp) | Animal-Care Discovery MVP | https://discovery-mvp.vercel.app/ |
| `carousel-studio` (`pawzz-carousel-studio`) | [`carousel-studio/`](./carousel-studio) | AI Carousel Content System | https://carousel-studio-seven-sand.vercel.app/ |
| `course-landing` (`lumen-ai-academy`) | [`course-landing/`](./course-landing) | AI Course Landing Page | https://course-landing-xi.vercel.app/ |

## Documentation

- [`00 — Overview & Shared Foundations.md`](./00%20—%20Overview%20%26%20Shared%20Foundations.md)
- [`01 — Animal-Care Discovery MVP.md`](./01%20—%20Animal-Care%20Discovery%20MVP.md)
- [`02 — AI Course Landing Page.md`](./02%20—%20AI%20Course%20Landing%20Page.md)
- [`03 — AI Carousel Content System.md`](./03%20—%20AI%20Carousel%20Content%20System.md)
- [`04 — Showcase Website Design Spec.md`](./04%20—%20Showcase%20Website%20Design%20Spec.md)
- [`AI_Skills_Studio_Sample_Syllabus.pdf`](./AI_Skills_Studio_Sample_Syllabus.pdf)

## Getting Started

Requires Node.js >= 20.

```bash
# Install dependencies for all workspaces
npm install

# Run an app in development
npm run dev:discovery
npm run dev:course
npm run dev:carousel

# Build an app
npm run build:discovery
npm run build:course
npm run build:carousel

# Build all apps
npm run build:all
```

You can also target a workspace directly:

```bash
npm run dev -w discovery-mvp
npm run dev -w course-landing
npm run dev -w carousel-studio
```

## Notes

- Each app is deployed independently on Vercel from its workspace folder.
- Workspace-local commands and environment configuration remain inside each app directory (see each app's README/config).
