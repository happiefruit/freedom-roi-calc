
import React, { useState } from 'react';
import { AboutModal } from './AboutModal';

interface FooterProps {
    analyticsAllowed: boolean;
    setAnalyticsAllowed: (allowed: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({ analyticsAllowed, setAnalyticsAllowed }) => {
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    return (
        <>
            <footer className="w-full py-12 border-t border-slate-200/60 mt-auto">
                <div className="flex flex-col items-center justify-center text-center px-4">
                    {/* Row 1: Brand */}
                    <div className="text-sm font-semibold text-slate-900">
                        Is It Worth? &copy; 2026
                    </div>

                    {/* Row 2: Disclaimer */}
                    <p className="text-xs text-slate-500 mt-2 max-w-md leading-relaxed">
                        For entertainment and estimation purposes only. Not financial advice.
                    </p>

                    {/* Row 3: Links */}
                    <div className="flex items-center gap-3 mt-6 text-xs font-medium text-slate-500">
                        <button 
                            onClick={() => setIsAboutOpen(true)}
                            className="hover:text-indigo-600 transition-colors"
                        >
                            About Project
                        </button>
                        <span className="text-slate-300">•</span>
                        <a href="https://buymeacoffee.com/happiefruit" className="hover:text-indigo-600 transition-colors">Buy a Coffee ☕</a>
                        <span className="text-slate-300">•</span>
                        <a href="https://github.com/happiefruit" className="hover:text-indigo-600 transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>
            
            <AboutModal 
                isOpen={isAboutOpen} 
                onClose={() => setIsAboutOpen(false)} 
                analyticsAllowed={analyticsAllowed}
                setAnalyticsAllowed={setAnalyticsAllowed}
            />
        </>
    );
};
