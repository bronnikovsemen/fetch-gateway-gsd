# Walking Skeleton — Fetch Gateway (MUI Rebuild)

**Phase:** 1
**Generated:** 2026-05-18

## Capability Proven End-to-End

A user can hit `pnpm dev` on port 3001, navigate in the browser to any of the six demo routes (`/`, `/welcome`, `/permissions`, `/select-provider`, `/connecting`, `/success`), and see a Fetch-branded shell (centered white Paper on `#EBF5FF`, Fetch logo, Inter font, MUI theme primary `#2463EC`) rendered without SSR flicker — proving the entire stack (Next.js 15 App Router + MUI + Emotion + AppRouterCacheProvider + next/font + provider catalog + shared components) is correctly wired before any real screen content is built.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 App Router + TypeScript, `src/` directory | Locked by `Main_Fetch_Gateway.md`. App Router is the modern Next.js default and required by `@mui/material-nextjs/v15-appRouter`. |
| UI library | MUI (Material UI) — exclusive | Locked by spec. No Tailwind, shadcn, lucide-react, or class-variance-authority. |
| Styling engine | Emotion (`@emotion/react`, `@emotion/styled`) | MUI's default and peer dependency. |
| Icon library | `@mui/icons-material` only | Locked by spec. Fetch logo is the only non-icon-library mark (inline SVG / `<img>`). |
| Font | Inter via `next/font/google`, exposed as `--font-inter` CSS variable | Standard Next.js 15 font-loading pattern; integrates with MUI theme `typography.fontFamily`. |
| SSR provider | `AppRouterCacheProvider` from `@mui/material-nextjs/v15-appRouter` | Required to prevent MUI SSR flicker on hard reload. Locked by spec. |
| Theme | `src/theme/theme.ts` exports a `createTheme(...)` const with full brand palette | Single source of truth for brand tokens; consumed via `ThemeProvider` in root layout. |
| Provider catalog | `src/lib/providers.ts` — typed array of four providers | Single source of truth (no provider name/color drift across screens). |
| Shared chrome | `FlowLayout`, `FetchLogo`, `PermissionItem` under `src/components/` | Locked by spec file structure. One component per file, named exports preferred. |
| Dev port | `next dev -p 3001` (configured in `package.json` scripts.dev) | Avoid collision with sibling projects on 3000. |
| Logo asset | Inline SVG component inside `FetchLogo.tsx` (placeholder mark in brand blue `#2463EC`) | User has no real logo file yet; placeholder is swappable later without touching consumers. |
| Directory layout | `src/app/*` for routes, `src/components/*` for shared UI, `src/lib/*` for data, `src/theme/*` for theme | Locked by spec file-structure diagram. |
| Deployment target | Local dev only (`next dev -p 3001`) for Phase 1; production deployment is out of scope for v1 | Demo flow is presented from a developer machine. |

## Stack Touched in Phase 1

- [x] Project scaffold (Next.js 15 App Router, TypeScript strict, MUI + Emotion, ESLint via Next default)
- [x] Routing — all six real routes (`/`, `/welcome`, `/permissions`, `/select-provider`, `/connecting`, `/success`) reachable as placeholders wrapped in `FlowLayout`
- [x] Data layer — provider catalog (`src/lib/providers.ts`) consumed by at least one route stub; no database in this project
- [x] UI — `FlowLayout`, `FetchLogo`, `PermissionItem` rendered and visible; theme primary `#2463EC`, page bg `#EBF5FF`, Inter font applied to body
- [x] Deployment — `pnpm dev` (or `npm run dev`) starts the server on port 3001; no remote deploy in scope for v1

## Out of Scope (Deferred to Later Slices)

The following are intentionally NOT in the Walking Skeleton — they belong to Phases 2-4 and must not be smuggled into Phase 1:

- Splash animation (`/` logo scale-in + breathing + 2500ms auto-redirect to `/welcome`) — Phase 2
- Welcome screen real content (heading, body, "Get Started" button) — Phase 2
- Permissions screen real content (6-item grid, "Back"/"Continue" buttons) — Phase 2
- Select-provider real content (MUI Select dropdown, loading state, "Connect" navigation with `?provider=` slug) — Phase 3
- Connecting bridge real behavior (CircularProgress, query-param guard, auto-advance) — Phase 3
- Success real content (green checkmark, "Done" button) — Phase 4
- TypeScript-strict, no-console, no-dead-buttons codebase-wide gates — Phase 4 (QUAL-01..03)
- Real OAuth, real provider API calls, real persistence (localStorage/cookies) — out of scope for v1
- Mobile/responsive layout — desktop-only at 1440px is locked
- Final Fetch logo asset — placeholder inline SVG ships in Phase 1; real asset swap happens whenever the user provides one (any phase)
- `/provider-sign-in`, `/provider-authorize`, `/dashboard` — removed from v1 per project decision

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- **Phase 2 — Pre-Provider Flow:** Replace `/`, `/welcome`, `/permissions` stubs with real screens (FLOW-01, FLOW-02, FLOW-03). Theme, FlowLayout, FetchLogo, and PermissionItem are consumed as-is.
- **Phase 3 — Provider Selection & Connecting Bridge:** Replace `/select-provider` and `/connecting` stubs with real screens (FLOW-04..07). Provider catalog from `src/lib/providers.ts` is consumed by both.
- **Phase 4 — Success & Quality Hardening:** Replace `/success` stub with real screen (FLOW-08) and run codebase-wide QUAL-01..03 gates.

---
*Walking Skeleton frozen at Phase 1 completion. Subsequent phases consume — they do not renegotiate the decisions above.*
