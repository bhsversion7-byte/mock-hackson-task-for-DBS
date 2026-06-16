const accounts = {
  tanjong: {
    name: "Tanjong Coffee Pte Ltd",
    industry: "Food and beverage",
    relationship: "3-year DBS relationship",
    monthlyInflow: 186,
    invoicesAtRisk: 72,
    confidence: 82,
    reviewMinutes: 58,
    baseRisk: 53,
    baseGap: 24,
    facilityBase: 44,
    balances: [84, 62, 18, 36],
    assetProfile: {
      cash: 86000,
      receivables: 96000,
      inventory: 42000,
      otherCurrentAssets: 18000,
      currentLiabilities: 154000,
      monthlySales: 186000,
      dio: 18,
      dso: 34,
      dpo: 23,
      tangibleAssetCoverage: 1.18
    },
    drivers: [
      ["Receivables delay", "Two major invoices moved beyond the normal 21-day collection cycle.", "+18"],
      ["Payroll exposure", "Payroll week overlaps with a supplier payment cluster.", "+13"],
      ["Inventory spike", "Inventory purchases are 22% above the last three-month average.", "+8"]
    ]
  },
  bright: {
    name: "BrightGrid Engineering",
    industry: "Engineering services",
    relationship: "5-year DBS relationship",
    monthlyInflow: 342,
    invoicesAtRisk: 118,
    confidence: 88,
    reviewMinutes: 64,
    baseRisk: 38,
    baseGap: 12,
    facilityBase: 28,
    balances: [110, 92, 64, 58],
    assetProfile: {
      cash: 118000,
      receivables: 146000,
      inventory: 22000,
      otherCurrentAssets: 36000,
      currentLiabilities: 168000,
      monthlySales: 342000,
      dio: 9,
      dso: 29,
      dpo: 34,
      tangibleAssetCoverage: 1.46
    },
    drivers: [
      ["Project milestone delay", "One project payment is expected later than the original schedule.", "+9"],
      ["Concentrated buyer risk", "Top customer represents 46% of incoming cash this month.", "+7"],
      ["Equipment lease", "Quarterly lease payment lands in week 4.", "+5"]
    ]
  },
  nori: {
    name: "Nori Table Group",
    industry: "Restaurant group",
    relationship: "2-year DBS relationship",
    monthlyInflow: 214,
    invoicesAtRisk: 96,
    confidence: 76,
    reviewMinutes: 61,
    baseRisk: 71,
    baseGap: 55,
    facilityBase: 76,
    balances: [44, 20, -28, -12],
    assetProfile: {
      cash: 52000,
      receivables: 132000,
      inventory: 76000,
      otherCurrentAssets: 12000,
      currentLiabilities: 224000,
      monthlySales: 214000,
      dio: 28,
      dso: 45,
      dpo: 20,
      tangibleAssetCoverage: 0.86
    },
    drivers: [
      ["Seasonal demand dip", "Card revenue is 17% below the prior comparable period.", "+16"],
      ["Rent and payroll stack", "Two fixed-cost obligations land within four business days.", "+14"],
      ["Supplier prepayment", "A new supplier requires partial prepayment before delivery.", "+11"]
    ]
  }
};

const sampleCsv = `date,type,category,amount,status,description
2026-06-08,inflow,receivable,42000,expected,Invoice from hotel group
2026-06-12,outflow,payroll,28000,due,Monthly payroll
2026-06-15,outflow,supplier,19000,due,Coffee bean supplier
2026-06-18,inflow,receivable,36000,expected,Catering receivable
2026-06-21,outflow,rent,12000,due,Outlet rent
2026-06-25,outflow,tax,9000,due,GST and statutory payment
2026-06-28,inflow,card_sales,31000,expected,Projected card settlement
2026-07-02,outflow,supplier,15000,due,Packaging supplier
2026-07-05,inflow,receivable,24000,expected,Corporate event invoice`;

const marketDataFallback = {
  sourceMode: "Embedded official-data fallback",
  generated: "2026-06-05",
  smeLoansOutstanding: { period: "2025", value: 77930, unit: "S$ million" },
  totalBusinessLoans: { period: "2026 Apr", value: 551277.1, unit: "S$ million" },
  smeShare: { period: "2025", value: 8, unit: "per cent" },
  efs: {
    maxLoan: 500000,
    maxRepaymentYears: 5,
    riskShare: "50%; 70% for eligible young enterprises",
    interestRate: "Subject to participating FI risk assessment"
  },
  sources: [
    "SingStat/MAS M920361, last updated 27 Apr 2026",
    "SingStat/MAS M701091, last updated 29 May 2026",
    "EnterpriseSG EFS-WCL page, accessed 5 Jun 2026"
  ]
};

let marketData = { ...marketDataFallback };

const accountSelect = document.querySelector("#accountSelect");
const workspace = document.querySelector(".workspace");
const delayRange = document.querySelector("#delayRange");
const delayOutput = document.querySelector("#delayOutput");
const riskScore = document.querySelector("#riskScore");
const riskLevel = document.querySelector("#riskLevel");
const riskMeter = document.querySelector("#riskMeter");
const cashGap = document.querySelector("#cashGap");
const facility = document.querySelector("#facility");
const priority = document.querySelector("#priority");
const priorityCopy = document.querySelector("#priorityCopy");
const gapCopy = document.querySelector("#gapCopy");
const barChart = document.querySelector("#barChart");
const driverList = document.querySelector("#driverList");
const actionList = document.querySelector("#actionList");
const generatePlan = document.querySelector("#generatePlan");
const planState = document.querySelector("#planState");
const copySummary = document.querySelector("#copySummary");
const copyState = document.querySelector("#copyState");
const offerTitle = document.querySelector("#offerTitle");
const explanationTitle = document.querySelector("#explanationTitle");
const explanationBody = document.querySelector("#explanationBody");
const accountContext = document.querySelector("#accountContext");
const confidenceMetric = document.querySelector("#confidenceMetric");
const confidenceCopy = document.querySelector("#confidenceCopy");
const timeSavedMetric = document.querySelector("#timeSavedMetric");
const policyDecision = document.querySelector("#policyDecision");
const dataSignals = document.querySelector("#dataSignals");
const modelLogic = document.querySelector("#modelLogic");
const customAccountName = document.querySelector("#customAccountName");
const customIndustry = document.querySelector("#customIndustry");
const startingCash = document.querySelector("#startingCash");
const csvFile = document.querySelector("#csvFile");
const csvText = document.querySelector("#csvText");
const loadSampleData = document.querySelector("#loadSampleData");
const evaluateCsv = document.querySelector("#evaluateCsv");
const clearCsv = document.querySelector("#clearCsv");
const importState = document.querySelector("#importState");
const refreshMarketData = document.querySelector("#refreshMarketData");
const marketBenchmarks = document.querySelector("#marketBenchmarks");
const marketState = document.querySelector("#marketState");
const overviewRiskScore = document.querySelector("#overviewRiskScore");
const overviewRiskPill = document.querySelector("#overviewRiskPill");
const overviewNarrative = document.querySelector("#overviewNarrative");
const miniFactorMeters = document.querySelector("#miniFactorMeters");
const decisionFrame = document.querySelector("#decisionFrame");
const factorGrid = document.querySelector("#factorGrid");
const nextBestStep = document.querySelector("#nextBestStep");
const nextBestCopy = document.querySelector("#nextBestCopy");
const methodologyList = document.querySelector("#methodologyList");
const actionDetailGrid = document.querySelector("#actionDetailGrid");
const pilotTimeline = document.querySelector("#pilotTimeline");
const assetMetricGrid = document.querySelector("#assetMetricGrid");
const assetDecisionTitle = document.querySelector("#assetDecisionTitle");
const assetDecisionCopy = document.querySelector("#assetDecisionCopy");
const assetLogicList = document.querySelector("#assetLogicList");
const stressTable = document.querySelector("#stressTable");
const researchAnchorList = document.querySelector("#researchAnchorList");
const avatarMark = document.querySelector("#avatarMark");
const userName = document.querySelector("#userName");
const userTitle = document.querySelector("#userTitle");
const userRole = document.querySelector("#userRole");
const userPortfolio = document.querySelector("#userPortfolio");
const permissionList = document.querySelector("#permissionList");
const integrationList = document.querySelector("#integrationList");
const governanceList = document.querySelector("#governanceList");

