# DeployAlign Project Dashboard

> Status: v0.6.0 released 2026-08-26 (tags v0.1.0–v0.6.0 on GitHub); v0.6.1 released 2026-09-02 (documentation reconciliation; public demo redeployed as `deployalign-00006-h5c`, version 0.6.1, gemini-3.7-flash, live receipt) · Date: 2026-09-02 · Owner: DeployAlign orchestrator

## Current state

- Phase: **post-submission continuous improvement** (D-012). `v0.1.0` = submission state, `v0.2.0` = hygiene/honesty, `v0.3.0` = your own documents locally (D-016), `v0.4.0` = CLI + first-pass Korean (D-020/D-021), `v0.4.1` = demo video v0.4.0 published (D-018), `v0.5.0` = GitHub Action + examples + pilot kit (D-022), `v0.6.0` = example presets in the editor, `v0.6.1` = documentation reconciliation + public demo redeployed (D-024, 2026-09-02).
- Overall judgment: **everything a practitioner needs to try the tool exists — UI, API, CLI, GitHub Action, example sets in English and Korean, a published walkthrough, and a pilot kit. The one thing still missing is the pilot itself: no practitioner has run a real document.** Do not claim eligibility, an award, business viability, production readiness or measured impact.
- What changed in 0.2.0 (see `CHANGELOG.md`): execution-origin labelling (`server`/`browser`) with UI disclosure; default model `gemini-3.7-flash` with automatic thinking configuration; `createApp()` factory; 25 new automated tests (11 Gemini validation, 13 API contract, 1 domain); GitHub Actions CI with SHA-pinned actions; `CONTRIBUTING.md`, `SECURITY.md` (private vulnerability reporting enabled), `.nvmrc`; README in English, Korean and Chinese; roadmap; demo video v0.2.0 rendered with a reproducible pipeline.
- What changed in 0.3.0 (see `CHANGELOG.md`): general compiler (`src/domain/general/`), `ALLOW_CUSTOM_ARTIFACTS` API mode with artifact-hash-bound review tokens, document editor + Markdown/JSON export in the UI, hardened Gemini prompt for untrusted text, gated redeploy script for D-017, user-space gcloud installed.
- Verification 2026-08-26 (0.3.0): `pnpm typecheck`, `pnpm lint`, `pnpm test` (60/60 across 5 files), `pnpm build` exited 0; headless-browser QA of paste → compile → approve → export passed with zero console errors (`TEST_PLAN.md`). Earlier (0.2.0): 38/38 plus HTTP smoke.
- **D-017 done 2026-08-26:** revision `deployalign-00005-9vs` (tag `v0.3.0`) serves 100% of traffic with `GEMINI_MODEL=gemini-3.7-flash`; health `version 0.3.0 · liveGemini true · customArtifacts false`; a live compile returned `gemini-vertex` with the receipt "gemini-3.7-flash classified 3 source statements". R-19/R-20 closed; `deployalign-00004-wgb` kept for rollback.
- What changed in 0.5.0 (see `CHANGELOG.md`): composite GitHub Action self-tested in CI on `examples/`; three example document sets; negation guard and Korean preference narrowing; `docs/05-ops/PILOT_KIT.md` and the Detector-misfire issue template; CI actions on v7/v4/v7; 75 tests. 0.4.1: demo video v0.4.0 published at https://youtu.be/3sWnxibKU1Q with EN/KO/ZH subtitle tracks.
- Demo video v0.4.0 (3:07) published 2026-08-26 at https://youtu.be/3sWnxibKU1Q (D-018 done); the v0.2.0 render stays attached to its GitHub release; the 0.1.0 submission video remains public.
- **Re-verified 2026-09-02 (0.6.1 tree):** `pnpm typecheck`, `pnpm lint`, `pnpm test` (78/78 across 8 files) and `pnpm build` all exited 0 on Node 24.19.0 / pnpm 11.19.0; `pnpm audit --prod`: "No known vulnerabilities found"; `node bin/deployalign.mjs demo` exits 2. Git: local `main` == `origin/main` before today's work; seven tags `v0.1.0`–`v0.6.0` on origin, each with a GitHub release; CI on `main` green: runs `32951993001` (v0.6.0 release push) and `32952371781` (`3aee012`), 3 jobs each. Public demo health re-confirmed before the redeploy: revision `deployalign-00005-9vs` (tag `v0.3.0`, deployed 2026-08-26) — `version 0.3.0 · liveGemini true · model gemini-3.7-flash · customArtifacts false`; 0.4.0–0.6.0 (CLI, Action, detectors, a local-mode-only editor row) change nothing in the public fixture-only UI except the `/api/health` version. Both demo videos public (https://youtu.be/3sWnxibKU1Q v0.4.0; https://youtu.be/QOPgHHAWOBA 0.1.0 submission record). Devpost project page live and "Submitted"; hackathon page reads "This hackathon has ended" and "Winners announced soon" (listed end date 2026-09-25); no result recorded. npm names `deployalign` and `@chquandogong/deployalign` unclaimed (E404) on 2026-09-02 — D-023 pending owner confirmation.
- **D-024 done 2026-09-02 (owner-instructed):** revision `deployalign-00006-h5c` serves 100% of traffic, built from the 0.6.1 tree (commit `a6f9050`) with `scripts/deploy_cloud_run.sh` from a clean worktree; health `version 0.6.1 · liveGemini true · model gemini-3.7-flash · customArtifacts false`; a live compile returned `gemini-vertex` / `executionOrigin server` / `mode fixture` with the receipt "gemini-3.7-flash classified 3 source statements"; identity, secret binding and limits preserved. `deployalign-00005-9vs` (v0.3.0, gemini-3.7-flash) is the rollback target, so nothing depends on `gemini-2.5-flash` any more.
- Source of truth: the public repository at [github.com/chquandogong/deployalign](https://github.com/chquandogong/deployalign); this dashboard is the coordination snapshot.

## Core goals

1. Make the tool usable on a practitioner's own documents (roadmap 0.3–0.4) without weakening the synthetic-only guard of the public demo.
2. Keep every claim tied to evidence: origin, provider, gate state and test results visible in the product and the docs.
3. Validate demand with five practitioners before building identity, persistence or audit.

## Progress

| Phase | Status | Evidence | Next action |
| --- | --- | --- | --- |
| 0.1.0 submission | Done (2026-08-17) | `docs/submission/EVIDENCE_CHECKLIST.md` (historical record) | None; await organizer result |
| Hackathon result | Awaiting organizer | Devpost "Submitted"; hackathon page "ended — Winners announced soon", listed end date 2026-09-25 | Check after 2026-09-25; no edits to the entry |
| 0.2.0 code | Done, verified locally | 38/38 tests, build, HTTP smoke | None — tagged and released 2026-08-26 |
| 0.2.0 docs (EN/KO/ZH) | Done | `README*.md`, `CHANGELOG.md`, `ROADMAP.md`, updated `docs/**` | Keep all three READMEs in sync (R-21) |
| CI | Green | `.github/workflows/ci.yml`; run `32931382972` | Keep the four gates + container build required for merges |
| Demo video v0.2.0 | Superseded by v0.4.0 (published 2026-08-26); the v0.2.0 render stays attached to its GitHub release | `videos/build/…mp4` (2:57), EN/KO/ZH `.srt` | — |
| Public demo redeploy | Done (D-017 2026-08-26; D-024 2026-09-02) | Revision `deployalign-00006-h5c` (0.6.1); live `gemini-3.7-flash` receipt; rollback target `deployalign-00005-9vs` | Keep max instances 1; redeploy when a tagged release changes the public UI or API |
| 0.3 custom artifacts | Done (0.3.0), live on the public demo as disabled | `general.test.ts` (15), API custom tests (5), browser QA | Collect misfires from practitioners into the test corpora |
| 0.4 CLI / CI mode + Korean | Done (0.4.0) | `cli/main.test.ts` (6), `corpora.test.ts` (9), `bin/deployalign.mjs demo` exit 2 | — |
| 0.5 GitHub Action + examples + pilot kit | Done locally (0.5.0) | `action.yml`, CI job `action`, `examples/`, `PILOT_KIT.md` | Run the first practitioner session |
| Demo video v0.4.0 | Published (0.4.1) | https://youtu.be/3sWnxibKU1Q, EN/KO/ZH subtitles, release assets | Re-render when the UI changes materially |
| 0.6.1 docs reconciliation + redeploy | Done (2026-09-02) | `CHANGELOG.md` 0.6.1; tag `v0.6.1` on `e13b84c`; [GitHub release](https://github.com/chquandogong/deployalign/releases/tag/v0.6.1); CI run `33596204513` green (3 jobs) | None — released 2026-09-02 |
| Practitioner validation | Not started | — | Recruit five interviews (Office Hours plan) |

## Work board

| Work item | Status | Owner | Dependency | Output |
| --- | --- | --- | --- | --- |
| Execution-origin field + UI | Done | Builder | — | `types.ts`, `compiler.ts`, `compileClient.ts`, `App.tsx`, tests |
| Model default → 3.7 Flash + thinking config | Done (unit-tested) | Builder | — | `server/gemini.ts`, `gemini.test.ts` |
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
| Release `v0.6.0` | Done | Orchestrator | — | Tag + [GitHub release](https://github.com/chquandogong/deployalign/releases/tag/v0.6.0), CI green (3 jobs) |
| Redeploy public demo from 0.6.1 (D-024) | Done | Owner + Orchestrator | Owner instruction | `deployalign-00006-h5c`, live receipt |
| Release `v0.6.1` (docs + redeploy) | Done | Orchestrator | — | Tag `v0.6.1` + [GitHub release](https://github.com/chquandogong/deployalign/releases/tag/v0.6.1) published 2026-09-02T05:48Z; CI run `33596204513` green (3 jobs); `pnpm dlx github:chquandogong/deployalign#v0.6.1 --version` → `0.6.1` |
| Practitioner validation | Not started | Owner | Recruiting | Five interviews; redacted corpora |

## Resume point

- Last verified checkpoint: 0.6.1 tree, all gates green (78 tests) on 2026-09-02; public demo `deployalign-00006-h5c` (0.6.1, gemini-3.7-flash) since 2026-09-02; rollback target `deployalign-00005-9vs`.
- Next safe action for a resuming agent: read the owner decision queue below; do **not** redeploy, upload video or edit Devpost without owner approval (the 2026-09-02 redeploy was owner-instructed). Code work can start on the un-automated API cases listed in `TEST_PLAN.md`.
- Local demo server for recordings runs on port `8091` (`8080` is used by another project on this machine).

## Decisions waiting on the owner

| ID | Decision | Default if silent |
| --- | --- | --- |
| D-016 | ~~Approve the 0.3 local-mode design~~ — approved ("go") and shipped in 0.3.0 | Done |
| D-017 | ~~Redeploy Cloud Run and verify a live receipt~~ — done 2026-08-26 | Done |
| D-018 | ~~Upload the demo video and swap the links~~ — v0.4.0 published 2026-08-26 (https://youtu.be/3sWnxibKU1Q) | Done |
| D-019 | ~~Synthesized narration voice vs. human recording~~ — keep synthesized (owner, 2026-08-26) | Done |
| D-023 | Confirm deferring npm publish until two practitioners have run their own documents (names `deployalign` / `@chquandogong/deployalign` unclaimed as of 2026-09-02) | Stay deferred; nothing published |

## Open assumptions

- A-11: validated 2026-08-26 on the public demo (live `gemini-3.7-flash` receipt).
- A-12: practitioners will share redacted artifacts (open). A-13: detectors generalise — partially validated on three synthetic corpora in 0.3.0 and six since 0.5.0; real-document precision unknown (R-22).
- A-05: valid only inside the demo (not a safety conclusion). A-06: category selected, impact fit unvalidated.
- A-01 … A-04, A-07, A-09, A-10 remain open from 0.1.0 (`../01-discovery/ASSUMPTIONS.md`).

## Top risks

| Risk | Likelihood | Impact | Response | State |
| --- | ---: | ---: | --- | --- |
| R-19 Default model retirement (`gemini-2.5-flash` retires on Vertex AI 2026-10-16) | Low | Medium | Closed 2026-08-26 (D-017); residual closed 2026-09-02 — the rollback target `deployalign-00005-9vs` runs `gemini-3.7-flash`, so no serving or rollback path depends on 2.5 Flash | Closed |
| R-20 New default model not live-verified | Low | Medium | Verify one live compile at deploy time; `GEMINI_MODEL` pin is the rollback | Closed 2026-08-26 |
| R-21 Translated READMEs drift from English | Medium | Low | Materialised 2026-09-02 (KO/ZH kept an "awaiting first live receipt" sentence); fixed the same day; recheck all three READMEs at every release | Accepted |
| R-22 Lexical detectors over/under-fire on real phrasing (English, first-pass Korean) | High | Medium | Findings quote sources and are labelled heuristic; six synthetic corpora since 0.5.0 (three in 0.3.0); add misfires to `corpora.test.ts` | Open — inherent to heuristics |
| R-23 Custom mode + live Gemini sends user text to the model | Medium | High | Both flags default off; forbidden on the public demo; UI states where text goes | Documented control |
| R-11 Diagnostics overfit to the bundled sample | Medium | High | detectors pass six synthetic corpora (three in 0.3.0, six since 0.5.0); measure on redacted documents | Mitigating |
| R-13 Public demo lacks auth/persistence/rollback | High | Critical | Keep synthetic-only, single instance, clear labels | Accepted for demo |
| R-01 Zero revenue / one user for the competition | High | Critical | Truthful record; await organizer | Accepted submission risk |
| R-04 Cloud cost/readiness inferred from deployment evidence; billing recheck after the reporting lag never recorded | Medium | High | Do not cite cost figures; recheck billing only if a claim needs it | Open evidence gate |

## Quality indicators

- Tests: 78/78 (14 domain · 15 general path · 9 corpora · 3 example presets · 2 export · 6 CLI · 11 Gemini validation · 18 API contract); CI additionally self-tests the Action on three example sets.
- Re-verified 2026-09-02 (0.6.1 tree): typecheck, lint, test 78/78 (8 files), build exited 0 on Node 24.19.0 / pnpm 11.19.0; `pnpm audit --prod` clean; `node bin/deployalign.mjs demo` exit 2.
- Browser QA (custom flow): passed 2026-08-26, zero console errors.
- Typecheck, lint, production build: passed 2026-08-26.
- Production HTTP smoke (0.2.0): passed 2026-08-26 (local).
- CI: green on the first post-fix run (`32931382972`, 2026-08-26) — quality job and container-image job both succeeded; the very first run failed on setup-node's package-manager cache probing for pnpm before Corepack, fixed in `cb6e32e`.
- Live model: `gemini-3.7-flash` verified on the public demo 2026-08-26 (D-017).

## Next actions

1. ~~Finish 0.6.1~~ — tagged, pushed and released 2026-09-02; CI run `33596204513` green.
2. **Owner: run the first practitioner session with `docs/05-ops/PILOT_KIT.md`** — this is the only item that produces evidence the code cannot.
3. Owner: confirm D-023 (npm publish deferral).
4. Feed every misfire from real (redacted) documents through the Detector-misfire template into `corpora.test.ts` (R-22).
5. Recruit five practitioners for the validation experiment described in `../01-discovery/OFFICE_HOURS.md`.
6. Check the hackathon result after 2026-09-25; no edits to the Devpost entry.
7. ~~Before 2026-10-16: rollback target off `gemini-2.5-flash`~~ — done 2026-09-02 (`deployalign-00005-9vs` runs `gemini-3.7-flash`).

## Review 2026-08-26 — video · git · submission

| Area | Checked | Result |
| --- | --- | --- |
| Video v0.4.0 (`3sWnxibKU1Q`) | Public player metadata | Public, playable, 1080p processed, 188 s; caption tracks `en`, `ko`, `zh-Hans` (+ auto `en`); description carries chapters and the repository link; 16 tags; category changed from "People & Blogs" to "Science & Technology" via Studio during this review |
| Video v0.1.0 (`QOPgHHAWOBA`) | Public player metadata | Public, playable, 170 s; kept as the submission record |
| Video ↔ product drift | Scene list vs 0.6.0 UI | Video shows the 0.4.0 UI; 0.6.0 only adds the "Load an example" row in the editor — no re-render needed |
| Git | Tags, releases, changelog, version, ancestry | `v0.1.0`–`v0.6.0` all on `main`, each with a changelog section and a GitHub release (`v0.1.0` created retroactively as a historical release); `package.json` = `0.6.0`; working tree clean; `pnpm audit --prod` clean; CI green on the last run (3 jobs) |
| Links | 99 relative + 24 external in READMEs/docs | All resolve (only `http://localhost:5173` is unreachable by design) |
| Public demo | `/api/health` | `version 0.3.0`, `liveGemini true`, `model gemini-3.7-flash`, `customArtifacts false` |
| Submission | Devpost page | Live: title, tagline, Try-it-out links, Built With, team; the entry references the 0.1.0 video by design. Hackathon page: **"This hackathon has ended — Winners announced soon"** (listed end date 2026-09-25). No edits are possible or intended after the deadline |
| Historical docs | Header dates | Discovery/submission records keep `2026-08-17` on purpose (records, not living docs); `FEASIBILITY_REPORT.md` date bumped because one bullet was corrected |

## Review 2026-09-02 — repository · demo · submission

| Area | Checked | Result |
| --- | --- | --- |
| Local gates | `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm audit --prod`, `node bin/deployalign.mjs demo` on Node 24.19.0 / pnpm 11.19.0 | All four gates exited 0; 78/78 tests across 8 files; audit "No known vulnerabilities found"; `demo` exits 2 as designed |
| Git | Sync, working tree, tags, releases, CI | Local `main` == `origin/main` (`3aee012` before today's work); working tree clean; seven tags `v0.1.0`–`v0.6.0` on origin, each with a GitHub release (all published 2026-08-26; `v0.1.0` created retroactively as the historical submission state); CI on `main`: runs `32951993001` (v0.6.0 release push) and `32952371781` (`3aee012`) each succeeded with 3 jobs: "Typecheck · lint · test · build", "Container image builds", "Action self-test on the examples" |
| Public demo | `/api/health` | Revision `deployalign-00005-9vs` (tag `v0.3.0`, deployed 2026-08-26): `version 0.3.0`, `liveGemini true`, `model gemini-3.7-flash`, `customArtifacts false` — re-confirmed 2026-09-02 before the redeploy |
| Redeploy (D-024) | `scripts/deploy_cloud_run.sh` from a clean worktree at commit `a6f9050`; `/api/health`, `/api/compile`, root, licence notice, `gcloud run services describe` | Revision `deployalign-00006-h5c` at 100% traffic (created 2026-09-02T05:23Z); health `version 0.6.1 · liveGemini true · model gemini-3.7-flash · customArtifacts false`; compile HTTP 200 `provider gemini-vertex` · `executionOrigin server` · `mode fixture`, receipt "SUCCESS — gemini-3.7-flash classified 3 source statements."; root HTTP 200 with CSP and `no-store`; `/third-party-licenses.txt` HTTP 200 / 3,462 bytes; env, service account, secret binding, 1 CPU / 512 MiB, concurrency 20, 60 s timeout, max instances 1 unchanged; `deployalign-00005-9vs` and `deployalign-00004-wgb` retained |
| Videos | oEmbed | Both public: `3sWnxibKU1Q` (v0.4.0 walkthrough) and `QOPgHHAWOBA` (0.1.0 submission record) |
| Submission | Devpost project page + hackathon page | Project page live and "Submitted"; hackathon page reads "This hackathon has ended" and "Winners announced soon" (listed end date 2026-09-25); no result recorded anywhere |
| Release `v0.6.1` | Tag, GitHub release, CI, `pnpm dlx` | Annotated tag `v0.6.1` on `e13b84c` pushed to origin; [release](https://github.com/chquandogong/deployalign/releases/tag/v0.6.1) published 2026-09-02T05:48Z and marked latest; CI run `33596204513` on `e13b84c` succeeded with 3 jobs; `pnpm dlx github:chquandogong/deployalign#v0.6.1 --version` printed `0.6.1` in about six seconds |
| npm | Registry lookup | `deployalign` and `@chquandogong/deployalign` both unclaimed (E404) on 2026-09-02; D-023 (defer publish) still pending owner confirmation |
| Docs | Cross-file consistency | Contradictions found, fixed in 0.6.1: R-19/R-20 shown Open here after the register closed them; release `v0.6.0` shown "In progress" after it was published; stale 60/75 test counts where 78 is current; `RUNBOOK.md` citing the 0.2.0 image and `general.test.ts` for misfires (the target is `corpora.test.ts`); README KO/ZH kept an "awaiting first live receipt" sentence that README.md had dropped; D-018 referenced without its own entry; D-023 absent from every owner-decision queue; a dangling §1.6 cross-reference |

## Links

- [Project brief](PROJECT_BRIEF.md) · [Roadmap](ROADMAP.md)
- [Feasibility report](../01-discovery/FEASIBILITY_REPORT.md) · [Assumptions](../01-discovery/ASSUMPTIONS.md)
- [Decision log](../02-decisions/DECISION_LOG.md)
- [Specification](../03-spec/SPEC.md) · [Architecture](../03-spec/ARCHITECTURE.md)
- [Test plan](../04-quality/TEST_PLAN.md) · [Risk register](../04-quality/RISK_REGISTER.md)
- [Runbook](../05-ops/RUNBOOK.md) · [Ship checklist](../05-ops/SHIP_CHECKLIST.md) · [Retro](../05-ops/RETRO.md)
- [Demo script](../submission/DEMO_SCRIPT.md) · [YouTube metadata](../submission/YOUTUBE_METADATA.md) · [Submission evidence (historical)](../submission/EVIDENCE_CHECKLIST.md)
