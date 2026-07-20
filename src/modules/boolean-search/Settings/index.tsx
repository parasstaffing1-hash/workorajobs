import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useBooleanState } from '../Hooks/useBooleanState';
import { PLATFORMS } from '../Constants';
import { Card, CardHeader, CardTitle, CardContent, Button, Dropdown, Toast, Alert } from '../Components';
import * as Lucide from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, clearHistory } = useBooleanState();
  const [toastMsg, setToastMsg] = useState('');

  const platformOptions = PLATFORMS.map(p => ({
    value: p.id,
    label: p.name
  }));

  const historyLimitOptions = [
    { value: '20', label: 'Last 20 searches' },
    { value: '50', label: 'Last 50 searches' },
    { value: '100', label: 'Last 100 searches' }
  ];

  const handleUpdatePlatform = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ defaultPlatform: e.target.value });
    setToastMsg('Default sourcing platform updated!');
  };

  const handleUpdateLimit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ historyLimit: parseInt(e.target.value) });
    setToastMsg('Sourcing history limit updated!');
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your local search history logs? This cannot be undone.')) {
      clearHistory();
      setToastMsg('Sourcing search history logs purged!');
    }
  };

  const handleClearAllStorage = () => {
    if (window.confirm('WARNING: This will wipe your favorites, templates, and history logs, resetting all settings to defaults. Proceed?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold font-display text-gray-950 dark:text-white">
          Sourcing Preferences & Settings
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configure default compiling parameters and local storage sync limits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Settings options */}
        <div className="md:col-span-2 flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">General Sourcing Preferences</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4.5 pt-4">
              <Dropdown
                label="Default Target Sourcing Network"
                options={platformOptions}
                value={settings.defaultPlatform}
                onChange={handleUpdatePlatform}
                icon="Target"
              />

              <Dropdown
                label="History Logging Threshold"
                options={historyLimitOptions}
                value={String(settings.historyLimit)}
                onChange={handleUpdateLimit}
                icon="History"
                helperText="Limits the number of generated searches stored on your device to optimize speed."
              />

              {/* Toggle-style configurations */}
              <div className="flex items-center justify-between py-2.5 border-t border-gray-100 dark:border-gray-850">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-white">Auto-Copy String</h4>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Copy search string to clipboard instantly when generated.</p>
                </div>
                <button
                  onClick={() => {
                    updateSettings({ autoCopy: !settings.autoCopy });
                    setToastMsg(`Auto-Copy ${!settings.autoCopy ? 'enabled' : 'disabled'}`);
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-200
                    ${settings.autoCopy ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-750'}
                  `}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-200 ${settings.autoCopy ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2.5 border-t border-gray-100 dark:border-gray-850">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-white">Show Sourcing Tips</h4>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Display contextual hints and operator guidance banners inside workspace panels.</p>
                </div>
                <button
                  onClick={() => {
                    updateSettings({ showTips: !settings.showTips });
                    setToastMsg(`Sourcing hints ${!settings.showTips ? 'enabled' : 'disabled'}`);
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-200
                    ${settings.showTips ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-750'}
                  `}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-200 ${settings.showTips ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Database maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Storage Maintenance & Resets</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5 pt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 border border-gray-150 dark:border-gray-850 rounded-xl bg-gray-50/50 dark:bg-gray-950/10">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-white">Flush Sourcing History</h4>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Empty search histories stored inside local buffers.</p>
                </div>
                <Button variant="danger" size="sm" icon="Trash" onClick={handleClear}>
                  Flush
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 border border-red-100 dark:border-red-950/20 rounded-xl bg-red-50/10 dark:bg-red-950/5">
                <div>
                  <h4 className="text-xs font-bold text-red-750 dark:text-red-400">Master Database Hard-Reset</h4>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Wipe all favorites, templates, and history logs, resetting to factory defaults.</p>
                </div>
                <Button variant="danger" size="sm" icon="Flame" onClick={handleClearAllStorage}>
                  Hard Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security / Privacy details */}
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs flex items-center gap-1.5">
                <Lucide.ShieldCheck className="w-4.5 h-4.5 text-indigo-500" />
                Recruiter Data Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 flex flex-col gap-3">
              <p>
                Workora Jobs Boolean Search Generator operates <strong>fully client-side</strong>. No sourcing queries, candidate profiles, or search strings are ever transmitted to our servers or stored in any cloud datastore.
              </p>
              <p>
                All favorites, search history records, and preferences reside solely within your local web browser's cache storage.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {toastMsg && (
          <Toast message={toastMsg} onClose={() => setToastMsg('')} />
        )}
      </AnimatePresence>
    </div>
  );
};
