---
phase: 03-provider-selection-connecting-bridge
verified: 2026-05-18T20:45:00Z
status: human_needed
score: 11/11 must-haves verified
overrides_applied: 0
---

# Phase 3: Provider Selection & Connecting Bridge — Verification Report

**Phase Goal:** A user can pick a payroll provider, see realistic submission feedback, and be carried through the connecting bridge to the success route — with invalid entry to `/connecting` redirecting back to selection.

**Verified:** 2026-05-18T20:45:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (merged from ROADMAP Success Criteria + PLAN frontmatter must_haves)

**ROADMAP Phase 3 Success Criteria (the contract):**
1. SC1: `/select-provider` shows centered 498px white panel with FetchLogo, heading "Select your payroll provider", body copy, MUI `Select` labeled "Select Payroll Provider" listing four providers from catalog
2. SC2: "Connect" disabled until a provider is chosen; "Back" outlined (fixed ~100px) returns to `/permissions`
3. SC3: Connect click swaps button into ~1.2s loading state (spinner + "Connecting…"), then navigates to `/connecting?provider={slug}`
4. SC4: `/connecting?provider={validSlug}` shows centered panel with FetchLogo, `CircularProgress`, heading "Establishing connection…", body "Connecting to {providerName}. You'll be redirected to sign in.", auto-advances to `/success` after ~2500ms
5. SC5: Visiting `/connecting` with no `?provider=` or unknown slug redirects immediately to `/select-provider`

**PLAN frontmatter additional truths:**
6. T1 (PLAN 03-01): MUI Select lists exactly the four providers from catalog; data read from catalog, not duplicated inline
7. T2 (PLAN 03-01): Selected slug appears in /connecting query string as one of `gusto | adp | paycom | rippling`
8. T3 (PLAN 03-01): If user unmounts /select-provider mid-load, pending setTimeout cleared; no stale router.push
9. T4 (PLAN 03-02): /connecting valid auto-advance uses `router.replace` (not `router.push`) — transient route
10. T5 (PLAN 03-02): If user unmounts /connecting mid-bridge, pending 2500ms setTimeout cleared; no stale router.replace
11. T6 (PLAN 03-02): No Phase 1 placeholder strings remain in /connecting

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| SC1 | `/select-provider` shows 498px panel with FetchLogo + spec heading + body + MUI Select | ✓ VERIFIED | `<FlowLayout maxWidth={498}>` line 66; `<FetchLogo size={100} />` line 69; "Select your payroll provider" line 75; "Select the payroll system you want to connect" line 81; `<Select label="Select Payroll Provider">` line 86–94. SSR smoke: heading=1, body=1, Gusto/ADP/Paycom/Rippling each=1. |
| SC2 | Connect disabled until provider chosen; Back outlined ~100px → `/permissions` | ✓ VERIFIED | `disabled={!selected || submitting}` line 115 (Connect); `variant="outlined"` `minWidth: 100, width: 100, flexShrink: 0` line 108 (Back); `router.push('/permissions')` line 56 (handleBack). |
| SC3 | Connect → ~1.2s loading (spinner + "Connecting…") → `/connecting?provider={slug}` | ✓ VERIFIED | `setTimeout(() => { router.push(`/connecting?provider=${selected}`); }, 1200)` line 62; `submitting` flag controls label `<>Connecting…</>` line 118 and `startIcon={<CircularProgress size={18}/>}` line 117. |
| SC4 | `/connecting?provider={validSlug}` shows spinner panel, auto-advances to `/success` after ~2500ms | ✓ VERIFIED | `<FlowLayout maxWidth={440}>` line 79; `<CircularProgress color="primary" size={48}/>` line 82; "Establishing connection…" line 88; template literal `Connecting to ${provider.name}. You'll be redirected to sign in.` line 94; `setTimeout(() => { router.replace('/success'); }, 2500)` line 65. SSR smoke for gusto/adp/paycom/rippling all show heading + interpolated body. |
| SC5 | Invalid/missing slug at `/connecting` redirects immediately to `/select-provider` | ✓ VERIFIED | Synchronous (no setTimeout) `router.replace('/select-provider')` line 59 in useEffect when `!provider`; early-return `if (!provider) return null;` line 74 prevents spinner panel flash. SSR smoke for bogus + missing both return 200 with heading=0. |
| T1 | Providers sourced from catalog, not inlined | ✓ VERIFIED | `import providers, { type Provider } from '@/lib/providers'` line 16; `providers.map((p) => <MenuItem key={p.slug} value={p.slug}>{p.name}</MenuItem>)` lines 96–98. No hardcoded provider names in JSX. |
| T2 | Selected slug typed to one of four catalog slugs | ✓ VERIFIED | `useState<Provider['slug'] | ''>('')` line 38; `Provider['slug']` union pinned in `src/lib/providers.ts` lines 17–21. `tsc --noEmit` passes clean. |
| T3 | Unmount during /select-provider loading clears pending setTimeout | ✓ VERIFIED | `timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)` line 40; `useEffect(() => () => clearTimeout(timerRef.current), [])` lines 42–49. |
| T4 | /connecting auto-advance uses `router.replace` (transient route) | ✓ VERIFIED | `router.replace('/success')` line 65; `router.replace('/select-provider')` line 59. Negative greps: `router.push('/success')` = 0, `router.push('/select-provider')` = 0. |
| T5 | Unmount during /connecting bridge clears pending setTimeout | ✓ VERIFIED | `timerRef` line 55; cleanup function lines 66–71 with `clearTimeout(timerRef.current)`. |
| T6 | No Phase 1 placeholder strings in /connecting | ✓ VERIFIED | `grep -cF 'Phase 1 placeholder' src/app/connecting/page.tsx` = 0. Same for /select-provider = 0. |