let planGenerated = false;
let driverMode = "client";

const roleProfiles = {
  rm: {
    initials: "ML",
    name: "Melissa Lim",
    title: "SME Relationship Manager · DBS Business Banking",
    permissions: [
      ["Primary objective", "Review watch-list SMEs, contact clients, and prepare evidence before credit escalation."],
      ["Can do", "View operating-account signals, upload client cash-flow extracts, generate RM draft plans, and request invoice evidence."],
      ["Cannot do", "Approve credit, override affordability checks, or send customer-facing facility terms without policy review."],
      ["Best next page", "Overview and Action Plan"]
    ]
  },
  inspector: {
    initials: "AK",
    name: "Arun Koh",
    title: "Credit Inspector · SME Working Capital Review",
    permissions: [
      ["Primary objective", "Validate risk drivers, evidence quality, policy readiness, and suitability before credit submission."],
      ["Can do", "Inspect factor decomposition, verify supporting evidence, review EFS-WCL guardrails, and block incomplete cases."],
      ["Cannot do", "Contact the client directly or change RM relationship notes without workflow handoff."],
      ["Best next page", "Risk Drivers and Evidence"]
    ]
  },
  portfolio: {
    initials: "CT",
    name: "Cheryl Tan",
    title: "Portfolio Risk Lead · SME Early Warning",
    permissions: [
      ["Primary objective", "Monitor alert quality, false positives, policy overrides, and portfolio-level pilot outcomes."],
      ["Can do", "Review pilot metrics, market benchmarks, model governance, and adoption trends."],
      ["Cannot do", "Approve individual borrower facilities from this prototype view."],
      ["Best next page", "Pilot Plan and Evidence"]
    ]
  }
};

function formatMoney(value) {
  const sign = value < 0 ? "-" : "";
  return `${sign}S$${Math.abs(value)}k`;
}

function formatFullMoney(value) {
  return `S$${Math.round(value).toLocaleString("en-SG")}`;
}

