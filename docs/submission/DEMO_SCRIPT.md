# Demo Video Script — v0.4.0

> Status: v0.4.0 render verified locally; YouTube publication in progress (D-018) · Date: 2026-08-26 · Owner: Presenter

## Recording rules

- Keep it close to three minutes; show the functioning product, never slides alone.
- `SYNTHETIC DEMO` / `USER-SUPPLIED DOCUMENTS` strip, provider badge and execution-origin chip stay visible in every UI shot.
- Say only what the screen evidences. The recording runs the **deterministic path** (badge `Deterministic fixture fallback · API`, custom mode `Deterministic rules · no model`); the public demo's live Gemini 3.7 Flash path is stated as a verified fact about the deployment (D-017), not shown.
- No customer, revenue, production-readiness or field-outcome claim. The Korean brief in scene 11–12 is the synthetic Raman fixture translated, not a customer document.
- Narration is synthesized with edge-tts (`en-US-AndrewMultilingualNeural`, rate +3%). Redistribution terms of Microsoft neural voices remain an accepted, unsettled risk (R-12); a human recording is the alternative (D-019).

## Verified render (2026-08-26)

| Property | Value |
| --- | --- |
| File | `videos/build/DeployAlign-Demo-v0.4.0.mp4` (build output; copied to the owner's home directory) |
| Duration | 187.5 s (3:07) |
| Video | 1920×1080, 30 fps, H.264 (libx264, CRF 20), `+faststart` |
| Audio | AAC 192 kb/s stereo, 48 kHz; 15 narration clips mixed at measured scene offsets |
| Captions | 15 burned-in caption cards (English) + sidecar SubRip `.en.srt`, `.ko.srt`, `.zh.srt` (15 cues each) |
| Source | Local production build of tag `v0.4.0` with `ALLOW_CUSTOM_ARTIFACTS=true`, `ALLOW_LIVE_GEMINI` unset; CLI scene shows real `deployalign compile` output over the hospital corpus |
| Pipeline | `scripts/demo-video/` (narration-first: synthesize → record → mix) |

## Scenes

| # | Start | On screen | Narration |
| --- | --- | --- | --- |
| 00 | 0:01 | Title card `DEPLOY//ALIGN`, "Synthetic demo · v0.4.0", "FICTIONAL SUB-FAB RAMAN PILOT · NO CUSTOMER DATA" | DeployAlign compiles scattered deployment promises into testable commitments. Version zero point four, shown on a synthetic sub-fab Raman pilot with no customer data behind it. |
| 01 | 0:14 | Section 01, three source cards | Three documents, three truths. The customer wants all leaks, everywhere, fully autonomously. Sales promises the entire facility. Engineering can evidence five named analytes, twelve mapped areas and supervised operation, and still needs a blind test and a site survey. |
| 02 | 0:33 | Click **Compile sources**; topbar badges highlighted | One click compiles them. The provider badge says whether Gemini ran or the deterministic path did; the origin chip says whether the compiler API or this browser produced the result. The public demo runs Gemini 3.7 Flash through Vertex AI. |
| 03 | 0:50 | Commitment graph; `PREF-003`, `COM-006` selected | The statements become a typed commitment graph. A customer preference is not a constraint. A sales commitment cannot outrun accepted evidence. A verbal site claim is not a surveyed fact. |
| 04 | 1:03 | Diagnostics panel, `BUILD BLOCKED · 4` | Deterministic rules emit six stable diagnostics, each with an exact source quote. Four are blockers, so the gate holds. |
| 05 | 1:13 | Provenance → Source map | Every node and every diagnostic traces back to a verbatim span in a named artifact. Grounding is a contract, not a courtesy. |
| 06 | 1:23 | Proposed semantic diff | DeployAlign proposes the smallest change the evidence supports: five named analytes, twelve mapped areas, supervised Phase 1. Every value is copied from the engineering text; nothing is invented. |
| 07 | 1:37 | Approval boundary → **Simulate approval & recompile** | Then it stops. A person reviews the patch, and the baseline advances to version two. This button is a demo of that boundary, not authenticated approval. |
| 08 | 1:48 | Gate console `CONDITIONAL PILOT` | The gate moves from HOLD to CONDITIONAL PILOT, never to an unconditional pass. The blind test and the survey stay open. |
| 09 | 1:57 | Impact table | Six sections linked to the decision are recompiled; three unrelated sections keep their change fingerprints. |
| 10 | 2:05 | Target tabs → receipts | One decision ID propagates into a customer memo, a sales statement of work and an engineering test manifest; receipts record who did what: Gemini, rules, human, build engine. |
| 11 | 2:19 | **Use your own documents** → editor; the Korean Raman brief is typed into the three fields | Since version zero point three you can paste your own three documents. Locally, the same detectors run over your text, in English or first-pass Korean, and every finding still quotes its source. |
| 12 | 2:33 | **Compile these documents** → `CUSTOM` chip, six diagnostics with Korean quotes, patch diff, export buttons | Here, a Korean brief: six diagnostics with Korean quotes, a patch copied verbatim from the engineering sentences, and export to Markdown or JSON. |
| 13 | 2:44 | Terminal card with the real `deployalign compile … --fail-on blocker` output (exit code 2) | And since version zero point four it runs as a build step. deployalign compile fails the pipeline with exit code two when a proposal outruns its evidence. |
| 14 | 2:55 | Closing card: "Open source · MIT", repository URL, "SYNTHETIC DEMO · NO CUSTOMER, REVENUE OR FIELD CLAIM" | Open source under MIT. Gemini proposes, deterministic rules decide, a person approves. Real user validation is still ahead, and not claimed today. |

## Rebuild

See [`scripts/demo-video/README.md`](../../scripts/demo-video/README.md). The recorder needs the app started with `ALLOW_CUSTOM_ARTIFACTS=true` and `CLI_OUTPUT_FILE` pointing at a captured `deployalign compile` transcript.

## Publication

- v0.4.0: uploaded to YouTube on 2026-08-26 after explicit owner approval; the link is recorded in `README.md` and `YOUTUBE_METADATA.md` once live.
- v0.1.0 (2026-08-17, 170 s, Microsoft Mark voice, live `gemini-2.5-flash` compile on Cloud Run): [youtu.be/QOPgHHAWOBA](https://youtu.be/QOPgHHAWOBA) — kept public as the submission record.
- v0.2.0 (2026-08-26, 177 s): rendered and attached to the [v0.2.0 GitHub release](https://github.com/chquandogong/deployalign/releases/tag/v0.2.0); superseded by v0.4.0 before upload.
