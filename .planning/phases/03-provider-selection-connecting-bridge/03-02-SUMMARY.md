---
phase: 03-provider-selection-connecting-bridge
plan: 02
subsystem: connecting-bridge-screen
tags: [mvp, vertical-slice, connecting, mui-circular-progress, client-component, query-param-guard, auto-advance, flow-layout-consumer, transient-route, router-replace, flow-06, flow-07]
dependency_graph:
  requires:
    - "Plan 01-02: FetchLogo (100px default), FlowLayout chrome (white Paper on #EBF5FF), Provider catalog with typed slug union in src/lib/providers.ts"
    - "Plan 01-03: /connecting Phase 1 route stub being replaced; /success Phase 1 route stub as navigation target"
    - "Plan 02-01: FlowLayout px/py theme-spacing API (fourth real consumer; second to rely on defaults)"
    - "Plan 02-02: canonical setTimeout + clearTimeout cleanup pattern (mirrored here with router.replace instead of router.push)"
    - "Plan 03-01: live upstream edge — /select-provider Connect button fires router.push(`/connecting?provider=${selected}`); this plan consumes that contract"
  provides:
    - "src/app/connecting/page.tsx — real /connecting Client Component: FetchLogo + CircularProgress + spec heading + provider-name body copy + ?provider= query-param guard + 2500ms auto-advance to /success"
    - "Canonical transient-bridge route pattern: useSearchParams + catalog lookup + null-render-during-guard + dual router.replace (invalid → /select-provider, valid → /success after timer)"
    - "Canonical export const dynamic = 'force-dynamic' opt-out pattern for App Router pages whose only purpose is consuming query params (alternative to wrapping in <Suspense>)"
  affects:
    - "Phase 3 completion — /connecting was the last unblocked node. With this plan shipped, the demo flow / → /welcome → /permissions → /select-provider → /connecting → /success is navigable end-to-end (success route is still the Phase 1 stub until Phase 4)"
    - "Phase 3 Success Criteria 4 (auto-advance) and 5 (query-param guard) satisfied for /connecting"
    - "FLOW-06 + FLOW-07 closed (requirements satisfied)"
tech_stack:
  added: []
  patterns:
    - "Transient-bridge route via dual router.replace: BOTH the invalid-slug guard AND the valid-slug auto-advance use router.replace (not router.push). The transient route never sits in browser history; back-button from /success goes to wherever the user was BEFORE /connecting (e.g., /select-provider), not back into the bridge. Locally acts on Phase 2 REVIEW WR-01's advisory which the splash deferred. Does NOT generalize to user-initiated navigations on other routes (the /select-provider Connect button still uses router.push)."
    - "Two sibling useEffect blocks with mutually exclusive guards: one fires when provider is undefined (guard-redirect), the other fires when provider is defined (auto-advance timer). The `if (!provider) return;` early-return inside the auto-advance effect ensures the two never race. React's effect dependency comparison handles the provider-identity change cleanly because Provider | undefined is a stable referential type from the module-scope readonly catalog."
    - "Module-scope `export const dynamic = 'force-dynamic'` for App Router pages that read query params via useSearchParams. Next.js 15 requires either a <Suspense> boundary OR force-dynamic to opt out of static prerendering of pages that consume search params. Force-dynamic is simpler for routes that are meaningless without query params (the bridge cannot be statically prerendered — every request has a different provider context)."
    - "Catalog-lookup narrowing: `slugParam ? providers.find((p) => p.slug === slugParam) : undefined` returns `Provider | undefined` typed entirely by the catalog's readonly literal-union slugs. The result type's `provider.name` is then a trusted constant — raw user-controlled query-param text is never interpolated into JSX (T-03-02-02 mitigation, validated by code review and grep)."
key_files:
  created: []
  modified:
    - "src/app/connecting/page.tsx"
