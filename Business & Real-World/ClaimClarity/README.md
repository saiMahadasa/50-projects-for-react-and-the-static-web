# ClaimClarity

A focused demo that gives insurance customers a clear, human-friendly view of their claim status on a single page. Look up a seeded claim by number and last name to see where things stand, what happens next, and what information is still needed.

## Getting started

This project is a simple static site—no build step required.

```bash
# from the repository root
cd "Business & Real-World/ClaimClarity"
# Option 1: open index.html directly in your browser
# Option 2: run a lightweight server (recommended)
python -m http.server 4173
```

Then visit [http://localhost:4173](http://localhost:4173) in your browser.

## Sample claims to demo

Use these combinations to load the Claim Clarity page:

| Claim Number | Last Name | Type | Current Status |
| --- | --- | --- | --- |
| CL-1024 | Johnson | Auto | Under Review |
| CL-2033 | Patel | Home | Estimate Prepared |
| CL-3177 | Garcia | Auto | Payment Sent |

## How it works

- The lookup form checks the claim number and last name against a small in-memory dataset in `app.js`.
- When a claim is found, the main page shows:
  - A claim summary with highlighted current status.
  - A clear timeline of standard claim steps with the current step emphasized.
  - Plain-language explanations for what’s happening now and what comes next.
  - Required documents with received vs missing indicators and friendly guidance.
  - A quick question box that appends your submitted questions to the claim for the session.

Because everything is local and in-memory, refreshing the page resets the sample data—perfect for quick demos or tweaks.
