
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { CalculationResult, DishwasherData } from './types';
import { formatMoney, formatNumber } from './utils';
import { PaybackTimeline } from './PaybackTimeline';
import { 
    RotateCcw, 
    TrendingUp, 
    TrendingDown, 
    AlertCircle,
    Tv,
    Smartphone,
    Bed,
    BookOpen,
    Bath,
    Wine,
    Waves,
    Calculator,
    X
} from 'lucide-react';

interface Props {
    result: CalculationResult;
    data: DishwasherData;
    onReset: () => void;
}

// --- Copywriting Assets ---

const HEADLINES = {
    high: [
        "Divorce the Sponge.",
        "Welcome to the 21st Century.",
        "Your Hands Deserve Better.",
        "Stop Being a Kitchen Martyr."
    ],
    low: [
        "Keep the Sponge, Miyagi.",
        "The Math Says No.",
        "Don't Burn the Cash.",
        "Stick to the Sink."
    ]
};

const SUBHEADS = {
    high: [
        (h: string) => `You're wasting ${h} hours a year. That's not 'saving money,' that's volunteering for a job nobody wants.`,
        (h: string) => "A robot can do this job for pennies while you sleep. Let it.",
        (h: string) => `Imagine explaining to your grandkids that you washed dishes for ${h} hours just to save 12 cents.`
    ],
    low: [
        () => "You don't generate enough mess to justify a robot yet.",
        () => "Your time is valuable, but your dish pile isn't big enough to care.",
        () => "Manual washing is actually cheaper for your lifestyle. Enjoy the zen."
    ]
};

// --- Fun Units Data ---

const FUN_TIME_UNITS = [
    {
        label: "Netflix Binges",
        ratio: 0.75,
        text: (v: string) => `${v} episodes of 'The Office' you missed.`,
        icon: Tv,
        color: "text-red-500",
        bg: "bg-red-50"
    },
    {
        label: "TikTok Doomscrolling",
        ratio: 1.0,
        text: (v: string) => `${v} solid hours of brain rot.`,
        icon: Smartphone,
        color: "text-pink-500",
        bg: "bg-pink-50"
    },
    {
        label: "Power Naps",
        ratio: 0.33,
        text: (v: string) => `${v} glorious power naps.`,
        icon: Bed,
        color: "text-indigo-500",
        bg: "bg-indigo-50"
    },
    {
        label: "Books Read",
        ratio: 10,
        text: (v: string) => `${v} books read cover-to-cover.`,
        icon: BookOpen,
        color: "text-emerald-500",
        bg: "bg-emerald-50"
    }
];

const FUN_WATER_UNITS = [
    {
        label: "Bathtubs",
        ratio: 150,
        text: (v: string) => `Enough water to fill ${v} bathtubs (over 10 years).`,
        icon: Bath,
        color: "text-blue-500",
        bg: "bg-blue-50"
    },
    {
        label: "Wine Bottles",
        ratio: 0.75,
        text: (v: string) => `${v} bottles of wine (over 10 years).`,
        icon: Wine,
        color: "text-purple-500",
        bg: "bg-purple-50"
    },
    {
        label: "Thirsty Elephants",
        ratio: 300,
        text: (v: string) => `Enough to hydrate ${v} elephants.`,
        icon: Waves,
        color: "text-sky-600",
        bg: "bg-sky-50"
    }
];

