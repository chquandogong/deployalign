# Assumptions Register

> Status: Active · Date: 2026-08-17 · Owner: Project lead

| ID | Assumption | Basis | Validation method | State |
| --- | --- | --- | --- | --- |
| A-01 | Deployment teams suffer costly commitment drift across documents | Product thesis only | Five practitioner interviews and incident examples | Open |
| A-02 | Application/deployment engineers are the first user | Workflow inference | Persona interviews | Open |
| A-03 | A source-linked conflict view is more valuable than generic summarization | Design hypothesis | Compare against a manual/LLM summary task | Open |
| A-04 | Three artifacts are enough for a compelling first wedge | Demo design | Observe user tasks with real redacted cases | Open |
| A-05 | Five analytes, 12 AOIs, and supervised Phase 1 are the minimum safe scope in the demo | Synthetic engineering artifact | Deterministic tests only; not a real safety conclusion | Valid only inside demo |
| A-06 | Professional Services Access is the best challenge category | Narrative fit | Human review against actual customer/business story | Open |
| A-07 | Reviewers will accept AI extraction when quotes are exact and policy checks are deterministic | Architecture hypothesis | Trust and error-rate study | Open |
| A-08 | A live Gemini call can be completed through Vertex AI or a Gemini API key | Code path exists; account/project access is verified | Human-approved API/IAM/credential setup, deployment, and redacted call evidence | Open; reauthentication cleared |
| A-09 | Browser fallback is useful for demos | Resilience design | Test failure comprehension with provider badge | Open risk |
| A-10 | The current demo review action is sufficient to explain a human gate | UI/flow hypothesis | Usability test | Open; not a security control |

## Known facts, not assumptions

- All bundled source artifacts are synthetic.
- Live Gemini calls are disabled by default.
- The deterministic compiler can run without network access.
- The server accepts only the three disclosed synthetic artifacts; count, metadata, or content changes are rejected before any Gemini prompt.
- The demo begins at version 1 and advances to version 2 after the expected patch/version request.
- Server review also requires an unexpired HMAC-signed compile token; it preserves validated model provenance but is not encrypted or a durable audit record.
- Two evidence gates remain open after the demo patch; the result is `CONDITIONAL PILOT`, not `PASS`.
- On 2026-08-17, Google account `chquan17` was signed in, free-trial/billing status was active, and project `project-55fbcfd2-0ad6-4c99-a25` was active. A private screenshot recorded zero spend at capture time.
- API enablement, IAM permissions, Secret Manager binding, Cloud Run deployment, a live Vertex/Gemini call, runtime logs, and live cost evidence remain unverified external actions.
- No repository evidence establishes real users, revenue, production operation, Google Cloud deployment, or a completed submission.
- The cross-review in `CROSS_VALIDATION_LOG.md` is same-model/role-based and is not an actual independent Claude review.

## Prohibited assumptions

Do not infer or state any of the following without evidence:

- A real semiconductor facility, customer, robot, incident, contract, or pilot exists.
- The Raman numbers describe a validated real-world system.
- Google Cloud or Gemini has been used successfully in production.
- Any user count, revenue amount, expense amount, conversion, time saving, or risk reduction.
- A Devpost project is eligible, saved, published, or submitted.
