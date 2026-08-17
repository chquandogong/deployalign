# Risk Register

> Status: Active · Date: 2026-08-17 · Owner: Red team and project lead

Likelihood and impact use Low / Medium / High / Critical. “Mitigated” means reduced, not eliminated.

| ID | Risk | Likelihood | Impact | Early signal | Response | Owner | State |
| --- | --- | ---: | ---: | --- | --- | --- | --- |
| R-01 | Missing real users/revenue makes the challenge entry noncompliant or noncompetitive | High | Critical | Evidence checklist remains empty | Do not fabricate; obtain authentic evidence or do not finalize | Human entrant | Open blocker |
| R-02 | Synthetic Raman/facility case is perceived as a real customer or deployment | Medium | High | Viewers ask which customer/site was used | Persistent `SYNTHETIC DEMO` labels and explicit narrative disclosure | Product | Mitigating |
| R-03 | Code/configuration or account readiness is described as live Gemini or Google Cloud production usage | High | Critical | No usage/deployment log exists | Verify a deployed call and retain redacted API/runtime/cost proof before claiming | Engineering + human | Open claim gate |
| R-04 | Cloud configuration and deployment evidence remains incomplete after reauthentication | High | High | APIs, IAM, Secret Manager, Cloud Run, logs, or cost records remain unchecked | Use a human-approved checklist; configure least privilege and secrets; retain redacted evidence | Human + Ops | Open external gate |
| R-05 | Client network fallback is indistinguishable from healthy server-side deterministic execution | Medium | High | API is offline but provider still reads `deterministic-demo` | Add execution-origin metadata/banner and network-failure telemetry | Frontend | Open |
| R-06 | Demo review is mistaken for secure approval | Medium | High | Screenshots say “approved” without caveat | Label as local demo review; never accept real decisions; design auth/signatures later | Product/security | Open |
| R-07 | Missing/inconsistent `COMPILE_TOKEN_SECRET` invalidates review tokens across restarts or instances | Medium after startup guard | High | Review receives HTTP 409 or production refuses to start | Require a stable ≥32-byte Secret Manager value; keep demo max instances 1 while rate/state are process-local | Backend/Ops | Open deployment limitation |
| R-08 | In-memory IP rate limit is bypassed, shared incorrectly, or lost on restart | Medium | Medium | Abuse or inconsistent 429 behavior across replicas | Managed rate limit and identity in production | Backend | Accepted for local demo |
| R-09 | Prompt injection or malicious source content influences Gemini rationale | Medium | High | Rationale contains instructions or unrelated text | Treat documents as data; strict schema/quotes; deterministic policies; adversarial tests | AI/security | Open |
| R-10 | Exact-substring grounding creates false confidence despite missing context | Medium | High | Quote is exact but classification/meaning is wrong | Human source review; semantic benchmarks; context windows and provenance coordinates | AI/QA | Open |
| R-11 | Diagnostic rules are overfit to the bundled sample | High | High | Performance drops on paraphrases or new domains | Build a consented redacted corpus; measure precision/recall and false negatives | Product/QA | Open |
| R-12 | Public repository/video exposes secrets, PII, customer data, or unlicensed assets | Medium | Critical | Secret scan or asset provenance is incomplete | Private review, secret/license scan, consent check, human publication gate | Human entrant | Open gate |
| R-13 | External deployment lacks authentication, persistence, monitoring, or rollback | High | Critical | Public URL points directly to current demo API | Do not deploy as production; add controls or label isolated demo | Engineering | Open gate |
| R-14 | Challenge deadline pressure causes unsupported claims or incomplete finalization | High | Critical | Required evidence has no source near deadline | Use no-go checklist; preserve drafts; final submit only after human evidence review | Project lead | Open blocker |
| R-15 | Same-model role review is presented as independent Claude–GPT validation | Medium | Medium | Submission says “cross-model validated” | Disclose review method; obtain truly independent review if claimed | Documentarian | Mitigated |
| R-16 | Generated scope is used as safety guidance | Low in labeled demo | Critical | A user uploads a real deployment case | Disable/avoid real ingestion; prominent non-authorization disclaimer; domain governance | Product/security | Open |
| R-17 | Demo receipt IDs repeat by version and deterministic durations are zero, so they are not a durable audit trail | High | Medium | Multiple runs share `DEMO-V1`/`DEMO-V2` IDs | Label receipts as illustrative; use unique persisted events before production claims | Backend/QA | Accepted for demo; blocks audit claim |
| R-18 | Signed compile token is readable base64url data, replayable within one hour, and not tied to a user | Medium | High for real data | Token is copied/reused or mistaken for authorization | Synthetic data only; short expiry; add identity, nonce, encryption/minimization, and durable audit before real use | Security | Accepted for demo only |

## Highest-priority controls before any public action

1. Truthful business/user/revenue evidence audit.
2. Human-approved Google API/IAM/Secret Manager setup, Cloud Run deployment, and redacted live-call/log/cost verification. Account/project reauthentication is already cleared.
3. Passing test/type/lint/build evidence and visual disclosure review.
4. Secret, privacy, license, and repository-history review.
5. Human approval for deploy, video publication, repository sharing, draft saving, and final submission.
6. Receipt and execution-origin disclosure verified so illustrative demo records cannot be presented as production audit evidence.
