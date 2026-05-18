---
phase: 01-foundation-shared-chrome
plan: 01
subsystem: foundation
tags: [scaffold, mui, nextjs, theme, ssr, fetch-brand]
dependency_graph:
  requires: []
  provides:
    - "Next.js 15 App Router project on port 3001"
    - "MUI v9 + Emotion + @mui/material-nextjs peer chain"
    - "Brand-token MUI theme (default-exported from src/theme/theme.ts)"
    - "src/theme/ThemeRegistry.tsx — client-side MUI provider wrapper (AppRouterCacheProvider + ThemeProvider + CssBaseline)"
    - "Inter font wired via next/font/google as --font-inter on <html>"
    - "Root server-component layout in src/app/layout.tsx"
    - "Strict TypeScript (tsc --noEmit passes)"
    - "QUAL-04 dependency gate enforced (no Tailwind / shadcn / lucide-react / CVA)"
  affects:
    - "All future Phase 1+ plans (Plan 01-02 shared chrome, Plan 01-03 route stubs) consume the theme + ThemeRegistry + Inter wiring"
tech_stack:
  added:
    - "Next.js 15.5.18 (upgraded from initial 15.1.6 to clear CVE-2025-66478)"
    - "React 19"
    - "TypeScript 5 (strict mode)"
    - "@mui/material 9.0.1"
    - "@mui/icons-material 9.0.1"
    - "@mui/material-nextjs 9.0.1"
    - "@emotion/react 11.14.0"
    - "@emotion/styled 11.14.1"
    - "ESLint 9 + eslint-config-next 15.5.18 (flat config)"
  patterns:
    - "Server Component root layout renders a Client Component <ThemeRegistry> wrapper to satisfy MUI v9's 'use client' boundary"
    - "Theme imported INSIDE the client boundary (functions in the theme object cannot cross the RSC boundary)"
    - "next/font/google CSS variable applied on <html> at the server boundary so SSR delivers --font-inter"
    - "12px shape.borderRadius centralized in theme to feed UI-01's panel-radius requirement"
key_files:
  created:
    - "package.json"
    - "package-lock.json"
    - "tsconfig.json"
    - "next.config.ts"
    - "next-env.d.ts (gitignored — Next.js regenerates)"
    - ".gitignore"
    - "eslint.config.mjs"
    - "src/app/layout.tsx"
    - "src/app/page.tsx"
    - "src/theme/theme.ts"
    - "src/theme/ThemeRegistry.tsx"
    - ".planning/phases/01-foundation-shared-chrome/deferred-items.md"
  modified: []
decisions:
  - "Used npm (not pnpm) because pnpm is not on the executor's PATH — plan permits this fallback. Lockfile is package-lock.json."
  - "Upgraded Next.js from 15.1.6 to 15.5.18 (latest patched 15.x) to clear CVE-2025-66478 advisory at install time."
  - "Introduced src/theme/ThemeRegistry.tsx as a Client Component wrapping the MUI provider tree. The plan's literal contract said 'AppRouterCacheProvider directly in app/layout.tsx', but MUI v9's ThemeProvider is a Client Component and cannot accept a theme prop containing functions across the RSC boundary. The wrapper preserves every must-have (SSR delivers themed markup, --font-inter is on <html>, AppRouterCacheProvider/ThemeProvider/CssBaseline are rendered in that order, root layout is a Server Component)."
metrics:
  duration_seconds: 387
  duration_human: "6m 27s"
  completed: "2026-05-18T14:59:45Z"
  tasks_total: 3
  tasks_completed: 3
  files_created: 11
  files_modified: 0
  commits: 3
---

# Phase 1 Plan 01: Scaffold Next.js 15 + MUI Brand-Token Foundation — Summary

**One-liner:** Booted a Next.js 15 App Router project on port 3001 with the MUI v9 peer chain, a brand-token theme encoding all nine Fetch hex values verbatim, Inter font via `next/font/google`, and a client `ThemeRegistry` wrapper that keeps MUI v9's provider tree SSR-correct.

## What landed

