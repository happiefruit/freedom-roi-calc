
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { APPLIANCES } from './constants';
import { getRegionalSettings, calculateROI, formatCurrency } from './utils';
import { RegionalSettings, CalculationResults } from './types';

const App: React.FC = () => {
  const [regional] = useState<RegionalSettings>(getRegionalSettings());
  const [selectedApplianceId, setSelectedApplianceId] = useState(APPLIANCES[0].id);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [results, setResults] = useState<CalculationResults | null>(null);

  // Form Inputs
  const [cost, setCost] = useState('');
  const [hourlyWage, setHourlyWage] = useState('50');
  const [frequency, setFrequency] = useState(3);
  const [timePerTask, setTimePerTask] = useState(45);
  
  // Espresso Specifics
  const [cafePrice, setCafePrice] = useState('6.00');
  const [cupsPerDay, setCupsPerDay] = useState('2');

  const selectedAppliance = useMemo(() => 
    APPLIANCES.find(a => a.id === selectedApplianceId) || APPLIANCES[0]
  , [selectedApplianceId]);

  // Load defaults when appliance changes, but only if not already editing custom values for that specific session
  // For simplicity in this SPA, we reset to defaults on switch.
  useEffect(() => {
    setCost(selectedAppliance.defaultCost.toString());
    setFrequency(selectedAppliance.defaultFrequency);
    setTimePerTask(selectedAppliance.defaultTimePerTask);
  }, [selectedAppliance]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cost || parseFloat(cost) <= 0) return;

    const res = calculateROI(
      selectedAppliance,
      {
        cost: parseFloat(cost),
        hourlyWage: parseFloat(hourlyWage),
        frequency,
        timePerTask,
        cafePrice: parseFloat(cafePrice),
        cupsPerDay: parseFloat(cupsPerDay)
      },
      regional
    );
    setResults(res);
    setIsPanelOpen(true);
  };

  const copyToClipboard = () => {
    if (!results) return;
    const text = `
Freedom ROI Analysis: ${selectedAppliance.name}
---
Annual Hours Reclaimed: ${results.annualHoursSaved.toFixed(1)} hrs
Financial Break-even: ${results.breakEvenMonths.toFixed(1)} months
Lifetime ROI (10yr): ${results.lifetimeRoi.toFixed(0)}%
    `.trim();
    navigator.clipboard.writeText(text);
    // Could add a toast here, but alert is fine for minimalist req
    alert('Summary copied!');
  };

  const isFormValid = cost && parseFloat(cost) > 0;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none select-none">
        <h1 className="text-[20rem] font-black leading-none tracking-tighter">TIME</h1>
      </div>

      {/* Screen A: Input Form */}
      <main className="max-w-2xl w-full z-10 transition-all duration-700 ease-in-out">
        <header className="mb-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-[0.9]">
            How much is your <br/><span className="bg-slate-900 text-white px-2">freedom</span> worth?
          </h1>
        </header>

        <form onSubmit={handleCalculate} className="space-y-8 bg-white/50 backdrop-blur-sm rounded-xl">
          
          {/* Appliance Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">I am buying a...</label>
            <div className="relative">
              <select 
                value={selectedApplianceId}
                onChange={(e) => setSelectedApplianceId(e.target.value)}
                className="w-full text-3xl font-bold bg-transparent border-b-4 border-slate-900 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer py-2 pr-8 appearance-none"
              >
                {APPLIANCES.map(app => (
                  <option key={app.id} value={app.id}>{app.name}</option>
                ))}
              </select>
              <i data-lucide="chevron-down" className="absolute right-0 top-4 pointer-events-none"></i>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cost Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                It costs ({regional.currencySymbol})
              </label>
              <input 
                type="number" 
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full text-3xl font-bold bg-transparent border-b-4 border-slate-900 focus:outline-none py-2 placeholder-slate-200"
                placeholder="0"
              />
            </div>

            {/* Wage Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Value of my time (/hr)
              </label>
              <input 
                type="number" 
                value={hourlyWage}
                onChange={(e) => setHourlyWage(e.target.value)}
                className="w-full text-3xl font-bold bg-transparent border-b-4 border-slate-900 focus:outline-none py-2"
                placeholder="50"
              />
            </div>
          </div>

          {/* Dynamic Frequency Slider */}
          <div>
             <div className="flex justify-between items-baseline mb-4">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {selectedAppliance.isEspressoMachine ? 'Days per week buying coffee' : 'Times per week I do this task'}
                </label>
                <span className="text-2xl font-black text-slate-900">{frequency}x</span>
             </div>
             <input 
                type="range" 
                min="1" 
                max={selectedAppliance.isEspressoMachine ? "7" : "14"} 
                step="1"
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer bg-slate-100 accent-slate-900 hover:accent-emerald-500 transition-all"
                style={{
                  background: `linear-gradient(to right, #0F172A 0%, #0F172A ${(frequency / (selectedAppliance.isEspressoMachine ? 7 : 14)) * 100}%, #E2E8F0 ${(frequency / (selectedAppliance.isEspressoMachine ? 7 : 14)) * 100}%, #E2E8F0 100%)`
                }}
             />
          </div>

          {/* Dynamic Time Input */}
          <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                {selectedAppliance.timeTaskLabel}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={timePerTask}
                  onChange={(e) => setTimePerTask(parseFloat(e.target.value))}
                  className="w-full text-3xl font-bold bg-transparent border-b-4 border-slate-900 focus:outline-none py-2"
                />
                <span className="absolute right-0 bottom-4 text-sm font-bold text-slate-400">MINUTES</span>
              </div>
          </div>

          {/* Conditional Espresso Inputs */}
          <div className={`grid grid-cols-2 gap-8 overflow-hidden transition-all duration-500 ease-in-out ${selectedAppliance.isEspressoMachine ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Cafe Price ({regional.currencySymbol})</label>
              <input 
                type="number" 
                step="0.10"
                value={cafePrice}
                onChange={(e) => setCafePrice(e.target.value)}
                className="w-full text-2xl font-bold bg-transparent border-b-2 border-slate-300 focus:border-slate-900 focus:outline-none py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Cups / Day</label>
              <input 
                type="number" 
                value={cupsPerDay}
                onChange={(e) => setCupsPerDay(e.target.value)}
                className="w-full text-2xl font-bold bg-transparent border-b-2 border-slate-300 focus:border-slate-900 focus:outline-none py-1"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!isFormValid}
            className={`group w-full text-white text-2xl font-black py-6 mt-4 flex items-center justify-center gap-3 transition-all rounded-lg
              ${isFormValid ? 'bg-slate-900 hover:bg-emerald-600 active:scale-95 cursor-pointer shadow-xl hover:shadow-2xl' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            {isFormValid ? 'CALCULATE FREEDOM' : 'ENTER COST TO START'}
            {isFormValid && <i data-lucide="arrow-right" className="group-hover:translate-x-2 transition-transform"></i>}
          </button>
        </form>
      </main>

      {/* Screen B: Results Slide-over */}
      <div 
        className={`fixed inset-0 z-50 bg-white slide-panel overflow-y-auto duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="max-w-4xl mx-auto min-h-full flex flex-col p-6 md:p-12 relative">
          
          <nav className="flex justify-between items-center mb-12">
            <button 
              onClick={() => setIsPanelOpen(false)}
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-emerald-600 transition-colors"
            >
              <i data-lucide="arrow-left" className="group-hover:-translate-x-1 transition-transform"></i>
              Back to Edit
            </button>
          </nav>

          {results && (
            <div className="flex-1 pb-24">
              
              {/* Primary Headline */}
              <header className="mb-16 animate-fade-in-up">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-2 block">The Verdict</span>
                <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-4">
                  {results.annualHoursSaved.toFixed(0)} <span className="text-slate-300">Hours</span>
                </h2>
                <p className="text-2xl font-medium text-slate-500">Reclaimed every single year.</p>
              </header>

              {/* Secondary Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Financial Break-even</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900">{results.breakEvenMonths.toFixed(1)}</span>
                        <span className="text-xl font-bold text-slate-500">Months</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, (12/results.breakEvenMonths)*100)}%` }}></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">10-Year ROI</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900">{results.lifetimeRoi.toFixed(0)}%</span>
                        <span className="text-xl font-bold text-slate-500">Return</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Better than the S&P 500. A literal investment in your life.
                    </p>
                </div>
              </div>

              {/* Comparisons */}
              <section className="border-t border-slate-100 pt-12 mb-16">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Visualization</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-6 rounded-2xl">
                        <i data-lucide="tv" className="mb-4 text-slate-900"></i>
                        <p className="text-3xl font-black mb-1">{results.comparisons.netflixSeries.toFixed(0)}</p>
                        <p className="text-xs font-bold uppercase text-slate-400">Netflix Series</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl">
                        <i data-lucide="car" className="mb-4 text-slate-900"></i>
                        <p className="text-3xl font-black mb-1">{results.comparisons.carMiles.toFixed(0)}</p>
                        <p className="text-xs font-bold uppercase text-slate-400">Miles Offset</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl">
                        <i data-lucide="zap" className="mb-4 text-slate-900"></i>
                        <p className="text-3xl font-black mb-1">{results.comparisons.bulbDays.toFixed(0)}</p>
                        <p className="text-xs font-bold uppercase text-slate-400">Days of Light</p>
                    </div>
                 </div>
              </section>

              {/* The "Why" Section - Moved to Bottom */}
              <section className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-8">Why it's worth it</h3>
                    <div className="space-y-6">
                        {selectedAppliance.snarkyReasons.map((reason, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <span className="text-emerald-500 font-bold font-mono">0{i+1}</span>
                                <p className="text-lg md:text-xl font-bold leading-tight">{reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute -bottom-20 -right-20 text-slate-800 opacity-20">
                    <i data-lucide="check-circle" size={300}></i>
                </div>
              </section>
            </div>
          )}

          {/* Floating Action Button */}
          <button 
            onClick={copyToClipboard}
            className="fixed bottom-8 right-8 bg-emerald-500 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-400 hover:scale-110 active:scale-95 transition-all z-50 flex items-center justify-center group"
            aria-label="Copy Summary"
          >
            <i data-lucide="copy" size={24}></i>
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-out group-hover:ml-2 font-bold">Copy Summary</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default App;
