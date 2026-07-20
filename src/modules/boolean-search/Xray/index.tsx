import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { useBooleanState } from '../Hooks/useBooleanState';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../Components';

interface XrayPlatform {
  id: string;
  name: string;
  domain: string;
  description: string;
  avatarIcon: string;
}

const XRAY_PLATFORMS: XrayPlatform[] = [
  { id: 'linkedin', name: 'LinkedIn', domain: 'site:linkedin.com/in OR site:linkedin.com/pub/dir', description: 'Search public profiles on LinkedIn.', avatarIcon: 'Linkedin' },
  { id: 'github', name: 'GitHub', domain: 'site:github.com', description: 'Search active developer repositories and users.', avatarIcon: 'Github' },
  { id: 'stackoverflow', name: 'Stack Overflow', domain: 'site:stackoverflow.com/users', description: 'Find technical users answering code issues.', avatarIcon: 'Terminal' },
  { id: 'naukri', name: 'Naukri', domain: 'site:naukri.com', description: 'Source professional CVs on India\'s leading portal.', avatarIcon: 'FileText' },
  { id: 'indeed', name: 'Indeed', domain: 'site:indeed.com/r OR site:indeed.com/me', description: 'Search active candidate resumes on Indeed.', avatarIcon: 'SearchCode' },
  { id: 'dice', name: 'Dice', domain: 'site:dice.com/profiles', description: 'Sourcing tech and engineer resumes on Dice.', avatarIcon: 'Briefcase' },
  { id: 'monster', name: 'Monster', domain: 'site:monster.com/resumes', description: 'Search uploaded resumes on Monster.', avatarIcon: 'FileSignature' },
  { id: 'wellfound', name: 'Wellfound', domain: 'site:wellfound.com', description: 'Find startup developers, PMs, and designers.', avatarIcon: 'Heart' }
];

