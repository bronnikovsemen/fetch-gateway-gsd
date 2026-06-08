# V2 Connection Flow — Figma Spec (authoritative)

Pulled live from Figma COPY file `is2HhftlhJsdorY0J7zKdr`, canvas **Connection flow v2** (node 2068:70) on 2026-06-08. Figma is authoritative; where it disagrees with the brief, Figma wins. Build by assembling the Phase-A DS components (`OptionRow`, `Chip`, `Input`, `Link`, `Button`, `FetchLogo`, `FlowLayout`) — never raw MUI where a DS component exists.

## Flow graph (v2)

```
/ (splash) → /welcome → /permissions → /select-provider
                                              │ Continue (provider chosen)
                                              ▼
                                  /connect-method?provider={slug}   ← NEW (FLOW-09)
                                     │                        │
                "I'll connect it now"│                        │"Someone on my team manages it"
                            (self)   ▼                        ▼  (delegate)
                  /connecting?provider={slug}        /invite?provider={slug}        ← NEW (FLOW-10)
                            │                                 │ Send invite
                  2FA required?                               ▼
                    │        │                      /invitation-sent?provider={slug} ← NEW (FLOW-10)
                yes │        │ no                       (Chip "Pending" warning)
                    ▼        │                                │ (Done → end; Resend → stays)
        /verify?provider={slug}  ← NEW (FLOW-11)              │
                    │        │                                ▼
                    ▼        ▼                      /recipient?provider={slug}        ← NEW (FLOW-10)
                  /success ◀─┘                         "Plantegrity asked you to connect {Provider}"
                                                            │ Continue
                                                            ▼
                                            /permissions → /connecting → (/verify) → /success
```

**Delegated "pick simplest" decisions (documented):**
- **2FA gate** = a demo query param `?2fa=1` on `/connecting` (and carried to `/verify`). Simplest, no provider-data change. When present, `/connecting` routes to `/verify`; otherwise straight to `/success`.
- **Recipient entry** = a dedicated **`/recipient?provider={slug}`** route (clearer than overloading `/welcome?invite=`). Its "Continue" enters the normal `/permissions → /connecting → (/verify) → /success` chain.

## Provider name resolution
All `{Provider}` text resolves from `src/lib/providers.ts` via the `?provider={slug}` param (`providers.find(p => p.slug === slug)?.name`). Invalid/missing slug → redirect to `/select-provider` (mirror the existing `/connecting` guard + Suspense-wrapped `useSearchParams`).

