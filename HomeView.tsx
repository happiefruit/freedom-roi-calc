
import React from 'react';
import { UtensilsCrossed, Shirt, Bot, ChevronRight } from 'lucide-react';
import { ApplianceType } from './types';

interface HomeViewProps {
    onSelect: (appliance: ApplianceType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelect }) => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-12 fade-in">
            {/* Hero Text */}
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900">
                    Will it pay for itself?
                </h1>
                <p className="text-xl text-slate-500 font-medium">
                    Put a real price tag on your free time and see if the upgrade is worth it.
                </p>
            </div>

            {/* Featured Tool */}
            <div className="w-full max-w-md mx-auto mb-16">
                <button 
                    onClick={() => {
                        if ((window as any).umami) (window as any).umami.track('start_dishwasher_calculator');
                        onSelect('dishwasher');
                    }}
                    className="group relative w-full bg-white rounded-3xl p-8 text-left transform scale-105 shadow-xl ring-4 ring-indigo-50 border border-indigo-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <UtensilsCrossed size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Dishwasher</h3>
                    <p className="text-slate-500 text-sm mb-8">
                        Divorce the sponge. Stop scrubbing plates for free and see exactly when this machine pays for itself.
                    </p>
                    <div className="flex items-center text-sm font-bold text-indigo-600 group-hover:translate-x-2 transition-transform">
                        Calculate <ChevronRight size={16} className="ml-1" />
                    </div>
                    
                    <div className="absolute top-6 right-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Ready
                        </span>
                    </div>
                </button>
            </div>

            {/* Up Next Section */}
            <div className="max-w-2xl mx-auto mt-12 pt-12 border-t border-slate-100">
                <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                    Coming Soon
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Dryer (Disabled) */}
                    <div className="bg-slate-50 rounded-3xl p-6 text-left border border-slate-200 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-not-allowed">
                        <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-200 text-slate-500">
                            <Shirt size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Dryer</h3>
                        <p className="text-slate-500 text-xs mb-4">
                            Hang dry vs. tumble dry. Is your time worth the electricity bill?
                        </p>
                        <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-600">
                            Planned
                        </div>
                    </div>

                    {/* Robot Vacuum (Disabled) */}
                    <div className="bg-slate-50 rounded-3xl p-6 text-left border border-slate-200 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-not-allowed">
                        <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-200 text-slate-500">
                            <Bot size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Robot Vacuum</h3>
                        <p className="text-slate-500 text-xs mb-4">
                            Toy or tool? Calculating the ROI of clean floors.
                        </p>
                        <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-600">
                            Planned
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
