# DeployAlign Runbook

> Status: Local (0.2.0) and public synthetic-demo (0.1.0 revision) operations · Date: 2026-08-26 · Owner: Engineering

## Supported operating mode

This runbook starts and troubleshoots the local synthetic demo and records the verified public Cloud Run configuration. It does not authorize use with real customer/safety data or imply production readiness.

## Prerequisites

- Node.js 24 (`.nvmrc`; matches the Dockerfile). Anything ≥ 22.13 works — pnpm 11 needs `node:sqlite`, so Node 20 fails with `ERR_UNKNOWN_BUILTIN_MODULE`.
- Corepack with pnpm 11.19.0 (`corepack enable` reads `package.json#packageManager`).
- Free local ports for Vite and the Express API (API default: 8080).
- Optional live model: a human-approved Gemini API key or Google Cloud project with valid Application Default Credentials.
- Production only: stable `COMPILE_TOKEN_SECRET` of at least 32 UTF-8 bytes, supplied through approved secret management.

## Install and run locally

```text
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Vite proxies `/api` to `http://localhost:8080`. Use only the bundled synthetic artifacts unless a separate data/privacy approval exists.

## Verify the deterministic path

Keep the default environment:

```text
ALLOW_LIVE_GEMINI=false
```

Health should report `liveGemini: false`, `version` (from `package.json`) and `model` (default `gemini-3.7-flash`). Compile should return `provider: deterministic-demo`, `executionOrigin: server`, `synthetic: true`, version 1, and gate `HOLD`.

In non-production local mode, the server generates an ephemeral compile-token secret if none is configured. A restart invalidates outstanding one-hour review tokens. Production startup intentionally fails if `COMPILE_TOKEN_SECRET` is absent or shorter than 32 bytes.

The browser client has a 60-second request timeout. It falls back locally only for a network `TypeError` and only for the exact synthetic fixture; HTTP errors are surfaced, and abort/timeout errors are not intentionally converted to fallback. A compatible review can fall back only when the current provider is already deterministic. Since 0.2.0 every result carries `executionOrigin`; a browser-computed result shows an amber `IN-BROWSER` chip and an explicit notice, a server result shows a green `API` chip.

## Model configuration

| Variable | Default | Notes |
| --- | --- | --- |
| `GEMINI_MODEL` | `gemini-3.7-flash` | Any Gemini model ID. Gemini 3.x Flash models are served from the Vertex `global` location only. |
| `GEMINI_THINKING_LEVEL` | `low` | Gemini 3 models only: `low` / `medium` / `high` (`minimal` is accepted only by Flash-Lite models). Ignored for Gemini 2.5 pins, which keep `thinkingBudget: 0`. |
| `GOOGLE_CLOUD_LOCATION` | `global` | Keep `global` for Gemini 3.x. |

**Why the default moved.** Vertex AI release notes list 2026-10-16 as the retirement date for `gemini-2.5-flash`, the 0.1.0 default. `gemini-3.7-flash` became generally available on 2026-08-13. Gemini 3 rejects a zero thinking budget, so `thinkingConfigFor` picks `thinkingLevel` for 3.x and a numeric budget for 2.5.

**Migrating the public demo (gated — D-017).** Typical sequence; confirm flags against current gcloud documentation before running:

```text
# 1. Build and deploy the 0.2.0 image (Cloud Build → Cloud Run, region asia-northeast3)
# 2. Remove the old pin so the code default applies, or set the new one explicitly
gcloud run services update deployalign --region asia-northeast3 --update-env-vars GEMINI_MODEL=gemini-3.7-flash
# 3. Verify
#    GET  /api/health   → model=gemini-3.7-flash, version=0.2.0, liveGemini=true
#    POST /api/compile  → provider=gemini-vertex, receipt "gemini-3.7-flash classified 3 source statements"
#    logs               → no gemini_extraction_rejected for the verification compile
```

