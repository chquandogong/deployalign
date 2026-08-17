# Glossary

> Status: Active · Date: 2026-08-17 · Owner: Documentarian

| Term | Meaning in DeployAlign |
| --- | --- |
| AOI | Area of interest. The demo uses 12 mapped critical AOIs as a synthetic bounded scope. |
| Artifact | One source record from the synthetic customer, sales, or engineering perspective. |
| Commitment graph | Typed nodes and relationships representing objectives, preferences, commitments, constraints, assumptions, evidence, tests, decisions, and gates. |
| Compile | Transform source artifacts into graph nodes, diagnostics, a proposed patch, target documents, impact sets, and receipts. |
| Compile provenance token | One-hour base64url payload signed with HMAC-SHA256 that carries validated AI evidence through review. It is not encrypted, user authentication, or a durable approval record. |
| Conditional pilot | Demo gate after the patch is reviewed while the blind test and site survey remain open. It is not field authorization. |
| Decision ID | Stable identifier (`DEC-014`) attached to affected target sections. |
| Deterministic fallback | Deterministic compiler path used server-side when Gemini is disabled/rejected, or client-side for an eligible exact-fixture network failure. The current provider value does not distinguish those origins. |
| Diagnostic | A coded blocker or warning linked to source references and graph nodes. |
| Evidence envelope | The bounded claims supported by source evidence. In the synthetic demo: five named analytes under controlled conditions. |
| Execution receipt | A record describing a pipeline stage, actor, status, time, duration, and summary. Demo receipts are not a durable audit log. |
| Grounding | Linking an extracted or diagnostic claim to an exact quote in a named source artifact. Exact text does not guarantee correct interpretation. |
| Human approval gate | A point where an external, risky, or consequential action must stop for a person. The local demo review illustrates the concept but is not secure approval. |
| Impact set | Lists of changed, invalidated, rebuilt, and unchanged artifacts/sections after a decision. |
| FNV-1a32 fingerprint | A 32-bit non-cryptographic change detector prefixed `fnv1a32-`. It is not SHA, an integrity proof, or a signature. |
| Incremental compilation | For an approved compile, rebuilding the six `DEC-014`-linked sections while reusing three unrelated canonical sections from that compile's fresh baseline; their FNV-1a32 fingerprints remain stable. No cross-request object identity is claimed. |
| Live Gemini | A successful call to the Gemini Developer API or Gemini through Vertex AI. Configuration code alone is not evidence of such a call. |
| Patch | A reviewable set of semantic field changes. The demo patch changes analyte scope, coverage, and operating mode. |
| Production | A deployed, monitored, supported system serving real workflows. DeployAlign has no evidenced production deployment. |
| Source map | Artifact ID, quote, and line metadata used to trace a node/diagnostic to its origin. |
| Synthetic demo | Fictional scenario and data created for repeatable demonstration; not a customer, contract, facility, robot, or field result. |
| Target | Generated customer decision memo, sales SOW, or engineering test manifest. |
