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

**Plan:** `D:\SoterCare\Github-B2B\b2b-plan\` (v2: docs 01–20, one topic per file). It lives only on the local disk for now; a private `sotercare-docs` repo is proposed so SerenEdge can link it (O-19).
- Start with `README.md`, `01-Product-and-Scope.md` and `02-System-Architecture.md`.
- Which docs this repo needs: `16-Repos-and-Ownership.md` §3.
- `D-xx` / `O-x` refer to `19-Decisions-and-Open-Items.md`, the decision log. **When docs disagree, 19 wins.**
- Old code to start from: `17-Old-Code-Carry-Over.md`.
- Build order and checkpoints: `18-Build-Plan-2-Weeks.md`:
  - a Day 0 gate, then daily integration checkpoints;
  - **Day 14 = release candidate (RC)** of the full software system on simulators, ESP32-C6 dev kits and a Pi 5 gateway (D-77);
  - then a scheduled **follow-on** (weeks 3–4, Days 15–24 in each repo's `docs/plan.md`) before a separate pilot gate.

```
sotercare-pcb-designs ── Rev A board ──► sotercare-firmware (thigh band)
band ── UDP + AES-CCM over facility Wi-Fi (06) ──► sotercare-edge-gateway (= nurse station, 1 per home)
staff phones ◄── local MQTT over WSS (alerts, claims, presence) ── gateway
gateway ── MQTT/TLS to AWS IoT Core → SQS (Wi-Fi or LTE) ──► sotercare-backend
backend ── record_ack, shadows (roster / bands / residents / policy / keys / service), cmd/claim ──► gateway
backend ── one RDS database per tenant (silo) + control DB
backend ── REST + Socket.IO ──► sotercare-console (facility), sotercare-mobile (Care staff / Family)
backend ── REST /v1/ops ──► sotercare-ops-console (SoterCare staff)
backend ── SNS → APNs / FCM push ──► sotercare-mobile
backend ── outbox → SQS events, S3 Parquet, internal API ──► sotercare-agents (agents + ARIA)
sotercare-contracts ── schemas + generated types ──► firmware, gateway, backend, agents, consoles, mobile
sotercare-infra ── provisions AWS + per-tenant resources ──► all cloud parts
sotercare-studio ── records ──► sotercare-iot-dataset (data + model training) ── gait model ──► gateway
sotercare-website (sotercare.com), sotercare-links (links.sotercare.com): standalone
```

**Platform rules (every repo):**
- **The gateway is the only real-time safety rule engine and claim arbiter** (D-08).
  - The cloud never derives alerts from telemetry.
  - Agents never create or change alerts.
- **Wellness wording** (D-06): no "medical", "diagnosis", "fever" or clinical thresholds.
- **Every cross-repo message is defined in `sotercare-contracts`.** Pin a version and run contract tests; never copy schemas.
- **Silo tenancy** (D-31): one tenant per request / case; never hold two tenants' data in one operation.
- **AWS `ap-south-1`**; **Bedrock** is the only LLM provider (D-07).
- **Translation-ready UI** (D-26): no hard-coded user-facing strings.
- **Build from the old repos' work** (D-20), keeping git history.

**Git and commits:**
- Protected `main`, PRs with CI (lint, typecheck, tests, contract tests against the pinned contracts version). SerenEdge tasks merge to `dev`; a release PR moves `dev` → `main` (O-23).
- Conventional commits (`feat:`, `fix:`, `docs:`…).
- **Never add `Co-Authored-By:` or any AI-attribution trailer to commits.**
- No secrets in git; AWS Secrets Manager in the cloud.
