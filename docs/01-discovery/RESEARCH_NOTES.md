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
| Business | Build a real business during the hackathon, acquire real users, and generate real revenue | Not evidenced |
| Google Cloud | Project must use at least one Google Cloud product | Signed-in account, active billing/free trial, and active project are verified; product usage/deployment is not evidenced |
| Gemini | LLM projects must use the Gemini API for at least one LLM call in the deployed application | Adapter exists; successful deployed call not evidenced |
| New work | Project must be created after the submission period began; prior boilerplate must be explained | Git history is absent; README still reflects starter boilerplate at inspection |
| Repository | Provide a public repository or a private repository shared with `testing@devpost.com` and `judging@hacker.fund` | No remote/share evidence |
| Description | Explain how the project meets requirements and its category relevance | Draft exists; truthful compliance story is incomplete |
| Demo video | Publicly visible YouTube/Vimeo/Youku video, less than three minutes, showing the functioning project | Not evidenced; public upload is a human gate |
| Financial evidence | Total revenue, monthly revenue, total expenses, and marketing/customer-acquisition spend, including zero spend where applicable | A private Google Cloud screenshot shows zero spend at capture time only; complete expense/P&L records are not supplied and must not be invented |
| User evidence | Real user counts/breakdown and consent-aware feedback/testimonials | None supplied |
| Testing access | Working project must be available free for judging through a site, demo, or test build | No deployed URL evidenced |
| Language | Submission materials must be in English or include English translations | Documentation package is in English |
| Category | Select one of five official categories | Category decision pending |

## Judging implications

The first stage is a pass/fail baseline viability and required API/SDK check. Stage Two gives equal weight to Business Viability, AI-Native Operations, and Category Impact. DeployAlign currently has a technically coherent demo story but no substantiated Business Viability or live AI-in-production evidence.

## Category fit notes

- **Professional Services Access:** strongest conceptual fit if the product gives smaller deployment teams access to structured engineering-review discipline. The current industrial buyer is not clearly “everyday people,” so the narrative requires validation.
- **Small Business Services:** plausible if small robotics integrators are the real customer and the product helps them compete safely. No such customer evidence exists yet.
- Other categories have weaker current fit.

Category selection is a human decision and must follow the real user/business evidence, not the most convenient story.

## Evidence audit

| Claim | Safe wording now | Evidence needed to strengthen it |
| --- | --- | --- |
| “AI-powered” | Optional Gemini extraction path with deterministic fallback | Redacted deployed Gemini request/response and usage log |
| “Production” | Do not claim | Live URL, monitoring, auth, persistent audit trail, operation history |
| “Customers/users” | Do not claim; synthetic personas only | Consented real user records and feedback |
| “Revenue” | Do not claim | Verifiable third-party revenue records and P&L |
| “Google Cloud” | Account `chquan17`, active free-trial/billing state, and active project `project-55fbcfd2-0ad6-4c99-a25` are verified; no product use or deployment is claimed | Approved API/IAM configuration, Secret Manager binding, usage logs, deployment record, and cost evidence |
| “Safety improvement” | Designed to surface unsupported scope in a demo | Real benchmark or user study; never imply certification |

## Research gaps

- Independent competitor and prior-art scan.
- Real deployment-review workflow interviews.
- Data-governance requirements for customer artifacts.
- Exact APIs, IAM/service identity, region, Secret Manager binding, Cloud Run topology, and cost controls.
- Verified creation dates and repository history for challenge eligibility.
