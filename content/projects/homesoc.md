---
title: HomeSOC
description: A live homelab telemetry pipeline for practicing detection engineering and safe SOC automation.
repository: https://github.com/fredzirbel/homesoc-platform
order: 3
tags: [Python, OpenSearch, Proxmox, OPNsense, Detection Engineering]
---

## Problem

Detection engineering is difficult to learn from static examples alone. I wanted a persistent environment where real infrastructure telemetry could be normalized, detected, visualized, tuned, and routed through an analyst workflow without using customer data.

## Audience

Security practitioners building a safe homelab for telemetry onboarding, rule development, and alert-tuning practice.

## Contribution

I built the FastAPI ingest/replay service, shared normalization and redaction library, detection engine, OpenSearch and Discord connectors, container stack, source configuration, tests, and deployment runbooks.

## Architecture

OPNsense and Proxmox send syslog to a service hosted in a dedicated Proxmox LXC. The API and worker normalize events into ECS-like fields, apply four ATT&CK-mapped detection rules with suppression, write events and alerts to OpenSearch, and send formatted alerts to Discord. OpenSearch Dashboards provides alerts over time, rule, source, severity, and triage views.

## Decisions

- Use live homelab traffic while masking private addresses before storage or sharing.
- Keep response recommendations in dry-run mode during tuning.
- Separate common models, detection logic, and external connectors so each can be tested independently.
- Document source onboarding and deployment as part of the product, not tribal knowledge.

## Security controls

- RFC1918 addresses are masked as `x.x.x.x`.
- Environment secrets are excluded from version control.
- `DRY_RUN=true` is the default for response recommendations.
- Public samples are sanitized before replay.

## Validation

The repository records verified forwarding from Proxmox and OPNsense, confirmed event and alert indexing in OpenSearch, confirmed Discord delivery, and a working dashboard. Unit tests cover normalization and detection-engine behavior.

## Limitations

Four rules are enough to exercise the pipeline but not broad defensive coverage. Discord is an educational notification target, and the homelab is not presented as a production multi-tenant SOC platform.

## Lessons

The hard part of detection engineering is often telemetry quality and operating discipline. A small live system with redaction, suppression, dashboards, and runbooks teaches more than a large catalog of disconnected rules.

## Screenshots

The project documentation records the live dashboard views: alerts over time, top rule IDs, top sources, severity distribution, and a Discover table for triage.

## Repository

[View HomeSOC on GitHub](https://github.com/fredzirbel/homesoc-platform)
