# Risk Register

> Status: Active · Date: 2026-08-17 · Owner: Red team and project lead

Likelihood and impact use Low / Medium / High / Critical. “Mitigated” means reduced, not eliminated.

| ID | Risk | Likelihood | Impact | Early signal | Response | Owner | State |
| --- | --- | ---: | ---: | --- | --- | --- | --- |
| R-01 | One actual user, zero paying users, and $0 revenue make the entry noncompliant or noncompetitive | High | Critical | Stated real-revenue requirement conflicts with truthful $0 | Disclose exact values; do not fabricate traction; complete final rule review before submit | Human entrant | Open blocker |
| R-02 | Synthetic Raman/facility case is perceived as a real customer or deployment | Medium | High | Viewers ask which customer/site was used | Persistent `SYNTHETIC DEMO` labels and explicit narrative disclosure | Product | Mitigating |
| R-03 | Verified demo deployment is overstated as customer production or as Gemini-owned safety logic | Medium | Critical | Narrative omits synthetic/architecture boundary | Cite deployed call/log evidence; state Gemini only proposes three quote-grounded `AI_DRAFT` candidates while deterministic TypeScript owns graph/gates/targets | Engineering + human | Mitigating claim gate |
| R-04 | Cloud cost or operational readiness is inferred from deployment evidence | Medium | High | Capture-time ₩0 is reused as a final total, or graphs are called full monitoring | Recheck billing after the explicit warning that reporting can take hours or more than 24 hours; separate request/token evidence from production alerts/controls | Human + Ops | Open evidence gate |
| R-05 | Client network fallback is indistinguishable from healthy server-side deterministic execution | Medium | High | API is offline but provider still reads `deterministic-demo` | Add execution-origin metadata/banner and network-failure telemetry | Frontend | Open |
| R-06 | Demo review is mistaken for secure approval | Medium | High | Screenshots say “approved” without caveat | Label as local demo review; never accept real decisions; design auth/signatures later | Product/security | Open |
| R-07 | Missing/inconsistent `COMPILE_TOKEN_SECRET` invalidates review tokens across restarts or instances | Low in current demo | High | Review receives HTTP 409 or production refuses to start | Current Cloud Run demo uses a stable Secret Manager value; retain max instances 1 while rate/state are process-local | Backend/Ops | Mitigated for current revision |
| R-08 | In-memory IP rate limit is bypassed, shared incorrectly, or lost on restart | Medium | Medium | Abuse or inconsistent 429 behavior across replicas | Managed rate limit and identity in production | Backend | Accepted for local demo |
| R-09 | Prompt injection or malicious source content influences Gemini rationale | Medium | High | Rationale contains instructions or unrelated text | Treat documents as data; strict schema/quotes; deterministic policies; adversarial tests | AI/security | Open |
| R-10 | Exact-substring grounding creates false confidence despite missing context | Medium | High | Quote is exact but classification/meaning is wrong | Human source review; semantic benchmarks; context windows and provenance coordinates | AI/QA | Open |
| R-11 | Diagnostic rules are overfit to the bundled sample | High | High | Performance drops on paraphrases or new domains | Build a consented redacted corpus; measure precision/recall and false negatives | Product/QA | Open |
| R-12 | Public repository/video exposes secrets, PII, customer data, or unlicensed assets | Medium | Critical | Public Git author name/email acceptance is unrecorded or Microsoft Mark redistribution remains uncertain | Browser-bundle notice is deployed; obtain identity-exposure acceptance and resolve/replace the voice before submit | Human entrant | Open gate |
| R-13 | Public demo lacks authentication, persistence, durable monitoring, or tested rollback | High | Critical | Public URL points directly to current demo API | Keep fixed synthetic input and clear demo labels; do not treat as production; add controls before real use | Engineering | Accepted only for bounded demo |
| R-14 | Challenge deadline pressure causes unsupported claims or incomplete finalization | High | Critical | Required evidence has no source near deadline | Use no-go checklist; preserve drafts; final submit only after human evidence review | Project lead | Open blocker |
| R-15 | Same-model role review is presented as independent Claude–GPT validation | Medium | Medium | Submission says “cross-model validated” | Disclose review method; obtain truly independent review if claimed | Documentarian | Mitigated |
| R-16 | Generated scope is used as safety guidance | Low in labeled demo | Critical | A user uploads a real deployment case | Disable/avoid real ingestion; prominent non-authorization disclaimer; domain governance | Product/security | Open |
| R-17 | Demo receipt IDs repeat by version and deterministic durations are zero, so they are not a durable audit trail | High | Medium | Multiple runs share `DEMO-V1`/`DEMO-V2` IDs | Label receipts as illustrative; use unique persisted events before production claims | Backend/QA | Accepted for demo; blocks audit claim |
| R-18 | Signed compile token is readable base64url data, replayable within one hour, and not tied to a user | Medium | High for real data | Token is copied/reused or mistaken for authorization | Synthetic data only; short expiry; add identity, nonce, encryption/minimization, and durable audit before real use | Security | Accepted for demo only |

## Highest-priority controls before any public action

1. Preserve the exact entrant-confirmed user/revenue/expense facts and assess the $0-revenue rule risk without embellishment.
2. Preserve redacted Cloud Run/Vertex/receipt and official request/token-monitoring evidence; recheck billing after its documented lag before confirming final expense.
3. Passing test/type/lint/build evidence and visual disclosure review.
4. Preserve the verified deployed license notice; obtain approval for the OSS-framework form update and public Git author name/email exposure, and resolve the Microsoft Mark voice redistribution uncertainty.
5. Public video and overview-draft saves are complete, but their residual identity/IP gates remain open. Preserve action-time approval for final submission and review any material video/draft/deployment changes.
6. Receipt and execution-origin disclosure verified so illustrative demo records cannot be presented as production audit evidence.