Rollback: pin `GEMINI_MODEL=gemini-2.5-flash` (works until the retirement date) and redeploy the previous revision.

## Enable a live Gemini path

This is an external data/quota action. Use only after human approval, with synthetic text, in a controlled environment.

### Gemini Developer API

Set `ALLOW_LIVE_GEMINI=true` and `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) in the runtime environment. Never write the key into tracked files, screenshots, logs, or submission copy.

### Vertex AI

Set `ALLOW_LIVE_GEMINI=true`, `GOOGLE_CLOUD_PROJECT`, and optionally `GOOGLE_CLOUD_LOCATION`.

As of 2026-08-17, the public demo is verified in project `project-55fbcfd2-0ad6-4c99-a25`, region `asia-northeast3`, using Vertex AI model `gemini-2.5-flash` and runtime service account `deployalign-runner@project-55fbcfd2-0ad6-4c99-a25.iam.gserviceaccount.com`.

For a separate local path, confirm the intended project/region, use only required APIs and least-privilege credentials, and avoid exposing tokens. If approved local testing requires ADC and it is not already valid, the typical interactive command is:

```text
gcloud auth application-default login
```

The deployed verification met this bar: a compile reported `gemini-vertex`; the UI showed a successful `gemini-2.5-flash` receipt for three exact-quote statements; and redacted Cloud Run logs retained `compile_completed` and `patch_approved` events. Do not generalize this bounded synthetic evidence to customer production.

The current Cloud Run demo stores a stable ≥32-byte `COMPILE_TOKEN_SECRET` in Secret Manager and exposes it through the approved secret binding. Do not place the value in the image, source, command history, screenshots, or submission. Keep this demo at **max instances 1** because rate limiting and operational state are process-local; a shared token secret alone does not make the service production-distributed.

## Verified Cloud Run configuration

- Public URL: `https://deployalign-1007800160926.asia-northeast3.run.app`
- Revision: `deployalign-00004-wgb` (100% traffic)
- Region: `asia-northeast3`
- Access: unauthenticated public synthetic demo
- Compute: 1 CPU, 512 MiB; timeout 60 seconds; concurrency 20
- Scaling: min instances 0, max instances 1
- Live model: `ALLOW_LIVE_GEMINI=true`, Vertex AI `gemini-2.5-flash`
- Runtime identity: `deployalign-runner@project-55fbcfd2-0ad6-4c99-a25.iam.gserviceaccount.com`
- Provenance secret: stable Secret Manager binding; record the secret name/version, never the value
- Public health: `ok=true`, `service=deployalign`, `liveGemini=true`
- License notice: footer link to `/third-party-licenses.txt`; verified HTTP 200 and 3,462 bytes

Cloud Build successfully built the container that backs this revision. Official Vertex AI Model Garden Monitoring shows the `gemini-2.5-flash` row and last-hour model-request/token-count graphs. The latest private billing capture showed an Aug 1–15 current report of ₩0 and remaining free-trial credits, but the screen explicitly warns that costs can take hours or more than 24 hours to appear. Recheck after the lag window before confirming final expense/P&L.

## Verification sequence

```text
pnpm test        # 38 tests: domain, Gemini validation, API contract
pnpm typecheck
pnpm lint
pnpm build
```

Then start the production-style server:

```text
pnpm start
```

Check `/api/health`, compile the default synthetic project, review the patch once, and confirm:

- Pre-review: version 1, `HOLD`, four unresolved blockers.
- Post-review: version 2, `CONDITIONAL PILOT`, two unresolved evidence items.
- Impact: six `DEC-014`-linked sections rebuilt; three unrelated canonical sections reused from that compile's fresh baseline without reconstruction, retaining their non-cryptographic FNV-1a32 change fingerprints.
- Provider: accurately matches live or deterministic execution.
- Origin: `executionOrigin` is `server` for every API response; the UI chip reads `API`.
- Health: `version` matches `package.json`; `model` matches the configured `GEMINI_MODEL`.
- Review: an unexpired HMAC token preserves compile provider/candidate provenance; invalid context returns 409.

