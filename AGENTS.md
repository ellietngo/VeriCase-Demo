# Agent Working Memory

Persistent repo-level guidance for AI coding agents working on VeriCase-Demo.
Read this before starting work; update it whenever the user gives new standing
guidance.

## Reading Order

Before making changes, read the files that exist in the current branch in this
order:

1. `README.md` — project overview, branch status, and current scope.
2. This file (`AGENTS.md`) and `CLAUDE.md` — collaboration rules.
3. `CONTRIBUTING.md` — contribution and review expectations.
4. `SECURITY.md` — baseline security rules.
5. `docs/BRANCHING_STRATEGY.md` — branch flow and protection rules.

When the implementation scaffold lands, also read any committed roadmap,
architecture, data model, prompting, control mapping, and security audit docs
before changing related areas. Do not block on planned docs that are not present
in the branch you are working from.

## Repository Map

Current governance baseline:

- `.github/` — workflow, Dependabot, CODEOWNERS, pull request, and issue templates.
- `docs/BRANCHING_STRATEGY.md` — branch flow and protection rules.
- `AGENTS.md` and `CLAUDE.md` — durable agent and collaboration guidance.
- `CONTRIBUTING.md`, `SECURITY.md`, and `CODE_OF_CONDUCT.md` — contribution, security, and conduct expectations.

Planned implementation scaffold:

- `src/` — React + Vite + TypeScript app.
- `supabase/` — migrations, RLS policies, and Edge Function placeholders.
- `tests/` — Vitest, policy contract tests, and Playwright accessibility/E2E tests.
- `docs/` — architecture, data model, prompting, control mapping, operations, release readiness, and pilot evidence.

## Product Invariants (do-not-regress)

- Human officers own final citizenship verification determinations.
- AI output is advisory only; it may summarize, flag discrepancies, and draft rationale, but it must not make final eligibility or citizenship decisions.
- Every case action, source check, AI run, evidence change, assignment, and determination must write an audit event.
- Prompt outputs must cite evidence IDs or source-check IDs used to support each finding.
- PII must be minimized, masked by default in exports/logs, and never written to client-visible diagnostics.
- Agency tenancy and role-based access must be enforced in database policies, not only in the UI.
- No federal seals or implied DHS, CBP, USCIS, or U.S. government endorsement in UI chrome.
- WCAG 2.1 AA and Section 508 compliance are release gates.

## User Preferences

- Commits and PRs are authored by humans only. No `Co-Authored-By: Claude`, no "Generated with Claude Code", no AI model names in commit messages, PR titles/bodies, or code comments.
- No `codex` or `claude` in branch names unless explicitly requested.
- Branch names should be short, descriptive, and professional.
- Refer to the company as **"MetaPhase"** in user-facing copy. Use the full legal name only in license/legal files.
- Never remove entries from `.gitignore` without explicit user permission.
- Creative or subjective work is options-first: present 3-4 meaningfully different options before editing files.

## Tech Stack

The planned implementation scaffold is expected to use:

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Supabase PostgreSQL + Auth + Storage + Row Level Security
- Supabase Edge Functions
- `lucide-react` icons
- Vitest + React Testing Library
- Playwright + axe-core for accessibility and E2E
- Netlify static hosting
- npm with `package-lock.json` as the single lockfile

## Data & Environment Safety

- Never drop or reset the remote Supabase database.
- Use targeted migrations and dated migration files.
- Never commit real `.env` files; only `.env.example`.
- Service role keys and AI provider secrets must never be exposed through `VITE_` client env vars.
- New tables must enable RLS in the same migration that creates them.
- Storage buckets must have explicit policies.
- Case exports must default to masked PII unless explicitly authorized.

## AI Prompting Rules

When AI prompt infrastructure exists:

- Store reusable prompts as Markdown under `src/lib/ai/prompts/` or document them in committed prompting docs.
- Prompt outputs must be schema-validated before display or persistence.
- Record prompt version, model/config, input evidence IDs, output hash, and user/action context in `audit_events`.
- Do not send unnecessary PII to AI services.
- Do not ask AI to decide citizenship status.
- AI may assist with:
  - evidence summarization
  - discrepancy detection
  - identifier normalization
  - source-check explanation
  - draft officer rationale
- AI may not:
  - issue final determinations
  - override source systems
  - invent missing facts
  - produce unsupported confidence scores

## Branch Protection

- Never commit directly to `dev` or `main`.
- Never merge branches locally or through automation. All branch integration must
  happen through a reviewed GitHub pull request.
- Feature branches are created from `dev`.
- `dev` is the default branch and integration branch.
- `main` is the production branch.
- PRs require at least one human reviewer.
- No force pushes or branch deletions on `dev` or `main`.

## PR Review Workflow

When asked to review PR comments:

1. Fetch PR comments and review threads.
2. Identify unreplied comments from humans and bots.
3. Triage P0 -> P2.
4. Fix every actionable issue in code, migrations, docs, or tests.
5. Reply inline when possible.
6. Commit, push, and verify applicable checks.
7. Never leave unreplied review comments on a PR marked ready.

## Release Gates

For implementation PRs after the app scaffold introduces `package.json`, every
PR must pass the relevant available checks, expected to include:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run test:a11y`
- `npm run build`
- production dependency audit
- schema/policy contract tests
- tenant isolation tests
- prompt schema/guardrail tests for AI-related changes

CI should also run:

- secret scanning
- dependency vulnerability scanning
- SBOM generation
- CodeQL or equivalent static analysis
- accessibility smoke tests
- Playwright E2E smoke tests

## Maintenance Rule

When the user gives process feedback, update this file and `CLAUDE.md` together so
future sessions pick up the guidance. Never let these two files drift.