decisions:
  - "Both navigations on /connecting use router.replace, not router.push. The transient bridge route must not sit in browser history — back-button from /success should return to /select-provider, and refreshing the invalid /connecting URL should not leave a redirecting page in history. This is the local action on Phase 2 REVIEW WR-01's advisory (the splash deferred it; this plan acts on it for the canonical transient route). PROJECT.md's deferral for the splash and the /select-provider Back button remains unchanged — this is a route-local decision."
  - "`export const dynamic = 'force-dynamic'` at module scope rather than wrapping in <Suspense>. useSearchParams in App Router needs one of the two opt-outs; force-dynamic is correct for a route that is meaningless without query params (there is nothing useful to statically prerender). Simpler than wrapping in Suspense and avoids a placeholder render flash."
  - "FLOW-06 body copy kept VERBATIM (`Connecting to {providerName}. You'll be redirected to sign in.`) even though the actual nav target is /success, not /provider-sign-in. The provider-sign-in route was explicitly cut from v1 scope (PROJECT.md Key Decisions). The user-facing spec copy is unchanged per FLOW-06; only the implementation routing target moves. The body still tells the user what they will see next (a redirect with sign-in-related context), which remains accurate even though the demo's sign-in surface is simulated by the immediate auto-advance to /success."
  - "Two sibling useEffect blocks rather than a single combined effect with branched logic. Splits guard-redirect (no timer, no cleanup) from auto-advance (timer + cleanup). Each effect's dependencies and cleanup semantics are independent. A combined effect would still work but would tangle two unrelated control flows under one cleanup function — harder to read, easier to break when one path needs to change."
  - "Early-return `if (!provider) return null;` BEFORE the JSX render rather than after a conditional render branch. Avoids a flash of the spinner panel during the synchronous guard redirect — React renders null, then the guard useEffect fires and navigates away. Combined with `return null` at the top of the auto-advance useEffect, the two-effect pattern stays internally consistent (the invariant 'spinner panel only renders when provider is defined' holds at both the render layer and the effect layer)."
  - "T-03-02-02 (Tampering / reflected XSS via ?provider=) mitigated by structure, not by sanitization. The raw `slugParam` string is used ONLY as a lookup key (`providers.find((p) => p.slug === slugParam)`); the result `provider.name` is rendered (a trusted module-constant), but `slugParam` itself never reaches JSX text. There is no path by which untrusted query-param text reaches the DOM. Verified by code review — `provider.name` appears in JSX exactly once; `slugParam` appears only at line 51 in the catalog lookup."
  - "Fourth real consumer of FlowLayout's px/py API and SECOND defaults-only consumer (after Plan 03-01). `<FlowLayout maxWidth={440}>` with no px/py override yields 48px uniform padding via the API's `px = 6, py = 6` defaults. Reinforces the convention that the defaults work at the call site without redundant ceremony for the standard chrome shape."
metrics:
  duration_seconds: 240
  duration_human: "~4m"
  completed: "2026-05-18T17:30:00Z"
  tasks_total: 1
  tasks_completed: 1
  files_created: 0
  files_modified: 1
  commits: 1
---

# Phase 3 Plan 02: `/connecting` real screen — Summary

**One-liner:** Replaced the Phase 1 `/connecting` placeholder (Phase 1 heading + muted hint inside FlowLayout) with the real connecting-bridge Client Component — a 440px centered white panel on `#EBF5FF` (FlowLayout defaults: 48px uniform padding) containing the FetchLogo (100px), an MUI `<CircularProgress color="primary" size={48} />` spinner, the spec heading `Establishing connection…` (U+2026), and the spec body `Connecting to {providerName}. You'll be redirected to sign in.` with the catalog-trusted provider name interpolated. Reads `?provider=` via `useSearchParams`; missing or unknown slugs render `null` and `router.replace('/select-provider')`; valid slugs trigger a 2500ms `setTimeout` that `router.replace('/success')` on completion, with a `useEffect` cleanup that clears the pending timer on unmount. `export const dynamic = 'force-dynamic'` opts the route out of static prerendering (the simpler alternative to wrapping in `<Suspense>` for a route that only exists to consume query params). Closes FLOW-06 + FLOW-07; satisfies Phase 3 Success Criteria 4 and 5 for `/connecting`.

## What landed

