# Simulated 2-Hour Hackathon Process

## 0. Challenge

**Theme:** DBS FinTech team mini hackathon  
**Duration:** 2 hours  
**Team size:** 5 people  
**Self-defined challenge:** Help DBS support SMEs before they hit a cash-flow crisis.

## 1. Team Setup

| Role | Person | Responsibility |
| --- | --- | --- |
| PM / Pitch lead | A | Timeboxing, final decision, judging story |
| Product researcher | B | User, pain point, journey, market logic |
| Prototype engineer | C | Frontend demo and mock logic |
| UX / Deck designer | D | Interface structure and pitch slides |
| FinTech / Risk analyst | E | Financial logic, compliance, responsible lending |

## 2. Simulated Discussion

### Minute 0-10: Read the brief

The team assumes DBS wants ideas that are useful to real banking teams, not just a flashy AI demo.

Initial questions:

- Which user is most realistic for a bank hackathon?
- Can the idea be demoed in 2 hours?
- Does it show customer value and bank value?
- Is there a credible FinTech angle?

### Minute 10-25: Idea selection

The team proposes three ideas:

1. **Fraud Alert Copilot**: explains suspicious transactions to customers and analysts.
2. **Green Spend Coach**: maps card transactions to sustainability insights.
3. **SME CashFlow Shield**: forecasts cash-flow stress and suggests responsible financing or collection actions.

Decision:

SME CashFlow Shield wins because the user is concrete, the workflow is demoable, and the banking value is obvious: reduce SME default risk, improve relationship manager productivity, and create responsible lending opportunities.

### Minute 25-40: MVP definition

The team cuts scope to one core workflow:

1. Select an SME account.
2. View cash-flow forecast and risk score.
3. See the top drivers of risk.
4. Generate an RM action plan.
5. Simulate a working-capital offer with guardrails.

Out of scope:

- Real bank integration
- Authentication
- Actual credit decisioning
- Full underwriting
- Customer messaging delivery

### Minute 40-90: Parallel build

Prototype engineer:

- Builds static app with mock data.
- Adds interactive tabs, account selector, scenario slider, and offer calculator.

UX / Deck designer:

- Creates a concise operational dashboard style.
- Prepares a browser-based deck.

FinTech / Risk analyst:

- Defines explainable risk score.
- Adds compliance framing: no automatic approval, human RM review, privacy-safe data handling.

PM / Pitch lead:

- Writes the 3-minute story.
- Removes features that are difficult to explain.

Product researcher:

- Defines user journey and success metrics.
- Writes personas: SME owner and DBS relationship manager.

### Minute 90-110: Merge and rehearse

Rehearsal feedback:

- The initial idea sounded too broad.
- The pitch was changed from "AI platform" to "RM copilot for one decision: intervene before cash crunch."
- The demo flow was reduced to three clicks: choose SME, move scenario slider, generate action plan.

### Minute 110-120: Final presentation

Final pitch structure:

1. SME cash gaps are predictable but often noticed too late.
2. DBS already has transaction and relationship context.
3. CashFlow Shield turns those signals into an explainable RM workflow.
4. The result is faster intervention, better customer support, and safer lending.

## 3. Final Product

**Product name:** CashFlow Shield  
**Primary user:** DBS relationship manager  
**Secondary user:** SME owner  
**Core value:** Detect near-term cash stress and recommend responsible next best actions.

## 4. Judging Alignment

| Criteria | How the project addresses it |
| --- | --- |
| Innovation | Uses transaction patterns and forecast signals to make SME support proactive. |
| UI | Clear dashboard, risk explanation, and one guided action flow. |
| Quality of solution | Narrow, realistic, and tied to banking workflows. |
| Pitch | Simple problem-solution-demo-impact story. |
| Desirability | Helps SMEs avoid liquidity shocks and helps RMs prioritize accounts. |
| Challenge completion | Functional prototype with scenario simulation and action generation. |

## 5. Judge Critique After First Build

The first prototype would probably pass a casual hackathon round, but it had five serious weaknesses:

1. **Impact was not quantified.** It claimed productivity and risk benefits without a measurable pilot target.
2. **The risk score looked like magic.** The UI showed drivers, but not enough source signals or model logic.
3. **Compliance was too light.** Saying "RM review required" was not enough for a banking use case.
4. **The demo looked generic.** It could be mistaken for any SME finance dashboard, not a DBS-specific RM workflow.
5. **The next step was vague.** A judge needs a clear pilot plan with pass/fail criteria.

## 6. Corrections Made

