# VeriCase-Demo Collaboration Memory

Durable collaboration guidance for assistant work in this repository. Loaded at
the start of every session and kept in sync with `AGENTS.md`.

## Project

- **Repo:** VeriCase-Demo
- **Product:** Demonstration and prototyping workspace for citizenship verification case features.
- **Audience:** Development team, MetaPhase stakeholders, and pilot collaborators.
- **Core promise:** Iteratively validate features, UI patterns, and workflows for eventual integration into production VeriCase.

## Standing Preferences

- Never include AI attribution anywhere in commits, PRs, code comments, or release notes.
- Never merge branches locally or through automation; all branch integration must
  happen through a reviewed GitHub pull request.
- Use `dev` as the default integration branch and create feature branches from `dev`.
- Keep branch names short, descriptive, and professional.
- Use "MetaPhase" in user-facing copy.
- Treat creative work as options-first before editing files.
- Keep this file and `AGENTS.md` synchronized when standing guidance changes.

## Product Invariants

- Officers make final determinations.
- AI is advisory and evidence-bound.
- Audit events are append-only.
- PII is minimized and masked by default.
- Agency tenancy is enforced at the database layer.
- Accessibility and Section 508 are release gates.
- No federal seals or implied government endorsement.

## Release Gates

Every pull request must pass typecheck, lint, unit tests, accessibility checks,
production build, schema/policy contract tests, and relevant security scans.
