# Assumptions Register

> Status: Active · Date: 2026-08-17 · Owner: Project lead

| ID | Assumption | Basis | Validation method | State |
| --- | --- | --- | --- | --- |
| A-01 | Deployment teams suffer costly commitment drift across documents | Product thesis only | Five practitioner interviews and incident examples | Open |
| A-02 | Application/deployment engineers are the first user | Workflow inference | Persona interviews | Open |
| A-03 | A source-linked conflict view is more valuable than generic summarization | Design hypothesis | Compare against a manual/LLM summary task | Open |
| A-04 | Three artifacts are enough for a compelling first wedge | Demo design | Observe user tasks with real redacted cases | Open |
| A-05 | Five analytes, 12 AOIs, and supervised Phase 1 are the minimum safe scope in the demo | Synthetic engineering artifact | Deterministic tests only; not a real safety conclusion | Valid only inside demo |
| A-06 | Professional Services Access is the best challenge category | Entrant selected this category | Validate fit against the one actual user and future measured outcomes | Selected; impact fit unvalidated |
| A-07 | Reviewers will accept AI extraction when quotes are exact and policy checks are deterministic | Architecture hypothesis | Trust and error-rate study | Open |
| A-08 | A live Gemini call can be completed through Vertex AI or a Gemini API key | Verified `gemini-vertex` call from Cloud Run with redacted logs and receipt | Repeatability and operational monitoring | Validated for the synthetic demo |
| A-09 | Browser fallback is useful for demos | Resilience design | Test failure comprehension with provider badge | Open risk |
| A-10 | The current demo review action is sufficient to explain a human gate | UI/flow hypothesis | Usability test | Open; not a security control |

## Known facts, not assumptions

- All bundled source artifacts are synthetic.
- Live Gemini calls are disabled by default in the code; the verified Cloud Run demo explicitly sets `ALLOW_LIVE_GEMINI=true`.
- The deterministic compiler can run without network access.
- The server accepts only the three disclosed synthetic artifacts; count, metadata, or content changes are rejected before any Gemini prompt.
- The demo begins at version 1 and advances to version 2 after the expected patch/version request.
- Server review also requires an unexpired HMAC-signed compile token; it preserves validated model provenance but is not encrypted or a durable audit record.
- Two evidence gates remain open after the demo patch; the result is `CONDITIONAL PILOT`, not `PASS`.
- On 2026-08-17, the license-compliance build at commit `d5f9f33180a1edbdfeb8e5d4b8775a98643fd28c` was deployed as Cloud Run revision `deployalign-00004-wgb`, serving 100% of traffic in project `project-55fbcfd2-0ad6-4c99-a25`, region `asia-northeast3`, using a dedicated runtime service account and a stable Secret Manager HMAC secret.
- A deployed compile verified provider `gemini-vertex`, model `gemini-2.5-flash`, exactly three exact-quote `AI_DRAFT` candidates, a successful AI receipt, and signed provenance preserved through review. Deterministic TypeScript—not Gemini—builds the canonical graph, gates, impact, and targets.
- The public application URL is `https://deployalign-1007800160926.asia-northeast3.run.app`; the public repository is `https://github.com/chquandogong/deployalign`.
- On the current revision, `/api/health` returned `ok=true`, `service=deployalign`, and `liveGemini=true`; this health response is configuration evidence, not a substitute for the separately verified live model-call receipt.
- The deployed footer links to `/third-party-licenses.txt`; the URL returned HTTP 200 and 3,462 bytes with full React/React DOM/Scheduler MIT, Vite browser-bundle MIT, and Lucide ISC license texts.
- Official Vertex AI Model Garden Monitoring shows `gemini-2.5-flash` model-request and token-count activity in the last-hour view.
- A private billing capture showed an Aug 1–15 current report of ₩0 and remaining free-trial credits, but it explicitly warns that costs can take hours or more than 24 hours to appear. The entrant confirms current challenge revenue and all expense categories at $0; a final lag-aware billing recheck remains prudent.
- The entrant confirms: individual; Republic of Korea; adult/eligible; official rules agreed; project start `06-01-26`; no entrant-owned pre-existing code/assets; Professional Services Access; learning level Moderate; 1 actual user; 0 paying users; May, June, July, August, total, and related-party revenue all $0; COGS, marketing, other, and total expenses all $0; corporate ID N/A. The current saved pre-existing-resources response does not yet disclose standard OSS framework/library use; updating it requires entrant approval.
- A 170-second, 1920×1080, 30 fps H.264/AAC video with 74 captions is verified locally and published at `https://youtu.be/QOPgHHAWOBA`; the live player shows 2:50 and a publication date of 2026-08-17.
- Public Git history exposes author name/email metadata; entrant acceptance of that exposure is not yet recorded.
- The public video uses the Microsoft Mark synthesized voice. Its redistribution basis remains uncertain and requires explicit residual-risk acceptance or replacement before final submission.
- No custom thumbnail is claimed: YouTube phone verification was required and unavailable for this account.
- No evidence establishes a real customer, measured outcome, customer production operation, or final submission.
- The cross-review in `CROSS_VALIDATION_LOG.md` is same-model/role-based and is not an actual independent Claude review.

## Prohibited assumptions

Do not infer or state any of the following without evidence:

- A real semiconductor facility, customer, robot, incident, contract, or pilot exists.
- The Raman numbers describe a validated real-world system.
- Google Cloud or Gemini has been used successfully in a real customer production workflow. The public synthetic Cloud Run/Vertex demo is separately verified.
- Any user count, revenue amount, or expense amount beyond the exact entrant-confirmed values above; any conversion, time saving, risk reduction, or category impact.
- A Devpost project is finally submitted. Eligibility, Project Details, Additional Info, financial PDFs, and runtime evidence are saved at 4/5 Draft, but the OSS disclosure, Git identity exposure, voice-rights residual risk, terms/Submit, and final receipt remain unresolved.