**Score:** 11/11 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/select-provider/page.tsx` | Client Component (`'use client'`, ≥80 lines) implementing FLOW-04 + FLOW-05 | ✓ VERIFIED | 123 lines; `'use client'` line 1; substantive (real Select + handlers + loading state, not a stub); wired (imports providers catalog + FlowLayout + FetchLogo); data flows (providers.map renders all 4 catalog entries — confirmed in SSR). |
| `src/app/connecting/page.tsx` | Client Component (`'use client'`, ≥80 lines) implementing FLOW-06 + FLOW-07 | ✓ VERIFIED | 99 lines; `'use client'` line 1; substantive (real query-param guard + auto-advance, not a stub); wired (consumes providers catalog + FlowLayout + FetchLogo + useSearchParams); data flows (provider.name from catalog lookup interpolated into body — confirmed in SSR for all 4 slugs). |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `src/app/select-provider/page.tsx` | `src/lib/providers.ts` | default import + `providers.map` | ✓ WIRED | Line 16 imports default; line 96 uses `providers.map((p) => …)`; SSR confirms all four catalog entries render. |
| `src/app/select-provider/page.tsx` | `src/components/FlowLayout.tsx` | `<FlowLayout maxWidth={498}>` | ✓ WIRED | Line 66 — matches pattern exactly. |
| `src/app/select-provider/page.tsx` | `/permissions` | Back `router.push('/permissions')` | ✓ WIRED | Line 56; handler wired to Back button line 106. |
| `src/app/select-provider/page.tsx` | `/connecting?provider={slug}` | Connect setTimeout(1200ms) → `router.push(\`/connecting?provider=${selected}\`)` | ✓ WIRED | Line 62; handler wired to Connect button line 114. |
| `src/app/connecting/page.tsx` | `src/lib/providers.ts` | `providers.find(p => p.slug === slugParam)` | ✓ WIRED | Line 53 — catalog lookup narrows `Provider | undefined`. |
| `src/app/connecting/page.tsx` | `src/components/FlowLayout.tsx` | `<FlowLayout maxWidth={440}>` | ✓ WIRED | Line 79. |
| `src/app/connecting/page.tsx` | `/success` | `setTimeout(() => router.replace('/success'), 2500)` | ✓ WIRED | Line 65 — auto-advance after 2500ms. |
| `src/app/connecting/page.tsx` | `/select-provider` | `router.replace('/select-provider')` when `!provider` | ✓ WIRED | Line 59 in synchronous useEffect when slug invalid/missing. |
| Upstream: `/permissions` → `/select-provider` | Continue button | `router.push('/select-provider')` | ✓ WIRED | Confirmed in `src/app/permissions/page.tsx:97`. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `src/app/select-provider/page.tsx` | `providers` (rendered in `MenuItem`s) | Default import from `src/lib/providers.ts` (readonly array of 4 typed entries) | YES — SSR confirms all 4 provider names in markup | ✓ FLOWING |
| `src/app/select-provider/page.tsx` | `selected` (used in query string) | Controlled `useState<Provider['slug'] \| ''>` updated by Select onChange | YES — user-driven; runtime values guaranteed by catalog-sourced MenuItems | ✓ FLOWING |
| `src/app/connecting/page.tsx` | `provider.name` (rendered in body) | `providers.find(p => p.slug === slugParam)` from URL query param | YES — SSR confirms "Connecting to Gusto/ADP/Paycom/Rippling" for valid slugs | ✓ FLOWING |
| `src/app/connecting/page.tsx` | `slugParam` (used only for catalog lookup) | `useSearchParams().get('provider')` | YES, but never rendered (T-03-02-02 mitigation by structure) | ✓ FLOWING (gated) |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| TypeScript strict check | `npx tsc --noEmit` | exit 0 (silent) | ✓ PASS |
| `/select-provider` returns 200 with all SSR content | `curl http://localhost:3001/select-provider` | 200; heading=1, body=1, Gusto=1, ADP=1, Paycom=1, Rippling=1, Back=1, Connect=1 | ✓ PASS |
| `/connecting?provider=gusto` returns 200 with interpolated body | `curl …?provider=gusto` | 200; "Establishing connection…"=1; "Connecting to Gusto. You&#x27;ll be redirected to sign in."=1 | ✓ PASS |
| `/connecting?provider=adp` returns 200 with interpolated body | `curl …?provider=adp` | 200; "Connecting to ADP. You&#x27;ll be redirected to sign in."=1 | ✓ PASS |
| `/connecting?provider=paycom` returns 200 with interpolated body | `curl …?provider=paycom` | 200; "Connecting to Paycom"=1 | ✓ PASS |
| `/connecting?provider=rippling` returns 200 with interpolated body | `curl …?provider=rippling` | 200; "Connecting to Rippling"=1 | ✓ PASS |
| `/connecting?provider=bogus` returns 200 without spinner panel | `curl …?provider=bogus` | 200; "Establishing connection…"=0 | ✓ PASS |
| `/connecting` (no query) returns 200 without spinner panel | `curl …/connecting` | 200; "Establishing connection…"=0 | ✓ PASS |

### Probe Execution

No conventional `scripts/*/tests/probe-*.sh` files exist in this project; PLAN files do not declare probes. Step 7c not applicable.

### Requirements Coverage

PLAN-declared requirement IDs: `FLOW-04, FLOW-05` (Plan 03-01); `FLOW-06, FLOW-07` (Plan 03-02). REQUIREMENTS.md Traceability maps the same four IDs to Phase 3. No orphaned requirements.

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| FLOW-04 | 03-01 | `/select-provider` panel with FetchLogo, heading, body, MUI Select sourced from catalog, Back + Connect buttons | ✓ SATISFIED | All elements present in `src/app/select-provider/page.tsx` lines 65–122; SSR-verified. |
| FLOW-05 | 03-01 | Connect click → ~1.2s loading state (spinner + "Connecting…") → navigate to `/connecting?provider={slug}` | ✓ SATISFIED | `setTimeout(…, 1200)` line 62; `<CircularProgress/>` startIcon line 117; label ternary line 118; `router.push` template literal line 62. |
| FLOW-06 | 03-02 | `/connecting` reads `?provider=`, shows panel with FetchLogo + CircularProgress + heading + provider-name body; auto-advance to `/success` after ~2500ms | ✓ SATISFIED | `useSearchParams().get('provider')` line 51; catalog lookup line 52–54; render lines 78–97; `setTimeout(…, 2500)` line 65 → `router.replace('/success')`. |
| FLOW-07 | 03-02 | `/connecting` redirects to `/select-provider` if `?provider=` missing or unknown | ✓ SATISFIED | Synchronous guard effect lines 57–61; `router.replace('/select-provider')` when `!provider`; early-return `null` line 74. SSR smoke confirms no spinner-panel flash for bogus/missing slugs. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| (none) | — | — | — | All hygiene gates clean: 0 `console.log`, 0 `: any` (in code, not comments), 0 hex literals (`#2463EC`, `#EBF5FF`), 0 `TBD/FIXME/XXX` debt markers, 0 `TODO/HACK/PLACEHOLDER`. |

### Human Verification Required

Static-grep and SSR-curl gates cannot fully verify the user experience promised by the phase goal — specifically the loading-state animation, history-stack behavior, and visual panel appearance. These items require a human in front of a 1440px browser.

#### 1. Connect button loading-state visible feedback

**Test:** Visit `http://localhost:3001/select-provider`, select "Gusto" from the dropdown, click "Connect".
**Expected:** Connect button immediately swaps its label to "Connecting…" with an inline circular spinner; Back button visibly disables (greyed out); Select / FormControl visibly disables; after ~1.2 seconds the URL changes to `/connecting?provider=gusto`.
**Why human:** Animation timing, visual disabled-state, and spinner appearance can't be programmatically verified — only the code shape that produces them can.

#### 2. `/connecting` spinner panel renders and auto-advances

**Test:** Visit `http://localhost:3001/connecting?provider=gusto` directly.
**Expected:** Centered 440px white panel on light-blue background showing Fetch logo, a visible MUI `CircularProgress` spinner spinning, the heading "Establishing connection…", and body "Connecting to Gusto. You'll be redirected to sign in." After ~2.5 seconds the URL replaces with `/success`.
**Why human:** Spinner motion, panel layout, brand colors, and the precise auto-advance timing are visual / temporal qualities.

#### 3. Back-button history behavior (transient-route convention)

**Test:** Navigate `/select-provider` → select a provider → click Connect → wait for `/success` → press browser Back button.
**Expected:** The browser returns to `/select-provider`, NOT to `/connecting`. The `/connecting` URL should not appear in history because both navigations on that page use `router.replace`.
**Why human:** Browser history-stack behavior cannot be inspected from server-side curl probes.

#### 4. Invalid-slug guard fires without panel flash

**Test:** Visit `http://localhost:3001/connecting?provider=bogus` directly in the browser.
**Expected:** No flash of the spinner panel — the page should appear blank for a tick, then the URL changes to `/select-provider`. The user should not perceive a redirecting connecting screen.
**Why human:** The "no flash" perception is a rendering-timing observation that curl/grep cannot make.

#### 5. End-to-end flow at 1440px

**Test:** Open at viewport 1440px wide. Walk: `/` → wait 2.5s splash → `/welcome` → click Get Started → `/permissions` → click Continue → `/select-provider` → select Rippling → click Connect → wait → `/connecting?provider=rippling` → wait 2.5s → `/success`.
**Expected:** Every transition is smooth, on-brand, and the demo feels production-quality. No dead buttons, no placeholder content along the Phase 3 segment.
**Why human:** "On-brand, polished, production-quality at 1440px desktop" is the project's stated core value (CLAUDE.md) — only a human evaluation can confirm.

### Gaps Summary

No automated-detectable gaps. All 11 must-have truths verify, all 4 requirement IDs (FLOW-04..07) satisfy, all 9 key links are wired, all 2 artifacts pass Level 1–4 verification, all hygiene gates clean, `tsc --noEmit` exits 0, and live HTTP smoke confirms SSR content for valid + invalid + missing slug cases.

The phase is functionally complete by static + SSR-smoke evidence. Status is set to `human_needed` because five qualities of the phase goal — animation/loading feedback, transient-route history behavior, no-flash guard rendering, spinner motion, and overall polish at 1440px — are observable only through a live browser session and are explicitly part of "realistic submission feedback" and "carried through" in the phase goal.

---

_Verified: 2026-05-18T20:45:00Z_
_Verifier: Claude (gsd-verifier)_
