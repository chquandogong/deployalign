# Test Plan

> Status: 0.3.0 local automated QA passed (60 tests) plus headless-browser QA of custom mode; 0.1.0 deployed-Vertex evidence retained · Date: 2026-08-26 · Owner: QA

## Objectives

- Prove the deterministic compiler enforces the documented demo contract.
- Show when Gemini is live, skipped, rejected, or replaced by fallback.
- Ensure a local review cannot create an unconditional deployment pass.
- Verify accessible, honest presentation of synthetic and unverified states.
- Keep challenge claims tied to external evidence, not code behavior.

## Domain tests (`src/domain/compiler.test.ts`, 14 cases)

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
| Execution origin (0.2.0) | `compileDemo()` with and without `executionOrigin` | Defaults to `browser`; `server` only when passed explicitly | Vitest case passes |

Final updated evidence on 2026-08-17 after the response-isolation, strict-fixture, and responsive containment fixes: `pnpm typecheck`, `pnpm lint`, 13/13 tests, and `pnpm build` all exited 0; the production audit reported zero vulnerabilities. The build used Vite 8.2.1, processed 1,570 modules, and emitted 38.83 kB CSS and 241.07 kB JS. A direct production server smoke also passed root 200/no-store/CSP, hashed asset 200/one-year immutable caching, valid/tampered/extra-segment/expired token behavior, and missing-secret production startup failure. The later license-compliance commit `d5f9f33180a1edbdfeb8e5d4b8775a98643fd28c` was built and deployed as current Cloud Run revision `deployalign-00004-wgb`; post-deploy smoke verified 100% traffic, health `ok=true`/`service=deployalign`/`liveGemini=true`, and the footer notice at HTTP 200/3,462 bytes. Retain redacted command and cloud evidence with the release checkpoint.

## General-path tests (`src/domain/general/general.test.ts`, 15 cases — 0.3.0)

| Case | Input | Expected result |
| --- | --- | --- |
| Clause extraction | Fixture; multi-line note with bullets | 12 verbatim clauses with offsets/line numbers; line numbers track blank lines and bullets; fragments without letters dropped |
| Typing | Fixture clauses | Customer opener → objective + narrowed preference (`four-legged, four-wheeled robot`); hedged measurement → `SiteClaim`; mandatory/acceptance sales text flagged; engineering → evidence / constraint / assumption / unverified site claim / open test |
| Unbounded phrases | Sales promise | `entire facility` (coverage), `autonomously` (autonomy), `any leaked material` (scope) |
| Fixture reproduction | Fixture through `compileGeneral` | Same six codes and severities as the canonical compiler; 4 unresolved blockers; `HOLD` |
| Patch derivation | Fixture | `analyte scope: any leaked material → five named analytes`, `coverage: entire facility → Twelve critical AOIs`, `operating mode: autonomously → supervised Phase 1`, plus a platform-requirement change; resolves DA-001/002/003/005 |
| Approval | Fixture, approved | v2, `CONDITIONAL PILOT`, DA-004/DA-006 open, `SCOPE-001` + decision node present, commitment `INVALIDATED` |
| Incremental rebuild | Fixture before/after | ≥ 6 decision-linked sections recompiled; `CDM-3`, `SOW-7.1`, `ENG-CONST` keep fingerprints |
| Grounding / references | Both baselines | Every node and diagnostic quote is a substring; no dangling node/edge references |
| Determinism / isolation | Same input twice; mutate one result | Equal outputs; later compile unaffected |
| Clean corpus | Bounded warehouse AMR case with completed tests | Zero diagnostics, empty patch, tests `PASS` |
| Unsupported corpus | Unbounded promise, no measured evidence | DA-001, DA-002, DA-006; empty patch with explanatory rationale; no `SCOPE-001` after approval |
| Hostile text | "Ignore prior instructions…" inside a document | Treated as data; gate `HOLD`, patch `PROPOSED` |

## Export tests (`src/lib/exportMarkdown.test.ts`, 2 cases — 0.3.0)

