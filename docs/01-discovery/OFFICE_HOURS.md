# Garry Tan–Style Office Hours Review

> Status: Complete for prototype; demand unvalidated · Date: 2026-08-17 · Owner: Product lead

## Original request

Implement the product concept reflected in the supplied planning conversation and submit it to the Build with Gemini XPRIZE challenge.

## Reframed problem

The valuable problem is not “generate more deployment documents.” It is preventing unsupported promises from silently propagating across customer, sales, and engineering artifacts before a field decision is made.

The competition submission is a distribution deadline, not evidence that the problem or business is real.

## Real user

The narrow initial persona is an application/deployment engineer who must reconcile a customer request, a commercial promise, and an engineering evidence envelope before approving a bounded pilot.

This persona is inferred. No named or interviewed user is evidenced.

## Strength of pain evidence

| Evidence | Current state |
| --- | --- |
| Recent real incident | None supplied |
| Interview quotes | None supplied |
| Frequency or cost | Unknown |
| Existing workaround | Assumed manual document review |
| Willingness to pay | Unknown |

Conclusion: the risk is plausible and high-consequence, but desirability remains unvalidated.

## Why use AI

AI can propose typed statements from messy text and accelerate cross-document comparison. It should not own safety gates or invent missing evidence. The current hybrid boundary—Gemini for optional extraction, deterministic checks for policy, human review for the decision—is the smallest credible use of AI here.

## What not to build yet

- Autonomous approval or field authorization.
- A general contract-management platform.
- Robot control, sensor integration, or safety certification.
- Multi-tenant storage before authentication and data governance.
- Revenue, customer, or deployment claims that do not exist.

## Smallest useful wedge

- User: one deployment engineer.
- Input: three artifacts for one synthetic pilot.
- Pain: an unbounded promise conflicts with measured engineering evidence.
- Output: source-linked diagnostics, one bounded patch, and affected downstream sections.
- One-week validation: place the prototype in front of five relevant practitioners and measure whether it finds a missed conflict or reduces review time.
- Success signal: at least three practitioners identify a real analog and two ask to test their own redacted artifacts.
- Stop signal: practitioners see no material risk, cannot trust source mapping, or refuse to provide even redacted samples.

## Execution alternatives

1. Do nothing; rely on existing reviews.
2. Use a manual cross-document checklist.
3. Build deterministic phrase/rule checks only.
4. Use AI extraction plus deterministic policy and a human gate—the implemented direction.
5. Use an autonomous AI agent to rewrite and approve deployment artifacts.

Alternative 4 best balances speed, traceability, and reversibility. Alternative 2 is the cheapest demand test and should run in parallel before further platform investment.

## Ten-star direction

The “magic” moment is not prose generation. It is clicking one decision and seeing exactly which source claims conflict, which six Decision-ID-linked sections rebuild, which three unrelated canonical sections are reused from that compile's fresh baseline, and which unresolved test still blocks deployment.

A ten-star version would support real documents, role-based approvals, tenant isolation, policy configuration, and audit export—but only after the narrow wedge is validated.

## Recommendation

Continue the technical proof of concept and run a manual/user-validation experiment. Do not equate prototype completion with challenge readiness or business viability.

## Remaining questions

- Who owns this review today, and how long does it take?
- What failure has cross-document drift caused recently?
- Which policy checks are universal versus customer-specific?
- Is source text allowed to leave the customer environment?
- Would teams pay for prevention, auditability, or faster review?

## Next validation action

Recruit five deployment, application, or solutions-engineering practitioners. Show only the synthetic case first, then request consented, redacted examples. Record false positives, missing rules, time-to-decision, and willingness to pilot.
