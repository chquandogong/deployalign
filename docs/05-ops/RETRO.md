# Prototype Cycle Retro

> Status: Interim; update after verified build/submission decision · Date: 2026-08-17 · Owner: Project team

## What was done

- Narrowed the concept to cross-document commitment drift.
- Implemented typed synthetic artifacts, commitment graph, six diagnostics, a three-field patch, a review state transition, incremental target compilation, and receipts.
- Added an opt-in Gemini adapter with source-quote/schema checks and a deterministic fallback.
- Added API bounds, basic headers, in-memory rate limiting, unit-test cases, Docker packaging, and a structured documentation/evidence package.

## What went well

- The product's strongest idea became specific: compile decisions and impacts, not generic summaries.
- Synthetic data kept the prototype repeatable and avoided unsupported customer-data handling.
- Deterministic rules make the gate and incremental rebuild behavior testable.
- Documentation forced a clean separation between implementation evidence and challenge/business claims.

## What was learned and corrective actions

- A stable network fallback can make a demo look healthier than the API. Corrective action: add execution-origin metadata/banner and API-failure tests; provider alone is insufficient.
- A “human approval” button is not identity, authorization, or audit. Corrective action: call it a demo review and design secure approval only after demand validation.
- Challenge fit is primarily blocked by business evidence, not code polish. Corrective action: treat user/revenue/GCP evidence as separate workstreams with hard no-fabrication checks.
- Compile/review provenance now survives through a one-hour HMAC token. Corrective action for production remains: use Secret Manager, identity, replay protection, and durable audit; the signed token alone is not authorization.
- Google account/project/billing access was confirmed, clearing the earlier reauthentication blocker. Corrective action: keep account readiness separate from API, IAM, deployment, live-call, log, and cost proof.

## Failures and incomplete work

- No real users, interviews, testimonials, revenue, expenses, customers, or production operation were established.
- No successful live Gemini/Vertex call or Google Cloud deployment was evidenced.
- Required Google APIs, IAM/service identity, Secret Manager binding, Cloud Run deployment, runtime logs, and live cost evidence remain pending human-approved external actions.
- UI integration is complete; final live-browser visual QA remains pending.
- Final typecheck, lint, 13/13 tests, production build, and direct production-server/token smoke checkpoints passed.
- Docker image verification was not run because the environment had no Docker engine.
- No actual Claude independent review occurred.
- No repository publication, public video, or Devpost final submission was performed by this documentation task.

## Current metrics

- Synthetic artifacts: 3.
- Diagnostic rules demonstrated: 6.
- Proposed patch fields: 3.
- Target documents: 3.
- Rebuilt `DEC-014`-linked sections after demo review: 6.
- Unrelated canonical baseline sections reused within the approved compile: 3.
- Unit-test cases authored: 13.
- Verified users/revenue/production deployments/live Gemini calls: 0 evidenced.

## Deferred improvements

1. Validate the problem with practitioners before expanding scope.
2. Complete live-browser visual/accessibility QA and archive non-sensitive local evidence.
3. Make fallback and the compile-to-review provider transition explicit.
4. With human approval, configure APIs/IAM/Secret Manager, deploy the synthetic demo, and verify a live Gemini call with redacted logs and cost evidence.
5. Design identity, persistence, audit, privacy, and observability only if a real pilot warrants them.
6. Obtain a genuinely independent model/human review if cross-model validation will be claimed.
7. Reassess challenge submission only against authentic evidence and the latest official rules.
