# Retro

> Status: Eight cycles recorded — 0.1.0 submission (2026-08-17); 0.2.0, 0.3.0, 0.4.0, 0.4.1, 0.5.0, 0.6.0 (all 2026-08-26); 0.6.1 (2026-09-02) · Date: 2026-09-02 · Owner: Project team

## Cycle 0.6.1 — documentation reconciliation and redeploy (2026-09-02)

### What was done

- A week after the 0.6.0 release, a review of the repository, live demo, videos and Devpost page found the code, tags, releases, videos and Devpost entry consistent, the public demo one release line behind (`v0.3.0` while the repository was at 0.6.0), and plenty of drift in the documents: the dashboard's own tables contradicted its text (R-19/R-20 "Open", `v0.6.0` "In progress"), test counts read 60/75 where 78 was current, the runbook described deploying "the 0.2.0 image" and pointed misfires at the wrong test file, the Korean and Chinese READMEs kept a sentence the English one had dropped (R-21 materialised), D-018 had no entry, and D-023 — the only pending owner decision — was missing from every owner queue. All were corrected in one docs-only patch release; D-018 got its entry, D-024 records the redeploy, R-24/R-25 record the npm-name and per-run-install residuals.
- On the owner's instruction the public demo was redeployed from the 0.6.1 tree (`deployalign-00006-h5c`): health `version 0.6.1`, live `gemini-3.7-flash` receipt, identity and limits preserved. The rollback target is now a 3.7-flash revision, which closes the R-19 residual.

### What went well

- Verifying before summarising: re-running the gates and reading the live health, releases and CI runs first meant every corrected sentence had a dated observation behind it.
- The deploy script's describe → deploy → verify shape made the redeploy a single exit-code-checked step from a clean worktree.

### What was learned and corrective actions

- **A dashboard with two voices drifts in a week.** The Top-risks and Progress tables were edited less often than the Current-state bullets. Corrective action: the dashboard now carries a dated review table per release, and the 0.6.1 ship checklist re-reads all three READMEs.
- **Pending decisions must live in the queue, not only in their entry.** D-023 was invisible to a resuming agent. Corrective action: every `proposed` decision gets a live row in all three owner-queue tables the day it is written.

### Failures and incomplete work

- Still zero practitioner sessions; the pilot kit has been ready since 0.5.0.
- D-023 (npm publish) still awaits the owner's confirmation; the names remain unclaimed.
- Ops items unchanged: no rehearsed rollback, no secret scan, no monitoring or incident path for the demo.

### Metrics

- Tests: 78 → 78 (no code change). Public demo: `v0.3.0` → 0.6.1 (`deployalign-00005-9vs` → `deployalign-00006-h5c`), live-verified.

### Deferred to the next cycle

1. Run the pilot (owner) and file misfires.
2. Owner confirmation of D-023.
3. Check the hackathon result after 2026-09-25.

## Cycle 0.6.0 — example presets in the editor (2026-08-26)

- Added a "Load an example" row to the local-mode editor with the three bundled sets, backed by `src/domain/examples.ts` and a test that keeps it identical to `examples/` and to the documented verdicts. Browser QA loaded the Korean preset and compiled it (six diagnostics, `CUSTOM` chip, no console errors).
- Learned: one source of truth for example text (TS module mirrored to files by a test) beats keeping two copies in step by hand.
- Deferred: npm publish (D-023, proposed) until the pilot confirms the CLI shape.

## Cycle 0.5.0 — an Action, examples, and the pilot kit (2026-08-26)

### What was done

- Wrapped the CLI as a composite GitHub Action with typed outputs and a job summary; CI now runs it on three bundled example sets and asserts the verdicts.
- Added `examples/` (EN fail, EN pass, KO fail) so anyone can try the compiler in one command.
- Fixed two detector gaps the new corpora exposed: negated quantifiers ("will not cover every ward", "…않습니다") and Korean preference narrowing (`사족 사륜 로봇`).
- Wrote the practitioner pilot kit and a Detector-misfire issue template; recorded D-019 (synthesized voice kept) and D-022 (Action design); bumped CI actions to current majors.

### What went well

- The examples double as CI fixtures: the Action is exercised end-to-end on every push, so drift in Studio-style selectors cannot happen here — the failure surface is our own CLI, which is tested.
- Every detector change again started as a corpus sentence; both fixes landed with the affirmative counter-examples asserted in the same test.

### What was learned and corrective actions

- **Negation was the first thing a real proposal would have tripped over** ("will not cover every ward"). Corrective action: the negation guard looks back three tokens in English and at the clause-final predicate in Korean; more forms will come from the pilot.
- **Shipping the kit is not running the pilot.** Corrective action: the dashboard's next action is now explicitly the owner's first session, not more code.

