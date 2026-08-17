# Devpost Submission Draft — DeployAlign

> Status: Local draft only; **not compliance-ready and not approved for submission** · Date: 2026-08-17 · Owner: Human entrant with Codex drafting support

## Draft fields

- Project name: **DeployAlign**
- Tagline: **Compile deployment promises into evidence-linked decisions before they become field risk.**
- Category: **Professional Services Access — tentative; human decision required**
- Repository URL: **BLOCKED / not supplied**
- Working application URL: **BLOCKED / no deployment evidenced**
- Demo video URL: **BLOCKED / not recorded or published**

## Short description

DeployAlign is a synthetic proof of concept for reconciling what a customer asks for, what sales promises, and what engineering can currently evidence. It builds a typed commitment graph, flags unsupported scope, proposes the minimum reviewable patch, and shows exactly which customer, sales, and engineering sections would change after a human review.

## Narrative draft

### The problem

Deployment projects often fail before anyone reaches the field. A customer request becomes a sales promise, the promise becomes a statement of work, and engineering constraints arrive later in a separate review. Phrases such as “all materials,” “every area,” and “fully autonomous” sound decisive, but they are not finite acceptance criteria. A reviewer then has to reconcile several documents manually, under deadline pressure, and prove which evidence supports each commitment.

DeployAlign explores a narrower question: can we compile deployment intent the way engineers compile code—preserving source provenance, emitting deterministic diagnostics, and rebuilding only the downstream sections affected by an approved decision?

### What the prototype does

The bundled scenario is explicitly synthetic. It contains three fictional artifacts: a customer discovery email, a draft commercial proposal, and an application-engineering review for a Raman inspection pilot. The customer and sales text asks for all-material, facility-wide autonomous inspection. The engineering text supports only five named analytes under controlled conditions, 12 mapped areas of interest, and supervised Phase 1 operation.

DeployAlign turns those statements into typed nodes for objectives, preferences, commitments, constraints, site claims, assumptions, evidence, tests, and deployment gates. A deterministic policy layer emits six source-linked diagnostics, including unbounded scope, a commitment without evidence, a preference cast as a constraint, a site claim treated as fact, a missing acceptance criterion, and an open critical test.

The prototype then proposes the smallest three-field semantic patch: five named analytes instead of all materials, 12 mapped AOIs instead of every area, and supervised Phase 1 instead of full autonomy. A local review action advances the demo baseline from `HOLD` to `CONDITIONAL PILOT`; it never produces an unconditional pass because the blind test and physical survey remain open.

The same decision ID is carried into a customer decision memo, sales SOW, and engineering test manifest. Within the approved compile, six Decision-ID-linked sections are rebuilt while three unrelated canonical baseline sections are reused without reconstruction. Their stable FNV-1a32 values are non-cryptographic change fingerprints, not integrity hashes. Execution receipts show which stages were attributed to extraction, deterministic rules, human review, and the build engine.

### How AI and humans are separated

The code includes an opt-in Gemini extraction front end. When enabled and configured, Gemini must return structured classified statements with exact source quotes and a concise patch rationale. The server rejects ungrounded quotes, disallowed types, malformed output, or invalid rationale. The diagnostic rules, deployment gate, impact calculation, and target compilation remain deterministic.

Live model calls are disabled by default, and the application has a deterministic fallback for demonstration reliability. At the time of this draft, Google Cloud account/project/billing prerequisites have been verified, but required APIs, IAM, Secret Manager, Cloud Run deployment, a successful deployed Gemini call, runtime logs, and live cost evidence have not. Therefore this draft does **not** claim that AI is live in production.

Humans own the consequential boundaries: deciding whether a proposed patch is acceptable, supplying missing evidence and acceptance criteria, authorizing any real deployment, and approving external publication. The current review button is a local demo of that boundary, not authenticated organizational approval.

### What we learned

The central insight is that the valuable output is not more generated prose. It is a traceable decision: the exact claim that conflicts, the source evidence, the minimum bounded change, the open verification work, and the downstream impact. We also learned that a safe-looking fallback can hide whether AI actually ran, so provider and synthetic-state disclosure must be part of the product, not a footnote.

### Potential impact and next work

If validated with real deployment teams, DeployAlign could help smaller integrators and engineering-service groups apply consistent review discipline without building a large internal tooling organization. That impact is currently potential, not measured. There are no verified users, customers, jobs created, revenue, or time savings in this repository.

Next, we would test the synthetic workflow with deployment practitioners, collect consented redacted examples, benchmark classification and diagnostic accuracy, and determine whether reviewers act faster or catch more material conflicts. Only then would we add identity, tenant isolation, durable audit events, configurable policies, and production cloud operations.

## Required business evidence — unresolved

| Field | Truthful current entry |
| --- | --- |
| Real users | Not evidenced |
| User testimonials/feedback | Not evidenced |
| Total and monthly revenue | Not supplied; do not invent |
| Expenses and marketing/customer-acquisition spend | Not supplied; do not invent |
| Corporate ID | Unknown; human entrant to determine applicability |
| AI live in production | Not evidenced |
| Jobs/economic opportunities beyond founders | Potential only; no actual outcome evidenced |

## Submission decision

Do not paste or finalize this draft as a compliant entry until the repository URL, working app, public video, deployed Gemini evidence, real user evidence, and financial evidence are complete and a person has reviewed every claim against the latest official rules.
