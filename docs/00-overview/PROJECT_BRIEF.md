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

These are target-persona assumptions, not verified users. No user interviews, pilots, customer contracts, or production usage are evidenced in this repository.

## Smallest useful wedge

Given exactly three text artifacts—a customer note, a sales proposal, and an engineering review—the prototype:

1. Represents source statements as typed commitment-graph nodes.
2. Emits deterministic blockers and warnings with source quotes.
3. Proposes a three-field scope patch from unbounded language to five named analytes, 12 mapped AOIs, and supervised Phase 1.
4. Requires an explicit review action before advancing the demo baseline.
5. Rebuilds the six sections linked to `DEC-014` and, within the same approved compile, reuses three unrelated canonical baseline sections without reconstruction. Their FNV-1a32 values are non-cryptographic change fingerprints, not integrity hashes.

## Why AI is present

Gemini is an optional, quote-constrained extraction front end. The safety-relevant diagnostics, gate state, impact analysis, and target generation are deterministic in the current prototype. When a live model is disabled, unavailable, or rejected by validation, the product uses a deterministic demo result.

This fallback is intentional for a stable demonstration, but it is not evidence of a live AI-operated business.

## Current implementation evidence

- TypeScript domain model for artifacts, nodes, edges, diagnostics, patches, compiled targets, impact sets, and execution receipts.
- Responsive result-driven React interface for synthetic sources, graph/node inspection, diagnostics, patch simulation, four-state impact matrix, three targets, source map, and receipts.
- Deterministic compiler with six diagnostic codes and a stable decision ID.
- Express endpoints for health, compile, and demo approval.
- Optional Gemini Developer API or Vertex AI path, disabled by default and source-quote validated.
- Browser client helper with a 60-second timeout and a network-failure fallback restricted to the exact synthetic fixture.
- Thirteen unit-test cases in `src/domain/compiler.test.ts`.
- A one-hour HMAC-SHA256 compile-provenance token that carries validated AI evidence through the demo review transition.
- Docker packaging for a Node 24 runtime.

Verified on 2026-08-17 after the response-isolation and strict-fixture fixes: typecheck, lint, 13/13 tests, and the production build exited 0. A direct production server smoke verified root/CSP/no-store behavior, immutable hashed assets, and compile-token valid/tampered/extra-segment/expired cases. A Docker engine was unavailable, so the image itself was not built or deployed.

Also verified on 2026-08-17: Google account `chquan17` is signed in, the free-trial/billing state is active, and project `project-55fbcfd2-0ad6-4c99-a25` is active. A zero-spend-at-capture screenshot is retained privately. This clears the earlier reauthentication blocker, but it does not evidence enabled APIs, IAM permissions, Secret Manager configuration, Cloud Run deployment, a live Vertex/Gemini call, runtime logs, or deployment cost.

The repository does **not** yet evidence a production deployment, a successful live Gemini/Vertex call, Google Cloud API usage, real customers, real users, revenue, a public demo video, or a completed Devpost entry.

## Scale envelope

| Dimension | Current prototype | Explicit limit |
| --- | --- | --- |
| Source artifacts | The 3 disclosed synthetic artifacts | Server rejects any count, metadata, or content change |
| Artifact size | Short text | 8,000 characters each; request body 64 KB |
| Compile frequency | Single-instance demo | 6 compile attempts per 10 minutes per observed IP; counter is process-local |
| Persistence | None | State and rate limits reset on process restart |
| Tenancy/authentication | None | Not suitable for customer or production data |
| Provenance token | HMAC-signed, one-hour lifetime | Local default secret changes on restart; production requires a stable ≥32-byte secret |
| Concurrency | Local/small demo only | No shared rate-limit or durable state across instances |

## Success criteria

### Prototype success

- Every diagnostic quote is present in its referenced artifact.
- The pre-approval gate remains `HOLD` with four unresolved blockers.
- The demo review produces `CONDITIONAL PILOT`, never unconditional `PASS`.
- Six `DEC-014`-linked sections are rebuilt; three unrelated canonical sections from that compile's fresh baseline are reused without reconstruction and retain their FNV-1a32 fingerprints.
- Synthetic, fallback, and approval semantics are visible and not overstated.

### Business and challenge success

- Real target users confirm the review problem and use the product in an authentic workflow.
- A deployed application performs at least one verifiable Gemini API call.
- Real usage, revenue, expenses, and customer evidence meet the official challenge rules.
- All external publication and submission steps receive human approval.

None of the business/challenge criteria above is currently met by repository evidence.

## Non-goals for this prototype

- Controlling a robot or authorizing a real industrial deployment.
- Replacing deployment, safety, legal, or commercial reviewers.
- Inventing acceptance thresholds, pricing, schedules, measurements, customers, or financial results.
- Claiming production readiness, Google Cloud deployment, business traction, or competition eligibility.

## Human approval gates

- Approving any real deployment decision or contract language.
- Uploading source code, evidence, credentials, financial records, or personal data.
- Deploying or publishing the application or demo video.
- Saving or finalizing the Devpost submission.

The local demo button simulates a review boundary; it is not authenticated approval for a real organization.
