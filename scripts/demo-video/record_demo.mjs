// Narration-first recorder for the DeployAlign demo video (v0.2.0 script).
// Usage: DEMO_URL=http://localhost:8080/ node scripts/demo-video/record_demo.mjs
// Reads video/plan.json (hold seconds per scene), drives the local production
// build with Playwright, records 1920x1080 webm, and writes back the wall-clock
// offset at which each scene actually started so narration can be mixed in place.
import { readFileSync, writeFileSync } from "node:fs";
// Playwright is not a project dependency; point PLAYWRIGHT_MODULE at any
// installed playwright package (>= 1.58) or `pnpm add -D playwright` in a scratch checkout.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BUILD = process.env.VIDEO_OUT_DIR ?? resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "videos", "build");
const OUT = `${BUILD}/raw`;
const PLAN = `${BUILD}/plan.json`;
const BASE = process.env.DEMO_URL ?? "http://localhost:8080/";
const W = 1920, H = 1080;
const plan = JSON.parse(readFileSync(PLAN, "utf8"));

const CSS = `
#dz-cap{position:fixed;left:0;right:0;bottom:0;z-index:2147483647;
  font:600 30px/1.35 Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  color:#f3efe4;padding:26px 56px 34px;text-align:center;
  background:linear-gradient(to top,rgba(7,9,10,.96) 0%,rgba(7,9,10,.84) 55%,rgba(7,9,10,0) 100%);
  text-shadow:0 2px 12px rgba(0,0,0,.9);opacity:0;transition:opacity .35s ease;letter-spacing:.2px;pointer-events:none}
#dz-cap.on{opacity:1}
#dz-cap b{color:#b9d86a}
#dz-card{position:fixed;inset:0;z-index:2147483646;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;
  background:#07090a;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#e8e3d6;opacity:0;transition:opacity .5s ease;pointer-events:none}
#dz-card.on{opacity:1}
#dz-card .k{font-size:20px;color:#8a8f7a;letter-spacing:4px;text-transform:uppercase;font-weight:700;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
#dz-card .t{font-size:78px;font-weight:800;letter-spacing:-1.5px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
#dz-card .t span{color:#b9d86a}
#dz-card .s{font-size:30px;color:#a8a693;font-weight:500;max-width:1240px;text-align:center;line-height:1.45}
#dz-card .f{margin-top:18px;font-size:20px;color:#d7b46a;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:2px}
#dz-ring{position:fixed;z-index:2147483645;border:3px solid #b9d86a;border-radius:10px;
  box-shadow:0 0 0 5px rgba(185,216,106,.18),0 0 34px rgba(185,216,106,.5);opacity:0;transition:all .38s cubic-bezier(.4,0,.2,1);pointer-events:none}
#dz-ring.on{opacity:1}
`;