## Shared screen chrome
`FlowLayout` (centered Paper, `background.default` page / `background.paper` card, `tokens.radius.lg`, soft rgba shadow) + header = `<FetchLogo size={64} />` then `Typography variant="h5"` title + `variant="body2"` subtitle (`text.secondary`), centered. (Figma's "AuthLogoCluster" wordmark+tagline is represented by the existing `FetchLogo` raster; existing screens omit the "CONNECT · SYNC · SIMPLIFY" tagline — stay consistent, do not add it to only the new screens.)

---

## STAGE 1 — Select-Provider-first rewire + /connect-method (FLOW-09)

### 1a. Rewire `src/app/select-provider/page.tsx`
- Change submit target `/connecting?provider=${selected}` → **`/connect-method?provider=${selected}`**.
- Relabel the primary button "Get Started" → **"Continue"** (Figma 2068:137 button text; also resolves the old WR-01 copy defect). Keep the existing Back button, Select, and loading-submit mechanism otherwise unchanged.
- No other visual change in Stage 1 (the DS `Input`-styled provider field in Figma has no DS Select equivalent; the existing tonal MUI `Select` is a legitimate raw-MUI exception and stays).

### 1b. NEW `src/app/connect-method/page.tsx` ('use client') — Figma 2068:155
- Read `?provider=` via `useSearchParams` inside a `<Suspense>` wrapper (mirror `/connecting`). Validate slug against `providers`; invalid/missing → `router.replace('/select-provider')`.
- `FlowLayout` card (maxWidth 440; padding ≈32px → `px={4} py={4}`; inter-element gap 16 → `Stack spacing={2}`).
- Header: `<FetchLogo size={64} />`, `h5` **"How do you want to connect {Provider}?"**, `body2` **"Pick whoever has access to your {Provider} account."** (centered).
- Two DS `OptionRow`s (full width), in order:
  1. `title="I’ll connect it now"`, `description="I have access to {Provider}"` → `onClick` → `router.push('/connecting?provider=' + slug)` **(self)**
  2. `title="Someone on my team manages it"`, `description="We’ll send them a secure link to connect"` → `onClick` → `router.push('/invite?provider=' + slug)` **(delegate)**
- Copy is verbatim Figma (overrides the brief's slightly different wording).

**Stage-1 note:** the delegate `OptionRow` points at `/invite`, which is built in **Stage 3**. Until then that destination 404s — expected in branch-at-a-time delivery; it is an intentional navigation, not a dead button. Flagged at the Stage-1 checkpoint.

### Stage 1 acceptance
`tsc --noEmit` · `lint` · `lint:tokens` · `build` all green; `/select-provider` Continue → `/connect-method?provider=…`; `/connect-method` renders both OptionRows; self → `/connecting`; delegate → `/invite` (lands Stage 3). No off-token hex/px. No new deps.

---

## STAGE 2 — self branch: /verify 2FA + /connecting gate + /success  (FLOW-11)
(Detail pulled when Stage 2 starts — frames: Establishing 2069:105, 2FA 2069:116, Success 2069:145.)
- `/connecting`: if `?2fa=1` present → route to `/verify?provider=…&2fa=1`; else → `/success`.
- NEW `/verify` (Figma 2069:116): h5 "Enter verification code", body2 "We sent a 6-digit code to your phone", **6-cell OTP built from token-styled `Box` primitives** (no DS OTP exists; `tokens.radius.md`, `divider` border, `secondary.main` on active/filled per the 2FA frame), primary `Button` "Verify" → `/success`, and a `Link` "Resend code" (with caption "Didn’t receive a code?"). Strict TS, theme/tokens only.
- `/success` (existing, Figma 2069:145): confirm copy/Button align ("You’re connected" / done).

## STAGE 3 — delegate branch: /invite + /invitation-sent + /recipient  (FLOW-10)
(Detail pulled when Stage 3 starts — frames: Invite 2070:123, Invitation-sent 2070:146, Recipient 2070:162.)
- NEW `/invite` (2070:123): h5 "Ask a teammate to connect {Provider}", body2 secure-link subtitle, three DS `Input`s (work email [required], name [optional], note [optional]), primary `Button` "Send invite" → `/invitation-sent?provider=…`, `Link` "Back".
- NEW `/invitation-sent` (2070:146): success mark, h5 "Invitation sent", body2 confirmation, **DS `Chip severity="warning" label="Pending"`**, primary `Button` "Done", `Link` "Resend invite".
- NEW `/recipient` (2070:162): h5 "Plantegrity asked you to connect {Provider}", body2 read-only context, primary `Button` "Continue" → `/permissions?...` entering the normal chain, caption "Continues through the same Permissions → sign-in → Success steps."

## Requirements added (canonical REQUIREMENTS.md)
- **FLOW-09** — `/connect-method` decision screen (two OptionRow branches: self → /connecting, delegate → /invite). *(Stage 1)*
- **FLOW-10** — delegate branch: `/invite`, `/invitation-sent` (Pending chip), `/recipient` entry looping to /success. *(Stage 3)*
- **FLOW-11** — self-branch 2FA: `/verify` 6-cell OTP gated by `?2fa=1`, → /success. *(Stage 2)*

## Out of scope (all stages)
Dashboard/connections-list surface; real OAuth/email; recursive double-invite (recipient delegating again); persistence. `/ds-preview` stays as-is.
