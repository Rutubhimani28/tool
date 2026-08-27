export interface EMIResult {
    emi: number;
    totalInterest: number;
    totalPayment: number;
}

/**
 * Calculate EMI and breakdown
 * @param principal The loan amount
 * @param rateAnnual The annual interest rate in percentage
 * @param tenure The total tenure in months
 * @returns The calculated EMI, total interest, and total payment
 */
export function calculateEMI(principal: number, rateAnnual: number, tenureMonths: number): EMIResult {
    if (!principal || !rateAnnual || !tenureMonths) {
        return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }

    const r = rateAnnual / 12 / 100; // Monthly interest rate
    const n = tenureMonths; // Total number of months
    
    // EMI Formula: P x R x (1+R)^N / [(1+R)^N-1]
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - principal;

    return {
        emi: isNaN(emi) || !isFinite(emi) ? 0 : Math.round(emi),
        totalInterest: isNaN(totalInterest) || !isFinite(totalInterest) ? 0 : Math.round(totalInterest),
        totalPayment: isNaN(totalPayment) || !isFinite(totalPayment) ? 0 : Math.round(totalPayment),
    };
}

export interface SIPResult {
    investedAmount: number;
    estimatedReturns: number;
    totalValue: number;
}

/**
 * Calculate SIP Returns
 * @param monthlyInvestment The monthly investment amount
 * @param rateAnnual The expected annual return rate in percentage
 * @param tenureMonths The total tenure in months
 * @returns The invested amount, estimated returns, and total value
 */
export function calculateSIP(monthlyInvestment: number, rateAnnual: number, tenureMonths: number): SIPResult {
    if (!monthlyInvestment || !rateAnnual || !tenureMonths) {
        return { investedAmount: 0, estimatedReturns: 0, totalValue: 0 };
    }

    const i = rateAnnual / 12 / 100; // Monthly rate of return
    const n = tenureMonths; // Total number of months
    
    // SIP Formula: P × ({[1 + i]^n - 1} / i) × (1 + i)
    const totalValue = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const investedAmount = monthlyInvestment * n;
    const estimatedReturns = totalValue - investedAmount;

    return {
        investedAmount: isNaN(investedAmount) || !isFinite(investedAmount) ? 0 : Math.round(investedAmount),
        estimatedReturns: isNaN(estimatedReturns) || !isFinite(estimatedReturns) ? 0 : Math.round(estimatedReturns),
        totalValue: isNaN(totalValue) || !isFinite(totalValue) ? 0 : Math.round(totalValue),
    };
}

export interface CompoundInterestResult {
    principalAmount: number;
    totalInterest: number;
    totalValue: number;
}

/**
 * Calculate Compound Interest
 * @param principal The initial investment amount
 * @param rateAnnual The annual interest rate in percentage
 * @param tenureYears The total tenure in years
 * @param compoundingFrequency The number of times interest is compounded per year (e.g., 1 for annually, 12 for monthly)
 * @returns The principal amount, total interest earned, and total value
 */
export function calculateCompoundInterest(principal: number, rateAnnual: number, tenureYears: number, compoundingFrequency: number = 1): CompoundInterestResult {
    if (!principal || !rateAnnual || !tenureYears) {
        return { principalAmount: 0, totalInterest: 0, totalValue: 0 };
    }

    const r = rateAnnual / 100;
    const n = compoundingFrequency;
    const t = tenureYears;
    
    // Formula: A = P(1 + r/n)^(nt)
    const amount = principal * Math.pow(1 + r / n, n * t);
    const totalInterest = amount - principal;

    return {
        principalAmount: isNaN(principal) || !isFinite(principal) ? 0 : Math.round(principal),
        totalInterest: isNaN(totalInterest) || !isFinite(totalInterest) ? 0 : Math.round(totalInterest),
        totalValue: isNaN(amount) || !isFinite(amount) ? 0 : Math.round(amount),
    };
}

export interface AmortizationRow {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
}

/**
 * Generate an Amortization Schedule
 */
export function calculateAmortizationSchedule(principal: number, rateAnnual: number, tenureMonths: number): AmortizationRow[] {
    if (!principal || !rateAnnual || !tenureMonths) return [];
    
    const emiResult = calculateEMI(principal, rateAnnual, tenureMonths);
    const emi = emiResult.emi;
    const r = rateAnnual / 12 / 100;
    
    const schedule: AmortizationRow[] = [];
    let balance = principal;

    for (let month = 1; month <= tenureMonths; month++) {
        const interest = balance * r;
        let principalPayment = emi - interest;

        if (month === tenureMonths) {
            principalPayment = balance; // Adjust last payment
        }

        balance -= principalPayment;
        if (balance < 0) balance = 0;

        schedule.push({
            month,
            payment: month === tenureMonths ? principalPayment + interest : emi,
            principal: principalPayment,
            interest: interest,
            balance: balance
        });
    }

    return schedule;
}

