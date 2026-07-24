---
title: SIGIL
description: A detection-as-code pipeline for validating, converting, testing, and measuring Sigma coverage.
repository: https://github.com/fredzirbel/SIGIL
order: 2
tags: [Python, Sigma, Splunk, Sentinel, MITRE ATT&CK]
---

## Problem

Detection rules can be syntactically valid yet still fail conversion, miss representative events, or leave important ATT&CK techniques uncovered. Manual review across each target SIEM does not scale well.

## Audience

Detection engineers who want a repeatable quality gate for Sigma content before deployment to Splunk or Microsoft Sentinel.

## Contribution

I built the CLI pipeline, validation rules, pySigma conversion adapters, sample-log test engine, ATT&CK mapper, and FastAPI coverage dashboard. The repository ships eight sample rules spanning Windows, Linux, and AWS telemetry.

## Architecture

A single CLI coordinates four stages: schema validation, target conversion, sample-event testing, and ATT&CK coverage mapping. Validator checks include required fields, UUIDs, statuses, levels, tags, and detection structure. Conversion uses pySigma backends. The tester reports TP, FP, TN, and FN outcomes, while the mapper feeds a web heatmap and JSON endpoints.

## Decisions

- Use vendor-neutral Sigma as the authored source and treat SIEM queries as build artifacts.
- Return failing process exit codes so the same pipeline works locally and in CI.
- Keep representative benign events beside malicious samples to expose false positives.
- Show both covered techniques and gaps across all 14 Enterprise tactics.

## Security controls

- Sample logs are local fixtures rather than customer telemetry.
- Rule parsing is schema-constrained before conversion or execution.
- CI runs lint and tests on changes, and an independent workflow validates Sigma syntax.
- The dashboard exposes read-only rule and coverage views.

## Validation

Repository tests cover the validator, Splunk/Sentinel converters, test engine, and ATT&CK mapper. The project also includes GitHub Actions for Ruff, pytest, and Sigma validation.

## Limitations

Sample-event matching is a development feedback loop, not a substitute for replaying production-shaped telemetry in the destination SIEM. Coverage measures tagged techniques, not detection efficacy or data-source readiness.

## Lessons

Detection-as-code becomes useful when the pipeline tests semantics as well as syntax. Conversion success, representative-event outcomes, and coverage context belong in the same review surface.

## Screenshots

The repository dashboard renders an ATT&CK coverage heatmap, per-tactic covered/total counts, overall coverage, rule metadata, and validation state.

## Repository

[View SIGIL on GitHub](https://github.com/fredzirbel/SIGIL)