function formatMarketValue(value, unit) {
  if (/million/i.test(unit)) {
    if (value >= 1000) return `S$${(value / 1000).toFixed(1)}b`;
    return `S$${value.toFixed(1)}m`;
  }
  return `${value.toLocaleString("en-SG")} ${unit}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function safeRatio(numerator, denominator) {
  return denominator ? numerator / denominator : 0;
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV needs a header row and at least one transaction row.");

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());
  const required = ["date", "type", "category", "amount", "status"];
  const missing = required.filter((field) => !headers.includes(field));
  if (missing.length) throw new Error(`Missing required column(s): ${missing.join(", ")}.`);

  return lines.slice(1).map((line, rowIndex) => {
    const cells = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""]));
    const amount = Number(String(row.amount).replace(/[$,\s]/g, ""));
    const date = new Date(row.date);
    if (!Number.isFinite(amount) || amount <= 0) throw new Error(`Row ${rowIndex + 2}: amount must be a positive number.`);
    if (Number.isNaN(date.getTime())) throw new Error(`Row ${rowIndex + 2}: date is invalid.`);
    if (!["inflow", "outflow"].includes(row.type.toLowerCase())) throw new Error(`Row ${rowIndex + 2}: type must be inflow or outflow.`);
    return {
      date,
      type: row.type.toLowerCase(),
      category: row.category.toLowerCase(),
      amount,
      status: row.status.toLowerCase(),
      description: row.description || row.category
    };
  });
}

function buildAccountFromTransactions(transactions) {
  const starting = Number(startingCash.value || 0);
  if (!Number.isFinite(starting) || starting < 0) throw new Error("Starting cash balance must be zero or above.");

  const expectedInflows = transactions.filter((row) => row.type === "inflow" && row.status !== "received");
  const futureOutflows = transactions.filter((row) => row.type === "outflow" && row.status !== "paid");
  const totalInflows = transactions.filter((row) => row.type === "inflow").reduce((sum, row) => sum + row.amount, 0);
  const totalOutflows = transactions.filter((row) => row.type === "outflow").reduce((sum, row) => sum + row.amount, 0);
  const fixedCategories = new Set(["payroll", "rent", "tax", "supplier", "lease"]);
  const fixedOutflows = futureOutflows.filter((row) => fixedCategories.has(row.category)).reduce((sum, row) => sum + row.amount, 0);
  const invoicesAtRisk = expectedInflows.reduce((sum, row) => sum + row.amount, 0);
  const topReceivable = expectedInflows.reduce((max, row) => Math.max(max, row.amount), 0);
  const concentration = invoicesAtRisk ? topReceivable / invoicesAtRisk : 0;
  const stressRatio = starting ? Math.max(0, totalOutflows - totalInflows) / starting : 1;
  const baseRisk = Math.min(84, Math.round(28 + concentration * 24 + stressRatio * 28 + (fixedOutflows / Math.max(1, starting)) * 18));
  const baseGap = Math.max(0, Math.round((totalOutflows - totalInflows - starting * 0.25) / 1000));
  const facilityBase = Math.min(500, Math.max(20, Math.round((invoicesAtRisk * 0.72) / 1000)));
  const confidence = Math.max(62, Math.min(91, Math.round(64 + Math.min(transactions.length, 12) * 2 + (expectedInflows.length ? 6 : 0))));
  const reviewMinutes = Math.round(45 + transactions.length * 1.8);
  const supplierAndInventoryOutflows = futureOutflows
    .filter((row) => ["inventory", "supplier", "stock", "materials"].includes(row.category))
    .reduce((sum, row) => sum + row.amount, 0);
  const assetProfile = {
    cash: starting,
    receivables: invoicesAtRisk,
    inventory: Math.max(supplierAndInventoryOutflows * 0.55, totalOutflows * 0.12),
    otherCurrentAssets: Math.max(5000, totalInflows * 0.04),
    currentLiabilities: Math.max(futureOutflows.reduce((sum, row) => sum + row.amount, 0), totalOutflows * 0.72),
    monthlySales: Math.max(totalInflows, 1),
    dio: Math.round(clamp(safeRatio(supplierAndInventoryOutflows, Math.max(1, totalOutflows)) * 42, 6, 38)),
    dso: Math.round(clamp(safeRatio(invoicesAtRisk, Math.max(1, totalInflows)) * 55, 12, 62)),
    dpo: Math.round(clamp(safeRatio(fixedOutflows, Math.max(1, totalOutflows)) * 36, 8, 45)),
    tangibleAssetCoverage: clamp(safeRatio(starting + invoicesAtRisk * 0.75 + supplierAndInventoryOutflows * 0.35, Math.max(1, totalOutflows)), 0.45, 1.7)
  };

  const customAccount = {
    name: customAccountName.value.trim() || "Uploaded SME Client",
    industry: customIndustry.value,
    relationship: "Uploaded cash-flow data",
    monthlyInflow: Math.round(totalInflows / 1000),
    invoicesAtRisk: Math.round(invoicesAtRisk / 1000),
    confidence,
    reviewMinutes,
    baseRisk,
    baseGap,
    facilityBase,
    assetProfile,
    startingCash: starting,
    transactions,
    drivers: [
      ["Receivables concentration", `${formatFullMoney(topReceivable)} is the largest expected inflow; concentration is ${Math.round(concentration * 100)}%.`, `+${Math.round(concentration * 24)}`],
      ["Fixed-cost pressure", `${formatFullMoney(fixedOutflows)} of payroll, rent, tax, supplier, or lease payments are due soon.`, `+${Math.round((fixedOutflows / Math.max(1, starting)) * 18)}`],
      ["Cash-flow imbalance", `Near-term outflows exceed inflows by ${formatFullMoney(Math.max(0, totalOutflows - totalInflows))}.`, `+${Math.round(stressRatio * 28)}`]
    ]
  };

  accounts.custom = customAccount;
  saveCustomAccount(customAccount);

  if (!Array.from(accountSelect.options).some((option) => option.value === "custom")) {
    const option = document.createElement("option");
    option.value = "custom";
    option.textContent = "Uploaded SME Client";
    accountSelect.append(option);
  }
  accountSelect.querySelector('option[value="custom"]').textContent = accounts.custom.name;
  accountSelect.value = "custom";
  localStorage.setItem("cashflowShield.selectedAccount", "custom");
}

function serializeAccount(account) {
  return {
    ...account,
    transactions: account.transactions?.map((transaction) => ({
      ...transaction,
      date: transaction.date instanceof Date ? transaction.date.toISOString().slice(0, 10) : transaction.date
    }))
  };
}

function saveCustomAccount(account) {
  localStorage.setItem("cashflowShield.customAccount", JSON.stringify(serializeAccount(account)));
}

function hydratePersistedAccount() {
  const saved = localStorage.getItem("cashflowShield.customAccount");
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    parsed.transactions = parsed.transactions?.map((transaction) => ({
      ...transaction,
      date: new Date(transaction.date)
    }));
    accounts.custom = parsed;
    if (!Array.from(accountSelect.options).some((option) => option.value === "custom")) {
      const option = document.createElement("option");
      option.value = "custom";
      accountSelect.prepend(option);
    }
    accountSelect.querySelector('option[value="custom"]').textContent = parsed.name;
    accountSelect.value = localStorage.getItem("cashflowShield.selectedAccount") || "custom";
    if (accountSelect.value === "custom") {
      customAccountName.value = parsed.name;
      customIndustry.value = parsed.industry;
      startingCash.value = parsed.startingCash || 0;
      importState.textContent = "Saved uploaded SME restored. Refresh keeps this client selected.";
    }
  } catch {
    localStorage.removeItem("cashflowShield.customAccount");
  }
}

function buildTransactionBalances(account, delayFactor) {
  if (!account.transactions) return account.balances.map((value, index) => Math.round(value - delayFactor * (index + 2) * 4));

  const startDate = new Date("2026-06-05T00:00:00");
  const weekly = [account.startingCash, account.startingCash, account.startingCash, account.startingCash];
  account.transactions.forEach((transaction) => {
    const adjustedDate = new Date(transaction.date);
    if (transaction.type === "inflow" && transaction.status !== "received") adjustedDate.setDate(adjustedDate.getDate() + delayFactor * 5);
    const dayOffset = Math.floor((adjustedDate - startDate) / 86400000);
    const weekIndex = Math.min(3, Math.max(0, Math.floor(dayOffset / 7)));
    const signedAmount = transaction.type === "inflow" ? transaction.amount : -transaction.amount;
    for (let index = weekIndex; index < 4; index += 1) weekly[index] += signedAmount;
  });
  return weekly.map((value) => Math.round(value / 1000));
}

function getAssetProfile(account) {
  if (account.assetProfile) return account.assetProfile;

  const cash = (account.startingCash ?? 80000);
  const receivables = account.invoicesAtRisk * 1000;
  const currentLiabilities = Math.max(account.facilityBase * 1700, account.monthlyInflow * 620);
  const inventory = Math.max(account.monthlyInflow * 180, currentLiabilities * 0.18);
  return {
    cash,
    receivables,
    inventory,
    otherCurrentAssets: account.monthlyInflow * 80,
    currentLiabilities,
    monthlySales: account.monthlyInflow * 1000,
    dio: 18,
    dso: 34,
    dpo: 24,
    tangibleAssetCoverage: safeRatio(cash + receivables * 0.75 + inventory * 0.35, currentLiabilities)
  };
}

function deriveAssetMetrics(account, { delay, balances }) {
  const profile = getAssetProfile(account);
  const currentAssets = profile.cash + profile.receivables + profile.inventory + profile.otherCurrentAssets;
  const quickAssets = profile.cash + profile.receivables * 0.85;
  const currentLiabilities = profile.currentLiabilities;
  const workingCapital = currentAssets - currentLiabilities;
  const currentRatio = safeRatio(currentAssets, currentLiabilities);
  const quickRatio = safeRatio(quickAssets, currentLiabilities);
  const baseCashCycle = profile.dio + profile.dso - profile.dpo;
  const stressedCashCycle = baseCashCycle + delay;
  const workingCapitalTurnover = safeRatio(profile.monthlySales * 12, Math.max(1, Math.abs(workingCapital)));
  const minForecastCash = Math.min(...balances) * 1000;
  const stressedTangibleBuffer = minForecastCash + profile.receivables * 0.65 + profile.inventory * 0.35 - currentLiabilities;
  const dailyLiabilityBurn = currentLiabilities / 30;
  const cashRunwayDays = Math.round(safeRatio(Math.max(0, profile.cash + minForecastCash), Math.max(1, dailyLiabilityBurn)));

  const ratioPenalty = currentRatio < 1.2 ? (1.2 - currentRatio) * 52 : 0;
  const quickPenalty = quickRatio < 0.9 ? (0.9 - quickRatio) * 42 : 0;
  const cyclePenalty = stressedCashCycle > 45 ? (stressedCashCycle - 45) * 0.65 : 0;
  const bufferPenalty = stressedTangibleBuffer < 0 ? Math.min(28, Math.abs(stressedTangibleBuffer) / 6000) : 0;
  const turnoverPenalty = workingCapitalTurnover < 6 ? (6 - workingCapitalTurnover) * 3.5 : 0;
  const tangiblePenalty = profile.tangibleAssetCoverage < 1 ? (1 - profile.tangibleAssetCoverage) * 34 : 0;

  return {
    ...profile,
    currentAssets,
    quickAssets,
    currentLiabilities,
    workingCapital,
    currentRatio,
    quickRatio,
    baseCashCycle,
    stressedCashCycle,
    workingCapitalTurnover,
    stressedTangibleBuffer,
    cashRunwayDays,
    assetRiskScore: Math.round(clamp(24 + ratioPenalty + quickPenalty + bufferPenalty + turnoverPenalty + tangiblePenalty, 16, 94)),
    cycleRiskScore: Math.round(clamp(22 + cyclePenalty + delay * 0.95 + (profile.dso > 40 ? 10 : 0), 14, 90))
  };
}

function deriveScenarioModel(account, delay, delayFactor, balances) {
  const preliminaryGap = Math.round(account.baseGap + delayFactor * 6);
  const minBalance = Math.min(...balances);
  const gap = Math.max(preliminaryGap, Math.max(0, Math.abs(minBalance)));
  const facilityAmount = Math.round(account.facilityBase + delayFactor * 4);
  const confidence = Math.max(61, Math.round(account.confidence - delayFactor * 1.5));
  const savedMinutes = Math.max(25, Math.round(account.reviewMinutes - 16 - delayFactor));
  const signals = getAccountSignals(account);
  const assetMetrics = deriveAssetMetrics(account, { delay, balances });
  const negativeWeeks = balances.filter((value) => value < 0).length;

  const liquidityScore = clamp(34 + Math.abs(Math.min(0, minBalance)) * 1.22 + gap * 0.62 + negativeWeeks * 10, 18, 96);
  const receivableScore = clamp(signals.invoicesRatio * 68 + delay * 0.75 + (assetMetrics.dso > 40 ? 10 : 0), 22, 94);
  const fixedCostScore = clamp(account.baseRisk * 0.38 + gap * 0.4 + safeRatio(assetMetrics.currentLiabilities, assetMetrics.currentAssets) * 24, 20, 92);
  const volatilityScore = clamp(signals.volatility * 0.72 + negativeWeeks * 13 + delayFactor * 2, 18, 90);
  const coverageScore = clamp(facilityAmount / Math.max(1, account.monthlyInflow) * 74 + (assetMetrics.quickRatio < 1 ? 11 : 0), 18, 90);
  const dataQualityScore = clamp(100 - confidence + (account.transactions ? 0 : 8), 12, 54);
  const policyScore = gap > 65 || liquidityScore >= 78 ? 86 : gap > 35 ? 64 : 34;

  const factorScores = {
    liquidity: Math.round(liquidityScore),
    receivables: Math.round(receivableScore),
    fixed_costs: Math.round(fixedCostScore),
    volatility: Math.round(volatilityScore),
    coverage: Math.round(coverageScore),
    asset_quality: assetMetrics.assetRiskScore,
    cash_cycle: assetMetrics.cycleRiskScore,
    data_quality: Math.round(dataQualityScore),
    policy: Math.round(policyScore)
  };

  const weightedRisk =
    factorScores.liquidity * 0.22 +
    factorScores.receivables * 0.14 +
    factorScores.fixed_costs * 0.12 +
    factorScores.volatility * 0.09 +
    factorScores.coverage * 0.1 +
    factorScores.asset_quality * 0.13 +
    factorScores.cash_cycle * 0.1 +
    factorScores.data_quality * 0.04 +
    factorScores.policy * 0.06;
  const priorRisk = account.baseRisk + delayFactor * 4;
  const risk = Math.round(clamp(weightedRisk * 0.78 + priorRisk * 0.22, 16, 96));

  return { risk, gap, facilityAmount, confidence, savedMinutes, factorScores, assetMetrics };
}

function getComputedScenario() {
  const account = accounts[accountSelect.value];
  const delay = Number(delayRange.value);
  const delayFactor = delay / 5;
  const balances = buildTransactionBalances(account, delayFactor);
  const model = deriveScenarioModel(account, delay, delayFactor, balances);
  return { account, delay, balances, ...model };
}

function riskMeta(risk) {
  if (risk >= 75) return { label: "High", className: "red", color: "var(--red)", priority: "Escalate today" };
  if (risk >= 55) return { label: "Watch", className: "amber", color: "var(--amber)", priority: "Call today" };
  return { label: "Stable", className: "green", color: "var(--green)", priority: "Monitor" };
}

function factorStatus(score) {
  if (score >= 75) return { label: "High", className: "red" };
  if (score >= 55) return { label: "Watch", className: "amber" };
  return { label: "Stable", className: "green" };
}

function getAccountSignals(account) {
  const balances = account.transactions ? buildTransactionBalances(account, 0) : account.balances;
  const minBalance = Math.min(...balances);
  const avgBalance = balances.reduce((sum, value) => sum + value, 0) / balances.length;
  const variance = balances.reduce((sum, value) => sum + Math.pow(value - avgBalance, 2), 0) / balances.length;
  const volatility = Math.sqrt(variance);
  const negativeWeeks = balances.filter((value) => value < 0).length;
  const starting = account.startingCash ? account.startingCash / 1000 : Math.max(80, avgBalance);
  const invoicesRatio = account.invoicesAtRisk / Math.max(1, account.monthlyInflow);
  const facilityRatio = account.facilityBase / Math.max(1, account.monthlyInflow);
  return { balances, minBalance, avgBalance, volatility, negativeWeeks, starting, invoicesRatio, facilityRatio };
}

function deriveFactors(scenario) {
  const { account, risk, confidence, facilityAmount } = scenario;
  const signals = getAccountSignals(account);
  const scores = scenario.factorScores;
  const assetMetrics = scenario.assetMetrics;
  const minStressBalance = Math.min(...scenario.balances);

  return [
    {
      key: "liquidity",
      title: "Liquidity buffer",
      score: scores.liquidity,
      value: `${formatMoney(minStressBalance)} lowest forecast balance`,
      client: "Shows whether the business has enough cash cushion after expected inflows are delayed.",
      inspector: "Inspect minimum projected balance, negative-balance weeks, and whether the buffer breach is temporary or structural."
    },
    {
      key: "receivables",
      title: "Receivables concentration",
      score: scores.receivables,
      value: `${Math.round(signals.invoicesRatio * 100)}% of monthly inflow at risk`,
      client: "Highlights dependence on delayed customer payments.",
      inspector: "Validate invoice evidence, debtor concentration, aging, dispute status, and collection history."
    },
    {
      key: "fixed_costs",
      title: "Fixed-cost pressure",
      score: scores.fixed_costs,
      value: "Payroll, rent, tax, supplier timing",
      client: "Separates urgent obligations from discretionary spending.",
      inspector: "Check whether payroll, statutory payments, rent, and core suppliers create non-deferrable cash needs."
    },
    {
      key: "volatility",
      title: "Balance volatility",
      score: scores.volatility,
      value: `${formatMoney(Math.round(signals.volatility))} weekly variation`,
      client: "Measures whether cash moves predictably or swings sharply week to week.",
      inspector: "Review deposit regularity, withdrawal spikes, low-balance incidents, and seasonality."
    },
    {
      key: "coverage",
      title: "Repayment coverage proxy",
      score: scores.coverage,
      value: `${Math.round(signals.facilityRatio * 100)}% facility-to-inflow ratio`,
      client: "Tests whether the requested facility size is proportionate to normal inflows.",
      inspector: "Use this as a DSCR-style pre-screen only; final DSCR requires verified financial statements and existing debt obligations."
    },
    {
      key: "asset_quality",
      title: "Asset quality",
      score: scores.asset_quality,
      value: `${assetMetrics.currentRatio.toFixed(2)}x current ratio`,
      client: "Checks whether current assets can realistically support near-term obligations.",
      inspector: "Haircut receivables and inventory before relying on asset coverage; stale or disputed receivables should not count as cash."
    },
    {
      key: "cash_cycle",
      title: "Cash conversion cycle",
      score: scores.cash_cycle,
      value: `${assetMetrics.stressedCashCycle} stressed days`,
      client: "Shows how long cash stays tied up in inventory and receivables after supplier timing is considered.",
      inspector: "Review DIO, DSO, DPO, delayed receivables, and whether growth is consuming working capital faster than cash is collected."
    },
    {
      key: "data_quality",
      title: "Data confidence",
      score: scores.data_quality,
      value: `${confidence}% signal confidence`,
      client: "Better data lowers uncertainty; missing invoices or unclear categories raise review friction.",
      inspector: "Assess completeness of bank statements, invoice metadata, uploaded rows, and category mapping."
    },
    {
      key: "policy",
      title: "Policy readiness",
      score: scores.policy,
      value: risk >= 75 ? "Credit submission blocked" : "RM review required",
      client: "Shows whether the case is ready for financing review or needs more evidence first.",
      inspector: "Confirm EFS/working-capital eligibility, affordability, suitability, borrower group exposure, and human approval."
    }
  ];
}

function renderOverview(scenario) {
  const meta = riskMeta(scenario.risk);
  const factors = deriveFactors(scenario);
  const highFactors = factors.filter((factor) => factor.score >= 75);
  const watchFactors = factors.filter((factor) => factor.score >= 55 && factor.score < 75);

  overviewRiskScore.textContent = scenario.risk;
  overviewRiskPill.textContent = meta.label;
  overviewRiskPill.className = `status-pill ${meta.className}`;
  overviewNarrative.textContent = highFactors.length
    ? `${highFactors.length} factor(s) are high risk. Start with ${highFactors[0].title.toLowerCase()} before proposing financing.`
    : watchFactors.length
      ? `${watchFactors.length} factor(s) need review. The case is not blocked, but the RM should validate evidence.`
      : "Current data suggests a stable near-term cash position; monitor changes in receivable timing.";

  nextBestStep.textContent = highFactors.length ? `Next: validate ${highFactors[0].title}` : "Next: review cash forecast";
  nextBestCopy.textContent = highFactors.length
    ? highFactors[0].inspector
    : "Confirm that expected inflows and fixed outflows are correctly dated.";

  miniFactorMeters.innerHTML = factors.slice(0, 5).map((factor) => {
    const status = factorStatus(factor.score);
    return `
      <div class="mini-meter">
        <div><span>${factor.title}</span><strong>${factor.score}</strong></div>
        <i style="width:${factor.score}%;" class="${status.className}"></i>
      </div>
    `;
  }).join("");

  decisionFrame.innerHTML = [
    ["Client outcome", scenario.risk >= 75 ? "Urgent support call before facility discussion" : "Early RM check-in and collection support"],
    ["Credit posture", scenario.risk >= 75 ? "Do not submit without evidence and affordability checks" : "Pre-check only; no customer-facing offer yet"],
    ["Data status", scenario.account.transactions ? "Client-uploaded CSV restored and evaluated" : "Demo account; import real cash-flow data for client assessment"],
    ["Market context", `EFS-WCL max ${formatFullMoney(marketData.efs.maxLoan)}; rate still subject to FI assessment`]
  ].map(([label, text]) => `<div><strong>${label}</strong><span>${text}</span></div>`).join("");

  factorGrid.innerHTML = factors.map((factor) => {
    const status = factorStatus(factor.score);
    return `
      <article class="factor-card">
        <div class="factor-card-head">
          <h4>${factor.title}</h4>
          <span class="status-pill ${status.className}">${status.label}</span>
        </div>
        <strong>${factor.value}</strong>
        <p>${factor.client}</p>
        <small>${factor.inspector}</small>
      </article>
    `;
  }).join("");
}

function renderBars(balances) {
  const max = Math.max(...balances.map((value) => Math.abs(value)), 100);
  barChart.innerHTML = balances
    .map((value) => {
      const height = Math.max(16, Math.round((Math.abs(value) / max) * 260));
      const className = value < 0 ? "bar negative" : "bar";
      return `<div class="${className}" style="height:${height}px" data-value="${formatMoney(value)}"></div>`;
    })
    .join("");
}

function renderDrivers(account, risk) {
  const scenario = getComputedScenario();
  const factors = deriveFactors(scenario).sort((a, b) => b.score - a.score).slice(0, 5);
  driverList.innerHTML = factors
    .map((factor, index) => {
      const status = factorStatus(factor.score);
      const clientBody = `
        <p>${factor.client}</p>
        <div class="driver-explain-grid">
          <div><strong>What changed</strong><span>${factor.value}</span></div>
          <div><strong>Client implication</strong><span>${factor.score >= 75 ? "Treat this as an urgent cash-management issue before adding debt." : "Review the timing and supporting documents before making a financing decision."}</span></div>
        </div>
      `;
      const inspectorBody = `
        <p>${factor.inspector}</p>
        <div class="driver-explain-grid">
          <div><strong>Evidence to inspect</strong><span>${getEvidenceText(factor.key)}</span></div>
          <div><strong>Mitigation test</strong><span>${getMitigationText(factor.key)}</span></div>
        </div>
      `;
      return `
        <article class="driver-item">
          <div class="driver-rank">${index + 1}</div>
          <div>
            <div class="driver-title-row">
              <h4>${factor.title}</h4>
              <span class="status-pill ${status.className}">${status.label}</span>
            </div>
            ${driverMode === "client" ? clientBody : inspectorBody}
          </div>
          <strong class="impact">${factor.score} risk</strong>
        </article>
      `;
    })
    .join("");
  renderMethodology(scenario);
}

function getEvidenceText(key) {
  const map = {
    liquidity: "Projected balances by week, starting cash, delayed inflows, due-date accuracy, and low-balance history.",
    receivables: "Invoice amount, debtor name, due date, aging, dispute status, payment history, and concentration by debtor.",
    fixed_costs: "Payroll schedule, rent agreement, tax dates, supplier terms, leases, and deferrability of each outflow.",
    volatility: "Deposit regularity, withdrawal spikes, low or negative balance incidents, and month-to-month seasonality.",
    coverage: "Existing debt service, operating cash flow, facility amount, expected repayment source, and DSCR calculation.",
    asset_quality: "Current assets, receivables aging, inventory quality, cash balance, current liabilities, and tangible asset haircuts.",
    cash_cycle: "DIO, DSO, DPO, invoice aging, supplier terms, inventory turnover, and delayed receivable assumptions.",
    data_quality: "CSV completeness, bank statement coverage, uncategorized rows, missing invoice references, and stale data.",
    policy: "Eligibility, borrower group exposure, affordability, suitability, collateral or guarantee status, and approval authority."
  };
  return map[key] || "Uploaded cash-flow rows and RM notes.";
}

function getMitigationText(key) {
  const map = {
    liquidity: "Move the receivable date, defer non-critical supplier payments, or reduce facility tenor until buffer recovers.",
    receivables: "Request debtor confirmation, split exposure across invoices, or offer collection support before new debt.",
    fixed_costs: "Prioritize payroll/statutory payments; negotiate supplier timing before recommending financing.",
    volatility: "Use a smaller facility, tighter review cadence, or require updated statements before credit submission.",
    coverage: "Reduce requested amount, shorten tenor, match repayment timing to collections, or decline unsuitable debt.",
    asset_quality: "Apply haircuts to weak assets, request aged receivables, and avoid counting slow inventory as immediate liquidity.",
    cash_cycle: "Shorten collection terms, confirm debtor payment dates, defer non-critical purchases, or match tenor to the cycle.",
    data_quality: "Ask for missing invoices, bank statements, and category corrections before escalating to credit.",
    policy: "Keep RM review in control; block auto-approval when evidence or affordability is incomplete."
  };
  return map[key] || "Collect evidence and rerun the scenario.";
}

function renderMethodology(scenario) {
  const factors = deriveFactors(scenario);
  methodologyList.innerHTML = [
    ["Cash-flow underwriting", "Primary assessment uses projected inflows/outflows, stress testing, and account-level cash behavior."],
    ["Asset-quality lens", "Current assets are measured with receivable and inventory haircuts before they are treated as usable liquidity."],
    ["Cash conversion cycle", "DIO, DSO, and DPO explain whether growth is tying up cash inside working capital."],
    ["Early-warning logic", "The model prioritizes signals that can show deterioration before a past-due event appears."],
    ["Explainability", `Overall score ${scenario.risk}/100 is decomposed into ${factors.length} visible factor scores.`],
    ["Human control", "The output recommends RM actions; it does not approve credit or replace DBS policy."]
  ].map(([title, body]) => `<div><strong>${title}</strong><span>${body}</span></div>`).join("");
}

function renderAssetLens(scenario) {
  const asset = scenario.assetMetrics;
  const assetStatus = factorStatus(scenario.factorScores.asset_quality);
  const cycleStatus = factorStatus(scenario.factorScores.cash_cycle);
  const bufferStatus = asset.stressedTangibleBuffer < 0
    ? { label: "Deficit", className: "red" }
    : asset.stressedTangibleBuffer < asset.currentLiabilities * 0.12
      ? { label: "Thin", className: "amber" }
      : { label: "Adequate", className: "green" };

  assetDecisionTitle.textContent = scenario.factorScores.asset_quality >= 75
    ? "Asset posture: weak"
    : scenario.factorScores.asset_quality >= 55
      ? "Asset posture: watch"
      : "Asset posture: supportable";
  assetDecisionCopy.textContent = scenario.factorScores.asset_quality >= 75
    ? "Do not treat receivables and inventory as full liquidity; request aged schedules and evidence."
    : "Asset support is usable only after receivable timing and inventory quality are validated.";

  assetMetricGrid.innerHTML = [
    ["Current ratio", `${asset.currentRatio.toFixed(2)}x`, assetStatus.className, "Current assets divided by current liabilities."],
    ["Quick ratio", `${asset.quickRatio.toFixed(2)}x`, asset.quickRatio < 0.9 ? "red" : asset.quickRatio < 1.1 ? "amber" : "green", "Cash plus haircut receivables against current liabilities."],
    ["Working capital", formatFullMoney(asset.workingCapital), asset.workingCapital < 0 ? "red" : "green", "Current assets minus current liabilities."],
    ["Cash conversion cycle", `${asset.stressedCashCycle} days`, cycleStatus.className, "DIO + DSO - DPO plus scenario delay."],
    ["Working capital turnover", `${asset.workingCapitalTurnover.toFixed(1)}x`, asset.workingCapitalTurnover < 6 ? "amber" : "green", "Annualized sales compared with working capital base."],
    ["Stressed asset buffer", formatFullMoney(asset.stressedTangibleBuffer), bufferStatus.className, "Forecast cash plus haircut assets minus current liabilities."],
    ["Cash runway", `${asset.cashRunwayDays} days`, asset.cashRunwayDays < 14 ? "red" : asset.cashRunwayDays < 30 ? "amber" : "green", "Cash coverage against near-term liability burn."]
  ].map(([label, value, className, body]) => `
    <article class="asset-metric-card">
      <span class="status-pill ${className}">${label}</span>
      <strong>${value}</strong>
      <p>${body}</p>
    </article>
  `).join("");

  assetLogicList.innerHTML = [
    ["Receivable haircut", "Expected receivables are not counted as cash. The quick-ratio and buffer views haircut receivables before they support credit capacity."],
    ["Inventory haircut", "Inventory is treated as a slower asset, useful for continuity but weak as immediate liquidity."],
    ["Current liability pressure", "Payroll, rent, supplier, tax, lease, and short-term obligations define the denominator for the asset test."],
    ["Bottom-up company measure", "The model measures usable operating assets first, then decides whether any facility size is proportionate."]
  ].map(([title, body]) => `<div><strong>${title}</strong><span>${body}</span></div>`).join("");

  stressTable.innerHTML = `
    <div class="stress-row stress-head"><span>Scenario</span><span>Metric</span><span>Decision use</span></div>
    <div class="stress-row"><span>Base cycle</span><span>${asset.baseCashCycle} days</span><span>Normal operating cash tie-up.</span></div>
    <div class="stress-row"><span>Delay stress</span><span>+${scenario.delay} days</span><span>Receivables arrive later than expected.</span></div>
    <div class="stress-row"><span>Stressed cycle</span><span>${asset.stressedCashCycle} days</span><span>${cycleStatus.label} working-capital drag.</span></div>
    <div class="stress-row"><span>Lowest cash</span><span>${formatMoney(Math.min(...scenario.balances))}</span><span>Used before recommending any facility.</span></div>
  `;

  researchAnchorList.innerHTML = [
    ["Journal of Financial Economics lens", "Uses working-capital efficiency and cash-conversion-cycle logic to explain how receivables, inventory, and payables affect liquidity."],
    ["Financial Review lens", "Adds financial-constraint and liquidity-buffer thinking: cash shortfalls, asset quality, and repayment capacity are tested before growth credit."],
    ["Banking guardrail", "The result is a staff decision aid, not an approval engine; high-risk assets trigger evidence collection and human review."]
  ].map(([title, body]) => `<div><strong>${title}</strong><span>${body}</span></div>`).join("");
}

function renderEvidence(scenario) {
  const account = scenario.account;
  const asset = scenario.assetMetrics;
  dataSignals.innerHTML = `
    <div><strong>Monthly inflow</strong><span>${formatMoney(account.monthlyInflow)} observed in recent operating account activity.</span></div>
    <div><strong>Invoices at risk</strong><span>${formatMoney(account.invoicesAtRisk)} expected receipts may arrive after fixed-cost week.</span></div>
    <div><strong>Current asset base</strong><span>${formatFullMoney(asset.currentAssets)} current assets against ${formatFullMoney(asset.currentLiabilities)} current liabilities.</span></div>
    <div><strong>Cash conversion cycle</strong><span>${asset.stressedCashCycle} stressed days after the receivable-delay scenario.</span></div>
    <div><strong>Scenario stressor</strong><span>${scenario.delay}-day receivable delay applied during demo simulation.</span></div>
  `;

  modelLogic.innerHTML = `
    <div><strong>Liquidity stress · 22%</strong><span>Penalizes forecast weeks below the internal comfort threshold and negative-balance incidents after receivable delays.</span></div>
    <div><strong>Receivables and fixed costs · 26%</strong><span>Raises risk when debtor concentration, payroll, rent, tax, and supplier timing create non-deferrable pressure.</span></div>
    <div><strong>Asset quality · 13%</strong><span>Measures current ratio, quick ratio, tangible asset coverage, and stressed asset buffer after haircuts.</span></div>
    <div><strong>Cash conversion cycle · 10%</strong><span>Uses DIO + DSO - DPO, then adds scenario delay to detect working-capital drag.</span></div>
    <div><strong>Coverage, data, policy · 29%</strong><span>Combines facility-to-inflow coverage, data confidence, balance volatility, and human approval gates.</span></div>
  `;
  renderMarketData();
}

function renderMarketData() {
  marketBenchmarks.innerHTML = `
    <div><strong>SME business loans outstanding</strong><span>${formatMarketValue(marketData.smeLoansOutstanding.value, marketData.smeLoansOutstanding.unit)} in ${marketData.smeLoansOutstanding.period}.</span></div>
    <div><strong>Total business loans</strong><span>${formatMarketValue(marketData.totalBusinessLoans.value, marketData.totalBusinessLoans.unit)} in ${marketData.totalBusinessLoans.period}.</span></div>
    <div><strong>SME loan share</strong><span>${marketData.smeShare.value}% of business loans in ${marketData.smeShare.period}.</span></div>
    <div><strong>EFS-WCL guardrail</strong><span>Max ${formatFullMoney(marketData.efs.maxLoan)} per borrower; ${marketData.efs.maxRepaymentYears}-year repayment; risk-share ${marketData.efs.riskShare}.</span></div>
  `;
}

function renderSettings() {
  const role = userRole.value;
  const profile = roleProfiles[role];
  avatarMark.textContent = profile.initials;
  userName.textContent = profile.name;
  userTitle.textContent = profile.title;

  permissionList.innerHTML = profile.permissions
    .map(([label, text]) => `<div><strong>${label}</strong><span>${text}</span></div>`)
    .join("");

  integrationList.innerHTML = [
    ["Operating account transactions", "Core signal for deposits, withdrawals, balance volatility, and low-balance incidents.", "Prototype CSV / future DBS account API"],
    ["Invoice and receivables evidence", "Validates delayed receivables, debtor concentration, dispute status, and repayment source.", "Upload CSV now / invoice API later"],
    ["RM notes and CRM context", "Adds relationship tenure, client contact history, and unresolved service issues.", "Future Salesforce or internal CRM connector"],
    ["Credit policy rules", "Applies human approval, affordability, EFS-WCL, borrower group exposure, and suitability guardrails.", "Prototype rules engine"],
    ["Public market benchmarks", "Uses SingStat/MAS and EnterpriseSG as context only, not as borrower-specific underwriting.", "Live API attempt with fallback"]
  ].map(([title, body, status]) => `
    <div>
      <strong>${title}</strong>
      <span>${body}</span>
      <em>${status}</em>
    </div>
  `).join("");

  governanceList.innerHTML = [
    ["Model purpose", "Early-warning triage for DBS staff. It recommends review actions; it does not approve credit."],
    ["Scoring approach", "Weighted multi-factor assessment: liquidity buffer, receivables concentration, fixed-cost pressure, volatility, coverage, asset quality, cash conversion cycle, data confidence, and policy readiness."],
    ["Validation plan", "Shadow-mode pilot compares alerts with RM judgment, inspector review, false positives, and customer outcomes."],
    ["Human control", "High-risk or low-evidence cases are blocked from credit submission until RM and credit-policy checks pass."],
    ["Audit trail", "A production version should log uploaded data version, factor scores, overrides, and final RM action."]
  ].map(([title, body]) => `
    <div>
      <strong>${title}</strong>
      <span>${body}</span>
    </div>
  `).join("");

  localStorage.setItem("cashflowShield.userRole", role);
  localStorage.setItem("cashflowShield.userPortfolio", userPortfolio.value);
}

async function fetchSingStatTable(resourceId) {
  const url = `https://tablebuilder.singstat.gov.sg/api/table/tabledata/${resourceId}?limit=20&sortBy=key%20desc`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`SingStat ${resourceId} returned ${response.status}`);
  return response.json();
}

