<!-- GSD:project-start source:PROJECT.md -->
## Project

**Fetch Gateway (MUI Rebuild)**

Fetch Gateway is an OAuth onboarding microsite for HR/payroll admins. They land on it via a link from Plantegrity, see what data Fetch will read from their payroll provider, pick the provider, and confirm — all without typing credentials into Fetch. This repo is a fresh rebuild of an older Tailwind/shadcn prototype on **MUI (Material UI)** with Next.js 15 App Router.

**Core Value:** A polished, on-brand five-step demo flow that takes the user from splash → success without any real OAuth, real API calls, or credential entry into Fetch. The flow must look production-quality at a 1440px desktop target.

### Constraints

- **Tech stack**: Next.js 15 App Router + TypeScript (`src/` directory), MUI as the only UI library, Emotion as the styling engine, `@mui/icons-material` as the only icon library — locked by spec.
- **Styling**: MUI components for all layout (`Box`, `Stack`, `Typography`, `Button`, `Card`, `Paper`, `Select`, `MenuItem`); `sx` prop for one-offs. No raw HTML layout, no Tailwind, no shadcn.
- **TypeScript**: No `any` — strict typing throughout.
- **Hygiene**: No `console.log` committed.
- **Viewport**: Desktop 1440px target — no responsive breakpoints required.
- **Port**: Dev server must run on 3001 (configured in `package.json`).
- **Logo**: Fetch logo must be `<img>` or inline SVG — not an `@mui/icons-material` substitute.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
