---
phase: 01-foundation-shared-chrome
plan: 03
subsystem: foundation
tags: [routes, app-router, walking-skeleton, fetch-brand, ssr]
dependency_graph:
  requires:
    - "Plan 01-01: Next.js 15 App Router + MUI v9 peer chain + brand-token theme + ThemeRegistry on port 3001"
    - "Plan 01-02: FlowLayout + FetchLogo + PermissionItem components and the typed provider catalog at src/lib/providers.ts"
  provides:
    - "src/app/page.tsx — `/` Splash route stub (overwrites Plan 01-01's proof-of-life placeholder)"
    - "src/app/welcome/page.tsx — `/welcome` route stub"
    - "src/app/permissions/page.tsx — `/permissions` route stub (in-situ smoke test of PermissionItem)"
    - "src/app/select-provider/page.tsx — `/select-provider` route stub (in-situ smoke test of the provider catalog)"
    - "src/app/connecting/page.tsx — `/connecting` route stub"
    - "src/app/success/page.tsx — `/success` route stub"
  affects:
    - "Phase 2 (FLOW-01/02/03) — swaps `/`, `/welcome`, `/permissions` stubs for real screens"
    - "Phase 3 (FLOW-04/05/06/07) — swaps `/select-provider`, `/connecting` stubs for real screens"
    - "Phase 4 (FLOW-08) — swaps `/success` stub for the real confirmation panel"
tech_stack:
  added: []
  patterns:
    - "Every route is a Server Component (no 'use client') — none of the Phase 1 stubs require client behavior; defers RSC→client boundary to Phase 2-4 plans that introduce timers / routing / forms"
    - "Stack `alignItems` consistently lives in `sx` (not as a top-level prop) — same MUI v9.0.1 typing workaround established in Plan 01-02 PermissionItem, now applied across the route layer"
    - "Per-route `maxWidth` is supplied at the call site (440/440/768/498/440/440) — the spec's per-screen sizing is encoded in the route, not in the FlowLayout default"
    - "Smoke-test pattern: rather than spawning a dedicated UI-03/FOUND-07 test page, the in-situ render in the `/permissions` and `/select-provider` stubs proves the component composes inside the real chrome"
key_files:
  created:
    - "src/app/welcome/page.tsx"
    - "src/app/permissions/page.tsx"
    - "src/app/select-provider/page.tsx"
    - "src/app/connecting/page.tsx"
    - "src/app/success/page.tsx"
  modified:
    - "src/app/page.tsx (overwrote Plan 01-01's proof-of-life placeholder with the real `/` Splash stub)"
decisions:
  - "Six route stubs share a single visual template (FetchLogo + h5 heading + body2 muted hint) — uniform shape makes the Walking Skeleton readable at a glance and keeps each stub atomic so Phase 2-4 can replace them one at a time without cross-stub coupling."
  - "Two of the six stubs carry one extra render each — `/permissions` mounts one `<PermissionItem>` (UI-03 smoke test) and `/select-provider` maps the four provider names (FOUND-07 smoke test). The decision is that these are PROOFS the imports work, not previews of the real screens; the spec's Phase 2/3 plans will replace both with full implementations."
  - "Stack `alignItems` placement: Plan 01-02 PermissionItem already discovered that MUI v9.0.1's Stack typing rejects `alignItems` as a top-level prop. The same Rule 1 workaround (move into `sx`) is applied uniformly across all six new pages. Plan 01-02's SUMMARY documents this as the canonical pattern for the codebase."
metrics:
  duration_seconds: 273
  duration_human: "4m 33s"
  completed: "2026-05-18T15:16:07Z"
  tasks_total: 2
  tasks_completed: 2
  files_created: 5
  files_modified: 1
  commits: 1
---

# Phase 1 Plan 03: Six route stubs (Walking Skeleton end-state) — Summary

**One-liner:** Stood up the six demo routes (`/`, `/welcome`, `/permissions`, `/select-provider`, `/connecting`, `/success`) as Server-Component stubs wrapped in the shared `FlowLayout` + `FetchLogo`, with in-situ smoke tests proving `PermissionItem` and the provider catalog compose end-to-end through SSR.

## What landed