### Failures and incomplete work

- Zero practitioner interviews so far; all corpora remain synthetic.
- The Action installs runtime dependencies on every run (seconds, but not free); a published package with a bundled CLI would remove that.
- Korean support remains lexical.

### Metrics

- Tests: 72 → 75. Corpora: 5 → 6 (negation). Example sets: 0 → 3. Distribution surfaces: UI, API, CLI → + GitHub Action.

### Deferred to the next cycle

1. **Run the pilot** (owner) and file misfires.
2. Publish the package (npm) with a bundled CLI once the pilot confirms the CLI shape — a gated publication.
3. Korean morphology beyond particles if the pilot's Korean documents demand it.

## Cycle 0.4.0 — a command, a second language, and the public demo on the current model (2026-08-26)

### What was done

- Shipped `deployalign compile … --fail-on blocker` (tsx-backed bin, role detection, outputs, exit codes) with 6 tests.
- Added first-pass Korean: Hangul tokenisation, particle stripping, native numerals and attached counters, predicate boundaries, noun-before-quantifier phrases, Korean cue lists; a Korean Raman corpus reproduces the six diagnostics and a verbatim Korean patch.
- Added drone and hospital corpora, which caught five real detector bugs before any user did.
- Redeployed the public demo from the clean `v0.3.0` tag on `gemini-3.7-flash` and verified a live receipt (D-017); closed R-19/R-20.

### What went well

- Writing the corpora as tests first exposed each false assumption in one run (bounded `all five`, `Phase 2` labels, `attended operation for the…`, "verified data" typed as a test, number-free unverified statements, Korean clauses dropped by an ASCII-only letter check, `12곳의` counters, quantifier-after-noun). Every fix landed with a test.
- Deploying from a clean worktree kept uncommitted 0.4 work out of the public build; the deploy script's built-in live-receipt check made "did Gemini actually run" a hard exit code rather than a judgement.

### What was learned and corrective actions

- **ASCII assumptions hide everywhere** — the sentence splitter's lookahead and the "has letters" check both excluded Hangul. Corrective action: every text predicate in `text.ts`/`extract.ts` now names its script ranges explicitly, and the Korean corpus is a permanent regression.
- **Korean word order differs in the one place that matters** — `시설 전체를` puts the quantifier after its noun. Corrective action: quantifier-with-particle rule; more forms will come from real documents, not from guessing.
- **Deploy verification belongs in the script, not the checklist.**

### Failures and incomplete work

- Korean support is lexical only; preference narrowing and honorific/spacing variants are untested.
- No practitioner has run a document; the corpora are still synthetic.
- The public demo runs `v0.3.0`; 0.4.0 adds only local features, so it was not redeployed.

### Metrics

- Tests: 60 → 72 (7 files). Corpora: 3 → 5 (incl. Korean). Languages: 1 → 2 (first pass).
- Public demo: `gemini-2.5-flash` (0.1.0) → `gemini-3.7-flash` (0.3.0), live-verified.

### Deferred to the next cycle

1. Practitioner interviews and redacted-document corpora (English and Korean).
2. Wrap the CLI as a GitHub Action; consider publishing the package once stable.
3. Korean preference narrowing and morphological edge cases from real text.
4. D-018/D-019: video v0.2.0 upload and voice choice remain owner gates.

## Cycle 0.3.0 — the tool compiles your own documents (2026-08-26)

### What was done

- Built the general compiler: verbatim clause extraction with line numbers, role-aware lexical typing into the eleven node types, DA-001–DA-006 as detectors, a patch whose values are copied from engineering clauses, generic targets with the same incremental-rebuild mechanics.
- Added a local-only API mode (`ALLOW_CUSTOM_ARTIFACTS`) with review tokens bound to an artifact hash, a document editor gated by health, and Markdown/JSON export.
- 38 → 60 tests; headless-browser QA of the full custom flow; screenshots for the docs.
- Installed a user-space gcloud and wrote the gated redeploy script for D-017.

### What went well

- Writing the acceptance tests before tuning the lexicon exposed each false assumption in one run: newline boundaries, the autonomy cue swallowing the next noun phrase, the coverage enumeration typed by its adjective, hyphenated number-adjectives counted as enumerations, a DA-002 warning on a pricing sentence. Every fix landed in a test.
- The fixture stays byte-identical through the canonical compiler, so nothing from 0.2.0 (video, screenshots, README claims) went stale.
- Keeping replacement values verbatim ("Twelve critical AOIs", not "12") made the rationale literally true: every patch value can be found in the engineering text.

### What was learned and corrective actions

