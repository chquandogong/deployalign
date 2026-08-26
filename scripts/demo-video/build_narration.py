"""Narration-first plan for the DeployAlign demo video (v0.4.0 script).

Usage: python scripts/demo-video/build_narration.py   (needs `pip install edge-tts` and ffmpeg)
Writes <VIDEO_OUT_DIR>/plan.json and one MP3 per scene; the recorder holds each
scene exactly as long as its line, so picture and narration cannot drift.


Synthesizes each line with edge-tts, measures it, and writes plan.json with the
hold time per scene so the recorder shows each scene exactly as long as its line.
"""
import asyncio, json, os, subprocess, sys

import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "+3%"
BREATH = 0.8
MIN_HOLD = 3.0
OUT = os.environ.get("VIDEO_OUT_DIR", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "videos", "build"))
CLIPS = os.path.join(OUT, "narration")

SCENES = [
    {"id": "title", "action": "title_card", "caption": "",
     "text": "DeployAlign compiles scattered deployment promises into testable commitments. Version zero point four, shown on a synthetic sub-fab Raman pilot with no customer data behind it."},
    {"id": "sources", "action": "show_sources",
     "caption": "Three documents, three truths — <b>all leaks, every area, fully autonomous</b> vs. <b>five analytes, 12 AOIs, supervised</b>",
     "text": "Three documents, three truths. The customer wants all leaks, everywhere, fully autonomously. Sales promises the entire facility. Engineering can evidence five named analytes, twelve mapped areas and supervised operation, and still needs a blind test and a site survey."},
    {"id": "compile", "action": "compile",
     "caption": "One click compiles them — <b>provider</b> badge, <b>execution origin</b> chip; the public demo runs <b>Gemini 3.7 Flash</b> on Vertex AI",
     "text": "One click compiles them. The provider badge says whether Gemini ran or the deterministic path did; the origin chip says whether the compiler API or this browser produced the result. The public demo runs Gemini 3.7 Flash through Vertex AI."},
    {"id": "graph", "action": "show_graph",
     "caption": "A <b>typed commitment graph</b>: preference ≠ constraint · commitment ≠ evidence · site claim ≠ surveyed fact",
     "text": "The statements become a typed commitment graph. A customer preference is not a constraint. A sales commitment cannot outrun accepted evidence. A verbal site claim is not a surveyed fact."},
    {"id": "diagnostics", "action": "show_diagnostics",
     "caption": "Six deterministic diagnostics, <b>DA-001 to DA-006</b>, each with an exact source quote — four blockers, gate on <b>HOLD</b>",
     "text": "Deterministic rules emit six stable diagnostics, each with an exact source quote. Four are blockers, so the gate holds."},
    {"id": "trace", "action": "show_trace",
     "caption": "Every node and diagnostic traces to a <b>verbatim span</b> in a named artifact",
     "text": "Every node and every diagnostic traces back to a verbatim span in a named artifact. Grounding is a contract, not a courtesy."},
    {"id": "patch", "action": "show_patch",
     "caption": "The smallest evidence-supported change: values <b>copied from the engineering text</b>, nothing invented",
     "text": "DeployAlign proposes the smallest change the evidence supports: five named analytes, twelve mapped areas, supervised Phase 1. Every value is copied from the engineering text; nothing is invented."},
    {"id": "approve", "action": "approve",
     "caption": "Then it stops. A <b>person</b> reviews the patch — a demo of the boundary, not authenticated approval",
     "text": "Then it stops. A person reviews the patch, and the baseline advances to version two. This button is a demo of that boundary, not authenticated approval."},
    {"id": "gate", "action": "show_gate",
     "caption": "<b>HOLD → CONDITIONAL PILOT</b>, never an unconditional pass: the blind test and the survey stay open",
     "text": "The gate moves from HOLD to CONDITIONAL PILOT, never to an unconditional pass. The blind test and the survey stay open."},
    {"id": "impact", "action": "show_impact",
     "caption": "Incremental build: <b>6 sections recompiled</b>, 3 unrelated sections keep their FNV-1a32 change fingerprints",
     "text": "Six sections linked to the decision are recompiled; three unrelated sections keep their change fingerprints."},
    {"id": "targets", "action": "show_targets",
     "caption": "One decision ID, three audiences — and <b>receipts</b> that record who did what: Gemini · rules · human · build engine",
     "text": "One decision ID propagates into a customer memo, a sales statement of work and an engineering test manifest; receipts record who did what: Gemini, rules, human, build engine."},
    {"id": "custom", "action": "open_editor",
     "caption": "Since 0.3: <b>paste your own three documents</b> — locally, English or first-pass Korean",
     "text": "Since version zero point three you can paste your own three documents. Locally, the same detectors run over your text, in English or first-pass Korean, and every finding still quotes its source."},
    {"id": "custom_results", "action": "compile_custom",
     "caption": "A Korean brief: <b>six diagnostics</b>, a patch copied from the engineering sentences, <b>Markdown / JSON export</b>",
     "text": "Here, a Korean brief: six diagnostics with Korean quotes, a patch copied verbatim from the engineering sentences, and export to Markdown or JSON."},
    {"id": "cli", "action": "show_cli",
     "caption": "Since 0.4: a <b>build step</b> — <b>deployalign compile … --fail-on blocker</b> exits 2 when a proposal outruns its evidence",
     "text": "And since version zero point four it runs as a build step. deployalign compile fails the pipeline with exit code two when a proposal outruns its evidence."},
    {"id": "close", "action": "close_card", "caption": "",
     "text": "Open source under MIT. Gemini proposes, deterministic rules decide, a person approves. Real user validation is still ahead, and not claimed today."},
]


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "default=noprint_wrappers=1:nokey=1", path],
                         capture_output=True, text=True, check=True).stdout.strip()
    return float(out or 0)


async def main():
    os.makedirs(CLIPS, exist_ok=True)
    plan = []
    for i, s in enumerate(SCENES):
        clip = os.path.join(CLIPS, f"{i:02d}_{s['id']}.mp3")
        await edge_tts.Communicate(s["text"], VOICE, rate=RATE).save(clip)
        d = duration(clip)
        hold = max(d + BREATH, MIN_HOLD)
        plan.append({"index": i, "id": s["id"], "action": s["action"], "caption": s["caption"],
                     "text": s["text"], "clip": clip, "narration_seconds": round(d, 3),
                     "hold_seconds": round(hold, 3)})
        print(f"[{i:02d}] {s['id']:<12} {d:6.2f}s hold {hold:6.2f}s")
    total = sum(p["hold_seconds"] for p in plan)
    print(f"narration {sum(p['narration_seconds'] for p in plan):.1f}s -> video ~{total:.1f}s ({total/60:.2f} min)")
    if total > 178:
        print("WARNING: over ~3 minutes, trim narration", file=sys.stderr)
    with open(os.path.join(OUT, "plan.json"), "w") as f:
        json.dump(plan, f, indent=1)

asyncio.run(main())
