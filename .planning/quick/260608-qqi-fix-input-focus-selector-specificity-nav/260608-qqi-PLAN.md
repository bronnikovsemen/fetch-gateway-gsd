---
quick_id: 260608-qqi
slug: fix-input-focus-selector-specificity-nav
status: complete
date: 2026-06-08
---

# Quick Task 260608-qqi — Fix Input focus selector specificity (navy 2px border)

## Problem

`src/components/Input.tsx` overrode the outlined TextField focus outline to navy
(`secondary.main`), but used the selector `& .Mui-focused .MuiOutlinedInput-notchedOutline`.
That single-class selector has **lower CSS specificity** than MUI's built-in focus rule
(`.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline`), so MUI's default
purple won the cascade and the focus border rendered purple instead of navy.

## Task (one file)

- `src/components/Input.tsx`: change the focus selector to
  `& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline`
  (keeping `borderColor: 'secondary.main'`, `borderWidth: 2`) so the override matches
  MUI's specificity and wins.

**verify:** `tsc --noEmit`, `lint`, `lint:tokens`, `build` all green; on `/ds-preview`
a focused field shows a navy (`secondary.main` = `#0a2540`) 2px border, not purple.

**done:** compiled CSS for the focused notched outline binds `#0a2540` / `border-width:2px`.

## Note

The code edit was applied and committed inline in the prior session turn as
`5f47356` ("fix(input): match MUI specificity so navy focus outline wins") before this
quick task was formally opened. This task retroactively logs it and adds the runtime
`/ds-preview` verification that confirms the navy focus border renders.
