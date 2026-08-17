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
- Residual risk: A truthful submission may still be ineligible or noncompetitive; public identity and narration-rights uncertainty also remain residual risks.
- Approval: Public repository, synthetic-demo deployment, public video, form/evidence saves, exact OSS disclosure, terms acceptance, and Submit were explicitly approved and completed. Devpost confirmed `Submitted` and `5/5 steps done`.
- Revisit when: A material post-submission edit is proposed or an organizer eligibility/result notice arrives.

## D-006 — Limit Google Cloud claims to verified evidence

- Date: 2026-08-17
- Context: Configuration alone was insufficient evidence. On 2026-08-17, Cloud Build, a public Cloud Run deployment, Secret Manager binding, dedicated runtime identity, a live Vertex call, redacted runtime logs, and official Vertex request/token monitoring were subsequently verified.
- Decision: Describe the project as a public synthetic Google Cloud demo with a verified `gemini-vertex` call, never as a customer production system. Attribute only exact-quote `AI_DRAFT` classification/rationale to Gemini; deterministic TypeScript owns the canonical graph, diagnostics, gates, impact, and targets.
- Rationale: Keeps external claims aligned with available evidence.
- Rejected: Inferring Cloud Run, Vertex usage, or continuous AI operation from configuration files.
- Residual risk: Viewers may confuse deployment with production readiness or treat the billing report's capture-time ₩0 as final despite its explicit warning that reporting can take hours or more than 24 hours.
- Approval: Redacted cloud evidence was reviewed for the public demo. Business/financial claims and any post-submission edits remain human-owned.
- Revisit when: Current cost records and production-grade monitoring/identity/persistence controls are available.

## D-007 — Preserve compile provenance with a signed token

- Date: 2026-08-17
- Context: A review response must not lose or misattribute the Gemini provider/candidates from the compile being reviewed.
- Decision: Return a one-hour HMAC-SHA256 token containing the validated extraction evidence and require it for server-side review.
- Rationale: Preserves provenance without process-global user evidence and rejects malformed, expired, or tampered review context.
- Rejected: Unsigned client claims or a process-global “last result.”
- Residual risk: The payload is signed, not encrypted; an ephemeral default secret invalidates tokens after restart or across instances.
- Approval: Appropriate for the fixed synthetic demo only. Production requires secret management, token minimization, identity, and durable audit design.
- Revisit when: Multi-instance hosting or non-synthetic data is considered.

## D-008 — Deploy a tightly bounded public Cloud Run demo

- Date: 2026-08-17
- Context: Judges require a working application and at least one deployed Gemini call, while the prototype has process-local rate/state and no customer-data controls.
- Decision: Deploy the fixed synthetic fixture to Cloud Run in `asia-northeast3` with unauthenticated access, min instances 0/max 1, 1 CPU/512 MiB, 60-second timeout, concurrency 20, a dedicated runtime service account, and a stable Secret Manager HMAC secret.
- Evidence: Current revision `deployalign-00004-wgb` serves 100% of traffic at `https://deployalign-1007800160926.asia-northeast3.run.app`; health returned `ok=true`, `service=deployalign`, and `liveGemini=true`. A separately verified deployed `gemini-2.5-flash` call returned three exact-quote `AI_DRAFT` candidates and a successful receipt; redacted logs recorded compile version 1 and approval version 2.
- Rationale: Satisfies the technical demonstration need while keeping instance/state assumptions explicit.
- Residual risk: The public unauthenticated endpoint has no durable audit, tenant isolation, or production access control.
- Approval: Completed for the synthetic demo only; material deployment changes still require review.
- Revisit when: Real users or non-synthetic data are considered.

## D-009 — Use exact entrant-confirmed submission facts

- Date: 2026-08-17
- Context: Devpost requires eligibility, category, user, revenue, expense, project-history, and corporate disclosures that must not be inferred from code or screenshots.
- Decision: Use only these entrant-confirmed values: individual; Republic of Korea; adult/eligible and rules agreed; project start `06-01-26`; Professional Services Access; learning level Moderate; 1 actual user; 0 paying users; May/June/July/August/total revenue $0; related-party revenue $0; COGS/marketing/other/total expenses $0; no entrant-owned pre-existing code/assets; corporate ID N/A. Additional Info persisted the approved standard-OSS disclosure naming React, React DOM, Vite, Express, `@google/genai`, and Lucide.
- Rationale: Makes the form completeable without fabricating traction or costs.
- Residual risk: $0 revenue may not satisfy the stated real-revenue requirement, and one user without outcomes is weak category-impact evidence.
- Approval: Entrant confirmed these exact facts for the submission workflow.
- Revisit when: The entrant supplies a corrected record during the edit window; learning level remains Moderate.

## D-010 — Deploy browser-bundle license notices while documenting residual risks

- Date: 2026-08-17
- Context: The public browser bundle distributes third-party code, and the original saved Devpost response did not distinguish entrant-owned assets from standard OSS dependencies.
- Decision: Publish the full applicable browser-bundle license texts, expose them from the app footer, and persist the exact approved OSS disclosure before submission.
- Evidence: Commit `d5f9f33180a1edbdfeb8e5d4b8775a98643fd28c` deployed as revision `deployalign-00004-wgb`; `/third-party-licenses.txt` returned HTTP 200 and 3,462 bytes with React/React DOM/Scheduler MIT, Vite browser-bundle MIT, and Lucide ISC texts; `/api/health` returned the expected live configuration fields.
- Rationale: Meets the browser-bundle notice obligation without treating software-license publication as approval of unrelated form, identity, or narration-rights decisions.
- Residual risk: Public Git author name/email exposure and Microsoft Mark voice redistribution remain accepted uncertainties; acceptance is not a legal-rights determination.
- Approval: License publication and the OSS disclosure are complete. The entrant accepted the two remaining residual risks for submission.
- Revisit when: A post-submission edit, takedown, or narration replacement is considered.

## D-011 — Submit the truthful Devpost entry after explicit approval

- Date: 2026-08-17
- Context: The draft, exact disclosures, evidence, public links, and residual risks were reviewed at the action-time gate.
- Decision: Check the terms control and click Submit only after explicit user approval, preserving the truthful $0 revenue/expense, one-user, no-impact, OSS, privacy, and audio caveats.
- Evidence: Devpost displayed `Submitted` and `5/5 steps done` after refresh, with a View link to `https://devpost.com/software/test-q0h69v`; the banner read `Project submitted! Continue to edit your project until the hackathon deadline: August 17, 2026 at 04:00pm EDT.` The sidebar said `Submitted to Build with Gemini XPRIZE`.
- Rationale: Records the completed external action without converting platform acceptance into an eligibility or award claim.
- Residual risk: Organizers may determine the entry ineligible or noncompetitive; billing lag, public Git identity exposure, and Microsoft Mark redistribution uncertainty remain documented.
- Approval: Terms acceptance and Submit were explicitly approved immediately before execution.
- Revisit when: The entrant requests a material edit before the deadline or receives an official result.
