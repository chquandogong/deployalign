# DeployAlign Specification

> Status: Prototype 0.5.0 implemented; local QA passed; public demo runs 0.3.0 on gemini-3.7-flash · Date: 2026-08-26 · Owner: Product and engineering

## Problem definition

Reviewers need to identify when customer objectives, sales commitments, and engineering evidence disagree, then make the smallest traceable scope decision without silently rewriting unrelated content.

## Users

- Primary: application/deployment engineer.
- Secondary: solutions sales and customer facilities owner.
- Current state: entrant confirms 1 actual user and 0 paying users; target-persona fit, feedback, and outcomes remain unverified.

## Core scenario

1. Load three clearly labeled synthetic artifacts.
2. Compile typed nodes, edges, diagnostics, and a proposed patch.
3. Inspect exact source references and unresolved blockers.
4. Review the proposed three-field patch.
5. Trigger the demo review action.
6. Compare changed, invalidated, rebuilt, and unchanged targets.
7. Confirm the result remains conditional because critical evidence is open.

## Scope

### Required in the current prototype

- Synthetic source artifact display.
- Typed commitment graph and source mappings.
- Deterministic diagnostic rules with stable codes.
- Bounded semantic patch with a stable decision ID.
- Explicit pre/post review state.
- Incremental target compilation and stable FNV-1a32 change fingerprints (not integrity hashes).
- Execution receipts identifying Gemini, rules, human review, and build stages.
- Opt-in live Gemini extraction with exact-quote validation; verified on the public Cloud Run demo with `gemini-2.5-flash` through Vertex AI.
- Deterministic fallback that is visible to the user.
- Execution-origin disclosure (`server` vs `browser`) on every compile result (0.2.0).
- Automated API contract coverage for bounds, tokens, rate limit and startup guards (0.2.0).

### Excluded

- Real robot, sensor, ERP, CRM, document-system, or identity integration.
- File upload, persistence, or multi-tenancy. (Pasting your own three texts is supported **locally** since 0.3.0 behind `ALLOW_CUSTOM_ARTIFACTS`; the public demo remains fixture-only.)
- Production authorization, electronic signature, safety certification, or contract approval.
- Invented acceptance thresholds, pricing, schedules, users, or financial data.
- Automatic publication, material deployment changes, or competition submission.

## Functional requirements

