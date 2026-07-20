import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, HistoryItem, SavedSearch, Template, Activity } from '../Types';
import { DEFAULT_HISTORY, DEFAULT_SAVED_SEARCHES, DEFAULT_ACTIVITIES } from '../Constants';

interface BooleanStateContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  searchHistory: HistoryItem[];
  addToHistory: (query: string, platform: string, label?: string) => void;
  toggleHistoryFavorite: (id: string) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  savedSearches: SavedSearch[];
  saveSearch: (title: string, query: string, platform: string, tags: string[]) => void;
  deleteSavedSearch: (id: string) => void;
  favorites: string[]; // List of template IDs
  toggleFavoriteTemplate: (templateId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activityLogs: Activity[];
  addActivity: (type: Activity['type'], description: string, detail?: string) => void;
  customTemplates: Template[];
  addCustomTemplate: (template: Template) => void;
  settings: AppState['settings'];
  updateSettings: (newSettings: Partial<AppState['settings']>) => void;
}

const BooleanStateContext = createContext<BooleanStateContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACTIVE_TAB: 'workora_boolean_active_tab',
  THEME: 'workora_boolean_theme',
  HISTORY: 'workora_boolean_history',
  SAVED: 'workora_boolean_saved_searches',
  FAVORITES: 'workora_boolean_favorites',
  CUSTOM_TEMPLATES: 'workora_boolean_custom_templates',
  ACTIVITIES: 'workora_boolean_activities',
  SETTINGS: 'workora_boolean_settings',
};

const safeGet = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
};

export const BooleanStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from Local Storage or Defaults
  const [activeTab, setActiveTabState] = useState<string>(() => {
    return safeGet(STORAGE_KEYS.ACTIVE_TAB) || 'dashboard';
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = safeGet(STORAGE_KEYS.THEME) as 'light' | 'dark';
    if (saved) return saved;
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>(() => {
    const saved = safeGet(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : DEFAULT_HISTORY;
  });

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    const saved = safeGet(STORAGE_KEYS.SAVED);
    return saved ? JSON.parse(saved) : DEFAULT_SAVED_SEARCHES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = safeGet(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : ['java-dev', 'react-dev', 'devops'];
  });

  const [customTemplates, setCustomTemplates] = useState<Template[]>(() => {
    const saved = safeGet(STORAGE_KEYS.CUSTOM_TEMPLATES);
    return saved ? JSON.parse(saved) : [];
  });

  const [activityLogs, setActivityLogs] = useState<Activity[]>(() => {
    const saved = safeGet(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : DEFAULT_ACTIVITIES;
  });

  const [settings, setSettings] = useState<AppState['settings']>(() => {
    const saved = safeGet(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : {
      defaultPlatform: 'linkedin',
      autoCopy: true,
      historyLimit: 50,
      showTips: true
    };
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize state with DOM / local storage
  const setActiveTab = useCallback((tab: string) => {
    setActiveTabState(tab);
    safeSet(STORAGE_KEYS.ACTIVE_TAB, tab);
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    safeSet(STORAGE_KEYS.THEME, newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      safeSet(STORAGE_KEYS.THEME, next);
      return next;
    });
  }, []);

  // Update HTML class for dark mode theme
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Local Storage synchronizations when state changes
  useEffect(() => {
    safeSet(STORAGE_KEYS.HISTORY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    safeSet(STORAGE_KEYS.SAVED, JSON.stringify(savedSearches));
  }, [savedSearches]);

  useEffect(() => {
    safeSet(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    safeSet(STORAGE_KEYS.CUSTOM_TEMPLATES, JSON.stringify(customTemplates));
  }, [customTemplates]);

  useEffect(() => {
    safeSet(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    safeSet(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Actions
  const addActivity = useCallback((type: Activity['type'], description: string, detail?: string) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type,
      description,
      timestamp: 'Just now',
      detail
    };
    setActivityLogs(prev => [newActivity, ...prev.slice(0, 24)]);
  }, []);

  const addToHistory = useCallback((query: string, platform: string, label?: string) => {
    const newItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      query,
      platform,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      length: query.length,
      copied: false,
      exported: false,
      favorite: false,
      label: label || `Custom search on ${platform}`
    };
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.query !== query);
      return [newItem, ...filtered].slice(0, settings.historyLimit);
    });
    addActivity('generate', `Generated ${platform} query`, query);
  }, [settings.historyLimit, addActivity]);

  const toggleHistoryFavorite = useCallback((id: string) => {
    setSearchHistory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    addActivity('export', 'Cleared all search history logs');
  }, [addActivity]);

  const saveSearch = useCallback((title: string, query: string, platform: string, tags: string[]) => {
    const newSave: SavedSearch = {
      id: `save-${Date.now()}`,
      title,
      query,
      platform,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      tags
    };
    setSavedSearches(prev => [newSave, ...prev]);
    addActivity('create_template', `Saved search: "${title}"`, query);
  }, [addActivity]);

  const deleteSavedSearch = useCallback((id: string) => {
    setSavedSearches(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleFavoriteTemplate = useCallback((templateId: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(templateId);
      const updated = isFav
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId];
      
      addActivity('save_favorite', `${isFav ? 'Removed' : 'Added'} template to favorites`, templateId);
      return updated;
    });
  }, [addActivity]);

  const addCustomTemplate = useCallback((template: Template) => {
    setCustomTemplates(prev => [template, ...prev]);
    addActivity('create_template', `Created custom sourcing template: "${template.name}"`, template.role);
  }, [addActivity]);

  const updateSettings = useCallback((newSettings: Partial<AppState['settings']>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <BooleanStateContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        toggleTheme,
        searchHistory,
        addToHistory,
        toggleHistoryFavorite,
        deleteHistoryItem,
        clearHistory,
        savedSearches,
        saveSearch,
        deleteSavedSearch,
        favorites,
        toggleFavoriteTemplate,
        searchQuery,
        setSearchQuery,
        activityLogs,
        addActivity,
        customTemplates,
        addCustomTemplate,
        settings,
        updateSettings,
      }}
    >
      {children}
    </BooleanStateContext.Provider>
  );
};

export const useBooleanState = () => {
  const context = useContext(BooleanStateContext);
  if (context === undefined) {
    throw new Error('useBooleanState must be used within a BooleanStateProvider');
  }
  return context;
};
