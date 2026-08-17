# Ship Checklist

> Status: **NO-GO for production or final Devpost submission** · Date: 2026-08-17 · Owner: Release owner

Legend: `[x]` evidenced, `[ ]` not evidenced, `[-]` intentionally not applicable to the bounded prototype.

## Scope

- [x] Current scope is a synthetic proof of concept with a public Cloud Run demo.
- [x] Real robot control, customer deployment, safety certification, and contract authorization are excluded.
- [x] Exact entrant-confirmed claims are limited to 1 actual user, 0 paying users, and $0 revenue/expenses; no customer-production, traction, or business-impact claim is approved.
- [x] Final browser implementation is result-driven and matches the documented compiler/API workflow.

## Technical verification

- [x] Final domain test run passed 13/13.
- [x] `pnpm typecheck` passed in the current reviewer run.
- [x] `pnpm lint` passed in the current reviewer run.
- [x] `pnpm build` passed after frontend completion.
- [x] Direct production-server smoke passed for root/assets/cache/CSP and compile-token valid/tamper/extra-segment/expiry cases.
- [ ] Failure, rate-limit, and review-mismatch cases tested.
- [x] Deployed receipt actor/status/provider matches the verified `gemini-vertex` execution; fallback is not attributed to Gemini.
- [x] Responsive live-browser visual QA completed at desktop and 320/360 px without page-level overflow or console errors.
- [x] Synthetic and provider labels remain visible in captured screenshots.

## Model and cloud evidence

- [x] Live model calls are disabled by default.
- [x] Deterministic fallback is implemented.
- [x] Authorized Google account session confirmed; reauthentication is no longer a blocker. The account identifier is excluded from public evidence.
- [x] Active free-trial/billing state and active project `project-55fbcfd2-0ad6-4c99-a25` confirmed.
- [x] Private billing capture shows an Aug 1–15 current report of ₩0 and remaining trial credits; its warning that reporting can take hours or more than 24 hours is retained, so it is not final expense evidence.
- [x] Google Cloud project/region, required APIs, IAM, and runtime identity configured and evidenced for the demo.
- [x] At least one valid Gemini API call in the deployed application evidenced.
- [x] Redacted runtime execution logs and in-app receipt captured.
- [x] Official Vertex AI Model Garden Monitoring capture shows the `gemini-2.5-flash` row and last-hour request/token-count graphs.
- [x] Public demo URL and Cloud Run revision attached; this is not production-readiness evidence.

No item in this section may be checked from code/configuration alone.

## Security, privacy, and IP

- [ ] Authentication/authorization decision made for any public endpoint.
- [x] Stable ≥32-byte `COMPILE_TOKEN_SECRET` configured through Secret Manager for the deployed demo.
- [x] Cloud Run max instances set to 1 for this demo while rate/state remain process-local.
- [x] Signed compile-to-review provider/evidence provenance mechanism passed direct server token smoke.
- [ ] Secret scan completed.
- [x] Production dependency audit completed with zero vulnerabilities; full license review remains part of the publication/IP gate.
- [ ] Asset provenance and third-party trademark/music review completed.
- [ ] Personal/customer data and consent review completed.
- [x] Retained cloud logs and screenshots are redacted/public-safe; continue reviewing new captures.
- [ ] Rollback procedure defined and tested for the selected host.
- [x] Container image build verified through Cloud Build and deployed successfully.

## Challenge evidence

- [x] Adult/territory eligibility, individual status, Republic of Korea, and official-rules agreement confirmed by the entrant.
- [x] Project start `06-01-26` and no pre-existing code/assets confirmed.
- [x] Professional Services Access selected; measured category-impact support remains absent.
- [x] User counts confirmed at 1 actual user and 0 paying users; consent-aware feedback remains absent.
- [x] Revenue disclosed by month and total: May/June/July/August/total $0; related-party revenue $0.
- [x] Expenses disclosed: COGS/marketing/other/total each $0; current simple P&L net $0.
- [-] Corporate ID N/A for the individual entrant.
- [x] Public repository available at `https://github.com/chquandogong/deployalign`.
- [x] Working unauthenticated application available free at `https://deployalign-1007800160926.asia-northeast3.run.app`.
- [ ] Verified 170-second local video exists; public upload and signed-out link check remain.
- [x] English narrative checked against 500–1,000 word guidance on the overview page.
- [ ] All claims map to the evidence checklist.

## Documentation

- [x] Project brief, discovery, decisions, spec, architecture, risk, test, runbook, and submission drafts created.
- [x] Same-model review is labeled as not actual Claude–GPT validation.
- [x] Synthetic/fallback/no-traction/no-production-readiness limitations are documented alongside the verified public-demo facts.
- [x] Dashboard updated after final code and test run.
- [x] Public repository includes setup/testing instructions; final documentation refresh is in progress.

## External human approval gates

- [x] API/IAM/Secret Manager configuration and demo quota use approved for the current deployment.
- [x] Public synthetic-demo deployment approved and completed.
- [x] Public repository publication approved and completed.
- [ ] Approve public video upload.
- [x] Authorized overview draft save completed; future material updates remain gated.
- [ ] Approve the final submission after a last rules/evidence review.

## Rollback and monitoring

- [ ] Hosting rollback target and owner recorded.
- [ ] Health, error, model-provider, latency, rate-limit, and cost signals monitored.
- [x] Vertex model request and token-count activity captured for the verified run; this does not satisfy full production monitoring.
- [ ] Incident/contact path documented.
- [-] Database rollback: no database exists in the prototype.

## Final judgment

**NO-GO for customer production and final submission.** Technical evidence, local video, all entrant-supplied factual fields, Moderate learning level, and the two financial PDFs are verified/prepared. Final submission remains blocked by public video publication, prepared evidence/runtime/P&L uploads, completed-form review, lag-aware cost confirmation, the zero-revenue rules decision, and action-time approval. Production use remains blocked by absent auth, persistence, tenant isolation, durable audit, monitoring, and rehearsed rollback.
