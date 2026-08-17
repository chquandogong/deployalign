# DeployAlign Project Brief

> Status: Working draft · Date: 2026-08-17 · Owner: DeployAlign team (Codex-assisted)

## One-line summary

DeployAlign is a synthetic proof of concept for compiling conflicting customer, sales, and engineering statements into an evidence-linked deployment decision, a bounded semantic patch, and reviewable downstream documents.

## Problem

Industrial deployment teams routinely carry the same intent across discovery notes, proposals, engineering constraints, test plans, and runbooks. Ambiguous promises such as “all materials,” “every area,” or “fully autonomous” can become contractual or operational commitments before evidence and acceptance criteria exist.

DeployAlign tests a narrow intervention: make those conflicts explicit before a field-deployment gate advances.

## Intended users

- Application and deployment engineers reviewing feasibility.
- Solutions sales teams translating discovery into a statement of work.
- Customer facilities owners approving a bounded pilot.

These remain target-persona assumptions. The entrant confirms 1 actual user and 0 paying users, but no user interview, testimonial, customer contract, measured outcome, or production usage is evidenced; the single user does not validate the target personas by itself.

## Smallest useful wedge

Given exactly three text artifacts—a customer note, a sales proposal, and an engineering review—the prototype:

1. Represents source statements as typed commitment-graph nodes.
2. Emits deterministic blockers and warnings with source quotes.
3. Proposes a three-field scope patch from unbounded language to five named analytes, 12 mapped AOIs, and supervised Phase 1.
4. Requires an explicit review action before advancing the demo baseline.
5. Rebuilds the six sections linked to `DEC-014` and, within the same approved compile, reuses three unrelated canonical baseline sections without reconstruction. Their FNV-1a32 values are non-cryptographic change fingerprints, not integrity hashes.

## Why AI is present

Gemini is a quote-constrained extraction front end. In the verified Cloud Run demo, `gemini-2.5-flash` through Vertex AI supplies exactly three validated exact-quote `AI_DRAFT` candidates and a bounded rationale. The safety-relevant graph, diagnostics, gate state, impact analysis, and target generation remain deterministic TypeScript. When the live model is disabled, unavailable, or rejected by validation, the product uses a deterministic demo result.

This fallback is intentional for a stable demonstration, but it is not evidence of a live AI-operated business.

## Current implementation evidence

- TypeScript domain model for artifacts, nodes, edges, diagnostics, patches, compiled targets, impact sets, and execution receipts.
- Responsive result-driven React interface for synthetic sources, graph/node inspection, diagnostics, patch simulation, four-state impact matrix, three targets, source map, and receipts.
- Deterministic compiler with six diagnostic codes and a stable decision ID.
- Express endpoints for health, compile, and demo approval.
- Opt-in Gemini Developer API or Vertex AI path, source-quote/schema validated; the deployed demo uses Vertex AI.
- Browser client helper with a 60-second timeout and a network-failure fallback restricted to the exact synthetic fixture.
- Thirteen unit-test cases in `src/domain/compiler.test.ts`.
- A one-hour HMAC-SHA256 compile-provenance token that carries validated AI evidence through the demo review transition.
- Docker packaging for a Node 24 runtime.

Verified on 2026-08-17 after the response-isolation and strict-fixture fixes: typecheck, lint, 13/13 tests, and the production build exited 0; the production audit reported zero vulnerabilities. A direct production-server smoke verified root/CSP/no-store behavior, immutable hashed assets, and compile-token valid/tampered/extra-segment/expired cases. Cloud Build then built the actual container and deployed it successfully.

