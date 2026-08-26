# Retro

> Status: Two cycles recorded — 0.1.0 submission (2026-08-17) and 0.2.0 post-submission (2026-08-26) · Date: 2026-08-26 · Owner: Project team

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