- **"Byte-for-byte" was the wrong acceptance criterion** for a general path against hand-authored canonical nodes; the roadmap now states the criterion that was actually testable (same codes/severities/patch categories/gate behaviour). Corrective action: write acceptance criteria as assertions before promising them in a roadmap.
- **Heuristics need a corpus discipline.** Three synthetic corpora (fixture, clean warehouse, unsupported plant) caught the false positives that mattered; real phrasing will find more. Corrective action: every misfire reported by a practitioner becomes a corpus sentence first (CONTRIBUTING).
- **Wording is part of the contract.** The provider badge said "fixture fallback" in custom mode until the screenshot was actually looked at. Corrective action: mode-aware strings are now part of the UI review checklist.

### Failures and incomplete work

- No live `gemini-3.7-flash` call and no redeploy: the build machine has no Google credentials; gcloud is installed but `gcloud auth login` is an owner action (D-017).
- Gemini is not extended to classify all statements in custom mode; it still returns three representative candidates.
- English-only detectors; Korean documents will yield few nodes.
- Still no practitioner has run a real document through it.

### Metrics

- Tests: 38 → 60 (5 files). Detectors generalised: 0 → 6. Corpora: 1 → 3.
- Browser QA: 1 scripted run, 0 console errors, export verified.

### Deferred to the next cycle

1. D-017 redeploy after owner auth (before 2026-10-16).
2. 0.4 CLI/CI mode on the general compiler.
3. Korean cue lists and clause splitting for `.`/`다.` sentences.
4. Practitioner interviews and redacted-document corpora (R-22).

## Cycle 0.2.0 — post-submission hygiene and honesty (2026-08-26)

### What was done

- Labelled execution origin on every compile result and surfaced it in the UI (closes R-05, open since 0.1.0).
- Moved the default model to `gemini-3.7-flash` with automatic thinking configuration; kept `GEMINI_MODEL` as the pin.
- Extracted `createApp()` and wrote the API contract tests the 0.1.0 test plan had only listed; made the Gemini validator a pure, tested function. 13 → 38 tests.
- Added CI (SHA-pinned actions), `CONTRIBUTING.md`, `SECURITY.md` with private vulnerability reporting, `.nvmrc`, a changelog and a roadmap with measurable "useful" criteria.
- Rewrote the README around the problem and the mechanism, in English, Korean and Chinese.
- Rebuilt the demo video with a reproducible narration-first pipeline committed under `scripts/demo-video/`.

### What went well

- The 0.1.0 documentation was precise enough that every stale statement could be located and corrected rather than rewritten from memory.
- Splitting the server into a factory made the HTTP contract testable in minutes and silenced the log noise in tests through a `logger` option.
- Narration-first recording produced a 2:57 video on the second take; the first take ran 3:25 because scene setup happened between holds instead of during them — the fix was structural (act while the line plays), not more trimming.

### What was learned and corrective actions

- **A default that expires is a defect.** Model retirement dates now belong in the risk register with an owner and a deadline (R-19). Corrective action: check Google's deprecation pages at the start of every cycle.
- **Provider and origin are different facts.** Conflating "which engine" with "which process" produced the R-05 ambiguity. Corrective action: any new disclosure field must name exactly one fact.
- **Environment quirks cost more than code.** The build machine had Node 20 (pnpm 11 needs ≥ 22.13), no gcloud, no Docker socket access, and port 8080 was taken by another project. Corrective action: `.nvmrc` + `engines` in `package.json`, and the runbook now states the Node requirement and its failure signature.
- **Publication stays gated even when the owner asks for "the video to be updated".** The render is reproducible and local; the upload, the Cloud Run redeploy and the Devpost edit remain explicit owner decisions (D-017, D-018).

### Failures and incomplete work

- No live `gemini-3.7-flash` call was made; the new default is unit-tested only (R-20, A-11).
- The public demo still runs 0.1.0 with `gemini-2.5-flash` (R-19).
- `.env.example` still pins the old model; the build environment's permission policy blocked edits to `.env*` files, so the fix is documented in the CHANGELOG and READMEs for the owner.
- Video v0.2.0 is not uploaded; the container image was not built locally (CI will build it on push).
- Still no practitioner interview, redacted sample or measured outcome.

### Metrics

- Tests: 13 → 38. Test files: 1 → 3.
- Documented functional requirements: FR-01–FR-18 → FR-01–FR-22.
- README languages: 1 → 3. Repo hygiene files added: 5 (`CONTRIBUTING`, `SECURITY`, `CHANGELOG`, `.nvmrc`, CI).
- Demo video: 170 s (0.1.0, Cloud Run + live 2.5 Flash) → 177 s (0.2.0, local deterministic build, reproducible pipeline).

### Deferred to the next cycle

