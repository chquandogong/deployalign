# Ship Checklist

> Status: **NO-GO for production or final Devpost submission** · Date: 2026-08-17 · Owner: Release owner

Legend: `[x]` evidenced, `[ ]` not evidenced, `[-]` intentionally not applicable to the local prototype.

## Scope

- [x] Current scope is a synthetic, local proof of concept.
- [x] Real robot control, customer deployment, safety certification, and contract authorization are excluded.
- [x] No real user, revenue, production, GCP deployment, or successful Gemini-call claim is approved.
- [x] Final browser implementation is result-driven and matches the documented compiler/API workflow.

## Technical verification

- [x] Final domain test run passed 13/13.
- [x] `pnpm typecheck` passed in the current reviewer run.
- [x] `pnpm lint` passed in the current reviewer run.
- [x] `pnpm build` passed after frontend completion.
- [x] Direct production-server smoke passed for root/assets/cache/CSP and compile-token valid/tamper/extra-segment/expiry cases.
- [ ] Failure, rate-limit, and review-mismatch cases tested.
- [ ] Receipt actors/status/timings/IDs match the actual execution path; no fallback stage is attributed to Gemini.
- [ ] Responsive and accessibility visual QA completed.
- [ ] Synthetic and deterministic-fallback labels remain visible in screenshots/video.

## Model and cloud evidence

- [x] Live model calls are disabled by default.
- [x] Deterministic fallback is implemented.
- [x] Google account `chquan17` signed-in state confirmed; reauthentication is no longer a blocker.
- [x] Active free-trial/billing state and active project `project-55fbcfd2-0ad6-4c99-a25` confirmed.
- [x] Private zero-spend-at-capture screenshot retained; it is not deployment or complete expense evidence.
- [ ] Intended Google Cloud product/APIs, region, quota, IAM, and runtime identity confirmed and configured.
- [ ] At least one valid Gemini API call in the deployed application evidenced.
- [ ] Redacted API-usage/execution logs attached.
- [ ] Production deployment URL and monitoring evidence attached.

No item in this section may be checked from code/configuration alone.

## Security, privacy, and IP

- [ ] Authentication/authorization decision made for any public endpoint.
- [ ] Stable ≥32-byte `COMPILE_TOKEN_SECRET` configured through Secret Manager for any production start.
- [ ] Cloud Run max instances set to 1 for this demo while rate/state remain process-local.
- [x] Signed compile-to-review provider/evidence provenance mechanism passed direct server token smoke.
- [ ] Secret scan completed.
- [ ] Dependency/license scan completed.
- [ ] Asset provenance and third-party trademark/music review completed.
- [ ] Personal/customer data and consent review completed.
- [ ] Logs and screenshots redacted.
- [ ] Rollback procedure defined and tested for the selected host.
- [ ] Docker image build verified; Dockerfile exists, but no Docker engine was available in this run.

## Challenge evidence

- [ ] Eligibility and representative status confirmed by the human entrant.
- [ ] Project creation timeline and reused boilerplate explanation evidenced.
- [ ] Category selected and supported by the real user/business story.
- [ ] Real users and consent-aware feedback evidenced.
- [ ] Real third-party revenue evidenced by month.
- [ ] Total expenses and marketing/customer-acquisition spend disclosed truthfully.
- [ ] Corporate ID supplied if applicable.
- [ ] Public/private repository prepared and judge access verified.
- [ ] Working application available free for judging.
- [ ] Public demo video under three minutes uploaded and checked.
- [ ] English narrative checked against 500–1,000 word guidance on the overview page.
- [ ] All claims map to the evidence checklist.

## Documentation

- [x] Project brief, discovery, decisions, spec, architecture, risk, test, runbook, and submission drafts created.
- [x] Same-model review is labeled as not actual Claude–GPT validation.
- [x] Synthetic/fallback/no-traction/no-production limitations are documented.
- [x] Dashboard updated after final code and test run.
- [ ] README and public testing instructions updated by the owning implementation agent.

## External human approval gates

- [ ] Approve API/IAM/credential/Secret Manager changes and any Google quota use.
- [ ] Approve production/cloud deployment.
- [ ] Approve repository publication or judge sharing.
- [ ] Approve public video upload.
- [ ] Approve saving/updating a Devpost draft.
- [ ] Approve the final submission after a last rules/evidence review.

## Rollback and monitoring

- [ ] Hosting rollback target and owner recorded.
- [ ] Health, error, model-provider, latency, rate-limit, and cost signals monitored.
- [ ] Incident/contact path documented.
- [-] Database rollback: no database exists in the prototype.

## Final judgment

**NO-GO.** Local prototype work may continue. Production deployment, public publication, and final submission remain blocked by incomplete cloud API/IAM/secret/deployment/live-call evidence, absent production controls, and absent required real business/user/revenue evidence. Google account/project reauthentication is no longer a blocker.
