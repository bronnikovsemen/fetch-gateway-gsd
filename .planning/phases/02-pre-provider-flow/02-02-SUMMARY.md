---
phase: 02-pre-provider-flow
plan: 02
subsystem: splash-screen
tags: [mui, splash, animation, client-component, auto-redirect, mvp]
dependency_graph:
  requires:
    - "Plan 01-02: FetchLogo inline-SVG component with stable size/color/title API"
    - "Plan 01-03: route stub at src/app/page.tsx that this plan replaces"
  provides:
    - "src/app/page.tsx — real `/` splash Client Component (scale-in + breathing + auto-redirect to /welcome at 2500ms)"
    - "Canonical client-component pattern (`'use client'` + `useRouter` + `useEffect` + cleanup) that Phase 3's `/connecting` auto-advance will mirror"
  affects:
    - "Phase 3 Plan for `/connecting` — same client-side `useEffect` + setTimeout + cleanup + `router.push` pattern; can reference this plan's implementation as the canonical shape"
tech_stack:
  added: []
  patterns:
    - "Client Component with `'use client'` directive on line 1; mounts `useEffect` for a setTimeout-driven `router.push` and returns `clearTimeout` cleanup to prevent stale-state navigation on unmount"
    - "Module-scope Emotion `keyframes` (imported from `@emotion/react`) chained via the MUI `sx.animation` shorthand on a wrapper `Box` — scaleIn 500ms then breathe 2s infinite with a 500ms delay so the loop starts exactly when scale-in finishes"
    - "Page background uses the MUI theme token (`bgcolor: 'background.default'`) so the brand sky-blue resolves through the theme rather than a hardcoded hex literal — keeps the file portable if the brand token ever moves"
key_files:
  created: []
  modified:
    - "src/app/page.tsx"
decisions:
  - "Splash uses a bare `Box` flex container, NOT `FlowLayout`. The spec's `### / — Splash` section is explicit that the splash sits directly on the `#EBF5FF` page background with no white panel chrome — every other route in the flow keeps the panel. Phase 1's stub used `FlowLayout` only as a smoke convenience; the real screen drops it."
  - "Keyframes declared at module scope, not inside the component. Emotion's serialization caches per-keyframes identity, so module-scope declaration prevents React from churning a new keyframe object on every render (a subtle perf footgun in animation-heavy client components)."
  - "Breathing animation starts at a 500ms delay (chained via `${scaleIn} 500ms ease-out, ${breathe} 2s ease-in-out 500ms infinite`) so the pulse kicks in exactly when scale-in finishes — no overlap, no visible discontinuity. The 4% pulse amplitude (`scale(1.04)`) is deliberately subtle to avoid a jarring 'bouncing logo' impression."
  - "Inline brace setTimeout `setTimeout(() => { router.push('/welcome'); }, 2500)` was kept on a single line (rather than the multi-line block the editor's default formatter prefers) so the plan's acceptance-criteria grep `setTimeout\\([^,]+,\\s*2500\\)` matches. Functionally identical to a multi-line form; choice was driven by the gate, not by readability preference."
  - "Comment block intentionally avoids the `#EBF5FF` and `FlowLayout` literals. The acceptance-criteria grep gates count raw-string occurrences (not just usages-in-code), so even a documentation reference would trip the 'no hardcoded hex' gate. The rationale that would have lived in the comment is captured here in the SUMMARY instead."
metrics:
  duration_seconds: 124
  duration_human: "2m 4s"
  completed: "2026-05-18T16:09:55Z"
  tasks_total: 1
  tasks_completed: 1
  files_created: 0
  files_modified: 1
  commits: 1
---

# Phase 2 Plan 02: `/` Splash Screen — Summary

**One-liner:** Replaced the Phase 1 `/` placeholder (FetchLogo + "Splash (`/`)" heading + muted-hint paragraph wrapped in FlowLayout) with the real splash screen — centered Fetch logo on the themed sky-blue page background, "Retirement runs on Fetch" tagline, 500ms scale-in followed by an infinite 2s breathing pulse, and a `useEffect`-driven `setTimeout` that calls `router.push('/welcome')` after 2500ms with a `clearTimeout` cleanup to prevent stale navigation on unmount.

## What landed

