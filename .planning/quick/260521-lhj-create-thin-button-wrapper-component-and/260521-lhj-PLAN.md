---
quick_id: 260521-lhj
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/Button.tsx
  - src/app/welcome/page.tsx
  - src/app/permissions/page.tsx
  - src/app/select-provider/page.tsx
autonomous: true
requirements: []

must_haves:
  truths:
    - "src/components/Button.tsx exists and exports a forwardRef'd Button as default"
    - "Button accepts variant ('primary' | 'secondary'), size ('sm' | 'md' | 'lg'), loading, iconStart, and standard MUI Button props (except 'variant' | 'startIcon' | 'size' which are owned by the wrapper)"
    - "When loading is true, button renders a CircularProgress in the startIcon slot and is disabled"
    - "/welcome, /permissions, /select-provider all import Button from '@/components/Button' (not '@mui/material/Button')"
    - "/select-provider no longer imports CircularProgress directly (the wrapper owns it)"
    - "tsc --noEmit exits 0 after refactor"
    - "Visual output at 1440px is unchanged from pre-refactor on all three pages"
  artifacts:
    - path: "src/components/Button.tsx"
      provides: "Thin Button wrapper with brand variants, sizes, and loading state"
      contains: "forwardRef"
    - path: "src/app/welcome/page.tsx"
      provides: "Welcome page using the wrapper Button"
      contains: "from '@/components/Button'"
    - path: "src/app/permissions/page.tsx"
      provides: "Permissions page using the wrapper Button"
      contains: "from '@/components/Button'"
    - path: "src/app/select-provider/page.tsx"
      provides: "Provider-selection page using the wrapper Button (with loading prop)"
      contains: "from '@/components/Button'"
  key_links:
    - from: "src/app/welcome/page.tsx"
      to: "src/components/Button.tsx"
      via: "default import"
      pattern: "from '@/components/Button'"
    - from: "src/app/permissions/page.tsx"
      to: "src/components/Button.tsx"
      via: "default import"
      pattern: "from '@/components/Button'"
    - from: "src/app/select-provider/page.tsx"
      to: "src/components/Button.tsx"
      via: "default import (loading prop replaces direct CircularProgress usage)"
      pattern: "from '@/components/Button'"
---

<objective>
Introduce a thin brand-specific Button wrapper at `src/components/Button.tsx` and refactor the three flow pages that currently consume `@mui/material/Button` directly so they consume the wrapper instead. The wrapper encapsulates the project's primary/secondary variants, three sizes, and a `loading` state — collapsing the per-page `sx` boilerplate (`textTransform: 'none'`, brand colors, padding) into a single component.

Purpose:
- Centralize the brand button shape so future tweaks happen in one file
- Replace ad-hoc per-page CircularProgress usage with a typed `loading` prop
- Keep the visual output at 1440px byte-identical to the pre-refactor state

Output:
- 1 new file: `src/components/Button.tsx`
- 3 refactored route files: `welcome`, `permissions`, `select-provider`
- 4 atomic commits (one per task)
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@./CLAUDE.md
@.planning/STATE.md
@src/app/welcome/page.tsx
@src/app/permissions/page.tsx
@src/app/select-provider/page.tsx

<interfaces>
<!-- The wrapper's exported types — downstream tasks must match this contract exactly. -->

From src/components/Button.tsx (NEW — Task 1 creates):
```typescript
type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<MuiButtonProps, 'variant' | 'startIcon' | 'size'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconStart?: ReactNode;
};

// Default export is a forwardRef'd component
```

Project conventions (from CLAUDE.md):
- MUI is the exclusive UI library; Emotion is the styling engine
- No `any`, no `console.log`
- `sx` prop arrays acceptable for composition: `sx={[base, ...(Array.isArray(sx) ? sx : [sx])]}`
- Dev server on port 3001 (not used by this plan — pure refactor + tsc gate)
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/components/Button.tsx wrapper</name>
  <files>src/components/Button.tsx</files>
  <action>
Create a NEW file at `src/components/Button.tsx`. The file must be a Client Component (top line: `'use client';`).