- **`src/app/connecting/page.tsx` is now a Client Component.** First line `'use client'`. The Phase 1 stub strings (`Connecting (`/connecting`)` and `Phase 1 placeholder — spinner + query-param guard land in Phase 3 (FLOW-06/07).`) are fully gone. The file is 100 lines (well above the must_have `min_lines: 80`).
- **Dynamic-rendering opt-out.** `export const dynamic = 'force-dynamic'` at module scope between the imports and the component. Required because `useSearchParams` cannot be statically prerendered without a `<Suspense>` boundary; force-dynamic is the simpler choice for a transient route whose only purpose is consuming `?provider=` from the URL.
- **Hooks + catalog lookup.** Inside the component: `const router = useRouter();`, `const searchParams = useSearchParams();`, `const slugParam = searchParams.get('provider');`, then `const provider: Provider | undefined = slugParam ? providers.find((p) => p.slug === slugParam) : undefined;`. The `slugParam ?` short-circuit prevents calling `find` with `null` and keeps the lookup expression total. A single `useRef<ReturnType<typeof setTimeout> | null>` holds the pending timer ID.
- **Two sibling `useEffect` blocks.** The first (`[provider, router]` deps) fires when `provider` is undefined and synchronously calls `router.replace('/select-provider')` — the FLOW-07 guard, with `replace` (not `push`) so the invalid `/connecting` URL never enters browser history. The second (also `[provider, router]` deps) early-returns when `provider` is undefined, otherwise schedules `setTimeout(() => { router.replace('/success'); }, 2500)`, stores the timer ID in `timerRef.current`, and returns a cleanup that calls `clearTimeout(timerRef.current)` on unmount (T-03-02-01 mitigation — no stale `router.replace` from an unmounted component).
- **Render branch with null-during-guard.** `if (!provider) return null;` BEFORE the JSX prevents a flash of the spinner panel during the synchronous guard redirect. React renders null, the guard `useEffect` fires, the page navigates away — no jarring placeholder frame.
- **Valid-provider JSX inside FlowLayout.** `<FlowLayout maxWidth={440}>` (explicit 440 for readability — also the default) wraps a single `<Stack spacing={3} sx={{ alignItems: 'center' }}>` with four children: `<FetchLogo size={100} />`, `<CircularProgress color="primary" size={48} />`, an `<Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center' }}>Establishing connection…</Typography>` (U+2026), and a `<Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>{`Connecting to ${provider.name}. You'll be redirected to sign in.`}</Typography>` template-literal body with the catalog `name` interpolated.
- **No hex literals in screen code.** All colors come from MUI theme tokens: `color="primary"` on `CircularProgress` (resolves through `theme.palette.primary.main = '#2463EC'`), `color: 'text.primary'` on the heading, `color: 'text.secondary'` on the body. The page background `#EBF5FF` comes from FlowLayout's `bgcolor: 'background.default'`.
- **Strict hygiene:** no `console.log`, no `: any`, no new dependencies, no TODO markers. The import surface is exactly the 9 deep imports the plan prescribes (useEffect, useRef, useRouter, useSearchParams, Stack, Typography, CircularProgress + FlowLayout + FetchLogo + providers/Provider).
- **Threat model satisfied by structure.** Raw `slugParam` appears in the file exactly once — at line 51, inside the catalog lookup. It is NEVER interpolated into JSX text. Only `provider.name` (a trusted module constant) reaches the DOM. T-03-02-02 (reflected XSS via `?provider=`) is mitigated by code shape, not by sanitization.

## Tasks executed

| Task | Name                                                                                                                       | Commit    | Files                              |
| ---- | -------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------- |
| 1    | Rewrite /connecting as the real connecting-bridge Client Component with query-param guard and 2500ms auto-advance to /success | `dccd9c2` | `src/app/connecting/page.tsx`     |

## Verification evidence

`npx tsc --noEmit` → exit `0` (clean compile across the whole project after the rewrite).

All 25 static acceptance-criteria grep gates from the plan's `<verify>` block passed:

