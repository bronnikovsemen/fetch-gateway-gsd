# Phase 08 — Credential Card — Spec

Replace the "weird" plain MUI Dialog credential modal (Principal/SFTP self path) with a flow CARD that looks exactly like `/verify`, and reorder so `/connecting` ("Establishing connection…") is only ever reached AFTER credentials are submitted. Branch `demo-home`. DS components + theme/tokens only.

## Decision: a new route `/credentials?provider=…`
A dedicated card route (mirrors `/verify` 1:1) is cleaner than restyling the modal and makes the ordering explicit. `/connect-method` "I'll connect it now" navigates here for credentials/sftp providers (Gusto still → `/gusto-login`).

## NEW `src/app/credentials/page.tsx` ('use client') — must be visually identical to `/verify`
Mirror `/verify`'s structure verbatim:
- Suspense + `useSearchParams` `?provider=` guard (inner `CredentialsContent` + default `Page` wrapping `<Suspense fallback={null}>`). Resolve slug against `providers`; **if missing/unknown OR `authMethod === 'redirect'`** (Gusto doesn't use this card) → `router.replace('/select-provider')`. Only catalog `name` rendered.
- `FlowLayout maxWidth={400} px={4} py={4}`; `Stack spacing={2.5}` with `alignItems: 'center', textAlign: 'center'`.
- `<FetchLogo size={40} />`; `Typography variant="h5" component="h1"` title; `Typography variant="body2"` (text.secondary) subtitle.
- Controlled DS `Input`s (full width), per `authMethod`:
  - **credentials (Principal):** title **"Sign in to Principal"** (i.e. `Sign in to ${name}`); subtitle `Enter your ${name} credentials to connect. Read-only access.`; fields: "Email or username" + "Password" (type="password").
  - **sftp (SFTP):** title **"Connect via SFTP"**; subtitle "Enter your SFTP administrator credentials"; fields: "Host" (placeholder "Enter the host") + "Username or Email" (placeholder "Enter the username/email") + "Password" type="password" (placeholder "Enter the password"); plus a footer `Typography variant="caption"` (text.secondary, centered) "Your credentials are encrypted and never stored by Fetch".
- Primary DS `Button` (variant primary, `sx={{ width: '100%' }}`) **"Continue"** → `router.push('/connecting?provider=' + slug + suffix)` where `suffix = authMethod === 'credentials' ? '&2fa=1' : ''`. (Principal carries &2fa=1 → /verify; SFTP no 2FA.)
- A DS `Link` (the "optional Link" slot, like /verify's "Resend code"): centered "Back" → `router.push('/connect-method?provider=' + slug)`.
- Use the same spacing/tokens as /verify (no Dialog, no off-token hex/px).

## EDIT `src/app/connect-method/page.tsx` — remove the modal, rewire
- Delete the `<Dialog>` modal entirely and its state (`open`, `host`, `username`, `password`) + `handleConnect`. Remove now-unused imports (`Dialog`, `Input`, `Button`, `Link`, `tokens`, `useState`). Return just the `<FlowLayout>` (no fragment).
- `handleSelfClick`:
  - `authMethod === 'redirect'` (Gusto) → `router.push('/gusto-login')` (unchanged).
  - else (credentials/sftp) → `router.push('/credentials?provider=' + slug)`.
- Delegate OptionRow unchanged (→ `/invite?provider=`).

## Resulting order (acceptance)
- **Principal:** /connect-method "I'll connect it now" → **/credentials** (Email+Password card) → Continue → /connecting → /verify (2FA) → /success.
- **SFTP:** /connect-method "I'll connect it now" → **/credentials** (Host+Username+Password card) → Continue → /connecting → /success.
- **Gusto:** /connect-method → /gusto-login → Authorize → /connecting?provider=gusto → /success. (unchanged)
- **/connecting is never reached before credentials** for the self credentials/sftp paths (the decision screen no longer routes to /connecting; only /credentials' Continue or /gusto-login's Authorize do).

## Constraints
MUI v9 + Emotion only; DS components (FlowLayout/FetchLogo/Input/Button/Link); theme/tokens only — lint:tokens green; strict TS no `any`; no console.log; no new deps; port 3001. Don't touch /gusto-login, /verify, /connecting, /success, providers.ts.

## Requirement
- **CRED-01** — credential entry is a flow card (`/credentials`) identical to /verify (Principal: Email+Password; SFTP: Host+Username+Password per 8:365); /connecting only after credential submit; Gusto unchanged.
