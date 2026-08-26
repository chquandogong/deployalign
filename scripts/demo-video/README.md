# Demo video pipeline (narration-first)

Reproducible build for the DeployAlign walkthrough video. The narration is synthesized
first and measured; the recorder then holds every scene exactly as long as its line and
records the wall-clock offset at which the scene started; the mixer drops each clip in
at that offset. Picture and voice cannot drift, and a script change is a one-line edit.

```text
build_narration.py  →  videos/build/plan.json + narration/*.mp3   (edge-tts, ffprobe)
record_demo.mjs     →  videos/build/raw/*.webm + actual_start_seconds in plan.json (Playwright)
mix_video.py        →  videos/build/DeployAlign-Demo-v<version>.mp4 + .en/.ko/.zh.srt (ffmpeg)
```

## Prerequisites

- `ffmpeg` / `ffprobe` on `PATH`.
- Python 3.11+ with `edge-tts` (`python3 -m venv .venv && .venv/bin/pip install edge-tts`).
- A Playwright ≥ 1.58 package with Chromium installed. Either `pnpm add -D playwright && pnpm exec playwright install chromium` in a scratch checkout, or point `PLAYWRIGHT_MODULE` at an existing install (`.../node_modules/playwright/index.mjs`).
- The app running in production mode: `pnpm build && COMPILE_TOKEN_SECRET=... NODE_ENV=production pnpm start`.

## Build

```bash
.venv/bin/python scripts/demo-video/build_narration.py           # ~1 min, needs network for TTS
DEMO_URL=http://localhost:8080/ node scripts/demo-video/record_demo.mjs   # ~3 min, headless
python3 scripts/demo-video/mix_video.py                           # ~1 min
```

Outputs land in `videos/build/` (git-ignored). The scene list, captions and narration
live at the top of `build_narration.py`; the on-screen actions per scene live in
`record_demo.mjs`; the Korean and Chinese subtitle lines live in `mix_video.py`.

## Honesty rules baked into the script

- The `SYNTHETIC DEMO` strip, provider badge and origin chip stay visible; the recording
  runs the deterministic path, so the badge reads `Deterministic fixture fallback · API`
  and the narration does not claim a live model call for what is on screen.
- No customer, revenue, production or field-outcome claim appears in captions or voice.
- The voice is a synthesized Microsoft neural voice via edge-tts
  (`en-US-AndrewMultilingualNeural`); its redistribution terms are not a settled legal
  question — see the risk register (R-12) before publishing.
