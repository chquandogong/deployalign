# Ship Checklist

> Status: **Devpost submitted; NO-GO for customer production** · Date: 2026-08-17 · Owner: Release owner

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
- [x] Devpost runtime evidence saved as five reviewed images: billing lag warning, Vertex metrics, live approved state, live receipts, and Cloud Run config; the older Cloud Run log capture was removed from the upload.
- [x] Public demo URL and Cloud Run revision attached; this is not production-readiness evidence.
- [x] Current revision `deployalign-00004-wgb` serves 100% traffic; health and the HTTP 200/3,462-byte footer license notice passed live smoke.

No item in this section may be checked from code/configuration alone.

## Security, privacy, and IP

- [ ] Authentication/authorization decision made for any public endpoint.
- [x] Stable ≥32-byte `COMPILE_TOKEN_SECRET` configured through Secret Manager for the deployed demo.
- [x] Cloud Run max instances set to 1 for this demo while rate/state remain process-local.
- [x] Signed compile-to-review provider/evidence provenance mechanism passed direct server token smoke.
- [ ] Secret scan completed.
- [x] Production dependency audit completed with zero vulnerabilities; deployed notice includes full React/React DOM/Scheduler MIT, Vite browser-bundle MIT, and Lucide ISC texts.
- [x] Exact OSS-framework Devpost disclosure approved and saved.
- [x] Microsoft Mark voice redistribution uncertainty accepted as a residual risk for submission; not legally resolved.
- [x] Public Git author name/email exposure accepted by the entrant as a residual risk.
- [x] Retained cloud logs and screenshots are redacted/public-safe; continue reviewing new captures.
- [ ] Rollback procedure defined and tested for the selected host.
- [x] Container image build verified through Cloud Build and deployed successfully.

## Challenge evidence

- [x] Adult/territory eligibility, individual status, Republic of Korea, and official-rules agreement confirmed by the entrant.
- [x] Project start `06-01-26`, no entrant-owned pre-existing assets, and exact standard-OSS disclosure persisted.
- [x] Professional Services Access selected; measured category-impact support remains absent.
- [x] User counts confirmed at 1 actual user and 0 paying users; consent-aware feedback remains absent.
- [x] Revenue disclosed by month and total: May/June/July/August/total $0; related-party revenue $0.
- [x] Expenses disclosed: COGS/marketing/other/total each $0; current simple P&L net $0.
- [-] Corporate ID N/A for the individual entrant.
- [x] Public repository available at `https://github.com/chquandogong/deployalign`.
- [x] Working unauthenticated application available free at `https://deployalign-1007800160926.asia-northeast3.run.app`.
- [x] Public 170-second video verified at `https://youtu.be/QOPgHHAWOBA`; live player shows 2:50 and publication date Aug 17, 2026.
- [x] Saved 796-word English story is within the 500–1,000 word guidance and discloses no current jobs/opportunities beyond the founder.
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
- [x] Public video upload approved and completed.
- [x] Project Details, Additional Info, revenue/P&L PDFs, five runtime-evidence files, and exact OSS disclosure saved.
- [x] Terms accepted and Submit clicked after explicit user approval.
- [x] Refreshed management page showed `Submitted` and `5/5 steps done`; public View link verified.
- [x] Confirmation banner captured exactly; future material edits require new approval.

## Rollback and monitoring

- [ ] Hosting rollback target and owner recorded.
- [ ] Health, error, model-provider, latency, rate-limit, and cost signals monitored.
- [x] Vertex model request and token-count activity captured for the verified run; this does not satisfy full production monitoring.
- [ ] Incident/contact path documented.
- [-] Database rollback: no database exists in the prototype.

## Final judgment

**SUBMITTED to Devpost; NO-GO for customer production.** The entry reached `Submitted` and `5/5 steps done` after explicit approval. Zero revenue, one user, limited impact, billing lag, and accepted Git-identity/Microsoft Mark residual risks remain; submission is not evidence of eligibility or an award. Production use remains blocked by absent auth, persistence, tenant isolation, durable audit, monitoring, and rehearsed rollback.