const install = (page) => page.evaluate((css) => {
  if (document.getElementById("dz-cap")) return;
  const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
  const c = document.createElement("div"); c.id = "dz-cap"; document.body.appendChild(c);
  const k = document.createElement("div"); k.id = "dz-card";
  k.innerHTML = '<div class="k"></div><div class="t"></div><div class="s"></div><div class="f"></div>';
  document.body.appendChild(k);
  const r = document.createElement("div"); r.id = "dz-ring"; document.body.appendChild(r);
}, CSS);
const cap = (page, html) => page.evaluate((h) => { const c = document.getElementById("dz-cap"); if (!c) return; c.innerHTML = h; c.classList.toggle("on", Boolean(h)); }, html);
const card = (page, k, t, s, f) => page.evaluate(([k, t, s, f]) => { const c = document.getElementById("dz-card"); c.querySelector(".k").textContent = k; c.querySelector(".t").innerHTML = t; c.querySelector(".s").textContent = s; c.querySelector(".f").textContent = f; c.classList.add("on"); }, [k, t, s, f]);
const cardOff = (page) => page.evaluate(() => document.getElementById("dz-card")?.classList.remove("on"));
const ring = (page, sel) => page.evaluate((sel) => { const r = document.getElementById("dz-ring"); const el = sel && document.querySelector(sel); if (!r) return; if (!el) { r.classList.remove("on"); return; } const b = el.getBoundingClientRect(); r.style.left = b.left - 8 + "px"; r.style.top = b.top - 8 + "px"; r.style.width = b.width + 16 + "px"; r.style.height = b.height + 16 + "px"; r.classList.add("on"); }, sel);
const ringOff = (page) => ring(page, null);
const glide = async (page, sel, block = "start") => { await page.evaluate(([s, b]) => document.querySelector(s)?.scrollIntoView({ behavior: "smooth", block: b }), [sel, block]); await page.waitForTimeout(1100); };
const sleep = (page, ms) => page.waitForTimeout(ms);

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-device-scale-factor=1", "--hide-scrollbars", "--disable-gpu-vsync"] });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: OUT, size: { width: W, height: H } }, deviceScaleFactor: 1, colorScheme: "dark" });
  const page = await ctx.newPage();
  const t0 = Date.now();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await install(page);
  await sleep(page, 300);

  const started = (i) => { plan[i].actual_start_seconds = Math.round((Date.now() - t0) / 10) / 100; };
  const holdMs = (i) => Math.round(plan[i].hold_seconds * 1000);
  // Each scene: perform setup, mark start, show caption, hold for narration length.
  const scene = async (i, setup) => {
    const s = plan[i];
    started(i);
    const begun = Date.now();
    if (s.caption) await cap(page, s.caption);
    await setup?.();
    const remaining = holdMs(i) - (Date.now() - begun);
    if (remaining > 0) await sleep(page, remaining);
    await cap(page, "");
    await ringOff(page);
    await sleep(page, 200);
    console.log(`[${String(i).padStart(2, "0")}] ${s.id.padEnd(12)} start ${s.actual_start_seconds}s hold ${s.hold_seconds}s setup ${((Date.now() - begun) / 1000).toFixed(1)}s`);
  };

  // 00 title card
  await card(page, "Synthetic demo · v0.2.0", "DEPLOY<span>//</span>ALIGN", "Compile scattered deployment promises into testable commitments — customer intent, sales promise and engineering evidence, type-checked before a field decision.", "FICTIONAL SUB-FAB RAMAN PILOT · NO CUSTOMER DATA");
  await sleep(page, 700);
  await scene(0, async () => {
    await card(page, "Synthetic demo · v0.2.0", "DEPLOY<span>//</span>ALIGN", "Compile scattered deployment promises into testable commitments — customer intent, sales promise and engineering evidence, type-checked before a field decision.", "FICTIONAL SUB-FAB RAMAN PILOT · NO CUSTOMER DATA");
  });
  // 01 sources
  await scene(1, async () => { await cardOff(page); await sleep(page, 500); await glide(page, ".sources-section"); await ring(page, ".source-grid"); });
  // 02 compile
  await scene(2, async () => {
    await ringOff(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await sleep(page, 900);
    await page.getByRole("button", { name: /Compile sources/i }).click();
    await sleep(page, 1500);
    await ring(page, ".topbar-actions");
  });
  // 03 graph
  await scene(3, async () => { await ringOff(page); await glide(page, "#compiler-workbench"); await ring(page, ".graph-canvas"); await page.locator(".graph-node").filter({ hasText: "PREF-003" }).first().click(); await sleep(page, 900); await page.locator(".graph-node").filter({ hasText: "COM-006" }).first().click(); });
  // 04 diagnostics
  await scene(4, async () => { await ringOff(page); await glide(page, ".diagnostics-panel", "center"); await ring(page, ".diagnostics-panel"); const cards = page.locator(".diagnostic-card"); const n = await cards.count(); for (let k = 0; k < Math.min(n, 3); k++) { await cards.nth(k).click(); await sleep(page, 700); } });
  // 05 trace
  await scene(5, async () => { await ringOff(page); await glide(page, "#provenance"); await page.getByRole("button", { name: /Source map/i }).click(); await sleep(page, 400); await ring(page, ".trace-panel"); });
  // 06 patch
  await scene(6, async () => { await ringOff(page); await glide(page, ".patch-section"); await ring(page, ".diff-panel"); });
  // 07 approve
  await scene(7, async () => { await ringOff(page); await glide(page, ".approval-boundary", "center"); await ring(page, ".approval-boundary"); await sleep(page, 900); await page.getByRole("button", { name: /Simulate approval/i }).click(); await sleep(page, 1600); });
  // 08 gate
  await scene(8, async () => { await ringOff(page); await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })); await sleep(page, 1100); await ring(page, ".gate-console"); });
  // 09 impact
  await scene(9, async () => { await ringOff(page); await glide(page, ".impact-section"); await ring(page, ".impact-table"); });
  // 10 targets
  await scene(10, async () => {
    await ringOff(page); await glide(page, ".targets-section"); await ring(page, ".target-tabs");
    const tabs = page.locator(".target-tabs button");
    for (let k = 0; k < 3; k++) { await tabs.nth(k).click(); await sleep(page, 1300); }
  });
  // 11 receipts
  await scene(11, async () => { await ringOff(page); await glide(page, "#provenance"); await page.getByRole("button", { name: /receipts/i }).click(); await sleep(page, 500); await ring(page, ".receipts-list"); });
  // 12 close card
  await scene(12, async () => { await ringOff(page); await card(page, "Open source · MIT", "DEPLOY<span>//</span>ALIGN", "github.com/chquandogong/deployalign — evidence-gated decision compiler for robotics deployment. Gemini proposes, deterministic rules decide, a person approves.", "SYNTHETIC DEMO · NO CUSTOMER, REVENUE OR FIELD CLAIM"); });
  await sleep(page, 400);

  const videoPath = await page.video().path();
  await page.close(); await ctx.close(); await browser.close();
  writeFileSync(PLAN, JSON.stringify(plan, null, 1));
  console.log("VIDEO", videoPath);
})().catch((e) => { console.error("ERR", e); process.exit(1); });