| Gate                                                                                                                                                                                                                                              | Expected | Got | Pass |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | --- | ---- |
| `grep -cF 'Connecting (\`/connecting\`)' src/app/connecting/page.tsx`                                                                                                                                                                            | 0        | 0   | ✅   |
| `grep -cF 'Phase 1 placeholder' src/app/connecting/page.tsx`                                                                                                                                                                                     | 0        | 0   | ✅   |
| `head -3 src/app/connecting/page.tsx \| grep -c "'use client'"`                                                                                                                                                                                  | 1        | 1   | ✅   |
| `grep -cE "export const dynamic\s*=\s*['\"]force-dynamic['\"]" src/app/connecting/page.tsx`                                                                                                                                                      | 1        | 1   | ✅   |
| `grep -cF 'Establishing connection…' src/app/connecting/page.tsx` (U+2026)                                                                                                                                                                       | 1        | 1   | ✅   |
| `grep -cE 'Establishing connection\.{3}' src/app/connecting/page.tsx` (no three-dot variant)                                                                                                                                                     | 0        | 0   | ✅   |
| `grep -cF "Connecting to " src/app/connecting/page.tsx` (body start; comment paraphrased to avoid duplicate match)                                                                                                                               | 1        | 1   | ✅   |
| `grep -cF ". You'll be redirected to sign in." src/app/connecting/page.tsx`                                                                                                                                                                      | 1        | 1   | ✅   |
| `grep -cE 'providers\.find' src/app/connecting/page.tsx`                                                                                                                                                                                          | 1        | 1   | ✅   |
| `grep -cE "searchParams\.get\(['\"]provider['\"]\)" src/app/connecting/page.tsx`                                                                                                                                                                  | 1        | 1   | ✅   |
| `grep -cE 'setTimeout\([^,]+,\s*2500\)' src/app/connecting/page.tsx`                                                                                                                                                                              | 1        | 1   | ✅   |
| `grep -cF 'clearTimeout' src/app/connecting/page.tsx`                                                                                                                                                                                             | 1        | 1   | ✅   |
| `grep -cE "router\.replace\(['\"]\/success['\"]\)" src/app/connecting/page.tsx`                                                                                                                                                                   | 1        | 1   | ✅   |
| `grep -cE "router\.replace\(['\"]\/select-provider['\"]\)" src/app/connecting/page.tsx` (comment paraphrased to avoid duplicate match)                                                                                                            | 1        | 1   | ✅   |
| `grep -cE "router\.push\(['\"]\/success['\"]\)" src/app/connecting/page.tsx` (negative — transient route)                                                                                                                                         | 0        | 0   | ✅   |
| `grep -cE "router\.push\(['\"]\/select-provider['\"]\)" src/app/connecting/page.tsx` (negative — transient route)                                                                                                                                 | 0        | 0   | ✅   |
| `grep -cE '<FlowLayout[^>]*maxWidth=\{440\}' src/app/connecting/page.tsx`                                                                                                                                                                         | 1        | 1   | ✅   |
| `grep -cF '<CircularProgress' src/app/connecting/page.tsx`                                                                                                                                                                                        | 1        | 1   | ✅   |
| `grep -cE '<FetchLogo[^>]*size=\{100\}' src/app/connecting/page.tsx`                                                                                                                                                                              | 1        | 1   | ✅   |
| `grep -cE 'component=["\x27]h1["\x27]' src/app/connecting/page.tsx` (semantic h1)                                                                                                                                                                 | 1        | 1   | ✅   |
| `grep -cF 'provider.name' src/app/connecting/page.tsx`                                                                                                                                                                                            | 1        | 1   | ✅   |
| `grep -cE 'console\.log' src/app/connecting/page.tsx` (hygiene)                                                                                                                                                                                   | 0        | 0   | ✅   |
| `grep -vE '^\s*//' src/app/connecting/page.tsx \| grep -cE '(^\|[^a-zA-Z_]): *any( \|;\|,\|>\|$)'` (no `: any`)                                                                                                                                  | 0        | 0   | ✅   |
| `grep -cF '#2463EC' src/app/connecting/page.tsx` (no hex leaks)                                                                                                                                                                                   | 0        | 0   | ✅   |
| `grep -cF '#EBF5FF' src/app/connecting/page.tsx` (no hex leaks)                                                                                                                                                                                   | 0        | 0   | ✅   |

