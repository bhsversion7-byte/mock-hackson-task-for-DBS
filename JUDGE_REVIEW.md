# Judge Review And Corrections

## Verdict

The original CashFlow Shield prototype was directionally strong but not yet competitive enough for a serious FinTech judging panel. It had a clear user, a plausible workflow, and a polished UI, but the argument was still too soft. A judge could easily say: "This is a nice dashboard, but where is the evidence that it works, how is the risk score produced, and how do you prevent irresponsible lending?"

## Major Weaknesses

### 1. The impact was not quantified

**Issue:** The first version said DBS would get "higher RM productivity" and "earlier risk detection", but did not define success metrics.  
**Why judges care:** Hackathon judges reward ideas that can be evaluated. Without numbers, the pitch sounds like a concept, not an experiment.

**Correction:** The updated version adds pilot metrics:

- 50% target reduction in manual triage time
- 70% usefulness threshold for high-risk alerts
- 20 relationship managers in a four-week pilot
- 0 automatic credit approvals

### 2. The AI score looked unsupported

**Issue:** The first version showed a risk score and top drivers, but the data inputs and scoring logic were not visible.  
**Why judges care:** In a bank, unexplained AI is a liability. A judge will ask where the data came from, why the model is trustworthy, and whether the output can be challenged.

**Correction:** The updated demo adds an Evidence view showing:

- Monthly inflow
- Invoices at risk
- Receivable-delay scenario
- Liquidity-buffer logic
- Payment-timing logic
- Relationship-context logic
- Model confidence

### 3. The compliance story was too generic

**Issue:** The first version said "RM review required", but this was only a line of copy.  
**Why judges care:** FinTech products live or die on risk controls. Responsible lending cannot be treated as decoration.

**Correction:** The updated prototype adds a policy decision gate:

- Blocks credit submission for high-risk scenarios until invoice evidence and affordability checks are complete
- Separates "recommend action" from "approve credit"
- Shows alternatives before debt is proposed

### 4. The demo did not clearly show why DBS should build it

**Issue:** The original demo was useful but could be mistaken for a generic dashboard.  
**Why judges care:** A winning hackathon demo must make the bank-specific advantage obvious.

**Correction:** The updated pitch emphasizes why DBS is positioned to do this:

- DBS has relationship-manager workflows
- DBS has operating-account context
- DBS can combine customer support with credit-policy guardrails
- The value is both customer retention and safer credit growth

### 5. The build plan was too vague

**Issue:** "Connect data, validate model, pilot with RMs" was directionally correct but not specific.  
**Why judges care:** A serious panel wants to know the next test, not a generic roadmap.

**Correction:** The updated pilot plan includes:

- Four-week pilot
- 20 SME RMs
- Three success metrics
- False-positive review
- Suitability and affordability checks

## Updated Judging Score

| Criteria | Original | Updated | Reason |
| --- | ---: | ---: | --- |
| Innovation | 7 | 8 | Same core idea, but now positioned as proactive intervention rather than a dashboard. |
| UI | 8 | 8 | UI remains clear; extra views add density without changing the core flow. |
| Quality of solution | 6 | 8 | Data inputs, model logic, and policy gates make it more credible. |
| Pitch | 7 | 9 | The story now includes critique, fix, demo moment, and measurable pilot. |
| Desirability | 7 | 8 | Clearer benefit to both SMEs and RMs. |
| Challenge completion | 8 | 9 | More complete prototype and deck with judge-facing evidence. |

## Final Recommendation

In the final presentation, do not over-explain the UI. Spend the time on the strongest proof points:

1. "This is not auto-lending."
2. "The score is explainable."
3. "The RM stays in control."
4. "The pilot has measurable pass/fail criteria."
5. "DBS benefits through faster triage, earlier intervention, and safer SME credit growth."

## Latest Product Upgrade

The next critique was that the demo still relied on fixed mock companies. That has now been corrected. The prototype includes an Import Data workflow where a client can upload or paste CSV cash-flow data and evaluate a new SME scenario.

This materially improves the project because it changes the judging experience from "watch our prepared demo" to "test the product with a fresh case."

The Market Benchmark panel also adds public-data context from Enterprise Singapore and SingStat/MAS. This should be presented carefully: it improves market grounding, but it is not a substitute for DBS credit policy, borrower-specific underwriting, or live bank pricing.
