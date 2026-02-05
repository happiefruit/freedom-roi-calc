
import React, { useState, useMemo, useEffect } from 'react';
import { AppView, ApplianceType, DishwasherData } from './types';
import { DEFAULT_DISHWASHER_DATA } from './constants';
import { calculateDishwasherROI } from './utils';

// Views
import { HomeView } from './HomeView';
import { DishwasherCalculator } from './DishwasherCalculator';
import { ResultsView } from './ResultsView';
import { Footer } from './Footer';

const App: React.FC = () => {
    // --- State Machine ---
    const [view, setView] = useState<AppView>('home');
    const [selectedAppliance, setSelectedAppliance] = useState<ApplianceType | null>(null);
    
    // Data Store
    const [dishwasherData, setDishwasherData] = useState<DishwasherData>(DEFAULT_DISHWASHER_DATA);

    // --- Analytics Consent ---
    const [analyticsAllowed, setAnalyticsAllowed] = useState(() => {
        const saved = localStorage.getItem('analytics_consent');
        return saved !== null ? JSON.parse(saved) : true; // Default to true
    });

    useEffect(() => {
        const scriptId = 'umami-script';
        
        if (analyticsAllowed) {
            // 1. If allowed & not present, inject it
            if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.id = scriptId;
                script.async = true;
                script.defer = true;
                script.src = "https://cloud.umami.is/script.js";
                script.setAttribute("data-website-id", "994431b0-6042-45c1-a979-2b03e162b240");
                document.head.appendChild(script);
            }
        } else {
            // 2. If blocked & present, remove it
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                document.head.removeChild(existingScript);
            }
        }
        
        // 3. Save preference
        localStorage.setItem('analytics_consent', JSON.stringify(analyticsAllowed));

    }, [analyticsAllowed]);

    // --- Actions ---
    const handleSelectAppliance = (type: ApplianceType) => {
        setSelectedAppliance(type);
        setView('calculator');
    };

    const handleCalculate = () => {
        setView('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReset = () => {
        setView('home');
        setSelectedAppliance(null);
        setDishwasherData(DEFAULT_DISHWASHER_DATA);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Computed ---
    const results = useMemo(() => {
        if (selectedAppliance === 'dishwasher') {
            return calculateDishwasherROI(dishwasherData);
        }
        return null;
    }, [selectedAppliance, dishwasherData]);

    // --- Render Flow ---
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700 flex flex-col">
            
            {/* Nav (Minimal) */}
            <nav className="p-6 flex justify-center">
                <div className="text-2xl font-black tracking-tighter text-slate-900 cursor-pointer" onClick={handleReset}>
                    Worth It?
                </div>
            </nav>

            <main className="flex-1 w-full">
                {view === 'home' && (
                    <HomeView onSelect={handleSelectAppliance} />
                )}

                {view === 'calculator' && selectedAppliance === 'dishwasher' && (
                    <DishwasherCalculator 
                        data={dishwasherData} 
                        onChange={setDishwasherData}
                        onCalculate={handleCalculate}
                        onBack={() => setView('home')}
                    />
                )}

                {view === 'result' && results && (
                    <ResultsView 
                        result={results}
                        data={dishwasherData}
                        onReset={handleReset}
                    />
                )}
            </main>

            <Footer analyticsAllowed={analyticsAllowed} setAnalyticsAllowed={setAnalyticsAllowed} />
        </div>
    );
};

export default App;
