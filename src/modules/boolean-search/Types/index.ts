export interface Template {
  id: string;
  name: string;
  role: string;
  category: 'Tech' | 'Business' | 'Non-Tech' | 'Healthcare' | 'SAP' | 'Salesforce & CRM' | 'Management' | 'HR & Recruiting' | 'Other';
  description: string;
  keywords: string[];
  skills: string[];
  baseQuery?: string;
  platforms?: Record<string, string>; // platform specific custom query if needed
  popular?: boolean;
}

export interface HistoryItem {
  id: string;
  query: string;
  platform: string;
  date: string;
  length: number;
  copied: boolean;
  exported: boolean;
  favorite: boolean;
  label?: string;
}

export interface SavedSearch {
  id: string;
  title: string;
  query: string;
  platform: string;
  date: string;
  tags: string[];
}

export interface Activity {
  id: string;
  type: 'generate' | 'copy' | 'export' | 'create_template' | 'save_favorite' | 'import_template';
  description: string;
  timestamp: string;
  detail?: string;
}

export interface Platform {
  id: string;
  name: string;
  iconName: string;
  placeholder: string;
  description: string;
  domains?: string[];
  operators?: string[];
}

export interface LearningItem {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Syntax' | 'Platform' | 'Strategy' | 'X-Ray';
  description: string;
  readingTime: string;
  content: string;
  keywords?: string[];
}

export interface ExportJob {
  id: string;
  title: string;
  format: 'PDF' | 'TXT' | 'CSV' | 'JSON';
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface AppState {
  activeTab: string;
  theme: 'light' | 'dark';
  searchHistory: HistoryItem[];
  savedSearches: SavedSearch[];
  favorites: string[]; // List of template IDs that are favorited
  searchQuery: string; // Global dashboard search
  activityLogs: Activity[];
  settings: {
    defaultPlatform: string;
    autoCopy: boolean;
    historyLimit: number;
    showTips: boolean;
  };
}
