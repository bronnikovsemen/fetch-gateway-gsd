---
quick_id: 260608-qqi
slug: fix-input-focus-selector-specificity-nav
status: complete
date: 2026-06-08
commit: 5f47356
---

# Summary — 260608-qqi

**Outcome:** Input focus border now renders navy (`secondary.main` #0a2540) 2px instead of
MUI-default purple. One-file change in `src/components/Input.tsx`.

## Change

`src/components/Input.tsx` focus selector:

```diff
- '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
+ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'secondary.main',
    borderWidth: 2,
  },
```

Root cause: the single-class `.Mui-focused …` selector lost the cascade to MUI's
two-class built-in focus rule. Anchoring to `.MuiOutlinedInput-root.Mui-focused` matches
MUI's specificity so the navy override wins.

## Verification

- `npx tsc --noEmit` → 0 errors
- `npm run lint` → No ESLint warnings or errors
- `npm run lint:tokens` → PASS (no off-token hex/px in src/)
- `npm run build` → compiles
- **Runtime (`/ds-preview`, HTTP 200):** compiled CSS rule is
  `.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline{border-color:#0a2540;border-width:2px;}`
  — navy bound to the focus outline; purple `#635bff` absent from that rule.

## Commit

Code change committed inline in the prior session turn as `5f47356`
("fix(input): match MUI specificity so navy focus outline wins"). This quick task
retroactively logs the work and adds the runtime navy-focus verification. No further
code change was needed at task-open time.