async function refreshMarketBenchmarks() {
  marketState.textContent = "Refreshing official SingStat data...";
  try {
    const [smeLoanData, businessLoanData] = await Promise.all([
      fetchSingStatTable("M920361"),
      fetchSingStatTable("M701091")
    ]);
    const smeRows = smeLoanData.Data.row;
    const businessRows = businessLoanData.Data.row;
    const byText = (rows, text) => rows.find((row) => row.rowText === text);
    const smeOutstanding = byText(smeRows, "Business Loans To SMEs Outstanding");
    const smeShare = byText(smeRows, "Percentage Of Business Loans To SMEs");
    const totalBusiness = byText(businessRows, "Loans To Businesses - Total");

    marketData = {
      ...marketDataFallback,
      sourceMode: "Live SingStat API",
      generated: smeLoanData.Data.dateGenerated,
      smeLoansOutstanding: {
        period: smeOutstanding.columns[0].key,
        value: Number(smeOutstanding.columns[0].value),
        unit: smeOutstanding.uoM
      },
      totalBusinessLoans: {
        period: totalBusiness.columns[0].key,
        value: Number(totalBusiness.columns[0].value),
        unit: totalBusiness.uoM
      },
      smeShare: {
        period: smeShare.columns[0].key,
        value: Number(smeShare.columns[0].value),
        unit: smeShare.uoM
      }
    };
    marketState.textContent = `Live data loaded from SingStat. Generated ${marketData.generated}.`;
  } catch (error) {
    marketData = { ...marketDataFallback };
    marketState.textContent = `Live refresh unavailable; using embedded official-data fallback. ${error.message}`;
  }
  renderMarketData();
}

