# Demo Video Script — v0.2.0

> Status: v0.2.0 render verified locally; public upload pending owner decision D-018 · Date: 2026-08-26 · Owner: Presenter

## Recording rules

- Stay under three minutes — the hackathon rule no longer binds, but attention does.
- Show the functioning product, never slides alone.
- Keep `SYNTHETIC DEMO`, the provider badge and the execution-origin chip visible in every UI shot.
- Say only what the screen evidences. This render runs the **deterministic path** (badge `Deterministic fixture fallback · API`), so the voice does not claim a live model call for what is on screen; the public Cloud Run demo's live Gemini path is mentioned as a fact about the deployment, not shown.
- No customer, revenue, production-readiness or field-outcome claim.
- Narration is synthesized with edge-tts (`en-US-AndrewMultilingualNeural`, rate +3%). Redistribution terms of Microsoft neural voices remain an accepted, unsettled risk (R-12); a human recording is the alternative (D-019).

## Verified render (2026-08-26)

| Property | Value |
| --- | --- |
| File | `videos/build/DeployAlign-Demo-v0.2.0.mp4` (build output; also copied to the owner's home directory) |
| Duration | 177 s (2:57) |
| Video | 1920×1080, 30 fps, H.264 (libx264, CRF 20), `+faststart` |
| Audio | AAC 192 kb/s stereo, 48 kHz; 13 narration clips mixed at measured scene offsets |
| Captions | 13 burned-in caption cards (English) + sidecar SubRip files `.en.srt`, `.ko.srt`, `.zh.srt` (13 cues each) |
| Source | Local production build of commit-to-be-tagged `v0.2.0`, `NODE_ENV=production`, `ALLOW_LIVE_GEMINI` unset |
| Pipeline | `scripts/demo-video/` (narration-first: synthesize → record → mix) |
| Publication | **Not uploaded.** The 2026-08-17 video (0.1.0) remains public at [youtu.be/QOPgHHAWOBA](https://youtu.be/QOPgHHAWOBA); metadata for the v0.2.0 upload is in `YOUTUBE_METADATA.md` |

## Scenes

| # | Start | On screen | Narration |
| --- | --- | --- | --- |
| 00 | 0:01 | Title card: `DEPLOY//ALIGN`, "Synthetic demo · v0.2.0", "FICTIONAL SUB-FAB RAMAN PILOT · NO CUSTOMER DATA" | DeployAlign compiles scattered deployment promises into testable commitments. This is a synthetic case: a fictional sub-fab Raman inspection pilot, with no customer data behind it. |
| 01 | 0:14 | Section 01, three source cards highlighted | Three documents, three truths. The customer wants all chemical leaks, in every area, fully autonomously. Sales promises the entire facility. Engineering can evidence five named analytes, twelve mapped areas and supervised operation, and still needs a blind test and a site survey. |
| 02 | 0:34 | Scroll to top, click **Compile sources**, topbar badges highlighted (`SYNTHETIC`, provider, `API` origin chip) | One click compiles them. The provider badge says whether Gemini ran or the deterministic fixture path did, and the new origin chip says whether the compiler API or this browser produced the result, so a fallback can never pass for a server run. |
| 03 | 0:49 | Commitment graph; `PREF-003` then `COM-006` selected in the node inspector | The statements become a typed commitment graph. A customer preference is not a constraint. A sales commitment cannot outrun accepted evidence. A verbal site claim is not a surveyed fact. |
| 04 | 1:02 | Diagnostics panel, `DA-001`…`DA-003` clicked, `BUILD BLOCKED · 4` | Deterministic rules emit six stable diagnostics, each with an exact source quote: unbounded scope, commitment without evidence, preference cast as constraint, unverified site claim, missing acceptance criterion, and an open critical test. Four are blockers, so the gate holds. |
| 05 | 1:21 | Provenance → Source map | Every node and every diagnostic traces back to a verbatim span in a named artifact. Grounding is a contract, not a courtesy. |
| 06 | 1:31 | Section 03, proposed semantic diff (three rows) | DeployAlign proposes the smallest change the evidence supports. Three fields: five named analytes, twelve mapped areas, supervised Phase 1. No price, date or measurement is invented. |
| 07 | 1:45 | Approval boundary, click **Simulate approval & recompile**, `HUMAN RECEIPT · DEC-014 · BASELINE V2` | Then it stops. A person reviews the patch. This button is a demo of that boundary, not authenticated approval, and the baseline advances to version two. |
| 08 | 1:55 | Gate console at top: `CONDITIONAL PILOT`, 1 open blocker | The gate moves from HOLD to CONDITIONAL PILOT, never to an unconditional pass. The blind analyte test and the aisle survey stay open. |
| 09 | 2:06 | Section 04 impact table: recompiled / unchanged rows with fingerprints | The impact table shows what moved: six sections linked to decision fourteen are recompiled, and three unrelated sections keep their FNV-1a32 change fingerprints, a change detector, not a security proof. |
| 10 | 2:21 | Section 05, the three target tabs clicked in turn | One decision ID propagates into three audiences: a customer decision memo, a sales statement of work, and an engineering test manifest. |
| 11 | 2:31 | Provenance → AI / agent receipts | Receipts separate the actors: Gemini extraction, deterministic rules, human review and the build engine, so you can always tell who did what. |
| 12 | 2:41 | Closing card: "Open source · MIT", repository URL, "SYNTHETIC DEMO · NO CUSTOMER, REVENUE OR FIELD CLAIM" | DeployAlign is open source under MIT. The public demo runs Gemini through Vertex AI, and next on the roadmap is running it on your own documents. Real user validation is still ahead, and not claimed today. |

## Rebuild

See [`scripts/demo-video/README.md`](../../scripts/demo-video/README.md). Changing a
line means editing `SCENES` in `build_narration.py` and re-running the three steps; the
timings, captions and subtitles regenerate.

## Pre-upload checklist (D-018)

- [ ] Watch the full render once at 1× with sound; captions legible at 1080p and 480p.
- [ ] Every UI shot shows `SYNTHETIC DEMO`; the provider badge reads `Deterministic fixture fallback`; the origin chip reads `API`.
- [ ] No key, token, account identifier, personal data or private financial value on screen.
- [ ] Narration makes no customer, revenue, production or field-outcome claim.
- [ ] Decide D-019 (synthesized vs human voice) before publishing.
- [ ] After upload: replace the video link in `README.md`, `README.ko.md`, `README.zh.md`, `DASHBOARD.md` and this file; attach the three `.srt` files as YouTube subtitles.

## Record of the v0.1.0 video (2026-08-17)

170 s, 1920×1080 30 fps H.264/AAC, 74 captions, Microsoft Mark voice, recorded against
the public Cloud Run demo with a live `gemini-2.5-flash` compile. Published at
[youtu.be/QOPgHHAWOBA](https://youtu.be/QOPgHHAWOBA) after explicit approval; no custom
thumbnail (YouTube phone verification was unavailable). Its script is preserved in the
git history of this file at tag `v0.1.0`.
