# Decision Log

> Status: Active · Date: 2026-08-17 · Owner: Project lead

## D-001 — Use a hybrid evidence compiler

- Date: 2026-08-17
- Context: Free-form cross-document review benefits from language understanding, while deployment gates require repeatability and traceability.
- Options: manual, rules only, LLM only, hybrid, autonomous agents.
- Decision: Optional Gemini quote extraction; deterministic diagnostics, impact analysis, and target compilation; explicit human review action.
- Rationale: Best current balance of language coverage, testability, and bounded risk.
- Rejected: LLM-only and autonomous approval because they cannot establish safe deterministic gates.
- Residual risk: Hybrid complexity and fallback ambiguity.
- Approval: Implemented as a reversible prototype decision; production use still requires human approval.
- Revisit when: A real corpus shows rules-only or another architecture materially outperforms it.

## D-002 — Keep the demonstration synthetic

- Date: 2026-08-17
- Context: No authorized customer artifact or deployment evidence was supplied.
- Decision: Bundle three synthetic artifacts and set `synthetic: true` on compile results.
- Rationale: Enables a safe, repeatable demo without exposing customer or personal data.
- Rejected: Presenting synthetic facility, Raman, AOI, or commercial statements as real.
- Residual risk: Viewers may still infer a real case if labels are not persistent.
- Approval: Required language for all UI, video, narrative, and screenshots.
- Revisit when: Authenticated, consented, redacted real artifacts are available under a data agreement.

## D-003 — Bound only three scope fields

- Date: 2026-08-17
- Context: The synthetic sales promise exceeds the synthetic engineering evidence.
- Decision: Patch analyte scope, area coverage, and operating mode only; retain the blind test and aisle survey as open gates.
- Rationale: It is the smallest evidence-supported change in the demo and avoids inventing price, schedule, or performance.
- Rejected: Rewriting every document or generating an unconditional deployment pass.
- Residual risk: The demo values are not transferable to a real deployment.
- Approval: Local demo review only; not a field authorization.
- Revisit when: Source evidence or acceptance criteria change.

## D-004 — Make live Gemini calls opt-in

- Date: 2026-08-17
- Context: Public/local demos should not silently consume quota or transmit text.
- Decision: Require `ALLOW_LIVE_GEMINI=true` plus a Gemini API key or Google Cloud project configuration. Fall back deterministically when disabled or rejected.
- Rationale: Predictable cost, privacy, and demo reliability.
- Rejected: Automatic model calls whenever credentials are discoverable.
- Residual risk: Silent client fallback can obscure model/API failure.
- Approval: Any credential use or external data transmission requires a person.
- Revisit when: Production privacy, observability, and cost controls are implemented.

## D-005 — Treat all publication and submission actions as gates

- Date: 2026-08-17
- Context: Deployment, public repository/video publication, and Devpost submission have external, brand, privacy, and legal effects.
- Decision: Prepare local drafts and evidence checklists; stop before external writes without a final human review.
- Rationale: The current project lacks required business evidence and any publication may expose data or make unsupported claims.
- Rejected: Automatically publishing or finalizing because the deadline is close.
- Residual risk: Missing the competition deadline.
- Approval: Pending human decision.
- Revisit when: Ship checklist and evidence checklist have no blockers.

## D-006 — No production or Google Cloud claim without proof

- Date: 2026-08-17
- Context: A Dockerfile and Vertex-ready adapter demonstrate implementation intent, not deployment or usage. On 2026-08-17, account `chquan17`, active free-trial/billing status, and active project `project-55fbcfd2-0ad6-4c99-a25` were verified; reauthentication is no longer a blocker.
- Decision: Describe the project as local/synthetic and the live Gemini path as unverified. Treat API enablement, IAM, Secret Manager, Cloud Run deployment, a live call, logs, and cost evidence as separate human-approved gates.
- Rationale: Keeps external claims aligned with available evidence.
- Rejected: Inferring Cloud Run, Vertex usage, or continuous AI operation from configuration files.
- Residual risk: Challenge baseline cannot be met until authentic evidence exists.
- Approval: A person must review redacted cloud evidence before external use.
- Revisit when: A verified deployed live call, runtime/API logs, and cost record are archived.

## D-007 — Preserve compile provenance with a signed token

- Date: 2026-08-17
- Context: A review response must not lose or misattribute the Gemini provider/candidates from the compile being reviewed.
- Decision: Return a one-hour HMAC-SHA256 token containing the validated extraction evidence and require it for server-side review.
- Rationale: Preserves provenance without process-global user evidence and rejects malformed, expired, or tampered review context.
- Rejected: Unsigned client claims or a process-global “last result.”
- Residual risk: The payload is signed, not encrypted; an ephemeral default secret invalidates tokens after restart or across instances.
- Approval: Appropriate for the fixed synthetic demo only. Production requires secret management, token minimization, identity, and durable audit design.
- Revisit when: Multi-instance hosting or non-synthetic data is considered.