Markdown contains gate, diagnostics with quotes, patch table, recompiled markers, source map and the synthetic disclosure; file names are sanitised.

## Gemini validator tests (`server/gemini.test.ts`, 11 cases — 0.2.0)

| Case | Input | Expected result |
| --- | --- | --- |
| Default model | `DEFAULT_GEMINI_MODEL` | `gemini-3.7-flash` |
| Thinking config, Gemini 3 | `gemini-3.7-flash`, `gemini-3-flash-preview` | `{ thinkingLevel: LOW }`; override `high`/`medium` honoured; unknown override falls back to `LOW` |
| Thinking config, Gemini 2.5 | `gemini-2.5-flash` with or without override | `{ thinkingBudget: 0 }` |
| Valid payload | Three grounded, typed, bounded statements + rationale | Statements kept in order; rationale trimmed |
| Ungrounded quote | Quote not a substring of its artifact | Throws `failed source-map validation` |
| Disallowed type / confidence out of range | `PricingPromise`; `1.2` | Statement dropped → coverage fails → throws |
| Coverage after de-duplication | Duplicate statement replaces the third artifact's | Throws |
| Rationale bounds | Whitespace-only or > 1,000 characters | Throws `rationale failed validation` |
| Empty payload | `{}` | Throws |

## API contract tests (`server/app.test.ts`, 18 cases — 13 from 0.2.0, 5 custom-mode cases from 0.3.0)

| Case | Request | Expected result | Status |
| --- | --- | --- | --- |
| Health | `GET /api/health` | `ok`, `service`, SemVer `version`, `liveGemini: false`, `model` `gemini-*` | Passing |
| Default compile | `POST /api/compile` with `{}` and with the fixture | HTTP 200; version 1, `HOLD`, `deterministic-demo`, `executionOrigin: server`, two-part token, `RUN-<uuid>` receipt IDs, CSP header | Passing |
| Wrong count | Two artifacts | HTTP 400 `Exactly three source artifacts are required.` | Passing |
| Non-fixture content | One body replaced | HTTP 400, fixture-only message; no model call | Passing |
| Malformed JSON | Truncated body | HTTP 400 `Malformed JSON request body.` | Passing |
| Review without token | version/patch only | HTTP 409 | Passing |
| Token tamper | Signature altered | HTTP 409 `signature is invalid`; no state advance | Passing |
| Review round trip | Compile → approve with its token | HTTP 200; version 2, `CONDITIONAL PILOT`, `APPROVED`, six recompiled, `CDM-3`/`SOW-7.1`/`SYS-009` unchanged, fresh token | Passing |
| Unknown API route | `GET /api/nope` | HTTP 404 JSON | Passing |
| Rate limit | Seventh compile in one window on an isolated instance | HTTP 429, `Retry-After: 600` | Passing |
| Production secret guard | `nodeEnv: production` without secret; short secret in any mode | `createApp` throws | Passing |
| Custom mode advertised | `allowCustomArtifacts: true` | Health `customArtifacts: true`; fixture still `mode: fixture`, `DEC-014` | Passing |
| Custom compile | Three role-tagged custom texts | 200; `mode: custom`, `synthetic: false`, `server` origin, `HOLD`; DA-001/002/004/005/006; patch `three named analytes` / `Eight critical zones` / `supervised operation` | Passing |
| Custom review binding | Approve without artifacts; with altered artifacts; with the fixture patch id; with the identical set | 409 / 409 / 409 / 200 v2 `CONDITIONAL PILOT` with `SCOPE-001` | Passing |
| Custom validation | Two customer documents; a 3-character document | 400 with role message; 400 with length message | Passing |
| Key stripping | Extra `hidden` key on each artifact | 200; artifacts contain only the six schema keys | Passing |

Still not automated (tracked): oversize artifact (> 8,000 chars), body > 64 KB, expired-token path (needs clock injection), Gemini malformed/ungrounded responses through the HTTP path (validator is unit-tested), multi-instance routing, custom mode combined with live Gemini.

## API contract tests originally planned (2026-08-17 list, retained for traceability)

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