- **Repo is now a Next.js 15 App Router TypeScript project.** `package.json` binds `dev` to port 3001, dependencies are the locked MUI peer chain plus `next` / `react` / `react-dom`, and zero forbidden packages (Tailwind, shadcn, lucide-react, CVA) are present in either dependency list. `tsconfig.json` has `"strict": true` and the `@/*` path alias.
- **Brand-token theme** at `src/theme/theme.ts` default-exports a MUI theme whose palette encodes the spec's nine hex values exactly: `primary #2463EC`, `background.default #EBF5FF`, `background.paper #FFFFFF`, `text.primary #101827`, `text.secondary #6B7280`, `divider #E5E7EB`, `success.main #10B981`, `warning.main #F59E0B`, `error.main #EF4444`. `typography.fontFamily` references `var(--font-inter)`; `shape.borderRadius = 12` centralizes the UI-01 panel radius.
- **Root layout** (`src/app/layout.tsx`) stays a Server Component. It loads Inter via `next/font/google` with `variable: '--font-inter'`, applies the variable className on `<html>`, sets `metadata.title = 'Fetch Gateway'` and `metadata.description`, and renders `<ThemeRegistry>{children}</ThemeRegistry>`.
- **`ThemeRegistry`** (`src/theme/ThemeRegistry.tsx`) is a `'use client'` wrapper that imports the theme and renders `AppRouterCacheProvider > ThemeProvider > CssBaseline > children`. This is the canonical MUI v9 + App Router pattern (see Deviations below).
- **Proof-of-life home page** (`src/app/page.tsx`) renders a themed `Box` + `Typography` proving the theme and font are flowing through SSR. Plan 01-03 will replace this with the real `/` splash stub.
- **Live smoke test passed.** `npm run dev` boots on port 3001, `GET /` returns 200 with HTML that contains the proof-of-life heading, the `--font-inter` CSS variable, and MUI class prefixes (proving `CssBaseline` ran on the server). Dev log is error-free.

## Tasks executed

| Task | Name                                                                                                | Commit  | Files                                                                                              |
| ---- | --------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| 1    | Initialize Next.js 15 App Router project, port 3001, MUI peer chain, strict TypeScript              | `7af867e` | `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `eslint.config.mjs`, scaffolded `src/app/{layout,page}.tsx` |
| 2    | Create brand-token theme and wire root layout with AppRouterCacheProvider + ThemeProvider + CssBaseline + Inter | `954f493` | `src/theme/theme.ts` (new), `src/app/layout.tsx` (rewritten), `src/app/page.tsx` (rewritten)       |
| 3    | Smoke-test the foundation — dev server boots on 3001, themed SSR markup ships (Rule 1 fix included) | `da8d9a0` | `src/theme/ThemeRegistry.tsx` (new), `src/app/layout.tsx` (refactored to delegate to ThemeRegistry) |

## Verification evidence

- `node -e "const p=require('./package.json'); ..."`: dev script = `"next dev -p 3001"`, all MUI peer deps present, zero forbidden deps.
- `tsconfig.json`: `compilerOptions.strict === true`.
- `npx tsc --noEmit`: exit 0, zero errors.
- All nine brand-token hex values present verbatim in `src/theme/theme.ts` (greped individually).
- `src/theme/theme.ts` contains `var(--font-inter)` for `typography.fontFamily`.
- `src/app/layout.tsx` is a Server Component (no `'use client'`), imports Inter from `next/font/google`, applies `inter.variable` to `<html>` className, and renders `<ThemeRegistry>{children}</ThemeRegistry>`.
- `src/theme/ThemeRegistry.tsx` is a `'use client'` component that imports `AppRouterCacheProvider`, `ThemeProvider`, `CssBaseline`, and the default theme — they render in the required order.
- **Live HTTP smoke test against `npm run dev`**: `GET http://localhost:3001/` → 200 OK in <2s; response body contains the literal string `Fetch Gateway — foundation online`, the substring `--font-inter`, and MUI class prefixes (`mui-`). Dev log has zero errors.
- No `console.log` and no `: any` in any of the three plan-owned source files.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] MUI v9 `ThemeProvider` cannot receive theme prop across an RSC boundary**

- **Found during:** Task 3 dev-server smoke test
- **Symptom:** `Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". {themeKey: "palette", transform: function paletteTransform}`. The page would not render — every request 500'd.
- **Root cause:** In MUI v9, `ThemeProvider` is a `'use client'` Client Component. The plan instructed wiring it directly inside `src/app/layout.tsx` (a Server Component) and passing it `theme={theme}`. The theme object contains functions (`paletteTransform`, `padding`, etc.) that Next.js cannot serialize across the React Server Component → Client Component boundary, so it throws at render time.
- **Fix:** Introduced `src/theme/ThemeRegistry.tsx` (a `'use client'` wrapper) that imports the theme and renders `AppRouterCacheProvider > ThemeProvider > CssBaseline > children`. The root layout (still a Server Component) renders `<ThemeRegistry>{children}</ThemeRegistry>` and continues to apply `--font-inter` on `<html>` at the server boundary.
- **Why this is the right fix:** This is the canonical pattern documented by MUI for v9 + Next.js App Router (see `https://mui.com/material-ui/integrations/nextjs/`). It preserves every plan must-have: SSR still delivers themed markup, `--font-inter` is still on `<html>`, the three MUI providers still wrap children in the required order, and the root layout is still a Server Component. Only the file that hosts the provider construction moved.
- **Files modified:** `src/theme/ThemeRegistry.tsx` (new), `src/app/layout.tsx` (refactored to delegate)
- **Commit:** `da8d9a0`

