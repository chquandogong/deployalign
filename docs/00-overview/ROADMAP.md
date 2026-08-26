# Roadmap — from submitted prototype to a tool people use

> Status: Active · Date: 2026-08-26 · Owner: Project lead

## What "useful" has to mean here

DeployAlign is useful when a deployment or solutions engineer can point it at **their
own** customer note, proposal and engineering review and get back something they act
on: the exact statements that conflict, the smallest evidence-supported scope change,
and the downstream sections that move. Today the prototype proves the mechanism on one
synthetic case. Every item below is judged by how much closer it gets a practitioner to
that moment, not by feature count.

| Signal we will measure | Today (0.2.0) | Target before calling it useful |
| --- | --- | --- |
| Artifacts the tool accepts | the 3 disclosed synthetic ones | any 3 redacted texts a user supplies (local mode) |
| Diagnostics that generalise beyond the fixture | 0 of 6 (fixture-bound) | 6 of 6 as pattern/evidence detectors with tests |
| Practitioners who recognise the problem | 0 interviewed | ≥ 3 of 5 identify a real analogue |
| Reviewers who ask to run their own documents | 0 | ≥ 2 |
| Time from paste to reviewable patch | n/a | < 2 minutes on a laptop, no cloud required |

## Phases

### 0.2 — Honest, current, testable *(shipped 2026-08-26)*

- Execution-origin label so a browser fallback cannot pass for a server run.
- Default model `gemini-3.7-flash`; `thinkingLevel` for Gemini 3, `thinkingBudget: 0` for 2.5.
- API contract tests, Gemini validator tests, CI, contributing/security policy.
- README in English, Korean and Chinese; demo video v2 pipeline.

### 0.3 — Bring your own artifacts (local mode) · *needs owner decision D-016*

The public demo keeps its fixture-only guard (it is a security boundary for an
unauthenticated endpoint). Locally, behind `ALLOW_CUSTOM_ARTIFACTS=true`, the tool
accepts three user-supplied texts and:

1. asks Gemini to extract and type *all* atomic statements with exact quotes (same
   validator as today, no longer capped at three);
2. runs the six diagnostics as real detectors over the typed graph:
   - `DA-001 UNBOUNDED_SCOPE` — universal quantifiers (`all`, `every`, `any`, `entire`,
     `fully`) in a `SalesCommitment` without an enumerated `ScopeClause`;
   - `DA-002 COMMITMENT_WITHOUT_EVIDENCE` — a commitment with no `SUPPORTED_BY` edge
     to `Evidence` covering the same subject;
   - `DA-003 PREFERENCE_CAST_AS_CONSTRAINT` — a `CustomerPreference` restated as
     `mandatory`/`required` in sales text;
   - `DA-004 SITE_CLAIM_CAST_AS_FACT` — a `SiteClaim` marked `about`/`approximately`/
     `customer-reported` used as a constraint;
   - `DA-005 MISSING_ACCEPTANCE_CRITERION` — acceptance language without a measurable
     threshold, count or method;
   - `DA-006 OPEN_CRITICAL_TEST_BLOCKS_GATE` — an `OPEN` `VerificationTest` that
     `REQUIRES_TEST`-links the gate;
3. proposes the minimum patch from the evidence envelope (values copied from
   `Evidence`/`EngineeringConstraint` quotes, never invented);
4. exports the three targets as Markdown and the graph as JSON.

Success: the fixture reproduces byte-for-byte through the general path, and two of five
practitioners' redacted samples yield at least one diagnostic they agree is material.
Stop: detectors produce mostly false positives on real phrasing, or no practitioner will
share even redacted text.

**Gate:** sending non-synthetic text to a model is a privacy decision. Default off,
local only, documented in the runbook, and approved by the repository owner first.

### 0.4 — CLI and CI mode

`deployalign compile ./artifacts --out ./targets --fail-on blocker`. The decision graph
and targets become files that live next to the proposal in version control, so a SOW
edit that outruns engineering evidence fails the docs pipeline the same way a type error
fails a build. This is where "decision compiler" stops being a metaphor.

### 0.5 — Practitioner pilot

Five interviews with deployment / application / solutions engineers; redacted samples;
measure diagnostic precision against their manual review and time-to-decision. Only the
pilot result decides whether identity, persistence, durable audit and policy
configuration are worth building.

### Later, only if the pilot says so

Identity and signed approvals · tenant-scoped persistence · durable audit events ·
configurable rule packs per organisation · document parsers (PDF, DOCX, email threads).

## Non-goals (unchanged)

Robot control, safety certification, contract authorisation, autonomous approval,
inventing prices, dates or measurements, and any claim of production readiness or
traction that is not evidenced.

## Decisions waiting on the owner

| ID | Decision | Default if silent |
| --- | --- | --- |
| D-016 | Approve the 0.3 custom-artifact design and its privacy posture | Not started |
| D-017 | Redeploy Cloud Run with 0.2.0 (`gemini-3.7-flash`) and verify a live receipt | Public demo stays on 0.1.0 |
| D-018 | Upload demo video v2 and swap the README link | README keeps the 2026-08-17 video |
| D-019 | Keep synthesized narration (edge-tts voice) or record a human voice | Synthesized, with the licence note kept in the demo script |