The same core flow was then verified against the public Cloud Run URL. The UI showed `Gemini via Vertex AI`; `gemini-2.5-flash` classified exactly three source statements as separate `AI_DRAFT` candidates; the AI receipt showed `SUCCESS`; and the signed review token preserved that provider/candidate provenance after approval. Redacted logs recorded `compile_completed` at version 1 with six unresolved diagnostics and `patch_approved` at version 2. Official Vertex AI Model Garden Monitoring also showed the `gemini-2.5-flash` row and last-hour model-request/token-count graphs. The approved UI showed one open blocker, 11 typed nodes, three synced targets, six rebuilt sections, and three unchanged sections. These observations verify the deployed synthetic path and model observability evidence, not Gemini ownership of the deterministic graph/gates/targets or production readiness.

## Browser QA — custom-document flow (0.3.0, 2026-08-26)

Headless Chromium (Playwright 1.58) against the production build started with `ALLOW_CUSTOM_ARTIFACTS=true` on a local port:

1. Health-driven toggle **Use your own documents** visible → editor with three text areas.
2. Pasted a synthetic plant-leak corpus → **Compile these documents** → notice "Compiled by the compiler API"; strip `USER-SUPPLIED DOCUMENTS`; chip `CUSTOM`; project `CUSTOM REVIEW · E242501D`; diagnostics `DA-001, DA-002, DA-004, DA-005, DA-006`; three patch rows with `three named analytes`, `Eight critical zones`, `supervised operation`; gate `HOLD`.
3. **Simulate approval & recompile** → `CONDITIONAL PILOT`, `HUMAN RECEIPT`, badge `6 RECOMPILED`.
4. **Markdown** export → download `custom-review-e242501d-v2.md` (6,181 bytes) starting with `# Custom review` and containing the patch table.
5. Zero console errors or page errors. Screenshots: `docs/assets/custom-mode-0.3.0.png`, `docs/assets/custom-patch-0.3.0.png`.

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
- Preserve the deployed browser-bundle notice and exact submitted OSS disclosure; public Git author identity exposure and Microsoft Mark voice redistribution remain accepted residual risks, not cleared legal conclusions.
- Use only synthetic data until approved privacy controls exist.

## Regression commands

```text
pnpm test        # 60 tests: 14 domain · 15 general path · 2 export · 11 Gemini validation · 18 API contract
pnpm typecheck
pnpm lint
pnpm build
```

Archive date, commit (when one exists), exit status, and redacted output. A command listed here is not proof that it passed.

Evidence 2026-08-26 (0.3.0, Node 24.19.0, pnpm 11.19.0): all four commands exited 0; Vitest reported 60/60 across five files; the browser QA above passed. Earlier the same day (0.2.0): 38/38 across three files; Vite emitted 39.50 kB CSS and 242.71 kB JS. A production-mode HTTP smoke against `pnpm start` on a local port returned health `version 0.2.0` / `model gemini-3.7-flash`, compile → approve with `executionOrigin: server`, HTTP 409 for a tampered token, root `no-store` with CSP, one-year immutable hashed assets, and the 3,462-byte licence notice. **Not covered in this cycle:** a live `gemini-3.7-flash` call (no credentials in the build environment) and the Cloud Run container build (CI performs the image build; the deployed revision is unchanged).

## Release blockers

- Any failed core/domain test, typecheck, lint, or build.
- UI hides synthetic or deterministic-fallback state.
- Any receipt attributes work to Gemini when live extraction was skipped or rejected.
- Review state becomes unconditional `PASS` while DA-004 or DA-006 remains open.
- Secrets or real customer data enter build/log/screenshots.
- Google Cloud product use/deployment or live Gemini is claimed beyond the archived API/runtime/deployment evidence, or Gemini is credited for deterministic graph/gate/target decisions.
- Production readiness is claimed without auth, persistence, tenant isolation, monitoring, and rollback.
- Any record implies eligibility or an award merely because Devpost confirmed submission, or omits that terms acceptance and Submit occurred only after explicit user approval.
