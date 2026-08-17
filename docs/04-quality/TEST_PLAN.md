# Test Plan

> Status: Local automated, production-server, and live-browser QA passed · Date: 2026-08-17 · Owner: QA

## Objectives

- Prove the deterministic compiler enforces the documented demo contract.
- Show when Gemini is live, skipped, rejected, or replaced by fallback.
- Ensure a local review cannot create an unconditional deployment pass.
- Verify accessible, honest presentation of synthetic and unverified states.
- Keep challenge claims tied to external evidence, not code behavior.

## Existing domain tests

| Case | Input | Expected result | Pass criterion |
| --- | --- | --- | --- |
| Default blockers | Bundled synthetic artifacts | `HOLD`, four unresolved blockers, DA-001…DA-006 | Existing Vitest case passes |
| Quote grounding | Every diagnostic source reference | Quote is a substring of referenced artifact | Existing Vitest loop passes |
| Node grounding | Every reviewed node source reference | Quote is a substring of referenced artifact | Existing Vitest loop passes |
| Patch boundary | Default pre-review result | Exactly three changes: analyte scope, coverage, operating mode | Existing Vitest case passes |
| Review gate | Version 1 + expected patch | Version 2, approved patch, `CONDITIONAL PILOT`, DA-006 still open | Existing Vitest case passes |
| Incremental rebuild | Approved compile targets | Exactly six `DEC-014`-linked sections are rebuilt as new objects; CDM-3, SOW-7.1, and SYS-009 are reused from that compile's fresh canonical baseline and retain identical FNV-1a32 fingerprints | Existing Vitest case passes; no cross-request identity or integrity claim |
| Response isolation | Mutate one approved response, then compile again | The later compile gets a fresh baseline; section bodies, source-node arrays, and impact arrays are uncontaminated | Existing Vitest case passes |
| Stable decision linkage | Reviewed targets | Every changed section includes `DEC-014` | Existing Vitest case passes |
| Custom-content rejection | Change one fixture body | Compile rejects rather than applying hard-coded output | Existing Vitest case passes |
| Reference integrity | Reviewed graph/diagnostics | No dangling diagnostic or edge node references | Existing Vitest case passes |
| Metadata rejection | Change one fixture title | Compile rejects before any Gemini prompt | Existing Vitest case passes |
| Strict fixture identity | Add an unknown key or submit a whitespace-normalized lookalike | Compile rejects before any Gemini prompt | Existing Vitest case passes |
| AI candidate separation | Valid synthetic `AiExtractionEvidence` | Provider retained, three `AI_DRAFT` candidates exposed, deterministic gate remains `HOLD` | Existing Vitest case passes |

Final updated evidence on 2026-08-17 after the response-isolation, strict-fixture, and responsive containment fixes: `pnpm typecheck`, `pnpm lint`, 13/13 tests, and `pnpm build` all exited 0. The build used Vite 8.2.1, processed 1,570 modules, and emitted 38.83 kB CSS and 241.07 kB JS. A direct production server smoke also passed root 200/no-store/CSP, hashed asset 200/one-year immutable caching, valid/tampered/extra-segment/expired token behavior, and missing-secret production startup failure. Retain redacted command output with the release checkpoint.

## API contract tests to add

| Case | Request | Expected result | Pass criterion |
| --- | --- | --- | --- |
| Health/default | `GET /api/health` with default env | `ok: true`, `liveGemini: false` | HTTP 200 and exact fields |
| Default compile | `POST /api/compile` with `{}` | Synthetic version-1 result | HTTP 200, provider disclosed |
| Wrong count | 0, 2, or 4 artifacts | Bounded validation error | HTTP 400; no model call |
| Oversize | One artifact >8,000 characters | Bounded validation error | HTTP 400; no model call |
| Body limit | Body >64 KB | Express rejection | Non-2xx; no crash |
| Rate limit | Seventh compile in one window/IP | Limit message | HTTP 429 |
| Review mismatch | Wrong version or patch ID | No state advance | HTTP 409 |
| Gemini malformed | Invalid JSON/schema | Deterministic result and rejection log | No ungrounded output admitted |
| Gemini ungrounded | Valid schema, quote not in source | Reject extraction | Deterministic provider shown |
| Review provenance | Live-provider compile token followed by review | Provider/candidates/rationale survive a valid HMAC round trip | Add API integration coverage; core compile behavior has unit coverage |
| Token tamper/expiry | Missing, extra-segment, modified, expired, or wrong-secret token | Review rejected without baseline advance | HTTP 409 and no state change |
| Production token secret | Missing or <32-byte `COMPILE_TOKEN_SECRET` | Server refuses production startup | Process exits with explicit error |
| Multi-instance routing | Compile/review across processes | Stable shared secret verifies token, but process-local rate state remains a limitation | Keep demo max instances 1 until distributed controls exist |

