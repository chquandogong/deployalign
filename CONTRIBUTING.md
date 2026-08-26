# Contributing to DeployAlign

Thanks for helping make DeployAlign a genuinely useful tool. This page covers the
mechanics; the product direction and open decisions live in
[`docs/00-overview/ROADMAP.md`](docs/00-overview/ROADMAP.md).

## Prerequisites

- Node.js 24 (see [`.nvmrc`](.nvmrc); anything ≥ 22.13 works because pnpm 11 needs `node:sqlite`).
- pnpm 11 through Corepack — `corepack enable` reads the exact version from `package.json#packageManager`.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev            # Vite on :5173, Express API on :8080
```

## Quality gates

Every pull request must pass the same four commands CI runs:

```bash
pnpm typecheck      # tsc -b (app + server project references)
pnpm lint           # oxlint
pnpm test           # vitest — domain, Gemini-validation, and API contract suites
pnpm build          # production bundle
```

Add or update tests with behaviour changes:

- `src/domain/compiler.test.ts` — canonical fixture compiler contract (grounding, gate, patch, rebuild).
- `src/domain/general/general.test.ts` — general path: extraction, typing, detectors, fixture reproduction, clean and unsupported corpora.
- `src/lib/exportMarkdown.test.ts` — Markdown export.
- `server/gemini.test.ts` — model configuration and the pure payload validator.
- `server/app.test.ts` — HTTP contract (bounds, tokens, rate limit, startup guards, custom mode).

When a detector misfires on real phrasing, add the sentence to a corpus in `general.test.ts` first, then fix the lexicon or rule.

## Ground rules

- **Synthetic data only in the repository.** The public prototype compiles the disclosed fixture and nothing else; custom mode is a local flag. Do not add real customer, site, or personal text anywhere in the repository, tests, screenshots, or videos — write synthetic corpora for tests.
- **Deterministic rules own the gate.** Gemini may propose quote-grounded candidates and a rationale; it must never decide the gate, the patch, or the targets.
- **No secrets in git.** Keys, tokens, project identifiers, and account details belong in the runtime environment or Secret Manager. `.gitignore` already excludes `.env*` except the example file.
- **Say what is evidenced.** Follow the verb discipline in [`docs/appendix/CONVENTIONS.md`](docs/appendix/CONVENTIONS.md) (implemented / verified / configured / deployed) when you touch documentation.

## Commits and pull requests

- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat(server): …`, `fix(ui): …`, `docs: …`, `ci: …`, `test: …`.
- Keep pull requests focused. Explain the *why* in the description and list how you verified the change.
- Record product or architecture decisions in [`docs/02-decisions/DECISION_LOG.md`](docs/02-decisions/DECISION_LOG.md) with context, options, and residual risk.
- User-facing behaviour changes also get a line in [`CHANGELOG.md`](CHANGELOG.md).

## Documentation languages

`README.md` (English) is the source of truth. `README.ko.md` and `README.zh.md` are full
translations — when you change one, change all three or open an issue tagged `i18n` so
the drift is visible.
