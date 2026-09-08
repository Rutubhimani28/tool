"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import ToolWrapper from "@/app/components/ToolWrapper";
import Button from "@/app/components/Button";
import { Calculate as CalculateIcon } from "@mui/icons-material";
import { calculateEMI } from "@/app/lib/finance/calculations";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { validateAmount, validateRate, validateTenure } from "@/app/utils/validation";

export default function EMICalculator() {
    const [amount, setAmount] = useState<number | "">(100000);
    const [amountText, setAmountText] = useState<string>("1,00,000");
    const [rate, setRate] = useState<number | "">(10);
    const [rateText, setRateText] = useState<string>("10");
    const [tenure, setTenure] = useState<number | "">(5);
    const [tenureType, setTenureType] = useState<"years" | "months">("years");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [emi, setEmi] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalPayment, setTotalPayment] = useState<number>(0);

    const [errors, setErrors] = useState<{ amount?: string; rate?: string; tenure?: string }>({});

    useEffect(() => {
        let hasError = false;
        const newErrors: { amount?: string; rate?: string; tenure?: string } = {};

        const numAmount = Number(amount);
        const numRate = Number(rate);
        const numTenure = Number(tenure);

        if (amount !== "") {
            const amountValidation = validateAmount(numAmount, "Loan Amount", 1000, 1000000000, false);
            if (!amountValidation.isValid) {
                newErrors.amount = amountValidation.error;
                hasError = true;
            }
        }

        if (rate !== "") {
            const rateValidation = validateRate(numRate, 0, 50, "Interest Rate");
            if (!rateValidation.isValid) {
                newErrors.rate = rateValidation.error;
                hasError = true;
            }
        }

        const totalMonths = tenureType === "years" ? numTenure * 12 : numTenure;
        if (tenure !== "") {
            const tenureValidation = validateTenure(totalMonths, 1, 600, "months", "Loan Tenure");
            if (!tenureValidation.isValid) {
                newErrors.tenure = tenureValidation.error;
                hasError = true;
            }
        }

        setErrors(newErrors);

        if (!hasError && amount !== "" && rate !== "" && tenure !== "") {
            const result = calculateEMI(numAmount, numRate, totalMonths);
            setEmi(result.emi);
            setTotalInterest(result.totalInterest);
            setTotalPayment(result.totalPayment);
        } else {
            setEmi(0);
            setTotalInterest(0);
            setTotalPayment(0);
        }
    }, [amount, rate, tenure, tenureType]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        if (rawValue === '') {
            setAmount("");
            setAmountText("");
            return;
        }
        if (rawValue.length > 12) return;

        const numValue = Number(rawValue);
        setAmount(numValue);
        setAmountText(numValue.toLocaleString('en-IN'));
    };

    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9.]/g, '');
        const parts = val.split('.');
        if (parts.length > 2) {
            val = parts[0] + '.' + parts.slice(1).join('');
        }
        if (val.length > 5) return;

        setRateText(val);
        setRate(val === "" || val === "." ? "" : Number(val));
    };

    const handleTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        if (rawValue === '') {
            setTenure("");
            return;
        }
        if (rawValue.length > 3) return;
        setTenure(Number(rawValue));
    };

    const principalPercent = totalPayment > 0 ? (Number(amount) / totalPayment) * 100 : 0;
    const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "EMI Calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Calculate your Equated Monthly Installment (EMI) for home loans, car loans, and personal loans."
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                suppressHydrationWarning
            />
            <div className="w-full max-w-[1600px] mx-auto flex justify-center gap-6 px-4">
                {/* Left Ad (Desktop Only) */}
                <div className="hidden xl:flex flex-col items-end w-[300px] pt-8 gap-6">
                    {/* Original Ad */}
                    <div className="w-[300px] min-h-[250px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center relative z-10"
                         ref={(el) => {
                             if (el && !el.hasAttribute('data-ad-loaded')) {
                                 el.setAttribute('data-ad-loaded', 'true');
                                 if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                                     const s = document.createElement('script');
                                     s.src = "//second-director.com/cMDc9.6zbn2A5/lzS/WPQ/9FNuzBMf5kNhz/Uby/NNSv0S3zMhz-k/3/NiT/IZ5b";
                                     s.async = true;
                                     s.referrerPolicy = 'no-referrer-when-downgrade';
                                     el.appendChild(s);
                                 }
                             }
                         }}
                    >
                        <a href="https://affectionatestorage.com/bw3/Vr0.Px3ipgvmb/mxVBJjZGDB0o3_MZzuka3/NfjoI-5jLUTfcwzcO_T/cP2vMrzpMv" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/10 cursor-pointer -z-10 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
                            <span className="absolute text-[10px] uppercase tracking-wider text-emerald-500/50 top-2 right-3 border border-emerald-500/20 px-2 py-0.5 rounded-full">Ad</span>
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm text-emerald-600 dark:text-emerald-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold text-lg mb-1 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">Instant Cash Loan</span>
                            <span className="text-emerald-600/80 dark:text-emerald-400/80 text-sm leading-tight mb-4">Get approved in 5 minutes with zero paperwork.</span>
                            <span className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-md group-hover:bg-emerald-600 transition-colors w-full">Apply Now</span>
                        </a>
                    </div>
                    {/* New Ad 1 */}
                    <div className="w-[300px] min-h-[250px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center relative z-10"
                         ref={(el) => {
                             if (el && !el.hasAttribute('data-ad-loaded')) {
                                 el.setAttribute('data-ad-loaded', 'true');
                                 if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                                     const s = document.createElement('script');
                                     s.src = "//juvenilechoice.com/bTXqV.s/d/GzlU0_YsW/cw/UeAmJ9wujZUURlaktP/TqcDzeOsT-cH1/ONTqcZtyN-zVMD5YN/zSYqwwMlQa";
                                     s.async = true;
                                     s.referrerPolicy = 'no-referrer-when-downgrade';
                                     el.appendChild(s);
                                 }
                             }
                         }}
                    >
                        <a href="https://affectionatestorage.com/bw3/Vr0.Px3ipgvmb/mxVBJjZGDB0o3_MZzuka3/NfjoI-5jLUTfcwzcO_T/cP2vMrzpMv" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group transition-colors hover:bg-violet-50 dark:hover:bg-violet-900/10 cursor-pointer -z-10 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5">
                            <span className="absolute text-[10px] uppercase tracking-wider text-violet-500/50 top-2 right-3 border border-violet-500/20 px-2 py-0.5 rounded-full">Ad</span>
                            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm text-violet-600 dark:text-violet-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <span className="text-violet-700 dark:text-violet-400 font-bold text-lg mb-1 group-hover:text-violet-800 dark:group-hover:text-violet-300 transition-colors">Lifetime Free Credit Card</span>
                            <span className="text-violet-600/80 dark:text-violet-400/80 text-sm leading-tight mb-4">Earn 5% cashback on all your online spends.</span>
                            <span className="px-4 py-1.5 bg-violet-500 text-white text-xs font-bold rounded-full shadow-md group-hover:bg-violet-600 transition-colors w-full">Check Eligibility</span>
                        </a>
                    </div>
                    {/* Direct Link Ad */}
                    <a href="https://affectionatestorage.com/bw3/Vr0.Px3ipgvmb/mxVBJjZGDB0o3_MZzuka3/NfjoI-5jLUTfcwzcO_T/cP2vMrzpMv" target="_blank" rel="noopener noreferrer" className="w-[300px] min-h-[250px] bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg overflow-hidden flex flex-col items-center justify-center relative transition-colors p-6 text-center group cursor-pointer shadow-sm hover:shadow-md">
                        <span className="absolute text-[10px] uppercase tracking-wider text-blue-400/60 top-2 right-3">Sponsored</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-2 group-hover:scale-105 transition-transform">Exclusive Offer</span>
                        <span className="text-blue-500/80 dark:text-blue-300/80 text-sm">Click here to learn more and claim your reward</span>
                    </a>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 w-full max-w-5xl min-w-0">
                    <ToolWrapper
                        title="EMI Calculator"
                        description="Calculate your Equated Monthly Installment (EMI) for home, car, and personal loans."
                    >
                <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto py-4">
                    {/* Input Section */}
                    <div className="w-full lg:w-1/2 space-y-6 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                Loan Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">₹</span>
                                <input
                                    suppressHydrationWarning
                                    type="text"
                                    value={amountText}
                                    onChange={handleAmountChange}
                                    placeholder="1,00,000"
                                    className={`w-full pl-8 pr-4 py-3 rounded-xl border ${errors.amount ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:ring-blue-500'} bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 outline-none transition-all`}
                                />
                            </div>
                            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                Interest Rate (P.A.)
                            </label>
                            <div className="relative">
                                <input
                                    suppressHydrationWarning
                                    type="text"
                                    value={rateText}
                                    onChange={handleRateChange}
                                    placeholder="10"
                                    className={`w-full pl-4 pr-10 py-3 rounded-xl border ${errors.rate ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:ring-blue-500'} bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 outline-none transition-all`}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">%</span>
                            </div>
                            {errors.rate && <p className="text-red-500 text-xs mt-1">{errors.rate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                Loan Tenure
                            </label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        suppressHydrationWarning
                                        type="text"
                                        value={tenure}
                                        onChange={handleTenureChange}
                                        placeholder="5"
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.tenure ? 'border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:ring-blue-500'} bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 outline-none transition-all`}
                                    />
                                </div>
                                <div className="relative w-[120px]">
                                    <button
                                        suppressHydrationWarning
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border ${isDropdownOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-200 dark:border-zinc-800'} bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                                    >
                                        <span className="capitalize font-medium">{tenureType}</span>
                                        <svg className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                            <div className="absolute z-20 mt-2 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-100">
                                                <Button
                                                    variant="ghost"
                                                    fullWidth
                                                    className={`justify-center !rounded-none py-2.5 text-sm transition-colors ${tenureType === "years" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20" : "text-zinc-700 dark:text-zinc-300 font-medium"}`}
                                                    onClick={() => { setTenureType("years"); setIsDropdownOpen(false); }}
                                                >
                                                    Years
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    fullWidth
                                                    className={`justify-center !rounded-none py-2.5 text-sm transition-colors ${tenureType === "months" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20" : "text-zinc-700 dark:text-zinc-300 font-medium"}`}
                                                    onClick={() => { setTenureType("months"); setIsDropdownOpen(false); }}
                                                >
                                                    Months
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {errors.tenure && <p className="text-red-500 text-xs mt-1">{errors.tenure}</p>}
                        </div>
                    </div>

                    {/* Result Section */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <div className="flex flex-col items-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 mb-4">
                                <CalculateIcon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-medium text-zinc-600 dark:text-zinc-400 mb-2">Monthly EMI</h3>
                            <p className="text-4xl font-bold text-zinc-900 dark:text-white break-all text-center">
                                {formatCurrency(emi)}
                            </p>
                        </div>

                        <div className="w-full space-y-4 mb-6">
                            <div className="flex justify-between items-start py-2 border-b border-zinc-200 dark:border-zinc-800">
                                <span className="text-zinc-600 dark:text-zinc-400 shrink-0">Principal Amount</span>
                                <span className="font-semibold text-zinc-900 dark:text-white break-all text-right ml-4">{formatCurrency(Number(amount) || 0)}</span>
                            </div>
                            <div className="flex justify-between items-start py-2 border-b border-zinc-200 dark:border-zinc-800">
                                <span className="text-zinc-600 dark:text-zinc-400 shrink-0">Total Interest</span>
                                <span className="font-semibold text-zinc-900 dark:text-white break-all text-right ml-4">{formatCurrency(totalInterest)}</span>
                            </div>
                            <div className="flex justify-between items-start py-2">
                                <span className="text-zinc-600 dark:text-zinc-400 font-medium shrink-0">Total Payment</span>
                                <span className="font-bold text-zinc-900 dark:text-white break-all text-right ml-4">{formatCurrency(totalPayment)}</span>
                            </div>
                        </div>

                        {/* Progress Bar / Breakdown */}
                        {totalPayment > 0 && (
                            <div className="w-full mt-2">
                                <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                                    <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${principalPercent}%` }} title="Principal" />
                                    <div className="bg-orange-400 h-full transition-all duration-500" style={{ width: `${interestPercent}%` }} title="Interest" />
                                </div>
                                <div className="flex justify-between text-xs mt-3 px-1">
                                    <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Principal
                                    </span>
                                    <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div> Interest
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </ToolWrapper>

            {/* Ad Section (300x250) - Hidden on desktop where side ads show */}
            <div className="w-full flex xl:hidden justify-center my-8">
                <div className="w-[300px] min-h-[250px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center relative z-10"
                     ref={(el) => {
                         if (el && !el.hasAttribute('data-ad-loaded')) {
                             el.setAttribute('data-ad-loaded', 'true');
                             if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                                 const s = document.createElement('script');
                                 s.src = "//second-director.com/cMDc9.6zbn2A5/lzS/WPQ/9FNuzBMf5kNhz/Uby/NNSv0S3zMhz-k/3/NiT/IZ5b";
                                 s.async = true;
                                 s.referrerPolicy = 'no-referrer-when-downgrade';
                                 el.appendChild(s);
                             }
                         }
                     }}
                >
                    <a href="https://affectionatestorage.com/bw3/Vr0.Px3ipgvmb/mxVBJjZGDB0o3_MZzuka3/NfjoI-5jLUTfcwzcO_T/cP2vMrzpMv" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/10 cursor-pointer -z-10 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                        <span className="absolute text-[10px] uppercase tracking-wider text-amber-500/50 top-2 right-3 border border-amber-500/20 px-2 py-0.5 rounded-full">Ad</span>
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm text-amber-600 dark:text-amber-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <span className="text-amber-700 dark:text-amber-400 font-bold text-lg mb-1 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">Invest & Grow Wealth</span>
                        <span className="text-amber-600/80 dark:text-amber-400/80 text-sm leading-tight mb-4">Start SIP with just ₹500 and get highest returns.</span>
                        <span className="px-4 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md group-hover:bg-amber-600 transition-colors w-full">Start Investing</span>
                    </a>
                </div>
            </div>

            {/* SEO Content Section */}
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">Free EMI Calculator</h2>
                    <p className="text-lg mb-8">
                        Calculate your Equated Monthly Installments (EMI) quickly and accurately for home loans, car loans, and personal loans. Our tool helps you plan your finances by providing a clear breakdown of your monthly payments, principal amount, and total interest payable.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">What is EMI?</h3>
                    <p className="mb-6">
                        Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal each month so that over a specified number of years, the loan is paid off in full.
                    </p>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">How to use this EMI Calculator</h3>
                    <p className="mb-4">Using our EMI calculator is simple and takes just a few seconds:</p>
                    <ol className="list-decimal pl-6 space-y-4 mb-8">
                        <li><strong>Loan Amount:</strong> Enter the total principal amount you wish to borrow.</li>
                        <li><strong>Interest Rate:</strong> Enter the annual interest rate offered by your bank or lender.</li>
                        <li><strong>Loan Tenure:</strong> Specify the duration of the loan in either years or months.</li>
                        <li><strong>View Results:</strong> The calculator instantly displays your monthly EMI, total interest, and total amount payable.</li>
                    </ol>

                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4">Benefits of using an EMI Calculator</h3>
                    <ul className="list-disc pl-6 space-y-3 mb-8">
                        <li><strong>Financial Planning:</strong> Knowing your exact monthly commitment helps you budget effectively.</li>
                        <li><strong>Compare Options:</strong> Easily compare different loan offers by tweaking the interest rate or tenure.</li>
                        <li><strong>Accuracy:</strong> Avoid complex manual calculations and get instant, error-free results.</li>
                        <li><strong>Time-saving:</strong> Instantly check affordability before applying for a loan.</li>
                    </ul>
                </div>
            </div>

            </div> {/* End Main Content Area */}

                {/* Right Ad (Desktop Only) */}
                <div className="hidden xl:flex flex-col items-start w-[300px] pt-8 gap-6">
                    {/* Original Ad */}
                    <div className="w-[300px] min-h-[250px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center relative z-10"
                         ref={(el) => {
                             if (el && !el.hasAttribute('data-ad-loaded')) {
                                 el.setAttribute('data-ad-loaded', 'true');
                                 if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                                     const s = document.createElement('script');
                                     s.src = "//second-director.com/cMDc9.6zbn2A5/lzS/WPQ/9FNuzBMf5kNhz/Uby/NNSv0S3zMhz-k/3/NiT/IZ5b";
                                     s.async = true;
                                     s.referrerPolicy = 'no-referrer-when-downgrade';
                                     el.appendChild(s);
                                 }
                             }
                         }}
                    >
                        <a href="https://affectionatestorage.com/bw3/Vr0.Px3ipgvmb/mxVBJjZGDB0o3_MZzuka3/NfjoI-5jLUTfcwzcO_T/cP2vMrzpMv" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/10 cursor-pointer -z-10 bg-gradient-to-br from-rose-500/5 to-pink-500/5">
                            <span className="absolute text-[10px] uppercase tracking-wider text-rose-500/50 top-2 right-3 border border-rose-500/20 px-2 py-0.5 rounded-full">Ad</span>
                            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm text-rose-600 dark:text-rose-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="text-rose-700 dark:text-rose-400 font-bold text-lg mb-1 group-hover:text-rose-800 dark:group-hover:text-rose-300 transition-colors">Low Interest Home Loan</span>
                            <span className="text-rose-600/80 dark:text-rose-400/80 text-sm leading-tight mb-4">Transfer your home loan and save up to ₹5 Lakhs.</span>
                            <span className="px-4 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-full shadow-md group-hover:bg-rose-600 transition-colors w-full">Calculate Savings</span>
                        </a>
                    </div>
                    {/* New Ad 2 */}
                    <div className="w-[300px] min-h-[250px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center relative z-10"
                         ref={(el) => {
                             if (el && !el.hasAttribute('data-ad-loaded')) {
                                 el.setAttribute('data-ad-loaded', 'true');
                                 if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                                     const s = document.createElement('script');
                                     s.src = "//juvenilechoice.com/b/XcVKs.dWGVlB0/YGWqcM/ye/my9uueZIUJlrk/PuTQcWzHOUT/cE2/M/T/MotoN/z/Mt5HNLzVYPxsNRwW";
                                     s.async = true;
                                     s.referrerPolicy = 'no-referrer-when-downgrade';
                                     el.appendChild(s);
                                 }
                             }
                         }}
                    >
                        <a href="https://affectionatestorage.com/bw3/Vr0.Px3ipgvmb/mxVBJjZGDB0o3_MZzuka3/NfjoI-5jLUTfcwzcO_T/cP2vMrzpMv" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group transition-colors hover:bg-cyan-50 dark:hover:bg-cyan-900/10 cursor-pointer -z-10 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
                            <span className="absolute text-[10px] uppercase tracking-wider text-cyan-500/50 top-2 right-3 border border-cyan-500/20 px-2 py-0.5 rounded-full">Ad</span>
                            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm text-cyan-600 dark:text-cyan-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-cyan-700 dark:text-cyan-400 font-bold text-lg mb-1 group-hover:text-cyan-800 dark:group-hover:text-cyan-300 transition-colors">Free Credit Score Check</span>
                            <span className="text-cyan-600/80 dark:text-cyan-400/80 text-sm leading-tight mb-4">Check your CIBIL score for free in 2 minutes.</span>
                            <span className="px-4 py-1.5 bg-cyan-500 text-white text-xs font-bold rounded-full shadow-md group-hover:bg-cyan-600 transition-colors w-full">Check Now</span>
                        </a>
                    </div>
                    {/* Direct Link Ad (Duplicate for balance) */}
                    <a href="https://affectionatestorage.com/bw3/Vr0.Px3ipgvmb/mxVBJjZGDB0o3_MZzuka3/NfjoI-5jLUTfcwzcO_T/cP2vMrzpMv" target="_blank" rel="noopener noreferrer" className="w-[300px] min-h-[250px] bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg overflow-hidden flex flex-col items-center justify-center relative transition-colors p-6 text-center group cursor-pointer shadow-sm hover:shadow-md">
                        <span className="absolute text-[10px] uppercase tracking-wider text-blue-400/60 top-2 right-3">Sponsored</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-2 group-hover:scale-105 transition-transform">Exclusive Offer</span>
                        <span className="text-blue-500/80 dark:text-blue-300/80 text-sm">Click here to learn more and claim your reward</span>
                    </a>
                </div>
            </div> {/* End Flex Layout Wrapper */}
            
            {/* Popunder Ad Script - Only run in production */}
            <Script id="popunder-loader" strategy="afterInteractive">
                {`
                    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                        const s = document.createElement('script');
                        s.src = '/popunder.js';
                        document.body.appendChild(s);
                    }
                `}
            </Script>
        </>
    );
}
