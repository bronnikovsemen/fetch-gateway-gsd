---
status: partial
phase: 03-provider-selection-connecting-bridge
source: [03-VERIFICATION.md]
started: 2026-05-18T20:48:00Z
updated: 2026-05-18T20:48:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Connect button loading-state visible feedback
expected: At `http://localhost:3001/select-provider`, selecting "Gusto" and clicking Connect immediately swaps the Connect label to "Connecting…" with an inline circular spinner; Back button visibly disables (greyed); Select/FormControl visibly disables; after ~1.2s the URL changes to `/connecting?provider=gusto`.
result: [pending]

### 2. `/connecting` spinner panel renders and auto-advances
expected: At `http://localhost:3001/connecting?provider=gusto`, a centered 440px white panel on light-blue background shows the Fetch logo, a visible MUI `CircularProgress` spinning, the heading "Establishing connection…", and the body "Connecting to Gusto. You'll be redirected to sign in." After ~2.5s the URL replaces with `/success`.
result: [pending]

### 3. Back-button history behavior (transient-route convention)
expected: After walking `/select-provider` → select provider → Connect → `/success`, pressing the browser Back button returns to `/select-provider`, NOT to `/connecting` (both `/connecting` navigations use `router.replace`, so the bridge URL never enters history).
result: [pending]

### 4. Invalid-slug guard fires without panel flash
expected: Visiting `http://localhost:3001/connecting?provider=bogus` shows no flash of the spinner panel — the page is blank for a tick, then the URL changes to `/select-provider`. The user does not perceive a redirecting connecting screen.
result: [pending]

### 5. End-to-end flow at 1440px
expected: At 1440px viewport, the full walk `/` → (2.5s splash) → `/welcome` → Get Started → `/permissions` → Continue → `/select-provider` → select Rippling → Connect → (1.2s loading) → `/connecting?provider=rippling` → (2.5s) → `/success` is smooth, on-brand, and production-quality. No dead buttons, no placeholder content along the Phase 3 segment.
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps
