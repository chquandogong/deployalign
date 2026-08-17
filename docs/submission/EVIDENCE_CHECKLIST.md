# Devpost Evidence Checklist

> Status: Material blockers open · Date: 2026-08-17 · Owner: Human entrant

Legend: `[x]` locally evidenced, `[ ]` missing/unverified, `[GATE]` requires a person immediately before the external action.

## Eligibility and project history

- [ ] Entrant legal-age and territory eligibility confirmed.
- [ ] Team/organization representative authorized if applicable.
- [ ] Organization has fewer than 25 employees if entering as an organization.
- [ ] Project creation after the submission period start evidenced.
- [ ] Reused Vite/React boilerplate and other pre-existing work explained.
- [ ] Original-work, open-source-license, asset, trademark, music, and privacy review complete.

## Product and code

- [x] Source code for the deterministic compiler, API, Gemini adapter, tests, and Docker packaging exists locally.
- [x] Bundled artifacts and result declare a synthetic demo.
- [x] Final result-driven UI is integrated and production-build verified.
- [x] Live-browser desktop and 320/360 px QA completed; public-safe hero, approved-state, and mobile screenshots retained in `submission-assets/`.
- [ ] Test/typecheck/lint/build logs attached with date and commit.
- [ ] Working test build or website available free through the judging period.
- [x] Local and container testing instructions prepared; the synthetic demo requires no user credential.
- [x] Repository contains source, setup instructions, safety boundaries, and evidence documentation.
- [GATE] Public repository publication or private sharing with `testing@devpost.com` and `judging@hacker.fund` approved and completed.

## Google Cloud and Gemini

- [x] Code contains an opt-in Gemini Developer API/Vertex AI adapter.
- [x] Gemini responses are schema and exact-quote validated.
- [x] Google account `chquan17` signed-in state verified; reauthentication is no longer a blocker.
- [x] Active free-trial/billing state and active project `project-55fbcfd2-0ad6-4c99-a25` verified.
- [x] Private screenshot records zero spend at capture time; it is not public evidence or a complete expense record.
- [ ] Required Google Cloud product/APIs, region, quota, IAM/service identity, and ADC/runtime credentials configured and evidenced.
- [ ] Stable ≥32-byte `COMPILE_TOKEN_SECRET` bound from Secret Manager; demo max instances limited to 1.
- [ ] Application deployed on its intended platform.
- [ ] At least one Gemini API call in the deployed application verified.
- [ ] Redacted Gemini execution/API usage record captured.
- [ ] Dashboard screenshot/log proves AI execution without exposing secrets or source data.
- [ ] In-app execution receipts are reconciled with provider/API evidence; fixed demo receipts are not used as proof.
- [GATE] API/IAM/credential/Secret Manager changes and any cloud deployment approved.

Configuration files and a Dockerfile do not satisfy these evidence items by themselves.

## Real business and users

- [ ] Real business launch evidenced.
- [ ] Individual user count and high-level user breakdown evidenced.
- [ ] User/customer feedback or testimonials captured with informed consent.
- [ ] Customer relationships/contact details available for confidential verification if requested.
- [ ] Business model and sustainability explanation grounded in real operation.
- [ ] Actual jobs/economic opportunities beyond the founding team distinguished from potential ones.

The synthetic facilities owner, sales owner, and engineer are demo roles, not users or customers.

## Revenue and expenses

- [ ] Total arms-length third-party revenue during the hackathon evidenced in USD.
- [ ] Revenue broken out for May, June, July, and August 2026.
- [ ] Total expenses documented with descriptions.
- [ ] Marketing and customer-acquisition spend disclosed, including a truthful zero if records establish zero.
- [ ] Simple P&L completed from real records.
- [ ] Stripe/bank/other financial evidence prepared with appropriate redaction.
- [ ] Corporate ID included if applicable.
- [GATE] Financial/corporate evidence disclosure approved by the owner.

No amount may be invented, estimated as actual, or inferred from lack of evidence.

## Narrative and category

- [ ] One official category selected by the human entrant.
- [ ] Category impact supported by actual users/outcomes, not only potential.
- [x] Local English narrative draft is 679 words, within the 500–1,000 word guidance.
- [ ] Category relevance and every narrative claim reviewed against real evidence by the human entrant.
- [ ] Human-versus-AI responsibilities are accurate.
- [ ] Any “AI-native operations” claim maps to deployed execution logs.
- [ ] No claim says Google Cloud product use/deployment, live Gemini, production, customer, revenue, job creation, or impact without evidence.
- [ ] Same-model role review is not described as Claude–GPT cross-validation.

## Demo video

- [ ] Final application footage recorded.
- [ ] Runtime under three minutes.
- [ ] `SYNTHETIC DEMO` and provider/fallback status visible.
- [ ] Video shows actual device/platform functionality.
- [ ] Third-party marks/music/assets cleared.
- [ ] No secrets, PII, account identifiers, or private evidence visible.
- [GATE] Public YouTube/Vimeo/Youku upload approved.
- [ ] Public link tested while signed out.

## Final form and receipt

- [ ] Latest official overview, rules, FAQ, and form fields rechecked.
- [ ] Repository, app, and video URLs tested from a signed-out browser.
- [ ] Every form answer reviewed by the human entrant.
- [GATE] Saving/updating the Devpost draft approved.
- [GATE] Final submission approved immediately before the irreversible action.
- [ ] Devpost confirmation/receipt captured after submission.

## Current decision

**Not ready for final submission.** The missing deployed-Gemini, Google Cloud usage/deployment, real user, real business, revenue, expense, repository, working-app, and public-video evidence are substantive requirements—not formatting tasks. Account/project reauthentication is no longer a blocker.
