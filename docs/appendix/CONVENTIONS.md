# Documentation and Evidence Conventions

> Status: Active · Date: 2026-08-17 · Owner: Documentarian

## Document format

- Every project document is Markdown under the numbered `docs/` structure.
- Every document begins with status, date, and owner.
- Dates use `YYYY-MM-DD`; machine timestamps use ISO 8601 UTC.
- File names are uppercase snake case except the numbered directories.
- The repository/code is the implementation source of truth; the dashboard is the coordination snapshot.

## Evidence language

Use these verbs precisely:

- **Implemented:** code exists and was inspected.
- **Authored:** a test or document exists but may not have been executed/approved.
- **Verified:** dated evidence shows the behavior occurred.
- **Configured:** a path/environment option exists; it does not prove use.
- **Deployed:** a reachable environment and deployment record exist.
- **Production:** real operation, monitoring, ownership, and support are evidenced.
- **Synthetic:** fictional demo data; never shorthand to “customer case.”

When evidence is absent, write “not evidenced,” not “zero,” unless a real record explicitly confirms zero.

## Mandatory disclosures

Any UI, screenshot, video, or submission text must preserve:

- `SYNTHETIC DEMO` for the bundled case.
- The actual provider: `gemini-vertex`, `gemini-api`, or `deterministic-demo`.
- `HOLD` versus `CONDITIONAL PILOT`; never relabel as unconditional approval.
- No real users, revenue, customer production, or measured impact unless separately verified. The public synthetic GCP deployment and live Vertex call may be claimed only with their bounded evidence and architecture limits.
- Same-model role review is not actual Claude–GPT cross-validation.

## Claims and provenance

- Link technical claims to code, test output, screenshot, API/log evidence, or a source document.
- Link competition claims to the official Devpost pages.
- Do not treat plans, environment examples, Dockerfiles, or generated receipts as proof of external execution.
- Treat `fnv1a32-*` values as non-cryptographic change fingerprints, never as SHA/integrity evidence.
- Treat the compile token as signed but readable/replayable demo context, never as authentication or confidential storage.
- Do not publish keys, tokens, project secrets, account identifiers, private financial records, PII, or raw customer text.

## Status vocabulary

- `Draft`: incomplete and not externally approved.
- `Active`: maintained during the current cycle.
- `Blocked`: cannot progress without an external state change or human action.
- `No-go`: release/submission criteria are not met.
- `Done`: locally complete with evidence appropriate to the item.

## Gate convention

The following always require a person immediately before action:

- Credential, API, IAM, quota, or secret-management changes.
- Sending non-synthetic data to an external model/service.
- Production/cloud deployment or infrastructure changes.
- Repository sharing/publication and public video upload. The repository publication gate is complete for the current public repository; future visibility changes remain gated.
- Saving/updating a Devpost draft and final submission.
- Financial, user, customer, corporate, or personal evidence disclosure.

Deadline pressure does not remove a gate.

## Code identifiers

- Diagnostics: `DA-001` through `DA-006`.
- Demo patch: `PATCH-014-A`.
- Demo decision: `DEC-014`.
- Source artifacts: `SRC-CUSTOMER-01`, `SRC-SALES-02`, `SRC-ENGINEERING-03`.
- Gate values: `HOLD`, `CONDITIONAL PILOT`.
- Provider values: `gemini-vertex`, `gemini-api`, `deterministic-demo`.

## Git/release convention

Use Conventional Commits when a repository history is established. A commit, push, tag, remote creation, or release is outside this documentation task; push/tag/public remote actions require the appropriate human authorization.
