---
phase: 07-connection-realign
plan: 01
subsystem: connection-flow-ui
tags: [mui, figma-realign, design-system, ds-input, permission-item, otp, copy]
requires:
  - "src/components/Input.tsx (DS Input)"
  - "src/components/PermissionItem.tsx"
  - "src/lib/providers.ts (catalog — read-only, untouched)"
provides:
  - "DS Input `select` mode (backward-compatible dropdown)"
  - "PermissionItem check-circle icon"
  - "10 connection screens re-aligned to Figma section 477:453"
affects:
  - "src/app/{welcome,permissions,select-provider,connecting,verify,success,invite,invitation-sent,recipient}/page.tsx"
  - "src/app/page.tsx (home description copy)"
tech-stack:
  added: []
  patterns:
    - "MUI TextField select mode via slotProps.select.IconComponent for the DS chevron"
    - "alpha(primary.main, 0.12) tint circle + CheckRounded for check-circle icons"
    - "borderRadius: tokens.radius.full / tokens.radius.lg ratio trick for full circles"
key-files:
  created: []
  modified:
    - src/components/Input.tsx
    - src/components/PermissionItem.tsx
    - src/app/welcome/page.tsx
    - src/app/permissions/page.tsx
    - src/app/select-provider/page.tsx
    - src/app/connecting/page.tsx
    - src/app/verify/page.tsx
    - src/app/success/page.tsx
    - src/app/invite/page.tsx
    - src/app/invitation-sent/page.tsx
    - src/app/recipient/page.tsx
    - src/app/page.tsx
decisions:
  - "DS Input select mode is opt-in (select=false default) so all existing text usages render byte-identically"
  - "/select-provider keeps the ~1.2s loading-state submit machinery (FLOW-05) — only the input control swapped from tonal Select to DS Input dropdown"
  - "/connect-method left byte-for-byte unchanged — chrome already matched the node; per-type routing preserved"
metrics:
  duration: ~12m
  completed: 2026-06-09
  tasks: 3
  files: 12
---

# Phase 07 Plan 01: Connection Re-align Summary

Re-aligned the 10 connection-flow screens (plus the home `/` description) to the current Figma "Connection flows" section per REALIGN-SPEC.md: two shared DS components gained capability (Input `select` mode, PermissionItem check-circle) and every screen was updated for copy, card width, and component swaps — with the per-type self routing on /connect-method and /gusto-login untouched.

## What Was Built

**T1 (REALIGN-01) — commit `f82caf3`**
- **DS Input**: added optional `select?: boolean` + `children?: React.ReactNode`. When `select`, passes through to MUI TextField with a `KeyboardArrowDownIcon` via `slotProps.select.IconComponent`; DS styling (white bg, divider border, radius.md, 2px primary.main focus, notched label) unchanged. Defaults keep every existing text usage byte-identical.
- **PermissionItem**: replaced the bare `CheckCircleIcon` with a 20px `alpha(primary.main, 0.12)` circle containing a purple `CheckRounded` (fontSize 13).
- **/welcome** (454:70): h5 "Connect your payroll data"; trimmed subtitle to the read-only sentence.
- **/permissions** (456:114): card 640, padding 40 (`p: tokens.space[7]/8`), h5 "Fetch will need access to:", 2-col grid gaps 32/20, Back (120px) + Continue (flex) row.
- **/select-provider** (454:82): card 440, h5 "What do you want to connect?", DS Input dropdown (label "Connection") replacing the tonal Select; removed `Select`/`SelectChangeEvent`/`KeyboardArrowDownIcon`/`handleChange`; Continue disabled until selected.

**T2 (REALIGN-02) — commit `c431b25`**
- **/connect-method** (452:58): VERIFY-ONLY — chrome already matched; file left byte-for-byte unchanged (`git diff --quiet` confirmed). `handleSelfClick`, `handleConnect`, the `authMethod` branch, and the credential `<Dialog>` are untouched.
- **/connecting** (454:103): card 400, `FetchLogo` default size, theme-weight h5 (dropped `fontWeight: 700`), body2 subtitle; 2FA gate intact.
- **/verify** (455:89): OTP cells 48×56; active-cell border changed from navy `secondary.main` to purple `primary.main`; filled non-active cells `background.default`, active/empty `background.paper`.
- **/success** (455:115): replaced `CheckCircleRounded` with a 56px `success.main` circle (radius-full ratio trick) containing a white `CheckRounded` (fontSize 28, `background.paper`).

**T3 (REALIGN-03) — commit `a93adfe`**
- **/invite** (456:147): replaced the full-width Send-invite button + Back-link with a `Stack direction="row"` actions row — Back (secondary, 120px → /connect-method) + Send invite (primary, flex-2 → /invitation-sent). Removed unused `Link` import.
- **/invitation-sent** (456:176): removed the navy check mark and the "Pending" Chip (+ their imports); kept the demo "Open the invite as the teammate" link to /recipient.
- **/recipient** (455:129): removed the caption footer.
- **home /** : Connection-flow description "payroll provider" → "payroll system".

## Deviations from Plan

None affecting behavior. Two in-scope housekeeping touches beyond the literal action list:
- Updated stale header/inline comments in /invitation-sent that still described the removed navy mark and "Pending chip" — these referenced `CheckCircleRounded` in prose and would have been misleading (Rule 3 — keep the file internally consistent; no runtime effect).

## Intentional Non-Figma Element

- **/invitation-sent → /recipient demo link** ("Open the invite as the teammate (demo)"): kept deliberately, as instructed. It is NOT in the canonical Figma node but is the only UI path that makes /recipient reachable in the demo. Flagged per the plan's output note.

## Acceptance Gates

| Gate | Result |
|------|--------|
| `npx tsc --noEmit` | 0 errors |
| `npm run lint` | clean (no warnings/errors) |
| `npm run lint:tokens` | PASS (no off-token hex / `'Npx'`) |
| `npm run build` | compiles; all 17 routes present |
| `git diff src/app/gusto-login src/lib/providers.ts` | untouched |
| `git diff package.json` | unchanged (no dep/script change) |
| connect-method chunk contains `/gusto-login` | present (per-type routing intact) |

**Runtime smoke (prod build, port 3999):** all of `/`, `/welcome`, `/permissions`, `/select-provider`, `/verify`, `/invite`, `/invitation-sent`, `/recipient`, `/connect-method?provider=gusto` returned HTTP 200. Server-side-rendered screens (/welcome, /permissions, /select-provider, /) ship their new copy in the initial HTML; the `useSearchParams`-gated screens (/verify, /invite, /invitation-sent, /recipient, /connect-method) render their subtree client-side inside `<Suspense fallback={null}>`, so their copy was verified present in the built JS chunks instead of the initial HTML — this is the pre-existing architecture, not a regression.

## Known Stubs

None. No hardcoded empty values, placeholders, or unwired data sources introduced.

## Self-Check: PASSED

- All 12 modified files present on disk and committed.
- Commits `f82caf3`, `c431b25`, `a93adfe` exist on `demo-home`.
- /connect-method, /gusto-login, providers.ts confirmed untouched.
