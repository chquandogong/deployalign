# DeployAlign Runbook

> Status: Local prototype operations only · Date: 2026-08-17 · Owner: Engineering

## Supported operating mode

This runbook starts and troubleshoots the local synthetic demo. It does not authorize production deployment or use with real customer/safety data.

## Prerequisites

- Node.js 24 (matches the Dockerfile).
- Corepack with pnpm 11.19.0.
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

Health should report `liveGemini: false`. Compile should return `provider: deterministic-demo`, `synthetic: true`, version 1, and gate `HOLD`.

In non-production local mode, the server generates an ephemeral compile-token secret if none is configured. A restart invalidates outstanding one-hour review tokens. Production startup intentionally fails if `COMPILE_TOKEN_SECRET` is absent or shorter than 32 bytes.

The browser client has a 60-second request timeout. It falls back locally only for a network `TypeError` and only for the exact synthetic fixture; HTTP errors are surfaced, and abort/timeout errors are not intentionally converted to fallback. A compatible review can fall back only when the current provider is already deterministic. Because local and server-side deterministic results share the same provider value, treat execution origin as ambiguous unless the UI supplies separate evidence.

## Enable a live Gemini path

This is an external data/quota action. Use only after human approval, with synthetic text, in a controlled environment.

### Gemini Developer API

Set `ALLOW_LIVE_GEMINI=true` and `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) in the runtime environment. Never write the key into tracked files, screenshots, logs, or submission copy.

### Vertex AI

Set `ALLOW_LIVE_GEMINI=true`, `GOOGLE_CLOUD_PROJECT`, and optionally `GOOGLE_CLOUD_LOCATION`.

As of 2026-08-17, Google account `chquan17` is signed in, free-trial/billing status is active, and project `project-55fbcfd2-0ad6-4c99-a25` is active. A private screenshot showed zero spend at capture time. Reauthentication is no longer the blocker. Do not treat this prerequisite check as proof that Vertex AI APIs, IAM, Application Default Credentials, service identity, quotas, or runtime access are ready.

With human approval, confirm the intended project/region, enable only required APIs, configure least-privilege IAM and runtime credentials, and verify access without exposing tokens. If the approved local path requires ADC and it is not already valid, the typical interactive command is:

```text
gcloud auth application-default login
```

Do not claim success until a compile response reports `gemini-vertex` or `gemini-api` and a redacted provider/API usage record is retained. No successful live call or Google Cloud deployment is documented yet.

For any Cloud Run deployment, store a stable ≥32-byte `COMPILE_TOKEN_SECRET` in Secret Manager and expose it to the service through the approved secret binding. Do not place it in the image, source, command history, screenshots, or submission. Keep this demo at **max instances 1** because rate limiting and operational state are process-local; a shared token secret alone does not make the service production-distributed.

## Verification sequence

```text
pnpm test
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
- Review: an unexpired HMAC token preserves compile provider/candidate provenance; invalid context returns 409.

## Container build

The Dockerfile builds the Vite bundle and runs Express on port 8080. The production Node/tsx server path was smoke-tested, but a Docker engine was unavailable, so no image-build evidence exists. Building/running the image locally is reversible. Pushing an image, provisioning cloud resources, or deploying it is an external production/publication gate and requires human approval.

## Common incidents

### Health works but Gemini is skipped

1. Confirm `ALLOW_LIVE_GEMINI=true` only if approval exists.
2. Confirm exactly one credential path is intentionally configured.
3. For Vertex, verify project/location, required APIs, IAM/service identity, ADC or runtime credentials, and quota. Account reauthentication is already cleared.
4. Inspect redacted structured logs for `gemini_extraction_rejected`.
5. Do not expose credentials while troubleshooting.

### Compile returns deterministic output unexpectedly

- Check API availability and browser network errors.
- Check for the 60-second client timeout or a surfaced abort error.
- Check server logs for model validation rejection.
- Confirm the UI labels fallback mode.

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

- Local code: return to the last known-good commit once a commit exists.
- Live model: set `ALLOW_LIVE_GEMINI=false` and restart; verify provider shows deterministic demo.
- Token secret: rotate only through approved secret management and expect all outstanding review tokens to become invalid.
- Public deployment: no rollback procedure exists because no deployment is evidenced. Define and test one before deployment.
- External submission/video/repository: do not assume changes are reversible; use a human pre-flight review before publishing.

## Logging and data hygiene

The server logs structured event metadata. Keep artifact bodies, keys, tokens, account identifiers, revenue records, and personal data out of logs. Redact any evidence exported for QA or Devpost.
