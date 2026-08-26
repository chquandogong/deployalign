"""Usage: python scripts/demo-video/mix_video.py  (after build_narration.py and record_demo.mjs)

Mix narration into the recorded webm at the measured scene offsets, encode the
final MP4, and emit EN/KO/ZH SubRip subtitle files from the same plan."""
import json, os, subprocess, sys, glob

BUILD = os.environ.get("VIDEO_OUT_DIR", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "videos", "build"))
VERSION = os.environ.get("DEMO_VERSION", "0.4.0")
PLAN = f"{BUILD}/plan.json"
OUT = f"{BUILD}/DeployAlign-Demo-v{VERSION}.mp4"
raw = sorted(glob.glob(f"{BUILD}/raw/*.webm"), key=os.path.getmtime)[-1]
plan = json.load(open(PLAN))

def probe(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                 "-of", "default=noprint_wrappers=1:nokey=1", path],
                                capture_output=True, text=True, check=True).stdout.strip())

video_len = probe(raw)
inputs, filters, labels = ["-i", raw], [], []
for slot, p in enumerate(plan, start=1):
    inputs += ["-i", p["clip"]]
    delay = int(round(p["actual_start_seconds"] * 1000))
    filters.append(f"[{slot}:a]adelay={delay}|{delay},aresample=48000[a{slot}]")
    labels.append(f"[a{slot}]")
filters.append("".join(labels) + f"amix=inputs={len(labels)}:normalize=0:dropout_transition=0,apad[mixed]")
cmd = ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(filters),
       "-map", "0:v:0", "-map", "[mixed]",
       "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30",
       "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-t", f"{video_len:.3f}",
       "-movflags", "+faststart", OUT]
subprocess.run(cmd, check=True)
print(f"mixed -> {OUT} ({probe(OUT):.2f}s, source {video_len:.2f}s)")

