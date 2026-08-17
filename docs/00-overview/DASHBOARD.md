# DeployAlign Project Dashboard

> Status: Local prototype verified; external submission blocked · Date: 2026-08-17 · Owner: DeployAlign orchestrator

## Current state

- Phase: Local prototype verification and external-evidence audit.
- Overall judgment: **Continue technical prototype; do not claim submission readiness.**
- Cloud prerequisite verified: Google account `chquan17`, active free trial/billing, and active project `project-55fbcfd2-0ad6-4c99-a25` were confirmed on 2026-08-17; reauthentication is no longer the blocker.
- External cloud gate: API enablement, IAM, Secret Manager, Cloud Run deployment, a live Vertex/Gemini call, redacted logs, and cost evidence remain pending and require human approval.
- Submission blocker: no evidence of real users, real revenue, a production deployment, or continuous AI operation.
- Source of truth: repository code and this documentation. The verified implementation and evidence pack are checkpointed through local commit `035c8d3`; no remote has been created.

## Core goals

1. Demonstrate evidence-linked conflict detection and a bounded, human-reviewed scope patch.
2. Preserve source provenance and stable decision IDs across generated artifacts.
3. Present the work honestly as a synthetic demonstration until real evidence exists.

## Progress

| Phase | Status | Evidence | Next action |
| --- | --- | --- | --- |
| Office Hours | Done | `../01-discovery/OFFICE_HOURS.md` | Validate pain with real users |
| Feasibility | Done with caveats | `../01-discovery/FEASIBILITY_REPORT.md` | Verify demand and live Gemini |
| Domain/compiler | Implemented and locally verified | `src/domain/*`; final run 13/13 tests | Preserve final checkpoint evidence |
| API/Gemini adapter | Implemented, live path unverified | `server/*` | Human-approved API/IAM setup and controlled live test |
| Browser experience | Implemented and live-browser verified | Desktop plus 320/360 px checks; sticky disclosure/header; source navigation; review, target, and receipt flows; public-safe screenshots | Preserve evidence through deployment |
| Verification | Final typecheck, lint, 13/13 tests, production build, direct production-server/token smoke, and browser checks passed on 2026-08-17 | Reviewer command results and `submission-assets/` | Repeat against deployed URL |
| Deployment | Not performed | Dockerfile only | Human approval before external deploy |
| Devpost | Draft only | `../submission/*` | Resolve all evidence blockers, then human review |

## Work board

| Work item | Status | Owner | Dependency | Output |
| --- | --- | --- | --- | --- |
| Deterministic commitment compiler | Done | Builder | None | Domain code |
| Gemini extraction adapter | Done, unverified live | Builder | Google Cloud/API credentials | Server adapter |
| Product UI integration | Done | Builder | Domain/client helper | React app |
| Documentation and evidence audit | Done | Documentarian | Final code scan | `docs/**` |
| Automated verification | Done locally | QA | UI integration complete | Test/build/server-smoke results |
| Live Gemini verification | Pending external gate | Human + Builder | API enablement, IAM, credentials, quota approval, and deployment | Redacted call/usage evidence |
| Production deployment | Blocked gate | Human | Passing QA, secrets review, hosting choice | Live URL |
| Public video/repository | Blocked gate | Human | Final artifact and IP/privacy review | Public evidence |
| Devpost final submission | Blocked gate | Human | Rules compliance and truthful business evidence | Submission receipt |

## Resume point

- Verified implementation/evidence checkpoint: `035c8d3`; the local worktree was clean before this status refresh.
- Next safe action: obtain the required human approval for public repository creation and Google Cloud configuration/deployment.
- Do not automatically resume external publishing or submission; those are one-time human approval gates.

## Decisions awaiting a person

| Decision | Options | Recommendation | Human approval required |
| --- | --- | --- | --- |
| Challenge category | Professional Services Access / Small Business Services / do not submit | Validate category with an actual business/user story first | Yes |
| Live model credential path | Gemini API key / Vertex ADC | Vertex only after a human-approved API/IAM/least-privilege review | Yes |
| Repository visibility | Public / private shared with judges | Private until secret/IP scan is complete | Yes |
| Hosting | Cloud Run / other / no deployment | No deployment until tests and credential review pass | Yes |
| Submission posture | Final / draft / pause | Pause final submission until real evidence exists | Yes |

## Open assumptions

- Deployment teams experience meaningful cross-document commitment drift.
- A source-linked review interface reduces review time or catches material errors.
- The best category is Professional Services Access.
- Users will accept a hybrid AI-extraction/deterministic-policy workflow.

See `../01-discovery/ASSUMPTIONS.md` for validation status.

## Top risks

| Risk | Likelihood | Impact | Response | State |
| --- | ---: | ---: | --- | --- |
| Challenge entry lacks required real business evidence | High | Critical | Do not fabricate; acquire evidence or do not finalize | Open blocker |
| Synthetic data is mistaken for a real customer case | Medium | High | Persistent synthetic labels in UI, video, and narrative | Mitigating |
| Live Gemini path is unverified | High | High | With human approval, enable required APIs/IAM, deploy, run a traceable call, and retain redacted logs | Open gate |
| Client-local and server deterministic paths share a provider value | Medium | High | Add execution-origin metadata; never imply a live model from `deterministic-demo` | Open |
| Demo approval is mistaken for a secure workflow | Medium | High | Document no auth/persistence and never use real decisions | Open |

## Quality indicators

- Unit tests: final run passed 13/13.
- Typecheck and targeted lint: passed in the current reviewer run.
- Production build: passed after frontend completion.
- Direct server smoke: root 200 with no-store/CSP; hashed asset 200 with one-year immutable cache; token valid/tamper/extra-segment/expiry behaviors passed.
- Docker image build: not run because no Docker engine was available.
- Known critical product gaps: no production auth, persistence, tenant isolation, monitoring, or real evidence.
- Cross-validation: same-model role-based review only; **not** an actual Claude–GPT cross-model review.

## Cost and resources

- Repository contains no verified challenge expense record or P&L.
- Live model calls are opt-in to avoid silent quota use.
- Active free-trial/billing status is verified, and a private screenshot showed zero spend at capture time. It is not public submission evidence and does not prove future or total challenge expenses.
- No Cloud Run hosting, API usage, runtime logs, or live-model cost evidence has been provided.

## Next actions

1. After human approval, create the public repository and verify it contains no secrets or private evidence.
2. After human approval, verify APIs/IAM/Secret Manager, deploy the synthetic demo, and capture one real Vertex/Gemini call plus redacted logs and cost evidence.
3. Repeat browser checks against the public URL.
4. Conduct real user validation and collect consented evidence.
5. Ask a person to decide whether the challenge requirements can be met truthfully before any final submission.

## Links

- [Project brief](PROJECT_BRIEF.md)
- [Feasibility report](../01-discovery/FEASIBILITY_REPORT.md)
- [Specification](../03-spec/SPEC.md)
- [Risk register](../04-quality/RISK_REGISTER.md)
- [Ship checklist](../05-ops/SHIP_CHECKLIST.md)
- [Submission evidence checklist](../submission/EVIDENCE_CHECKLIST.md)
