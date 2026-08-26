# Devpost Submission Record — DeployAlign

> Status: **Submitted; 5/5 steps done** · Date: 2026-08-17 · Owner: Human entrant with Codex drafting support

> **Historical record.** This document captures the 2026-08-17 Devpost submission exactly as evidenced then. The repository has moved on since (see `CHANGELOG.md`); this record is intentionally not rewritten.

Project **DeployAlign** was submitted to Build with Gemini XPRIZE after explicit user approval, terms acceptance, and the Submit action. After refresh, the management page showed `Submitted` and `5/5 steps done` with a View link to [devpost.com/software/test-q0h69v](https://devpost.com/software/test-q0h69v). The observed banner was `Project submitted! Continue to edit your project until the hackathon deadline: August 17, 2026 at 04:00pm EDT.` Submission does not establish eligibility, compliance, an award, business viability, or measured impact.

## Submitted fields

- Project name: **DeployAlign**
- Tagline: **Compile deployment promises into evidence-linked decisions before they become field risk.**
- Category: **Professional Services Access — selected by the entrant; measured category impact remains unproven**
- Repository URL: **https://github.com/chquandogong/deployalign**
- Working application URL: **https://deployalign-1007800160926.asia-northeast3.run.app**
- Demo video URL: **https://youtu.be/QOPgHHAWOBA** — verified public, player 2:50, published Aug 17, 2026
- Public Devpost URL: **https://devpost.com/software/test-q0h69v** — HEAD 200 after submission

## Short description

DeployAlign is a synthetic proof of concept for reconciling what a customer asks for, what sales promises, and what engineering can currently evidence. It builds a typed commitment graph, flags unsupported scope, proposes the minimum reviewable patch, and shows exactly which customer, sales, and engineering sections would change after a human review.

## Submitted story

### The problem

Deployment projects often fail before anyone reaches the field. A customer request becomes a sales promise, the promise becomes a statement of work, and engineering constraints arrive later in a separate review. Phrases such as “all materials,” “every area,” and “fully autonomous” sound decisive, but they are not finite acceptance criteria. A reviewer then has to reconcile several documents manually, under deadline pressure, and prove which evidence supports each commitment.

DeployAlign explores a narrower question: can we compile deployment intent the way engineers compile code—preserving source provenance, emitting deterministic diagnostics, and rebuilding only the downstream sections affected by an approved decision?

### What the prototype does

The bundled scenario is explicitly synthetic. It contains three fictional artifacts: a customer discovery email, a draft commercial proposal, and an application-engineering review for a Raman inspection pilot. The customer and sales text asks for all-material, facility-wide autonomous inspection. The engineering text supports only five named analytes under controlled conditions, 12 mapped areas of interest, and supervised Phase 1 operation.

DeployAlign turns those statements into typed nodes for objectives, preferences, commitments, constraints, site claims, assumptions, evidence, tests, and deployment gates. A deterministic policy layer emits six source-linked diagnostics, including unbounded scope, a commitment without evidence, a preference cast as a constraint, a site claim treated as fact, a missing acceptance criterion, and an open critical test.

The prototype then proposes the smallest three-field semantic patch: five named analytes instead of all materials, 12 mapped AOIs instead of every area, and supervised Phase 1 instead of full autonomy. A local review action advances the demo baseline from `HOLD` to `CONDITIONAL PILOT`; it never produces an unconditional pass because the blind test and physical survey remain open.

The same decision ID is carried into a customer decision memo, sales SOW, and engineering test manifest. Within the approved compile, six Decision-ID-linked sections are rebuilt while three unrelated canonical baseline sections are reused without reconstruction. Their stable FNV-1a32 values are non-cryptographic change fingerprints, not integrity hashes. Execution receipts show which stages were attributed to extraction, deterministic rules, human review, and the build engine.

### How AI and humans are separated

The deployed application uses `gemini-2.5-flash` through Vertex AI as a constrained extraction front end. Gemini must return exactly three structured classified statements with exact source quotes and a concise patch rationale. The server rejects ungrounded quotes, disallowed types, malformed output, or invalid rationale. The canonical graph, diagnostic rules, deployment gate, impact calculation, and target compilation remain deterministic TypeScript.

Live model calls are disabled by default in the code, and the application has a deterministic fallback for demonstration reliability. For the public synthetic demo, live execution was explicitly enabled on Cloud Run in `asia-northeast3` with a dedicated runtime service account and a stable HMAC secret from Secret Manager. A deployed compile showed provider `gemini-vertex`, exactly three quote-grounded `AI_DRAFT` candidates, and a successful `gemini-2.5-flash` receipt. The signed provenance survived the review transition from `HOLD` to `CONDITIONAL PILOT`; redacted logs recorded the version-1 compile and version-2 approval. Official Vertex AI Model Garden Monitoring also showed model-request and token-count activity for `gemini-2.5-flash`. This verifies one deployed Google Cloud/Gemini path, not customer production or AI ownership of the deterministic decisions.

Humans own the consequential boundaries: deciding whether a proposed patch is acceptable, supplying missing evidence and acceptance criteria, authorizing any real deployment, and approving external publication. The current review button is a local demo of that boundary, not authenticated organizational approval.

### What we learned

The central insight is that the valuable output is not more generated prose. It is a traceable decision: the exact claim that conflicts, the source evidence, the minimum bounded change, the open verification work, and the downstream impact. We also learned that a safe-looking fallback can hide whether AI actually ran, so provider and synthetic-state disclosure must be part of the product, not a footnote.

### Potential impact and next work

If validated with real deployment teams, DeployAlign could help smaller integrators and engineering-service groups apply consistent review discipline without building a large internal tooling organization. The entrant confirms 1 actual user and 0 paying users, but no customer, testimonial, job, measured outcome, or time saving. May, June, July, August, total, and related-party revenue are each $0; COGS, marketing, other, and total expenses are each $0. These exact values describe an early experiment, not traction or category impact. Actual jobs or economic opportunities beyond the founder are currently none; any future opportunity is only a potential outcome and is not yet measured.

Next, we would test the synthetic workflow with deployment practitioners, collect consented redacted examples, benchmark classification and diagnostic accuracy, and determine whether reviewers act faster or catch more material conflicts. Only then would we add identity, tenant isolation, durable audit events, configurable policies, and production cloud operations.

## Entrant-confirmed facts and submitted evidence

| Field | Truthful current entry |
| --- | --- |
| Eligibility/rules | Entrant attests adult/eligible and rules agreed; no organizer eligibility determination is claimed |
| Project start date (`MM-DD-YY`) | `06-01-26` (June 1, 2026) |
| Submitter type and country | Individual; Republic of Korea |
| Category | Professional Services Access — selected |
| Learning level | Moderate |
| Real users | 1 |
| Paying users | 0 |
| User testimonials/feedback | Not evidenced |
| Total and monthly revenue | May $0; June $0; July $0; August $0; total $0 |
| Related-party revenue | $0 |
| Total expenses, breakdown, COGS, and marketing/customer-acquisition spend | COGS $0; marketing/customer acquisition $0; other $0; total $0 |
| Current simple P&L | Revenue $0; expenses $0; net $0 |
| Corporate ID | N/A for the individual entrant |
| Pre-existing resources | Persisted exactly: `No entrant-owned pre-existing code or assets. Built during the hackathon using standard open-source frameworks and libraries (React, React DOM, Vite, Express, @google/genai, and Lucide) under their respective licenses.` |
| Revenue-evidence PDF and P&L evidence upload | Saved in Devpost after local visual verification |
| AI-native operations / live AI | Deployed Vertex extraction is evidenced only for the synthetic demo; business-operation claims are not evidenced |
| Jobs/economic opportunities beyond founders | Actual jobs/opportunities: none; future opportunity is potential only and not measured |

## Submitted Additional Info form map

The following records the submitted fields and uploads. Do not reinterpret platform acceptance as organizer verification.

| Form field | Prepared status / evidence source |
| --- | --- |
| Revenue-evidence PDF | Saved in Devpost |
| Project start (`MM-DD-YY`) | Persisted: `06-01-26` |
| Submitter type | Persisted: Individual |
| Country | Persisted: Republic of Korea |
| Category | Persisted: Professional Services Access |
| Impact and measurement answers | Persisted as a bounded early-stage disclosure: 1 user, no measured outcome; no impact claim |
| Business model and sustainability answers | Ground in 1 user, 0 paying users, $0 revenue/expense, and the hypothetical future model; do not claim viability |
| AI-native operations and live-AI answers | May cite the bounded deployed Vertex extraction, receipt, and logs; must preserve deterministic TypeScript boundary |
| Google Cloud and Gemini answers | Cloud Run/Cloud Build/Secret Manager/Vertex facts are verified for the synthetic demo |
| Public repository | `https://github.com/chquandogong/deployalign` |
| Runtime evidence upload | Saved as exactly five reviewed files: `cloud-billing-current-zero-lag-warning.png`, `vertex-gemini-observability-metrics.png`, `live-vertex-approved.png`, `live-vertex-receipts.png`, `cloud-run-config.png`; older `cloud-run-live-logs.png` removed |
| Pre-existing resources | Persisted exactly: `No entrant-owned pre-existing code or assets. Built during the hackathon using standard open-source frameworks and libraries (React, React DOM, Vite, Express, @google/genai, and Lucide) under their respective licenses.` |
| Total and monthly revenue | Ready: May $0; June $0; July $0; August $0; total $0 |
| Related-party revenue | Ready: $0 |
| Total expenses, breakdown, COGS, and marketing spend | Ready: COGS $0; marketing $0; other $0; total $0 |
| Users and paying users | Ready: 1 user; 0 paying users |
| Learning level | Ready: Moderate |
| P&L evidence upload | Saved in Devpost |

## Submission confirmation

Terms were accepted and Submit was clicked after explicit user approval. Devpost then showed `Submitted`, `5/5 steps done`, `Submitted to Build with Gemini XPRIZE`, the exact confirmation banner above, and the public URL [devpost.com/software/test-q0h69v](https://devpost.com/software/test-q0h69v). Public Git author name/email exposure and Microsoft Mark voice redistribution uncertainty were accepted as residual risks, not resolved as legal/privacy conclusions. One user, 0 paying users, and $0 revenue may still affect eligibility or competitiveness; no eligibility or award claim is made.
