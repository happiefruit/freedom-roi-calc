
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { CalculationResult, CalculatorData, DishwasherData } from './types';
import { formatMoney, formatNumber } from './utils';
import { PaybackTimeline } from './PaybackTimeline';
import { CONSTANTS } from './constants';
import { 
    RotateCcw, 
    TrendingUp, 
    TrendingDown, 
    AlertCircle,
    Tv,
    Smartphone,
    Bed,
    BookOpen,
    Calculator,
    X,
    Info,
    Utensils,
    Sparkles,
    Share,
    Gamepad2,
    Dumbbell,
    Flower2,
    MapPin,
    Droplets
} from 'lucide-react';

interface Props {
    result: CalculationResult;
    data: CalculatorData;
    onReset: () => void;
    applianceId: 'dishwasher' | 'robot_vacuum';
}

// --- Copywriting Assets ---

const COPY_CONFIG = {
  dishwasher: {
    success_headline: "Divorce the sponge.",
    success_subhead: "You are wasting money by doing it yourself.",
    fail_headline: "Keep the sponge.",
    fail_subhead: "Your time isn't worth the upgrade cost yet.",
    share_win: (years: string) => `I just found out my dishwasher pays for itself in ${years} years. 🧽💔 Check yours:`,
    share_loss: (saved: string) => `The math says NO. 🚫 I'm saving ${saved} by washing dishes manually.`
  },
  robot_vacuum: {
    success_headline: "Sack the broom.",
    success_subhead: "Stop cleaning for free. Let the robot do the dirty work.",
    fail_headline: "Keep sweeping.",
    fail_subhead: "For your small space, a robot is just a pricey toy.",
    share_win: (years: string) => `My robot vacuum pays for itself in ${years} years. I'm literally making money by sleeping. 😴💸 Check yours:`,
    share_loss: (saved: string) => `The math says NO. 🚫 I'm saving ${saved} by sweeping it myself.`
  }
};

// --- Fun Units Data ---

const FUN_TIME_UNITS = [
    {
        label: "Gaming Wins",
        ratio: 0.5, // ~30 min ranked match
        text: "{v} ranked matches you could have carried.",
        icon: Gamepad2,
        color: "text-violet-500",
        bg: "bg-violet-50"
    },
    {
        label: "Gym Gains",
        ratio: 1.5, // ~90 min workout
        text: "{v} full gym sessions (including leg day).",
        icon: Dumbbell,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        label: "Pilates/Yoga",
        ratio: 1.0, // 1 hour class
        text: "{v} 'Pilates Princess' classes.",
        icon: Flower2,
        color: "text-rose-400",
        bg: "bg-rose-50"
    },
    {
        label: "Power Naps",
        ratio: 0.33, // 20 mins
        text: "{v} guilt-free power naps.",
        icon: Bed,
        color: "text-indigo-500",
        bg: "bg-indigo-50"
    },
    {
        label: "Doomscrolling",
        ratio: 1.0, // 1 hour
        text: "{v} hours of dissociation on TikTok.",
        icon: Smartphone,
        color: "text-pink-500",
        bg: "bg-pink-50"
    },
    {
        label: "Netflix Binges",
        ratio: 0.75, // ~45 min episode
        text: "{v} episodes of that show you're re-watching.",
        icon: Tv,
        color: "text-red-500",
        bg: "bg-red-50"
    },
    {
        label: "Reading",
        ratio: 0.5, // ~30 mins per chapter
        text: "{v} chapters of the book on your nightstand.",
        icon: BookOpen,
        color: "text-amber-600",
        bg: "bg-amber-50"
    }
];

// --- Simple Tooltip Component ---
const SimpleTooltip = ({ content, colorClass = "text-slate-400" }: { content: React.ReactNode, colorClass?: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative inline-flex ml-2 align-middle z-20">
            <button 
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                className={`${colorClass} hover:opacity-100 opacity-70 transition-opacity`}
                aria-label="Show breakdown"
            >
                <Info size={14} />
            </button>
            {open && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 whitespace-normal break-words bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 leading-relaxed text-left cursor-auto">
                    {content}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-slate-900"></div>
                </div>
            )}
        </div>
    )
};