## Container build

The Dockerfile builds the Vite bundle and runs Express on port 8080. The production Node/tsx server path was smoke-tested, and Cloud Build successfully built and deployed the actual container. A local Docker engine is not required for that evidence. Pushing a new image or materially changing cloud resources remains an external action requiring review.

## Common incidents

### Health works but Gemini is skipped

1. Confirm `ALLOW_LIVE_GEMINI=true` only if approval exists.
2. Confirm exactly one credential path is intentionally configured.
3. For Vertex, verify project/location, required APIs, IAM/service identity, ADC or runtime credentials, and quota. Account reauthentication is already cleared.
4. Inspect redacted structured logs for `gemini_extraction_rejected`.
5. Do not expose credentials while troubleshooting.

### Origin chip reads IN-BROWSER

- The compiler API was unreachable (network `TypeError`) and the browser compiled the exact fixture locally. Nothing left the page.
- Check the API process, the Vite proxy (`/api` → `:8080`), and browser network errors; recompile once the API answers.
- A browser-origin result never carries a compile token, so server review is not possible from it.

### Live compile rejected after a model change

- `gemini_extraction_rejected` with an SDK/validation message right after changing `GEMINI_MODEL`: check that Gemini 3 models get `thinkingLevel` (automatic) and that `GEMINI_THINKING_LEVEL` is `low`/`medium`/`high`; `minimal` fails on non-Lite models.
- For Vertex, Gemini 3.x Flash requires `GOOGLE_CLOUD_LOCATION=global`.
- Roll back by pinning the previous model; the deterministic path keeps serving meanwhile.

### Compile returns deterministic output unexpectedly

- Check API availability and browser network errors.
- Check for the 60-second client timeout or a surfaced abort error.
- Check server logs for model validation rejection.
- Confirm the UI labels fallback mode.

### Vertex activity or cost evidence needs reconciliation

- Correlate the in-app provider/receipt with redacted `compile_completed` logs and the official Vertex request/token graphs.
- Treat request/token graphs as execution observability, not a durable application audit trail.
- Treat the billing report's ₩0 only as the captured interval/value; wait through the displayed reporting-lag window before final expense disclosure.

### HTTP 429

- Stop retrying until the ten-minute in-memory window expires.
- Do not bypass the limit for a public deployment; use managed controls instead.

### HTTP 400

- Confirm exactly three artifacts.
- Confirm each artifact is at most 8,000 characters.
- Confirm every fixture field matches the disclosed synthetic artifacts; custom text and metadata are intentionally rejected.
- Confirm the JSON body is within the 64 KB limit.

### HTTP 409 on review

- Reload/recompile the version-1 baseline.
- Ensure the patch ID is `PATCH-014-A`.
- Ensure the current result includes the compile token and that it has not expired, been modified, or been issued under a different secret/process.
- Do not replay or force an approval.

## Rollback

- Local code: return to the last known-good public commit; the current license-compliance deployment checkpoint is `d5f9f33180a1edbdfeb8e5d4b8775a98643fd28c`.
- Live model: set `ALLOW_LIVE_GEMINI=false` and restart; verify provider shows deterministic demo.
- Model: pin `GEMINI_MODEL` to the previously verified model (`gemini-2.5-flash` until 2026-10-16) and redeploy.
- Token secret: rotate only through approved secret management and expect all outstanding review tokens to become invalid.
- Public deployment: route traffic back to a known-good Cloud Run revision or redeploy a known-good image; this remains to be rehearsed before any real use.
- External submission/video/repository: do not assume changes are reversible; use a human pre-flight review before publishing.

## Logging and data hygiene

The server logs structured event metadata. Keep artifact bodies, keys, tokens, account identifiers, revenue records, and personal data out of logs. Redact any evidence exported for QA or Devpost.