- **`src/app/page.tsx` is now a Client Component** with `'use client'` on line 1, importing `useEffect` from `react`, `useRouter` from `next/navigation`, `keyframes` from `@emotion/react`, `Box` / `Stack` / `Typography` from `@mui/material` (per-module deep imports — matching the existing repo style established by Plans 01-02 / 01-03), and `FetchLogo` from `@/components/FetchLogo`. No new packages added; `@emotion/react ^11.14.0` was already a peer dep through the MUI install chain.
- **Two module-scope keyframes drive the animation.** `scaleIn` runs `transform: scale(0.6) → scale(1)` with `opacity: 0 → 1` over 500ms ease-out. `breathe` is a subtle 4% pulse — `0% scale(1) / 50% scale(1.04) / 100% scale(1)` — over 2s ease-in-out infinite. The MUI `Box` wrapping `<FetchLogo size={100} />` applies both via `sx.animation`: `${scaleIn} 500ms ease-out, ${breathe} 2s ease-in-out 500ms infinite`. The breathe animation's 500ms delay makes the pulse start precisely when scale-in completes.
- **Layout is a bare flex `Box`, NOT `FlowLayout`.** Outer `Box` has `minHeight: '100vh'`, `bgcolor: 'background.default'` (theme token — no hex literal), and centers content via flex. Inside, a `Stack spacing={3}` (with `alignItems` in `sx` per the Plan 01-02 MUI v9.0.1 typing-regression decision) holds the animated logo wrapper followed by a `Typography variant="h6"` carrying the exact spec literal `Retirement runs on Fetch` (no period) styled `color: 'text.primary'` + `fontWeight: 500`.
- **Auto-redirect via `useEffect` + `setTimeout` + cleanup.** `const router = useRouter();` is followed by `useEffect(() => { const timer = setTimeout(() => { router.push('/welcome'); }, 2500); return () => clearTimeout(timer); }, [router]);`. The `clearTimeout` return is the T-02-02-01 mitigation — if the user navigates away or the component unmounts before 2500ms, the redirect is cancelled and no stale `router.push` fires.
- **Phase 1 placeholder strings are gone.** `Splash (\`/\`)` and `Phase 1 placeholder` no longer appear in `src/app/page.tsx`. The hygiene gates from CLAUDE.md (no `console.log`, no `any`, no `#EBF5FF` hex literal in this file) all hold.

## Tasks executed

| Task | Name                                                                                              | Commit    | Files                |
| ---- | ------------------------------------------------------------------------------------------------- | --------- | -------------------- |
| 1    | Rewrite `/` as the real splash with logo, tagline, animations, and auto-redirect to /welcome      | `b029533` | `src/app/page.tsx`   |

## Verification evidence

All sixteen acceptance-criteria checks passed plus the live HTTP smoke test:

**TypeScript & static gates:**
- `npx tsc --noEmit` → exit `0` (clean compile across the whole project after the rewrite).
- `head -3 src/app/page.tsx | grep -c "'use client'"` → `1` (directive present on first non-blank line).
- `grep -cF "Retirement runs on Fetch" src/app/page.tsx` → `1` (exact tagline literal present).
- `grep -cE "router\.push\(['\"]\/welcome['\"]\)" src/app/page.tsx` → `1` (redirect target is the static literal `/welcome`).
- `grep -cE "setTimeout\([^,]+,\s*2500\)" src/app/page.tsx` → `1` (redirect delay is exactly 2500ms; single-line form chosen so the regex matches).
- `grep -cE "clearTimeout" src/app/page.tsx` → `1` (cleanup function returns `clearTimeout(timer)` — T-02-02-01 mitigation).
- `grep -cE "500ms" src/app/page.tsx` → `3` (≥1 required; matches scale-in duration plus the chained breathe-delay).
- `grep -cE "2s[^\"']*infinite|infinite[^\"']*2s" src/app/page.tsx` → `1` (breathing animation is 2s and loops infinitely).
- `grep -cE "bgcolor:\s*['\"]background\.default['\"]" src/app/page.tsx` → `1` (page bg uses theme token).
- `grep -cF "#EBF5FF" src/app/page.tsx` → `0` (no hardcoded hex anywhere in the file — including in comments).
- `grep -cF "<FetchLogo" src/app/page.tsx` → `1` (logo component is mounted).
- `grep -cF "FlowLayout" src/app/page.tsx` → `0` (no FlowLayout reference — splash sits on bare page bg per spec).
- `grep -cF 'Splash (\`/\`)' src/app/page.tsx` → `0` (Phase 1 placeholder heading removed).
- `grep -cF "Phase 1 placeholder" src/app/page.tsx` → `0` (Phase 1 placeholder muted hint removed).
- `grep -cE "console\.log" src/app/page.tsx` → `0` (CLAUDE.md hygiene gate).
- `grep -cE "(^|[^a-zA-Z_]): *any( |;|,|>|$)" src/app/page.tsx` → `0` (no `any` types).

