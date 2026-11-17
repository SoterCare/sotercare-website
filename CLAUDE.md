@AGENTS.md


# SoterCare: sotercare-website

## What this repo is
The **public marketing site** for sotercare.com (Next.js). It covers:
- the B2B care-home product pages, news, community, pitch page;
- the Book a demo popup;
- SEO (`robots`, `sitemap`, `llms.txt`).

It was renamed from `web-dev-v2` with its full history. The B2B plan for this repo is in `B2B-PLAN.md`.

## Current stage / next work
- `main` is already the B2B site. The dashboard and carer login were removed in `e88ba1e`
- **Don't merge `phase-1/alert-reliability` here.** Those dashboard changes go to `sotercare-console`, which is created from this repo's history at `4837021`
- Confirm the sotercare.com deployment still builds from `SoterCare/sotercare-website` after the rename
- Content stays within **wellness** positioning: no "medical", "diagnosis" or "guaranteed alert" claims (D-06)

## Connections
| Direction | Repo | What |
|---|---|---|
| history source for | `sotercare-console` | dashboard code at `4837021` + `phase-1` |
| linked from | `sotercare-links` | links.sotercare.com |
| none | runtime platform repos | standalone (the demo form doesn't call the backend) |

## Rules
- Pushing to `main` deploys the public site; check the preview

## How the SoterCare B2B platform fits together

**Plan:** `D:\SoterCare\Github-B2B\b2b-plan\` (docs 01–07; not in a repo yet).
- `D-xx` refers to its decision log and `O-x` to its open items (`04-Repos-and-Roadmap.md` §5).
- `07-Old-Repo-Mapping.md` says which old code each repo starts from.

```
sotercare-pcb-designs ── board for ──► sotercare-firmware (thigh band, ~60 per facility)
band ── facility Wi-Fi, local link (transport: open item O-5) ──► sotercare-edge-gateway (1 per facility)
staff phones ◄── local MQTT over WSS (alerts, claims, presence) ── gateway
gateway ── AWS IoT Core → SQS (alert-record, telemetry, heartbeat) ──► sotercare-backend
backend ── record_ack, shadows (roster / bands / policy / keys), cmd/claim ──► gateway
backend ── REST + Socket.IO ──► sotercare-console, sotercare-mobile
backend ── SNS → APNs / FCM push ──► sotercare-mobile
backend ── outbox → SQS events, S3 Parquet export, internal API ──► sotercare-agents
agents ── outputs / proposals / case traces (internal API) ──► backend
sotercare-contracts ── schemas + generated types ──► firmware, gateway, backend, agents, console, mobile
sotercare-infra ── provisions and deploys ──► AWS (IoT Core, ECS, RDS, Cognito, SNS, S3, Bedrock)
sotercare-studio ── records ──► sotercare-iot-dataset ── trains ──► sotercare-ml ── models ──► firmware, gateway
sotercare-website (sotercare.com), sotercare-links (links.sotercare.com): standalone
```

**Platform rules (every repo):**
- **The gateway is the only real-time safety rule engine and claim arbiter** (D-08).
  - The cloud never derives fall / SOS / moisture alerts from telemetry.
  - Agents never create or change alerts.
- **Wellness product** (D-06): no "medical", "diagnosis" or clinical-threshold wording in code, UI or docs.
- **Every cross-repo message is defined in `sotercare-contracts`.** Pin a version and run contract tests. Never keep a local copy of a schema.
- **Tenancy:** every record carries `org_id` (and `facility_id` where relevant). The backend enforces row-level security.
- **AWS `ap-south-1`** (Mumbai). **Amazon Bedrock** is the only LLM provider (D-07).
- **Build from the old repos' work** (D-20). Keep git history when moving code in. Rewrite only what the B2B design changes.

**Git and commits:**
- Trunk-based, protected `main`, PRs with CI (lint, typecheck, tests, contract tests).
- Conventional commits (`feat:`, `fix:`, `docs:`…).
- **Never add `Co-Authored-By:` or any AI-attribution trailer to commits.**
- No secrets in git. Use env files that are git-ignored locally, and AWS Secrets Manager in the cloud.
