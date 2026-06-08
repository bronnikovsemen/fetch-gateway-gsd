# V2 Stage 3 — Delegate Branch Summary (FLOW-10)

Final stage of the v2 connection flow. Built the three delegate-branch routes that
complete the "Someone on my team manages it" path off `/connect-method`, plus the
recipient landing that loops back into the shared self tail to `/success`.

**Branch:** `new-design-system` · **Commit:** `ff5f4c0` (`feat(v2-stage3)`)

## Routes added (all `src/**` only)

| Route | Figma | Purpose |
|-------|-------|---------|
| `src/app/invite/page.tsx` | 2070:123 | Admin drafts the invite (3 controlled DS Inputs) → `/invitation-sent` |
| `src/app/invitation-sent/page.tsx` | 2070:146 (+ Pending chip from 2047) | Confirmation + `Pending` Chip; Done/Resend/Open-as-teammate |
| `src/app/recipient/page.tsx` | 2070:162 | Teammate read-only ask → `/connecting?...&2fa=1` (reuses self tail) |

## Pattern conformance

- Each route: `'use client'`; inner `*Content` owns `useSearchParams`, wrapped by
  default-export `Page` in `<Suspense fallback={null}>` — mirrors `/connect-method`
  and `/verify` verbatim.
- Slug resolved against `providers` catalog; invalid/missing → `router.replace('/select-provider')`.
- Only the trusted catalog `name` is interpolated into JSX — raw `?provider=` query
  text is never rendered.
- All centered, `FlowLayout` card, `<FetchLogo size={64} />` header.

## Per-route detail

**A. `/invite`** — `FlowLayout maxWidth={440} px={4} py={4}`, `Stack spacing={2}`.
h5 "Ask a teammate to connect {Provider}" + body2 secure-link subtitle. Three DS
`Input`s each with own `useState('')`: Work email (`type="email"`), Name (optional),
Note (optional). DS `Button` primary `sx={{ width: '100%' }}` "Send invite" →
`/invitation-sent?provider={slug}` (always enabled, demo). DS `Link` (md) "Back" →
`/connect-method?provider={slug}`.

**B. `/invitation-sent`** — `maxWidth={400}`, centered. `FetchLogo`, navy
`CheckCircleRounded` (`sx={{ color: 'secondary.main', fontSize: 56 }}`), h5
"Invitation sent", DS `Chip severity="warning" label="Pending"`, body2 confirmation.
DS `Button` primary full-width "Done" → `/`. Two stacked DS `Link`s, both real
navigations: "Resend invite" → `/invite?provider={slug}`, "Open the invite as the
teammate (demo)" → `/recipient?provider={slug}` (makes the recipient path
click-reachable).

**C. `/recipient`** — `maxWidth={400}`, centered. h5 "Plantegrity asked you to
connect {Provider}", body2 read-only context ("Acme Inc. invited you…"). DS `Button`
primary full-width "Get Started" → `/connecting?provider={slug}&2fa=1`. `Typography
variant="caption"` "Continues through the same Permissions → sign-in → Success steps."
(Optional "Why am I seeing this?" link skipped per Figma, which uses this caption.)

## Deviations from plan

None — built exactly as specified. (DS-component imports use the named exports
`Input`, `Link`, `Chip` and the default exports `Button`, `FlowLayout`, `FetchLogo`,
matching each component's actual export shape.)

## Acceptance gates — all PASS

| Gate | Result |
|------|--------|
| `npx tsc --noEmit` | 0 errors |
| `npm run lint` | ✔ No ESLint warnings or errors |
| `npm run lint:tokens` | PASS — no off-token hex or raw px |
| `npm run build` | ✓ Compiled; `/invite`, `/invitation-sent`, `/recipient` all in route list |
| deps unchanged | `git diff --quiet package.json` → deps-unchanged |

### Runtime smoke (throwaway port 3399, `next start`)

- `/invite?provider=gusto` → **200**
- `/invitation-sent?provider=gusto` → **200**
- `/recipient?provider=gusto` → **200**
- Guard: `/invite`, `/invitation-sent`, `/recipient` with no provider → 200 (client-side `replace` to `/select-provider`).

Page-chunk grep evidence (client-rendered under Suspense — chunk-JS is accepted
evidence, same as Stages 1–2):
- `/invite` chunk: "Ask a teammate to connect", "Send invite", "Work email"
- `/invitation-sent` chunk: "Invitation sent", `severity`, "Pending", "Open the invite as the teammate (demo)", "Resend invite"
- `/recipient` chunk: "Plantegrity asked you to connect", "Get Started", `/connecting`, `2fa=1`

## Files NOT modified (per scope)

`/connect-method`, `/connecting`, `/verify`, `/success`, `/select-provider`,
`/welcome`, `/permissions`, `/ds-preview`, and all DS components — untouched.
No docs (STATE/ROADMAP/REQUIREMENTS/PROJECT/.planning) committed; orchestrator owns those.
This summary left unstaged.
