---
phase: 02-pre-provider-flow
reviewed: 2026-05-18T00:00:00Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - src/components/FlowLayout.tsx
  - src/app/page.tsx
  - src/app/welcome/page.tsx
  - src/app/permissions/page.tsx
findings:
  critical: 0
  warning: 2
  info: 3
  total: 5
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-05-18
**Depth:** standard
**Files Reviewed:** 4
**Status:** issues_found

## Summary

Reviewed the Pre-Provider Flow scaffolding: the shared `FlowLayout` panel and three Next.js App Router pages (splash `/`, `/welcome`, `/permissions`). The implementation honors the CLAUDE.md constraints — strict TypeScript with no `any`, MUI exclusively for UI primitives, no Tailwind / shadcn / `lucide-react`, no committed `console.log`, the Fetch logo is delivered as inline SVG, the dev port is preserved, and all interactivity is contained behind `'use client'` directives where required. The `as const satisfies` pattern on the `PERMISSIONS` literal in `/permissions` is good defensive typing.

No Critical issues. Two Warnings concern client-side navigation hygiene — both routes use `router.push` where `router.replace` (splash auto-redirect) or `router.back` (permissions Back button) is the correct primitive, creating a stale-history trap for the browser back button. Three Info items cover a minor accessibility gap (no `prefers-reduced-motion` opt-out on the splash breathing animation), a fragile `px`/`py` type contract on `FlowLayout`, and an inline-content anti-pattern on the welcome CTA.

No structural findings substrate was provided for this review.

## Narrative Findings (AI reviewer)

## Warnings

### WR-01: Splash auto-redirect uses `router.push`, breaks browser Back

**File:** `src/app/page.tsx:52`
**Issue:** The splash screen auto-navigates to `/welcome` after 2.5s via `router.push('/welcome')`. Because `push` appends a history entry, the user's browser-back button from `/welcome` (or any later screen) returns to `/`, which then immediately auto-redirects forward again — a back-button trap. The user can never escape backwards. An auto-redirect splash should always use `replace` so the splash is not in the back-history.
**Fix:**
```tsx
useEffect(() => {
  const timer = setTimeout(() => { router.replace('/welcome'); }, 2500);
  return () => clearTimeout(timer);
}, [router]);
```

### WR-02: `/permissions` Back button pushes history instead of popping

**File:** `src/app/permissions/page.tsx:90`
**Issue:** The Back button calls `router.push('/welcome')`. Combined with the forward `push` chain from splash and welcome, this produces a history stack of `/ → /welcome → /permissions → /welcome` instead of returning to the existing `/welcome` entry. The browser back button is now misaligned with the in-app Back affordance — pressing browser-back from the re-entered `/welcome` lands on `/permissions`, not `/`. Either pop the history with `router.back()` (matches the spec's "Back" semantics) or use `router.replace('/welcome')` if you want a clean two-entry stack.
**Fix:**
```tsx
<Button
  variant="outlined"
  color="primary"
  size="large"
  onClick={() => router.back()}
  sx={{ textTransform: 'none', fontWeight: 600, minWidth: 120 }}
>Back</Button>
```
If a deep-link to `/permissions` (no `/welcome` in history) is a supported entry, guard with a fallback: `if (window.history.length > 1) router.back(); else router.replace('/welcome');`.

## Info

### IN-01: Splash breathing animation has no `prefers-reduced-motion` override

**File:** `src/app/page.tsx:36-46, 69`
**Issue:** The logo runs a continuous 2s `breathe` keyframe pulse. Users with `prefers-reduced-motion: reduce` set at the OS level will still see the animation. While the splash lifetime is short (≤2.5s), keeping a motion opt-out is cheap and matches WCAG 2.3.3 best practice.
**Fix:** Conditionally suppress the `breathe` portion of the animation chain:
```tsx
sx={{
  animation: `${scaleIn} 500ms ease-out, ${breathe} 2s ease-in-out 500ms infinite`,
  '@media (prefers-reduced-motion: reduce)': {
    animation: `${scaleIn} 500ms ease-out`,
  },
}}
```

### IN-02: `FlowLayout` `px`/`py` type contract is narrower than the underlying MUI prop

**File:** `src/components/FlowLayout.tsx:28-33`
**Issue:** `FlowLayoutProps` types `px?: number` and `py?: number`. MUI's `sx` spacing accepts `number | string | (number | string)[]` so callers cannot pass theme-aware strings (`'1.5rem'`, `'24px'`, responsive arrays) without a TS error. The current call sites (`px={6}`, `px={4.5}`) work, but if Phase 3 (`/select-provider` at 498px) or any later route needs a non-numeric value the component must change shape. Tighten or widen deliberately; right now it's narrower-than-needed without a comment explaining the restriction.
**Fix:**
```ts
import type { SystemStyleObject } from '@mui/system';
export type FlowLayoutProps = {
  children: ReactNode;
  maxWidth?: number;
  px?: SystemStyleObject['px'];
  py?: SystemStyleObject['py'];
};
```
Or document the restriction inline: `// px/py: theme spacing units only (number). Use sx override on the child if you need a different unit.`

### IN-03: `welcome` CTA puts the visible label on the JSX closing-tag line

**File:** `src/app/welcome/page.tsx:44`
**Issue:** `<Button ... >Get Started</Button>` collapses the children onto the closing-tag line. This is functional, but it diverges from the formatting used on `/permissions` (lines 92 and 99 use the same one-line shape, so the project is internally consistent — but the convention is unusual and Prettier with default settings would reformat to multi-line). If the project intends to use Prettier or `eslint-plugin-react/jsx-closing-bracket-location`, these collapse on the next lint pass.
**Fix:** Either configure Prettier to leave the collapsed shape alone, or expand:
```tsx
<Button
  variant="contained"
  color="primary"
  size="large"
  onClick={() => router.push('/permissions')}
  sx={{ mt: 2, alignSelf: 'stretch', textTransform: 'none', fontWeight: 600 }}
>
  Get Started
</Button>
```

---

_Reviewed: 2026-05-18_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