export const ResultsView: React.FC<Props> = ({ result, data, onReset }) => {
    
    // State for dynamic content
    const [content, setContent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        let selectedHeadline, selectedSubhead;

        if (verdictTier === 'borderline') {
            selectedHeadline = "It's a Luxury, Not a Savings Plan.";
            const years = Math.ceil(result.breakEvenMonths / 12);
            selectedSubhead = `You will eventually break even in Year ${years}, but this is mostly about convenience, not cash. You're paying for comfort. If you plan to stay in this home for 5+ years, it pays off. If you're renting, stick to hand washing.`;
        } else {
            // Randomization Logic for High/Low
            const headlines = verdictTier === 'high' ? HEADLINES.high : HEADLINES.low;
            selectedHeadline = headlines[Math.floor(Math.random() * headlines.length)];

            const subheads = verdictTier === 'high' ? SUBHEADS.high : SUBHEADS.low;
            const subheadFn = subheads[Math.floor(Math.random() * subheads.length)];
            selectedSubhead = subheadFn(formatNumber(result.hoursSavedPerYear));
        }

        // Fun Units (Random selection)
        const randomTime = FUN_TIME_UNITS[Math.floor(Math.random() * FUN_TIME_UNITS.length)];
        const randomWater = FUN_WATER_UNITS[Math.floor(Math.random() * FUN_WATER_UNITS.length)];

        setContent({
            headline: selectedHeadline,
            subhead: selectedSubhead,
            timeUnit: {
                ...randomTime,
                val: Math.max(0, result.hoursSavedPerYear) / randomTime.ratio
            },
            waterUnit: {
                ...randomWater,
                val: Math.max(0, result.litresSavedPerYear * 10) / randomWater.ratio
            }
        });

    }, [result, verdictTier]); 

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

    if (!content) return <div className="p-20 text-center text-slate-400 font-medium animate-pulse">Calculating life choices...</div>;

    // Badge Styles
    const getBadgeStyle = () => {
        if (verdictTier === 'high') return 'bg-indigo-100 text-indigo-700';
        if (verdictTier === 'borderline') return 'bg-amber-100 text-amber-800';
        return 'bg-orange-100 text-orange-800';
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-12 fade-in">
            
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

            {/* Roast Banner for Heavy Users */}
            {result.isRestaurantMode && (
                <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-4">
                     <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg shrink-0">
                        <AlertCircle size={20} />
                     </div>
                     <div>
                         <h4 className="font-bold text-yellow-900 text-sm mb-1">Reality Check</h4>
                         <p className="text-sm text-yellow-800">
                             You are running a restaurant, not a home. A dishwasher isn't a luxury for you, it's an employee.
                         </p>
                     </div>
                </div>
            )}

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Manual */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Hand Washing</h3>
                        <div className="text-3xl font-black text-slate-900 mb-1">
                            {formatMoney(result.tenYearManualCost)}
                        </div>
                        <p className="text-xs text-slate-400">10-Year Cost (Time + Utilities)</p>
                    </div>
                </div>

                {/* Machine */}
                <div className={`p-6 rounded-3xl border relative overflow-hidden ${verdictTier !== 'low' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200'}`}>
                    <div className="relative z-10">
                        <h3 className={`text-xs font-bold uppercase tracking-widest mb-1 ${verdictTier !== 'low' ? 'text-indigo-200' : 'text-slate-400'}`}>
                            Dishwasher
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

            {/* Payback Timeline (Replaced LineChart) */}
            {result.isWorthIt && result.breakEvenMonths < 120 && (
                <PaybackTimeline 
                    breakEvenMonths={result.breakEvenMonths} 
                    loadsPerWeek={result.loadsPerWeek}
                    hourlyRate={data.timeValue}
                />
            )}

            {/* Fun Units Grid */}
            <h3 className="text-sm font-bold text-slate-900 mb-4 px-2">What you could have done instead</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                
                {/* Time Fun Unit */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${content.timeUnit.bg} ${content.timeUnit.color}`}>
                        <content.timeUnit.icon size={24} />
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                            {content.timeUnit.label}
                        </div>
                        <div className="text-3xl font-black text-slate-900 leading-none mb-1">
                            {formatNumber(content.timeUnit.val)}
                        </div>
                        <div className="text-xs text-slate-500 font-medium leading-tight">
                            {content.timeUnit.text(formatNumber(content.timeUnit.val))}
                        </div>
                    </div>
                </div>

                {/* Water Fun Unit */}
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${content.waterUnit.bg} ${content.waterUnit.color}`}>
                        <content.waterUnit.icon size={24} />
                    </div>
                    <div>
                         <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                            {content.waterUnit.label}
                        </div>
                        <div className="text-3xl font-black text-slate-900 leading-none mb-1">
                            {formatNumber(content.waterUnit.val)}
                        </div>
                        <div className="text-xs text-slate-500 font-medium leading-tight">
                            {content.waterUnit.text(formatNumber(content.waterUnit.val))}
                        </div>
                    </div>
                </div>

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

            {/* Action */}
            <div className="text-center">
                <button 
                    onClick={() => {
                        if ((window as any).umami) (window as any).umami.track('reset_calculator');
                        onReset();
                    }}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors"
                >
                    <RotateCcw size={18} />
                    Check Another Appliance
                </button>
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
                                <h4 className="font-bold text-indigo-600 text-sm uppercase tracking-wider">A. The Hand-Washing Tax</h4>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-600 overflow-x-auto">
                                    ((Loads &times; 10 Yrs) &times; (20 mins &times; {formatMoney(data.timeValue)}/hr)) + Water & Heat
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    We assumed hand-washing takes <strong>~20 mins</strong> of active labor per load (scrubbing + drying). 
                                    A machine takes 5 mins to load/unload. You are paying yourself <strong>{formatMoney(data.timeValue)}/hr</strong> to stand at the sink.
                                </p>
                                <p className="text-sm text-slate-600">
                                    Plus the cost of warm water and liquid soap vs. efficient machine cycles.
                                </p>
                            </div>

                            {/* Section B */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-indigo-600 text-sm uppercase tracking-wider">B. The Machine Cost</h4>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-600 overflow-x-auto">
                                    {formatMoney(data.machineCost)} (Unit) + Install + (10 Yrs &times; Elec/Water/Pods)
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Even with electricity and expensive detergent pods, the machine uses <strong>~80% less water</strong> and electricity than a running tap.
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
};