| Weakness | Correction |
| --- | --- |
| No quantified impact | Added pilot metrics: 50% triage-time reduction, 70% useful-alert threshold, 20-RM pilot, 0 auto approvals. |
| Unclear AI score | Added Evidence view with data signals, scoring logic, model confidence, and scenario stressor. |
| Thin compliance | Added policy decision gate and blocked credit submission for high-risk cases until checks are complete. |
| Generic demo | Reframed product as a DBS relationship-manager workflow, not a standalone dashboard. |
| Vague roadmap | Added four-week pilot, false-positive review, adoption metric, and credit-harm control. |

## 7. Second Upgrade: Real Client Evaluation

After the judge critique, the next weakness was interactivity. The product still depended on preset accounts. A serious evaluator would ask: "Can I bring my own data and see whether the tool says anything useful?"

The updated prototype now supports client-provided CSV data:

1. Client enters account name, industry, and starting cash balance.
2. Client uploads or pastes a CSV of expected inflows and outflows.
3. The prototype creates a new "Uploaded SME Client" account.
4. The receivable-delay slider is applied to expected inflows.
5. The dashboard recalculates projected cash balance, risk score, cash gap, model confidence, drivers, and action plan.

This makes the demo much more credible because the judges can test a new scenario instead of only watching fixed mock companies.

## 8. Third Upgrade: Information Architecture And Model Depth

The navigation was reorganized after a UX review:

1. **Settings** is now the first sidebar item and defines the internal DBS user role.
2. **Overview** now shows the complete assessment, not only a cash forecast.
3. **Cash Forecast** is its own section because it is one input to the decision, not the whole product.
4. **Risk Drivers** now has client and inspector reading modes.
5. **Action Plan** now includes client conversation, required evidence, inspector checks, and non-credit alternatives.
6. **Pilot Plan** now has a staged four-week validation timeline.
7. **Import Data** sits after Pilot Plan because it is a workflow action, not the main reading order.

The risk model was expanded to seven factors: liquidity buffer, receivables concentration, fixed-cost pressure, balance volatility, repayment coverage proxy, data confidence, and policy readiness.

The product positioning was also tightened: CashFlow Shield is a DBS internal RM and credit-inspector workbench. External clients provide data, but DBS staff interpret it and control the next action.

## 9. Market Data Upgrade

The prototype now includes a Market Benchmark card. It uses official-data fallbacks and can attempt a live refresh from SingStat APIs.

Current public-source anchors:

- Enterprise Singapore EFS-WCL: maximum loan quantum S$500,000 per borrower, maximum repayment period 5 years, risk-share 50% or 70% for eligible young enterprises, interest rate subject to participating FI risk assessment.
- SingStat/MAS `M920361`: SME business loans outstanding and percentage of business loans to SMEs.
- SingStat/MAS `M701091`: commercial bank loans and advances to residents by industry, including business loans total.

The product does not treat public market data as a credit decision. It uses it as benchmark context only.

## 10. Updated 3-Minute Pitch Script

SMEs rarely fail because one transaction goes wrong. They fail when small signals accumulate: receivables are delayed, payroll is near, inventory expenses rise, and the owner notices too late.

CashFlow Shield is a relationship-manager copilot for DBS. It reads safe, consented transaction patterns and turns them into a simple 30-day cash-flow risk view. In the updated prototype, the SME can upload its own cash-flow CSV, so this is not just a fixed mock-company demo.

In the demo, we select an SME, simulate a delayed receivable, and watch the risk score, cash gap, and confidence move. The system explains the top drivers and shows the data signals behind them: inflow, invoices at risk, fixed-cost timing, and relationship context.

The important part is what it does not do. It does not auto-approve credit. It generates an RM action plan and sends high-risk cases through a policy decision gate. If invoice evidence or affordability checks are missing, credit submission is blocked.

For DBS, the value is measurable: faster RM triage, earlier SME support, better retention, and safer credit growth. Our proposed pilot is four weeks with 20 RMs. We pass if we cut manual triage time by 50%, if at least 70% of high-risk alerts are judged useful, and if every facility suggestion passes suitability and affordability checks.

## 11. Final Presentation Advice

For a 2-hour hackathon, the team should not try to prove a production model. The goal is to prove a credible product workflow.

During the final pitch, lead with the strongest judge-facing claims:

- This solves a bank-specific workflow, not a generic dashboard problem.
- The model is explainable and source-backed.
- The RM stays in control.
- Compliance is visible in the product.
- The next pilot has measurable success criteria.
