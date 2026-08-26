# DeployAlign Project Dashboard

> Status: 0.2.0 built and verified locally; release to the public repository in progress; public demo unchanged · Date: 2026-08-26 · Owner: DeployAlign orchestrator

## Current state

- Phase: **post-submission continuous improvement** (D-012). The 2026-08-17 Devpost state is `v0.1.0`; this cycle ships `v0.2.0`.
- Overall judgment: **the prototype is honest, current and testable again; it is still a synthetic demo with no user validation.** Do not claim eligibility, an award, business viability, production readiness or measured impact.
- What changed in 0.2.0 (see `CHANGELOG.md`): execution-origin labelling (`server`/`browser`) with UI disclosure; default model `gemini-3.7-flash` with automatic thinking configuration; `createApp()` factory; 25 new automated tests (11 Gemini validation, 13 API contract, 1 domain); GitHub Actions CI with SHA-pinned actions; `CONTRIBUTING.md`, `SECURITY.md` (private vulnerability reporting enabled), `.nvmrc`; README in English, Korean and Chinese; roadmap; demo video v0.2.0 rendered with a reproducible pipeline.
- Verification 2026-08-26: `pnpm typecheck`, `pnpm lint`, `pnpm test` (38/38), `pnpm build` exited 0 on Node 24.19.0 / pnpm 11.19.0; production-mode HTTP smoke passed (health `version 0.2.0`, `model gemini-3.7-flash`; compile → approve labelled `server`; tampered token → 409; CSP; immutable assets; licence notice 3,462 bytes).
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
| CI | Authored | `.github/workflows/ci.yml` | First run happens on push; fix anything red |
| Demo video v0.2.0 | Rendered and checked locally | `videos/build/…mp4` (2:57), EN/KO/ZH `.srt` | Owner upload (D-018) |
| Public demo redeploy | Not started — gated | — | Owner decision D-017 before 2026-10-16 |
| 0.3 custom artifacts | Designed only | `ROADMAP.md` | Owner decision D-016 |
| Practitioner validation | Not started | — | Recruit five interviews (Office Hours plan) |

## Work board

| Work item | Status | Owner | Dependency | Output |
| --- | --- | --- | --- | --- |
| Execution-origin field + UI | Done | Builder | — | `types.ts`, `compiler.ts`, `compileClient.ts`, `App.tsx`, tests |
| Model default → 3.7 Flash + thinking config | Done (unit-tested) | Builder | Live verification (D-017) | `server/gemini.ts`, `gemini.test.ts` |
| `createApp` factory + API tests | Done | Builder | — | `server/app.ts`, `app.test.ts` |
| CI workflow | Authored | Builder | Push to GitHub | `.github/workflows/ci.yml` |
| Tri-lingual README + repo hygiene | Done | Documentarian | — | `README*.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md` |
| Docs refresh (spec, architecture, runbook, risks, tests, decisions) | Done | Documentarian | — | `docs/**` |
| Demo video v0.2.0 | Rendered | Media | Upload gate D-018 | `scripts/demo-video/`, render + subtitles |
| Release `v0.2.0` | In progress | Orchestrator | Gates green | Tag, push, GitHub release with notes |
| Redeploy Cloud Run on 0.2.0 | Blocked (gate) | Owner | D-017 | New revision, live receipt |
| 0.3 local custom-artifact mode | Blocked (gate) | Owner + Builder | D-016 | Design in `ROADMAP.md` |

## Resume point

- Last verified checkpoint: working tree with all 0.2.0 changes, gates green on 2026-08-26 13:40 KST; release commits and tag follow immediately.
- Next safe action for a resuming agent: `git log --oneline -1`; if `v0.2.0` is not tagged, re-run the four gates and complete the release; do **not** redeploy, upload video or edit Devpost without owner approval.
- Local demo server for recordings runs on port `8091` (`8080` is used by another project on this machine).

## Decisions waiting on the owner

| ID | Decision | Default if silent |
| --- | --- | --- |
| D-016 | Approve the 0.3 "bring your own artifacts" local-mode design and privacy posture | Not started |
| D-017 | Redeploy Cloud Run with 0.2.0 and verify a live `gemini-3.7-flash` receipt before 2026-10-16 | Public demo stays on 0.1.0 / 2.5 Flash |
| D-018 | Upload demo video v0.2.0 and swap the links | README keeps the 2026-08-17 video |
| D-019 | Synthesized narration voice vs. human recording | Synthesized, licence note kept |

## Open assumptions

- A-11: `gemini-3.7-flash` on Vertex `global` accepts the structured-output request with `thinkingLevel: LOW` — unit-tested, not live-verified.
- A-12 / A-13: practitioners will share redacted artifacts, and the six diagnostics generalise without excessive false positives.
- A-01 … A-04, A-07, A-09, A-10 remain open from 0.1.0 (`../01-discovery/ASSUMPTIONS.md`).

## Top risks

| Risk | Likelihood | Impact | Response | State |
| --- | ---: | ---: | --- | --- |
| R-19 Public demo still on `gemini-2.5-flash`, retiring on Vertex AI 2026-10-16 | High | Medium | Redeploy 0.2.0 (D-017) | Open |
| R-20 New default model not live-verified | Medium | Medium | Verify one live compile at deploy time; `GEMINI_MODEL` pin is the rollback | Open |
| R-11 Diagnostics overfit to the bundled sample | High | High | 0.3 general detectors + redacted corpus | Open |
| R-13 Public demo lacks auth/persistence/rollback | High | Critical | Keep synthetic-only, single instance, clear labels | Accepted for demo |
| R-01 Zero revenue / one user for the competition | High | Critical | Truthful record; await organizer | Accepted submission risk |

## Quality indicators

- Tests: 38/38 (14 domain · 11 Gemini validation · 13 API contract).
- Typecheck, lint, production build: passed 2026-08-26.
- Production HTTP smoke: passed 2026-08-26 (local).
- CI: authored; first run pending push.
- Live model: not exercised this cycle.

## Next actions

1. Finish the `v0.2.0` release (commit series, annotated tag, push, GitHub release with CHANGELOG notes and the demo video as an asset).
2. Owner: decide D-017 and redeploy before 2026-10-16; verify the live receipt and update `RUNBOOK.md` / `ASSUMPTIONS.md`.
3. Owner: decide D-018/D-019 and upload the v0.2.0 video; swap links in all three READMEs.
4. Owner: decide D-016; then implement 0.3 behind `ALLOW_CUSTOM_ARTIFACTS` with the fixture-reproduction test as the first acceptance criterion.
5. Recruit five practitioners for the validation experiment described in `../01-discovery/OFFICE_HOURS.md`.

## Links

- [Project brief](PROJECT_BRIEF.md) · [Roadmap](ROADMAP.md)
- [Feasibility report](../01-discovery/FEASIBILITY_REPORT.md) · [Assumptions](../01-discovery/ASSUMPTIONS.md)
- [Decision log](../02-decisions/DECISION_LOG.md)
- [Specification](../03-spec/SPEC.md) · [Architecture](../03-spec/ARCHITECTURE.md)
- [Test plan](../04-quality/TEST_PLAN.md) · [Risk register](../04-quality/RISK_REGISTER.md)
- [Runbook](../05-ops/RUNBOOK.md) · [Ship checklist](../05-ops/SHIP_CHECKLIST.md) · [Retro](../05-ops/RETRO.md)
- [Demo script](../submission/DEMO_SCRIPT.md) · [YouTube metadata](../submission/YOUTUBE_METADATA.md) · [Submission evidence (historical)](../submission/EVIDENCE_CHECKLIST.md)
