import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { useBooleanState } from '../Hooks/useBooleanState';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../Components';
import { generateTemplates } from './templatesData';

interface RoleTemplate {
  id: string;
  name: string;
  category: 'Engineering' | 'Operations' | 'Healthcare' | 'Business';
  skills: string[];
  description: string;
  queries: {
    linkedin: string;
    googleXray: string;
    raw: string;
  };
}

const COMMON_ROLE_TEMPLATES: RoleTemplate[] = generateTemplates();

export const TemplatesPage: React.FC = () => {
  const { addToHistory, saveSearch } = useBooleanState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<RoleTemplate | null>(COMMON_ROLE_TEMPLATES[0]);
  const [activeQueryType, setActiveQueryType] = useState<'linkedin' | 'googleXray' | 'raw'>('linkedin');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic filter lists
  const categories = ['All', 'Engineering', 'Business', 'Healthcare', 'Operations'];

  // Search filter
  const filteredRoles = useMemo(() => {
    return COMMON_ROLE_TEMPLATES.filter((role) => {
      const matchesCategory = selectedCategory === 'All' || role.category === selectedCategory;
      const matchesSearch =
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const activeQueryText = useMemo(() => {
    if (!selectedRole) return '';
    return selectedRole.queries[activeQueryType];
  }, [selectedRole, activeQueryType]);

  const handleCopy = () => {
    if (!activeQueryText || !selectedRole) return;
    navigator.clipboard.writeText(activeQueryText);
    setCopiedId(selectedRole.id);
    addToHistory(activeQueryText, activeQueryType, `Template: ${selectedRole.name}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenSearch = () => {
    if (!activeQueryText || !selectedRole) return;
    let searchUrl = '';
    if (activeQueryType === 'linkedin') {
      searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(activeQueryText)}`;
    } else {
      searchUrl = `https://www.google.com/search?q=${encodeURIComponent(activeQueryText)}`;
    }
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-indigo-200/20 flex items-center gap-1.5">
            <Lucide.Layers className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            Recruiter Library
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white font-display">
          Sourcing Role Blueprints
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-0.5 leading-relaxed">
          Search and preview modular Boolean configurations for 1,400+ industry-standard roles. Instantly copy or search.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Search list */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-gray-200 dark:border-gray-800 shadow-xs">
            {/* Search Input */}
            <div className="p-4 border-b border-gray-150 dark:border-gray-850 space-y-3">
              <div className="relative">
                <Lucide.Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search 1,400+ master roles or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>

              {/* Pill Filters */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer focus:outline-none ${
                      selectedCategory === cat
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-300'
                        : 'border-gray-200 text-gray-600 dark:border-gray-850 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-750'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Role List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-850 max-h-[440px] overflow-y-auto">
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role) => {
                  const isSelected = selectedRole?.id === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        setSelectedRole(role);
                      }}
                      className={`w-full p-3.5 text-left transition-all flex items-start gap-3 cursor-pointer focus:outline-none ${
                        isSelected
                          ? 'bg-indigo-50/20 dark:bg-indigo-950/10 border-l-4 border-indigo-500 pl-2.5'
                          : 'hover:bg-gray-50/50 dark:hover:bg-gray-900/40'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-850 text-gray-500 shrink-0">
                        <Lucide.Briefcase className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {role.name}
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-gray-100 dark:bg-gray-800 rounded-sm text-gray-500 uppercase tracking-wide">
                            {role.category}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {role.skills.slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-semibold bg-gray-50 dark:bg-gray-900/60 text-gray-500 dark:text-gray-400 px-1 rounded border border-gray-150/50 dark:border-gray-850"
                            >
                              {s}
                            </span>
                          ))}
                          {role.skills.length > 3 && (
                            <span className="text-[9px] font-semibold text-gray-400">+{role.skills.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-400 dark:text-gray-600">
                  <Lucide.Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold">No templates found</p>
                  <p className="text-[10px] text-gray-400/80 mt-0.5">Try searching different titles or skills.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Side: Preview & Queries */}
        <div className="lg:col-span-7">
          {selectedRole ? (
            <Card className="border-gray-200 dark:border-gray-800 shadow-xs h-full flex flex-col">
              <CardHeader className="py-4 border-b border-gray-150 dark:border-gray-850">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lucide.Sparkles className="w-4 h-4 text-indigo-500" />
                    <CardTitle className="text-sm">Blueprint: {selectedRole.name}</CardTitle>
                  </div>
                  <Badge variant="indigo" className="text-[10px] font-bold">Verified Query</Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-5 space-y-5 flex-1">
                {/* Description and Skills */}
                <div className="space-y-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans font-medium">
                    {selectedRole.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRole.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold rounded-lg border border-emerald-100 dark:border-emerald-900/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tab Queries Type Selector */}
                <div className="border-t border-gray-150 dark:border-gray-850 pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">
                      Query Format Selection
                    </span>
                    <div className="flex bg-gray-100 dark:bg-gray-900 p-0.5 rounded-lg border border-gray-200/50 dark:border-gray-800">
                      {[
                        { id: 'linkedin', label: 'LinkedIn' },
                        { id: 'googleXray', label: 'Google X-Ray' },
                        { id: 'raw', label: 'Raw General' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveQueryType(t.id as any)}
                          className={`px-3 py-1 text-[10px] font-extrabold rounded-md transition-all cursor-pointer focus:outline-none ${
                            activeQueryType === t.id
                              ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preloaded Query Block */}
                  <div className="relative">
                    <div className="w-full h-40 p-4 bg-slate-950 border border-slate-900 rounded-2xl text-xs font-mono break-all leading-relaxed text-emerald-400 select-all overflow-y-auto shadow-inner">
                      {activeQueryText}
                    </div>
                  </div>

                  {/* Core Action buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="font-bold py-2 h-9 flex items-center justify-center gap-1.5 focus:outline-none"
                    >
                      {copiedId === selectedRole.id ? (
                        <>
                          <Lucide.Check className="w-4 h-4 text-emerald-500 animate-bounce" />
                          <span className="text-emerald-500 font-extrabold">Copied Query!</span>
                        </>
                      ) : (
                        <>
                          <Lucide.Copy className="w-4 h-4" />
                          <span>Copy String</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleOpenSearch}
                      className="font-bold py-2 h-9 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 focus:outline-none"
                    >
                      <Lucide.ExternalLink className="w-4 h-4" />
                      <span>Open Search</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 rounded-2xl flex flex-col items-center justify-center text-center p-12 h-80">
              <Lucide.Briefcase className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-2" />
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500">Select a Role template</p>
              <p className="text-[10px] text-gray-400 mt-1">Choose any of the 1,400+ master configurations on the left to see queries.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
