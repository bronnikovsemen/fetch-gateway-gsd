# Phase 07 — Connection Re-align — Spec (authoritative)

Re-align the 10 connection-flow screens to the CURRENT Figma section "Connection flows" (file `pZYTXYGKR5lJAcaE0SnzLV`, node 477:453). Pulled live 2026-06-09. Figma authoritative. Use CURRENT DS components everywhere (Input/Button/Link/OptionRow), FetchLogo cluster (with the CONNECT·SYNC·SIMPLIFY tagline, default), theme/tokens only (lint:tokens green; the `/gusto-login` bespoke exception stays). **PRESERVE the per-type self behavior** (Gusto→/gusto-login; Principal→creds modal+2FA; SFTP→host+creds form per 8:365) — only layout/copy/components change, not routing.

## Shared chrome (every screen)
`FlowLayout` (maxWidth per node; px=4 py=4 = 32px, EXCEPT permissions p=40), `Stack spacing={3}` (gap-24), centered. Header = `<FetchLogo />` (cluster, default tagline). Title `Typography variant="h5"` text.primary centered; subtitle `variant="body2"` text.secondary centered. Primary `Button` (variant primary, full width OR in an actions row). DS `Link` size="sm" navy. Cards on `background.default` page.

## Two component changes
1. **DS `Input` gains a `select` mode** (for /select-provider): add `select?: boolean` + `children?: React.ReactNode`; when `select`, pass `select`/`children` through to MUI TextField and use a chevron-down icon (`@mui/icons-material/KeyboardArrowDown`) via `slotProps.select.IconComponent` (or SelectProps). Keep the same DS styling (white bg, divider border, radius.md, primary.main focus, notched label). Backward-compatible (existing text usages unaffected).
2. **`PermissionItem` icon → check-circle** (for /permissions): a 20px circle `bgcolor: (t) => alpha(t.palette.primary.main, 0.12)` (light purple) containing a purple `@mui/icons-material/CheckRounded` (`sx={{ fontSize: ~13, color: 'primary.main' }}`). Import `alpha` from `@mui/material/styles`. Verify the current PermissionItem layout (icon + title Medium 14 text.primary + desc Regular 12 text.secondary, gap ~10) otherwise matches 462:247.

---

## Per-screen targets

### /welcome — node 454:70  (card 440)
- h5 **"Connect your payroll data"** (was "…provider"). subtitle **"Plantegrity has requested a secure read-only connection to your payroll data. No data will be modified."** Button **"Get Started"** → `/permissions`.

### /permissions — node 456:114  (card **640**, padding **40** → `px={5} py={5}`)
- h5 **"Fetch will need access to:"** (was "To connect your payroll, …").
- 2-column grid (`gap-32` between cols, `gap-20` between rows), 6 `PermissionItem`s with the new check-circle icon:
  - Col 1: Organization ("Business profile, contact details, and banking information"), Team ("Roster of people and reporting structure"), Employment ("Employment status, contact details, role, and compensation" ← note "contact details,").
  - Col 2: Payroll ("Payments made to employees and contractors"), Pay Statement ("Itemized pay statements per employee"), SSN ("Social Security Numbers for tax reporting").
- actions row (gap-16): **Back** (DS Button variant secondary/outline, fixed ~120px) → `/welcome`; **Continue** (DS Button primary, flex-2) → `/select-provider`.

### /select-provider — node 454:82  (card 440)
- h5 **"What do you want to connect?"** (was "What are you connecting?"); subtitle "Choose the system you want to connect".
- **Replace the tonal grey MUI Select with the DS `Input` in `select` mode**: label "Connection", value = selected provider name, chevron-down icon at right, white/bordered/radius.md (the Figma Input look). Options: **Gusto / Principal / SFTP** (from `providers`). Controlled `useState`.
- actions row (gap-12): **Back** (DS Button secondary, ~120px) → `/permissions`; **Continue** (DS Button primary, flex-1, disabled until a provider is selected) → `/connect-method?provider={slug}`.
- Remove the old `Select`/`MenuItem`/`KeyboardArrowDownIcon`-on-tonal-bg implementation and the `action.hover` tonal styling.

### /connect-method — node 452:58  (card 440) — already aligned
- h5 "How do you want to connect {Provider}?"; subtitle "Pick whoever has access to your {Provider} account."; two `OptionRow`s ("I'll connect it now" / "I have access to {Provider}"; "Someone on my team manages it" / "We'll send them a secure link to connect"). **No change to per-type routing** (Gusto→/gusto-login; creds/sftp→modal). Verify chrome only.

