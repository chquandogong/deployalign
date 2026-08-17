# DeployAlign Project Dashboard

> Status: Public cloud demo verified; external submission blocked · Date: 2026-08-17 · Owner: DeployAlign orchestrator

## Current state

- Phase: Devpost finalization at 4/5 Draft after public demo/evidence verification.
- Overall judgment: **Technical demo is live; do not claim business or final-submission readiness.**
- Cloud demo verified: Cloud Run revision `deployalign-00004-wgb` serves 100% of traffic at [deployalign-1007800160926.asia-northeast3.run.app](https://deployalign-1007800160926.asia-northeast3.run.app) in project `project-55fbcfd2-0ad6-4c99-a25`, region `asia-northeast3`. `/api/health` returned `ok=true`, `service=deployalign`, and `liveGemini=true`.
- Live model evidence: a deployed compile returned provider `gemini-vertex`; `gemini-2.5-flash` produced exactly three exact-quote `AI_DRAFT` classifications, and its successful receipt/provenance survived the signed review transition.
- License notice verified: the deployed footer links to [`/third-party-licenses.txt`](https://deployalign-1007800160926.asia-northeast3.run.app/third-party-licenses.txt), which returned HTTP 200 and 3,462 bytes with full React/React DOM/Scheduler MIT, Vite browser-bundle MIT, and Lucide ISC texts.
- Entrant facts confirmed: individual entrant in the Republic of Korea; adult/eligible; official rules agreed; project start `06-01-26`; Professional Services Access selected; 1 actual user, 0 paying users; May–August and total revenue $0; related-party revenue $0; COGS, marketing, other, and total expenses $0; no entrant-owned pre-existing code/assets; corporate ID not applicable. The current saved form response still needs an approved update that discloses standard OSS framework/library use.
- Devpost state: Project Details and Additional Info are saved, including both financial PDFs and the reviewed five-file runtime-evidence set. Finalization is **4/5 Draft**; terms acceptance and Submit have not been executed.
- Submission blockers: the zero-revenue rule risk, lag-aware billing check, OSS-framework disclosure update, public Git author name/email exposure acceptance, and Microsoft Mark voice redistribution uncertainty require human review. Learning level is Moderate, the public video is verified, and terms/Submit remain an action-time gate.
- Source of truth: the public repository at [github.com/chquandogong/deployalign](https://github.com/chquandogong/deployalign), deployed service, redacted evidence, and this documentation. The license-compliance deployment checkpoint is commit `d5f9f33180a1edbdfeb8e5d4b8775a98643fd28c`.

## Core goals

1. Demonstrate evidence-linked conflict detection and a bounded, human-reviewed scope patch.
2. Preserve source provenance and stable decision IDs across generated artifacts.
3. Present the work honestly as a synthetic demonstration until real evidence exists.

## Progress

| Phase | Status | Evidence | Next action |
| --- | --- | --- | --- |
| Office Hours | Done | `../01-discovery/OFFICE_HOURS.md` | Validate pain with real users |
| Feasibility | Done with caveats | `../01-discovery/FEASIBILITY_REPORT.md` | Verify demand and deployed-model repeatability |
| Domain/compiler | Implemented and locally verified | `src/domain/*`; final run 13/13 tests | Preserve final checkpoint evidence |
| API/Gemini adapter | Implemented and live-verified on Vertex AI | Deployed `gemini-vertex` compile; success receipt; Cloud Run logs; Vertex request/token monitoring graphs | Add alerts and durable operational observability before real operation |
| Browser experience | Implemented and live-browser verified | Desktop plus 320/360 px checks; sticky disclosure/header; source navigation; review, target, and receipt flows; public-safe screenshots | Preserve disclosure in public video |
| Verification | Typecheck, lint, 13/13 tests, production build, server/token smoke, Cloud Build container build, deployed browser flow, and runtime-log checks passed on 2026-08-17 | Reviewer command results, Cloud Build/deployment records, redacted logs, and `submission-assets/` | Retain final checkpoint evidence |
| Deployment | Public synthetic demo deployed | Cloud Run revision `deployalign-00004-wgb`; 100% traffic; health and license-notice smoke passed | Keep max instances 1; do not call it production-ready |
| Devpost | 4/5 Draft; Project Details and Additional Info saved | `../submission/*`; live browser state | Final rules/link review, then action-time approval before terms/Submit |

## Work board

| Work item | Status | Owner | Dependency | Output |
| --- | --- | --- | --- | --- |
| Deterministic commitment compiler | Done | Builder | None | Domain code |
| Gemini extraction adapter | Done and live-verified | Builder | Vertex AI runtime configuration | Three validated `AI_DRAFT` candidates and success receipt |
| Product UI integration | Done | Builder | Domain/client helper | React app |
| Documentation and evidence audit | Done | Documentarian | Final code scan | `docs/**` |
| Automated and deployed verification | Done for bounded demo | QA | UI integration complete | Test/build/server-smoke, Cloud Build, deployed browser, and log results |
| Live Gemini verification | Done for the public synthetic demo | Human + Builder | Vertex AI, runtime identity, deployed service | Redacted compile/log/receipt evidence |
| Public demo deployment | Done | Human + Builder | Passing QA, least-privilege runtime, stable secret | Public Cloud Run URL and revision |
| Demo video | Published and verified | Human + Media | Preserve public availability through judging | [youtu.be/QOPgHHAWOBA](https://youtu.be/QOPgHHAWOBA); player 2:50; published 2026-08-17 |
| Devpost final submission | Blocked gate | Human | Rules compliance and truthful business evidence | Submission receipt |

## Resume point

- Live-deployment code checkpoint: `d5f9f33180a1edbdfeb8e5d4b8775a98643fd28c`; public repository and Cloud Run demo are available.
- Next safe action: obtain decisions on the OSS disclosure, public Git identity exposure, and Microsoft Mark voice residual risk, then perform the final rules/link/billing review against the saved Project Details and Additional Info.
- Public video upload was approved and completed. Devpost final submission remains an action-time human approval gate.

## Decisions and completed external gates

| Decision | Options | Recommendation | Human approval required |
| --- | --- | --- | --- |
| Challenge category | Professional Services Access / Small Business Services / do not submit | Professional Services Access selected by the entrant; impact evidence remains limited | Completed |
| Live model credential path | Gemini API key / Vertex runtime identity | Vertex is configured for the demo; retain least privilege | Completed for demo |
| Repository visibility | Public / private shared with judges | Public repository is available | Completed |
| Hosting | Cloud Run / other / no deployment | Public Cloud Run demo is deployed; do not treat it as customer production | Completed for demo |
| Submission posture | Final / draft / pause | Pause final submission until real evidence exists | Yes |

## Open assumptions

- Deployment teams experience meaningful cross-document commitment drift.
- A source-linked review interface reduces review time or catches material errors.
- Professional Services Access is the selected category; whether one user and no measured outcome make a competitive category case remains open.
- Users will accept a hybrid AI-extraction/deterministic-policy workflow.

See `../01-discovery/ASSUMPTIONS.md` for validation status.

## Top risks

| Risk | Likelihood | Impact | Response | State |
| --- | ---: | ---: | --- | --- |
| One user, zero paying users, and $0 revenue do not satisfy or compete well against the stated real-business requirement | High | Critical | Disclose exact values; never relabel zero revenue as traction; complete the final rule review | Open blocker |
| Synthetic data is mistaken for a real customer case | Medium | High | Persistent synthetic labels in UI, video, and narrative | Mitigating |
| Live Gemini evidence is mistaken for AI control of safety decisions | Medium | High | State that Gemini only proposes exact-quote candidates/rationale; deterministic TypeScript owns graph, gates, and targets | Mitigating |
| Client-local and server deterministic paths share a provider value | Medium | High | Add execution-origin metadata; never imply a live model from `deterministic-demo` | Open |
| Demo approval is mistaken for a secure workflow | Medium | High | Document no auth/persistence and never use real decisions | Open |

## Quality indicators

- Unit tests: final run passed 13/13.
- Typecheck and targeted lint: passed in the current reviewer run.
- Production build: passed after frontend completion.
- Direct server smoke: root 200 with no-store/CSP; hashed asset 200 with one-year immutable cache; token valid/tamper/extra-segment/expiry behaviors passed.
- Container image build: passed through Cloud Build and was deployed to Cloud Run.
- Deployed browser evidence: `gemini-vertex`, three exact-quote `AI_DRAFT` candidates, successful AI receipt, HMAC-preserved provenance, `HOLD` → `CONDITIONAL PILOT`, six rebuilt and three unchanged sections.
- Known critical product gaps: no production auth, persistence, tenant isolation, durable audit, or real user/business evidence.
- Cross-validation: same-model role-based review only; **not** an actual Claude–GPT cross-model review.

## Cost and resources

- Entrant-confirmed challenge accounting is revenue $0, COGS $0, marketing $0, other expenses $0, total expenses $0, and net $0. The one-page A4 zero-revenue and P&L PDFs are saved in Devpost.
- Live model calls are opt-in to avoid silent quota use.
- Active free-trial/billing status is verified. The latest private billing capture showed an Aug 1–15 current report of ₩0 and remaining free-trial credits, but the same screen warns that costs can take hours or more than 24 hours to appear.
- Cloud Run hosting, Vertex execution, redacted runtime logs, and official Vertex Model Garden request/token-count graphs for `gemini-2.5-flash` are evidenced. The entrant's current challenge P&L is confirmed at $0 revenue/$0 expense/$0 net, while the billing-lag caveat still requires one final cost recheck before submission.

## Next actions

1. Update the saved pre-existing-resources answer only after the entrant approves an accurate OSS-framework/library disclosure.
2. Obtain explicit entrant acceptance of the already-public Git author name/email exposure.
3. Resolve the Microsoft Mark voice redistribution uncertainty through documented acceptance or a replacement voice.
4. Confirm the saved PDFs/runtime evidence, public links, 796-word story, and all Additional Info answers; recheck billing after its lag window.
5. Ask the entrant to approve terms acceptance and final Submit immediately before those actions occur.

## Links

- [Project brief](PROJECT_BRIEF.md)
- [Feasibility report](../01-discovery/FEASIBILITY_REPORT.md)
- [Specification](../03-spec/SPEC.md)
- [Risk register](../04-quality/RISK_REGISTER.md)
- [Ship checklist](../05-ops/SHIP_CHECKLIST.md)
- [Submission evidence checklist](../submission/EVIDENCE_CHECKLIST.md)