## Browser and visual tests

| State | Checks |
| --- | --- |
| Initial/loading | No stale success message; action disabled as appropriate |
| Synthetic demo | Synthetic label visible without scrolling and in screenshots |
| Deterministic fallback | Provider/fallback warning explicit; never say live Gemini |
| Live Gemini | Provider/model receipt visible only after verified response |
| Diagnostics | Severity, code, message, node/source link, and resolution status readable |
| Review | Confirm action is clearly a demo/human boundary; unresolved gates remain visible |
| API failure | Fallback state and reason are understandable, not silent success |
| Rate/error | Recoverable message with no raw secret or stack trace |
| Responsive | Main workflow usable at narrow and desktop widths |
| Accessibility | Keyboard navigation, focus visibility, headings/labels, contrast, reduced motion |

Completed against the production Express build in the in-app browser on 2026-08-17: desktop and 320/360 px responsive layouts rendered without page-level horizontal overflow; the top bar remained visible while scrolling; source-to-provenance and provenance-to-graph navigation settled below the sticky header; compile and simulated review advanced `BASELINE V1` to `BASELINE V2` and `HOLD` to `CONDITIONAL PILOT`; the impact view showed six rebuilt and three unchanged sections; all three target tabs and both provenance tabs responded; and the browser console reported zero warnings or errors. Public-safe screenshots are retained in `submission-assets/`.

## User-value tests

| Hypothesis | Experiment | Success signal | Failure signal |
| --- | --- | --- | --- |
| Conflict graph catches material drift | Five practitioners review the synthetic case with/without DeployAlign | More material conflicts found or less review time | No improvement or lower trust |
| Source quotes improve trust | Compare source-linked vs summary-only output | Users verify claims faster and prefer linked view | Links feel noisy or misleading |
| Minimum patch is useful | Ask users to accept/edit/reject the three changes | Users understand and retain a bounded patch | Users need a different decision object |
| Incremental impact matters | Ask which documents/sections must change | Users can act without re-reading everything | Impact list does not match workflow |

No such user experiment has been run yet.

## AI quality tests

| Attribute | Evaluation | Failure example | Response |
| --- | --- | --- | --- |
| Grounding | Exact quote and artifact ID must match | Invented quote | Reject extraction |
| Classification | Human-labeled corpus precision/recall | Preference labeled as constraint | Benchmark and adjust schema/prompt |
| Rationale scope | Must not add costs, dates, measurements, or claims | Invented acceptance threshold | Reject/manual review; deterministic patch fields |
| Repeatability | Run same corpus multiple times | Materially different types/decisions | Keep model as proposal layer; log variance |
| Injection resistance | Include instructions inside artifacts | Model obeys embedded instruction | Harden prompt, isolate data, validate output |
| Provider transparency | Receipt matches actual path | Fallback labeled Gemini | Block release |
| Receipt authenticity | Actors/status match the real path and repeated IDs/zero timings are labeled demo values | Illustrative receipt presented as production audit evidence | Assert consistency and disclosure; require unique durable events for production |

## Security and privacy tests

- Confirm no credential or environment value appears in the client bundle, API response, log, screenshot, or docs.
- Test JSON, Unicode, HTML/script, and instruction-like content as artifact text.
- Verify security headers on API and static responses.
- Confirm review endpoint cannot be described as authenticated.
- Confirm the signed token is not described as encrypted, confidential, user-bound, or non-repudiable.
- Verify logs contain bounded metadata, not full source artifacts.
- Run dependency, secret, and license scans before any repository sharing.
- Use only synthetic data until approved privacy controls exist.

## Regression commands

```text
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

Archive date, commit (when one exists), exit status, and redacted output. A command listed here is not proof that it passed.

## Release blockers

- Any failed core/domain test, typecheck, lint, or build.
- UI hides synthetic or deterministic-fallback state.
- Any receipt attributes work to Gemini when live extraction was skipped or rejected.
- Review state becomes unconditional `PASS` while DA-004 or DA-006 remains open.
- Secrets or real customer data enter build/log/screenshots.
- Google Cloud product use/deployment or live Gemini is claimed without archived API/runtime/deployment evidence.
- Production readiness is claimed without auth, persistence, tenant isolation, monitoring, and rollback.
- Devpost finalization is attempted without authentic required user, revenue, expense, repository, video, and testing-access evidence.
