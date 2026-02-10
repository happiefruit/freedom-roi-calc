
import React from 'react';
import { RobotVacuumData } from './types';
import { Wind, Sparkles, PawPrint, Home, Scale, ChevronRight, Zap, Tag, Hourglass } from 'lucide-react';

interface Props {
    data: RobotVacuumData;
    onChange: (data: RobotVacuumData) => void;
    onCalculate: () => void;
    onBack: () => void;
}

export const RobotVacuumCalculator: React.FC<Props> = ({ data, onChange, onCalculate, onBack }) => {
    
    const update = (field: keyof RobotVacuumData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    // Helper for counters
    const Counter = ({ value, onChange, max = 14, label, subLabel, step = 1 }: { value: number, onChange: (v: number) => void, max?: number, label: string, subLabel?: string, step?: number }) => (
        <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 animate-in fade-in slide-in-from-top-2">
            <div>
                <div className="font-bold text-slate-900 text-sm">{label}</div>
                {subLabel && <div className="text-xs text-slate-400">{subLabel}</div>}
            </div>
            <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-2">
                <button 
                    onClick={() => onChange(Math.max(0, value - step))}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-600 shadow-sm hover:text-indigo-600 disabled:opacity-50"
                    disabled={value <= 0}
                >
                    -
                </button>
                <span className="w-8 text-center font-bold text-slate-900 text-sm">{value}</span>
                <button 
                    onClick={() => onChange(Math.min(max, value + step))}
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
                    Robot Config
                </span>
            </div>

            <div className="space-y-6">
                
                {/* 1. The Fork (Type Selection) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Zap size={20} />
                        </div>
                        <label className="font-bold text-slate-900">What do you want?</label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => update('robotType', 'vac_only')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                data.robotType === 'vac_only'
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                                : 'border-slate-100 hover:border-slate-300 text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <Wind size={24} className="mb-3" />
                            <div className="font-bold text-sm mb-1">Vacuum Only</div>
                            <div className="text-xs opacity-75">I just want dust gone.</div>
                        </button>
                        <button
                            onClick={() => update('robotType', 'vac_mop')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                data.robotType === 'vac_mop'
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                                : 'border-slate-100 hover:border-slate-300 text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <Sparkles size={24} className="mb-3" />
                            <div className="font-bold text-sm mb-1">Vac + Mop</div>
                            <div className="text-xs opacity-75">Shiny hard floors.</div>
                        </button>
                    </div>
                </div>

                {/* 2. Machine Investment */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Tag size={20} />
                        </div>
                        <label className="font-bold text-slate-900">Robot Price Tag</label>
                    </div>
                     <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-slate-500">Upfront Cost</span>
                        <span className="text-2xl font-black text-slate-900">${data.machineCost}</span>
                    </div>
                    <input 
                        type="range" min="200" max="3000" step="100" 
                        value={data.machineCost}
                        onChange={(e) => update('machineCost', parseInt(e.target.value))}
                        className="w-full"
                        style={{
                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${(data.machineCost-200)/28}%, #e2e8f0 ${(data.machineCost-200)/28}%, #e2e8f0 100%)`
                        }}
                    />
                    <p className="mt-3 text-xs text-slate-400">
                        How much does the model you want cost?
                    </p>
                </div>

                {/* 3. Environment (Size & Pets) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                            <Home size={20} />
                        </div>
                        <label className="font-bold text-slate-900">The Battlefield</label>
                    </div>

                    {/* Home Size Slider */}
                    <div className="mb-8">
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-sm text-slate-500">Home Size</span>
                            <span className="text-xl font-bold text-slate-900">{data.homeSize} <span className="text-sm text-slate-400 font-medium">sq ft</span></span>
                        </div>
                        <input 
                            type="range" min="200" max="4000" step="10" 
                            value={data.homeSize}
                            onChange={(e) => update('homeSize', parseInt(e.target.value))}
                            className="w-full"
                            style={{
                                background: `linear-gradient(to right, #10b981 0%, #10b981 ${(data.homeSize-200)/38}%, #e2e8f0 ${(data.homeSize-200)/38}%, #e2e8f0 100%)`
                            }}
                        />
                    </div>

                    {/* Pets Toggle */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <PawPrint size={18} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-600">Have Pets?</span>
                        </div>
                        <button
                            onClick={() => update('hasPets', !data.hasPets)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                data.hasPets ? 'bg-indigo-600' : 'bg-slate-300'
                            }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                data.hasPets ? 'translate-x-6' : 'translate-x-1'
                            }`}/>
                        </button>
                    </div>
                    {data.hasPets && (
                         <div className="mt-2 text-[10px] text-slate-400 text-center animate-in fade-in">
                            Includes calculated cost for extra bags & hair removal maintenance.
                         </div>
                    )}
                </div>

                {/* 4. Current Habits (Labor) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <Scale size={20} />
                        </div>
                        <label className="font-bold text-slate-900">Current Habits</label>
                    </div>
                    
                    <div className="space-y-4">
                        <Counter 
                            label="Vacuum Frequency" 
                            subLabel="Times per week you actually vacuum"
                            value={data.manualVacFrequency} 
                            onChange={(v) => update('manualVacFrequency', v)} 
                        />
                        
                        <div className="pb-4 border-b border-slate-100">
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="text-sm font-bold text-slate-900">Time per session</span>
                                <span className="text-sm font-bold text-indigo-600">{data.manualVacTime} mins</span>
                            </div>
                            <input 
                                type="range" min="5" max="120" step="5" 
                                value={data.manualVacTime}
                                onChange={(e) => update('manualVacTime', parseInt(e.target.value))}
                                className="w-full"
                                style={{
                                    background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${(data.manualVacTime-5)/1.15}%, #e2e8f0 ${(data.manualVacTime-5)/1.15}%, #e2e8f0 100%)`
                                }}
                            />
                        </div>

                        {/* Conditional Mop Inputs */}
                        {data.robotType === 'vac_mop' && (
                            <>
                                <Counter 
                                    label="Mop Frequency" 
                                    subLabel="Times per week you mop"
                                    value={data.manualMopFrequency} 
                                    onChange={(v) => update('manualMopFrequency', v)} 
                                />
                                
                                <div>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="text-sm font-bold text-slate-900">Time per mop</span>
                                        <span className="text-sm font-bold text-indigo-600">{data.manualMopTime} mins</span>
                                    </div>
                                    <input 
                                        type="range" min="10" max="120" step="5" 
                                        value={data.manualMopTime}
                                        onChange={(e) => update('manualMopTime', parseInt(e.target.value))}
                                        className="w-full"
                                        style={{
                                            background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${(data.manualMopTime-10)/1.1}%, #e2e8f0 ${(data.manualMopTime-10)/1.1}%, #e2e8f0 100%)`
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 5. Your Time Value */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Hourglass size={20} />
                        </div>
                        <label className="font-bold text-slate-900">What is your time worth?</label>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-slate-500">Hourly Worth</span>
                        <span className="text-2xl font-black text-slate-900">${data.timeValue}</span>
                    </div>
                    <input 
                        type="range" min="0" max="200" step="5" 
                        value={data.timeValue}
                        onChange={(e) => update('timeValue', parseInt(e.target.value))}
                        className="w-full"
                        style={{
                            background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${(data.timeValue)/2}%, #e2e8f0 ${(data.timeValue)/2}%, #e2e8f0 100%)`
                        }}
                    />
                     <p className="mt-3 text-xs text-slate-400">
                        Be honest. What would you pay to sit on the couch instead?
                    </p>
                </div>

            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 w-full p-4 backdrop-blur-md border-t border-slate-200 flex justify-center z-50">
                <button 
                    onClick={() => {
                        if ((window as any).umami) {
                            (window as any).umami.track('calculate_robot_truth_clicked', {
                                robot_type: data.robotType,
                                has_pets: data.hasPets,
                                hourly_rate: data.timeValue,
                                machine_cost: data.machineCost,
                                vac_freq: data.manualVacFrequency,
                                mop_freq: data.manualMopFrequency
                            });
                        }
                        onCalculate();
                    }}
                    className="w-full max-w-lg bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    Calculate Truth <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