Imports (in order):
1. `import { forwardRef } from 'react';`
2. `import type { ReactNode } from 'react';`
3. `import MuiButton from '@mui/material/Button';`
4. `import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';`
5. `import CircularProgress from '@mui/material/CircularProgress';`

Define two local type aliases:
- `type ButtonVariant = 'primary' | 'secondary';`
- `type ButtonSize = 'sm' | 'md' | 'lg';`

Export the prop type:
```
export type ButtonProps = Omit<MuiButtonProps, 'variant' | 'startIcon' | 'size'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconStart?: ReactNode;
};
```

Declare a `SIZE_STYLES` constant keyed by `ButtonSize` with the EXACT values:
- `sm`: minHeight 32, px '16px', py '4px', fontSize 13
- `md`: minHeight 40, px '24px', py '8px', fontSize 14
- `lg`: minHeight 48, px '32px', py '12px', fontSize 16

The constant type is `Record<ButtonSize, { minHeight: number; px: string; py: string; fontSize: number }>`.

Declare a `VARIANT_STYLES` constant `as const` keyed by variant name with the EXACT values:
- `primary`: bgcolor '#005EFF', color '#FFFFFF', '&:hover' { bgcolor: '#004ACC' }, '&.Mui-disabled' { bgcolor: '#005EFF', color: '#FFFFFF', opacity: 0.3 }
- `secondary`: bgcolor '#F3FCFF', color '#001639', '&:hover' { bgcolor: '#E5F4FE' }, '&.Mui-disabled' { color: '#001639', opacity: 0.5 }

Define and default-export the component using `forwardRef<HTMLButtonElement, ButtonProps>`:
- Destructure: `{ variant = 'primary', size = 'md', loading = false, iconStart, disabled, sx, children, ...rest }`
- Compute `start`: `loading ? <CircularProgress size={18} color="inherit" /> : iconStart`
- Return a `<MuiButton>` with these props:
  - `ref={ref}`
  - `disableElevation`
  - `variant={variant === 'primary' ? 'contained' : 'text'}`
  - `disabled={disabled || loading}`
  - `startIcon={start}`
  - `sx={[ { textTransform: 'none', fontWeight: 500, borderRadius: '8px', ...SIZE_STYLES[size], ...VARIANT_STYLES[variant] }, ...(Array.isArray(sx) ? sx : [sx]) ]}`
  - `{...rest}`
  - Children: `{children}`

Name the forwardRef function explicitly `function Button(...)` so the displayName is preserved. Default-export the result.

Constraints (from CLAUDE.md):
- No `any` — strict types throughout
- No `console.log`
- MUI + Emotion only — no Tailwind, no other UI libraries
- File length should be ~60 LOC (one logical block)

The full intended implementation is captured in the planning_context's `<approved_implementation>` Task 1 block — match it character-for-character on the literals (the hex colors, the size numbers, the `'8px'` borderRadius, the `disableElevation` prop, and the `forwardRef` shape are all load-bearing).

Commit message: `feat(components): add thin Button wrapper with brand variants and loading state`
  </action>
  <verify>
    <automated>npx tsc --noEmit && test -f src/components/Button.tsx && grep -q "export type ButtonProps" src/components/Button.tsx && grep -q "forwardRef" src/components/Button.tsx && grep -q "CircularProgress" src/components/Button.tsx && grep -q "'#005EFF'" src/components/Button.tsx && grep -q "'#F3FCFF'" src/components/Button.tsx && grep -cv '^#' src/components/Button.tsx | head -1</automated>
  </verify>
  <done>
