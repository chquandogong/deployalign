# DeployAlign Project Dashboard

> Status: 0.3.0 built and verified locally (custom-document mode); release in progress; public demo unchanged pending owner auth for D-017 · Date: 2026-08-26 · Owner: DeployAlign orchestrator

## Current state

- Phase: **post-submission continuous improvement** (D-012). `v0.1.0` = submission state, `v0.2.0` = hygiene/honesty cycle, `v0.3.0` = the tool compiles your own documents locally (D-016, owner "go").
- Overall judgment: **the prototype can now be tried on real (redacted) documents locally, with heuristic detectors that quote their sources; it still has no practitioner validation.** Do not claim eligibility, an award, business viability, production readiness or measured impact.
- What changed in 0.2.0 (see `CHANGELOG.md`): execution-origin labelling (`server`/`browser`) with UI disclosure; default model `gemini-3.7-flash` with automatic thinking configuration; `createApp()` factory; 25 new automated tests (11 Gemini validation, 13 API contract, 1 domain); GitHub Actions CI with SHA-pinned actions; `CONTRIBUTING.md`, `SECURITY.md` (private vulnerability reporting enabled), `.nvmrc`; README in English, Korean and Chinese; roadmap; demo video v0.2.0 rendered with a reproducible pipeline.
- What changed in 0.3.0 (see `CHANGELOG.md`): general compiler (`src/domain/general/`), `ALLOW_CUSTOM_ARTIFACTS` API mode with artifact-hash-bound review tokens, document editor + Markdown/JSON export in the UI, hardened Gemini prompt for untrusted text, gated redeploy script for D-017, user-space gcloud installed.
- Verification 2026-08-26 (0.3.0): `pnpm typecheck`, `pnpm lint`, `pnpm test` (60/60 across 5 files), `pnpm build` exited 0; headless-browser QA of paste → compile → approve → export passed with zero console errors (`TEST_PLAN.md`). Earlier (0.2.0): 38/38 plus HTTP smoke.
- **Not verified:** a live `gemini-3.7-flash` call (no credentials in the build environment). The public Cloud Run revision `deployalign-00004-wgb` still serves the 0.1.0 build with `gemini-2.5-flash`, whose Vertex AI retirement date is listed as 2026-10-16 (R-19).
- Demo video v0.2.0: 177 s render verified locally (`docs/submission/DEMO_SCRIPT.md`); **not uploaded** — the 0.1.0 video stays public until D-018.
- Source of truth: the public repository at [github.com/chquandogong/deployalign](https://github.com/chquandogong/deployalign); this dashboard is the coordination snapshot.

## Core goals

1. Make the tool usable on a practitioner's own documents (roadmap 0.3–0.4) without weakening the synthetic-only guard of the public demo.
2. Keep every claim tied to evidence: origin, provider, gate state and test results visible in the product and the docs.
3. Validate demand with five practitioners before building identity, persistence or audit.

## Progress

| Phase | Status | Evidence | Next action |
| --- | --- | --- | --- |
| 0.1.0 submission | Done (2026-08-17) | `docs/submission/EVIDENCE_CHECKLIST.md` (historical record) | None; await organizer result |
| 0.2.0 code | Done, verified locally | 38/38 tests, build, HTTP smoke | Tag `v0.2.0`, push, GitHub release |
| 0.2.0 docs (EN/KO/ZH) | Done | `README*.md`, `CHANGELOG.md`, `ROADMAP.md`, updated `docs/**` | Keep all three READMEs in sync (R-21) |
| CI | Green | `.github/workflows/ci.yml`; run `32931382972` | Keep the four gates + container build required for merges |
| Demo video v0.2.0 | Rendered and checked locally | `videos/build/…mp4` (2:57), EN/KO/ZH `.srt` | Owner upload (D-018) |
| Public demo redeploy | Blocked on owner `gcloud auth login` | `scripts/deploy_cloud_run.sh`, gcloud 582 installed user-space | Owner authenticates; run `DRY_RUN=1` then the deploy; verify live receipt (D-017) |
| 0.3 custom artifacts | Done locally (0.3.0) | `general.test.ts` (15), API custom tests (5), browser QA, `docs/assets/custom-mode-0.3.0.png` | Collect misfires from practitioners into the test corpora |
| Practitioner validation | Not started | — | Recruit five interviews (Office Hours plan) |

## Work board

| Work item | Status | Owner | Dependency | Output |
| --- | --- | --- | --- | --- |
| Execution-origin field + UI | Done | Builder | — | `types.ts`, `compiler.ts`, `compileClient.ts`, `App.tsx`, tests |
| Model default → 3.7 Flash + thinking config | Done (unit-tested) | Builder | Live verification (D-017) | `server/gemini.ts`, `gemini.test.ts` |
| `createApp` factory + API tests | Done | Builder | — | `server/app.ts`, `app.test.ts` |
| CI workflow | Done — green | Builder | — | `.github/workflows/ci.yml`, run `32931382972` |
| Tri-lingual README + repo hygiene | Done | Documentarian | — | `README*.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md` |
| Docs refresh (spec, architecture, runbook, risks, tests, decisions) | Done | Documentarian | — | `docs/**` |
| Demo video v0.2.0 | Rendered | Media | Upload gate D-018 | `scripts/demo-video/`, render + subtitles |
| Release `v0.2.0` | Done | Orchestrator | — | Tags `v0.1.0` (historical) and `v0.2.0`; [GitHub release](https://github.com/chquandogong/deployalign/releases/tag/v0.2.0) with notes, demo mp4 and EN/KO/ZH subtitles |
| General compiler + custom mode + editor/export | Done | Builder | — | `src/domain/general/*`, `server/app.ts`, `ArtifactEditor.tsx`, `exportMarkdown.ts`, 22 new tests |
| Release `v0.3.0` | In progress | Orchestrator | Gates green | Tag, push, GitHub release |
| Redeploy Cloud Run on 0.3.0 | Blocked on owner auth | Owner | `gcloud auth login` (D-017) | New revision, live `gemini-3.7-flash` receipt |
| 0.4 CLI / CI mode | Not started | Builder | Owner priority | `deployalign compile … --fail-on blocker` on top of the general compiler |

## Resume point

- Last verified checkpoint: 0.3.0 working tree with all gates green and browser QA passed on 2026-08-26; tag `v0.3.0` and release follow immediately. Previous: `v0.2.0` (`6c150dd`) + CI fix `cb6e32e`.
- Next safe action for a resuming agent: read the owner decision queue below; do **not** redeploy, upload video or edit Devpost without owner approval. Code work can start on the un-automated API cases listed in `TEST_PLAN.md` or, once D-016 is approved, on the 0.3 fixture-reproduction test.
- Local demo server for recordings runs on port `8091` (`8080` is used by another project on this machine).

## Decisions waiting on the owner

| ID | Decision | Default if silent |
| --- | --- | --- |
| D-016 | ~~Approve the 0.3 local-mode design~~ — approved ("go") and shipped in 0.3.0 | Done |
| D-017 | Redeploy Cloud Run with 0.3.0 and verify a live `gemini-3.7-flash` receipt before 2026-10-16 — needs the owner to run `gcloud auth login`; script ready | Public demo stays on 0.1.0 / 2.5 Flash |
| D-018 | Upload demo video v0.2.0 and swap the links | README keeps the 2026-08-17 video |
| D-019 | Synthesized narration voice vs. human recording | Synthesized, licence note kept |

## Open assumptions

- A-11: `gemini-3.7-flash` on Vertex `global` accepts the structured-output request with `thinkingLevel: LOW` — unit-tested, not live-verified.
- A-12: practitioners will share redacted artifacts (open). A-13: detectors generalise — partially validated on three synthetic corpora in 0.3.0; real-document precision unknown (R-22).
- A-01 … A-04, A-07, A-09, A-10 remain open from 0.1.0 (`../01-discovery/ASSUMPTIONS.md`).

## Top risks

| Risk | Likelihood | Impact | Response | State |
| --- | ---: | ---: | --- | --- |
| R-19 Public demo still on `gemini-2.5-flash`, retiring on Vertex AI 2026-10-16 | High | Medium | Redeploy 0.2.0 (D-017) | Open |
| R-20 New default model not live-verified | Medium | Medium | Verify one live compile at deploy time; `GEMINI_MODEL` pin is the rollback | Open |
| R-22 Lexical detectors over/under-fire on real phrasing (English-only) | High | Medium | Findings quote sources and are labelled heuristic; add misfires to test corpora | Open — inherent to 0.3 |
| R-23 Custom mode + live Gemini sends user text to the model | Medium | High | Both flags default off; forbidden on the public demo; UI states where text goes | Documented control |
| R-11 Diagnostics overfit to the bundled sample | Medium | High | 0.3 detectors pass three synthetic corpora; measure on redacted documents | Mitigating |
| R-13 Public demo lacks auth/persistence/rollback | High | Critical | Keep synthetic-only, single instance, clear labels | Accepted for demo |
| R-01 Zero revenue / one user for the competition | High | Critical | Truthful record; await organizer | Accepted submission risk |

## Quality indicators

- Tests: 60/60 (14 domain · 15 general path · 2 export · 11 Gemini validation · 18 API contract).
- Browser QA (custom flow): passed 2026-08-26, zero console errors.
- Typecheck, lint, production build: passed 2026-08-26.
- Production HTTP smoke (0.2.0): passed 2026-08-26 (local).
- CI: green on the first post-fix run (`32931382972`, 2026-08-26) — quality job and container-image job both succeeded; the very first run failed on setup-node's package-manager cache probing for pnpm before Corepack, fixed in `cb6e32e`.
- Live model: not exercised this cycle.

## Next actions

1. Finish the `v0.3.0` release (commit series, tag, push, GitHub release).
2. Owner: run `gcloud auth login --update-adc` with the user-space SDK, then `scripts/deploy_cloud_run.sh` (D-017) before 2026-10-16; verify the live receipt and update `RUNBOOK.md` / `ASSUMPTIONS.md`.
3. Owner: decide D-018/D-019 and upload the v0.2.0 video; swap links in all three READMEs.
4. Try 0.3 on a redacted real document set locally; feed every misfire into `general.test.ts` corpora (R-22).
5. Recruit five practitioners for the validation experiment described in `../01-discovery/OFFICE_HOURS.md`.

## Links

- [Project brief](PROJECT_BRIEF.md) · [Roadmap](ROADMAP.md)
- [Feasibility report](../01-discovery/FEASIBILITY_REPORT.md) · [Assumptions](../01-discovery/ASSUMPTIONS.md)
- [Decision log](../02-decisions/DECISION_LOG.md)
- [Specification](../03-spec/SPEC.md) · [Architecture](../03-spec/ARCHITECTURE.md)
- [Test plan](../04-quality/TEST_PLAN.md) · [Risk register](../04-quality/RISK_REGISTER.md)
- [Runbook](../05-ops/RUNBOOK.md) · [Ship checklist](../05-ops/SHIP_CHECKLIST.md) · [Retro](../05-ops/RETRO.md)
- [Demo script](../submission/DEMO_SCRIPT.md) · [YouTube metadata](../submission/YOUTUBE_METADATA.md) · [Submission evidence (historical)](../submission/EVIDENCE_CHECKLIST.md)