Also verified on 2026-08-17: the public synthetic demo is running at [deployalign-1007800160926.asia-northeast3.run.app](https://deployalign-1007800160926.asia-northeast3.run.app) as Cloud Run revision `deployalign-00003-tlc` in project `project-55fbcfd2-0ad6-4c99-a25`, region `asia-northeast3`. It uses the dedicated runtime service account `deployalign-runner@project-55fbcfd2-0ad6-4c99-a25.iam.gserviceaccount.com`, a stable HMAC secret from Secret Manager, and `gemini-2.5-flash` on Vertex AI. The service is public, min instances 0/max 1, 1 CPU/512 MiB, 60-second timeout, and concurrency 20.

The deployed browser flow and redacted logs evidence a successful `gemini-vertex` compile, three exact-quote `AI_DRAFT` statements, a `SUCCESS` AI receipt, preserved signed provenance through review, `HOLD` → `CONDITIONAL PILOT`, and six rebuilt/three unchanged target sections. Logs include `compile_completed` for version 1 with six unresolved diagnostics and `patch_approved` for version 2. This is a public synthetic demo, not an evidenced customer production system. Separately, the entrant confirms 1 actual user, 0 paying users, $0 total/monthly/related-party revenue, and $0 COGS/marketing/other/total expenses. The 2:50 public demo video is verified at [youtu.be/QOPgHHAWOBA](https://youtu.be/QOPgHHAWOBA). No customer, testimonial, measured impact, or completed Devpost entry is established.

Official Vertex AI Model Garden Monitoring evidence shows a `gemini-2.5-flash` row plus model-request and token-count graphs in the last-hour window. A separate private billing capture showed an Aug 1–15 current report of ₩0 and remaining free-trial credits, alongside an explicit warning that costs can take hours or more than 24 hours to appear. The entrant confirms the current challenge P&L as $0 revenue, $0 expenses, and $0 net; the billing screen still warrants a final lag-aware recheck before evidence upload.

## Scale envelope

| Dimension | Current prototype | Explicit limit |
| --- | --- | --- |
| Source artifacts | The 3 disclosed synthetic artifacts | Server rejects any count, metadata, or content change |
| Artifact size | Short text | 8,000 characters each; request body 64 KB |
| Compile frequency | Single-instance demo | 6 compile attempts per 10 minutes per observed IP; counter is process-local |
| Persistence | None | State and rate limits reset on process restart |
| Tenancy/authentication | None | Not suitable for customer or production data |
| Provenance token | HMAC-signed, one-hour lifetime | Local default secret changes on restart; production requires a stable ≥32-byte secret |
| Concurrency | Public single-instance demo | Cloud Run max instances 1; no shared rate-limit or durable state across instances |

## Success criteria

### Prototype success

- Every diagnostic quote is present in its referenced artifact.
- The pre-approval gate remains `HOLD` with four unresolved blockers.
- The demo review produces `CONDITIONAL PILOT`, never unconditional `PASS`.
- Six `DEC-014`-linked sections are rebuilt; three unrelated canonical sections from that compile's fresh baseline are reused without reconstruction and retain their FNV-1a32 fingerprints.
- Synthetic, fallback, and approval semantics are visible and not overstated.

### Business and challenge success

- Real target users confirm the review problem and use the product in an authentic workflow.
- A deployed application performs at least one verifiable Gemini API call. **Met for the public synthetic demo.**
- Real usage, revenue, expenses, and customer evidence meet the official challenge rules.
- All external publication and submission steps receive human approval.

The deployed Gemini-call criterion and public-video criterion are met for the synthetic demo. Entrant/user/financial fields and Moderate learning level are confirmed, but one user, no paying users, and $0 revenue do not establish business viability or measured category impact; evidence uploads and final entrant review remain unresolved.

## Non-goals for this prototype

- Controlling a robot or authorizing a real industrial deployment.
- Replacing deployment, safety, legal, or commercial reviewers.
- Inventing acceptance thresholds, pricing, schedules, measurements, customers, or financial results.
- Claiming production readiness, customer operation, business traction, or competition eligibility. The verified claim is limited to a public Google Cloud demo deployment and live Vertex call.

## Human approval gates

- Approving any real deployment decision or contract language.
- Uploading source code, evidence, credentials, financial records, or personal data.
- Materially changing or replacing the published demo video or cloud deployment.
- Saving or finalizing the Devpost submission.

The local demo button simulates a review boundary; it is not authenticated approval for a real organization.