- **All six routes are now reachable.** Five new `page.tsx` files were created under `src/app/{welcome,permissions,select-provider,connecting,success}/`, and `src/app/page.tsx` (Plan 01-01's temporary "Fetch Gateway — foundation online" placeholder) was overwritten with the real `/` Splash stub. Every route returns HTTP 200 under `npm run dev` on port 3001.
- **Every stub consumes the shared chrome.** Each page is a Server Component (no `'use client'`) that imports `FlowLayout` and `FetchLogo` from `@/components/*` and wraps its content in `<FlowLayout maxWidth={X}><Stack spacing={3} sx={{ alignItems: 'center' }}>…</Stack></FlowLayout>`. Inside the Stack: `<FetchLogo />`, a route-identifying `<Typography variant="h5">`, and a muted `<Typography variant="body2" color="text.secondary">` flagging the route as a Phase 1 placeholder with a forward-pointer to the phase that will land the real screen (FLOW-01 / FLOW-02 / FLOW-03 / FLOW-04 / FLOW-06/07 / FLOW-08).
- **Per-route `maxWidth` matches the spec.** `/` 440, `/welcome` 440, `/permissions` 768, `/select-provider` 498, `/connecting` 440, `/success` 440. Each route's panel width is supplied at the call site so the Phase 2-4 work that replaces these stubs inherits the correct sizing.
- **`/permissions` smoke-tests `PermissionItem` in situ.** The route additionally renders one `<PermissionItem label="Organization" description="Business profile, contact details, and banking information." />` — proving UI-03 composes correctly inside `FlowLayout` and the bold-label + muted-description visual works at SSR. The full 2x3 grid is deferred to Phase 2 (FLOW-03).
- **`/select-provider` smoke-tests the provider catalog in situ.** The route additionally maps the default-imported `providers` array and renders each provider's `name` as a `<Typography variant="body2">` on its own line — proving FOUND-07 import + iteration wires end-to-end at SSR. All four spec-mandated names (`Gusto`, `ADP`, `Paycom`, `Rippling`) ship in the response body in spec order. The real MUI Select is deferred to Phase 3 (FLOW-04).
- **TypeScript is clean.** `npx tsc --noEmit` exits 0 across the whole project after the Stack `alignItems` workaround was applied.
- **Live HTTP smoke test passed.** `npm run dev` boots on port 3001 (Ready in ~1086ms). All six routes compile and answer HTTP 200. Every response body contains: the FetchLogo SVG with `<title>Fetch</title>`, the literal `--font-inter` CSS variable (from the inlined Emotion `body` declaration), and MUI class prefixes (`MuiBox-root`, `MuiPaper-root`, `MuiStack-root`, `MuiTypography-root`, `mui-w1n5k7`, …) — proving `CssBaseline` ran on the server for every route. The dev log has zero runtime errors (only the pre-existing benign workspace-root lockfile warning from Plan 01-01's environment).

## Tasks executed

| Task | Name                                                                                                | Commit    | Files                                                                                                                                          |
| ---- | --------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Create the six route stubs under `src/app/*/page.tsx`                                               | `8683990` | `src/app/page.tsx`, `src/app/welcome/page.tsx`, `src/app/permissions/page.tsx`, `src/app/select-provider/page.tsx`, `src/app/connecting/page.tsx`, `src/app/success/page.tsx` |
| 2    | End-to-end skeleton smoke test (no file edits — boot dev server, curl all six routes, assert chrome ships in SSR markup) | (no commit — verification-only task with no source-tree changes) | none                                                                                                                                          |

## Verification evidence

**Static checks (Task 1):**

- `npx tsc --noEmit` → exit 0, zero errors.
- All six page files exist at the spec paths and each: imports `FlowLayout` from `@/components/FlowLayout`, imports `FetchLogo` from `@/components/FetchLogo`, references both in render output, and exports a default `Page` component.
- `src/app/permissions/page.tsx` additionally imports `PermissionItem` from `@/components/PermissionItem` and references it.
- `src/app/select-provider/page.tsx` additionally imports the default `providers` from `@/lib/providers` and references it.
- Hygiene: `grep -E "(^|[^a-zA-Z_]): *any( |;|,|>|$)"` across all six files returns empty; `grep "console.log"` across all six files returns empty.
- The previous proof-of-life string `"Fetch Gateway — foundation online"` no longer appears anywhere under `src/app/` — `grep -r` confirms removal.

**Live HTTP smoke (Task 2 — against `npm run dev` on port 3001):**

| Route | HTTP | FetchLogo `<title>Fetch</title>` | `--font-inter` in inline CSS | MUI class prefix | Route heading | Smoke-test markers |
| ----- | ---- | -------------------------------- | ---------------------------- | ---------------- | ------------- | ------------------ |
| `/` | 200 | ✓ | ✓ | ✓ | "Splash" | — |
| `/welcome` | 200 | ✓ | ✓ | ✓ | "Welcome" | — |
| `/permissions` | 200 | ✓ | ✓ | ✓ | "Permissions" | "Organization" (PermissionItem rendered) |
| `/select-provider` | 200 | ✓ | ✓ | ✓ | "Select Provider" | "Gusto", "ADP", "Paycom", "Rippling" (catalog mapped) |
| `/connecting` | 200 | ✓ | ✓ | ✓ | "Connecting" | — |
| `/success` | 200 | ✓ | ✓ | ✓ | "Success" | — |

Dev server logged: `✓ Ready in 1086ms`, then six clean compile + 200 pairs (`✓ Compiled / in 522ms (1079 modules)`, `GET / 200 in 709ms`, etc.) with no runtime errors. Server was killed cleanly at task end and port 3001 confirmed free via `lsof -ti:3001` returning empty.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] MUI v9.0.1 Stack rejects `alignItems` as a top-level prop (re-applied)**

- **Found during:** Task 1, immediately after writing all six page files, when `npx tsc --noEmit` failed with seven TS2769 "No overload matches this call" errors (one per Stack in the six files; `select-provider` has two Stacks).
- **Root cause:** Same MUI v9.0.1 typing regression that Plan 01-02 already discovered and documented in `PermissionItem`. Neither of `Stack`'s two type overloads currently includes `alignItems` as a direct prop, even though the runtime accepts it.
- **Fix:** Rewrote `alignItems="center"` → `sx={{ alignItems: 'center' }}` on every Stack in every new page file (seven Stacks total). Runtime output is identical (Stack applies `alignItems` to its flex container either way; SSR markup confirms the centered layout).
- **Why this is Rule 1 not Rule 4:** This is the same typing escape hatch the Plan 01-02 SUMMARY already canonicalized as the codebase pattern. Re-applying an already-decided workaround across new files is correctness, not an architectural change.
- **Files modified:** All six page files (the fix was applied inline before the Task 1 commit, so it ships in the same `8683990` commit as the original file authorship).
- **Commit:** `8683990` (rolled into Task 1)

No other deviations. Both tasks executed as the plan described.

### Task 2 commit decision (non-deviation note)

Task 2 is verification-only — boot dev server, curl the six routes, assert SSR markers. It does not edit any source files. Per the `task_commit_protocol` ("commit task-related files individually"), there is nothing to commit for Task 2: a `git commit --allow-empty` would record no behavior. Task 2's outcome is captured in this SUMMARY's `## Verification evidence` table.

## Authentication gates

None — Phase 1 has no auth surface, no API keys, no external IO. Smoke test runs against loopback only.

## Known Stubs

The plan's entire deliverable is intentional, well-documented stubs. Every one of the six route pages is a placeholder by design, flagged in its own JSDoc comment with the Phase + FLOW-ID that will replace it:

| Route | Stub status | Replaced by |
| ----- | ----------- | ----------- |
| `/` | Heading + muted hint placeholder | Phase 2 (FLOW-01) — splash animation + auto-redirect |
| `/welcome` | Heading + muted hint placeholder | Phase 2 (FLOW-02) — heading, body copy, "Get Started" button |
| `/permissions` | Heading + muted hint + one sample `PermissionItem` (smoke test) | Phase 2 (FLOW-03) — full 2x3 grid, Back/Continue buttons |
| `/select-provider` | Heading + muted hint + four provider name lines (smoke test) | Phase 3 (FLOW-04) — MUI Select dropdown, Back/Connect buttons |
| `/connecting` | Heading + muted hint placeholder | Phase 3 (FLOW-06/07) — spinner + ?provider= guard + auto-advance |
| `/success` | Heading + muted hint placeholder | Phase 4 (FLOW-08) — green checkmark + "Connected successfully" + "Done" button |

These stubs are plan-sanctioned. The Phase 1 goal is precisely "every route reachable, every shared component consumed at least once" — full screen content is explicitly the work of Phase 2-4. Each stub's JSDoc names its successor plan so the future executor knows exactly which file to swap.

## Threat Flags

No new threat surface beyond the plan's `<threat_model>`. All six routes serve static SSR HTML compiled from local source files. No query-param parsing yet (deferred to Phase 3 `/connecting`), no user input, no auth, no persistence, no external IO. Dev server still binds to loopback only.

## Deferred Issues

None new. The `postcss <8.5.10` moderate transitive vulnerability noted in `.planning/phases/01-foundation-shared-chrome/deferred-items.md` from Plan 01-01 remains deferred to Phase 4 hardening.

## Phase 1 requirements satisfied

- **FOUND-06** ✅ Route stubs exist for all six routes: `/`, `/welcome`, `/permissions`, `/select-provider`, `/connecting`, `/success`. Every one returns HTTP 200 under `npm run dev` on port 3001 with themed SSR markup containing FetchLogo + `--font-inter` + MUI class prefixes.

This satisfies the last open Phase 1 requirement. With FOUND-01..07, UI-01..03, QUAL-04 all complete, Phase 1 (foundation-shared-chrome) is end-to-end demonstrable: a developer can `npm run dev` and click through every route to see the Fetch-branded shell. Phase 2-4 work is now confirmed to be "replace stubs with real screens" rather than "build new routes from scratch."

## Self-Check: PASSED

Created files (verified to exist):
- `src/app/welcome/page.tsx` — FOUND
- `src/app/permissions/page.tsx` — FOUND
- `src/app/select-provider/page.tsx` — FOUND
- `src/app/connecting/page.tsx` — FOUND
- `src/app/success/page.tsx` — FOUND

Modified files (verified):
- `src/app/page.tsx` — FOUND (Plan 01-01's "Fetch Gateway — foundation online" replaced with the `/` Splash stub)

Commits (verified in `git log`):
- `8683990` feat(01-03): add six route stubs wired to FlowLayout + FetchLogo — FOUND
