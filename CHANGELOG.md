# Changelog

All notable changes to DeployAlign are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow SemVer.

## [0.2.0] — 2026-08-26

The first post-submission cycle. Theme: make the prototype honest about *where* a
result came from, keep it runnable against a current Gemini model, and give the
repository the scaffolding (CI, tests, docs in three languages) it needs to keep
improving.

### Added

- **Execution-origin labelling.** Every `CompileResult` now carries
  `executionOrigin: 'server' | 'browser'`. The UI shows an `API` / `IN-BROWSER` chip
  next to the provider badge, and the compile/approve notices, receipts panel and
  footer say which one produced the result. A browser-side fallback can no longer be
  mistaken for a server run (risk R-05, open since 0.1.0).
- **API contract tests** (`server/app.test.ts`, 13 cases): health fields, fixture
  bounds, malformed JSON, provenance-token tamper paths, the review round trip,
  the per-client rate limit, and the production startup guard.
- **Gemini validator tests** (`server/gemini.test.ts`, 11 cases). The exact-quote,
  allowed-type, confidence, coverage and rationale rules are now a pure function,
  `validateGeminiPayload`, with direct coverage.
- `createApp()` factory in `server/app.ts` with injectable secret, mode, dist dir,
  live-model flag and logger; `server/index.ts` is a thin entrypoint.
- `/api/health` reports `version` and the configured `model`.
- `GEMINI_THINKING_LEVEL` (`low` | `medium` | `high`) for Gemini 3 models.
- GitHub Actions CI: Node 24 + pnpm via Corepack, typecheck → lint → test → build,
  plus a container-image build. Actions are pinned by commit SHA.
- `CONTRIBUTING.md`, `SECURITY.md` (private vulnerability reporting enabled),
  `.nvmrc`, `docs/00-overview/ROADMAP.md`.
- README in **English, Korean and Chinese** (`README.md`, `README.ko.md`,
  `README.zh.md`) rewritten around what the tool does and how to run it.
- Demo-video v2 script, narration-first build pipeline and YouTube metadata
  (`docs/submission/DEMO_SCRIPT.md`, `docs/submission/YOUTUBE_METADATA.md`).

### Changed

- **Default extraction model is `gemini-3.7-flash`** (generally available since
  2026-08-13). Gemini 3 models are called with `thinkingLevel: LOW`; Gemini 2.5
  models keep `thinkingBudget: 0`. `GEMINI_MODEL` still pins any model.
  Background: Vertex AI release notes list 2026-10-16 as the retirement date for
  Gemini 2.5 Flash, and Gemini 3.x Flash models are served from the `global`
  Vertex location only (already the code default).
- `package.json`: version `0.2.0`, `engines.node >= 22.13` (pnpm 11 needs
  `node:sqlite`), license and repository metadata.
- Structured logs during tests are silenced through the new `logger` option.

### Not changed — read before you rely on it

- The public Cloud Run revision (`deployalign-00004-wgb`) still runs the 0.1.0
  build with `gemini-2.5-flash`. Redeploying is a human-gated action and was not
  performed in this cycle.
- `.env.example` still pins `GEMINI_MODEL=gemini-2.5-flash`. Delete or update that
  line when you copy it, or the new default will not apply.
- A live `gemini-3.7-flash` call was **not** verified in this cycle (no model
  credentials in the build environment). The configuration is covered by unit tests
  only; the first deploy with the new default must confirm a live receipt.

### Verification

`pnpm typecheck`, `pnpm lint`, `pnpm test` (38 tests across 3 files) and
`pnpm build` passed on Node 24.19.0 / pnpm 11.19.0 on 2026-08-26.

## [0.1.0] — 2026-08-17

Initial public prototype, submitted to Build with Gemini XPRIZE
([Devpost entry](https://devpost.com/software/test-q0h69v)).

- Deterministic commitment compiler over three synthetic artifacts: typed graph,
  six diagnostics (`DA-001`–`DA-006`), three-field semantic patch, `HOLD` →
  `CONDITIONAL PILOT` gate, incremental rebuild of six `DEC-014`-linked sections
  with FNV-1a32 change fingerprints, execution receipts.
- Express API with input bounds, in-memory rate limit, one-hour HMAC compile
  provenance token, security headers and CSP.
- Opt-in Gemini extraction (Developer API or Vertex AI) with exact-quote and
  schema validation; deterministic fallback.
- React control-room UI with persistent `SYNTHETIC DEMO` disclosure.
- 13 domain tests; Docker packaging; Cloud Run deployment in `asia-northeast3`
  verified with a live `gemini-2.5-flash` call; public demo video.