function renderActions(scenario) {
  const highRisk = scenario.risk >= 75;
  const actions = highRisk
    ? [
        ["Call owner within 4 hours", "Confirm receivable timing, payroll pressure, and whether supplier terms can be renegotiated."],
        ["Request invoice evidence", "Validate invoices before any facility recommendation is sent to credit review."],
        ["Prepare guarded facility", `Propose up to ${formatMoney(scenario.facilityAmount)} only after RM and policy checks.`]
      ]
    : [
        ["Schedule RM check-in", "Review incoming receivables and ask whether the delay is operational or customer-driven."],
        ["Suggest collection nudges", "Offer invoice reminder templates before increasing debt exposure."],
        ["Keep facility pre-check ready", `Pre-check up to ${formatMoney(scenario.facilityAmount)} if the delay extends.`]
      ];

  actionList.innerHTML = actions
    .map((action, index) => `
      <article class="action-item">
        <div class="action-rank">${index + 1}</div>
        <div>
          <h4>${action[0]}</h4>
          <p>${action[1]}</p>
        </div>
      </article>
    `)
    .join("");
  renderActionDetails(scenario);
}

function renderActionDetails(scenario) {
  const highRisk = scenario.risk >= 75;
  const detailGroups = [
    {
      title: "Client conversation guide",
      items: highRisk
        ? [
            "Confirm which receivable is delayed and whether the debtor has disputed the invoice.",
            "Ask whether payroll, rent, statutory payments, or core suppliers are at risk this week.",
            "Explain that financing is one option, but collection support and payment timing come first."
          ]
        : [
            "Check whether the delay is confirmed or only a conservative forecast.",
            "Ask whether the client expects any new large outflows in the next 30 days.",
            "Offer cash-flow planning support before discussing facility terms."
          ]
    },
    {
      title: "Required evidence",
      items: [
        "Latest operating account statement or uploaded transaction extract.",
        "Invoice list with debtor, due date, amount, and dispute status.",
        "Existing debt obligations and repayment schedule.",
        "Purpose of funds and expected repayment source."
      ]
    },
    {
      title: "Financial inspector checks",
      items: [
        "Recompute projected low balance after scenario delay.",
        "Check affordability and facility-to-inflow ratio.",
        "Confirm borrower group exposure and EFS-WCL eligibility.",
        highRisk ? "Block credit submission until affordability and invoice evidence pass." : "Allow pre-check only; no auto-approval."
      ]
    },
    {
      title: "Non-credit alternatives",
      items: [
        "Invoice collection reminders or debtor confirmation request.",
        "Supplier payment rescheduling for non-critical outflows.",
        "Shorter-tenor bridge only if repayment source is verified.",
        "RM follow-up cadence based on weekly balance movement."
      ]
    }
  ];

  actionDetailGrid.innerHTML = detailGroups.map((group) => `
    <article class="detail-card">
      <h4>${group.title}</h4>
      <ul>${group.items.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
  `).join("");
}

