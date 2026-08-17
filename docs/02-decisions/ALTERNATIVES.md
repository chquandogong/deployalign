# Alternatives

> Status: Category selected; final submission posture still needs human approval · Date: 2026-08-17 · Owner: Product lead

## Decision 1: Product/technical approach

### Selection criteria

- Reviewer value and speed.
- Source traceability and deterministic repeatability.
- Failure containment for safety-relevant claims.
- Build speed and operating cost.
- Reversibility and future extensibility.

### Options

| Option | Description | Advantages | Costs and risks | Failure condition | Validation |
| --- | --- | --- | --- | --- | --- |
| A. Manual checklist | A reviewer reconciles three documents without software | Cheapest, transparent, useful demand test | Slow, inconsistent, no impact graph | Review burden is too low to justify software | Timed practitioner exercise |
| B. Rules only | Regex/domain rules extract and check every statement | Deterministic, low cost | Brittle language coverage; high rule maintenance | Real phrasing escapes rules | Redacted corpus benchmark |
| C. LLM only | A model summarizes, diagnoses, rewrites, and approves | Fast broad language handling | Hallucination, unstable gates, weak auditability | Same input yields unsupported decisions | Repeatability and grounding tests |
| D. Hybrid compiler | Gemini proposes quote-grounded types; rules diagnose and compile; human reviews | Balances language coverage, auditability, and control | More components; boundary must be clear | Users cannot understand which actor decided what | Usability plus benchmark tests |
| E. Autonomous workflow | Agents ingest systems, modify documents, and publish decisions | Highest automation potential | Premature, high security and organizational risk | One bad action changes a contract/deployment | Not appropriate before real validation |

Scores are 1 (weak) to 5 (strong).

| Criterion | A | B | C | D | E |
| --- | ---: | ---: | ---: | ---: | ---: |
| User leverage | 2 | 3 | 4 | 5 | 5 |
| Delivery speed | 5 | 3 | 4 | 4 | 1 |
| Traceability | 4 | 5 | 2 | 5 | 1 |
| Risk containment | 5 | 4 | 1 | 4 | 1 |
| Maintainability | 3 | 2 | 3 | 4 | 1 |
| Testability | 3 | 5 | 2 | 5 | 1 |
| Total | 22 | 22 | 16 | **27** | 10 |

### Recommendation

Use **D, the hybrid compiler**, while running A as the demand-validation baseline. The implementation follows this split: optional Gemini extraction, deterministic diagnostics/compilation, and a review boundary.

### Residual risk

The current Gemini output is surfaced as separate `AI_DRAFT` candidate nodes and can supply the patch rationale/provider receipt; deterministic graph nodes, diagnostics, gates, and target compilation do not depend on those candidates. The public Cloud Run demo verified one `gemini-vertex` path with three exact-quote candidates, but that does not prove customer production operation or transfer deterministic decisions to the model. The UI must clearly show when the fallback path is active.

## Decision 2: Challenge category

| Option | Fit | Weakness | Evidence needed |
| --- | --- | --- | --- |
| Professional Services Access | Structured expert-grade deployment review | Industrial teams may not match “everyday people” framing | Real user profile and access outcome |
| Small Business Services | Helps small integrators deliver safer, more consistent projects | No small-business customer is evidenced | User/company size and business outcome |
| Entrepreneurship & Job Creation | Could expand deployment-engineering capacity | Job creation is currently potential only | Actual jobs/opportunities beyond founders |
| Do not submit yet | Avoids an unsupported category narrative | Misses current deadline | Decide whether truthful eligibility can be met |

### Recommendation

The entrant selected **Professional Services Access**. Keep the category story bounded: 1 actual user is confirmed, but there is no measured access outcome, testimonial, or paying user. Do not convert category selection into an impact claim.

## Decision 3: Submission posture

| Option | Benefit | Cost/risk | Judgment |
| --- | --- | --- | --- |
| Invent customers, outcomes, or nonzero revenue | Appears complete | False, unverifiable, disqualifying, unethical | Reject |
| Finalize the current deployed demo as if the business evidence were complete | Meets deadline mechanically | Conflicts with explicit business/user/revenue/expense requirements | Reject |
| Save a truthful draft only | Preserves work without making unsupported claims | Final action still requires a separate approval | Current state: 4/5 Draft saved with Project Details, Additional Info, and evidence uploads |
| Pause until authentic evidence exists | Preserves integrity | Likely misses this submission window | Recommended if requirements remain unmet |

Public repository, bounded demo deployment, overview-draft save, and public video gates are complete. Future material draft/deployment/video changes and final submission remain separate human approval gates.
