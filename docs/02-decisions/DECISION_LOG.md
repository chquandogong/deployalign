# Decision Log

> Status: Active · Date: 2026-08-26 (0.3.0) · Owner: Project lead

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

## D-012 — Continue the project after submission as an open-source tool

- Date: 2026-08-26
- Context: The Devpost submission closed on 2026-08-17. The owner wants the repository to keep improving toward a tool practitioners actually use, independent of the competition outcome.
- Options: archive the repository as a submission record; keep it frozen until an organizer result; continue development in the open with an explicit roadmap.
- Decision: Continue in the open. Treat the 2026-08-17 state as release `0.1.0`, ship `0.2.0` as a hygiene-and-honesty cycle, and publish `docs/00-overview/ROADMAP.md` with measurable "useful" criteria.
- Rationale: The mechanism is proven on a synthetic case; the value question can only be answered by putting it in front of practitioners, which requires a runnable, documented, current codebase.
- Rejected: Archiving — it would waste the deterministic core; freezing — Gemini 2.5 Flash is on a retirement track and the repo would stop working.
- Residual risk: Effort spent before demand is validated. Mitigation: the roadmap gates 0.3+ on practitioner signals and owner decisions D-016–D-019.
- Approval: Owner instruction to "keep updating and make it a truly useful tool" (2026-08-26).
- Revisit when: Five practitioner interviews are done or an organizer result arrives.

## D-013 — Move the default extraction model to `gemini-3.7-flash`

- Date: 2026-08-26
- Context: `gemini-2.5-flash` was the 0.1.0 default. Google's Vertex AI release notes list 2026-10-16 as its retirement date; `gemini-3.7-flash` reached general availability on 2026-08-13 and is already used in the owner's sibling project on Vertex AI (`global` location).
- Options: keep 2.5 Flash until retirement; move to `gemini-3.5-flash` (GA May 2026); move to `gemini-3.7-flash`; make the model mandatory configuration with no default.
- Decision: Default `GEMINI_MODEL` to `gemini-3.7-flash`; select `thinkingLevel: LOW` for Gemini 3 models and `thinkingBudget: 0` for 2.5 models (`thinkingConfigFor`); add `GEMINI_THINKING_LEVEL` for overrides; keep `GEMINI_MODEL` as the pin.
- Rationale: A default that stops working in seven weeks is a defect. 3.7 Flash is GA, current, and the thinking-level switch is required because Gemini 3 rejects a zero budget.
- Rejected: No default — it makes the local quick-start fail; 3.5 Flash — no advantage over the newer GA model.
- Residual risk: **Not live-verified in this cycle** (no credentials in the build environment); the public Cloud Run revision still runs 2.5 Flash until D-017. The first deploy with the new default must confirm a live receipt.
- Approval: Reversible code change within the owner's update instruction.
- Revisit when: A live receipt exists, or Google changes 3.7 Flash availability on the `global` endpoint.

## D-014 — Label execution origin on every compile result

- Date: 2026-08-26
- Context: Risk R-05 (open since 0.1.0): a browser-side exact-fixture fallback returned the same `deterministic-demo` provider as a healthy server-side deterministic run, so the UI could not tell them apart.
- Options: remove the browser fallback; add a separate provider value; add an orthogonal `executionOrigin` field.
- Decision: Add `executionOrigin: 'server' | 'browser'` to `CompileResult`. Only `server/app.ts` labels results `server`; `compileDemo` defaults to `browser`. The UI shows an origin chip, origin-aware notices, receipts context and footer.
- Rationale: Provider (which engine) and origin (which process) are different facts; conflating them is what caused the ambiguity. The fallback stays because it keeps the demo usable offline, and it is now visibly labelled.
- Rejected: Removing the fallback — loses offline demo value; overloading `provider` — muddles the model-attribution contract that the receipts depend on.
- Residual risk: A malicious client can still fabricate any label locally; the field is disclosure, not integrity. Server results remain the only authoritative ones (token-bearing).
- Approval: Reversible code change; covered by domain and API tests.
- Revisit when: Real users report confusion, or the fallback is removed in a production design.