// --- Fun Fact Carousel Component ---
const FunFactCarousel = ({ facts }: { facts: any[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused || facts.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === facts.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // 5-second interval
        
        return () => clearInterval(interval);
    }, [facts.length, isPaused]);

    if (facts.length === 0) return null;

    const fact = facts[currentIndex];
    const Icon = fact.icon;

    return (
        <div 
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden min-h-[140px] flex items-center transition-all"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
             <div key={currentIndex} className="flex items-center gap-4 w-full animate-in slide-in-from-right-8 fade-in duration-500 fill-mode-forwards">
                <div className={`p-3 rounded-2xl shrink-0 ${fact.bg} ${fact.color}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        {fact.label}
                    </div>
                    <div className="text-3xl font-black text-slate-900 leading-none mb-1">
                        {fact.displayValue}
                    </div>
                    <div className="text-xs text-slate-500 font-medium leading-tight">
                        {fact.text}
                    </div>
                </div>
             </div>
             
             {/* Progress indicators */}
             {facts.length > 1 && (
                 <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {facts.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-200'}`} 
                        />
                    ))}
                 </div>
             )}
        </div>
    );
};

export const ResultsView: React.FC<Props> = ({ result, data, onReset, applianceId }) => {
    
    // State for dynamic content
    const [content, setContent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Identify Appliance Type & Config
    const isDishwasher = applianceId === 'dishwasher';
    const ScheduleIcon = isDishwasher ? Utensils : Sparkles;
    const frequencyUnit = isDishwasher ? "loads/wk" : "runs/wk";

    // Determine Verdict Tier
    const verdictTier = useMemo(() => {
        // If not strictly worth it math-wise OR payback is > 5 years (60 months)
        if (!result.isWorthIt || result.breakEvenMonths >= 60) return 'low';
        // If payback is between 2 and 5 years
        if (result.breakEvenMonths > 24) return 'borderline';
        // If payback is <= 2 years
        return 'high';
    }, [result]);

    useEffect(() => {
        const config = COPY_CONFIG[applianceId];
        let selectedHeadline, selectedSubhead;

        if (verdictTier === 'low') {
            selectedHeadline = config.fail_headline;
            selectedSubhead = config.fail_subhead;
        } else {
            // For high and borderline, we use the success copy
            selectedHeadline = config.success_headline;
            selectedSubhead = config.success_subhead;
            
            if (verdictTier === 'borderline') {
                 // Keep the pragmatic warning for borderline cases as an override or append
                 selectedSubhead += " (Though it will take a few years to pay off).";
            }
        }

        setContent({
            headline: selectedHeadline,
            subhead: selectedSubhead
        });

    }, [result, verdictTier, applianceId]); 

    // Generate Facts List for Carousel
    const facts = useMemo(() => {
        const list = [];

        // 1. Time Facts
        // Shuffle and pick up to 4 distinct random ones
        const shuffledTime = [...FUN_TIME_UNITS].sort(() => 0.5 - Math.random());
        
        for (const unit of shuffledTime) {
            const val = Math.max(0, result.hoursSavedPerYear) / unit.ratio;
            if (val >= 1) {
                 list.push({
                     label: unit.label,
                     value: val,
                     displayValue: formatNumber(val),
                     text: unit.text.replace('{v}', formatNumber(val)),
                     icon: unit.icon,
                     color: unit.color,
                     bg: unit.bg
                 });
            }
            if (list.length >= 4) break;
        }
        
        // 2. Water Fact (if relevant and significant)
        if (result.litresSavedPerYear > 50) {
            const bathtubs = result.litresSavedPerYear / 150; // ~150L per bathtub
            if (bathtubs >= 1) {
                 list.unshift({ // Add to front for visibility
                    label: "H2O Saved",
                    value: bathtubs,
                    displayValue: formatNumber(bathtubs),
                    text: `Equivalent to ${formatNumber(bathtubs)} full bathtubs saved.`,
                    icon: Droplets,
                    color: "text-blue-500",
                    bg: "bg-blue-50"
                });
            }
        }
        
        // Fallback if list is empty (e.g. 0 hours saved)
        if (list.length === 0) {
             list.push({
                 label: "Time Saved",
                 value: result.hoursSavedPerYear,
                 displayValue: formatNumber(result.hoursSavedPerYear),
                 text: "Hours reclaimed per year.",
                 icon: RotateCcw,
                 color: "text-slate-500",
                 bg: "bg-slate-50"
             });
        }

        return list;
    }, [result]);

    // Lock Body Scroll when Modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    // Breakdown Logic for Tooltips
    const breakdown = useMemo(() => {
        if (isDishwasher) {
            const d = data as any;
            
            const machinePurchase = d.machineCost + (d.installationType === 'pro' ? 200 : 0);
            const machineOp10Y = result.tenYearMachineCost - machinePurchase;

            return {
                manual: (
                    <div className="font-mono text-xs space-y-1">
                        <div className="border-b border-slate-700 pb-1 mb-1 font-bold text-slate-300">
                            The Labor Math:
                        </div>
                        <div>{result.inputs.duration} min × {result.inputs.frequency} {result.inputs.periodLabel}</div>
                        <div>× 52 weeks = <span className="text-yellow-400">{Math.round(result.annualManualLaborHours)} hrs/yr</span></div>
                        <div>× ${result.inputs.rate}/hr = <span className="text-green-400">${formatMoney(result.annualManualLaborCost)}</span></div>
                        <div className="mt-1 pt-1 border-t border-slate-700 text-slate-400">
                            + Water/Supplies: ${formatMoney(result.annualManualSuppliesCost)}
                        </div>
                    </div>
                ),
                machine: (
                    <div>
                         <div className="font-bold text-slate-300 border-b border-slate-700 pb-1 mb-1">10-Year Cost Breakdown</div>
                         <div className="flex justify-between"><span>Unit & Install:</span> <span>{formatMoney(machinePurchase)}</span></div>
                         <div className="flex justify-between"><span>Water/Elec/Pods:</span> <span>{formatMoney(machineOp10Y)}</span></div>
                    </div>
                )
            };
        } else {
            // Robot
            const r = data as any;
            
            const purchase = r.machineCost;
            const batteries = 70 * 3;
            const maintenance10Y = result.tenYearMachineCost - purchase - batteries;

             return {
                manual: (
                    <div className="font-mono text-xs space-y-1">
                        <div className="border-b border-slate-700 pb-1 mb-1 font-bold text-slate-300">
                            The Labor Math:
                        </div>
                        <div>{result.inputs.duration} min × {result.inputs.frequency} {result.inputs.periodLabel}</div>
                        <div>× 52 weeks = <span className="text-yellow-400">{Math.round(result.annualManualLaborHours)} hrs/yr</span></div>
                        <div>× ${result.inputs.rate}/hr = <span className="text-green-400">${formatMoney(result.annualManualLaborCost)}</span></div>
                    </div>
                ),
                machine: (
                    <div>
                         <div className="font-bold text-slate-300 border-b border-slate-700 pb-1 mb-1">10-Year Cost Breakdown</div>
                         <div className="flex justify-between"><span>Unit Price:</span> <span>{formatMoney(purchase)}</span></div>
                         <div className="flex justify-between"><span>Batteries (3x):</span> <span>{formatMoney(batteries)}</span></div>
                         <div className="flex justify-between"><span>Parts & Elec:</span> <span>{formatMoney(maintenance10Y)}</span></div>
                    </div>
                )
            };
        }
    }, [result, data, isDishwasher]);

    const handleShare = async () => {
        const config = COPY_CONFIG[applianceId];
        let shareText;

        if (result.isWorthIt) {
            const years = (result.breakEvenMonths / 12).toFixed(1);
            shareText = config.share_win(years) + ` ${window.location.href}`;
        } else {
            const saved = formatMoney(Math.abs(result.netSavings10Year));
            shareText = config.share_loss(saved) + ` ${window.location.href}`;
        }
        
        // Track share attempt
        if ((window as any).umami) (window as any).umami.track('share_result');
    
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Worth It? Calculator',
                    text: shareText,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                alert("Result copied to clipboard! Paste it anywhere.");
            } catch (err) {
                console.error('Failed to copy', err);
            }
        }
    };

    if (!content) return <div className="p-20 text-center text-slate-400 font-medium animate-pulse">Calculating life choices...</div>;

    // Badge Styles
    const getBadgeStyle = () => {
        if (verdictTier === 'high') return 'bg-indigo-100 text-indigo-700';
        if (verdictTier === 'borderline') return 'bg-amber-100 text-amber-800';
        return 'bg-orange-100 text-orange-800';
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-12 pb-40 fade-in relative">
            
            {/* Verdict Header */}
            <div className="text-center mb-10">
                <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 ${getBadgeStyle()}`}>
                    Verdict
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">
                    {content.headline}
                </h1>
                <p className="text-xl text-slate-500 max-w-md mx-auto leading-relaxed">
                    {content.subhead}
                </p>
            </div>

            {/* Region Caveat Banner (New) */}
            {result.regionCaveat && (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-4">
                     <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                        <MapPin size={20} />
                     </div>
                     <div>
                         <h4 className="font-bold text-blue-900 text-sm mb-1">Regional Advice</h4>
                         <p className="text-sm text-blue-800 leading-snug">
                             {result.regionCaveat}
                         </p>
                     </div>
                </div>
            )}

            {/* Roast Banner for Heavy Users */}
            {result.isRestaurantMode && (
                <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-4">
                     <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg shrink-0">
                        <AlertCircle size={20} />
                     </div>
                     <div>
                         <h4 className="font-bold text-yellow-900 text-sm mb-1">Reality Check</h4>
                         <p className="text-sm text-yellow-800">
                             {isDishwasher 
                                ? "You are running a restaurant, not a home. A dishwasher isn't a luxury for you, it's an employee."
                                : "Your home is massive. You might need an industrial fleet, not one robot."
                             }
                         </p>
                     </div>
                </div>
            )}

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-30 overflow-visible">
                {/* Manual */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 relative z-30">
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center">
                            {isDishwasher ? "Hand Washing" : "Manual Cleaning"}
                            <SimpleTooltip content={breakdown.manual} />
                        </h3>
                        <div className="text-3xl font-black text-slate-900 mb-1">
                            {formatMoney(result.tenYearManualCost)}
                        </div>
                        <p className="text-xs text-slate-400">10-Year Cost (Time + Utilities)</p>
                    </div>
                </div>

                {/* Machine */}
                <div className={`p-6 rounded-3xl border relative z-20 ${verdictTier !== 'low' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200'}`}>
                    <div className="relative z-10">
                        <h3 className={`text-xs font-bold uppercase tracking-widest mb-1 flex items-center ${verdictTier !== 'low' ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {isDishwasher ? "Dishwasher" : "Robot Vacuum"}
                            <SimpleTooltip 
                                content={breakdown.machine} 
                                colorClass={verdictTier !== 'low' ? 'text-indigo-200' : 'text-slate-400'}
                            />
                        </h3>
                        <div className={`text-3xl font-black mb-1 ${verdictTier !== 'low' ? 'text-white' : 'text-slate-900'}`}>
                            {formatMoney(result.tenYearMachineCost)}
                        </div>
                        <p className={`text-xs ${verdictTier !== 'low' ? 'text-indigo-200' : 'text-slate-400'}`}>
                            10-Year Cost (Machine + Utilities)
                        </p>
                    </div>
                </div>
            </div>

            {/* Payback Timeline - Visible for ALL appliances if worth it */}
            {result.isWorthIt && result.breakEvenMonths < 120 && (
                <PaybackTimeline 
                    breakEvenMonths={result.breakEvenMonths} 
                    loadsPerWeek={result.loadsPerWeek}
                    hourlyRate={data.timeValue}
                    unitLabel={frequencyUnit}
                />
            )}

            {/* Fun Units Grid */}
            <h3 className="text-sm font-bold text-slate-900 mb-4 px-2">What you could have done instead</h3>
            <div className="grid grid-cols-1 gap-4 mb-8">
                <FunFactCarousel facts={facts} />
            </div>

            {/* Savings Breakdown */}
            <div className="bg-slate-50 rounded-3xl p-8 mb-12">
                <h3 className="text-sm font-bold text-slate-900 mb-6">The Boring Financials</h3>
                
                <div className="space-y-6">
                    {/* Time */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl ${result.hoursSavedPerYear > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {result.hoursSavedPerYear > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">Total Free Time</div>
                                <div className="text-xs text-slate-500">Hours reclaimed / year</div>
                            </div>
                        </div>
                        <div className="text-xl font-black text-slate-900">
                            {formatNumber(result.hoursSavedPerYear)} <span className="text-sm font-medium text-slate-400">hrs</span>
                        </div>
                    </div>

                    <div className="h-px bg-slate-200 w-full my-4"></div>

                    {/* Workload (Transparency Row) */}
                    <div className="flex items-center justify-between relative">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                                <ScheduleIcon size={20} />
                            </div>
                            <div className="flex items-center gap-2">
                                <div>
                                    <div className="font-bold text-slate-900">
                                        {isDishwasher ? "Estimated Workload" : "Cleaning Schedule"}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {isDishwasher ? "Based on your culinary profile" : "Sessions per week"}
                                    </div>
                                </div>
                                
                                {/* Info Icon & Tooltip - Only for Dishwasher as it has complex item logic */}
                                {isDishwasher && (
                                <SimpleTooltip content={
                                   <div className="font-mono text-xs space-y-2 w-56">
                                        <div className="border-b border-slate-700 pb-1 font-bold text-slate-300">
                                          WEEKLY RECEIPT
                                        </div>
                                        
                                        <div className="text-[10px] text-slate-400 italic">
                                          Based on: {result.inputs.people} People • {result.inputs.cookingStyle} • {result.inputs.region}
                                        </div>

                                        {/* The New Itemized Breakdown */}
                                        {result.breakdown && (
                                            <div className="space-y-1 py-1 text-[11px] border-b border-slate-800">
                                              <div className="flex justify-between">
                                                <span>🥣 Small Bowls/Prep:</span>
                                                <span>{result.breakdown.bowls}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span>🍽️ Plates/Dishes:</span>
                                                <span>{result.breakdown.plates}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span>🍳 Pots & Pans:</span>
                                                <span>{result.breakdown.pots}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span>🥢 Utensils:</span>
                                                <span>{result.breakdown.utensils}</span>
                                              </div>
                                            </div>
                                        )}
                                
                                        <div className="flex justify-between pt-1 font-bold text-yellow-400">
                                          <span>Total Weekly Items:</span>
                                          <span>{result.itemBreakdown.totalWeeklyItems}</span>
                                        </div>

                                        <div className="flex justify-between font-bold text-green-400">
                                          <span>Final Load Count:</span>
                                          <span>{result.loadsPerWeek.toFixed(1)} loads/wk</span>
                                        </div>
                                        
                                        {result.isHygieneTriggered && (
                                            <div className="text-[10px] text-orange-400 mt-2 leading-tight bg-orange-950/30 p-1.5 rounded border border-orange-900/50">
                                              ⚠️ Adjusted for hygiene: Even if volume is low, we recommend 2+ loads/week to prevent odors.
                                            </div>
                                        )}

                                        {!result.isHygieneTriggered && (
                                            <div className="text-[10px] text-slate-500 mt-2 leading-tight">
                                              *Calculated using regional rack physics ({result.inputs.region} profile).
                                            </div>
                                        )}
                                   </div>
                                } colorClass="text-slate-400 hover:text-indigo-600 transition-colors" />
                                )}
                            </div>
                        </div>
                        <div className="text-xl font-black text-slate-900">
                            {result.loadsPerWeek.toFixed(1)} <span className="text-sm font-medium text-slate-400">{frequencyUnit}</span>
                        </div>
                    </div>

                    <div className="h-px bg-slate-200 w-full my-4"></div>

                    {/* Net 10 Yr */}
                    <div className="flex items-center justify-between">
                         <div className="font-bold text-slate-900">Net 10-Year Value</div>
                         <div className={`text-2xl font-black ${result.isWorthIt ? 'text-green-600' : 'text-red-600'}`}>
                             {result.isWorthIt ? '+' : ''}{formatMoney(result.netSavings10Year)}
                         </div>
                    </div>
                </div>

                {/* Show Math Trigger */}
                <div className="mt-6 flex justify-end">
                    <button 
                         onClick={() => {
                             if ((window as any).umami) (window as any).umami.track('open_boring_math_modal');
                             setIsModalOpen(true);
                         }}
                         className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                        <Calculator size={16} />
                        Wait, how is this calculated?
                    </button>
                </div>
            </div>

            {/* Sticky Share Footer */}
            <div className="fixed bottom-6 left-4 right-4 z-50 md:max-w-2xl md:mx-auto">
                <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-4 flex gap-3 animate-in slide-in-from-bottom-4 fade-in duration-700">
                    <button 
                        onClick={() => {
                            if ((window as any).umami) (window as any).umami.track('reset_calculator');
                            onReset();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                        <RotateCcw size={18} />
                        Start Over
                    </button>
                    <button 
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                        <Share size={18} />
                        Share Result
                    </button>
                </div>
            </div>

            {/* Math Modal - Portal used to escape the parent transform (fade-in) */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsModalOpen(false)} 
                    />
                    <div className="relative bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 p-6 flex items-center justify-between z-10">
                            <h3 className="font-black text-slate-900 text-lg tracking-tight">
                                The Boring Math <span className="text-slate-400 font-medium text-sm ml-1">(For the Skeptics)</span>
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-8">
                            
                            {/* Section A */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-indigo-600 text-sm uppercase tracking-wider">
                                    {isDishwasher ? "A. The Hand-Washing Tax" : "A. The Manual Labor Tax"}
                                </h4>
                                
                                {isDishwasher ? (
                                    <>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-600 overflow-x-auto">
                                        ((Loads &times; 10 Yrs) &times; ({(data as DishwasherData).culinaryStyle === 'asia' ? '15' : ((data as DishwasherData).culinaryStyle === 'europe' ? '25' : '20')} mins &times; {formatMoney(data.timeValue)}/hr)) + Water & Heat
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        We assumed hand-washing takes <strong>~{(data as DishwasherData).culinaryStyle === 'asia' ? '15' : ((data as DishwasherData).culinaryStyle === 'europe' ? '25' : '20')} mins</strong> of active labor per load (scrubbing + drying). 
                                        A machine takes 5 mins to load/unload. You are paying yourself <strong>{formatMoney(data.timeValue)}/hr</strong> to stand at the sink.
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Plus the cost of warm water and liquid soap vs. efficient machine cycles.
                                    </p>
                                    </>
                                ) : (
                                    <>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-600 overflow-x-auto">
                                        ((Sessions &times; 10 Yrs) &times; (Avg Duration &times; {formatMoney(data.timeValue)}/hr))
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        We calculated manual cost based on your reported cleaning frequency and duration. 
                                        You are paying yourself <strong>{formatMoney(data.timeValue)}/hr</strong> to do the chores yourself.
                                    </p>
                                    </>
                                )}
                            </div>

                            {/* Section B */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-indigo-600 text-sm uppercase tracking-wider">B. The Machine Cost</h4>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-600 overflow-x-auto">
                                    {isDishwasher 
                                        ? `${formatMoney(data.machineCost)} (Unit) + Install + (10 Yrs × Elec/Water/Pods)`
                                        : `${formatMoney(data.machineCost)} (Unit) + (10 Yrs × Maint/Elec/Battery)`
                                    }
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {isDishwasher 
                                        ? "Even with electricity and expensive detergent pods, the machine uses ~80% less water and electricity than a running tap."
                                        : "Includes electricity charging, replacement parts (filters/bags), and battery replacements every 3 years."
                                    }
                                </p>
                            </div>

                            {/* Section C */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-indigo-600 text-sm uppercase tracking-wider">C. The Net Result</h4>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-600">
                                    Total Manual Cost - Total Machine Cost = Net Value
                                </div>
                                <p className="text-xs text-slate-400 italic">
                                    * We calculated this over a standard 10-year machine lifespan.
                                </p>
                            </div>

                            {/* Footer Action */}
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-full mt-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Got it
                            </button>

                        </div>
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
}
