import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { useBooleanState } from '../Hooks/useBooleanState';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../Components';
import { AutocompleteInput } from '../Components/AutocompleteInput';
import { booleanEngine } from '../engines/BooleanEngine';
import { validationEngine } from '../engines/ValidationEngine';
import { exportEngine } from '../engines/ExportEngine';
import { platformEngine } from '../engines/PlatformEngine';
import { AccioJDParserComponent } from '../Components/AccioJDParserComponent';

export const NewSearchPage: React.FC = () => {
  const { addToHistory, saveSearch } = useBooleanState();

  // 1. STATE BINDING - FORM INPUTS
  const [jobTitle, setJobTitle] = useState('');
  const [alternativeTitles, setAlternativeTitles] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [optionalSkills, setOptionalSkills] = useState('');

  // Tab state for Manual Form vs Paste JD Parser
  const [activeInputTab, setActiveInputTab] = useState<'manual' | 'jd'>('manual');

  
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const [experience, setExperience] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [pastCompany, setPastCompany] = useState('');
  const [industry, setIndustry] = useState('');

  const [degree, setDegree] = useState('');
  const [certification, setCertification] = useState('');

  const [employmentType, setEmploymentType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [language, setLanguage] = useState('');

  const [excludeTitles, setExcludeTitles] = useState('');
  const [excludeCompanies, setExcludeCompanies] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');

  // 2. CONFIG STATE
  const [platform, setPlatform] = useState<string>('linkedin');
  const [saveLabel, setSaveLabel] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // 3. GENERATION ENGINE (REAL-TIME DETERMINISTIC)
  const baseQuery = useMemo(() => {
    return booleanEngine.generateQuery({
      jobTitle,
      alternativeTitles,
      requiredSkills,
      optionalSkills,
      location,
      country,
      state,
      city,
      experience,
      currentCompany,
      pastCompany,
      industry,
      degree,
      certification,
      employmentType,
      workMode,
      language,
      excludeTitles,
      excludeCompanies,
      excludeKeywords,
      platform
    });
  }, [
    jobTitle, alternativeTitles, requiredSkills, optionalSkills,
    location, country, state, city, experience, currentCompany,
    pastCompany, industry, degree, certification, employmentType,
    workMode, language, excludeTitles, excludeCompanies, excludeKeywords,
    platform
  ]);

  // Wrapped platform search string
  const finalQuery = useMemo(() => {
    return platformEngine.buildQuery(platform, baseQuery);
  }, [platform, baseQuery]);

  // Real-time Static Code Validation & Quality Score
  const validation = useMemo(() => {
    return validationEngine.validate(finalQuery);
  }, [finalQuery]);

  // Counts
  const stats = useMemo(() => {
    if (!finalQuery) return { chars: 0, words: 0, ands: 0, ors: 0, nots: 0, parensOpen: 0, parensClose: 0 };
    const words = finalQuery.split(/\s+/).filter(Boolean);
    const ands = (finalQuery.match(/\bAND\b/g) || []).length;
    const ors = (finalQuery.match(/\bOR\b/g) || []).length;
    const nots = (finalQuery.match(/\bNOT\b/g) || []).length;
    const parensOpen = (finalQuery.match(/\(/g) || []).length;
    const parensClose = (finalQuery.match(/\)/g) || []).length;
    return {
      chars: finalQuery.length,
      words: words.length,
      ands,
      ors,
      nots,
      parensOpen,
      parensClose
    };
  }, [finalQuery]);

  // Auto-fill Sourcing label
  useEffect(() => {
    if (jobTitle) {
      const primaryTitle = jobTitle.split(',')[0].trim();
      setSaveLabel(`${primaryTitle} Campaign`);
    } else {
      setSaveLabel('');
    }
  }, [jobTitle]);

  // Handle action triggers
  const handleCopy = async (formatted = false) => {
    if (!finalQuery) return;
    const targetText = formatted ? exportEngine.formatBooleanQuery(finalQuery) : finalQuery;
    const success = await exportEngine.copyToClipboard(targetText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToHistory(finalQuery, platform, jobTitle ? `${jobTitle.split(',')[0].trim()}` : 'Boolean Query');
    }
  };

  const handleExportTXT = () => {
    if (!finalQuery) return;
    const desc = `Sourcing targets for ${jobTitle || 'Custom Search'}. Required skills: ${requiredSkills || 'None'}`;
    exportEngine.exportToTXT('boolean-query', finalQuery, platformEngine.getPlatformName(platform), desc);
    addToHistory(finalQuery, platform, jobTitle ? `${jobTitle.split(',')[0].trim()}` : 'Boolean Query');
  };

  const handleExportJSON = () => {
    if (!finalQuery) return;
    exportEngine.exportToJSON('boolean-search-config', {
      timestamp: new Date().toISOString(),
      platform,
      query: finalQuery,
      parameters: {
        jobTitle, alternativeTitles, requiredSkills, optionalSkills,
        location, country, state, city, experience, currentCompany,
        pastCompany, industry, degree, certification, employmentType,
        workMode, language, excludeTitles, excludeCompanies, excludeKeywords
      }
    });
  };

  const handleExportCSV = () => {
    if (!finalQuery) return;
    exportEngine.exportToCSV('boolean-search-report', 
      ['Field', 'Value'],
      [
        ['Platform', platformEngine.getPlatformName(platform)],
        ['Query String', finalQuery],
        ['Job Title', jobTitle],
        ['Required Skills', requiredSkills],
        ['Location', location],
        ['Exclusions', excludeKeywords]
      ]
    );
  };

  const handleSaveToRecords = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalQuery) return;
    const label = saveLabel.trim() || 'Custom Boolean Campaign';
    const tags = ['Rule-Based', platform.toUpperCase()];
    if (location) tags.push('Geographic');
    if (requiredSkills) tags.push('Skills');

    saveSearch(label, finalQuery, platform, tags);
    setIsSaved(true);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleClearForm = () => {
    setJobTitle('');
    setAlternativeTitles('');
    setRequiredSkills('');
    setOptionalSkills('');
    setLocation('');
    setCountry('');
    setState('');
    setCity('');
    setExperience('');
    setCurrentCompany('');
    setPastCompany('');
    setIndustry('');
    setDegree('');
    setCertification('');
    setEmploymentType('');
    setWorkMode('');
    setLanguage('');
    setExcludeTitles('');
    setExcludeCompanies('');
    setExcludeKeywords('');
    setIsSaved(false);
  };

  const handleLoadSample = (sample: any) => {
    setJobTitle(sample.title);
    setRequiredSkills(sample.skills);
    setLocation(sample.location);
    setExcludeKeywords(sample.excludes);
  };

  // Get X-Ray search engines links
  const searchUrls = useMemo(() => {
    return platformEngine.generateSearchUrls(finalQuery);
  }, [finalQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Dynamic Toast Success banner */}
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4.5 py-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-xl shadow-lg"
          >
            <Lucide.CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div className="text-xs font-semibold">Saved successfully to your Sourcing Records!</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-indigo-200/20 flex items-center gap-1.5">
              <Lucide.SlidersHorizontal className="w-3 h-3 text-indigo-600" />
              Sourcing Workspace
            </span>
            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-emerald-200/20">
              Deterministic 2.0 (No-AI)
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white font-display">
            Professional Boolean Search Generator
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-2xl mt-0.5 leading-relaxed">
            Assembles syntactically bulletproof, recruiter-grade Boolean strings. Programmatically resolves synonyms, balances quotation scopes, and builds platform-optimized wrappers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            icon="RotateCcw"
            onClick={handleClearForm}
            className="text-xs font-bold"
          >
            Reset Builder
          </Button>
        </div>
      </div>

      {/* Three-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= COLUMN 1: INPUT FORM (5/12 width) ================= */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-gray-200 dark:border-gray-800 shadow-xs">
            <CardHeader className="py-4 border-b border-gray-150 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/10">
              <div className="flex items-center gap-2">
                <Lucide.Sliders className="w-4 h-4 text-indigo-600" />
                <CardTitle className="text-xs uppercase tracking-wider font-mono text-gray-500">Sourcing Parameters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 max-h-[750px] overflow-y-auto pt-5 scrollbar-thin">
              
              {/* Tab Selector: Manual Form vs Paste JD Parser */}
              <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-850">
                <button
                  type="button"
                  onClick={() => setActiveInputTab('manual')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer focus:outline-none ${
                    activeInputTab === 'manual'
                      ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-gray-200/50 dark:border-gray-850/50'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Lucide.Sliders className="w-4 h-4" />
                  Manual Form
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInputTab('jd')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer focus:outline-none ${
                    activeInputTab === 'jd'
                      ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-gray-200/50 dark:border-gray-850/50'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Lucide.FileText className="w-4 h-4" />
                  Paste JD Parser
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                    FREE
                  </span>
                </button>
              </div>

              {activeInputTab === 'jd' ? (
                <AccioJDParserComponent
                  onAutoFillForm={(title, req, opt) => {
                    if (title) setJobTitle(title);
                    if (req.length) setRequiredSkills(req.join(', '));
                    if (opt.length) setOptionalSkills(opt.join(', '));
                  }}
                />
              ) : (
                <>
                  {/* Section 1: Job & Titles Discovery */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-850 pb-2">
                      <Lucide.Briefcase className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Role Target Discovery</span>
                    </div>
                    
                    <AutocompleteInput
                      value={jobTitle}
                      onChange={setJobTitle}
                      type="roles"
                      label="Primary Job Title"
                      placeholder="e.g. Software Engineer, Frontend Developer"
                      icon="Briefcase"
                      required
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                        Alternative Titles (Synonyms)
                      </label>
                      <input
                        type="text"
                        value={alternativeTitles}
                        onChange={(e) => setAlternativeTitles(e.target.value)}
                        placeholder="e.g. Web Developer, UI Engineer, React Developer"
                        className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-all py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                      />
                      <span className="text-[9px] text-gray-400 leading-normal">
                        Tip: Separate with commas. We automatically quote multi-word titles for you.
                      </span>
                    </div>
                  </div>

              {/* Section 2: Skills & Technologies */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-850 pb-2">
                  <Lucide.Cpu className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Skills & Technologies</span>
                </div>

                <AutocompleteInput
                  value={requiredSkills}
                  onChange={setRequiredSkills}
                  type="skills"
                  label="Required Skills / Core Tech"
                  placeholder="e.g. React, TypeScript, GraphQL"
                  icon="CheckSquare"
                />

                <AutocompleteInput
                  value={optionalSkills}
                  onChange={setOptionalSkills}
                  type="skills"
                  label="Optional Skills / Preferred Tech"
                  placeholder="e.g. AWS, Docker, Kubernetes"
                  icon="PlusCircle"
                />
              </div>

              {/* Section 3: Geographic Scope */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-850 pb-2">
                  <Lucide.MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Geographic Targeting</span>
                </div>

                <AutocompleteInput
                  value={location}
                  onChange={setLocation}
                  type="locations"
                  label="Primary Location Area"
                  placeholder="e.g. London, San Francisco"
                  icon="MapPin"
                />

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Paris"
                      className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2 px-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. CA"
                      className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2 px-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. France"
                      className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2 px-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Professional Profile */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-850 pb-2">
                  <Lucide.Building className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Professional Background</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">Seniority / Years Experience</label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. Senior, Lead, 5+ years"
                    className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2.5 px-3 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <AutocompleteInput
                    value={currentCompany}
                    onChange={setCurrentCompany}
                    type="companies"
                    label="Current Company"
                    placeholder="e.g. Stripe, OpenAI"
                    icon="Building2"
                  />
                  <AutocompleteInput
                    value={pastCompany}
                    onChange={setPastCompany}
                    type="companies"
                    label="Past Company"
                    placeholder="e.g. Google, Meta"
                    icon="History"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">Target Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Fintech, SaaS, Healthcare"
                    className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2.5 px-3 focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 5: Education & Credentials */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-850 pb-2">
                  <Lucide.GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Education & Credentials</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">Degree Required</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. Bachelor, BS, MS, PhD"
                    className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2.5 px-3 focus:outline-none"
                  />
                </div>

                <AutocompleteInput
                  value={certification}
                  onChange={setCertification}
                  type="certifications"
                  label="Professional Certifications"
                  placeholder="e.g. AWS Solutions Architect, PMP, CISSP"
                  icon="Award"
                />
              </div>

              {/* Section 6: Logistics */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-850 pb-2">
                  <Lucide.Globe2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Logistics & Communication</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">Work Mode</label>
                    <input
                      type="text"
                      value={workMode}
                      onChange={(e) => setWorkMode(e.target.value)}
                      placeholder="e.g. Remote, Hybrid, WFH"
                      className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2 px-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">Employment Type</label>
                    <input
                      type="text"
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      placeholder="e.g. Full-time, Contract, W2"
                      className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2 px-2.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">Languages</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="e.g. English, French, Spanish"
                    className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2.5 px-3 focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 7: Sourcing Exclusions */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-gray-850 pb-2">
                  <Lucide.MinusCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Exclusion Mapping</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-red-400 dark:text-red-500/80 uppercase tracking-wider font-mono">Exclude Titles</label>
                  <input
                    type="text"
                    value={excludeTitles}
                    onChange={(e) => setExcludeTitles(e.target.value)}
                    placeholder="e.g. Intern, Trainee, Coordinator"
                    className="w-full text-xs font-semibold rounded-xl border border-red-200 dark:border-red-900/30 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2.5 px-3 focus:outline-none focus:border-red-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-red-400 dark:text-red-500/80 uppercase tracking-wider font-mono">Exclude Companies</label>
                  <input
                    type="text"
                    value={excludeCompanies}
                    onChange={(e) => setExcludeCompanies(e.target.value)}
                    placeholder="e.g. Agency, Contract, Freelance"
                    className="w-full text-xs font-semibold rounded-xl border border-red-200 dark:border-red-900/30 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2.5 px-3 focus:outline-none focus:border-red-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-red-400 dark:text-red-500/80 uppercase tracking-wider font-mono">Exclude Keywords</label>
                  <input
                    type="text"
                    value={excludeKeywords}
                    onChange={(e) => setExcludeKeywords(e.target.value)}
                    placeholder="e.g. Part-time, Temporary"
                    className="w-full text-xs font-semibold rounded-xl border border-red-200 dark:border-red-900/30 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2.5 px-3 focus:outline-none focus:border-red-400"
                  />
                </div>
              </div>
            </>
          )}

            </CardContent>
          </Card>

          {/* Quick Sandbox Templates */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block">Fast Templates (Local Sandbox)</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Cloud Tech Lead', title: 'Solutions Architect, Cloud Lead', skills: 'AWS, Terraform, Kubernetes', location: 'London', excludes: 'Intern' },
                { label: 'Quant Dev', title: 'Quantitative Developer, C++ Developer', skills: 'C++, Python, CUDA', location: 'New York', excludes: 'Junior' },
                { label: 'AI Engineer', title: 'Machine Learning Engineer, ML Dev', skills: 'PyTorch, Python, Hugging Face', location: 'Remote', excludes: 'Support' }
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(sample)}
                  className="px-3 py-2 text-left border border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-900 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/10 rounded-xl transition-all cursor-pointer"
                >
                  <div className="font-bold text-[10px] text-gray-800 dark:text-gray-200 truncate">{sample.label}</div>
                  <div className="text-[8px] text-gray-400 truncate mt-0.5">{sample.skills}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2: LIVE PREVIEW (4/12 width) ================= */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-gray-200 dark:border-gray-800 shadow-xs h-full flex flex-col">
            <CardHeader className="py-4 border-b border-gray-150 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lucide.Terminal className="w-4 h-4 text-emerald-500" />
                <CardTitle className="text-xs uppercase tracking-wider font-mono text-gray-500">Live Query Preview</CardTitle>
              </div>
              <span className="text-[10px] text-emerald-500 font-bold font-mono">Live Sync</span>
            </CardHeader>
            <CardContent className="pt-5 flex-1 flex flex-col justify-between space-y-6">
              
              {/* Boolean Preview Box */}
              <div className="flex-1 flex flex-col">
                {finalQuery ? (
                  <div className="relative group w-full flex-1 min-h-[260px] max-h-[380px] p-4 bg-slate-950 border border-slate-900 rounded-2xl text-[11px] font-mono break-all leading-relaxed text-emerald-400 select-all overflow-y-auto font-semibold shadow-inner">
                    {finalQuery}
                  </div>
                ) : (
                  <div className="w-full min-h-[260px] border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 rounded-2xl flex flex-col items-center justify-center text-center p-6 flex-1">
                    <Lucide.SearchCode className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-2.5" />
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500">Workspace Pending Input</p>
                    <p className="text-[10px] text-gray-400/80 dark:text-gray-500/80 max-w-xs mt-1 leading-normal">
                      Provide a Primary Job Title on the left parameters card to compile and display the Boolean string.
                    </p>
                  </div>
                )}
              </div>

              {/* Live Quality Metrics */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-gray-50 dark:bg-gray-950/40 border border-gray-150 dark:border-gray-850 rounded-xl text-center">
                  <div className="text-[9px] font-bold text-gray-400 uppercase font-mono">Chars</div>
                  <div className="text-sm font-bold font-display text-gray-800 dark:text-gray-200 mt-0.5">{stats.chars}</div>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-gray-950/40 border border-gray-150 dark:border-gray-850 rounded-xl text-center">
                  <div className="text-[9px] font-bold text-gray-400 uppercase font-mono">ANDs</div>
                  <div className="text-sm font-bold font-display text-indigo-600 dark:text-indigo-400 mt-0.5">{stats.ands}</div>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-gray-950/40 border border-gray-150 dark:border-gray-850 rounded-xl text-center">
                  <div className="text-[9px] font-bold text-gray-400 uppercase font-mono">ORs</div>
                  <div className="text-sm font-bold font-display text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.ors}</div>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-gray-950/40 border border-gray-150 dark:border-gray-850 rounded-xl text-center">
                  <div className="text-[9px] font-bold text-gray-400 uppercase font-mono">Parens</div>
                  <div className={`text-[11px] font-bold mt-1.5 ${stats.parensOpen === stats.parensClose ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stats.parensOpen === stats.parensClose ? 'Match' : `${stats.parensOpen} / ${stats.parensClose}`}
                  </div>
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={!finalQuery}
                    onClick={() => handleCopy(false)}
                    className={`py-3 px-4.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none ${
                      !finalQuery 
                        ? 'bg-gray-100 dark:bg-gray-900 text-gray-400 cursor-not-allowed'
                        : copied 
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                    }`}
                  >
                    {copied ? <Lucide.Check className="w-4 h-4" /> : <Lucide.Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied Plain!' : 'Copy Plain'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={!finalQuery}
                    onClick={() => handleCopy(true)}
                    className="py-3 px-4.5 rounded-xl font-bold text-xs border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-all cursor-pointer focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Lucide.Code2 className="w-4 h-4 text-indigo-500" />
                    <span>Copy Formatted</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    disabled={!finalQuery}
                    onClick={handleExportTXT}
                    className="py-2.5 text-[10px] font-bold border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <Lucide.FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>TXT</span>
                  </button>
                  <button
                    type="button"
                    disabled={!finalQuery}
                    onClick={handleExportCSV}
                    className="py-2.5 text-[10px] font-bold border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <Lucide.Table2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>CSV</span>
                  </button>
                  <button
                    type="button"
                    disabled={!finalQuery}
                    onClick={handleExportJSON}
                    className="py-2.5 text-[10px] font-bold border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <Lucide.FileJson className="w-3.5 h-3.5 text-purple-500" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>

              {/* Save Campaign Form */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-850 space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block">Save Sourcing Record</span>
                <form onSubmit={handleSaveToRecords} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={saveLabel}
                    onChange={(e) => setSaveLabel(e.target.value)}
                    placeholder="Sourcing Campaign Name"
                    className="flex-1 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-2 px-3 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!finalQuery}
                    className="py-2 px-4.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs disabled:opacity-45 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    Save
                  </button>
                </form>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ================= COLUMN 3: QUALITY & PLATFORMS (3/12 width) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Circular Quality Gauge & Dynamic Analysis */}
          <Card className="border-gray-200 dark:border-gray-800 shadow-xs">
            <CardHeader className="py-4 border-b border-gray-150 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/10">
              <div className="flex items-center gap-2">
                <Lucide.Activity className="w-4 h-4 text-purple-600" />
                <CardTitle className="text-xs uppercase tracking-wider font-mono text-gray-500">Quality Checklist</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-5 text-center">
              
              {/* Gauge Score */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    className="stroke-gray-100 dark:stroke-gray-850 fill-none"
                    strokeWidth="8"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    className="fill-none transition-all duration-500"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 46}`}
                    strokeDashoffset={`${2 * Math.PI * 46 * (1 - validation.score / 100)}`}
                    strokeLinecap="round"
                    stroke={
                      validation.score >= 85 ? '#059669' :
                      validation.score >= 60 ? '#d97706' : '#dc2626'
                    }
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-gray-900 dark:text-white font-display leading-none">{validation.score}</span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase mt-1">Score</span>
                </div>
              </div>

              {/* Feedback messages */}
              <div className="text-left space-y-2.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                {validation.errors.length > 0 ? (
                  validation.errors.map((err, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-[10px] flex gap-2 items-start
                        ${err.type === 'error'
                          ? 'bg-red-50/60 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-300'
                          : 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-200/50 dark:border-amber-900/20 text-amber-800 dark:text-amber-300'
                        }
                      `}
                    >
                      {err.type === 'error' ? (
                        <Lucide.AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      ) : (
                        <Lucide.AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold">{err.message}</div>
                        {err.suggestion && <div className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{err.suggestion}</div>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-emerald-50/55 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950 rounded-xl text-center text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold flex items-center justify-center gap-1.5">
                    <Lucide.CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Syntax is fully correct and ready!</span>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Target Platforms selector & launchers */}
          <Card className="border-gray-200 dark:border-gray-800 shadow-xs">
            <CardHeader className="py-4 border-b border-gray-150 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/10">
              <div className="flex items-center gap-2">
                <Lucide.Compass className="w-4 h-4 text-emerald-600" />
                <CardTitle className="text-xs uppercase tracking-wider font-mono text-gray-500">Search Engine Target</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              
              {/* Platform dropdown selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">Platform Wrapper</label>
                <div className="relative">
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full text-xs font-semibold py-2.5 pl-3.5 pr-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="linkedin_recruiter">LinkedIn Recruiter</option>
                    <option value="google">Google X-Ray (LinkedIn)</option>
                    <option value="github">GitHub X-Ray</option>
                    <option value="gitlab">GitLab X-Ray</option>
                    <option value="stackoverflow">Stack Overflow X-Ray</option>
                    <option value="naukri">Naukri Resume X-Ray</option>
                    <option value="indeed">Indeed Resume X-Ray</option>
                    <option value="monster">Monster Profile X-Ray</option>
                    <option value="dice">Dice Profiles X-Ray</option>
                    <option value="wellfound">Wellfound X-Ray</option>
                    <option value="x_twitter">X (Twitter) Bios X-Ray</option>
                  </select>
                  <Lucide.ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Platform specific footprints explanation */}
              <div className="p-3 bg-gray-50 dark:bg-gray-950/40 border border-gray-150 dark:border-gray-850 rounded-xl text-[10px] leading-relaxed text-gray-500 dark:text-gray-400">
                <div className="font-bold text-gray-700 dark:text-gray-300 mb-0.5">Platform Rule:</div>
                {platform === 'linkedin' && 'Optimized to fit under LinkedIn\'s strict 15-term limit for standard search boxes (using core Title & 1 core Skill) to prevent "No results found" errors. Locations and other parameters should be set via LinkedIn\'s native filters.'}
                {platform === 'linkedin_recruiter' && 'Optimized for Recruiter seat. Ideal for complex multi-operator brackets.'}
                {platform === 'google' && 'LinkedIn X-Ray target. Filters indexed public profile scopes with prefix: "site:linkedin.com/in/".'}
                {platform === 'github' && 'GitHub developer profile crawler. site:github.com "joined on" ...'}
                {platform === 'gitlab' && 'GitLab profile search wrapper. site:gitlab.com ...'}
                {platform === 'stackoverflow' && 'Stack Overflow developer users footprint. site:stackoverflow.com/users/ ...'}
                {platform === 'naukri' && 'Naukri Indian candidate profiles locator. site:resumes.naukri.com ...'}
                {platform === 'indeed' && 'Indeed public resumes site scope. site:indeed.com/r/ ...'}
                {platform === 'monster' && 'Monster public profiles crawler scope. site:monster.com/profile/ ...'}
                {platform === 'dice' && 'Dice Tech candidate profiles locator. site:dice.com/jobs/ ...'}
                {platform === 'wellfound' && 'Wellfound (AngelList) startups and developers. site:wellfound.com ...'}
                {platform === 'x_twitter' && 'X (Twitter) user profiles and bios crawler. site:x.com ...'}
              </div>

              {/* Live X-Ray Clickouts */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-850">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block">X-Ray Link Builder (1-Click Launch)</span>
                
                <div className="flex flex-col gap-2">
                  <a
                    href={searchUrls.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-between text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Lucide.Globe className="w-4 h-4 text-blue-500" />
                      <span>Search on Google</span>
                    </div>
                    <Lucide.ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>

                  <a
                    href={searchUrls.bing}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-between text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Lucide.Search className="w-4 h-4 text-sky-500" />
                      <span>Search on Bing</span>
                    </div>
                    <Lucide.ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>

                  <a
                    href={searchUrls.duckduckgo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-between text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Lucide.Compass className="w-4 h-4 text-orange-500" />
                      <span>Search on DuckDuckGo</span>
                    </div>
                    <Lucide.ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
};
