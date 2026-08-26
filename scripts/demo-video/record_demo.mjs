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
#dz-term{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:1500px;max-height:820px;z-index:2147483646;
  background:#07090a;border:1px solid #2a3a1e;box-shadow:0 30px 90px rgba(0,0,0,.7);opacity:0;transition:opacity .4s ease;pointer-events:none;
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#e8e3d6}
#dz-term.on{opacity:1}
#dz-term .bar{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid #1f2a17;color:#8a8f7a;font-size:14px;letter-spacing:2px;text-transform:uppercase}
#dz-term .bar i{display:inline-block;width:12px;height:12px;border-radius:50%;background:#3a4a2a}
#dz-term pre{margin:0;padding:22px 26px;font-size:21px;line-height:1.5;white-space:pre-wrap;color:#d9d4c4}
#dz-term pre .ok{color:#b9d86a}#dz-term pre .bad{color:#e0806a}#dz-term pre .warn{color:#d7b46a}#dz-term pre .dim{color:#8a8f7a}
`;

const install = (page) => page.evaluate((css) => {
  if (document.getElementById("dz-cap")) return;
  const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
  const c = document.createElement("div"); c.id = "dz-cap"; document.body.appendChild(c);
  const k = document.createElement("div"); k.id = "dz-card";
  k.innerHTML = '<div class="k"></div><div class="t"></div><div class="s"></div><div class="f"></div>';
  document.body.appendChild(k);
  const r = document.createElement("div"); r.id = "dz-ring"; document.body.appendChild(r);
  const t = document.createElement("div"); t.id = "dz-term"; t.innerHTML = '<div class="bar"><i></i><i></i><i></i><span></span></div><pre></pre>'; document.body.appendChild(t);
}, CSS);
const term = (page, title, html) => page.evaluate(([t, h]) => { const el = document.getElementById("dz-term"); el.querySelector(".bar span").textContent = t; el.querySelector("pre").innerHTML = h; el.classList.add("on"); }, [title, html]);
const termOff = (page) => page.evaluate(() => document.getElementById("dz-term")?.classList.remove("on"));
const KOREAN_BRIEF = [
  "서브팹의 모든 구역에서 모든 화학 누출을 완전 자율로 식별하는 사족 사륜 로봇이 필요합니다. 가장 좁은 통로는 약 800 mm입니다. 파일럿으로 전체 개념을 증명하기를 원합니다.",
  "1단계 배포는 시설 전체를 커버하고 라만 센싱으로 모든 누출 물질을 자율적으로 식별합니다. 사족 사륜 플랫폼은 필수 구성으로 납품됩니다. 인수 기준은 성공적인 자율 커버리지입니다.",
  "현재 라만 근거는 통제된 조건에서 다섯 가지 명명된 분석 물질을 커버합니다. 프로브 작동 거리는 10 mm입니다. 12곳의 핵심 구역이 매핑되었습니다. 전 구역 접근은 미실측입니다. 800 mm 통로 폭은 고객 진술이며 실측되지 않았습니다. 감독 하의 1단계 운영과 파일럿 게이트 전 블라인드 5종 분석 테스트를 권고합니다.",
];
const CLI_OUTPUT = process.env.CLI_OUTPUT_FILE ? readFileSync(process.env.CLI_OUTPUT_FILE, "utf8") : "";
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const colorize = (s) => escapeHtml(s).split("\n").map((line) => line.startsWith("  ✗") ? `<span class="bad">${line}</span>` : line.startsWith("  !") ? `<span class="warn">${line}</span>` : line.startsWith("verdict:") || line.startsWith("exit code") ? `<span class="bad">${line}</span>` : line.startsWith("patch ") || line.startsWith("  ") ? `<span class="ok">${line}</span>` : line.startsWith("note:") || line.startsWith("written:") ? `<span class="dim">${line}</span>` : line).join("\n");
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
  await card(page, "Synthetic demo · v0.4.0", "DEPLOY<span>//</span>ALIGN", "Compile scattered deployment promises into testable commitments — customer intent, sales promise and engineering evidence, type-checked before a field decision.", "FICTIONAL SUB-FAB RAMAN PILOT · NO CUSTOMER DATA");
  await sleep(page, 700);
  await scene(0, async () => {
    await card(page, "Synthetic demo · v0.4.0", "DEPLOY<span>//</span>ALIGN", "Compile scattered deployment promises into testable commitments — customer intent, sales promise and engineering evidence, type-checked before a field decision.", "FICTIONAL SUB-FAB RAMAN PILOT · NO CUSTOMER DATA");
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
  // 10 targets + receipts
  await scene(10, async () => {
    await ringOff(page); await glide(page, ".targets-section"); await ring(page, ".target-tabs");
    const tabs = page.locator(".target-tabs button");
    for (let k = 0; k < 3; k++) { await tabs.nth(k).click(); await sleep(page, 1000); }
    await ringOff(page); await glide(page, "#provenance"); await page.getByRole("button", { name: /receipts/i }).click(); await sleep(page, 400); await ring(page, ".receipts-list");
  });
  // 11 custom: open the editor and paste a Korean brief
  await scene(11, async () => {
    await ringOff(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await sleep(page, 900);
    await page.getByRole("button", { name: /Use your own documents/i }).click();
    await sleep(page, 700);
    await glide(page, ".editor-section");
    const areas = page.locator(".editor-card textarea");
    for (let k = 0; k < 3; k++) { await areas.nth(k).fill(""); await areas.nth(k).pressSequentially(KOREAN_BRIEF[k], { delay: 6 }); }
    await ring(page, ".editor-grid");
  });
  // 12 custom results: compile, show diagnostics then the patch and export buttons
  await scene(12, async () => {
    await ringOff(page);
    await page.getByRole("button", { name: /Compile these documents/i }).click();
    await page.getByText(/Compiled by the compiler API/).waitFor({ timeout: 15000 });
    await sleep(page, 600);
    await glide(page, ".diagnostics-panel", "center"); await ring(page, ".diagnostics-panel");
    await sleep(page, 3800);
    await ringOff(page); await glide(page, ".patch-section"); await ring(page, ".diff-panel");
    await sleep(page, 2600);
    await ringOff(page); await glide(page, ".targets-section"); await ring(page, ".export-actions");
  });
  // 13 CLI card over the page
  await scene(13, async () => {
    await ringOff(page);
    await term(page, "$ deployalign compile ./deployment-docs --out ./compiled --fail-on blocker", colorize(CLI_OUTPUT));
  });
  // 14 close card
  await scene(14, async () => { await termOff(page); await card(page, "Open source · MIT", "DEPLOY<span>//</span>ALIGN", "github.com/chquandogong/deployalign — evidence-gated decision compiler for robotics deployment. Gemini proposes, deterministic rules decide, a person approves.", "SYNTHETIC DEMO · NO CUSTOMER, REVENUE OR FIELD CLAIM"); });
  await sleep(page, 400);

  const videoPath = await page.video().path();
  await page.close(); await ctx.close(); await browser.close();
  writeFileSync(PLAN, JSON.stringify(plan, null, 1));
  console.log("VIDEO", videoPath);
})().catch((e) => { console.error("ERR", e); process.exit(1); });
