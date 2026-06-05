# DBS FinTech Mini Hackathon Simulation

This workspace contains a simulated 2-hour hackathon project for a five-person DBS FinTech team.

## Project

**CashFlow Shield** helps DBS relationship managers and credit inspectors spot short-term SME cash-flow risk, explain the cause, and prepare a responsible working-capital review.

The updated version is no longer limited to the three mock companies. A DBS internal user can upload or paste a client's CSV of expected inflows/outflows and evaluate that SME's near-term liquidity risk.

## Files

- `index.html` - interactive prototype demo
- `pitch.html` - browser-based pitch deck
- `CashFlow_Shield_DBS_Hackathon_Pitch.pptx` - PowerPoint deck for hackathon judges
- `PROCESS.md` - complete hackathon process, team discussion, roles, timeline, and judging strategy
- `JUDGE_REVIEW.md` - judge-style critique, scorecard, and corrections
- `MODEL_NOTES.md` - model factors, public references, and guardrails
- `sample_cashflow.csv` - importable sample transaction data
- `styles.css` - shared visual system
- `app.js` - prototype interactions and mock risk logic

## Run

Open `index.html` directly in a browser, or serve the folder:

```powershell
py -m http.server 8765
```

Then visit:

```text
http://localhost:8765/
```

## CSV Schema

Use this structure:

```csv
date,type,category,amount,status,description
2026-06-08,inflow,receivable,42000,expected,Invoice from customer
2026-06-12,outflow,payroll,28000,due,Monthly payroll
```

Supported `type` values: `inflow`, `outflow`.

Useful `status` values: `expected`, `received`, `due`, `paid`.

The prototype applies the receivable-delay slider to expected inflows, then evaluates projected cash gap, risk drivers, confidence, and a guardrailed action plan.

## Market Data

The Market Benchmark panel uses official-data fallbacks from:

- Enterprise Singapore EFS-WCL terms
- SingStat/MAS table `M920361`
- SingStat/MAS table `M701091`

The refresh button attempts to load live SingStat API data. If browser CORS or network access blocks the request, the embedded official-data fallback remains visible.

## Intended User

This demo is for DBS internal staff, not external customer self-service. The Settings page supports three internal lenses:

- Relationship Manager
- Credit Inspector
- Portfolio Risk Lead

The Import Data page is a staff workflow for loading client-provided cash-flow data into the internal review.