**Live HTTP smoke (`npm run dev` on port 3001):**
- `curl -s -o /tmp/page.html -w "%{http_code}" http://localhost:3001/` → `200` (route renders without error).
- `grep -cF "Retirement runs on Fetch" /tmp/page.html` → `1` (tagline reaches SSR markup).
- `grep -cF "<title>Fetch</title>" /tmp/page.html` → `1` (FetchLogo inline SVG `<title>` element reaches SSR markup).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Acceptance-grep compliance] Inlined setTimeout body onto a single line**
- **Found during:** Task 1 verification step.
- **Issue:** The acceptance-criteria pattern `setTimeout\([^,]+,\s*2500\)` is a single-line regex (it stops at the first `,` and looks for `2500` before a `)`). The initial implementation used the editor-preferred multi-line block form `setTimeout(() => {\n  router.push('/welcome');\n}, 2500)`, which spans three lines and so does not match a single-line grep.
- **Fix:** Compressed the setTimeout body to a single line: `setTimeout(() => { router.push('/welcome'); }, 2500)`. Functionally identical; only the line breaks change.
- **Files modified:** `src/app/page.tsx` (one-line reformat).
- **Commit:** `b029533` (folded into the single task commit — no separate fix commit since the issue was caught and fixed before commit).

**2. [Rule 3 - Acceptance-grep compliance] Rewrote the JSDoc rationale block to avoid `#EBF5FF` and `FlowLayout` literals**
- **Found during:** Task 1 verification step.
- **Issue:** The initial JSDoc block explained "Sits directly on the `#EBF5FF` page background — NOT inside FlowLayout — because the spec's `### / — Splash` section says…". This mentioned both forbidden strings in prose. The acceptance criteria check `grep -cF "#EBF5FF" src/app/page.tsx` returning `0` is a literal grep — it doesn't distinguish code from comments. Same for `grep -cF "FlowLayout" src/app/page.tsx` returning `0`.
- **Fix:** Rewrote the JSDoc to describe the same rationale using indirect terms ("the themed page background via the MUI theme token `background.default`" and "the shared panel chrome" instead of "`#EBF5FF`" and "`FlowLayout`"). Same architectural rationale, no banned literals.
- **Files modified:** `src/app/page.tsx` (JSDoc comment block).
- **Commit:** `b029533` (folded into the single task commit — caught and fixed before commit).

No Rule 1, Rule 2, or Rule 4 deviations. No architectural changes proposed. Plan executed as written aside from these two cosmetic compliance adjustments to satisfy the (correctly-strict) acceptance-criteria grep gates.

## Authentication gates

None — Plan 02-02 has no network surface, no API keys, no auth interactions. Pure local Client Component with a `setTimeout`-driven client-side route change.

## Known Stubs

None new. The `FetchLogo` SVG placeholder noted in Plan 01-02's SUMMARY is unchanged and remains the only intentional, plan-sanctioned stub in the codebase. This plan consumes `FetchLogo` via its stable public API (`size={100}`); when the real artwork ships, this file requires no change.

## Threat Flags

None new. STRIDE entry T-02-02-01 (DoS-self via stale `setTimeout` firing on an unmounted component) is mitigated by the `useEffect` cleanup `return () => clearTimeout(timer);` — verified by acceptance criterion `grep -cE "clearTimeout" src/app/page.tsx → 1`. T-02-02-02 (Tampering of redirect target) is `accept`-disposed in the plan because the target `/welcome` is a static literal with no untrusted input flowing into `router.push`. No new trust boundary introduced; no network, file, or schema surface added.

## Deferred Issues

None from this plan. The `.planning/config.json` modification and untracked `Main_Fetch_Gateway.md` file present in the working tree before this plan started are pre-existing tree state, not generated outputs of this plan — they remain untouched and out-of-scope per the executor's scope-boundary rule.

## Phase 2 requirements progress

This plan carries `requirements: [FLOW-01]` in its frontmatter. FLOW-01 is now closed end-to-end: the splash screen at `/` renders the Fetch logo centered on the brand sky-blue background, plays a 500ms scale-in then an infinite 2s breathing pulse, displays the "Retirement runs on Fetch" tagline, and auto-redirects to `/welcome` after 2500ms via client-side routing — all observable in the running dev server at port 3001 (HTTP 200, tagline and `<title>Fetch</title>` SVG marker both reach the SSR markup).

ROADMAP Phase 2 Success Criterion 1 ("Visiting `/` shows the Fetch logo centered on `#EBF5FF` with tagline 'Retirement runs on Fetch', logo scales in over 500ms then breathes on a 2s cycle, and auto-redirects to `/welcome` after ~2500ms") is now satisfied. Criteria 2-4 (the `/welcome`, `/permissions`, and Back/Continue navigation behaviors) remain for Wave 2 plans 02-03 and 02-04.

## Self-Check: PASSED

Modified files (verified to exist):
- `src/app/page.tsx` — FOUND

Commits (verified in `git log`):
- `b029533` feat(02-02): replace / splash stub with real animated splash + auto-redirect — FOUND
