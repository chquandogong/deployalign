# Test Plan

> Status: 0.6.1: 78 tests across 8 files re-run 2026-09-02 (gates green, audit clean) with a CI self-test of the GitHub Action; headless-browser QA of custom mode (0.3.0) and of the presets (0.6.0); live gemini-3.7-flash verified on the public demo 2026-08-26 and again on the 0.6.1 redeploy 2026-09-02 · Date: 2026-09-02 · Owner: QA

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

## Corpora tests (`src/domain/general/corpora.test.ts`, 9 cases — 0.4.0/0.5.0)

| Corpus | What it pins down |
| --- | --- |
| Drone inspection (EN) | `all five flare stacks` and `Phase 2` are bounded/labels, not unbounded scope; `no smaller than 10 cm at 95% recall` is a measurable acceptance criterion; completed flight tests and a completed survey yield no DA-006; zero diagnostics overall |
| Hospital delivery robot (EN) | `every ward … autonomously` raises DA-001/002/004/005/006; coverage replacement `Six wards`, operating mode `attended operation`; the hedged door width and the number-free "customer-reported, not measured" statement form one DA-004 cluster |
| Sub-fab Raman pilot (KO) | Korean sentences split and type by role; the customer opener yields an objective plus a preference narrowed to `사족 사륜 로봇`; `시설 전체` / `모든 누출 물질` / `자율적으로` are the three unbounded categories; enumerations `다섯 가지`, `12곳`; six diagnostics with canonical severities; verbatim patch `다섯 가지 명명된 분석 물질`, `12곳의 핵심 구역`, `감독 하의 1단계 운영`; approval resolves DA-001 and keeps DA-006 |
| Negated quantifiers (EN/KO, 0.5.0) | "will not cover every ward", "does not serve all wards", "…커버하지 않습니다" produce no unbounded phrase while the affirmative forms do; a proposal that bounds its own scope yields zero diagnostics |

## Example-preset tests (`src/domain/examples.test.ts`, 3 cases — 0.6.0)

| Case | Input | Expected result |
| --- | --- | --- |
| Presets mirror `examples/` | Every file of every `EXAMPLE_PRESETS` entry | Each preset artifact's content equals the trimmed on-disk file under `examples/<folder>/`, so the editor presets and the CLI/Action example sets cannot drift apart |
| Documented verdicts | Each preset through `compileGeneral` | `mode: custom`; diagnostic codes equal the preset's `expected.codes`; verdict is `FAIL` when any unresolved `BLOCKER` remains, else `PASS` — `hospital-delivery-robot` DA-001/002/004/005/006 → `FAIL`, `warehouse-amr` none → `PASS`, `sub-fab-raman-ko` DA-001–DA-006 → `FAIL` |
| Fixture-safe ids | All preset artifact ids | Unique across presets and every id starts with `EX-`, so they can never collide with the synthetic fixture |

## GitHub Action self-test (`.github/workflows/ci.yml` job `action`, 0.5.0)

Runs `uses: ./` on the bundled example sets and asserts the outcome and outputs: `examples/hospital-delivery-robot` → step fails, `verdict=FAIL`, `gate=HOLD`, 4 blockers, 1 warning, `report.md` contains `DA-001 UNBOUNDED_SCOPE`; `examples/warehouse-amr` (`fail-on: warning`) → `PASS`, 0 blockers; `examples/sub-fab-raman-ko` → step fails, 4 blockers, report contains `12곳의 핵심 구역`.

## CLI tests (`cli/main.test.ts`, 6 cases — 0.4.0)

Usage/version/unknown command; directory compile by file-name role writes `result.json`, `report.md` and three target files and exits 2 on blockers; `--fail-on none` exits 0 and `--approved --fail-on warning` exits 2 with `CONDITIONAL PILOT`; explicit role files and a JSON manifest (a bounded manifest exits 0 with zero blockers); missing roles and short files exit 1 with messages; `demo` compiles the fixture (`fixture mode`, exit 2).

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
pnpm test        # 78 tests: 14 domain · 15 general path · 9 corpora · 3 example presets · 2 export · 6 CLI · 11 Gemini validation · 18 API contract
pnpm typecheck
pnpm lint
pnpm build
```

Archive date, commit (when one exists), exit status, and redacted output. A command listed here is not proof that it passed.

Evidence 2026-09-02 (0.6.1 tree, Node 24.19.0, pnpm 11.19.0): `pnpm typecheck`, `pnpm lint`, `pnpm test` (78/78 across eight files) and `pnpm build` exited 0; `pnpm audit --prod` reported no known vulnerabilities; `node bin/deployalign.mjs demo` exited 2 with four open blockers. **Deployed live model (D-024, 2026-09-02):** revision `deployalign-00006-h5c` — health `version 0.6.1`, `model gemini-3.7-flash`, `liveGemini true`, `customArtifacts false`; compile HTTP 200, `provider gemini-vertex`, `executionOrigin server`, `mode fixture`, receipt `SUCCESS — gemini-3.7-flash classified 3 source statements.`; root HTTP 200 with CSP and `no-store`; licence notice HTTP 200 / 3,462 bytes. Earlier (0.6.0, 2026-08-26): 78/78 with browser QA of the Korean preset. Earlier (0.5.0, 2026-08-26): all four commands exited 0; Vitest reported 75/75 across seven files; the three example sets exit 2 / 0 / 2; the Action self-test job is part of CI. Earlier (0.4.0): 72/72; **Deployed live model (D-017):** revision `deployalign-00005-9vs` — health `version 0.3.0`, `model gemini-3.7-flash`, `liveGemini true`; compile `provider gemini-vertex`, receipt `SUCCESS — gemini-3.7-flash classified 3 source statements.` Earlier (0.3.0): 60/60 and the browser QA above. Earlier the same day (0.2.0): 38/38 across three files; Vite emitted 39.50 kB CSS and 242.71 kB JS. A production-mode HTTP smoke against `pnpm start` on a local port returned health `version 0.2.0` / `model gemini-3.7-flash`, compile → approve with `executionOrigin: server`, HTTP 409 for a tampered token, root `no-store` with CSP, one-year immutable hashed assets, and the 3,462-byte licence notice. **Not covered in the 0.2.0 cycle:** a live `gemini-3.7-flash` call (no credentials in the build environment; satisfied 2026-08-26 by D-017) and the Cloud Run container build (CI performed the image build; the deployed revision was unchanged until D-017).

## Release blockers

- Any failed core/domain test, typecheck, lint, or build.
- UI hides synthetic or deterministic-fallback state.
- Any receipt attributes work to Gemini when live extraction was skipped or rejected.
- Review state becomes unconditional `PASS` while DA-004 or DA-006 remains open.
- Secrets or real customer data enter build/log/screenshots.
- Google Cloud product use/deployment or live Gemini is claimed beyond the archived API/runtime/deployment evidence, or Gemini is credited for deterministic graph/gate/target decisions.
- Production readiness is claimed without auth, persistence, tenant isolation, monitoring, and rollback.
- Any record implies eligibility or an award merely because Devpost confirmed submission, or omits that terms acceptance and Submit occurred only after explicit user approval.
