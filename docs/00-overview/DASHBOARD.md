# DeployAlign Project Dashboard

> Status: 0.6.0 built and verified locally (example presets in the editor); Action/examples/pilot kit shipped in 0.5.0; v0.4.0 demo video published; public demo on gemini-3.7-flash · Date: 2026-08-26 · Owner: DeployAlign orchestrator

## Current state

- Phase: **post-submission continuous improvement** (D-012). `v0.1.0` = submission state, `v0.2.0` = hygiene/honesty, `v0.3.0` = your own documents locally (D-016), `v0.4.0` = CLI + first-pass Korean (D-020/D-021), `v0.4.1` = demo video v0.4.0 published (D-018), `v0.5.0` = GitHub Action + examples + pilot kit (D-022).
- Overall judgment: **everything a practitioner needs to try the tool exists — UI, API, CLI, GitHub Action, example sets in English and Korean, a published walkthrough, and a pilot kit. The one thing still missing is the pilot itself: no practitioner has run a real document.** Do not claim eligibility, an award, business viability, production readiness or measured impact.
- What changed in 0.2.0 (see `CHANGELOG.md`): execution-origin labelling (`server`/`browser`) with UI disclosure; default model `gemini-3.7-flash` with automatic thinking configuration; `createApp()` factory; 25 new automated tests (11 Gemini validation, 13 API contract, 1 domain); GitHub Actions CI with SHA-pinned actions; `CONTRIBUTING.md`, `SECURITY.md` (private vulnerability reporting enabled), `.nvmrc`; README in English, Korean and Chinese; roadmap; demo video v0.2.0 rendered with a reproducible pipeline.
- What changed in 0.3.0 (see `CHANGELOG.md`): general compiler (`src/domain/general/`), `ALLOW_CUSTOM_ARTIFACTS` API mode with artifact-hash-bound review tokens, document editor + Markdown/JSON export in the UI, hardened Gemini prompt for untrusted text, gated redeploy script for D-017, user-space gcloud installed.
- Verification 2026-08-26 (0.3.0): `pnpm typecheck`, `pnpm lint`, `pnpm test` (60/60 across 5 files), `pnpm build` exited 0; headless-browser QA of paste → compile → approve → export passed with zero console errors (`TEST_PLAN.md`). Earlier (0.2.0): 38/38 plus HTTP smoke.
- **D-017 done 2026-08-26:** revision `deployalign-00005-9vs` (tag `v0.3.0`) serves 100% of traffic with `GEMINI_MODEL=gemini-3.7-flash`; health `version 0.3.0 · liveGemini true · customArtifacts false`; a live compile returned `gemini-vertex` with the receipt "gemini-3.7-flash classified 3 source statements". R-19/R-20 closed; `deployalign-00004-wgb` kept for rollback.
- What changed in 0.5.0 (see `CHANGELOG.md`): composite GitHub Action self-tested in CI on `examples/`; three example document sets; negation guard and Korean preference narrowing; `docs/05-ops/PILOT_KIT.md` and the Detector-misfire issue template; CI actions on v7/v4/v7; 75 tests. 0.4.1: demo video v0.4.0 published at https://youtu.be/3sWnxibKU1Q with EN/KO/ZH subtitle tracks.
- Demo video v0.4.0 (3:07) published 2026-08-26 at https://youtu.be/3sWnxibKU1Q (D-018 done); the v0.2.0 render stays attached to its GitHub release; the 0.1.0 submission video remains public.
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
| Public demo redeploy | Done (D-017) | Revision `deployalign-00005-9vs`; live `gemini-3.7-flash` receipt | Keep max instances 1; redeploy again when 0.4.x is tagged if desired |
| 0.3 custom artifacts | Done (0.3.0), live on the public demo as disabled | `general.test.ts` (15), API custom tests (5), browser QA | Collect misfires from practitioners into the test corpora |
| 0.4 CLI / CI mode + Korean | Done (0.4.0) | `cli/main.test.ts` (6), `corpora.test.ts` (9), `bin/deployalign.mjs demo` exit 2 | — |
| 0.5 GitHub Action + examples + pilot kit | Done locally (0.5.0) | `action.yml`, CI job `action`, `examples/`, `PILOT_KIT.md` | Run the first practitioner session |
| Demo video v0.4.0 | Published (0.4.1) | https://youtu.be/3sWnxibKU1Q, EN/KO/ZH subtitles, release assets | Re-render when the UI changes materially |
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
| Release `v0.3.0` | Done | Orchestrator | — | Tag + [GitHub release](https://github.com/chquandogong/deployalign/releases/tag/v0.3.0) |
| CLI + Korean cues + corpora | Done | Builder | — | `cli/`, `bin/`, `lexicon.ts`, `text.ts`, 12 new tests |
| Redeploy public demo (D-017) | Done | Owner + Orchestrator | Owner auth | `deployalign-00005-9vs`, live receipt |
| Release `v0.4.0` / `v0.4.1` | Done | Orchestrator | — | Tags + GitHub releases (v0.4.1 carries the video assets) |
| GitHub Action + examples + pilot kit + detector fixes | Done | Builder | — | `action.yml`, `examples/`, `PILOT_KIT.md`, issue template, 3 new corpora tests |
| Release `v0.5.0` | Done | Orchestrator | — | Tag + GitHub release; CI Action self-test green |
| Example presets in the editor | Done | Builder | — | `src/domain/examples.ts`, `examples.test.ts`, browser QA |
| Release `v0.6.0` | In progress | Orchestrator | Gates green | Tag, push, GitHub release |
| Practitioner validation | Not started | Owner | Recruiting | Five interviews; redacted corpora |

## Resume point

- Last verified checkpoint: 0.6.0 working tree with all gates green (78 tests) on 2026-08-26; tag `v0.6.0` and release follow immediately. Public demo: `deployalign-00005-9vs` (`v0.3.0`).
- Next safe action for a resuming agent: read the owner decision queue below; do **not** redeploy, upload video or edit Devpost without owner approval. Code work can start on the un-automated API cases listed in `TEST_PLAN.md` or, once D-016 is approved, on the 0.3 fixture-reproduction test.
- Local demo server for recordings runs on port `8091` (`8080` is used by another project on this machine).

## Decisions waiting on the owner

| ID | Decision | Default if silent |
| --- | --- | --- |
| D-016 | ~~Approve the 0.3 local-mode design~~ — approved ("go") and shipped in 0.3.0 | Done |
| D-017 | ~~Redeploy Cloud Run and verify a live receipt~~ — done 2026-08-26 | Done |
| D-018 | ~~Upload the demo video and swap the links~~ — v0.4.0 published 2026-08-26 (https://youtu.be/3sWnxibKU1Q) | Done |
| D-019 | ~~Synthesized narration voice vs. human recording~~ — keep synthesized (owner, 2026-08-26) | Done |

## Open assumptions

- A-11: validated 2026-08-26 on the public demo (live `gemini-3.7-flash` receipt).
- A-12: practitioners will share redacted artifacts (open). A-13: detectors generalise — partially validated on three synthetic corpora in 0.3.0; real-document precision unknown (R-22).
- A-01 … A-04, A-07, A-09, A-10 remain open from 0.1.0 (`../01-discovery/ASSUMPTIONS.md`).

## Top risks

| Risk | Likelihood | Impact | Response | State |
| --- | ---: | ---: | --- | --- |
| R-19 Public demo still on `gemini-2.5-flash`, retiring on Vertex AI 2026-10-16 | High | Medium | Redeploy 0.2.0 (D-017) | Open |
| R-20 New default model not live-verified | Medium | Medium | Verify one live compile at deploy time; `GEMINI_MODEL` pin is the rollback | Open |
| R-22 Lexical detectors over/under-fire on real phrasing (English, first-pass Korean) | High | Medium | Findings quote sources and are labelled heuristic; three synthetic corpora; add misfires to `corpora.test.ts` | Open — inherent to heuristics |
| R-23 Custom mode + live Gemini sends user text to the model | Medium | High | Both flags default off; forbidden on the public demo; UI states where text goes | Documented control |
| R-11 Diagnostics overfit to the bundled sample | Medium | High | 0.3 detectors pass three synthetic corpora; measure on redacted documents | Mitigating |
| R-13 Public demo lacks auth/persistence/rollback | High | Critical | Keep synthetic-only, single instance, clear labels | Accepted for demo |
| R-01 Zero revenue / one user for the competition | High | Critical | Truthful record; await organizer | Accepted submission risk |

## Quality indicators

- Tests: 78/78 (14 domain · 15 general path · 9 corpora · 3 example presets · 2 export · 6 CLI · 11 Gemini validation · 18 API contract); CI additionally self-tests the Action on three example sets.
- Browser QA (custom flow): passed 2026-08-26, zero console errors.
- Typecheck, lint, production build: passed 2026-08-26.
- Production HTTP smoke (0.2.0): passed 2026-08-26 (local).
- CI: green on the first post-fix run (`32931382972`, 2026-08-26) — quality job and container-image job both succeeded; the very first run failed on setup-node's package-manager cache probing for pnpm before Corepack, fixed in `cb6e32e`.
- Live model: `gemini-3.7-flash` verified on the public demo 2026-08-26 (D-017).

## Next actions

1. Finish the `v0.6.0` release (commit, tag, push, GitHub release).
2. **Owner: run the first practitioner session with `docs/05-ops/PILOT_KIT.md`** — this is the only item that produces evidence the code cannot.
3. ~~D-018/D-019~~ — v0.4.0 video published with EN/KO/ZH subtitles; synthesized voice kept.
4. Feed every misfire from real (redacted) documents through the Detector-misfire template into `corpora.test.ts` (R-22).
5. Recruit five practitioners for the validation experiment described in `../01-discovery/OFFICE_HOURS.md`.

## Links

- [Project brief](PROJECT_BRIEF.md) · [Roadmap](ROADMAP.md)
- [Feasibility report](../01-discovery/FEASIBILITY_REPORT.md) · [Assumptions](../01-discovery/ASSUMPTIONS.md)
- [Decision log](../02-decisions/DECISION_LOG.md)
- [Specification](../03-spec/SPEC.md) · [Architecture](../03-spec/ARCHITECTURE.md)
- [Test plan](../04-quality/TEST_PLAN.md) · [Risk register](../04-quality/RISK_REGISTER.md)
- [Runbook](../05-ops/RUNBOOK.md) · [Ship checklist](../05-ops/SHIP_CHECKLIST.md) · [Retro](../05-ops/RETRO.md)
- [Demo script](../submission/DEMO_SCRIPT.md) · [YouTube metadata](../submission/YOUTUBE_METADATA.md) · [Submission evidence (historical)](../submission/EVIDENCE_CHECKLIST.md)