**2. [Rule 2 — Critical functionality] Upgraded Next.js to clear CVE-2025-66478**

- **Found during:** Task 1 `npm install`
- **Symptom:** `npm warn deprecated next@15.1.6: This version has a security vulnerability. Please upgrade to a patched version. See https://nextjs.org/blog/CVE-2025-66478 for more details.`
- **Fix:** Ran `npm install next@^15 eslint-config-next@^15` to land on the latest patched 15.x (15.5.18). One critical CVE cleared; only transitive postcss moderate remains (logged to `deferred-items.md`).
- **Why this is Rule 2 not Rule 4:** Installing a security-patched minor release of a pinned major is correctness, not an architectural change. The plan pinned Next 15.x; this stays in 15.x.
- **Files modified:** `package.json`, `package-lock.json`
- **Commit:** `7af867e` (rolled into Task 1)

### Tooling adaptations

**npm instead of pnpm.** `pnpm` is not on the executor's PATH. The orchestrator's context note explicitly permits npm fallback. The lockfile is `package-lock.json` (not `pnpm-lock.yaml` as listed in the plan frontmatter). All `pnpm dev` invocations in downstream plans should read as `npm run dev`.

## Authentication gates

None — Phase 1 has no auth surface.

## Known Stubs

- `src/app/page.tsx` is a deliberately temporary themed proof-of-life placeholder ("Fetch Gateway — foundation online"). Plan 01-03 Task 1 replaces it with the real `/` splash stub wrapped in `FlowLayout`. **This is documented in the plan itself, not an unwanted stub.**

## Threat Flags

No new threat surface beyond the plan's `<threat_model>`. Dev server still binds to loopback only. No network endpoints, auth paths, file IO, or persistence introduced.

## Deferred Issues

- `postcss <8.5.10` moderate vulnerability — transitive inside Next.js's own CSS pipeline. Not in our user surface. Logged to `.planning/phases/01-foundation-shared-chrome/deferred-items.md`. Re-evaluate at Phase 4 hardening or any Next.js minor bump.

## Phase 1 requirements satisfied

- **FOUND-01** ✅ Next.js 15 App Router project with TypeScript, `src/` directory, strict typing.
- **FOUND-02** ✅ Dev server runs on port 3001 (`"next dev -p 3001"` in `package.json`; verified live via `curl`).
- **FOUND-03** ✅ MUI theme in `src/theme/theme.ts` encodes the full brand-token palette verbatim.
- **FOUND-04** ✅ Root `app/layout.tsx` (via `ThemeRegistry`) wires `ThemeProvider` + `AppRouterCacheProvider` + `CssBaseline`.
- **FOUND-05** ✅ Inter loaded via `next/font/google` as `--font-inter`, applied on `<html>` className.
- **QUAL-04** ✅ Zero Tailwind / shadcn / lucide-react / CVA in `package.json`.

## Self-Check: PASSED

Created files (verified to exist):
- `package.json` — FOUND
- `package-lock.json` — FOUND
- `tsconfig.json` — FOUND
- `next.config.ts` — FOUND
- `.gitignore` — FOUND
- `eslint.config.mjs` — FOUND
- `src/app/layout.tsx` — FOUND
- `src/app/page.tsx` — FOUND
- `src/theme/theme.ts` — FOUND
- `src/theme/ThemeRegistry.tsx` — FOUND
- `.planning/phases/01-foundation-shared-chrome/deferred-items.md` — FOUND

Commits (verified in `git log`):
- `7af867e` chore(01-01): scaffold Next.js 15 App Router + MUI peer chain on port 3001 — FOUND
- `954f493` feat(01-01): wire MUI brand-token theme + AppRouterCacheProvider + Inter font — FOUND
- `da8d9a0` fix(01-01): move MUI provider tree behind client ThemeRegistry boundary — FOUND