### /connecting — node 454:103  (card 400)
- spinner (`CircularProgress`); h5 **"Establishing connection…"**; subtitle **"Connecting to {Provider}. You'll be redirected to sign in."** Keep the 2FA gate routing (`?2fa=1`→/verify else /success). Align: FetchLogo cluster, h5 (not 700-weight), body2 subtitle, card 400.

### /verify — node 455:89  (card 400)
- h5 "Enter verification code"; subtitle "We sent a 6-digit code to your phone".
- **OTP: 6 cells, gap-8, each 48×56, `tokens.radius.md` (8).** Filled cells: `bgcolor: 'background.default'`, 1px `divider`. Empty cells: `bgcolor: 'background.paper'`, 1px `divider`. **Active cell: `bgcolor: 'background.paper'`, 2px `primary.main` (purple — was navy `secondary.main`).** Digit = h5 (22 SemiBold) text.primary.
- Button "Verify" → `/success`. Resend row: caption "Didn't receive a code?" + Link size="sm" "Resend code" (clears code).

### /success — node 455:115  (card 400)
- **Success mark = a 56px circle `bgcolor: 'success.main'` (radius full) containing a white `@mui/icons-material/CheckRounded` (`sx={{ fontSize: 28, color: 'background.paper' }}`)** — replace the current `CheckCircleRounded`. h5 "You're connected"; subtitle "Plantegrity is now securely syncing your organization's data."; Button "Continue" → `/`.

### /invite — node 456:147  (card 440)
- h5 "Ask a teammate to connect {Provider}"; subtitle "We'll email them a secure link. Credentials never leave {Provider}."; three DS `Input`s (Work email, Name (optional), Note (optional)).
- **actions row (gap-12): Back (DS Button secondary, ~120px) → `/connect-method?provider={slug}`; Send invite (DS Button primary, flex-2) → `/invitation-sent?provider={slug}`.** (Change from the current full-width button + "Back" link to a Back-button + Send-invite-button row.)

### /invitation-sent — node 456:176  (card 400)
- h5 "Invitation sent"; subtitle "We emailed your teammate a secure link to connect {Provider}. The connection stays pending until they finish." Button "Done" → `/`. Link size="sm" "Resend invite" → `/invite?provider={slug}`.
- **Remove the navy check mark AND the "Pending" Chip** (not in canonical 456:176).
- Keep one small demo Link "Open the invite as the teammate (demo)" → `/recipient?provider={slug}` BELOW "Resend invite" so /recipient stays reachable (demo addition, not in Figma — flag it; without it the recipient screen is unreachable).

### /recipient — node 455:129  (card 400)
- h5 "Plantegrity asked you to connect {Provider}"; subtitle "Acme Inc. invited you to securely connect your {Provider} account. Read-only — no data is modified."; Button "Get Started" → `/connecting?provider={slug}&2fa=1` (reuses the self tail). **Remove the caption footer** ("Continues through the same…") — not in canonical.

---

## Demo home (`/`) tweak
Change the Connection-flow OptionRow description "Connect a payroll provider — Gusto, Principal, or SFTP" → **"Connect a payroll system — Gusto, Principal, or SFTP"** (Principal/SFTP aren't payroll "providers").

## Acceptance
tsc/lint/lint:tokens/build pass; on :3001 each connection screen matches its 477:453 node (esp. /select-provider white "Connection" dropdown + "What do you want to connect?", /welcome "payroll data", /permissions 640 + 2-col + check-circle, /verify purple active cell, /invite Back+Send row, /invitation-sent no chip/mark, /recipient no caption). Per-type self flows still work (Gusto→/gusto-login→success; Principal→modal→2FA→success; SFTP→host form→success). No dead buttons; no new deps; /gusto-login untouched.

## Requirements (REQUIREMENTS.md)
- **REALIGN-01** — pre-provider screens re-aligned: /welcome, /permissions (640 + check-circle), /select-provider (DS Input dropdown).
- **REALIGN-02** — connection screens re-aligned: /connect-method, /connecting, /verify (purple active cell), /success (green check-circle).
- **REALIGN-03** — delegate screens re-aligned: /invite (Back+Send row), /invitation-sent (no chip/mark), /recipient (no caption); + home description fix.

## Out of scope
Per-type routing changes; /gusto-login restyle; recreating Figma illustrations; new deps.