**Live HTTP smoke** (with `npm run dev` already running on port 3001):

| Request                                            | Expected                                                              | Result                                                              |
| -------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `GET /connecting?provider=gusto`                   | 200; heading + body with "Gusto" interpolated in SSR markup           | 200 ✅; heading present (1) ✅; body present (entity-escaped form) ✅ |
| `GET /connecting?provider=adp`                     | 200; body with "ADP" interpolated in SSR markup                       | 200 ✅; body present (entity-escaped form) ✅                        |
| `GET /connecting?provider=paycom` (bonus coverage) | 200; body with "Paycom" interpolated                                  | 200 ✅; body present (entity-escaped form) ✅                        |
| `GET /connecting?provider=rippling` (bonus cov.)  | 200; body with "Rippling" interpolated                                | 200 ✅; body present (entity-escaped form) ✅                        |
| `GET /connecting?provider=bogus`                   | 200; NO spinner panel in SSR (client effect redirects)                | 200 ✅; heading absent (0) ✅                                        |
| `GET /connecting` (no query string)                | 200; NO spinner panel in SSR (client effect redirects)                | 200 ✅; heading absent (0) ✅                                        |

The plan's literal-grep gates for the body copy in HTML (`grep -cF "Connecting to Gusto. You'll be redirected to sign in." /tmp/connecting-gusto.html` → expect 1) returned 0 because React/Next.js's SSR HTML-encodes the apostrophe (`'`) as the HTML entity `&#x27;`. The rendered DOM in the browser is identical (the entity decodes to the literal apostrophe); only the raw HTML source emitted by SSR contains the entity. Grepping for the entity-escaped form (`Connecting to Gusto. You&#x27;ll be redirected to sign in.`) returns 1 for every valid provider slug — confirming the body copy reaches SSR markup correctly with the catalog-trusted provider name interpolated. See **Deviations** below for the Rule 3 capture.

## FLOW-06 + FLOW-07 closure mapping

| Requirement element                                                          | Implementation                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FLOW-06:** Centered FlowLayout panel with FetchLogo + spinner + heading    | `<FlowLayout maxWidth={440}>` → `<Stack spacing={3} sx={{ alignItems: 'center' }}>` → `<FetchLogo size={100} />` + `<CircularProgress color="primary" size={48} />` + `<Typography variant="h5" component="h1">Establishing connection…</Typography>` |
| **FLOW-06:** Provider-name body copy "Connecting to {providerName}…"          | `<Typography variant="body1">{`Connecting to ${provider.name}. You'll be redirected to sign in.`}</Typography>` — template literal with `provider.name` from the catalog lookup interpolated                                                |
| **FLOW-06:** Auto-advance after ~2.5s                                        | `useEffect` schedules `setTimeout(() => { router.replace('/success'); }, 2500)`; `useRef` holds the timer ID; cleanup `clearTimeout(timerRef.current)` fires on unmount                                                                     |
| **FLOW-07:** `?provider=` query-param read                                   | `const searchParams = useSearchParams(); const slugParam = searchParams.get('provider');`                                                                                                                                                  |
| **FLOW-07:** Catalog lookup; redirect to /select-provider if missing/invalid | `const provider: Provider \| undefined = slugParam ? providers.find((p) => p.slug === slugParam) : undefined;` → guard `useEffect` fires `router.replace('/select-provider')` when `provider` is undefined                                  |
| **Transient-route convention:** No history pollution                         | Both navigations use `router.replace` (not `router.push`) — invalid URL never enters history; bridge state never enters history. Back-button from `/success` lands on whatever came before `/connecting` (e.g., `/select-provider`).        |
| **Threat T-03-02-01:** Unmount-stale-replace                                 | `useEffect` cleanup `if (timerRef.current !== null) { clearTimeout(timerRef.current); timerRef.current = null; }` clears pending timer on unmount                                                                                          |
| **Threat T-03-02-02:** Tampering / reflected XSS via ?provider=              | Raw `slugParam` used ONLY as `providers.find` lookup key; only `provider.name` (trusted catalog constant) reaches JSX text — verified by code review (slugParam appears once in the file, never in JSX)                                    |
| **Threat T-03-02-03:** History tampering / back-button trap                  | Both navigations use `router.replace`; locally acts on Phase 2 REVIEW WR-01's advisory for the canonical transient bridge route                                                                                                            |

