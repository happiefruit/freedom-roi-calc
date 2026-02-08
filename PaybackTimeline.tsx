import React from 'react';
import { Calendar, CheckCircle2, DollarSign } from 'lucide-react';

interface Props {
    breakEvenMonths: number;
    loadsPerWeek: number;
    hourlyRate: number;
    unitLabel?: string;
}

export const PaybackTimeline: React.FC<Props> = ({ breakEvenMonths, loadsPerWeek, hourlyRate, unitLabel = "loads/wk" }) => {
    const MAX_MONTHS = 120; // 10 Years
    
    // Cap percentage at 100% (or slightly less to ensure the marker stays visible at the very end)
    const percentage = Math.min((breakEvenMonths / MAX_MONTHS) * 100, 100);
    
    // Date Calculation
    const today = new Date();
    const breakEvenDate = new Date(today.getFullYear(), today.getMonth() + Math.round(breakEvenMonths), 1);
    const dateString = breakEvenDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm fade-in mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                        ROI Timeline (10 Years)
                    </h3>
                    <div className="text-xl font-black text-slate-900">
                        The Payback Journey
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time to Profit</div>
                     <div className="font-mono font-bold text-indigo-600">
                        {breakEvenMonths < 12 
                            ? `${Math.round(breakEvenMonths)} Months` 
                            : `${(breakEvenMonths/12).toFixed(1)} Years`
                        }
                     </div>
                     <div className="text-[10px] text-slate-400 mt-1 font-medium">
                        Based on {loadsPerWeek < 1 ? loadsPerWeek.toFixed(1) : Math.round(loadsPerWeek)} {unitLabel} @ ${hourlyRate}/hr
                     </div>
                </div>
            </div>

            {/* The Bar */}
            <div className="relative h-4 w-full bg-slate-100 rounded-full mb-10 mx-auto max-w-[98%]">
                
                {/* Cost Phase (Amber) */}
                <div
                    className="absolute top-0 left-0 h-full bg-amber-500 rounded-l-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    style={{ 
                        width: `${percentage}%`,
                        borderRadius: percentage >= 99 ? '9999px' : '9999px 0 0 9999px'
                    }}
                />
                
                {/* Profit Phase (Green) */}
                <div
                    className="absolute top-0 right-0 h-full bg-emerald-500 rounded-r-full transition-all duration-1000 ease-out opacity-20"
                    style={{ 
                        width: `${100 - percentage}%`,
                        borderRadius: percentage <= 1 ? '9999px' : '0 9999px 9999px 0'
                    }}
                />

                {/* Marker (The Pin) */}
                <div
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 transition-all duration-1000 ease-out group cursor-default"
                    style={{ left: `${percentage}%` }}
                >
                    {/* Pin Head */}
                    <div className="w-5 h-5 bg-white border-[5px] border-slate-900 rounded-full shadow-lg transform group-hover:scale-125 transition-transform" />
                    
                    {/* Label/Tooltip */}
                    <div className="absolute top-6 flex flex-col items-center w-32">
                        {/* Little triangle pointer */}
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-900 mb-1"></div>
                        
                        <div className="bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-lg shadow-xl text-center">
                            Break Even
                            <div className="text-[10px] font-medium text-slate-400 font-mono mt-0.5">
                                Month {Math.round(breakEvenMonths)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend / Labels below bar */}
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">
                <div className="flex items-center gap-2 text-amber-600">
                    <DollarSign size={14} className="stroke-[3]" />
                    Paying it off
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 size={14} className="stroke-[3]" />
                    Pure Savings
                </div>
            </div>

            {/* Footer / Context */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-indigo-600">
                    <Calendar size={20} />
                </div>
                <div>
                    <div className="text-sm font-bold text-slate-900">
                        Mark your calendar
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1">
                        You will stop paying for the machine and start actually saving money in <span className="font-bold text-indigo-700 bg-indigo-50 px-1 rounded">{dateString}</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};