# Devpost Evidence Checklist

> Status: Devpost submitted; evidence and residual risks recorded · Date: 2026-08-17 · Owner: Human entrant

Legend: `[x]` locally evidenced, `[ ]` missing/unverified, `[GATE]` requires a person immediately before the external action.

## Eligibility and project history

- [x] Entrant confirms adulthood/legal-age, territory eligibility in the Republic of Korea, and agreement to the official rules.
- [-] Team/organization representative authorization: not applicable; submitter type is Individual.
- [-] Organization employee-count condition: not applicable to the individual entrant.
- [x] Project start is `06-01-26` (June 1, 2026), as confirmed by the entrant.
- [x] Additional Info persisted exactly: `No entrant-owned pre-existing code or assets. Built during the hackathon using standard open-source frameworks and libraries (React, React DOM, Vite, Express, @google/genai, and Lucide) under their respective licenses.`
- [x] Deployed browser-bundle license notice verified; Git author exposure and Microsoft Mark voice redistribution remain accepted residual risks, not cleared legal conclusions.

## Product and code

- [x] Source code for the deterministic compiler, API, Gemini adapter, tests, and Docker packaging exists locally.
- [x] Bundled artifacts and result declare a synthetic demo.
- [x] Final result-driven UI is integrated and production-build verified.
- [x] Live-browser desktop and 320/360 px QA completed; public-safe hero, approved-state, and mobile screenshots retained in `submission-assets/`.
- [x] Test/typecheck/lint/build results recorded for 2026-08-17; current license-compliance deployment checkpoint is `d5f9f33180a1edbdfeb8e5d4b8775a98643fd28c`.
- [x] Working unauthenticated website available at `https://deployalign-1007800160926.asia-northeast3.run.app`.
- [x] Local and container testing instructions prepared; the synthetic demo requires no user credential.
- [x] Repository contains source, setup instructions, safety boundaries, and evidence documentation.
- [x] Public repository publication completed at `https://github.com/chquandogong/deployalign`.

## Google Cloud and Gemini

- [x] Code contains an opt-in Gemini Developer API/Vertex AI adapter.
- [x] Gemini responses are schema and exact-quote validated.
- [x] Authorized Google account session verified; reauthentication is no longer a blocker. The account identifier is excluded from public evidence.
- [x] Active free-trial/billing state and active project `project-55fbcfd2-0ad6-4c99-a25` verified.
- [x] Private billing capture shows an Aug 1–15 current report of ₩0 and remaining free-trial credits, with an explicit warning that reporting can take hours or more than 24 hours; it is not a final expense/P&L record.
- [x] Google Cloud project/region, required APIs, IAM/runtime identity, and deployed Vertex access configured and evidenced.
- [x] Stable ≥32-byte `COMPILE_TOKEN_SECRET` bound from Secret Manager; demo max instances limited to 1.
- [x] Application deployed to Cloud Run revision `deployalign-00004-wgb` at 100% traffic in `asia-northeast3`; public health returned `ok=true`, `service=deployalign`, and `liveGemini=true`.
- [x] Footer notice verified at HTTP 200/3,462 bytes with full React/React DOM/Scheduler MIT, Vite browser-bundle MIT, and Lucide ISC texts.
- [x] At least one `gemini-vertex` call using `gemini-2.5-flash` in the deployed application verified.
- [x] Redacted Gemini/Cloud Run execution records captured: `compile_completed` version 1 and `patch_approved` version 2.
- [x] Public-safe UI evidence shows Gemini provider/model, exactly three `AI_DRAFT` classifications, and a `SUCCESS` receipt without exposing secrets.
- [x] Official Vertex AI Model Garden Monitoring capture shows `gemini-2.5-flash` plus last-hour model-request and token-count graphs.
- [x] In-app receipt/provenance reconciled with deployed provider/log evidence; deterministic graph/gate/target work is not attributed to Gemini.
- [x] API/IAM/runtime identity/Secret Manager changes and bounded public demo deployment were approved and completed.

Configuration files and a Dockerfile do not satisfy these evidence items by themselves; the checked items above are backed by the deployed flow, Cloud Build/deployment record, UI receipts, and redacted logs.

## Real business and users

- [ ] Real business launch evidenced.
- [x] Entrant confirms 1 actual user and 0 paying users; no identity is published.
- [ ] User/customer feedback or testimonials captured with informed consent.
- [ ] Customer relationships/contact details available for confidential verification if requested.
- [ ] Business model and sustainability explanation grounded in real operation.
- [x] Saved story states: actual jobs or economic opportunities beyond the founder are currently none; future opportunity is potential only and not measured.

The synthetic facilities owner, sales owner, and engineer are demo roles, not users or customers.

## Revenue and expenses

- [x] Entrant confirms total arms-length third-party revenue of $0 and related-party revenue of $0.
- [x] Revenue confirmed by month: May $0, June $0, July $0, August $0.
- [x] Expenses confirmed: COGS $0, marketing/customer acquisition $0, other $0, total $0.
- [x] Marketing and customer-acquisition spend disclosed as $0.
- [x] Simple P&L values and one-page PDF complete and saved: revenue $0, expenses $0, net $0.
- [ ] Stripe/bank/other financial evidence prepared with appropriate redaction.
- [-] Corporate ID: N/A for the individual entrant.
- [x] Entrant confirmed and authorized the exact financial/corporate disclosures above for this workflow.

