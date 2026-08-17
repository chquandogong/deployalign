# Feasibility Report

> Status: Conditional go for technical PoC; no-go for unsupported business claims · Date: 2026-08-17 · Owner: Product and engineering

## Scorecard

Scores are 1 (weak) to 5 (strong) and reflect evidence in the repository, not aspiration.

| Item | Score | Basis | Uncertainty | Validation |
| --- | ---: | --- | --- | --- |
| User value | 2 | Material risk is plausible | No real user evidence | Five practitioner interviews |
| Pain frequency | 1 | No incident/frequency data | Very high | Collect recent examples |
| Technical feasibility | 4 | Typed compiler, API, UI, and tests are implemented | Live model/cloud verification incomplete | Controlled external cloud verification |
| Data access | 2 | Synthetic artifacts are available | Real data permissions unknown | Redacted-data pilot |
| Cost efficiency | 3 | Deterministic fallback limits model cost | Hosting/review costs unmeasured | Measure per compile and review time |
| Risk management | 3 | Source links and a human gate are designed | No auth, tenancy, or production controls | Security design and threat test |
| Differentiation | 3 | Decision-linked incremental compilation is specific | Competitor research is incomplete | Market scan and user comparison |
| Execution speed | 4 | Narrow demo can be shipped quickly | External evidence cannot be manufactured quickly | Separate product and business milestones |

Total: **22/40**. This supports a technical proof of concept, not a validated business.

## Desirability

The underlying failure mode—commercial scope exceeding engineering evidence—is credible. The code demonstrates it with a synthetic Raman-inspection case. There are no interviews, signups, active users, testimonials, or customer outcomes, so demand remains the largest unknown.

## Technical feasibility

The deterministic core is feasible and testable. The current server constrains inputs, validates Gemini quotes against source text, and emits stable diagnostic codes. After review, it rebuilds six `DEC-014`-linked sections and reuses three unrelated canonical sections from the same compile's fresh baseline. Their stable FNV-1a32 fingerprints are non-cryptographic change detectors, not integrity hashes.

Key limitations:

- Only the three disclosed synthetic artifacts are accepted; metadata or content changes are rejected.
- There is no authentication, persistence, tenant isolation, job queue, or durable audit log.
- A network-failure fallback returns the same `deterministic-demo` provider as a healthy server-side fallback, so the UI cannot currently distinguish those two paths.
- A one-hour HMAC-signed compile token now carries validated Gemini provider/candidate evidence through review. Without a configured shared `COMPILE_TOKEN_SECRET`, a restart or another instance cannot verify an earlier token.
- Google account `chquan17`, active free-trial/billing status, and active project `project-55fbcfd2-0ad6-4c99-a25` were verified on 2026-08-17; a private screenshot showed zero spend at capture time. Reauthentication is no longer a blocker.
- Required APIs, IAM, Secret Manager, Cloud Run deployment, a live Vertex/Gemini call, runtime logs, and cost evidence are still pending external-action gates.

## Viability

No pricing, acquisition channel, customer willingness to pay, operating cost, or retention evidence exists. A plausible business model would sell faster, auditable deployment reviews, but it remains a hypothesis. No revenue or expense evidence may be inferred from the prototype.

## Risk feasibility

The concept is safe as a clearly labeled synthetic decision-support demo. It is not safe for real deployment authorization because approval is unauthenticated, state is ephemeral, and source data controls are absent. These limitations are acceptable only if the prototype never receives customer-confidential or safety-critical data.

## Challenge feasibility

The official challenge requires a real business with real users and revenue, an application using Google Cloud, and at least one Gemini API call in the deployed application. The inspected repository does not provide that evidence. A code demo alone cannot satisfy those requirements.

## Decision gate

- Technical prototype: **continue**.
- User validation: **run immediately**.
- Live Google integration: **pending human-approved API/IAM/secret setup, deployment, and verified call evidence**.
- Production deployment: **hold** until QA, authentication, privacy, and operational controls exist.
- Devpost final submission: **hold** unless authentic business, user, financial, deployment, and Gemini evidence is assembled.

## Stop conditions

- Relevant practitioners do not recognize the problem after five to ten interviews.
- Source mapping produces material false grounding or reviewers cannot trust it.
- Real data cannot be processed under acceptable privacy/security constraints.
- The project cannot truthfully meet a selected challenge category and submission requirement.
