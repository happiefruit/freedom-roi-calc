import React, { useState, useEffect, useMemo } from 'react';
import { APPLIANCES } from './constants';
import { getRegionalSettings, calculateROI, formatCurrency } from './utils';
import { RegionalSettings, CalculationResults } from './types';

const App: React.FC = () => {
  const [regional] = useState<RegionalSettings>(getRegionalSettings());
  const [selectedApplianceId, setSelectedApplianceId] = useState(APPLIANCES[0].id);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
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

  useEffect(() => {
    setCost(selectedAppliance.defaultCost.toString());
    setFrequency(selectedAppliance.defaultFrequency);
    setTimePerTask(selectedAppliance.defaultTimePerTask);
  }, [selectedAppliance]);

  // Load privacy settings
  useEffect(() => {
    const stored = localStorage.getItem('analyticsConsent');
    if (stored === 'true') {
        setAnalyticsEnabled(true);
    }
  }, []);

  // Refresh icons when UI changes
  useEffect(() => {
    // @ts-ignore
    if (window.lucide) {
        // @ts-ignore
        window.lucide.createIcons();
    }
  });

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
Financial Break-even: ${results.breakEvenMonths > 120 ? '10+ Years' : results.breakEvenMonths.toFixed(1) + ' months'}
Lifetime ROI (10yr): ${results.lifetimeRoi.toFixed(0)}%
    `.trim();
    navigator.clipboard.writeText(text);
    alert('Summary copied!');
  };

  const toggleAnalytics = (enabled: boolean) => {
    setAnalyticsEnabled(enabled);
    localStorage.setItem('analyticsConsent', String(enabled));
  };

  const isFormValid = cost && parseFloat(cost) > 0;

  // Helper for conditional formatting of small numbers
  const formatMetric = (val: number) => val < 10 && val > 0 ? val.toFixed(1) : val.toFixed(0);

  // Helper to determine 'Worth It' status
  const getVerdict = () => {
    if (!results) return null;
    const costNum = parseFloat(cost) || 0;
    // If annual return is less than 5% of cost, it's low ROI
    const isLowRoi = results.annualValueSaved < (costNum * 0.05);
    const breakEvenText = results.breakEvenMonths > 120 ? "10+ Years" : results.breakEvenMonths.toFixed(1);
    
    // Snarky Headlines for bad ROI
    let headline = "Reclaimed every single year.";
    let title = "The Verdict";
    let titleColor = "text-emerald-600";
    let bigText = <>{results.annualHoursSaved.toFixed(1)} <span className="text-slate-300">Hours</span></>;
    
    if (isLowRoi) {
       titleColor = "text-rose-500";
       if (results.breakEvenMonths > 600) {
           bigText = <span className="text-5xl md:text-7xl">You'll be retired first.</span>;
           headline = `At this rate, it takes ${breakEvenText} to pay off.`;
       } else {
           bigText = <span className="text-5xl md:text-7xl">Stick to the broom?</span>;
           headline = "This is a luxury, not an investment.";
       }
    }

    return { isLowRoi, breakEvenText, title, titleColor, bigText, headline };
  };

  const verdict = getVerdict();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none select-none">
        <h1 className="text-[20rem] font-black leading-none tracking-tighter">TIME</h1>
      </div>

      {/* Screen A: Input Form */}
      <main className="max-w-2xl w-full z-10 transition-all duration-700 ease-in-out flex-grow flex flex-col justify-center">
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

          {/* Dynamic Time Input with Sanity Check */}
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
                
                {/* Sanity Check Tooltip */}
                {timePerTask > 0 && timePerTask < 5 && (
                    <div className="absolute left-0 -bottom-8 text-xs text-amber-600 font-bold flex items-center gap-1 animate-pulse">
                        <i data-lucide="alert-circle" className="w-4 h-4"></i>
                        Only {timePerTask} min? You're a speed-cleaner!
                    </div>
                )}
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

      {/* Footer */}
      <footer className="w-full bg-slate-900 text-slate-400 py-12 px-6 z-20 mt-auto rounded-t-3xl md:rounded-t-[3rem] -mx-6 mb-[-1.5rem] md:mb-[-1.5rem] relative top-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-4">
                <div className="text-white font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="text-2xl">💸</span> Freedom ROI
                </div>
                <p className="leading-relaxed">
                    Privacy First: No tracking by default. All calculations happen locally on your device.
                </p>
                <button 
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-xs font-bold uppercase tracking-wider text-emerald-500 hover:text-emerald-400 transition-colors underline decoration-dotted underline-offset-4"
                >
                    Analytics Settings
                </button>
            </div>

            <div className="space-y-4 md:text-right">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Support</h4>
                <ul className="space-y-3">
                    <li>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 md:justify-end hover:text-white transition-colors">
                            <i data-lucide="linkedin" className="w-4 h-4"></i>
                            Connect on LinkedIn
                        </a>
                    </li>
                    <li>
                        <a href="https://buymeacoffee.com/happiefruit" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 md:justify-end hover:text-white transition-colors">
                            <i data-lucide="coffee" className="w-4 h-4 text-yellow-400"></i>
                            Buy a Coffee
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-600 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Freedom ROI Calculator
        </div>
      </footer>

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

          {results && verdict && (
            <div className="flex-1 pb-24">
              
              {/* Primary Headline with Conditional Logic */}
              <header className="mb-16 animate-fade-in-up">
                <span className={`text-xs font-black uppercase tracking-[0.3em] mb-2 block ${verdict.titleColor}`}>{verdict.title}</span>
                <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-4 break-words">
                  {verdict.bigText}
                </h2>
                <p className="text-2xl font-medium text-slate-500">{verdict.headline}</p>
              </header>

              {/* Secondary Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Financial Break-even</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900">{verdict.breakEvenText}</span>
                        {!verdict.breakEvenText.includes('Year') && <span className="text-xl font-bold text-slate-500">Months</span>}
                    </div>
                    {/* Only show progress bar if break even is reasonable */}
                    {!verdict.breakEvenText.includes('Year') && (
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, (12/results.breakEvenMonths)*100)}%` }}></div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">10-Year ROI</p>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-black ${results.lifetimeRoi < 0 ? 'text-rose-500' : 'text-slate-900'}`}>{results.lifetimeRoi.toFixed(0)}%</span>
                        <span className="text-xl font-bold text-slate-500">Return</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {results.lifetimeRoi > 0 
                            ? "Better than the S&P 500. A literal investment in your life."
                            : "Financial advice: Don't check your bank account."}
                    </p>
                </div>
              </div>

              {/* Comparisons */}
              <section className="border-t border-slate-100 pt-12 mb-16">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Visualization</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-6 rounded-2xl">
                        <i data-lucide="tv" className="mb-4 text-slate-900"></i>
                        <p className="text-3xl font-black mb-1">{formatMetric(results.comparisons.netflixSeries)}</p>
                        <p className="text-xs font-bold uppercase text-slate-400">Netflix Series</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl">
                        <i data-lucide="car" className="mb-4 text-slate-900"></i>
                        <p className="text-3xl font-black mb-1">{formatMetric(results.comparisons.carMiles)}</p>
                        <p className="text-xs font-bold uppercase text-slate-400">Miles Offset</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl">
                        <i data-lucide="zap" className="mb-4 text-slate-900"></i>
                        <p className="text-3xl font-black mb-1">{formatMetric(results.comparisons.bulbDays)}</p>
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
                    <i data-lucide="check-circle" className="w-[300px] h-[300px]"></i>
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
            <i data-lucide="copy" className="w-6 h-6"></i>
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-out group-hover:ml-2 font-bold">Copy Summary</span>
          </button>

        </div>
      </div>

      {/* Privacy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-[60] backdrop flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in-up">
                <button 
                  onClick={() => setIsPrivacyOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"
                >
                    <i data-lucide="x" className="w-6 h-6"></i>
                </button>
                
                <h2 className="text-2xl font-black tracking-tight mb-2">About Freedom ROI</h2>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    We believe in transparency. This calculator runs entirely in your browser. No personal financial data is sent to any server.
                </p>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="analytics-toggle" className="font-bold text-slate-900">Respectful Tracking</label>
                        
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input 
                                type="checkbox" 
                                name="toggle" 
                                id="analytics-toggle" 
                                checked={analyticsEnabled}
                                onChange={(e) => toggleAnalytics(e.target.checked)}
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-slate-300 appearance-none cursor-pointer outline-none transition-all duration-300"
                            />
                            <label htmlFor="analytics-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer transition-colors duration-300"></label>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">
                        We use cookieless, anonymized analytics only if you say so. No personal data ever leaves your device.
                    </p>
                </div>
                
                <div className="mt-6 text-center">
                    <a href="https://buymeacoffee.com/happiefruit" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-600 uppercase tracking-widest hover:underline">
                        Support Development
                    </a>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;