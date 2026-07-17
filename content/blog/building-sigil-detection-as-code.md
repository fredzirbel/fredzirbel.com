---
title: "Building SIGIL: Learning Detection-as-Code"
description: "Why I built a Detection-as-Code pipeline for Sigma rules, and what writing, testing, and converting detections taught me about how detection engineering actually works."
date: 2026-07-16
tags: ["detection-engineering", "sigma", "python"]
---

As a SOC analyst I spend my days on the receiving end of detections: the alerts they fire, the noise they generate, the gaps they leave. I wanted to understand the other side, so I built [SIGIL](https://github.com/fredzirbel/SIGIL), a Detection-as-Code framework for Sigma rules.

## The problem it models

In a typical SOC, detection content is fragile. Rules get written directly in each SIEM's console, there's no version history, no way to test a rule before it goes live, and nobody can answer "what ATT&CK techniques can we actually detect?" without a manual audit.

Mature detection engineering teams treat rules like software: vendor-neutral rule files in git, validated and tested in CI before anything reaches production. SIGIL is my working model of that pipeline.

## What it does

Four stages, one CLI:

1. **Validate** - checks every rule against the Sigma specification: required fields, UUID format, ATT&CK tag syntax, detection structure
2. **Convert** - translates rules to Splunk SPL and Microsoft Sentinel KQL through pySigma backends
3. **Test** - runs rules against sample log files and classifies the results as true/false positives and negatives
4. **Coverage** - maps `attack.tXXXX` tags onto the MITRE ATT&CK Enterprise matrix and renders a gap heatmap

Each stage returns a pass/fail exit code, so the whole thing runs as a CI gate: a broken rule fails the build before it ever reaches a SIEM.

## What I learned

**Sigma's abstraction is the whole point.** A rule says `category: process_creation` on `product: windows`, not "Sysmon Event ID 1 in index=sysmon". The conversion pipeline resolves that to concrete fields per SIEM. Writing the converter made me appreciate how much field-mapping pain this abstraction removes, and where it leaks.

**Testing detections is harder than writing them.** A rule that fires on a Mimikatz sample is easy. A rule that also stays quiet on benign PowerShell is the actual work. Building TP/FP/TN/FN verdicts into the pipeline forced me to think about every rule's false-positive story up front, which is exactly the discipline alert tuning at work demands.

**Coverage maps keep you honest.** Eight rules felt like progress until the heatmap showed 100+ Enterprise techniques mostly red. That's the point of the visualization: it turns "we have detections" into "we detect these specific behaviors, and not these."

## What's next

The framework is a learning vehicle and a work in progress. On the list: persisting pipeline runs to SQLite for coverage-over-time tracking, more rules and richer sample logs, and possibly an Elastic backend.

If you're an analyst curious about the engineering side of detection, I'd recommend building something like this. Reading about detection-as-code explains the workflow; implementing the validator is what made Sigma's rule structure stick.