- `src/components/Button.tsx` exists
- File starts with `'use client';`
- Exports `ButtonProps` type and a default `forwardRef`'d Button
- `npx tsc --noEmit` exits 0
- File contains all six brand color literals (#005EFF, #004ACC, #FFFFFF, #F3FCFF, #E5F4FE, #001639)
- File imports `CircularProgress` from `@mui/material/CircularProgress`
- Single atomic commit landed
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Refactor src/app/welcome/page.tsx to use the wrapper</name>
  <files>src/app/welcome/page.tsx</files>
  <action>
Modify the existing `src/app/welcome/page.tsx`:

Import change:
- REMOVE the line `import Button from '@mui/material/Button';`
- ADD the line `import Button from '@/components/Button';` immediately after the `FetchLogo` import (currently line 9)

Button refactor:
- Replace the existing Button JSX at lines 61–80 (the "Get Started" CTA with `variant="contained"`, brand sx, and onClick to `/permissions`) with EXACTLY:

```
<Button fullWidth onClick={() => router.push('/permissions')}>
  Get Started
</Button>
```

That is: drop the `variant`, `size`, `color`, and `sx` props — the wrapper's defaults (variant='primary', size='md') match the previous styling. Keep `fullWidth` because it is an MUI Button prop the wrapper passes through via `{...rest}`, and the previous styling stretched the button across the panel.

Constraints:
- Do NOT remove or reorder any other imports
- Do NOT modify any other JSX or logic in the file
- The `'use client'` directive, `useRouter` hook, `FlowLayout`, `Stack`, `FetchLogo`, and `Typography` usages remain unchanged
- Visual output at 1440px must match pre-refactor exactly (the wrapper's defaults produce the same sentence-case, brand-blue, borderRadius 8px, fontWeight 500 button as the inlined sx did)

Commit message: `refactor(welcome): use thin Button wrapper instead of inline MUI Button styling`
  </action>
  <verify>
    <automated>npx tsc --noEmit && grep -q "from '@/components/Button'" src/app/welcome/page.tsx && ! grep -q "from '@mui/material/Button'" src/app/welcome/page.tsx && grep -q "Get Started" src/app/welcome/page.tsx && grep -q "router.push('/permissions')" src/app/welcome/page.tsx</automated>
  </verify>
  <done>
- `src/app/welcome/page.tsx` imports `Button` from `@/components/Button`
- `src/app/welcome/page.tsx` no longer imports from `@mui/material/Button`
- The "Get Started" Button is the wrapper invocation shown above (no inline `sx` brand styling)
- `npx tsc --noEmit` exits 0
- Single atomic commit landed
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Refactor src/app/permissions/page.tsx to use the wrapper</name>
  <files>src/app/permissions/page.tsx</files>
  <action>
Modify the existing `src/app/permissions/page.tsx`:

Import change:
- REMOVE the line `import Button from '@mui/material/Button';`
- ADD the line `import Button from '@/components/Button';` immediately after the `PermissionItem` import (currently line 10)

Button refactor:
- Replace BOTH existing Button JSX nodes at lines 89–127 (the "Back" and "Continue" CTAs) with EXACTLY:

```
<Button
  variant="secondary"
  onClick={() => router.push('/welcome')}
  sx={{ flex: 1 }}
>
  Back
</Button>
<Button
  onClick={() => router.push('/select-provider')}
  sx={{ flex: 1 }}
>
  Continue
</Button>
```

Notes:
- The Back button uses the wrapper's `variant="secondary"` to render the light-blue background + dark-navy text variant
- The Continue button omits `variant` — the wrapper defaults to `'primary'`
- Both retain `sx={{ flex: 1 }}` so they share the row evenly inside the existing parent Stack
- The parent Stack's direction/spacing/justification (Plan 02-04's existing layout) must remain unchanged

Constraints:
- Do NOT remove or reorder any other imports
- Do NOT modify any other JSX, the PERMISSIONS array, the grid layout, the `FlowLayout` wrapper, or any non-Button logic
- Visual output at 1440px must match pre-refactor exactly

Commit message: `refactor(permissions): use thin Button wrapper for Back/Continue row`
  </action>
  <verify>
    <automated>npx tsc --noEmit && grep -q "from '@/components/Button'" src/app/permissions/page.tsx && ! grep -q "from '@mui/material/Button'" src/app/permissions/page.tsx && grep -q "variant=\"secondary\"" src/app/permissions/page.tsx && grep -q "router.push('/welcome')" src/app/permissions/page.tsx && grep -q "router.push('/select-provider')" src/app/permissions/page.tsx</automated>
  </verify>
  <done>
- `src/app/permissions/page.tsx` imports `Button` from `@/components/Button`
- `src/app/permissions/page.tsx` no longer imports from `@mui/material/Button`
- Both Back and Continue buttons are wrapper invocations with `sx={{ flex: 1 }}`
- Back uses `variant="secondary"`; Continue uses the wrapper's default primary variant
- `npx tsc --noEmit` exits 0
- Single atomic commit landed
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 4: Refactor src/app/select-provider/page.tsx to use the wrapper (with loading prop)</name>
  <files>src/app/select-provider/page.tsx</files>
  <action>
Modify the existing `src/app/select-provider/page.tsx`:

Import changes (apply all three):
- REMOVE the line `import Button from '@mui/material/Button';`
- REMOVE the line `import CircularProgress from '@mui/material/CircularProgress';` (currently line 13)
- ADD the line `import Button from '@/components/Button';` immediately after the `FetchLogo` import (currently line 15)

The wrapper owns the spinner now, so `CircularProgress` is no longer needed at the page level.

Button refactor:
- Replace BOTH existing Button JSX nodes at lines 170–214 (the "Back" and "Get Started"/"Redirecting…" CTAs) with EXACTLY:

```
<Button
  variant="secondary"
  onClick={handleBack}
  disabled={submitting}
  sx={{ width: 100, flexShrink: 0 }}
>
  Back
</Button>
<Button
  onClick={handleConnect}
  disabled={!selected}
  loading={submitting}
  sx={{ flex: 1 }}
>
  {submitting ? 'Redirecting…' : 'Get Started'}
</Button>
```

Notes:
- The primary action now uses the wrapper's `loading={submitting}` prop instead of a manually rendered `<CircularProgress />` in `startIcon` — the wrapper handles spinner rendering AND auto-disables the button while loading. `disabled={!selected}` is still explicit because that gate is independent of the loading state.
- Back stays `disabled={submitting}` and `variant="secondary"` to render the light-blue + dark-navy treatment.
- The "Get Started" / "Redirecting…" label swap (Plan 03-01's `submitting ? 'Redirecting…' : 'Get Started'` pattern) is preserved verbatim.
- Both buttons keep their per-instance sx (`width: 100, flexShrink: 0` on Back; `flex: 1` on the primary CTA) so the row geometry inside the parent Stack is unchanged.

Constraints:
- Do NOT remove or reorder any other imports (notably the MUI Select/MenuItem/InputLabel/FormControl imports, `handleBack`, `handleConnect`, `useRouter`, `useState`, `useRef`, `useEffect`, provider catalog imports — all stay)
- Do NOT modify the Select, the timer logic, the `submitting` state, or any non-Button JSX or logic
- Visual output at 1440px must match pre-refactor exactly — including the spinner rendering during the 1.2s submitting window (wrapper renders the same `<CircularProgress size={18} color="inherit" />` the page used to render inline)

Commit message: `refactor(select-provider): use thin Button wrapper with loading prop (drops direct CircularProgress import)`
  </action>
  <verify>
    <automated>npx tsc --noEmit && grep -q "from '@/components/Button'" src/app/select-provider/page.tsx && ! grep -q "from '@mui/material/Button'" src/app/select-provider/page.tsx && ! grep -q "from '@mui/material/CircularProgress'" src/app/select-provider/page.tsx && grep -q "loading={submitting}" src/app/select-provider/page.tsx && grep -q "Redirecting" src/app/select-provider/page.tsx && grep -q "Get Started" src/app/select-provider/page.tsx && grep -q "variant=\"secondary\"" src/app/select-provider/page.tsx</automated>
  </verify>
  <done>
- `src/app/select-provider/page.tsx` imports `Button` from `@/components/Button`
- `src/app/select-provider/page.tsx` no longer imports `Button` from `@mui/material/Button`
- `src/app/select-provider/page.tsx` no longer imports `CircularProgress` from `@mui/material/CircularProgress`
- The primary CTA uses `loading={submitting}` (NOT an inline `<CircularProgress>` in `startIcon`)
- Back CTA uses `variant="secondary"`, `disabled={submitting}`, `sx={{ width: 100, flexShrink: 0 }}`
- The submitting-state label swap (`Redirecting…` ↔ `Get Started`) is preserved
- `npx tsc --noEmit` exits 0
- Single atomic commit landed
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

This is a pure UI refactor — no new trust boundaries are crossed. The Button wrapper does not touch network, storage, or user input handling. All existing trust boundaries (client → API routes, client → router) are unchanged.

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-quick-01 | Tampering | sx-prop merge in Button wrapper | mitigate | The wrapper accepts caller `sx` via `[base, ...(Array.isArray(sx) ? sx : [sx])]` — caller sx wins on conflict, which is intentional and bounded to styling. No code execution path is exposed. |
| T-quick-02 | Information Disclosure | loading state | accept | The `loading` prop controls a spinner only; no sensitive data is rendered or exposed by the wrapper. |
| T-quick-03 | Denial of Service | re-render churn from inline functions | accept | The wrapper does not introduce new render churn beyond what callers already do (inline `onClick` arrows). No regression vs. pre-refactor. |

No package installs in this plan — Supply-Chain (T-quick-SC) gate is N/A.
</threat_model>

<verification>
Phase-level checks (after all four tasks):

1. `npx tsc --noEmit` exits 0
2. `grep -rn "from '@mui/material/Button'" src/` returns ZERO matches (the wrapper is the only direct consumer; pages all import from `@/components/Button`)
3. `grep -rn "from '@/components/Button'" src/app/` returns EXACTLY three matches (welcome, permissions, select-provider)
4. `grep -rn "CircularProgress" src/app/` returns ZERO matches — the wrapper owns spinner rendering; no page imports CircularProgress directly anymore
5. `grep -c "from '@mui/material/CircularProgress'" src/components/Button.tsx` returns 1 — the wrapper is the sole CircularProgress consumer
6. Manual visual check at 1440px on `/welcome`, `/permissions`, `/select-provider`: every button looks identical to pre-refactor (same colors, padding, radius, font weight, sentence case, spinner-during-loading on /select-provider)
7. Click-through smoke: `/welcome → /permissions → /select-provider`, with Back navigation working from each step, and the Connect button on /select-provider showing the spinner + "Redirecting…" label during the 1.2s submitting window

Each task's atomic commit landed in order: feat(components) → refactor(welcome) → refactor(permissions) → refactor(select-provider).
</verification>

<success_criteria>
- [ ] `src/components/Button.tsx` exists, ~60 LOC, exports `ButtonProps` + default `forwardRef`'d Button
- [ ] `src/app/welcome/page.tsx`, `src/app/permissions/page.tsx`, `src/app/select-provider/page.tsx` all import Button from `@/components/Button`
- [ ] No `@mui/material/Button` import remains in `src/app/`
- [ ] No `@mui/material/CircularProgress` import remains in `src/app/` (only the wrapper imports it)
- [ ] `npx tsc --noEmit` exits 0 (TypeScript strict, no `any`)
- [ ] No `console.log` anywhere in modified files (`grep -rn "console.log" src/components/Button.tsx src/app/welcome/page.tsx src/app/permissions/page.tsx src/app/select-provider/page.tsx` returns 0)
- [ ] Four atomic commits landed in order with conventional-commit messages
- [ ] Visual output at 1440px on /welcome, /permissions, /select-provider matches pre-refactor exactly
- [ ] The /select-provider loading state (spinner + "Redirecting…") works via `loading={submitting}` on the wrapper instead of inline CircularProgress
</success_criteria>

<output>
Create `.planning/quick/260521-lhj-create-thin-button-wrapper-component-and/260521-lhj-SUMMARY.md` when all four tasks complete.

The summary should record:
- The four commits' SHAs
- `tsc --noEmit` exit code (must be 0)
- Whether the wrapper's defaults exactly preserved per-page styling (Yes/No, with notes)
- Any deviations from the approved implementation (there should be none — implementation was fully specified)
</output>
