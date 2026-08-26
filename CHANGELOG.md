# Changelog

All notable changes to DeployAlign are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow SemVer.

## [0.4.0] — 2026-08-26

The decision compiler becomes a command. `deployalign compile ./docs --fail-on blocker`
turns a proposal that outruns its evidence into a failed build, and the detectors learn
their first Korean. The public demo now runs the current code on Gemini 3.7 Flash.

### Added

- **CLI** (`bin/deployalign.mjs` → `cli/main.ts`, runs the TypeScript directly through
  tsx): `compile <dir>` (roles from file names `customer*`/`sales*`/`engineering*` or
  `고객*`/`영업*`/`엔지니어링*`), `--customer/--sales/--engineering` files, or
  `--artifacts file.json`; `--out <dir>` writes `result.json`, `report.md` and the three
  target documents; `--fail-on blocker|warning|none` sets the verdict (exit 2 on
  failure, 1 on usage/input error); `--approved` renders the reviewed baseline and says
  so; `--json`, `--quiet`; `demo` compiles the bundled fixture. No model is called. 6 tests.
- **First-pass Korean support** in the general compiler: Hangul tokenisation, particle
  stripping for linking, native numerals and attached counters (`12곳의`, `5종`), stage
  labels (`1단계`), units and percentages (`800 mm입니다`, `95퍼센트`), predicate-ending
  boundaries (`커버합니다`), noun-before-quantifier phrases (`시설 전체`), and Korean cue
  lists for every detector. A Korean translation of the Raman fixture reproduces the
  six diagnostics and a verbatim Korean patch (`다섯 가지 명명된 분석 물질`, `12곳의 핵심
  구역`, `감독 하의 1단계 운영`).
- **Two more English corpora** (drone inspection, hospital delivery robot) that pin
  down bounded lists (`all five flare stacks`), stage labels (`Phase 2`), measurable
  acceptance (`no smaller than 10 cm at 95% recall`), completed tests, `ward`-type area
  nouns, and site-claim clustering with number-free unverified statements.
- `ExecutionOrigin` gains `cli`.

### Changed

- **Public demo redeployed (D-017):** Cloud Run revision `deployalign-00005-9vs` serves
  the `v0.3.0` build with `GEMINI_MODEL=gemini-3.7-flash`; health reports
  `version 0.3.0`, `model gemini-3.7-flash`, `customArtifacts false`, and a live compile
  returned `provider gemini-vertex` with the receipt *"gemini-3.7-flash classified 3
  source statements"*. Risks R-19/R-20 closed; assumption A-11 validated.
- Detector fixes found by the new corpora: `attended operation` no longer swallows
  `for the…`; "Verified data covers…" is evidence, not a completed test; unverified
  statements without a number join the site-claim cluster they describe.

### Limits

- Korean support is lexical and first-pass: no morphological analysis, so unusual
  particles, spacing or honorific forms will be missed; English narrowing of customer
  preferences is not yet mirrored in Korean.
- The CLI runs the deterministic path only; Gemini candidates are an API/UI feature.

### Verification

`pnpm typecheck`, `pnpm lint`, `pnpm test` (72 tests across 7 files) and `pnpm build`
passed on Node 24.19.0 / pnpm 11.19.0 on 2026-08-26; `node bin/deployalign.mjs demo`
exits 2 (four open blockers) as designed.

## [0.3.0] — 2026-08-26

The tool stops being fixture-only. Behind a local-only flag it now compiles **your own**
three documents through a general path: clause extraction, lexical typing, the six
diagnostics as real detectors, and a patch whose every value is copied verbatim from
the engineering text. The public demo keeps its synthetic-only guard.

### Added

- **General compiler** (`src/domain/general/`): `extractStatements` (verbatim clauses
  with line numbers), `classifyStatements` (role-aware lexical typing into the eleven
  node types), `detect` (DA-001–DA-006 as detectors, typed edges, evidence-derived patch
  with `resolves`/`retains`), `compileGeneral` (graph, gate, three targets, impact set,
  receipts). Deterministic and isolated; 15 tests including a fixture-reproduction case
  and a bounded "clean" corpus that must yield zero diagnostics.
- **Custom-artifact mode on the API** behind `ALLOW_CUSTOM_ARTIFACTS=true`: one document
  per role, ≥ 20 characters each, unknown keys dropped; the compile token now binds
  `mode`, `patchId` and a SHA-256 of the artifacts, and custom review must resubmit the
  identical artifacts (409 otherwise). `/api/health` reports `customArtifacts`. 5 new API
  tests.
- **Document editor in the UI** (shown only when the API advertises custom mode): three
  role-tagged text areas with counters, compile/reset, mode-aware `CUSTOM` chip, strip,
  labels and footer.
- **Export**: Markdown (diagnostics with quotes, patch table, targets with fingerprints,
  source map) and JSON, built in the browser (`src/lib/exportMarkdown.ts`, 2 tests).
- `CompileResult.mode` (`fixture` | `custom`) and `synthetic: boolean`.
- Gemini prompt now tells the model that custom documents are untrusted data to be
  treated strictly as content (fixture keeps the synthetic wording).
- `scripts/deploy_cloud_run.sh`: gated redeploy helper for decision D-017 (describe →
  build/deploy from source → verify live receipt), and a user-space gcloud install note
  in the runbook.

### Changed

- `compileDemo` and `compileGeneral` share `src/domain/fingerprint.ts` for FNV-1a32
  fingerprints and section construction.
- The fixture still compiles through the canonical compiler in every mode, so the demo,
  screenshots and video remain byte-for-byte identical.

### Limits (read before trusting a result)

- Detectors are **English lexical heuristics**. They surface candidates for a reviewer;
  they do not decide anything, and they will miss phrasing they were not written for.
  Korean/other-language cues are a roadmap item.
- Hard-wrapped prose yields one clause per line; each clause is still a verbatim quote.
- The gate is `HOLD` until a human review action even when zero diagnostics fire, and
  never reaches an unconditional `PASS`.
- With `ALLOW_LIVE_GEMINI=true` **and** `ALLOW_CUSTOM_ARTIFACTS=true`, your text is sent
  to the model. Keep custom mode off on any public deployment.

### Verification

`pnpm typecheck`, `pnpm lint`, `pnpm test` (60 tests across 5 files) and `pnpm build`
passed on Node 24.19.0 / pnpm 11.19.0 on 2026-08-26; a headless-browser QA of the
paste → compile → approve → export flow ran against the production build with custom
mode enabled (see `docs/04-quality/TEST_PLAN.md`).

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
- `.env.example` still pinned `GEMINI_MODEL=gemini-2.5-flash` in this release (fixed by the
  owner in 0.4.1).
- A live `gemini-3.7-flash` call was **not** verified in this cycle (no model
  credentials in the build environment). The configuration is covered by unit tests
  only; the first deploy with the new default must confirm a live receipt.

### Verification

`pnpm typecheck`, `pnpm lint`, `pnpm test` (38 tests across 3 files) and
`pnpm build` passed on Node 24.19.0 / pnpm 11.19.0 on 2026-08-26, locally and in
GitHub Actions (quality and container-image jobs green).

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
