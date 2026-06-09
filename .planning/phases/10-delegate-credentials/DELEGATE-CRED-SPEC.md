# Phase 10 — Delegate Credential Entry — Spec

Bug: the invited user (`/recipient`) "Get Started" hardcodes `/connecting?provider={slug}`, skipping the type-specific credential entry — so an SFTP invite never asks the recipient for Host + credentials. Fix: `/recipient` must branch by `provider.authMethod` IDENTICALLY to the self "I'll connect it now" on `/connect-method`, via a SHARED helper (no duplication). Branch `demo-home`. DS components, theme/tokens only, no new deps.

## Already correct (verify, no change)
`?provider=` already propagates through the whole delegate chain:
- `/invite?provider=` → "Send invite" → `/invitation-sent?provider={slug}` (and "Back" → `/connect-method?provider={slug}`)
- `/invitation-sent?provider=` → demo "Open the invite as the teammate" → `/recipient?provider={slug}` (and "Resend invite" → `/invite?provider={slug}`)
- `/recipient` already reads `?provider=` with the Suspense guard.
No edits needed to `/invite` or `/invitation-sent`.

## 1. NEW shared helper `src/lib/connectRoute.ts`
Factor the per-type "connect now" routing (currently inline in `/connect-method`'s `handleSelfClick`) into one place:
```ts
import type { Provider } from '@/lib/providers';

// The path a user takes to START connecting NOW — used by BOTH the self path
// (/connect-method "I'll connect it now") and the invited recipient
// (/recipient "Get Started"), so the two stay identical:
//   • redirect (Gusto)        → the bespoke Gusto OAuth mock (/gusto-login)
//   • credentials / sftp      → the per-type credential card (/credentials?provider=)
// The credential card then continues: Principal → /verify (2FA) → /connecting →
// /success; SFTP → /connecting → /success; Gusto authorize → /connecting → /success.
export function connectNowPath(provider: Provider): string {
  return provider.authMethod === 'redirect'
    ? '/gusto-login'
    : `/credentials?provider=${provider.slug}`;
}
```

## 2. `src/app/connect-method/page.tsx` — use the helper
Replace the inline `handleSelfClick` body with the helper:
```ts
import { connectNowPath } from '@/lib/connectRoute';
...
const handleSelfClick = () => router.push(connectNowPath(provider));
```
(Behavior unchanged — same routing, now shared. Keep the delegate OptionRow → `/invite?provider={slug}`.)

## 3. `src/app/recipient/page.tsx` — branch by authMethod via the helper
Change "Get Started" from the hardcoded `router.push(\`/connecting?provider=${slug}\`)` to:
```ts
onClick={() => router.push(connectNowPath(provider))}
```
Import `connectNowPath`. Update the stale comment (no more "forwards the slug to /connecting"; now it enters the same per-type credential entry as the self path). No `&2fa=1` anywhere on the recipient path (the credential card / 2FA ordering handles it).

## Resulting delegate flow per type (acceptance)
`/connect-method?provider=X → "Someone on my team manages it" → /invite?provider=X → Send invite → /invitation-sent?provider=X → open as teammate → /recipient?provider=X → Get Started →`
- **Gusto:** → `/gusto-login` → Authorize → `/connecting?provider=gusto` → `/success`
- **Principal:** → `/credentials?provider=principal` (Email + Password) → Continue → `/verify` (2FA) → `/connecting` → `/success`
- **SFTP:** → `/credentials?provider=sftp` (Host + Username + Password) → Continue → `/connecting` → `/success`

## Constraints
MUI v9 + Emotion; DS components; theme/tokens only (lint:tokens green); strict TS no `any`; no console.log; no new deps; port 3001. Touch only: NEW `src/lib/connectRoute.ts`, `src/app/connect-method/page.tsx`, `src/app/recipient/page.tsx`. Do NOT change /invite, /invitation-sent, /credentials, /verify, /connecting, /gusto-login, providers.ts.

## Requirement
- **DELG-01** — the invited recipient goes through the SAME per-type credential entry as the self path (Gusto mock / Principal creds+2FA / SFTP host+creds), via a shared `connectNowPath` helper; `?provider=` preserved through the delegate chain; no hardcoded self-tail on `/recipient`.
