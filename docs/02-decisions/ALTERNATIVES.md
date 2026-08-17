# Alternatives

> Status: Decision support; category and submission posture still need human approval · Date: 2026-08-17 · Owner: Product lead

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

The current Gemini output is surfaced as separate `AI_DRAFT` candidate nodes and can supply the patch rationale/provider receipt; deterministic graph nodes, diagnostics, gates, and target compilation do not depend on those candidates. The UI must clearly show when the deterministic path is active. A hybrid diagram does not itself prove that AI is running in production.

## Decision 2: Challenge category

| Option | Fit | Weakness | Evidence needed |
| --- | --- | --- | --- |
| Professional Services Access | Structured expert-grade deployment review | Industrial teams may not match “everyday people” framing | Real user profile and access outcome |
| Small Business Services | Helps small integrators deliver safer, more consistent projects | No small-business customer is evidenced | User/company size and business outcome |
| Entrepreneurship & Job Creation | Could expand deployment-engineering capacity | Job creation is currently potential only | Actual jobs/opportunities beyond founders |
| Do not submit yet | Avoids an unsupported category narrative | Misses current deadline | Decide whether truthful eligibility can be met |

### Recommendation

Treat **Professional Services Access** as a draft preference, not a fact. A human should choose only after matching the category to authentic users and evidence. If that evidence does not exist, do not force a category story.

## Decision 3: Submission posture

| Option | Benefit | Cost/risk | Judgment |
| --- | --- | --- | --- |
| Invent missing customers/revenue/GCP evidence | Appears complete | False, unverifiable, disqualifying, unethical | Reject |
| Finalize the current code demo as if eligible | Meets deadline mechanically | Conflicts with explicit business/user/revenue/deployed-Gemini requirements | Reject |
| Save a truthful draft only | Preserves work without making unsupported claims | Still requires account and external-write approval | Consider with human approval |
| Pause until authentic evidence exists | Preserves integrity | Likely misses this submission window | Recommended if requirements remain unmet |

External repository sharing, deployment, public video upload, saving a Devpost draft, and final submission are separate human approval gates.
