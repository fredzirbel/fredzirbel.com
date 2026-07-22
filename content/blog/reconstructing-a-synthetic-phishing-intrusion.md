---
title: Reconstructing a Synthetic Multi-Stage Phishing Intrusion
description: A lab investigation across email, identity, and endpoint telemetry, with KQL pivots, scoping decisions, and remediation.
date: 2026-07-21
tags: [Synthetic, Incident Response, KQL, Phishing, Microsoft Defender]
---

> **Synthetic exercise:** Every user, device, message, domain, IP address, and timestamp in this article is fabricated for training. This is not a customer or employer incident.

## Scenario

At 14:07 UTC, a user reports an unexpected document-sharing email. The initial alert only says the message contained a suspicious link. The investigation has to answer four questions quickly: did the message reach anyone else, did anyone click it, were credentials used, and did the attacker reach an endpoint?

## Synthetic artifacts

| Artifact | Synthetic value | Purpose |
| --- | --- | --- |
| Recipient | alex.morgan@contoso-lab.example | Initial reporter |
| Sender | invoices@northwind-docs.example | Display-name lure |
| Subject | Updated Q3 compensation worksheet | Message pivot |
| Network message ID | LAB-20260721-140701-8842 | Cross-table email key |
| URL | hxxps://sharepoint-review[.]example/auth | Defanged click indicator |
| Redirect IP | 203.0.113[.]44 | Documentation-range infrastructure |
| Device | LAB-WKS-042 | Endpoint pivot |
| Session IP | 198.51.100[.]27 | Documentation-range sign-in source |

The IPs use IANA documentation ranges and the domains use the reserved `.example` namespace.

## Working hypotheses

1. The email was delivered but never interacted with.
2. The user clicked and submitted credentials, but conditional access blocked reuse.
3. The user clicked, a session was established, and the attacker attempted follow-on access.
4. The link launched or downloaded content that produced endpoint activity.

Each query should eliminate or strengthen one hypothesis. The goal is not to collect every event; it is to build a defensible sequence.

## Email pivot

Start with delivery scope and preserve the message key for later joins.

```kusto
EmailEvents
| where Timestamp between (datetime(2026-07-21 13:30:00) .. datetime(2026-07-21 15:30:00))
| where Subject == "Updated Q3 compensation worksheet"
   or SenderFromAddress =~ "invoices@northwind-docs.example"
| project Timestamp, NetworkMessageId, RecipientEmailAddress,
          DeliveryAction, DeliveryLocation, ThreatTypes, Subject
| order by Timestamp asc
```

Synthetic result: the same message reached four recipients. Three copies were delivered to inboxes; one was blocked. Only Alex reported it.

Next, enumerate URLs from those exact messages instead of searching the full tenant for a generic domain fragment.

```kusto
EmailUrlInfo
| where NetworkMessageId == "LAB-20260721-140701-8842"
| project Timestamp, NetworkMessageId, Url, UrlDomain
```

## Click and redirect pivot

```kusto
UrlClickEvents
| where Timestamp between (datetime(2026-07-21 13:30:00) .. datetime(2026-07-21 16:00:00))
| where AccountUpn in~ (
    "alex.morgan@contoso-lab.example",
    "jamie.lee@contoso-lab.example",
    "taylor.reed@contoso-lab.example"
  )
| where Url has "sharepoint-review.example"
| project Timestamp, AccountUpn, Url, ActionType, IsClickedThrough,
          Workload, IPAddress
| order by Timestamp asc
```

Synthetic result: Alex clicked at 14:11 UTC and was allowed through. No other recipient clicked. This rejects the first hypothesis and narrows identity review to a small time window.

## Identity pivot

Look for session changes, not simply all failed sign-ins.

```kusto
AADSignInEventsBeta
| where Timestamp between (datetime(2026-07-21 14:00:00) .. datetime(2026-07-21 16:00:00))
| where AccountUpn =~ "alex.morgan@contoso-lab.example"
| project Timestamp, AccountUpn, IPAddress, Application, LogonType,
          ErrorCode, ConditionalAccessStatus, SessionId, Country
| order by Timestamp asc
```

Synthetic result: a successful browser sign-in from `198.51.100[.]27` appears six minutes after the click. The source, session ID, and user agent differ from the user's established pattern. A second query shows new inbox-rule and OAuth-consent activity tied to the same session.

```kusto
CloudAppEvents
| where Timestamp between (datetime(2026-07-21 14:00:00) .. datetime(2026-07-21 17:00:00))
| where AccountId =~ "alex.morgan@contoso-lab.example"
| where ActionType in ("New-InboxRule", "Consent to application")
| project Timestamp, ActionType, AccountId, IPAddress, RawEventData
```

This supports credential or token compromise and rejects the conditional-access-blocked hypothesis.

## Endpoint pivot

The click event identifies `LAB-WKS-042`, so endpoint review is scoped to the device and the ten minutes surrounding interaction.

```kusto
DeviceProcessEvents
| where Timestamp between (datetime(2026-07-21 14:06:00) .. datetime(2026-07-21 14:25:00))
| where DeviceName =~ "LAB-WKS-042"
| where InitiatingProcessFileName in~ ("msedge.exe", "chrome.exe", "outlook.exe")
   or ProcessCommandLine has_any ("powershell", "mshta", "rundll32")
| project Timestamp, DeviceName, AccountName, FileName,
          ProcessCommandLine, InitiatingProcessFileName, SHA256
| order by Timestamp asc
```

Synthetic result: there is no suspicious child process, script interpreter, or downloaded executable. `DeviceFileEvents` also shows no payload written from the browser. The endpoint-execution hypothesis is not supported.

## Timeline

| UTC | Event | Assessment |
| --- | --- | --- |
| 14:07 | Three inbox deliveries, one blocked | Campaign scope established |
| 14:11 | Alex clicks the synthetic lure URL | User interaction confirmed |
| 14:17 | New successful browser session | Likely credential or token compromise |
| 14:23 | Inbox rule created | Persistence and collection behavior |
| 14:26 | OAuth consent recorded | Additional access path |
| 14:31 | No matching endpoint execution or download | Endpoint impact not observed |
| 14:36 | Sessions revoked and account reset begun | Containment |

## Scoping conclusion

One of three delivered recipients interacted with the lure. One identity showed anomalous successful access and two follow-on cloud actions. No second identity reused the infrastructure, and no endpoint payload execution was found. The synthetic incident is scoped as a single-account cloud compromise with no observed endpoint execution.

## Remediation

- Revoke active sessions and refresh tokens for the affected identity.
- Reset credentials and require a fresh MFA registration through an approved process.
- Remove the malicious inbox rule and revoke the unapproved OAuth grant.
- Purge the message from the three delivered mailboxes and block the sender/domain indicators.
- Isolate the device only if later endpoint evidence warrants it; do not use isolation as a substitute for evidence.
- Preserve message, sign-in, audit, and endpoint artifacts for post-incident review.
- Add focused monitoring for the source IP, session properties, application ID, and related recipients.

## Lessons learned

The fastest path was a sequence of narrow joins: message to URL, URL to user/device, user to session, and session to cloud action. Starting with broad searches would have produced more events but less confidence. Explicitly tracking hypotheses also made it clear when endpoint containment was unnecessary and when identity remediation was urgent.
