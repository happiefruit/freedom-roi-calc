
import React from 'react';
import { DishwasherData } from './types';
import { Wrench, Clock, ChefHat } from 'lucide-react';

interface Props {
    data: DishwasherData;
    onChange: (data: DishwasherData) => void;
    onCalculate: () => void;
    onBack: () => void;
}

export const DishwasherCalculator: React.FC<Props> = ({ data, onChange, onCalculate, onBack }) => {
    
    const update = (field: keyof DishwasherData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    // Helper for counters
    const Counter = ({ value, onChange, max = 6, label, subLabel }: { value: number, onChange: (v: number) => void, max?: number, label: string, subLabel?: string }) => (
        <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div>
                <div className="font-bold text-slate-900 text-sm">{label}</div>
                {subLabel && <div className="text-xs text-slate-400">{subLabel}</div>}
            </div>
            <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-2">
                <button 
                    onClick={() => onChange(Math.max(0, value - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-600 shadow-sm hover:text-indigo-600 disabled:opacity-50"
                    disabled={value <= 0}
                >
                    -
                </button>
                <span className="w-4 text-center font-bold text-slate-900 text-sm">{value}{value === max && max > 7 ? '+' : ''}</span>
                <button 
                    onClick={() => onChange(Math.min(max, value + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-600 shadow-sm hover:text-indigo-600 disabled:opacity-50"
                    disabled={value >= max}
                >
                    +
                </button>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-lg mx-auto px-4 py-8 fade-in pb-24">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <button onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-slate-900">
                    ← Back
                </button>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    Dishwasher Config
                </span>
            </div>

            <div className="space-y-6">
                
                {/* 1. Time Value */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                        <label className="font-bold text-slate-900">Time Value</label>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-slate-500">Hourly Worth</span>
                        <span className="text-2xl font-black text-slate-900">${data.timeValue}</span>
                    </div>
                    <input 
                        type="range" min="0" max="100" step="1" 
                        value={data.timeValue}
                        onChange={(e) => update('timeValue', parseInt(e.target.value))}
                        className="w-full"
                        style={{
                            background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${data.timeValue}%, #e2e8f0 ${data.timeValue}%, #e2e8f0 100%)`
                        }}
                    />
                    <p className="mt-3 text-xs text-slate-400">
                        "What would you pay to skip a boring hour?"
                    </p>
                </div>

                {/* 2. Kitchen Output (New Section) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <ChefHat size={20} />
                        </div>
                        <div>
                            <label className="font-bold text-slate-900 block">Kitchen Output</label>
                            <span className="text-xs text-slate-400">Be honest. Cereal doesn't count.</span>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <Counter 
                            label="Mouths to feed" 
                            value={data.householdSize} 
                            onChange={(v) => update('householdSize', v)}
                            max={10} 
                        />
                        <div className="h-px bg-slate-100 my-2"></div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 py-2">Cooked Meals / Week</div>
                        <Counter 
                            label="Breakfasts" 
                            subLabel="Eggs, bacon, pans..."
                            value={data.breakfasts} 
                            onChange={(v) => update('breakfasts', v)} 
                            max={7}
                        />
                        <Counter 
                            label="Lunches" 
                            subLabel="Prep, containers, plates..."
                            value={data.lunches} 
                            onChange={(v) => update('lunches', v)} 
                            max={7}
                        />
                        <Counter 
                            label="Dinners" 
                            subLabel="The big one. Pots & pans."
                            value={data.dinners} 
                            onChange={(v) => update('dinners', v)} 
                            max={7}
                        />
                    </div>
                </div>

                {/* 3. Costs */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Wrench size={20} />
                        </div>
                        <label className="font-bold text-slate-900">Investment</label>
                    </div>
                    
                    {/* Machine Cost */}
                    <div className="mb-6">
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-sm text-slate-500">Machine Cost</span>
                            <span className="text-xl font-bold text-slate-900">${data.machineCost}</span>
                        </div>
                        <input 
                            type="range" min="300" max="2000" step="50" 
                            value={data.machineCost}
                            onChange={(e) => update('machineCost', parseInt(e.target.value))}
                            className="w-full"
                            style={{
                                background: `linear-gradient(to right, #10b981 0%, #10b981 ${(data.machineCost-300)/17}%, #e2e8f0 ${(data.machineCost-300)/17}%, #e2e8f0 100%)`
                            }}
                        />
                    </div>

                    {/* Installation */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-medium text-slate-600 pl-1">Need Plumbing? (+$200)</span>
                        <button
                            onClick={() => update('installationType', data.installationType === 'diy' ? 'pro' : 'diy')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                data.installationType === 'pro' ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                data.installationType === 'pro' ? 'translate-x-6' : 'translate-x-1'
                            }`}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 w-full p-4 backdrop-blur-md border-t border-slate-200 flex justify-center z-50">
                <button 
                    onClick={() => {
                        if ((window as any).umami) {
                            (window as any).umami.track('calculate_truth_clicked', {
                                hourly_rate: data.timeValue,
                                household_size: data.householdSize,
                                // New Tracking Fields
                                meals_breakfast: data.breakfasts,
                                meals_lunch: data.lunches,
                                meals_dinner: data.dinners,
                                machine_cost: data.machineCost,
                                installation: data.installationType // 'diy' or 'pro'
                            });
                        }
                        onCalculate();
                    }}
                    className="w-full max-w-lg bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 rounded-2xl active:scale-95 transition-all"
                >
                    Calculate Truth
                </button>
            </div>
        </div>
    );
};
