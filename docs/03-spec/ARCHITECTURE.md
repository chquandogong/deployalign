# DeployAlign Architecture

> Status: Prototype architecture; not production-approved · Date: 2026-08-17 · Owner: Engineering

## Context and boundaries

DeployAlign is a React/TypeScript single-page application served with an Express API. It demonstrates one synthetic project. The process has no database, authentication, queue, durable audit log, or production deployment.

External dependencies are the browser, optional Gemini Developer API or Vertex AI, and a future hosting platform. On 2026-08-17, account `chquan17`, active free-trial/billing status, and project `project-55fbcfd2-0ad6-4c99-a25` were verified. Reauthentication is no longer a blocker, but APIs, IAM, Secret Manager, Cloud Run, live model execution, logs, and cost evidence remain unverified external gates.

## Components and responsibilities

| Component | Responsibility | Current boundary |
| --- | --- | --- |
| React UI | Present sources, graph, diagnostics, patch, targets, impact, and receipts | Result-driven responsive UI is implemented; final live-browser visual QA pending |
| `compileClient` | Call compile/review endpoints with a 60-second timeout | Local fallback only for a network `TypeError`, exact fixture, and compatible review state |
| Express API | Validate inputs, rate-limit compile, issue/verify provenance tokens, expose health/compile/review, serve static build | In-memory, unauthenticated, single-process demo |
| Gemini adapter | Classify exact source quotes and propose a concise patch rationale | Opt-in; validated classifications remain separate `AI_DRAFT` candidates |
| Deterministic compiler | Build graph, diagnostics, patch, targets, impact, FNV-1a32 fingerprints, and receipts | Six `DEC-014`-linked sections rebuild; three unrelated baseline sections are reused within the approved compile; fingerprints detect change, not cryptographic integrity |
| Unit tests | Protect grounding, strict fixture identity/schema, gates, AI candidates, patch size, response isolation, rebuild behavior, and decision IDs | Thirteen cases; final run passed 13/13 |

## Data flow

```mermaid
flowchart LR
  U["Reviewer in browser"] --> UI["React UI"]
  UI --> C["compileClient"]
  C -->|"POST /api/compile"| API["Express API"]
  API --> V["Input bounds"]
  V -->|"opt-in only"| G["Gemini API or Vertex AI"]
  G -->|"validated quotes + rationale"| DC["Deterministic compiler"]
  V -->|"disabled/rejected"| DC
  DC --> R["Graph · diagnostics · patch · targets · receipts"]
  R --> T["HMAC-signed compile token · 1 hour"]
  T --> UI
  C -. "eligible network failure: exact-fixture fallback" .-> LD["Browser compileDemo"]
  LD --> UI
  UI -->|"version + patch + token"| AP["POST /api/approve"]
  AP --> DC
```

## Trust boundaries and permissions

- Browser to API is an untrusted boundary; there is no user identity or CSRF/session model.
- API to Gemini is an external data boundary. Only synthetic data should cross it now.
- Environment credentials are secret and must never enter the client, repository, logs, screenshots, or submission text.
- The demo review endpoint checks a known version/patch and verifies an HMAC-SHA256 compile token. The token preserves validated AI provenance and expiry, but its base64url payload is signed rather than encrypted. It is not user authorization, organizational approval, or non-repudiation.
- Devpost, public video, repository sharing, and production deployment are external-write gates requiring human review.

## State and storage

- Source of truth for the prototype: TypeScript code and bundled synthetic data.
- Client state: in-memory per browser session.
- Server rate-limit attempts: in-memory map, reset on restart.
- Gemini extraction evidence: returned in the compile response and carried through review in a one-hour HMAC token; it is not persisted by the server.
- Token secret: `COMPILE_TOKEN_SECRET` when configured; local development otherwise uses a random per-process secret. Production refuses to start without a value of at least 32 bytes.
- Generated targets: returned in the response only; not persisted. Each compile builds a fresh baseline target graph. During an approved compile, six Decision-ID-linked sections are replaced with rebuilt objects while three unrelated canonical baseline section objects are reused within that response; one response cannot mutate a later compile.
- Section values prefixed `fnv1a32-` are 32-bit FNV-1a change fingerprints. They are not cryptographic integrity hashes or a durable ledger.

## Failure modes and recovery

| Failure | Current behavior | Recovery/required improvement |
| --- | --- | --- |
| Gemini disabled or unconfigured | Deterministic demo result | Display fallback clearly; configure only with approval |
| Gemini validation fails | Log rejection; continue deterministically | Capture redacted metrics and improve prompt/validator |
| Demo receipts | Actors follow the actual path, but IDs repeat by demo version and deterministic durations are zero | Treat as illustrative receipts; use unique durable audit events in production |
| API network failure | Exact fixture may compile locally with the same provider value as server-side deterministic execution | Add an explicit execution-origin field/banner and retain error context |
| Compile abuse | Six attempts per ten minutes per observed IP | Use managed rate limiting and identity in production |
| Server restart | Rate state resets; tokens issued with an ephemeral default secret become invalid | Configure an approved shared secret and durable controls if validated |
| Compile token mismatch/expiry | Review returns 409 without changing the demo baseline | Recompile and review the new result; never bypass verification |
| Local restart or instances with different secrets | A valid token from one process cannot be verified by another | Production must use the same ≥32-byte secret from approved secret management; keep the demo at max instances 1 while other state remains process-local |
| Review replay | A still-valid token can be reused within its one-hour window | Add identity, nonce/idempotency, and durable audit state for production |
| Invalid real-world decision | No true safety controls | Keep prototype synthetic; require domain governance |

## Scale changes beyond the envelope

- More documents require document parsing, chunk/source coordinates, search, and configurable schemas.
- More users require authentication, tenancy, quotas, durable jobs, and data lifecycle controls.
- Production review requires immutable audit events, role separation, signed approvals, and policy versioning.
- High-volume compilation requires queues, managed storage, observability, and provider cost controls.
- Multi-instance operation requires shared secret management plus shared rate limiting/operational state; the current unconfigured demo is limited to one instance.

These are extension points, not claims that the current prototype supports them.

## Open architecture decisions

- Exact Google Cloud hosting and model topology.
- Region, retention, encryption, and customer-data policy.
- Identity and approval-signature model.
- Tenant-scoped persistence and event model.
- Compile-token key rotation and multi-instance secret distribution.
- Configurable rule/policy format and versioning.
- Whether browser fallback should be removed outside demo mode.
