# Feasibility Report

> Status: Conditional go for technical PoC; no-go for unsupported business claims · Date: 2026-08-17 · Owner: Product and engineering

## Scorecard

Scores are 1 (weak) to 5 (strong) and reflect evidence in the repository, not aspiration.

| Item | Score | Basis | Uncertainty | Validation |
| --- | ---: | --- | --- | --- |
| User value | 2 | Material risk is plausible; 1 actual user is confirmed | No interview, behavior, or outcome evidence | Five practitioner interviews |
| Pain frequency | 1 | No incident/frequency data | Very high | Collect recent examples |
| Technical feasibility | 4 | Typed compiler, API, UI, tests, Cloud Build container, Cloud Run deployment, and live Vertex call are verified | Production controls remain incomplete | Repeatability and operational-load verification |
| Data access | 2 | Synthetic artifacts are available | Real data permissions unknown | Redacted-data pilot |
| Cost efficiency | 3 | Deterministic fallback limits model cost | Hosting/review costs unmeasured | Measure per compile and review time |
| Risk management | 3 | Source links and a human gate are designed | No auth, tenancy, or production controls | Security design and threat test |
| Differentiation | 3 | Decision-linked incremental compilation is specific | Competitor research is incomplete | Market scan and user comparison |
| Execution speed | 4 | Narrow demo can be shipped quickly | External evidence cannot be manufactured quickly | Separate product and business milestones |

Total: **22/40**. This supports a technical proof of concept, not a validated business.

## Desirability

The underlying failure mode—commercial scope exceeding engineering evidence—is credible. The code demonstrates it with a synthetic Raman-inspection case. The entrant confirms 1 actual user and 0 paying users, but there are no interviews, testimonials, retention signals, or customer outcomes, so demand remains the largest unknown.

## Technical feasibility

The deterministic core is feasible and testable. The current server constrains inputs, validates Gemini quotes against source text, and emits stable diagnostic codes. After review, it rebuilds six `DEC-014`-linked sections and reuses three unrelated canonical sections from the same compile's fresh baseline. Their stable FNV-1a32 fingerprints are non-cryptographic change detectors, not integrity hashes.

Key limitations:

- Only the three disclosed synthetic artifacts are accepted; metadata or content changes are rejected.
- There is no authentication, persistence, tenant isolation, job queue, or durable audit log.
- A network-failure fallback returns the same `deterministic-demo` provider as a healthy server-side fallback, so the UI cannot currently distinguish those two paths.
- A one-hour HMAC-signed compile token now carries validated Gemini provider/candidate evidence through review. Without a configured shared `COMPILE_TOKEN_SECRET`, a restart or another instance cannot verify an earlier token.
- The public synthetic demo is deployed to Cloud Run revision `deployalign-00003-tlc` in project `project-55fbcfd2-0ad6-4c99-a25`, region `asia-northeast3`, with a dedicated Vertex-capable runtime service account and stable HMAC secret from Secret Manager.
- A deployed `gemini-vertex` compile using `gemini-2.5-flash` returned exactly three validated exact-quote `AI_DRAFT` candidates and a successful receipt; provenance persisted through the HMAC-signed review token. Redacted logs recorded `compile_completed` for version 1 and `patch_approved` for version 2.
- Cloud Run is intentionally constrained to max instances 1 because rate limiting and operational state are process-local. The public URL demonstrates deployment, not production readiness.
- Official Vertex AI Model Garden Monitoring shows `gemini-2.5-flash` request and token-count graphs in the last-hour window.
- A private billing capture showed an Aug 1–15 current report of ₩0 and remaining free-trial credits, with an explicit warning that costs can take hours or more than 24 hours to appear. The entrant confirms the current challenge P&L as $0 revenue, $0 expenses, and $0 net; one-page zero-revenue/P&L PDFs are saved in Devpost, while one final lag-aware cloud-cost recheck remains.

## Viability

No pricing, acquisition channel, customer willingness to pay, or retention evidence exists. The entrant confirms 1 user, 0 paying users, $0 revenue in May/June/July/August and total, $0 related-party revenue, and $0 COGS/marketing/other/total expenses. These truthful zeros describe current operation; they do not validate a business model. A plausible model would sell faster, auditable deployment reviews, but it remains a hypothesis.

## Risk feasibility

The concept is safe as a clearly labeled synthetic decision-support demo. It is not safe for real deployment authorization because approval is unauthenticated, state is ephemeral, and source data controls are absent. These limitations are acceptable only if the prototype never receives customer-confidential or safety-critical data.

## Challenge feasibility

The official challenge requires a real business with real users and revenue, an application using Google Cloud, and at least one Gemini API call in the deployed application. DeployAlign evidences the Google Cloud/Gemini portion and reports 1 actual user, but 0 paying users and $0 revenue. The exact disclosures are now available, yet zero revenue may fail the stated real-revenue requirement and no measured category impact exists. A deployed code demo alone cannot satisfy those requirements.

## Decision gate

- Technical prototype: **continue**.
- User validation: **run immediately**.
- Live Google integration: **verified for the public synthetic demo**, including request/token monitoring evidence; production-grade alerts, identity, persistence, durable audit, and final cost controls remain open.
- Production deployment: **hold** until QA, authentication, privacy, and operational controls exist.
- Devpost final submission: **hold** at 4/5 Draft until final form/link review, lag-aware cost recheck, zero-revenue rule review, and action-time approval are complete. Project Details, Additional Info, evidence uploads, public video, and Moderate learning level are saved/ready; terms and Submit remain untouched.

## Stop conditions

- Relevant practitioners do not recognize the problem after five to ten interviews.
- Source mapping produces material false grounding or reviewers cannot trust it.
- Real data cannot be processed under acceptable privacy/security constraints.
- The project cannot truthfully meet a selected challenge category and submission requirement.