function renderPilotPlan(scenario) {
  const riskBand = riskMeta(scenario.risk).label;
  pilotTimeline.innerHTML = [
    ["Week 0", "Calibration", "Run historical SME cases through the factor model; compare alerts with RM notes and credit outcomes."],
    ["Week 1", "Shadow mode", "Show recommendations to RMs without customer action; measure false positives and missing evidence."],
    ["Week 2-3", "Controlled outreach", `Let RMs contact ${riskBand === "High" ? "high-risk" : "watch-list"} clients after manager review; record action chosen.`],
    ["Week 4", "Decision review", "Assess triage time, alert usefulness, customer resolution, affordability exceptions, and policy overrides."]
  ].map(([period, title, body]) => `
    <article class="timeline-step">
      <span>${period}</span>
      <div><strong>${title}</strong><p>${body}</p></div>
    </article>
  `).join("");
}

function updateDashboard() {
  const scenario = getComputedScenario();
  const meta = riskMeta(scenario.risk);

  accountContext.textContent = `${scenario.account.name} · ${scenario.account.industry} · ${scenario.account.relationship}`;
  delayOutput.textContent = `${scenario.delay} days`;
  riskScore.textContent = scenario.risk;
  riskLevel.textContent = meta.label;
  riskLevel.className = `status-pill ${meta.className}`;
  riskMeter.style.width = `${scenario.risk}%`;
  riskMeter.style.background = meta.color;
  cashGap.textContent = formatMoney(scenario.gap);
  facility.textContent = formatMoney(scenario.facilityAmount);
  offerTitle.textContent = `Working-capital line: ${formatMoney(scenario.facilityAmount)}`;
  confidenceMetric.textContent = `${scenario.confidence}%`;
  confidenceCopy.textContent = scenario.confidence >= 80
    ? "Strong signal coverage from transaction, invoice, and fixed-cost timing."
    : "Moderate confidence; RM should request updated invoice evidence.";
  timeSavedMetric.textContent = `${scenario.savedMinutes} min`;
  policyDecision.textContent = scenario.risk >= 75
    ? "Decision gate: credit submission blocked until invoice evidence and affordability checks are complete."
    : "Decision gate: RM review required before any customer-facing facility suggestion.";
  priority.textContent = meta.priority;
  priorityCopy.textContent = scenario.risk >= 75
    ? "Receivable delay and fixed costs create a negative week-3 balance."
    : "Customer should be checked before liquidity falls below threshold.";
  gapCopy.textContent = scenario.gap > 40
    ? "Expected shortfall in week 3 if receivable delay persists."
    : "Manageable shortfall; monitor collections and supplier timing.";
  explanationTitle.textContent = scenario.risk >= 75
    ? "Risk is high because liquidity turns negative before expected receivables arrive."
    : "Risk is watch-level because cash buffer narrows around payroll week.";
  explanationBody.textContent = scenario.risk >= 75
    ? "The RM should intervene now, validate invoices, and consider a guardrailed facility only after policy review."
    : "The account remains solvent, but early outreach can prevent avoidable stress and preserve the customer relationship.";

  renderBars(scenario.balances);
  renderOverview(scenario);
  renderDrivers(scenario.account, scenario.risk);
  renderAssetLens(scenario);
  renderEvidence(scenario);
  renderPilotPlan(scenario);
  renderActions(scenario);
  if (!planGenerated) {
    planState.textContent = "Draft plan preview";
    planState.className = "status-pill neutral";
  }
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${button.dataset.section}`).classList.add("active");
    workspace.classList.toggle("workflow-mode", ["import", "settings"].includes(button.dataset.section));
  });
});

accountSelect.addEventListener("change", () => {
  localStorage.setItem("cashflowShield.selectedAccount", accountSelect.value);
  updateDashboard();
});
delayRange.addEventListener("input", updateDashboard);
userRole.addEventListener("change", renderSettings);
userPortfolio.addEventListener("change", renderSettings);

loadSampleData.addEventListener("click", () => {
  csvText.value = sampleCsv;
  importState.textContent = "Sample CSV loaded. Click Evaluate uploaded data.";
});

csvFile.addEventListener("change", async () => {
  const file = csvFile.files[0];
  if (!file) return;
  csvText.value = await file.text();
  importState.textContent = `${file.name} loaded. Click Evaluate uploaded data.`;
});

evaluateCsv.addEventListener("click", () => {
  try {
    const transactions = parseCsv(csvText.value);
    buildAccountFromTransactions(transactions);
    planGenerated = false;
    actionList.innerHTML = "";
    planState.textContent = "Waiting for scenario";
    planState.className = "status-pill neutral";
    updateDashboard();
    importState.textContent = `${transactions.length} rows evaluated. Uploaded SME Client is now selected.`;
    document.querySelector('[data-section="overview"]').click();
  } catch (error) {
    importState.textContent = error.message;
  }
});

clearCsv.addEventListener("click", () => {
  csvText.value = "";
  csvFile.value = "";
  importState.textContent = "CSV input cleared.";
});

refreshMarketData.addEventListener("click", refreshMarketBenchmarks);

document.querySelectorAll("[data-driver-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-driver-mode]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    driverMode = button.dataset.driverMode;
    renderDrivers(getComputedScenario().account, getComputedScenario().risk);
  });
});

generatePlan.addEventListener("click", () => {
  planGenerated = true;
  const scenario = getComputedScenario();
  renderActions(scenario);
  planState.textContent = "Plan generated";
  planState.className = "status-pill green";
  document.querySelector('[data-section="actions"]').click();
});

copySummary.addEventListener("click", async () => {
  const scenario = getComputedScenario();
  const summary = `${scenario.account.name}: ${scenario.risk}/100 cash-flow risk, projected gap ${formatMoney(scenario.gap)}, suggested guarded facility ${formatMoney(scenario.facilityAmount)}. RM review required.`;
  try {
    await navigator.clipboard.writeText(summary);
    copyState.textContent = "RM summary copied.";
  } catch {
    copyState.textContent = summary;
  }
});

if (window.lucide) {
  window.lucide.createIcons();
}

hydratePersistedAccount();
const savedSelection = localStorage.getItem("cashflowShield.selectedAccount");
if (savedSelection && accounts[savedSelection]) accountSelect.value = savedSelection;
const savedRole = localStorage.getItem("cashflowShield.userRole");
if (savedRole && roleProfiles[savedRole]) userRole.value = savedRole;
const savedPortfolio = localStorage.getItem("cashflowShield.userPortfolio");
if (savedPortfolio) userPortfolio.value = savedPortfolio;
renderSettings();
updateDashboard();
renderMarketData();
