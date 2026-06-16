# CashFlow Shield Model Notes

## Why The Model Changed

The earlier prototype had a single risk score and short driver labels. That is not enough for a financial product demo because customers need plain-language explanations, while inspectors need evidence, assumptions, and validation checks.

The updated model uses a multi-factor assessment. It is still a prototype, not a real credit model, but it now behaves more like a banking early-warning workflow.

## Public Research And Market Inputs Used

The model design is grounded in these public references:

- FinRegLab: cash-flow variables from bank account data can improve small-business loan performance prediction, with deposits, balances, withdrawals, balance volatility, and low/negative balance incidents identified as predictive signals.
- McKinsey on IFRS 9: banks need forward-looking early-warning systems, facility-level monitoring, and RM workflows that flag likely reasons for deterioration and propose mitigation actions.
- Cash-flow underwriting guidance: lenders evaluate current and projected inflows/outflows, stress testing, bank-account data, DSCR-style coverage, and industry/market context.
- Journal-style working-capital research: cash conversion cycle logic links inventory, receivables, payables, profitability, and liquidity. The prototype now uses DIO + DSO - DPO as a visible operating-cycle stress signal.
- Financial Review-style liquidity and financial-constraint framing: cash buffers, asset quality, receivable reliability, and repayment capacity are treated as constraints before any growth-credit recommendation.
- EnterpriseSG EFS-WCL: working-capital loans are subject to participating financial institutions' risk assessment, with official limits and eligibility guardrails.
- SingStat/MAS: public SME and business-loan tables are used only as market context, not as borrower-specific underwriting.

## Factor Model

| Factor | What it measures | Why it matters |
| --- | --- | --- |
| Liquidity buffer | Lowest projected weekly cash balance after receivable delay | A low or negative balance indicates immediate liquidity stress. |
| Receivables concentration | Expected invoices at risk as a share of normal inflow | One delayed debtor can create outsized stress. |
| Fixed-cost pressure | Payroll, rent, supplier, tax, and lease timing | Some obligations cannot be deferred without operational harm. |
| Balance volatility | Weekly variation and negative-balance events | Volatile balances reduce confidence in repayment capacity. |
| Repayment coverage proxy | Facility size relative to normal inflows | Prevents recommending a facility that is disproportionate to cash generation. |
| Asset quality | Current ratio, quick ratio, tangible asset coverage, and stressed asset buffer | The model should measure usable operating assets before treating them as liquidity. |
| Cash conversion cycle | DIO + DSO - DPO, plus receivable-delay stress | Shows whether cash is trapped in inventory and receivables for too long. |
| Data confidence | Completeness and reliability of uploaded rows/signals | Missing evidence should increase review friction. |
| Policy readiness | Whether the case is ready for RM/credit escalation | High-risk or incomplete cases should be blocked from auto-submission. |

## Updated Risk Score Weights

| Component | Weight | Notes |
| --- | ---: | --- |
| Liquidity stress | 22% | Lowest forecast balance, cash gap, and negative-balance weeks. |
| Receivables concentration | 14% | Invoices at risk, DSO pressure, and receivable-delay scenario. |
| Fixed-cost pressure | 12% | Payroll, rent, supplier, tax, and short-term obligations. |
| Balance volatility | 9% | Weekly cash movement and low-balance instability. |
| Repayment coverage | 10% | Facility-to-inflow ratio and quick-ratio pressure. |
| Asset quality | 13% | Current/quick ratios, tangible asset coverage, and haircut buffer. |
| Cash conversion cycle | 10% | DIO + DSO - DPO with scenario stress. |
| Data confidence | 4% | Evidence completeness and uploaded-row reliability. |
| Policy readiness | 6% | Human approval, affordability, and escalation gate. |

The app blends this weighted score with a small prior from the original mock account risk. This keeps demo accounts stable while allowing uploaded CSV data and asset-quality stress to move the result.

## CSV Evaluation Logic

Customer CSV rows are parsed into inflows and outflows. The receivable-delay slider moves expected inflows later. Outflows remain on due dates. The dashboard recalculates:

- projected weekly cash balances
- cash gap
- risk score
- current ratio and quick ratio
- working capital and stressed asset buffer
- cash conversion cycle
- model confidence
- suggested facility amount
- top drivers
- action plan and inspector checks

## Guardrails

This prototype is intended for DBS internal users: relationship managers, credit inspectors, and portfolio risk leads. It is not an external customer self-service underwriting tool. Customers provide cash-flow data, but DBS staff review the output, evidence, and policy gates.

This prototype does not approve credit. It creates an RM-facing draft plan.

High-risk cases block credit submission until:

- invoice evidence is supplied
- affordability is checked
- borrower group exposure is reviewed
- suitability is confirmed
- RM and credit-policy approval is complete

## Internal User Roles

| Role | Main job in the demo | What the role should focus on |
| --- | --- | --- |
| Relationship Manager | Client contact and evidence gathering | Overview, Action Plan, Import Data |
| Credit Inspector | Evidence validation and policy readiness | Risk Drivers, Evidence, policy gate |
| Portfolio Risk Lead | Pilot quality and model governance | Pilot Plan, false positives, overrides |

## Data Integration Roadmap

| Data source | Prototype state | Production expectation |
| --- | --- | --- |
| Client cash-flow extract | CSV upload/paste | Secure internal upload or consented data pipe |
| DBS operating account signals | Simulated and CSV-derived | Core banking transaction API |
| Invoice and receivable evidence | CSV fields and required evidence checklist | Invoice/document ingestion and validation |
| RM notes / CRM | Role and workflow mock | CRM connector, likely internal CRM/Salesforce-style workflow |
| Credit policy | Rules shown in UI | Versioned policy rules engine with audit trail |
| Public benchmarks | SingStat/MAS API fallback | Scheduled refresh with source and timestamp logging |
