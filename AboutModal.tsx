
import React, { useState } from 'react';
import { X, ExternalLink, Coffee, FileText, Info, Shield, Heart } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [allowAnalytics, setAllowAnalytics] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose} 
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 p-6 flex items-center justify-between z-10">
                    <h3 className="font-black text-slate-900 text-lg tracking-tight flex items-center gap-2">
                        <Info size={20} className="text-indigo-600"/>
                        About This Project
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    
                    {/* Section 1: Purpose */}
                    <section>
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">Why this exists</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            To provide brutally honest financial advice for your home appliances. Most ROI calculators are biased to sell you something. This one is biased to save you money.
                        </p>
                    </section>

                    {/* Section 2: Math */}
                    <section>
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">How we calculate it</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            We use lifecycle cost analysis that factors in your specific labor value, local utility averages, and consumable costs (pods vs. powder) over a 10-year horizon.
                        </p>
                    </section>

                    {/* Section 3: Research */}
                    <section>
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">Powered by NotebookLLM</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Our logic is grounded in deep-dive research into appliance efficiency studies.
                        </p>
                    </section>

                    {/* Section 4: Transparency & Support */}
                    <section className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                         <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-sm uppercase tracking-wider">
                            <Heart size={16} />
                            Keep it Ad-Free
                        </div>
                        <p className="text-sm text-amber-800 mb-4">
                            This tool is 100% free and private. No paywalls, no banner ads. If it saved you money, consider buying a coffee to keep the servers running.
                        </p>
                        <a 
                            href="https://buymeacoffee.com/happiefruit" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors shadow-sm shadow-amber-200"
                        >
                            <Coffee size={18} />
                            Buy me a Coffee
                        </a>
                    </section>

                     {/* Section 5: Privacy */}
                    <section className="border-t border-slate-100 pt-6">
                        <div className="flex items-center justify-between mb-2">
                             <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                                <Shield size={16} className="text-slate-400"/>
                                Your Data
                             </h4>
                             <button 
                                onClick={() => setAllowAnalytics(!allowAnalytics)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${allowAnalytics ? 'bg-indigo-600' : 'bg-slate-200'}`}
                             >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowAnalytics ? 'translate-x-6' : 'translate-x-1'}`} />
                             </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">Allow Anonymous Analytics</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            We respect your privacy. Toggle this off to disable all tracking.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};
