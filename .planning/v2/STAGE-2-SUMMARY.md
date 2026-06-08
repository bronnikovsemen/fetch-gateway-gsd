# v2 Stage 2 — SELF branch (2FA) Summary

**Branch:** `new-design-system` (worktree isolation OFF — worked directly on branch)
**Scope:** Stage 2 only (self branch: `/verify` 2FA + `/connecting` gate + `/success` backfill). Stage 3 (`/invite`, `/invitation-sent`, `/recipient`) untouched.
**Figma:** Establishing 2069:105 · 2FA 2069:116 · Success 2069:145.

## ⚠️ FLOW-08 GAP — `/success` was MISSING on disk (orchestrator: record this)

`/success` was recorded as **FLOW-08** in Phase 1 but **never created** — it 404'd on disk (confirmed). The self path must terminate there, so Stage 2 **created it fresh** from **Figma 2069:145** (this is a creation, not a rebuild). Both self-branch variants (with-2FA and no-2FA) now land on it.

## What was built

### A. NEW `src/app/success/page.tsx` (FLOW-08 backfill, Figma 2069:145)
- `'use client'`; `FlowLayout` maxWidth 400, `px={4} py={4}`, `Stack spacing={2.5}` (20px), centered.
- `<FetchLogo size={64} />`; 56px `CheckCircleRounded` (`color: success.main`, `fontSize: 56` — already-installed `@mui/icons-material`, no new dep).
- `h5` "You’re connected"; `body2` (text.secondary) "Plantegrity is now securely syncing your organization’s data."
- DS `Button` (primary, `sx={{ width: '100%' }}`) "Continue" → `router.push('/')` (restarts demo). Terminal screen, no provider param.

### B. NEW `src/app/verify/page.tsx` (FLOW-11, Figma 2069:116)
- Suspense-wrapped `useSearchParams` `?provider=` guard mirroring `/connecting`; invalid/missing → `router.replace('/select-provider')`. Inner `VerifyContent` + default `Page` in `<Suspense fallback={null}>`.
- `FlowLayout` maxWidth 400, `px={4} py={4}`, `Stack spacing={2.5}`, centered. Header: `FetchLogo size={64}`, `h5` "Enter verification code", `body2` "We sent a 6-digit code to your phone".
- **6-cell OTP** assembled from token-styled MUI `Box` (no DS OTP exists): each cell `width:46, height:52`, `borderRadius: tokens.radius.md / tokens.radius.lg` (→ 8px via FlowLayout's MUI ratio trick), active cell (`index === clamped code.length`) = `2px solid secondary.main` (navy), others = `1px solid divider`. Digit rendered with `h5`.
- Controlled `useState('')`; visually-hidden `Box component="input"` (`inputMode="numeric"`, `maxLength={6}`, strips non-digits + slices to 6) absolutely positioned over the row (opacity 0, cursor text) inside a `position:relative` wrapper — clicking the row focuses it.
- DS `Button` (primary, full width) "Verify" → `router.push('/success')` (always enabled — demo).
- Footer `Stack direction="row" spacing={0.5}`: `caption` "Didn’t receive a code?" + DS `Link size="sm"` "Resend code" `onClick={() => setCode('')}` (clears code; navy).

### C. EDIT `src/app/connecting/page.tsx` — 2FA gate
- Added `const twofa = searchParams.get('2fa') === '1';`.
- Post-spinner nav (was `router.replace('/')`): `twofa` → `/verify?provider=${provider.slug}`, else → `/success`. Added `twofa` to effect deps.
- Updated the stale top-of-file comment (was describing `/` splash) to document the new self-branch routing.

### D. EDIT `src/app/connect-method/page.tsx` — make 2FA path click-reachable
- Self OptionRow target `/connecting?provider=${slug}` → `/connecting?provider=${slug}&2fa=1` (self demo: Establishing → 2FA → Success). Added comment noting omitting `&2fa=1` is the no-2FA variant. Delegate OptionRow (`/invite`) left untouched (Stage 3).

## Acceptance gates (all green)

| Gate | Result |
|------|--------|
| `npx tsc --noEmit` | 0 errors |
| `npm run lint` | ✔ No ESLint warnings or errors |
| `npm run lint:tokens` | PASS — no off-token hex or raw px in src/ |
| `npm run build` | Compiled successfully; `/verify` (3.7 kB) and `/success` (3.13 kB) in route list |
| deps check | `deps-unchanged` (package.json untouched) |

### Runtime smoke (throwaway port 3999, `next start`)
- `/verify?provider=gusto` → **HTTP 200**; served chunk `app/verify/page-*.js` contains "Enter verification code", "We sent a 6-digit code to your phone", "Resend code", "Didn", "Verify".
- `/success` → **HTTP 200**; copy "You’re connected" present in BOTH SSR HTML and the page chunk.
- `/connecting?provider=gusto&2fa=1` → **HTTP 200**.

(Client-render under Suspense — `/verify` SSR body is empty as expected; chunk-JS copy evidence is the accepted proof, same as Stage 1. `/success` is not Suspense-gated so it additionally ships the copy in SSR HTML.)

## Constraints honored
- Assembled from DS components (`FlowLayout`, `FetchLogo`, `Button`, `Link`); OTP cells + hidden capture input are the only raw MUI (no DS OTP exists — legitimate exception).
- Zero literal hex, zero `'Npx'` string literals in all new/edited files; `lint:tokens` green. No `console.log`. Strict TS, no `any`. No new deps.

## Commits (src only — docs left to orchestrator)
- `2e8e25d` feat(v2-stage2): add /success terminal screen (FLOW-08 backfill)
- `c618853` feat(v2-stage2): add /verify 2FA OTP screen (FLOW-11)
- `dd0206c` feat(v2-stage2): wire 2FA gate on /connecting + /connect-method self path

## Deviations
None — Stage 2 executed exactly as specified. No auto-fixes (Rules 1–3) were needed.

## Out of scope (left untouched, per brief)
`/invite`, `/invitation-sent`, `/recipient` (Stage 3); `/welcome`, `/permissions`, `/select-provider`, `/ds-preview`; all DS components. Docs (STATE/ROADMAP/REQUIREMENTS/PROJECT/.planning) — orchestrator handles. This summary is left **unstaged**.

## Self-Check: PASSED
- FOUND: src/app/success/page.tsx
- FOUND: src/app/verify/page.tsx
- FOUND commit 2e8e25d, c618853, dd0206c (git log)