/**
 * Calculate Max Eligible Loan Amount based on EMI
 * Formula: P = EMI * [(1+r)^n - 1] / [r * (1+r)^n]
 */
export function calculateLoanEligibility(affordableEmi: number, rateAnnual: number, tenureMonths: number): number {
    if (!affordableEmi || !rateAnnual || !tenureMonths) return 0;
    const r = rateAnnual / 12 / 100;
    const n = tenureMonths;
    const maxLoan = affordableEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    return isNaN(maxLoan) || !isFinite(maxLoan) ? 0 : Math.round(maxLoan);
}

export interface CreditUtilizationResult {
    utilizationRatio: number;
    status: "Excellent" | "Good" | "Fair" | "Poor";
    statusColor: string;
}

/**
 * Calculate Credit Utilization Ratio
 */
export function calculateCreditUtilization(totalLimit: number, totalBalance: number): CreditUtilizationResult {
    if (!totalLimit || totalLimit <= 0) return { utilizationRatio: 0, status: "Excellent", statusColor: "text-green-500" };
    
    const ratio = (totalBalance / totalLimit) * 100;
    let status: "Excellent" | "Good" | "Fair" | "Poor" = "Poor";
    let statusColor = "text-red-500";

    if (ratio <= 10) {
        status = "Excellent";
        statusColor = "text-green-500";
    } else if (ratio <= 30) {
        status = "Good";
        statusColor = "text-blue-500";
    } else if (ratio <= 50) {
        status = "Fair";
        statusColor = "text-yellow-500";
    }

    return {
        utilizationRatio: parseFloat(ratio.toFixed(2)),
        status,
        statusColor
    };
}

export interface RetirementResult {
    totalCorpus: number;
    totalInvested: number;
    wealthGained: number;
}

/**
 * Calculate Retirement Corpus
 * Considers current savings compounding and future monthly SIP compounding.
 */
export function calculateRetirementCorpus(
    currentAge: number, 
    retirementAge: number, 
    currentSavings: number, 
    monthlyInvestment: number, 
    expectedReturnRate: number
): RetirementResult {
    if (currentAge >= retirementAge) return { totalCorpus: 0, totalInvested: 0, wealthGained: 0 };
    
    const years = retirementAge - currentAge;
    const months = years * 12;
    const rAnnual = expectedReturnRate / 100;
    const rMonthly = rAnnual / 12;

    // Compounding current savings
    const fvSavings = currentSavings * Math.pow(1 + rAnnual, years);

    // Compounding monthly investments (SIP formula)
    let fvSip = 0;
    if (monthlyInvestment > 0 && rMonthly > 0) {
        fvSip = monthlyInvestment * (Math.pow(1 + rMonthly, months) - 1) * (1 + rMonthly) / rMonthly;
    } else if (rMonthly === 0) {
        fvSip = monthlyInvestment * months;
    }

    const totalCorpus = fvSavings + fvSip;
    const totalInvested = currentSavings + (monthlyInvestment * months);
    const wealthGained = totalCorpus - totalInvested;

    return {
        totalCorpus: Math.round(totalCorpus),
        totalInvested: Math.round(totalInvested),
        wealthGained: Math.round(wealthGained)
    };
}

export interface NetWorthResult {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
}

/**
 * Calculate Net Worth
 */
export function calculateNetWorth(assets: number[], liabilities: number[]): NetWorthResult {
    const totalAssets = assets.reduce((sum, val) => sum + (val || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, val) => sum + (val || 0), 0);
    return {
        totalAssets,
        totalLiabilities,
        netWorth: totalAssets - totalLiabilities
    };
}

export interface InflationResult {
    futureValue: number;    // How much you need in future to have same purchasing power
    degradedValue: number;  // Purchasing power of today's amount in future
}

/**
 * Calculate Inflation Impact
 */
export function calculateInflation(amount: number, inflationRate: number, years: number): InflationResult {
    const r = inflationRate / 100;
    
    // Future Value (cost of item in future)
    const futureValue = amount * Math.pow(1 + r, years);
    
    // Degraded Value (purchasing power in future)
    const degradedValue = amount / Math.pow(1 + r, years);

    return {
        futureValue: Math.round(futureValue),
        degradedValue: Math.round(degradedValue)
    };
}

export interface FDResult {
    maturityAmount: number;
    totalInterest: number;
}

/**
 * Calculate Fixed Deposit Maturity
 * @param compoundingFrequency 1=Yearly, 2=Half-Yearly, 4=Quarterly, 12=Monthly
 */
export function calculateFixedDeposit(principal: number, rateAnnual: number, tenureYears: number, compoundingFrequency: number = 4): FDResult {
    const r = rateAnnual / 100;
    const n = compoundingFrequency;
    const t = tenureYears;
    
    const maturityAmount = principal * Math.pow(1 + r / n, n * t);
    const totalInterest = maturityAmount - principal;

    return {
        maturityAmount: Math.round(maturityAmount),
        totalInterest: Math.round(totalInterest)
    };
}


