# Fetch Gateway — Project Spec (MUI Rebuild)

## What this is

Fetch Gateway is an OAuth onboarding flow — a microsite that HR users (payroll admins) land on when they receive a link from Plantegrity asking them to connect their payroll provider (Gusto, ADP, Paycom, Rippling). The flow takes the user from a welcome screen through permissions disclosure, provider selection, a simulated OAuth handoff, and lands on a success screen branded as PlanTegrity Admin.

**Product wedge:** The user never types credentials into Fetch. They see what Fetch will access, pick their provider, get "redirected" to the provider's hosted sign-in (simulated), authorize access, and land on a success screen. No real OAuth, no real API calls — all flows are mocked.

This repo is a **fresh rebuild on MUI**. The older prototype exists at `~/Documents/ai-ui-lab/Fetch Gateway/` (Tailwind + shadcn) — used as a visual and behavioural reference only. We do NOT modify it. We recreate from scratch here.

## Stack

- **Next.js 15** App Router, TypeScript, `src/` directory
- **MUI (Material UI)** — the only UI library. No Tailwind. No shadcn. No other CSS frameworks.
- **MUI icons** via `@mui/icons-material`. No lucide, no other icon libraries.
- **Inter font** loaded via `next/font/google` as `--font-inter` CSS variable, applied to body.
- **Emotion** as the styling engine (already a peer dependency of MUI).
- **AppRouterCacheProvider** from `@mui/material-nextjs/v15-appRouter` to make MUI work correctly with App Router SSR.
- Dev server runs on **port 3001**.

## Design tokens

- **Primary:** `#2463EC` (Fetch blue — buttons, links, icons)
- **Background page:** `#EBF5FF` (light blue-tinted — all Fetch-branded screens)
- **Panel background:** `#FFFFFF`
- **Text primary:** `#101827`
- **Text muted:** `#6B7280`
- **Borders:** `#E5E7EB`
- **Success:** `#10B981`
- **Warning:** `#F59E0B`
- **Danger:** `#EF4444`

## Styling rules

- Use MUI components for everything: `<Box>`, `<Stack>`, `<Typography>`, `<Button>`, `<Card>`, `<Paper>`, `<Select>`, `<MenuItem>`, etc.
- Use the `sx` prop for one-off styles.
- No raw HTML for layout.
- Use theme tokens where possible; hardcode only brand-specific values (Gusto coral, PlanTegrity gradient).
- No `any` in TypeScript.

## File structure

```
src/
├── app/
│   ├── layout.tsx                    ← root layout, ThemeProvider, AppRouterCacheProvider
│   ├── page.tsx                      ← Splash (auto-redirects to /welcome after 2.5s)
│   ├── welcome/page.tsx
│   ├── permissions/page.tsx
│   ├── select-provider/page.tsx
│   ├── connecting/page.tsx           ← dynamic, reads ?provider=
│   ├── provider-sign-in/page.tsx     ← dynamic, reads ?provider=
│   ├── provider-authorize/page.tsx   ← dynamic, reads ?provider=
│   └── dashboard/page.tsx
├── components/
│   ├── FlowLayout.tsx                ← centered layout for Fetch-branded screens
│   ├── FetchLogo.tsx                 ← SVG/PNG logo
│   ├── PermissionItem.tsx            ← single permission row (icon + label + description)
│   └── ProviderMockFrame.tsx         ← shared Gusto-branded mock frame (sign-in + authorize)
├── lib/
│   └── providers.ts                  ← provider catalog (slug, name, brand color)
└── theme/
    └── theme.ts                      ← MUI createTheme
```

## Routes — what's in the product

### `/` — Splash
Auto-redirects to `/welcome` after 2500ms. Shows Fetch logo centered on `#EBF5FF` background with tagline "Retirement runs on Fetch". Logo scales in over 500ms, then breathes (2s cycle) until redirect.

### `/welcome` — Welcome
Centered white Panel (max-width 440px, padding 48px) on `#EBF5FF` background.
- Fetch logo (100px) at top
- Heading: "Connect your payroll provider"
- Body: "Plantegrity has requested a secure read-only connection to your payroll data for plan validation and reconciliation. No data will be modified."
- Primary button "Get Started" → `/permissions`

### `/permissions` — Permissions
Centered white Panel (max-width 768px, padding 48px vertical 36px) on `#EBF5FF` background.
- Fetch logo (100px) at top
- Heading: "To connect your payroll, Fetch will need access to:"
- 2-column grid of 6 permission items (3 per column):
  - Left: Organization / Team / Employment
  - Right: Payroll / Pay Statement / SSN
- Each permission item: blue checkmark icon + bold label + muted description text
- Two buttons side by side: "Back" (outlined/secondary) → `/welcome` | "Continue" (primary) → `/select-provider`

**Permission items data:**
| Label | Description |
|-------|-------------|
| Organization | Business profile, contact details, and banking information |
| Team | Roster of people and reporting structure |
| Employment | Employment status, contact details, role, and compensation |
| Payroll | Payments made to employees and contractors |
| Pay Statement | Itemized pay statements per employee |
| SSN | Social Security Numbers for tax reporting |

### `/select-provider` — Select Provider
Centered white Panel (max-width 498px) on `#EBF5FF` background.
- Fetch logo (100px) at top
- Heading: "Select your payroll provider"
- Body: "Select the payroll system you want to connect"
- MUI Select dropdown labeled "Select Payroll Provider", placeholder "Payroll Provider"
- Two buttons: "Back" (outlined, fixed ~100px width) → `/permissions` | "Connect" (primary, flex-1, disabled until provider selected)
- On "Connect" click: show loading state in button (~1.2s spinner + "Connecting…"), then navigate to `/connecting?provider={slug}`