| ID | Requirement | Priority | Acceptance criterion |
| --- | --- | --- | --- |
| FR-01 | Accept only the three disclosed synthetic artifacts | Must | Count, metadata, or content changes return a bounded error before Gemini |
| FR-02 | Limit each artifact to 8,000 characters | Must | Oversized artifacts are rejected before compile |
| FR-03 | Represent commitments as typed nodes with source references | Must | Returned nodes match the declared type model |
| FR-04 | Emit six known diagnostics for the default pre-review sample | Must | Codes DA-001 through DA-006 are present |
| FR-05 | Ground every diagnostic quote in its source artifact | Must | Unit test verifies substring presence |
| FR-06 | Keep the initial gate on `HOLD` with four unresolved blockers | Must | Deterministic unit test passes |
| FR-07 | Propose only analyte, coverage, and operating-mode changes | Must | Patch contains exactly three fields |
| FR-08 | Require version 1, patch `PATCH-014-A`, and an unexpired signed compile token for server review | Must | Missing, mismatched, expired, or tampered context returns HTTP 409 |
| FR-09 | Advance to version 2 and `CONDITIONAL PILOT`, not `PASS` | Must | Unit test verifies both states |
| FR-10 | Rebuild the six `DEC-014`-linked sections and reuse the three unrelated canonical sections from the same compile's fresh baseline | Must | Impact IDs are exact; rebuilt sections are new objects, unrelated sections are not reconstructed, and their FNV-1a32 fingerprints remain stable; no integrity property is claimed |
| FR-11 | Use decision `DEC-014` across all changed targets | Must | Unit test verifies every changed section |
| FR-12 | Attempt live Gemini only when explicitly enabled and configured | Must | Default health reports live model disabled |
| FR-13 | Validate Gemini JSON, allowed types, exact quotes, and rationale length | Must | Invalid extraction is rejected and deterministic result remains available |
| FR-14 | Show provider, synthetic state, and open gates | Must | Visual QA confirms persistent disclosure |
| FR-15 | Present customer memo, SOW, and engineering test manifest outputs | Should | Each target shows status, sections, source/decision linkage, and change fingerprints |
| FR-16 | Keep all node/diagnostic/edge references valid after review | Must | Unit tests find no dangling references |
| FR-17 | Keep Gemini classifications separate from the deterministic decision graph | Must | Live classifications appear as `AI_DRAFT` candidates and cannot advance the gate |
| FR-18 | Preserve validated AI provenance through review | Must | HMAC token round-trip retains provider, candidates, rationale, and relevant receipt data |
| FR-19 | Label where every compile result was computed | Must | `executionOrigin` is `server` only for API responses; browser preview and network-failure fallback are `browser`; UI shows chip, notice, receipts context and footer (domain + API tests) |
| FR-20 | Report service version and configured model on `/api/health` | Should | API test asserts `version` (SemVer) and `model` (`gemini-*`) |
| FR-21 | Default to a generally available Gemini model with a compatible thinking configuration | Must | `DEFAULT_GEMINI_MODEL` is `gemini-3.7-flash`; `thinkingConfigFor` returns `thinkingLevel` for Gemini 3 and `thinkingBudget: 0` for Gemini 2.5 (unit tests) |
| FR-22 | Cover the HTTP contract automatically | Must | `server/app.test.ts` exercises health, compile bounds, malformed JSON, token tamper, review round trip, 404, rate limit and startup guards |
| FR-23 | Compile user-supplied artifacts through a deterministic general path when `ALLOW_CUSTOM_ARTIFACTS=true` | Must | One document per role, ≥ 20 chars; `mode: custom`, `synthetic: false`; fixture still uses the canonical compiler (API tests) |
| FR-24 | Run DA-001–DA-006 as detectors over extracted clauses; ground every finding in a verbatim quote | Must | `general.test.ts`: fixture reproduces the six codes/severities; clean corpus yields none; every quote is a substring |
| FR-25 | Derive patch values only from engineering statements; propose nothing when none exist | Must | Fixture yields `five named analytes` / `Twelve critical AOIs` / `supervised Phase 1`; unsupported corpus yields an empty patch with an explanatory rationale |
| FR-26 | Bind custom review to the compiled artifacts | Must | Token carries mode, patch id and SHA-256 of artifacts; mismatched or missing artifacts → 409 |
| FR-27 | Export the compiled result as Markdown and JSON in the browser | Should | `exportMarkdown.test.ts`; headless-browser download check |
| FR-28 | Show the document editor only when the API advertises custom mode | Should | Health `customArtifacts` drives the toggle; fixture-only deployments never show it |
| FR-29 | Compile from the command line with build-style exit codes | Must | `deployalign compile <dir>` / role flags / `--artifacts`; exit 0 pass, 1 input/usage error, 2 when unresolved diagnostics remain at/above `--fail-on` (`cli/main.test.ts`) |
| FR-30 | Write pipeline-friendly outputs | Should | `--out` produces `result.json`, `report.md`, `customer-decision-memo.md`, `sales-sow.md`, `engineering-test-manifest.md` |
| FR-31 | Read Korean documents through the same detectors | Should | Korean Raman corpus reproduces DA-001–DA-006 and a verbatim Korean patch (`corpora.test.ts`); limits documented |
| FR-32 | Treat negated quantifiers as bounded | Must | "will not cover every ward", "does not serve all wards", "…커버하지 않습니다" yield no unbounded phrase; a self-bounding proposal yields zero diagnostics (`corpora.test.ts`) |
| FR-33 | Narrow Korean customer preferences to the wanted thing | Should | "…사족 사륜 로봇이 필요합니다" → `CustomerPreference` quoting `사족 사륜 로봇` |
| FR-34 | Run as a GitHub Action with build-style outcome | Must | `action.yml` inputs/outputs; CI self-test: hospital `FAIL`/4 blockers, warehouse `PASS`, Korean `FAIL` with `12곳의 핵심 구역` in the report |

