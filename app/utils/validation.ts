export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export function validateAmount(amount: number, minAmount: number = 100, maxAmount: number = 1000000000): ValidationResult {
    if (amount < minAmount) {
        return { isValid: false, error: `Minimum amount should be ₹${minAmount.toLocaleString('en-IN')}` };
    }
    if (amount > maxAmount) {
        return { isValid: false, error: `Maximum amount should be ₹${maxAmount.toLocaleString('en-IN')}` };
    }
    return { isValid: true };
}

export function validateRate(rate: number, minRate: number = 0.1, maxRate: number = 50): ValidationResult {
    if (rate < minRate || rate > maxRate) {
        return { isValid: false, error: `Rate should be between ${minRate}% and ${maxRate}%` };
    }
    return { isValid: true };
}

export function validateTenure(value: number, min: number = 1, max: number = 600, unit: string = "months"): ValidationResult {
    if (value < min || value > max) {
        return { isValid: false, error: `Tenure should be between ${min} and ${max} ${unit}` };
    }
    return { isValid: true };
}