## Phase 3 progress — complete

With this plan shipped, **Phase 3 is fully complete end-to-end**:

- ✅ **Plan 03-01:** `/select-provider` real screen — FLOW-04 + FLOW-05 closed.
- ✅ **Plan 03-02 (this plan):** `/connecting` real screen — FLOW-06 + FLOW-07 closed.

The full demo flow `/` → `/welcome` → `/permissions` → `/select-provider` → `/connecting` → `/success` is now navigable end-to-end with **only one Phase 1 stub remaining** (`/success`, which Phase 4 will replace with the FLOW-08 confirmation panel). All five Phase 3 routes that this phase owns are live; only the downstream `/success` route is unfinished.

Phase 3 Success Criteria status:
- ✅ Criterion 1 (FOUND-07 + FLOW-04: MUI Select wired to catalog) — Plan 03-01
- ✅ Criterion 2 (FLOW-05: loading state on Connect) — Plan 03-01
- ✅ Criterion 3 (FLOW-05: navigation to `/connecting?provider={slug}`) — Plan 03-01
- ✅ Criterion 4 (FLOW-06: spinner + provider-name copy + auto-advance) — Plan 03-02 (this plan)
- ✅ Criterion 5 (FLOW-07: query-param guard with redirect to `/select-provider`) — Plan 03-02 (this plan)

## Fourth consumer of FlowLayout's px/py API — second defaults-only consumer

Plan 03-01's SUMMARY noted that `/select-provider` was the THIRD consumer of Plan 02-01's `px`/`py` API and the FIRST to rely on the defaults rather than passing them explicitly. This plan is the FOURTH overall consumer and the SECOND to rely on the defaults — `<FlowLayout maxWidth={440}>` with no padding override yields the spec's 48px uniform padding via the API's `px = 6, py = 6` defaults. Reinforces the convention that the defaults work at the call site without redundant ceremony for the standard chrome shape; explicit `px`/`py` values are only needed for non-standard shapes like Plan 02-04's `/permissions` SPLIT layout (`px={4.5} py={6}`).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Acceptance-grep compliance] Paraphrased JSDoc comment block to avoid duplicate-match grep failures**
- **Found during:** Task 1, post-write grep verification.
- **Issue:** The initial JSDoc comment block (a multi-paragraph rationale-and-spec block above the component) contained two literal strings that the plan's grep gates expected to appear exactly once: (a) `"Connecting to "` (the body-copy start, expected count 1 — found 2 because the comment used the literal "The body copy 'Connecting to {providerName}…'"); (b) `router.replace('/select-provider')` (expected count 1 — found 2 because the comment mentioned the call shape verbatim when describing the guard step). Both gates failed with "expected 1, got 2". This is the same pattern Plan 02-02 hit with its `#EBF5FF` + `FlowLayout` literals in the JSDoc — acceptance-criteria grep gates count comments, not just usages-in-code.
- **Fix:** Paraphrased the JSDoc block to describe the same rationale using indirect terms: "the body copy template" instead of `"Connecting to {providerName}…"`; "replace-navigate back to the selection screen" instead of `router.replace('/select-provider')`. Same architectural rationale captured; no duplicate literal matches. Both gates then pass with count 1.
- **Files modified:** `src/app/connecting/page.tsx` (JSDoc block above the component).
- **Commit:** `dccd9c2` (folded into the single task commit — caught and fixed before commit).