## Non-functional requirements

- Performance: client API attempt times out after 60 seconds; no production latency SLO is claimed.
- Scale: one fixed three-artifact fixture on the public demo, or any three role-tagged texts in local custom mode; 8,000 characters maximum per artifact; six compile attempts per ten minutes per IP on one process.
- Security: JSON body limited to 64 KB; common hardening headers and CSP set; HMAC review token expires after one hour; no user authentication exists.
- Privacy: use synthetic text only until data handling, retention, model transmission, and consent policies exist.
- Accessibility: keyboard-operable controls, visible focus, semantic headings/tables, sufficient contrast, and provider/status not encoded by color alone.
- Reliability: deterministic compile remains available when Gemini is disabled or rejected; UI must not hide the fallback.
- Maintainability: stable diagnostic codes, typed interfaces, and unit tests protect the core contract.

## Inputs and outputs

Input: three `SourceArtifact` objects with ID, role, title, owner, update time, and text content.

Output: a `CompileResult` containing project/version/gate/provider metadata, artifacts, separate Gemini candidate nodes, deterministic graph nodes/edges, diagnostics, semantic patch, three compiled targets, impact sets, execution receipts, generation time, and an optional signed compile token.

## Edge cases

- Missing body or artifact list.
- Incorrect artifact count.
- Empty/whitespace text after trimming.
- Artifact longer than 8,000 characters.
- Gemini returns malformed JSON, ungrounded quote, disallowed type, too few valid statements, or invalid rationale.
- Client API times out, returns non-2xx, or is unavailable.
- Repeat review request or patch/version mismatch.
- Missing, malformed, expired, or wrongly signed compile token.
- Token issued by another instance or before a restart when no shared secret is configured.
- Rate limit reached.
- Review token provenance does not match the requested baseline.

## Failure behavior

- Validation failures return HTTP 400 with a bounded message.
- Rate-limit failures return 429.
- Review baseline mismatch returns 409.
- Invalid or expired compile provenance token returns 409.
- Gemini extraction rejection is logged and deterministic compilation continues.
- A network `TypeError` returns a local deterministic result only for the exact fixture; HTTP errors and other failures are surfaced. Since 0.2.0 that result is labelled `executionOrigin: 'browser'`, and the UI says so; only API responses carry `server`.

## Test acceptance

- All 75 automated tests pass: 14 domain, 15 general-path, 9 corpora (drone, hospital, Korean, negation), 2 export, 6 CLI, 11 Gemini validation, 18 API contract (verified 2026-08-26 on Node 24.19.0).
- Typecheck, lint, and production build pass (verified 2026-08-26).
- API contract and failure cases receive automated coverage (`server/app.test.ts`, 0.2.0).
- Visual QA confirms synthetic/fallback/human-gate disclosures.
- A deployed live Gemini test is archived with the Cloud Run revision, provider/model receipt, signed-provenance review result, and redacted logs. 2026-08-17: `gemini-2.5-flash` on `deployalign-00004-wgb`. 2026-08-26: `gemini-3.7-flash` on `deployalign-00005-9vs` (health `model gemini-3.7-flash`; receipt `classified 3 source statements`). Deterministic TypeScript retains graph/gate/target ownership.

## Human approval gates

- Using credentials or transmitting any non-synthetic artifact.
- Enabling or materially changing external model calls in a shared/public environment.
- Treating the local review action as a real decision.
- Material cloud/video/Devpost edits. The 2026-08-17 submission completed after explicit approval and exact OSS disclosure; Git author exposure and Microsoft Mark redistribution are accepted residual risks, not resolved rights determinations.

## Open questions

- Which policy rules are configurable by organization?
- What identity, signature, and audit-retention model is required?
- How should source documents be redacted and deleted?
- What production topology, monitoring, and regional/data controls would meet real-user constraints beyond the current Cloud Run `asia-northeast3` demo?
- What measurable user or business outcome justifies the product?
- ~~When is the first live `gemini-3.7-flash` receipt verified on the deployed service?~~ Verified 2026-08-26 (D-017).
- Which of the six diagnostics survive as general detectors on real, redacted text (roadmap 0.3, D-016)?
