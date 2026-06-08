# v2 Stage 1 — Select-Provider-first rewire + /connect-method (FLOW-09)

**Branch:** `new-design-system` (worktree isolation off, worked directly)
**Status:** Complete. All acceptance gates green.

## One-liner
Inserted the `/connect-method` decision screen between `/select-provider` and the
two connection branches, and rewired `/select-provider` to route into it with a
"Continue" CTA.

## Changes (2 atomic commits, src/** only)

| Commit | Scope | What |
|---|---|---|
| `d02ecdd` | `feat(v2-stage1)` | NEW `src/app/connect-method/page.tsx` (FLOW-09, Figma 2068:155) |
| `8d0b333` | `refactor(v2-stage1)` | Rewire `src/app/select-provider/page.tsx` target + CTA |

### 1a. `src/app/select-provider/page.tsx`
- Submit nav `/connecting?provider=` → **`/connect-method?provider=`**.
- Primary button label "Get Started" → **"Continue"** (in-flight text "Continue…").
  Resolves the legacy WR-01 copy defect.
- Stale in-file comment updated to reference `/connect-method`.
- No other visual change. Tonal MUI `Select` retained (legitimate raw-MUI
  exception — no DS Select exists). Back button, loading-submit, cleanup ref
  all unchanged.

### 1b. NEW `src/app/connect-method/page.tsx` ('use client')
- `<Suspense fallback={null}>` + `useSearchParams` reading `?provider=`,
  guard pattern copied verbatim from `/connecting`: slug validated against
  `providers` catalog; invalid/missing → `router.replace('/select-provider')`.
  Only the trusted catalog `name` is interpolated into JSX — raw query text never is.
- Assembled from DS components only: `FlowLayout` (maxWidth 440, `px={4} py={4}`,
  `Stack spacing={2}`), `FetchLogo size={64}`, centered `h5` + `body2` header,
  two full-width `OptionRow`s.
- OptionRow copy verbatim from Figma (typographic U+2019 apostrophes):
  1. "I’ll connect it now" / "I have access to {Provider}" → `/connecting?provider={slug}` (self)
  2. "Someone on my team manages it" / "We’ll send them a secure link to connect" → `/invite?provider={slug}` (delegate)

## Acceptance gates

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run lint` | clean (no ESLint warnings or errors) |
| `npm run lint:tokens` | PASS — no off-token hex or raw px |
| `npm run build` | compiles; `/connect-method` in route list (2.98 kB / 150 kB First Load) |
| deps-unchanged | `package.json`/lockfile untouched |

### Runtime smoke (prod server, throwaway port 3096)
- `GET /connect-method?provider=gusto` → **HTTP 200**
- `GET /connect-method` (no provider) → **HTTP 200** (then client-side
  `router.replace('/select-provider')`)
- `/select-provider` SSR HTML confirmed to contain the new `>Continue<` label.

**Note on grep-based content assertions:** `/connect-method` (like the existing
`/connecting` it mirrors) renders its body entirely client-side under
`Suspense fallback={null}`, so the title/OptionRow text is NOT present in the
raw SSR HTML — it hydrates on the client. Verified the baseline `/connecting`
exhibits identical SSR behavior, confirming this is the established pattern and
not a regression. A DOM-level content assertion would require a headless
browser (Playwright/Puppeteer), which is out of scope under the no-new-deps
constraint. The route is statically prerendered, type-checked, and a verbatim
structural copy of the proven `/connecting` guard.

## Known stubs / intentional dead links
- The delegate `OptionRow` targets **`/invite`**, built in **Stage 3**. Until
  then that destination 404s — an intentional forward navigation in
  branch-at-a-time delivery, flagged in V2-FIGMA-SPEC §"Stage-1 note", not a
  dead button.

## Out of scope (untouched, as required)
- No changes to `/connecting`, `/welcome`, `/permissions`, `/ds-preview`,
  `/success`, or any DS component.
- No other v2 routes created (`/verify`, `/invite`, `/invitation-sent`,
  `/recipient` belong to later stages).
- No docs staged (`STATE.md`, `ROADMAP.md`, `REQUIREMENTS.md`, `.planning/**`
  left for the orchestrator). This summary is left unstaged.