**Provider catalog (`src/lib/providers.ts`):**
| slug | name | brandColor |
|------|------|------------|
| gusto | Gusto | #F45D48 |
| adp | ADP | #D90429 |
| paycom | Paycom | #003DA5 |
| rippling | Rippling | #F5A623 |

### `/connecting` — Connecting bridge
Reads `?provider=` from query params. If missing or invalid → redirect to `/select-provider`.
- Centered white Panel on `#EBF5FF` background
- Fetch logo (100px)
- Heading: "Establishing connection…"
- MUI CircularProgress spinner
- Body: "Connecting to {providerName}. You'll be redirected to sign in."
- Auto-advances to `/provider-sign-in?provider={slug}` after ~2500ms

### `/provider-sign-in` — Provider Sign-in (Gusto-styled mock)
Reads `?provider=` — today only Gusto is fully styled; others fall back to generic.

**Full-screen two-column layout (NOT Fetch-branded):**
- Left half: illustration (decorative SVG/image, can use a placeholder Box with light bg)
- Right half: white card with Gusto branding

**Gusto card content:**
- "gusto" wordmark in Gusto coral `#F45D48`, bold, large
- Heading: "Good afternoon 👋"
- Email field (label "Email", link "Forgot email?" top-right)
- Password field (label "Password", link "Forgot password?" top-right, show/hide toggle)
- Primary teal button "Continue" (`#2D9C82`) → `/provider-authorize?provider={slug}`
- Divider "or"
- Google sign-in button (outlined, Google logo + "Sign in with Google")
- "More sign in options ▾" link
- Footer links: "Get started" · "Help center"
- Page footer: "Gusto © 2026 · Help Center · Terms · Privacy · Privacy Choices"

### `/provider-authorize` — Provider OAuth Consent (Gusto-styled mock)
Same two-column layout as sign-in. Same illustration left half.

**Gusto consent card:**
- "gusto" wordmark in `#F45D48`
- Heading: "Authorize Plantegrity to connect to your account?"
- Body: "Authorizing **Plantegrity** to connect to your Gusto account will allow **Plantegrity** to view and access your company's account information."
- Primary teal button "Authorize" → `/dashboard`
- Red text link "Deny" → `/select-provider`

### `/dashboard` — Connection Success (PlanTegrity Admin branded)
**Full-screen two-column layout (NOT Fetch-branded):**

**Left half — PlanTegrity Admin dark panel:**
- Background: `linear-gradient(154deg, #00082D 0%, #002151 34%, #449AE0 86%)`
- Top: Shield icon (100px, white) + "PlanTegrity Admin" bold title + "Financial Accuracy Secured" muted subtitle
- Center: 3 feature rows with icons + title + body:
  1. ClipboardCheck icon — "Automated Eligibility Checks" / "AI-powered validation keeps you in compliance"
  2. ArrowLeftRight icon — "Multi-File Matching in Seconds" / "Trust, payroll, census, W-2 files auto-compared"
  3. Upload icon — "Secure Submissions" / "End-to-end audit trail with export-ready logs"
- Bottom: "PlanTegrity Admin ® All rights reserved 2025" small muted text

**Right half — white confirmation panel:**
- Centered card with shadow
- Link2 icon (96px, `#5E8C56` green)
- Heading: "Your payroll system has been successfully connected"
- Body: "Plantegrity is now securely syncing your organization's data. This process may take a few minutes."
- Outlined button "Go to Plantegrity" → `/` (or external link in production)

## FlowLayout component

All Fetch-branded screens (welcome, permissions, select-provider, connecting) share a layout:
- Full-screen `min-height: 100vh`, background `#EBF5FF`
- Centers content vertically and horizontally
- White Paper/Card with `borderRadius: 12px`, `boxShadow: 0 2px 8px rgba(0,0,0,0.08)`

## Implementation order

1. **Setup** — port 3001 in `package.json`, ThemeProvider + AppRouterCacheProvider + CssBaseline in `layout.tsx`, Inter font, route stubs for all 8 routes.
2. **FlowLayout + FetchLogo** — shared layout component, logo asset.
3. **Splash** (`/`) — auto-redirect with animation.
4. **Welcome** (`/welcome`) — static screen.
5. **Permissions** (`/permissions`) — PermissionItem component, 2-column grid.
6. **Select Provider** (`/select-provider`) — MUI Select, provider catalog, loading state.
7. **Connecting** (`/connecting`) — spinner, auto-advance.
8. **Provider Sign-in + Authorize** (`/provider-sign-in`, `/provider-authorize`) — ProviderMockFrame, Gusto styling.
9. **Dashboard** (`/dashboard`) — split layout, PlanTegrity panel.

## What NOT to do

- Don't install Tailwind, shadcn, lucide-react, or class-variance-authority.
- Don't use `@mui/icons-material` for the Fetch logo — use an `<img>` or inline SVG.
- Don't skip `AppRouterCacheProvider` — MUI flickers on SSR without it.
- Don't hardcode provider names outside `src/lib/providers.ts`.
- Don't add real OAuth, real API calls, or localStorage.
- Don't make mobile-responsive — desktop only (1440px target).

## Conventions

- One component per file, named export preferred.
- No `any` in TypeScript.
- No `console.log` committed.
- All navigation mocked — no dead buttons.