No amount may be invented, estimated as actual, or inferred from lack of evidence.

## Narrative and category

- [x] Professional Services Access selected by the entrant.
- [ ] Category impact supported by actual users/outcomes, not only potential.
- [x] Saved public story is 796 words by repository check, within the 500–1,000 word guidance.
- [ ] Category relevance and every narrative claim reviewed against real evidence by the human entrant.
- [x] Human-versus-AI responsibilities are accurate in the prepared copy.
- [x] “AI-native operations” technical claims map to deployed execution logs and monitoring.
- [x] Prepared claims distinguish verified GCP/Gemini, exact $0/user facts, and unverified customer/impact/job/production claims.
- [x] Same-model role review is not described as Claude–GPT cross-validation.

## Exact Additional Info form fields

- [x] One-page A4, unencrypted, entrant-provided/unaudited zero-revenue PDF visually verified and saved in Devpost.
- [x] Project start date ready in `MM-DD-YY` format: `06-01-26`.
- [x] Submitter type selected: Individual.
- [x] Country supplied: Republic of Korea.
- [x] Category selected: Professional Services Access.
- [ ] Impact and measurement answers grounded in actual outcomes.
- [ ] Business-model and sustainability answers grounded in real operation.
- [x] AI-native/live-AI technical answer can cite the bounded deployed `gemini-vertex` flow while preserving the deterministic compiler boundary.
- [x] Google Cloud/Gemini technical answer can cite Cloud Run, Cloud Build, Secret Manager, dedicated runtime identity, Vertex AI, and redacted logs.
- [x] Public repository URL available.
- [x] Runtime evidence saved as exactly five reviewed files: `cloud-billing-current-zero-lag-warning.png`, `vertex-gemini-observability-metrics.png`, `live-vertex-approved.png`, `live-vertex-receipts.png`, and `cloud-run-config.png`; older `cloud-run-live-logs.png` is not attached.
- [x] Exact approved OSS disclosure persisted before submission, naming React, React DOM, Vite, Express, `@google/genai`, and Lucide.
- [x] Total and May/June/July/August 2026 revenue ready: each and total $0.
- [x] Related-party revenue ready: $0.
- [x] Expense breakdown ready: COGS $0, marketing $0, other $0, total $0.
- [x] Users ready: 1 actual user, 0 paying users.
- [x] Learning level selected: Moderate.
- [x] One-page A4, unencrypted, entrant-provided/unaudited P&L PDF visually verified and saved in Devpost.

## Demo video

- [x] Final local video generated and verified at `videos/edit/final.mp4`.
- [x] Runtime is 170 seconds, under three minutes.
- [x] Technical render verified: 1920×1080, 30 fps, H.264 video, AAC audio, 74 captions.
- [ ] `SYNTHETIC DEMO` and provider/fallback status visible.
- [ ] Video shows actual device/platform functionality.
- [x] No external images or music identified; Microsoft Mark voice redistribution uncertainty accepted as a residual risk for submission.
- [ ] No secrets, PII, account identifiers, or private evidence visible.
- [x] Public YouTube upload approved and completed at `https://youtu.be/QOPgHHAWOBA`.
- [x] Public link verified live with the correct title, 2:50 player duration, and Aug 17, 2026 publication date.
- [-] Custom thumbnail not set because YouTube phone verification is required; no custom-thumbnail claim is made.

## Final form and receipt

- [x] Action-time form/risk review and explicit submission approval recorded; platform submission is not an eligibility determination.
- [x] Public Devpost HEAD returned 200 and Cloud Run health returned 200 with `liveGemini=true` at `2026-08-17T19:19:58+09:00`.
- [x] Devpost entry submitted as DeployAlign; public URL is `https://devpost.com/software/test-q0h69v`.
- [x] Project Details and Additional Info saved with reviewed facts.
- [x] Final form state and residual risks reviewed/approved by the human entrant at the submission gate.
- [x] Overview, Project Details, Additional Info, financial PDFs, and runtime evidence were saved with approval.
- [x] Additional Info exact OSS disclosure saved before submission.
- [x] Entrant accepted public Git author name/email exposure as a residual risk.
- [x] Entrant accepted Microsoft Mark redistribution uncertainty as a residual risk; no legal-rights conclusion is claimed.
- [x] Terms acceptance and Submit explicitly approved immediately before execution.
- [x] Refreshed management page showed `Submitted` and `5/5 steps done`; sidebar showed `Submitted to Build with Gemini XPRIZE`.
- [x] Confirmation captured: `Project submitted! Continue to edit your project until the hackathon deadline: August 17, 2026 at 04:00pm EDT.`

## Current decision

**Submitted; 5/5 steps done.** The public entry is `https://devpost.com/software/test-q0h69v`. Exact $0 financial and one-user disclosures, the 796-word story, evidence uploads, and OSS disclosure were preserved. Zero revenue, limited impact, billing lag, public Git identity exposure, and Microsoft Mark voice redistribution remain evaluation or accepted residual risks. Submission does not establish eligibility, compliance, an award, or production readiness.
