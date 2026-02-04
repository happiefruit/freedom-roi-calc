
import React, { useState, useMemo } from 'react';
import { AppView, ApplianceType, DishwasherData } from './types';
import { DEFAULT_DISHWASHER_DATA } from './constants';
import { calculateDishwasherROI } from './utils';

// Views
import { HomeView } from './HomeView';
import { DishwasherCalculator } from './DishwasherCalculator';
import { ResultsView } from './ResultsView';

const App: React.FC = () => {
    // --- State Machine ---
    const [view, setView] = useState<AppView>('home');
    const [selectedAppliance, setSelectedAppliance] = useState<ApplianceType | null>(null);
    
    // Data Store
    const [dishwasherData, setDishwasherData] = useState<DishwasherData>(DEFAULT_DISHWASHER_DATA);

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
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
            
            {/* Nav (Minimal) */}
            <nav className="p-6 flex justify-center">
                <div className="text-2xl font-black tracking-tighter text-slate-900 cursor-pointer" onClick={handleReset}>
                    Worth It?
                </div>
            </nav>

            <main className="flex-1">
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
        </div>
    );
};

export default App;
