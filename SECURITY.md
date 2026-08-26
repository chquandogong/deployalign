# Security Policy

## Scope

DeployAlign is a **synthetic-data prototype**. The public demo has no authentication,
no persistence, no tenant isolation, and no durable audit trail, and it must not receive
real customer, site, or personal data. Please keep that boundary in mind when assessing
impact: a finding that requires real data to matter is still worth reporting, but it is
already outside the supported operating mode described in
[`docs/03-spec/SPEC.md`](docs/03-spec/SPEC.md).

## Supported versions

Only the `main` branch and the latest tagged release receive fixes.

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

1. Use GitHub's private vulnerability reporting: **Security → Report a vulnerability** on
   [github.com/chquandogong/deployalign](https://github.com/chquandogong/deployalign/security).
2. Include reproduction steps, the affected commit or version, and your assessment of impact.

You should receive an acknowledgement within 7 days. Fixes for confirmed issues are
released on `main` with a CHANGELOG entry that credits the reporter unless you prefer
otherwise.

## What is *not* a vulnerability here

The following are documented design limits of the prototype rather than defects
(see `docs/04-quality/RISK_REGISTER.md`):

- The compile provenance token is signed, **not encrypted**, and is replayable within its
  one-hour lifetime. It preserves Gemini provenance across the review step; it is not
  authentication or authorization.
- The compile rate limiter is in-memory and per process (Cloud Run demo runs one instance).
- `fnv1a32-*` values are change fingerprints, not integrity hashes.
- The "approve" action is a demo review boundary, not an organisational approval.

Reports that show one of these limits being **crossed** — for example, a way to forge a
token, bypass the fixture guard, or reach Gemini with non-fixture text — are very welcome.
