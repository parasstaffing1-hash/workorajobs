import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useBooleanState } from '../Hooks/useBooleanState';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Search, Badge, Tag, Toast, Dropdown } from '../Components';
import * as Lucide from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const {
    searchHistory,
    toggleHistoryFavorite,
    deleteHistoryItem,
    clearHistory,
    savedSearches,
    saveSearch,
    deleteSavedSearch,
    addActivity
  } = useBooleanState();

  const [activeSubTab, setActiveSubTab] = useState<'history' | 'saved'>('history');
  const [toastMsg, setToastMsg] = useState('');
  
  // Custom Saved Search Creator states
  const [saveTitle, setSaveTitle] = useState('');
  const [saveQuery, setSaveQuery] = useState('');
  const [savePlatform, setSavePlatform] = useState('linkedin');
  const [saveTags, setSaveTags] = useState('');
  const [isCreatingSave, setIsCreatingSave] = useState(false);

  // Filters
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [searchVal, setSearchVal] = useState('');

  const platformOptions = [
    { value: 'all', label: 'All Platforms' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'google', label: 'Google X-Ray' },
    { value: 'dice', label: 'Dice' },
    { value: 'monster', label: 'Monster' },
    { value: 'careerbuilder', label: 'CareerBuilder' },
    { value: 'github', label: 'GitHub' },
    { value: 'stackoverflow', label: 'Stack Overflow' }
  ];

  // 1. Filtered Search History
  const filteredHistory = useMemo(() => {
    return searchHistory.filter(hist => {
      const matchesPlatform = filterPlatform === 'all' || hist.platform === filterPlatform;
      const matchesSearch = 
        hist.query.toLowerCase().includes(searchVal.toLowerCase()) ||
        (hist.label || '').toLowerCase().includes(searchVal.toLowerCase());
      return matchesPlatform && matchesSearch;
    });
  }, [searchHistory, filterPlatform, searchVal]);

  // 2. Filtered Saved Searches
  const filteredSaved = useMemo(() => {
    return savedSearches.filter(save => {
      const matchesPlatform = filterPlatform === 'all' || save.platform === filterPlatform;
      const matchesSearch = 
        save.title.toLowerCase().includes(searchVal.toLowerCase()) ||
        save.query.toLowerCase().includes(searchVal.toLowerCase()) ||
        save.tags.some(t => t.toLowerCase().includes(searchVal.toLowerCase()));
      return matchesPlatform && matchesSearch;
    });
  }, [savedSearches, filterPlatform, searchVal]);

  const handleCopy = (query: string, label: string) => {
    navigator.clipboard.writeText(query);
    setToastMsg('Query copied to clipboard!');
    addActivity('copy', `Copied string: ${label}`, query);
  };

  const handleSaveSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveTitle.trim() || !saveQuery.trim()) {
      setToastMsg('Please fill in title and query string!');
      return;
    }

    const tagsArray = saveTags.split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    saveSearch(saveTitle, saveQuery, savePlatform, tagsArray);
    setToastMsg('Sourcing query saved successfully!');
    
    // Reset form
    setSaveTitle('');
    setSaveQuery('');
    setSavePlatform('linkedin');
    setSaveTags('');
    setIsCreatingSave(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-950 dark:text-white">
            Sourcing Records & Saved Vault
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Access, organize, and filter generated sourcing string history logs and saved custom configurations.
          </p>
        </div>

        {activeSubTab === 'saved' && (
          <Button
            variant="primary"
            icon="Plus"
            className="text-xs font-bold shrink-0"
            onClick={() => setIsCreatingSave(!isCreatingSave)}
          >
            {isCreatingSave ? 'Close Form' : 'Save New Query'}
          </Button>
        )}
      </div>

      {/* Creator Form block (collapsible) */}
      {activeSubTab === 'saved' && isCreatingSave && (
        <Card className="border-indigo-150 dark:border-indigo-900 bg-indigo-50/5">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Lucide.Bookmark className="w-4.5 h-4.5 text-indigo-500" />
              Save Custom Boolean Query
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveSearchSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Query Reference Label/Title"
                  placeholder="e.g. Senior Backend - London"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  icon="Tag"
                />
                <Dropdown
                  label="Target platform"
                  options={[
                    { value: 'linkedin', label: 'LinkedIn' },
                    { value: 'google', label: 'Google X-Ray' },
                    { value: 'dice', label: 'Dice' },
                    { value: 'monster', label: 'Monster' },
                    { value: 'careerbuilder', label: 'CareerBuilder' },
                    { value: 'github', label: 'GitHub' },
                    { value: 'stackoverflow', label: 'Stack Overflow' }
                  ]}
                  value={savePlatform}
                  onChange={(e) => setSavePlatform(e.target.value)}
                  icon="Target"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Boolean Query String
                </label>
                <textarea
                  value={saveQuery}
                  onChange={(e) => setSaveQuery(e.target.value)}
                  className="w-full h-20 p-3 border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Paste complete compiled search string..."
                />
              </div>

              <Input
                label="Organizational Tags (comma-separated)"
                placeholder="e.g. Urgent, Backend, Q3 Sourcing"
                value={saveTags}
                onChange={(e) => setSaveTags(e.target.value)}
                icon="Sliders"
              />

              <div className="flex justify-end gap-2 mt-2">
                <Button variant="ghost" size="sm" onClick={() => setIsCreatingSave(false)}>Cancel</Button>
                <Button variant="primary" size="sm" type="submit" icon="Check">Save Query</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabs and Filtering Workspace */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-gray-800 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => { setActiveSubTab('history'); setIsCreatingSave(false); }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider font-display border-b-2 transition-all cursor-pointer focus:outline-none
                ${activeSubTab === 'history'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }
              `}
            >
              Search Log history ({searchHistory.length})
            </button>
            <button
              onClick={() => setActiveSubTab('saved')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider font-display border-b-2 transition-all cursor-pointer focus:outline-none
                ${activeSubTab === 'saved'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }
              `}
            >
              Saved Custom Queries ({savedSearches.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            {activeSubTab === 'history' && searchHistory.length > 0 && (
              <Button variant="danger" size="sm" icon="Trash" onClick={clearHistory}>
                Flush History
              </Button>
            )}
            <div className="w-40">
              <Dropdown
                options={platformOptions}
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="py-0"
              />
            </div>
            <div className="w-56">
              <Search
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onClear={() => setSearchVal('')}
                placeholder="Search queries..."
                className="py-0.5"
              />
            </div>
          </div>
        </div>

        {/* Content lists */}
        {activeSubTab === 'history' ? (
          <div className="flex flex-col gap-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <Card key={item.id} className="hover:border-indigo-500/50">
                  <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-display">
                          {item.label || 'Custom query string'}
                        </span>
                        <Badge variant="blue" className="text-[9px] font-bold uppercase tracking-wider">
                          {item.platform}
                        </Badge>
                      </div>
                      <div className="mt-2 font-mono text-xs text-emerald-600 dark:text-emerald-400 select-all p-2 bg-gray-50 dark:bg-gray-950 border border-gray-200/60 dark:border-gray-850 rounded-lg max-h-24 overflow-y-auto leading-relaxed">
                        {item.query}
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400 font-semibold uppercase">
                        <span>Date: {item.date}</span>
                        <span>•</span>
                        <span>Length: {item.length} chars</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-1.5 shrink-0 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="primary"
                        icon="Copy"
                        className="flex-1 sm:flex-initial text-xs font-bold"
                        onClick={() => handleCopy(item.query, item.label || 'Sourcing search')}
                      >
                        Copy Query
                      </Button>
                      <div className="flex gap-1.5 flex-1 sm:flex-initial">
                        <Button
                          size="sm"
                          variant="outline"
                          icon="Heart"
                          className={`flex-1 ${item.favorite ? 'text-red-500 border-red-200 dark:border-red-900' : ''}`}
                          onClick={() => toggleHistoryFavorite(item.id)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          icon="Trash"
                          className="text-red-500 hover:bg-red-50 hover:border-red-200 flex-1"
                          onClick={() => deleteHistoryItem(item.id)}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="py-12 text-center flex flex-col items-center justify-center">
                <div className="p-3 bg-gray-50 dark:bg-gray-950 text-gray-400 dark:text-gray-500 rounded-full mb-3">
                  <Lucide.SearchX className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-950 dark:text-white">No search histories found</h4>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-sm leading-relaxed">
                  Generate some custom queries inside the dashboard or templates panels to populate logs.
                </p>
              </Card>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredSaved.length > 0 ? (
              filteredSaved.map((save) => (
                <Card key={save.id} className="hover:border-indigo-500/50">
                  <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-display">
                          {save.title}
                        </span>
                        <Badge variant="purple" className="text-[9px] font-bold uppercase">
                          {save.platform}
                        </Badge>
                        {save.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-100/30">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 font-mono text-xs text-emerald-600 dark:text-emerald-400 select-all p-2 bg-gray-50 dark:bg-gray-950 border border-gray-200/60 dark:border-gray-850 rounded-lg max-h-24 overflow-y-auto leading-relaxed">
                        {save.query}
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400 font-semibold uppercase">
                        <span>Saved On: {save.date}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-1.5 shrink-0 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="primary"
                        icon="Copy"
                        className="flex-1 sm:flex-initial text-xs font-bold"
                        onClick={() => handleCopy(save.query, save.title)}
                      >
                        Copy Query
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        icon="Trash"
                        className="text-red-500 hover:bg-red-50 hover:border-red-250 flex-1 sm:flex-initial"
                        onClick={() => deleteSavedSearch(save.id)}
                      >
                        Delete Save
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="py-12 text-center flex flex-col items-center justify-center">
                <div className="p-3 bg-gray-50 dark:bg-gray-950 text-gray-400 dark:text-gray-500 rounded-full mb-3">
                  <Lucide.Bookmark className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-950 dark:text-white">No custom saved queries</h4>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-sm leading-relaxed text-center">
                  Create a custom query configuration and save it with tags to organize your candidate targets.
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsCreatingSave(true)}>
                  Create New Saved Query
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {toastMsg && (
          <Toast message={toastMsg} onClose={() => setToastMsg('')} />
        )}
      </AnimatePresence>
    </div>
  );
};
