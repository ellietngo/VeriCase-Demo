# VeriCase-Demo

VeriCase-Demo is a demonstration and prototyping repository for citizenship verification case workbench functionality. This repository serves as a testing ground for features, UI patterns, and workflow designs before integration into the production VeriCase system.

## Current Status

| Area | Status |
| --- | --- |
| Default branch | `dev` |
| Production branch | `main` |
| Protected branches | `main`, `dev` |
| Pull request policy | Required for protected branches |
| Required reviews | 1 approving review |
| Conversation resolution | Required |
| Force pushes | Disabled on protected branches |
| Branch deletions | Disabled on protected branches |

## What VeriCase-Demo Is

- A protected prototyping workspace for citizenship verification case features.
- A testing surface for evidence, identifiers, source checks, and case workflow patterns.
- An iterative development environment for UI, API, and audit model exploration.
- A MetaPhase foundation for feature validation and pilot readiness assessment.

## What VeriCase-Demo Is Not

- It is not a replacement for the production VeriCase system.
- It does not make final citizenship decisions.
- It does not imply endorsement by DHS, CBP, USCIS, or the U.S. government.
- It is not production software until feature validation and integration readiness gates are complete.

## Repository Operating Model

VeriCase-Demo uses a protected integration model:

- `dev` is the default branch and integration branch.
- `main` is reserved for validated feature state.
- Feature branches are created from `dev`.
- Branches are never merged locally or through automation.
- All integration happens through reviewed GitHub pull requests.
- `main` and `dev` reject force pushes and branch deletion.
- Follow-on branches should keep changes focused and scoped to one feature or concern.

See [docs/BRANCHING_STRATEGY.md](docs/BRANCHING_STRATEGY.md) for the full branch policy.

## Governance Files

| File | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Persistent working rules for AI coding agents. |
| [CLAUDE.md](CLAUDE.md) | Durable collaboration memory kept in sync with `AGENTS.md`. |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution, verification, accessibility, and security expectations. |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Contributor conduct standards. |
| [SECURITY.md](SECURITY.md) | Baseline security guidance and supported branches. |
| [docs/BRANCHING_STRATEGY.md](docs/BRANCHING_STRATEGY.md) | Branch flow, protection rules, and release path. |

## Planned Technical Direction

The implementation scaffold is expected to use:

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Supabase PostgreSQL, Auth, Storage, and Row Level Security
- Supabase Edge Functions
- `lucide-react` icons
- Vitest and React Testing Library
- Playwright and axe-core for accessibility and E2E checks
- Netlify static hosting

Planned scaffold areas for follow-on branches:

- `src/` for the React application.
- `supabase/` for migrations, RLS policies, and Edge Function placeholders.
- `tests/` for unit, policy-contract, accessibility, and E2E tests.
- `docs/` for architecture, data model, prompting, assurance, controls, operations, and pilot readiness.

## Product Guardrails

- Human officers own final citizenship verification determinations.
- AI output is advisory only and must remain evidence-bound.
- Every meaningful case action should produce an audit event.
- PII should be minimized, masked by default, and kept out of client-visible diagnostics.
- Agency tenancy and role-based access must be enforced at the database layer.
- Accessibility and Section 508 readiness are release gates.
- UI and copy must not imply government endorsement.

## Local Development

Application code is not part of the current governance baseline. After the app
scaffold lands, expected setup will be:

```bash
npm install
npm run dev
```

Expected implementation verification gates:

```bash
npm run typecheck
npm run lint
npm run test:run
npm run test:a11y
npm run build
npm run test:audit
```

## Pull Request Readiness

Before opening implementation PRs:

- Branch from `dev`.
- Keep changes scoped to one feature, fix, or milestone.
- Update `AGENTS.md` and `CLAUDE.md` together when standing guidance changes.
- Update docs when workflow, data model, security, or prompting assumptions change.
- Do not include AI attribution in commits, PR text, code comments, or release notes.
