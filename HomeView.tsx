import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Shirt, Bot, ChevronRight } from 'lucide-react';
import { ApplianceType } from './types';

const HERO_VARIANTS = [
  {
    headline: "Spend your evenings with family, not the sink.",
    subhead: "Your kids grow up fast. Calculate if saving 200 hours a year is cheaper than missing out."
  },
  {
    headline: "Your kids grow up fast. Chores can wait.",
    subhead: "Prove that automating your home is an investment in your family, not a luxury expense."
  },
  {
    headline: "Keep the honeymoon phase. Ditch the sponge.",
    subhead: "The #1 cause of arguments? Chores. Calculate if saving your evening is cheaper than couples therapy."
  },
  {
    headline: "Your dog misses you. The sink doesn't.",
    subhead: "More walkies, less washing. See if a robot can buy you an extra hour of puppy time."
  },
  {
    headline: "Promote yourself from cleaner to manager.",
    subhead: "Smart homes aren't lazy, they're efficient. Prove that buying your freedom is a smart financial move."
  },
  {
    headline: "Your dog sheds 24/7. You shouldn't clean 24/7.",
    subhead: "Fur fights are a losing battle. See if a robot is cheaper than your constant stress."
  },
  {
    headline: "Stop stepping on mystery crumbs.",
    subhead: "The 'Barefoot Test' never lies. Calculate the ROI of floors that always feel clean."
  },
  {
    headline: "It's 2026. Stop pushing a stick back and forth.",
    subhead: "You don't wash clothes by hand. Why vacuum by hand? See if the upgrade pays off."
  },
  {
    headline: "The only employee that works for pennies.",
    subhead: "It cleans while you sleep. Calculate exactly how much 'passive income' your robot earns you."
  },
  {
    headline: "Reclaim your Saturday morning from the dust bunnies.",
    subhead: "Life is too short to spend it under the sofa. Check if freedom is within your budget."
  }
];

interface HomeViewProps {
    onSelect: (appliance: ApplianceType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelect }) => {
    const [heroText, setHeroText] = useState(HERO_VARIANTS[0]);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * HERO_VARIANTS.length);
        const selectedVariant = HERO_VARIANTS[randomIndex];
        setHeroText(selectedVariant);

        if ((window as any).umami) {
            (window as any).umami.track('hero_variant_viewed', {
                headline: selectedVariant.headline,
                variant_index: randomIndex
            });
        }
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-12 fade-in">
            {/* Hero Text */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                    {heroText.headline}
                </h1>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                    {heroText.subhead}
                </p>
            </div>

            {/* Featured Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
                
                {/* Dishwasher */}
                <button 
                    onClick={() => {
                        if ((window as any).umami) (window as any).umami.track('start_dishwasher_calculator');
                        onSelect('dishwasher');
                    }}
                    className="group relative w-full bg-white rounded-3xl p-8 text-left shadow-xl ring-4 ring-indigo-50 border border-indigo-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <UtensilsCrossed size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Dishwasher</h3>
                    <p className="text-slate-500 text-sm mb-8">
                        Divorce the sponge. See exactly when this machine pays for itself.
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

                {/* Robot Vacuum */}
                <button 
                    onClick={() => {
                        if ((window as any).umami) (window as any).umami.track('start_robot_calculator');
                        onSelect('robot-vacuum');
                    }}
                    className="group relative w-full bg-white rounded-3xl p-8 text-left shadow-xl ring-4 ring-indigo-50 border border-indigo-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Bot size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Robot Vacuum</h3>
                    <p className="text-slate-500 text-sm mb-8">
                        Toy or tool? Calculate the ROI of clean floors based on your home size.
                    </p>
                    <div className="flex items-center text-sm font-bold text-indigo-600 group-hover:translate-x-2 transition-transform">
                        Calculate <ChevronRight size={16} className="ml-1" />
                    </div>

                     <div className="absolute top-6 right-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            New
                        </span>
                    </div>
                </button>
            </div>

            {/* Up Next Section */}
            <div className="max-w-2xl mx-auto mt-4 pt-12 border-t border-slate-100">
                <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
                    Coming Soon
                </div>

                <div className="w-full max-w-sm mx-auto">
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
                </div>
            </div>
        </div>
    );
};