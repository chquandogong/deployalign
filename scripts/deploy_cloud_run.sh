#!/usr/bin/env bash
# Redeploy the DeployAlign public demo (decision D-017).
#
# Human-gated: run only after the repository owner has approved the redeploy and
# `gcloud auth login` has been completed. The script reads the current service
# configuration first so runtime identity, secret binding and scaling limits are
# preserved; it only changes the image and the model pin.
#
# Usage:
#   scripts/deploy_cloud_run.sh            # describe → build+deploy → verify
#   DRY_RUN=1 scripts/deploy_cloud_run.sh  # describe and print the plan only
set -euo pipefail

PROJECT="${GOOGLE_CLOUD_PROJECT_ID:-project-55fbcfd2-0ad6-4c99-a25}"
REGION="${CLOUD_RUN_REGION:-asia-northeast3}"
SERVICE="${CLOUD_RUN_SERVICE:-deployalign}"
MODEL="${GEMINI_MODEL:-gemini-3.7-flash}"
GCLOUD="${GCLOUD:-gcloud}"

echo "== current service (${PROJECT} / ${REGION} / ${SERVICE})"
"$GCLOUD" run services describe "$SERVICE" --project "$PROJECT" --region "$REGION" \
  --format='yaml(spec.template.spec.serviceAccountName,spec.template.spec.containers[0].env,spec.template.metadata.annotations,status.latestReadyRevisionName,status.url)'

if [[ "${DRY_RUN:-0}" == "1" ]]; then
  echo "== dry run: would build from source and deploy with GEMINI_MODEL=${MODEL}"
  exit 0
fi

echo "== build + deploy from source (Cloud Build → Cloud Run)"
"$GCLOUD" run deploy "$SERVICE" --project "$PROJECT" --region "$REGION" \
  --source . \
  --update-env-vars "GEMINI_MODEL=${MODEL}" \
  --quiet

URL="$("$GCLOUD" run services describe "$SERVICE" --project "$PROJECT" --region "$REGION" --format='value(status.url)')"
REV="$("$GCLOUD" run services describe "$SERVICE" --project "$PROJECT" --region "$REGION" --format='value(status.latestReadyRevisionName)')"
echo "== deployed revision ${REV} at ${URL}"

echo "== verify health"
node -e '
const [url] = process.argv.slice(1);
(async () => {
  const health = await (await fetch(url + "/api/health")).json();
  console.log("health", JSON.stringify(health));
  const compile = await fetch(url + "/api/compile", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  const result = await compile.json();
  const ai = result.receipts.find((r) => r.stage === "gemini-extract");
  console.log("compile", compile.status, "provider", result.provider, "origin", result.executionOrigin, "mode", result.mode);
  console.log("gemini receipt", ai && ai.status, "-", ai && ai.summary);
  if (result.provider === "deterministic-demo") { console.error("LIVE GEMINI DID NOT RUN — check logs for gemini_extraction_rejected"); process.exit(2); }
})().catch((e) => { console.error(e); process.exit(1); });
' "$URL"

echo "== rollback hint: gcloud run services update-traffic ${SERVICE} --region ${REGION} --to-revisions <previous-revision>=100"
