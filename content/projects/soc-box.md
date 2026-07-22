---
title: SOC Box
description: A self-hosted analyst workspace for URL detonation, enrichment, bulk analysis, and hunting-query generation.
repository: https://github.com/fredzirbel/SOCBox
order: 1
tags: [Python, FastAPI, Playwright, Docker, KQL]
---

## Problem

Suspicious-link investigations often require an analyst to move between browser isolation, reputation services, DNS and certificate records, endpoint pivots, and handwritten hunting queries. The handoffs add time and make results difficult to reproduce.

## Audience

SOC analysts and automation workflows that need a self-hosted investigation surface with both a web interface and API contracts.

## Contribution

I designed and built the Python application, analyzer orchestration, streamed web workflow, analyst-result views, enrichment utilities, KQL generator, persistence layer, and container runtime. The public repository includes 133 automated tests after the independent-brand regression was added.

## Architecture

FastAPI provides analyst pages, SSE scan progress, and versioned API endpoints. A scanner coordinates eight analyzers covering URL lexical signals, WHOIS/DNS, TLS, HTTP behavior, page content, active link discovery, downloads, and threat feeds. Playwright supplies controlled browser navigation and screenshots. SQLite stores scan history and analyst dispositions.

The same workspace also supports concurrent bulk scans, IP enrichment through configured reputation and location sources, and indicator classification that emits Defender XDR and Sentinel KQL.

## Decisions

- Keep the machine verdict separate from the analyst's TP, benign-TP, or FP disposition.
- Blend analyzer evidence and threat-feed evidence without double-counting the same source.
- Stream scan stages over SSE so slow browser work remains observable.
- Degrade enrichment sources independently when credentials are not configured.
- Keep interactive CAPTCHA takeover opt-in and unavailable to unattended bulk/API jobs.

## Security controls

- OIDC sessions and bearer service tokens gate pages and APIs.
- An SSRF guard rejects private, loopback, link-local, and cloud-metadata targets.
- Per-client scan rate limiting and secure response headers reduce exposed surface.
- Script-bound JSON is escaped to prevent stored XSS from attacker-controlled scan fields.
- DoH fallback rejects non-public answers, response bodies are capped, and secrets remain environment-only.
- The controllable browser and noVNC path are documented as requiring authenticated or VPN-restricted deployment.

## Validation

The repository workflow runs pytest, Ruff, Bandit, pip-audit, and gitleaks. Unit coverage includes scoring, classification, KQL escaping, SSRF behavior, DNS fallback, browser relaunch, authentication, and interactive takeover orchestration. The rebranding branch passed 133 tests, lint, SAST, dependency audit, and all pre-commit hooks.

## Limitations

The browser remains an intentionally high-risk component and needs network isolation in a serious deployment. Reputation depends on configured third-party sources. Zero-hour URLs may have little feed history, while QR extraction and nested-link decoding are not yet implemented.

## Lessons

Investigation speed comes from reducing context switches without hiding uncertainty. Explicit source health, explainable scoring, and a separate analyst disposition are more valuable than presenting one opaque confidence number.

## Screenshots

![SOC Box independent project mark](/projects/socbox-mark.svg)

The clean public capture set is designed around five states: single URL input, streamed results, bulk analysis, IP enrichment, and KQL generation. Captures must use defanged synthetic indicators and the independent SOC Box identity; no live malicious infrastructure or employer material is acceptable.

## Repository

[View SOC Box on GitHub](https://github.com/fredzirbel/SOCBox)
