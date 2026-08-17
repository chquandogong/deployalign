# Research Notes

> Status: Official-rule snapshot; verify again before submission · Date: 2026-08-17 · Owner: Researcher

## Source policy

Competition requirements below come from the official Devpost challenge pages retrieved on 2026-08-17. The official rules prevail over summaries, and they may change. Re-open them immediately before any external submission.

## Official sources

- [Build with Gemini XPRIZE overview and requirements](https://xprize.devpost.com/)
- [Build with Gemini XPRIZE Official Rules](https://xprize.devpost.com/rules)
- [Official challenge resources](https://xprize.devpost.com/resources)
- [Official FAQ](https://xprize.devpost.com/details/faq)

## Verified rule facts relevant to DeployAlign

| Requirement | Official statement summarized | Current evidence |
| --- | --- | --- |
| Submission deadline | Aug 17, 2026 at 1:00 PM Pacific Time | Deadline is time-critical; no submission receipt evidenced |
| Eligibility | Adult/eligible entrant, applicable territory, and rules acceptance | Entrant confirms individual status, Republic of Korea, adulthood/eligibility, and agreement to the official rules |
| Business | Build a real business during the hackathon, acquire real users, and generate real revenue | Entrant confirms 1 actual user and 0 paying users; all monthly/total revenue is $0, so the stated real-revenue requirement may remain unmet |
| Google Cloud | Project must use at least one Google Cloud product | Public Cloud Run demo, Cloud Build, Vertex AI execution, Secret Manager binding, redacted runtime logs, and Vertex request/token monitoring graphs are evidenced in project `project-55fbcfd2-0ad6-4c99-a25` |
| Gemini | LLM projects must use the Gemini API for at least one LLM call in the deployed application | Deployed `gemini-vertex` call using `gemini-2.5-flash` verified; exactly three grounded `AI_DRAFT` candidates and a successful receipt observed |
| New work | Project must be created after the submission period began; prior boilerplate must be explained | Entrant confirms project start `06-01-26` (June 1, 2026) and no pre-existing code/assets |
| Repository | Provide a public repository or a private repository shared with `testing@devpost.com` and `judging@hacker.fund` | Public repository available at `https://github.com/chquandogong/deployalign` |
| Description | Explain how the project meets requirements and its category relevance | Draft exists; truthful compliance story is incomplete |
| Demo video | Publicly visible YouTube/Vimeo/Youku video, less than three minutes, showing the functioning project | Local 170-second 1080p H.264/AAC render with 74 captions is verified; public upload/URL remains a human gate |
| Financial evidence | Total revenue, monthly revenue, total expenses, and marketing/customer-acquisition spend, including zero spend where applicable | Entrant confirms all required values at $0; one-page zero-revenue and P&L PDFs are prepared/visually verified; form uploads are pending |
| User evidence | Real user counts/breakdown and consent-aware feedback/testimonials | Entrant confirms 1 actual user and 0 paying users; no feedback/testimonial evidence supplied |
| Testing access | Working project must be available free for judging through a site, demo, or test build | Public unauthenticated demo available at `https://deployalign-1007800160926.asia-northeast3.run.app` |
| Language | Submission materials must be in English or include English translations | Documentation package is in English |
| Category | Select one of five official categories | Professional Services Access selected by the entrant; measured category impact remains absent |

## Judging implications

The first stage is a pass/fail baseline viability and required API/SDK check. Stage Two gives equal weight to Business Viability, AI-Native Operations, and Category Impact. DeployAlign has a deployed Google Cloud/Vertex technical story and 1 actual user, but 0 paying users, $0 revenue, and no measured outcome leave Business Viability and Category Impact weak. The synthetic demo must not be described as customer production.

## Category fit notes

- **Professional Services Access:** strongest conceptual fit if the product gives smaller deployment teams access to structured engineering-review discipline. The current industrial buyer is not clearly “everyday people,” so the narrative requires validation.
- **Small Business Services:** plausible if small robotics integrators are the real customer and the product helps them compete safely. No such customer evidence exists yet.
- Other categories have weaker current fit.

The entrant selected **Professional Services Access**. The submission must still acknowledge that the single-user, no-outcome evidence does not validate the category impact.

## Evidence audit

| Claim | Safe wording now | Evidence needed to strengthen it |
| --- | --- | --- |
| “AI-powered” | Verified Vertex AI extraction for exactly three quote-grounded `AI_DRAFT` candidates; deterministic TypeScript owns graph, gates, impact, and targets | Retain redacted deployed receipt/log evidence and never attribute deterministic decisions to Gemini |
| “Production” | Do not claim | Live URL, monitoring, auth, persistent audit trail, operation history |
| “Customers/users” | Do not claim; synthetic personas only | Consented real user records and feedback |
| “Revenue” | Entrant-confirmed May/June/July/August/total and related-party revenue are each $0 | Prepared revenue-evidence/P&L PDFs must be uploaded; never describe $0 as traction |
| “Google Cloud” | Public synthetic Cloud Run demo, Cloud Build container, Secret Manager HMAC binding, dedicated runtime identity, Vertex call, redacted logs, and official request/token monitoring are verified | Recheck billing after its lag window; add production controls before any customer-operation claim |
| “Safety improvement” | Designed to surface unsupported scope in a demo | Real benchmark or user study; never imply certification |

## Research gaps

- Independent competitor and prior-art scan.
- Real deployment-review workflow interviews.
- Data-governance requirements for customer artifacts.
- Final cloud cost after any delayed charge; prepared evidence/P&L uploads and production-grade cost controls.
- Final form review; learning-level self-assessment is complete at Moderate.
