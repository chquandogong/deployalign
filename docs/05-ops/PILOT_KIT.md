# Practitioner Pilot Kit (roadmap 0.5)

> Status: Ready to run; no interview has happened yet · Date: 2026-08-26 · Owner: Project lead

The prototype now runs on anyone's three documents (UI local mode, CLI, GitHub Action) in
English or first-pass Korean. The only question that matters next is whether deployment
practitioners recognise the problem and trust the output. This kit is everything needed
to find out with five people in one week, without fabricating evidence.

## Who to recruit

Five people who reconcile customer requests, commercial promises and engineering evidence
before a field decision: application / deployment engineers, solutions engineers, presales
leads at robotics integrators, or the facilities owner on the customer side. Mixed sides
are better than five of one kind.

## Session plan (45 minutes)

| Minutes | Step | Record |
| --- | --- | --- |
| 0–10 | Their last painful drift: a promise that outran evidence and was found late | Incident, cost, who caught it, current workaround |
| 10–20 | In the UI, open **Use your own documents** and load an example preset (hospital EN, or the Korean set) — no explanation first | Did they find the diagnostics themselves? Which quote did they check first? |
| 20–35 | Their documents: three redacted texts pasted into local mode (`ALLOW_CUSTOM_ARTIFACTS=true`), or run through the CLI on their machine | Each diagnostic: agree / disagree / unsure; each patch value: correct source? |
| 35–45 | Would they run it before the next SOW review? What would stop them? | Trust blockers, missing rules, integration wish |

Ask the five Office Hours questions if the conversation stalls: how often does this
happen, what did it cost, who owns the review today, may source text leave the customer
environment, and would anyone pay for prevention, auditability or speed.

## Redaction rules for their documents

- Replace names of people, companies, sites and products with roles (`the customer`, `Site A`, `the vendor's platform`).
- Keep quantities, units, hedges ("about", "customer-reported") and modal verbs ("must", "will") intact — those are what the detectors read.
- Never paste anything under NDA into a machine that also runs `ALLOW_LIVE_GEMINI=true`; local mode with the model disabled keeps the text in the API process.
- Keep the redacted copy as a synthetic corpus candidate only with the participant's consent.

## What to measure

| Metric | How |
| --- | --- |
| Problem recognition | Participants who name a real analogue of the drift (target ≥ 3 of 5) |
| Diagnostic precision | Diagnostics the participant agrees with ÷ diagnostics fired, per document set |
| Misses | Material conflicts the participant names that the tool did not flag |
| Patch trust | Patch values whose source the participant confirms as the right evidence |
| Time to decision | Minutes from paste to "I know what to change" versus their usual review |
| Pull | Participants who ask to run it on their next proposal (target ≥ 2) |

## Turning findings into code

1. Every misfire is filed with the **Detector misfire** issue template (synthetic or redacted text only).
2. The sentence lands in `src/domain/general/corpora.test.ts` first, asserting the reviewer's expectation.
3. Then the lexicon or rule changes; the fixture, warehouse, hospital and Korean corpora must stay green.

## Stop signals (from the Office Hours review)

Practitioners see no material risk, cannot trust source mapping, or refuse to provide even
redacted samples after five sessions. If that happens, write it in `RETRO.md` and stop
building before adding identity, persistence or audit.