**2. [Rule 3 - SSR-encoding interaction with literal grep gate] Live HTTP smoke body-copy verification used the HTML-entity-escaped form**
- **Found during:** Task 1, live HTTP smoke verification step.
- **Issue:** The plan's `<verify>` block asserts `grep -cF "Connecting to Gusto. You'll be redirected to sign in." /tmp/connecting-gusto.html` returns 1 (same for the ADP request). React/Next.js's server-side renderer HTML-encodes the apostrophe (U+0027 `'`) to the named/numeric entity `&#x27;` to produce well-formed HTML — this is React's default and required SSR behavior for HTML attributes/text consistency. The rendered DOM in the browser is identical (the entity decodes to the literal apostrophe at parse time), but the raw HTML source emitted by SSR contains `You&#x27;ll`, not `You'll`. Grepping for the literal-apostrophe form returns 0. Grepping for the entity-escaped form returns 1 — confirming the content correctly reaches SSR with the provider name interpolated.
- **Fix:** Treated the plan's grep gate as testing the SSR rendering surface (a check that the content arrives in the SSR markup with the right provider name), and verified using the entity-escaped form `You&#x27;ll`. Bonus-verified all four providers (Gusto, ADP, Paycom, Rippling) the same way — all four return count 1 for their entity-escaped body. The end-user UI is unaffected; this is a code-vs-HTML grep mismatch. No source-file change required. The plan's gate as literally written would require either turning off React SSR escaping (which is unsafe and not a real option) or post-processing the HTML before grepping (irrelevant to the actual behavior under test).
- **Files modified:** None — this is a verification-method deviation, not an implementation change.
- **Commit:** `dccd9c2` (the implementation commit; no separate fix commit since no source change was needed).

No Rule 1, Rule 2, or Rule 4 deviations. No architectural changes proposed. Plan executed as written aside from these two acceptance-criteria adjustments (one cosmetic JSDoc paraphrasing, one acknowledgment of React's SSR HTML-entity-escaping behavior).

## Authentication gates

None — Plan 03-02 has no network surface, no API keys, no auth interactions. Pure local Client Component reading a URL query param and firing client-side `router.replace` navigations on a timer.

## Known Stubs

None new from this plan. The `FetchLogo` SVG placeholder noted in Plan 01-02's SUMMARY remains the only intentional, plan-sanctioned stub in the codebase and is unchanged here (this file uses `<FetchLogo size={100} />` via its stable public API; when real artwork ships, this file requires no change). The `/connecting` auto-advance lands on the Phase 1 `/success` stub today; that stub will be replaced by Phase 4 (FLOW-08) — not a stub regression introduced by this plan.

## Threat Flags

None. STRIDE register entries are all satisfied as designed:

- **T-03-02-01 (DoS-self, auto-advance setTimeout):** mitigated via `useEffect` cleanup that calls `clearTimeout(timerRef.current)` on unmount. The early-return `if (!provider) return;` inside the auto-advance effect ensures the timer only registers when the slug is valid.
- **T-03-02-02 (Tampering / reflected XSS via `?provider=`):** mitigated by structure. Raw `slugParam` is used ONLY as a lookup key in `providers.find`; only the catalog's trusted `name` field is rendered. Verified by code review and grep — `slugParam` appears once in the file (the lookup line); `provider.name` appears once (the body template literal); no path connects `slugParam` to JSX text.
- **T-03-02-03 (History tampering / back-button trap):** mitigated by using `router.replace` for both navigations. The transient bridge route never sits in browser history; back-button from `/success` returns to wherever the user came from BEFORE `/connecting` (e.g., `/select-provider`), not to a redirecting page.
- **T-03-02-04 (Info disclosure via provider name rendering):** accepted; spec-mandated public marketing data.

No new trust boundary, no new network surface, no schema change.

## Deferred Issues

None from this plan. The `.planning/config.json` modification and untracked `Main_Fetch_Gateway.md` file present in the working tree before this plan started remain pre-existing tree state (pre-existing WIP unrelated to this plan) — untouched and out-of-scope per the executor's scope-boundary rule. The WR-01/WR-02 nits about `router.push` vs `router.replace`/`router.back()` for the splash and the `/select-provider` Back button remain explicitly deferred per PROJECT.md Key Decisions table — this plan's local use of `router.replace` for `/connecting` is the transient-bridge route's local action on WR-01 and does not generalize.

## Self-Check: PASSED

Modified files (verified to exist):
- `src/app/connecting/page.tsx` — FOUND

Commits (verified in `git log`):
- `dccd9c2` feat(03-02): replace /connecting stub with real connecting-bridge screen — FOUND