1. D-017 redeploy and live receipt, before 2026-10-16.
2. D-016 decision and the 0.3 local custom-artifact mode, starting with the fixture-reproduction acceptance test.
3. D-018/D-019 video publication and voice choice.
4. Five practitioner interviews (unchanged from 0.1.0 — still the most important open item).
5. Remaining un-automated API cases: oversize artifact, body > 64 KB, expired-token path, Gemini failure through HTTP.

## Cycle 0.1.0 — prototype and submission (2026-08-17)


## What was done

- Narrowed the concept to cross-document commitment drift.
- Implemented typed synthetic artifacts, commitment graph, six diagnostics, a three-field patch, a review state transition, incremental target compilation, and receipts.
- Added an opt-in Gemini adapter with source-quote/schema checks and a deterministic fallback.
- Added API bounds, basic headers, in-memory rate limiting, unit-test cases, Docker packaging, and a structured documentation/evidence package.
- Published the source repository, built the container with Cloud Build, and deployed the bounded synthetic demo to Cloud Run with Vertex AI and Secret Manager.

## What went well

- The product's strongest idea became specific: compile decisions and impacts, not generic summaries.
- Synthetic data kept the prototype repeatable and avoided unsupported customer-data handling.
- Deterministic rules make the gate and incremental rebuild behavior testable.
- Documentation forced a clean separation between implementation evidence and challenge/business claims.

## What was learned and corrective actions

- A stable network fallback can make a demo look healthier than the API. Corrective action: add execution-origin metadata/banner and API-failure tests; provider alone is insufficient.
- A “human approval” button is not identity, authorization, or audit. Corrective action: call it a demo review and design secure approval only after demand validation.
- Challenge fit is primarily constrained by very early business evidence, not code polish. Corrective action: disclose 1 user, 0 paying users, and exact $0 financials without converting them into traction.
- Compile/review provenance now survives through a one-hour HMAC token. Corrective action for production remains: use Secret Manager, identity, replay protection, and durable audit; the signed token alone is not authorization.
- Cloud Run/Vertex/Secret Manager/runtime identity, a deployed live call, and official request/token monitoring were verified. Corrective action: keep this bounded demo evidence separate from production-readiness, real-user, and final-cost claims.

## Failures and incomplete work

- Entrant confirms 1 actual user and 0 paying users; no interview, testimonial, customer, measured outcome, or production operation is established.
- May/June/July/August/total and related-party revenue are $0; COGS/marketing/other/total expenses are $0. One-page zero-revenue/P&L PDFs are saved in Devpost.
- The public demo is not a customer production operation and has no auth, persistence, tenancy, durable audit, or rehearsed rollback.
- The latest private billing capture showed an Aug 1–15 current report of ₩0 and remaining free-trial credits, but its explicit warning that reporting can take hours or more than 24 hours prevents treating that value as final challenge expense/P&L.
- UI integration and local/deployed live-browser QA are complete.
- Final typecheck, lint, 13/13 tests, production build, and direct production-server/token smoke checkpoints passed.
- Cloud Build successfully built the license-compliance commit `d5f9f33180a1edbdfeb8e5d4b8775a98643fd28c` and deployed current Cloud Run revision `deployalign-00004-wgb` at 100% traffic; public health and the HTTP 200/3,462-byte license notice were verified.
- No actual Claude independent review occurred.
- The public repository and Cloud Run demo are available. The verified 170-second public video is at `https://youtu.be/QOPgHHAWOBA`. Devpost confirmed `Submitted` and `5/5 steps done` at `https://devpost.com/software/test-q0h69v` after explicit approval, exact OSS disclosure, terms acceptance, and Submit. This does not establish eligibility or an award.

## Current metrics

- Synthetic artifacts: 3.
- Diagnostic rules demonstrated: 6.
- Proposed patch fields: 3.
- Target documents: 3.
- Rebuilt `DEC-014`-linked sections after demo review: 6.
- Unrelated canonical baseline sections reused within the approved compile: 3.
- Unit-test cases authored: 13.
- Verified deployed live Gemini calls: at least 1 bounded synthetic-demo flow evidenced.
- Verified user counts: 1 actual, 0 paying.
- Entrant-confirmed revenue/expenses: $0/$0; customer production operations: 0 evidenced.

## Deferred improvements

1. Validate the problem with practitioners before expanding scope.
2. Preserve and periodically recheck non-sensitive local/cloud evidence and accessibility disclosures.
3. Make fallback and the compile-to-review provider transition explicit.
4. Recheck billing after the documented lag window and confirm the saved $0 revenue/P&L evidence remains attached.
5. Design identity, persistence, audit, privacy, and observability only if a real pilot warrants them.
6. Obtain a genuinely independent model/human review if cross-model validation will be claimed.
7. Preserve the submission confirmation and exact OSS disclosure; monitor links/billing and keep the accepted Git-identity/Microsoft Mark risks explicit in any future edit.
