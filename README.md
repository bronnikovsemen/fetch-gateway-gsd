# Fetch Gateway — demo prototype

UX prototype of the Fetch Gateway embedded connect flow, built for client demos. Fetch is middleware between payroll providers (e.g. Gusto) and record keepers (e.g. Principal, Fidelity), plus SFTP.

**Design source of truth:** Figma file `pZYTXYGKR5lJAcaE0SnzLV` ("Fetch Design System"), section "Connection flows" `477:453`. Always read the live nodes — the file is edited continuously.

## Run

```bash
npm install
npm run build && npm run start   # production, http://localhost:3001 — use this for demos
npm run dev                      # dev mode, same port (can be flaky; prefer prod for demos)
```

## Demo flows (from the launcher at `/`)

1. **Sign up → join an existing organization**
2. **Sign up → create a new organization**
3. **Connection flow** — connect a payroll system. Three connection types, each with its own credential path:
   - **Gusto** (redirect): mock Gusto OAuth at `/gusto-login`
   - **Principal** (credentials): credential card → SMS 2FA → success
   - **SFTP**: host + username + password → success
   - Either path can be delegated to a teammate (`/invite` → `/recipient`), routed by the same auth method.

All flows are mocked — no real OAuth, API calls, or credential storage. Desktop 1440px target, no responsive breakpoints.

## Stack & rules

Next.js 15 App Router, TypeScript (strict, no `any`), MUI v9 + Emotion only. All colors/spacing through `src/theme/theme.ts` tokens — enforced by `npm run lint:tokens` (the bespoke Gusto mock at `src/app/gusto-login` is the documented hex exception). See CLAUDE.md for the component-to-Figma mapping.