## D-015 — Rebuild the demo video with a narration-first pipeline and publish docs in three languages

- Date: 2026-08-26
- Context: The 2026-08-17 video predates 0.2.0 and its source render is not available. The owner asked for a refreshed video and for English, Korean and Chinese documentation.
- Options: keep the old video; re-record manually; rebuild with the narration-first Playwright + edge-tts pipeline already proven in the owner's sibling project.
- Decision: Rebuild with the narration-first pipeline (`docs/submission/DEMO_SCRIPT.md`), synthesized `en-US-AndrewMultilingualNeural` narration, burned-in English captions and EN/KO/ZH subtitle files; write `README.md`, `README.ko.md`, `README.zh.md` as full translations with English as the source of truth.
- Rationale: Reproducible builds beat manual recording for a project that will keep changing; three READMEs match the owner's other repositories.
- Rejected: Keeping the old video — it shows the pre-0.2 UI and the old model; manual recording — not reproducible.
- Residual risk: Synthesized-voice redistribution terms remain uncertain (carried from R-12); translations can drift — CONTRIBUTING requires changing all three READMEs together.
- Approval: Local render is reversible. **Uploading to YouTube and swapping the README link is a publication gate (D-018) and was not performed autonomously.**
- Revisit when: The owner uploads v2 or chooses a human voice (D-019).

## D-016 — Ship "bring your own artifacts" as a local-only general compiler (0.3.0)

- Date: 2026-08-26
- Context: The owner approved the roadmap's next cycle ("go"). The fixture-only prototype proves a mechanism but cannot be used on anyone's real documents.
- Options: (a) relax the fixture guard everywhere; (b) a local-only mode behind a flag with a general compiler; (c) Gemini-only extraction for custom documents; (d) wait for practitioner interviews first.
- Decision: (b). `ALLOW_CUSTOM_ARTIFACTS=true` enables a deterministic general path — clause extraction, role-aware lexical typing, DA-001–DA-006 as detectors, patch values copied verbatim from engineering statements, three generic targets. The public demo keeps the fixture guard. Gemini stays an optional, separately-shown candidate layer with a hardened prompt for untrusted text.
- Rationale: A reviewer can only judge the tool on their own text; a deterministic baseline is testable offline and keeps "rules own the gate" true even when no model is configured.
- Rejected: (a) would send arbitrary text to Gemini on the public endpoint; (c) is unverifiable without credentials and would make the gate depend on a model; (d) leaves nothing for practitioners to try.
- **Amended acceptance criterion:** the roadmap said the fixture must reproduce "byte-for-byte" through the general path. That is impossible — the canonical nodes are hand-authored labels ("Detect hazardous leaks") that do not appear in the source text. The criterion is now: same six codes with the same severities, the three canonical patch categories with values taken from the engineering clauses, `HOLD` → `CONDITIONAL PILOT`, DA-004/DA-006 still open after review, unrelated sections keep their fingerprints. Verified by `src/domain/general/general.test.ts`.
- Residual risk: lexical detectors over/under-fire on unfamiliar phrasing (R-22); user text reaches Gemini when both flags are on (R-23); English only.
- Approval: Owner "go" on 2026-08-26 to the proposed next cycle; local-only default keeps the privacy posture unchanged for the public demo.
- Revisit when: two practitioners have run redacted documents through it (roadmap 0.5).

## Owner decision queue

| ID | Decision | Default if silent | Gate type |
| --- | --- | --- | --- |
| D-016 | ~~Approve the 0.3 local-mode design~~ — approved and shipped in 0.3.0 (see entry above) | Done | — |
| D-017 | Redeploy Cloud Run with 0.2.0 and verify a live `gemini-3.7-flash` receipt | Public demo stays on 0.1.0 / 2.5 Flash | Production deployment |
| D-018 | Upload demo video v2 and swap the README/YouTube links | README keeps the 2026-08-17 video | Public publication |
| D-019 | Synthesized narration voice vs. human recording | Synthesized, licence note kept | Brand / rights |