# ---- subtitles ----
KO = [
 "DeployAlign은 흩어진 배포 약속을 검증 가능한 커밋먼트로 컴파일합니다. 이것은 0.4 버전이며, 합성 케이스로 보여드립니다: 가상의 서브팹 라만 검사 파일럿, 고객 데이터는 전혀 없습니다.",
 "문서 셋, 진실 셋. 고객은 모든 화학 누출을, 모든 구역에서, 완전 자율로 원합니다. 영업은 시설 전체를 약속합니다. 엔지니어링은 명명된 분석 대상 5개, 매핑된 구역 12곳, 감독 하의 운영만 근거로 댈 수 있고, 여전히 블라인드 테스트와 현장 실측이 필요합니다.",
 "클릭 한 번으로 컴파일됩니다. provider 배지는 Gemini가 실행됐는지 결정론적 경로가 실행됐는지를, origin 칩은 컴파일러 API가 만들었는지 이 브라우저가 만들었는지를 보여줍니다. 공개 데모는 Vertex AI의 Gemini 3.7 Flash를 실행합니다.",
 "진술들은 타입이 있는 커밋먼트 그래프가 됩니다. 고객 선호는 제약이 아닙니다. 영업 약속은 수용된 근거를 앞지를 수 없습니다. 구두 현장 진술은 실측된 사실이 아닙니다.",
 "결정론적 규칙이 원문 인용이 붙은 6개의 안정적인 진단을 냅니다. 넷은 블로커이므로 게이트는 HOLD를 유지합니다.",
 "모든 노드와 진단은 이름이 붙은 아티팩트의 원문 구간으로 추적됩니다. 근거 연결은 예의가 아니라 계약입니다.",
 "DeployAlign은 근거가 뒷받침하는 가장 작은 변경을 제안합니다: 명명된 분석 대상 5개, 매핑된 구역 12곳, 감독 하의 1단계. 모든 값은 엔지니어링 텍스트에서 복사한 것이며, 발명한 것은 없습니다.",
 "그리고 멈춥니다. 사람이 패치를 검토하면 베이스라인은 버전 2로 넘어갑니다. 이 버튼은 그 경계의 데모이며 인증된 승인이 아닙니다.",
 "게이트는 HOLD에서 CONDITIONAL PILOT으로 움직이며, 절대 무조건 통과가 되지 않습니다. 블라인드 테스트와 실측은 열린 채 남습니다.",
 "결정과 연결된 6개 섹션이 재컴파일되고, 무관한 3개 섹션은 변경 지문을 유지합니다.",
 "하나의 결정 ID가 고객 메모, 영업 SOW, 엔지니어링 테스트 매니페스트로 전파되고, 영수증이 누가 무엇을 했는지 기록합니다: Gemini, 결정론적 규칙, 사람 검토자, 빌드 엔진.",
 "0.3 버전부터 자기 문서 세 개를 붙여 넣을 수 있습니다. 로컬에서 같은 감지기가 여러분의 텍스트 위에서 실행되며 — 영어 또는 1차 한국어 — 모든 결과는 여전히 출처를 인용합니다.",
 "여기 한국어 브리프입니다: 한국어 인용이 붙은 6개 진단, 엔지니어링 문장에서 그대로 복사한 패치, 그리고 Markdown 또는 JSON 내보내기.",
 "그리고 0.4 버전부터 빌드 단계로 실행됩니다. deployalign compile은 제안이 근거를 앞지르면 종료 코드 2로 파이프라인을 실패시킵니다.",
 "MIT 오픈소스입니다. Gemini가 제안하고, 결정론적 규칙이 판정하고, 사람이 승인합니다. 실제 사용자 검증은 아직 앞에 있으며, 오늘 주장하지 않습니다.",
]
ZH = [
 "DeployAlign 把零散的部署承诺编译成可测试的承诺条款。这是 0.4 版，在一个合成案例上演示：虚构的 sub-fab 拉曼检测试点，背后没有任何客户数据。",
 "三份文档，三种真相。客户想要全自主地识别所有区域内的所有化学泄漏。销售承诺覆盖整个厂区。工程只能为五种已命名分析物、12 个已映射区域和有人监督运行提供证据，而且仍需要盲测和现场勘测。",
 "一键编译。provider 徽标说明运行的是 Gemini 还是确定性路径，origin 徽标说明结果由编译器 API 还是由这个浏览器产生。公开演示通过 Vertex AI 运行 Gemini 3.7 Flash。",
 "这些语句变成带类型的承诺图。客户偏好不是约束。销售承诺不能超出已接受的证据。口头的现场陈述不是实测事实。",
 "确定性规则给出六项附带原文引用的稳定诊断。其中四项是阻断项，所以闸门保持 HOLD。",
 "每个节点和每项诊断都能追溯到指定材料中的逐字片段。有据可查是契约，不是礼节。",
 "DeployAlign 提出证据所支持的最小改动：五种已命名分析物、12 个已映射区域、有人监督的 Phase 1。每个值都复制自工程文本，没有任何臆造。",
 "然后它停下来。由人来评审补丁，基线推进到版本二。这个按钮只是该边界的演示，不是经过身份验证的批准。",
 "闸门从 HOLD 变为 CONDITIONAL PILOT，永远不会变成无条件通过。盲测和勘测仍然开放。",
 "与决策关联的六个章节被重新编译；三个无关章节保留其变更指纹。",
 "一个决策 ID 传播到客户备忘、销售 SOW 和工程测试清单，回执记录了谁做了什么：Gemini、确定性规则、人工评审者、构建引擎。",
 "从 0.3 版起，你可以粘贴自己的三份文档。同样的检测器在本地作用于你的文本——英文，或首版韩文——每条发现仍然引用其来源。",
 "这里是一份韩文简报：六项带韩文引用的诊断、逐字复制自工程语句的补丁，以及 Markdown 或 JSON 导出。",
 "从 0.4 版起，它可以作为构建步骤运行。当提案超出证据时，deployalign compile 以退出码 2 使流水线失败。",
 "以 MIT 许可开源。Gemini 提出建议，确定性规则做出判定，由人批准。真实用户验证仍在前方，今天不做任何此类声明。",
]

def ts(sec):
    ms = int(round(sec * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def write_srt(path, texts):
    with open(path, "w", encoding="utf-8") as f:
        for i, (p, t) in enumerate(zip(plan, texts), start=1):
            start = p["actual_start_seconds"]; end = start + p["narration_seconds"]
            f.write(f"{i}\n{ts(start)} --> {ts(end)}\n{t}\n\n")
    print("wrote", path)

write_srt(f"{BUILD}/DeployAlign-Demo-v{VERSION}.en.srt", [p["text"] for p in plan])
write_srt(f"{BUILD}/DeployAlign-Demo-v{VERSION}.ko.srt", KO)
write_srt(f"{BUILD}/DeployAlign-Demo-v{VERSION}.zh.srt", ZH)
# chapter list for the YouTube description
for p in plan:
    m, s = divmod(int(p["actual_start_seconds"]), 60)
    print(f"{m}:{s:02d} {p['id']}")