export const XrayPage: React.FC = () => {
  const { addToHistory, saveSearch } = useBooleanState();

  // Inputs
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [excludes, setExcludes] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('linkedin');

  // Copy/Save States
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');

  // Helper to wrap phrases in quotes
  const formatPhrase = (val: string): string => {
    const trimmed = val.trim();
    if (!trimmed) return '';
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith('\'') && trimmed.endsWith('\''))) {
      return trimmed;
    }
    if (trimmed.includes(' ') || trimmed.includes('+') || trimmed.includes('#') || trimmed.includes('/') || trimmed.includes('-')) {
      return `"${trimmed}"`;
    }
    return trimmed;
  };

  const parseToClause = (input: string, joinOp: 'AND' | 'OR'): string => {
    if (!input.trim()) return '';
    const uppercase = input.toUpperCase();
    if (uppercase.includes(' AND ') || uppercase.includes(' OR ') || uppercase.includes(' NOT ')) {
      return input.trim();
    }
    const terms = input.split(/[,;|]+/).map(t => formatPhrase(t)).filter(Boolean);
    if (terms.length === 0) return '';
    if (terms.length === 1) return terms[0];
    return `(${terms.join(` ${joinOp} `)})`;
  };

  // Google X-Ray query formula
  const generatedXrayQuery = useMemo(() => {
    const platformObj = XRAY_PLATFORMS.find(p => p.id === selectedPlatform);
    if (!platformObj) return '';

    const parts: string[] = [platformObj.domain];
    
    const titlePart = parseToClause(jobTitle, 'OR');
    if (titlePart) parts.push(titlePart);

    const skillsPart = parseToClause(skills, 'AND');
    if (skillsPart) parts.push(skillsPart);

    const locPart = parseToClause(location, 'OR');
    if (locPart) parts.push(locPart);

    let query = parts.join(' AND ');

    // Excludes
    const excludePart = parseToClause(excludes, 'OR');
    if (excludePart) {
      query = `${query} NOT ${excludePart}`;
    }

    // GitHub suffix helper for user finding
    if (selectedPlatform === 'github' && (jobTitle || skills)) {
      query = `${query} "joined on"`;
    }

    return query;
  }, [jobTitle, skills, location, excludes, selectedPlatform]);

  const handleCopy = () => {
    if (!generatedXrayQuery) return;
    navigator.clipboard.writeText(generatedXrayQuery);
    setCopied(true);
    addToHistory(generatedXrayQuery, 'google', `X-Ray: ${jobTitle || 'General'}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenSearch = () => {
    if (!generatedXrayQuery) return;
    addToHistory(generatedXrayQuery, 'google', `X-Ray: ${jobTitle || 'General'}`);
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(generatedXrayQuery)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSaveToRecords = () => {
    if (!generatedXrayQuery) return;
    const label = saveTitle || `${jobTitle || 'X-Ray'} Sourcing Blueprint`;
    saveSearch(label, generatedXrayQuery, 'google', ['X-RAY', selectedPlatform.toUpperCase()]);
    setIsSaved(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-indigo-200/20 flex items-center gap-1.5">
            <Lucide.Globe className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            X-Ray Sourcing
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white font-display">
          Google X-Ray Builder
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-0.5 leading-relaxed">
          Bypass standard subscription limits. Leverage Google site operators to search public candidate profiles across top recruiter sites instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Platform + Inputs */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="border-gray-200 dark:border-gray-800 shadow-xs">
            <CardHeader className="py-4 border-b border-gray-150 dark:border-gray-850">
              <div className="flex items-center gap-2">
                <Lucide.SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                <CardTitle className="text-sm">Filter & Target Platform</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              {/* Platform selector grid */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                  Select Candidate Index Site
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {XRAY_PLATFORMS.map((plat) => {
                    const isSelected = selectedPlatform === plat.id;
                    return (
                      <button
                        key={plat.id}
                        type="button"
                        onClick={() => setSelectedPlatform(plat.id)}
                        className={`p-3 border rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer focus:outline-none ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 font-extrabold shadow-xs'
                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-750 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {plat.id === 'linkedin' && <Lucide.Globe className="w-4 h-4" />}
                        {plat.id === 'github' && <Lucide.Code2 className="w-4 h-4" />}
                        {plat.id === 'stackoverflow' && <Lucide.Terminal className="w-4 h-4" />}
                        {plat.id === 'naukri' && <Lucide.Layers className="w-4 h-4" />}
                        {plat.id === 'indeed' && <Lucide.SearchCode className="w-4 h-4" />}
                        {plat.id === 'dice' && <Lucide.Briefcase className="w-4 h-4" />}
                        {plat.id === 'monster' && <Lucide.FileSignature className="w-4 h-4" />}
                        {plat.id === 'wellfound' && <Lucide.Heart className="w-4 h-4" />}
                        <span className="text-[10px] truncate w-full">{plat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Job Titles */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                  Job Title Keyword <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => { setJobTitle(e.target.value); setIsSaved(false); }}
                  placeholder="e.g. Java Developer, Software Engineer"
                  className="w-full px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                  Skills (Required AND keywords)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => { setSkills(e.target.value); setIsSaved(false); }}
                  placeholder="e.g. React, TypeScript, GraphQL"
                  className="w-full px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                    Locations
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setIsSaved(false); }}
                    placeholder="e.g. San Francisco, Remote, London"
                    className="w-full px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono text-red-400">
                    Excludes
                  </label>
                  <input
                    type="text"
                    value={excludes}
                    onChange={(e) => { setExcludes(e.target.value); setIsSaved(false); }}
                    placeholder="e.g. Intern, Agency, Course"
                    className="w-full px-4 py-2 text-xs font-semibold rounded-xl border border-red-200 dark:border-red-900/30 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Preview + Open URL actions */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-gray-200 dark:border-gray-800 shadow-xs h-full flex flex-col justify-between">
            <div>
              <CardHeader className="py-4 border-b border-gray-150 dark:border-gray-850">
                <div className="flex items-center gap-2">
                  <Lucide.SearchCode className="w-4 h-4 text-indigo-500" />
                  <CardTitle className="text-sm">Synthesized Google Query</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                {generatedXrayQuery ? (
                  <div className="w-full h-52 p-4 bg-slate-950 border border-slate-900 rounded-2xl text-xs font-mono break-all leading-relaxed text-emerald-400 select-all overflow-y-auto shadow-inner">
                    {generatedXrayQuery}
                  </div>
                ) : (
                  <div className="w-full h-52 border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 rounded-2xl flex flex-col items-center justify-center text-center p-6">
                    <Lucide.Globe className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-2" />
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500">Formulate X-Ray Search</p>
                    <p className="text-[10px] text-gray-400/80 mt-1 max-w-xs leading-normal">Enter job keyword on the left to instantly build a Google-optimized search string.</p>
                  </div>
                )}

                {generatedXrayQuery && (
                  <div className="flex items-center gap-2 p-2.5 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/30 rounded-xl text-[10px] text-gray-500 dark:text-gray-400 leading-normal">
                    <Lucide.Info className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Uses specific Google logic: <strong>site:</strong> scopes the targeted index while logical operators filter matching titles.</span>
                  </div>
                )}
              </CardContent>
            </div>

            {generatedXrayQuery && (
              <CardContent className="pt-0 pb-5 space-y-4">
                {/* Save parameters */}
                <div className="flex items-center gap-3 border-t border-gray-150 dark:border-gray-850 pt-4">
                  <input
                    type="text"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    placeholder="Enter search label..."
                    className="flex-1 text-xs bg-white dark:bg-gray-950 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                  />
                  <Button
                    variant={isSaved ? 'accent' : 'outline'}
                    size="sm"
                    onClick={handleSaveToRecords}
                    disabled={isSaved}
                    className="font-bold shrink-0 h-9"
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                </div>

                {/* Primary Copy / Open actions */}
                <div className="grid grid-cols-2 gap-3.5">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleCopy}
                    className="font-bold py-2.5 h-10 w-full flex items-center justify-center gap-1.5 focus:outline-none"
                  >
                    {copied ? (
                      <>
                        <Lucide.Check className="w-4 h-4 text-emerald-500 animate-bounce" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Lucide.Copy className="w-4 h-4" />
                        <span>Copy Query</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleOpenSearch}
                    className="font-bold py-2.5 h-10 bg-indigo-600 hover:bg-indigo-700 text-white w-full flex items-center justify-center gap-1.5 focus:outline-none"
                  >
                    <Lucide.Search className="w-4 h-4" />
                    <span>Search Google</span>
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
