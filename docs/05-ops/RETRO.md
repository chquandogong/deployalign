# Prototype Cycle Retro

> Status: Public demo cycle complete; submission decision pending · Date: 2026-08-17 · Owner: Project team

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
- May/June/July/August/total and related-party revenue are $0; COGS/marketing/other/total expenses are $0. One-page zero-revenue/P&L PDFs are prepared and visually verified; form uploads remain.
- The public demo is not a customer production operation and has no auth, persistence, tenancy, durable audit, or rehearsed rollback.
- The latest private billing capture showed an Aug 1–15 current report of ₩0 and remaining free-trial credits, but its explicit warning that reporting can take hours or more than 24 hours prevents treating that value as final challenge expense/P&L.
- UI integration and local/deployed live-browser QA are complete.
- Final typecheck, lint, 13/13 tests, production build, and direct production-server/token smoke checkpoints passed.
- Cloud Build successfully built the actual container and Cloud Run revision `deployalign-00003-tlc` deployed it.
- No actual Claude independent review occurred.
- The public repository and Cloud Run demo are available. The verified 170-second 1080p H.264/AAC video with 74 captions is public at `https://youtu.be/QOPgHHAWOBA`; Devpost final submission is not completed.

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
4. Recheck billing after the documented lag window and upload the prepared $0 revenue/P&L evidence.
5. Design identity, persistence, audit, privacy, and observability only if a real pilot warrants them.
6. Obtain a genuinely independent model/human review if cross-model validation will be claimed.
7. Add the verified public video to the form, populate/review remaining fields, and reassess the $0-revenue requirement before final submission.
