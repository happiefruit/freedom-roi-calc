
import React from 'react';
import { UtensilsCrossed, Shirt, Bot, ChevronRight } from 'lucide-react';
import { ApplianceType } from './types';

interface HomeViewProps {
    onSelect: (appliance: ApplianceType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelect }) => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-12 fade-in">
            {/* Hero */}
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900">
                    Should you buy it?
                </h1>
                <p className="text-xl text-slate-500 font-medium">
                    Brutally honest financial advice for your home.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Dishwasher (Active) */}
                <button 
                    onClick={() => {
                        if ((window as any).umami) (window as any).umami.track('start_dishwasher_calculator');
                        onSelect('dishwasher');
                    }}
                    className="group relative bg-white rounded-3xl p-8 text-left shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <UtensilsCrossed size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Dishwasher</h3>
                    <p className="text-slate-500 text-sm mb-8">
                        Is it a luxury or a necessity? The math might surprise you.
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

                {/* Dryer (Disabled) */}
                <div className="opacity-60 grayscale cursor-not-allowed bg-slate-50 rounded-3xl p-8 text-left border border-slate-200">
                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-200 text-slate-500">
                        <Shirt size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Dryer</h3>
                    <p className="text-slate-500 text-sm">
                        Hang dry vs. tumble dry. Is your time worth the electricity bill?
                    </p>
                    <div className="mt-8 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-600">
                        Coming Soon
                    </div>
                </div>

                {/* Robot Vacuum (Disabled) */}
                <div className="opacity-60 grayscale cursor-not-allowed bg-slate-50 rounded-3xl p-8 text-left border border-slate-200">
                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-200 text-slate-500">
                        <Bot size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Robot Vacuum</h3>
                    <p className="text-slate-500 text-sm">
                        Toy or tool? Calculating the ROI of clean floors.
                    </p>
                    <div className="mt-8 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-600">
                        Coming Soon
                    </div>
                </div>

            </div>
        </div>
    );
};
