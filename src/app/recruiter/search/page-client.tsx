"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { 
  Filter, 
  Save, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Pin, 
  History, 
  Trash2, 
  Check, 
  Sparkles,
  Command,
  HelpCircle,
  FileText,
  Eye,
  Sliders,
  Folder,
  Tag,
  Star,
  Copy,
  Share2,
  Download,
  Upload,
  RotateCcw,
  RotateCw,
  FileJson,
  Layout,
  Plus,
  CopyPlus,
  BookOpen,
  Sun,
  Moon,
  Keyboard,
  ArrowRight,
  GripVertical,
  MinusCircle,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recruiterCandidates, recruiterNav } from "@/data/platform";
import { FilterBuilder } from "@/lib/boolean-search/filter-builder";
import { BooleanSearchAnalyzer } from "@/lib/boolean-search/analyzer";


interface SuggestionItem {
  id: string;
  name: string;
  type: string;
  slug: string;
  alias?: string | null;
  category: string;
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: any;
  folder: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
}

interface VisualNode {
  id: string;
  type: "AND" | "OR" | "NOT" | "TERM";
  value?: string;
  children?: VisualNode[];
}

const DEFAULT_TEMPLATES = [
  {
    name: "Full Stack Engineer (React/Node)",
    query: '"Software Engineer" AND React AND Node.js',
    filters: { workplaceModel: "remote", mustHave: "React, Node.js" }
  },
  {
    name: "Cloud Architect (AWS)",
    query: '"Solutions Architect" AND AWS AND Kubernetes',
    filters: { workplaceModel: "hybrid", certification: "AWS Certified Solutions Architect" }
  },
  {
    name: "Senior Python Developer",
    query: 'Python AND Django AND PostgreSQL',
    filters: { experienceYearsMin: "5", mustHave: "Python, Django" }
  }
];

export default function RecruiterSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Mode & Layout Theme States
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [builderTab, setBuilderTab] = useState<"visual" | "text">("visual");
  const [activeTab, setActiveTab] = useState<"search" | "saved" | "templates" | "history">("search");
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Suggestions States
  const [suggestions, setSuggestions] = useState<{
    skills: SuggestionItem[];
    jobTitles: SuggestionItem[];
    companies: SuggestionItem[];
    locations: SuggestionItem[];
    frameworks: SuggestionItem[];
  }>({ skills: [], jobTitles: [], companies: [], locations: [], frameworks: [] });
  const [flatSuggestions, setFlatSuggestions] = useState<SuggestionItem[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  // Advanced Filtering
  const [searchMode, setSearchMode] = useState<"fuzzy" | "exact" | "contains" | "starts-with" | "alias">("fuzzy");
  const [showFilters, setShowFilters] = useState(false);

  // Recruiter Structured Filters State
  const [filters, setFilters] = useState({
    experienceYearsMin: "",
    experienceYearsMax: "",
    currentCompany: "",
    previousCompany: "",
    location: "",
    radiusMiles: "",
    workplaceModel: "any",
    noticePeriod: "",
    degreeType: "",
    certification: "",
    industry: "",
    employmentType: "",
    visaStatus: "",
    securityClearance: "",
    salaryMin: "",
    salaryMax: "",
    availability: "",
    currentDesignation: "",
    previousDesignation: "",
    mustHave: "",
    niceToHave: "",
    exclude: "",
    preferredEmployer: "",
    preferredUniversity: "",
    preferredSkillCategory: ""
  });

  const [compiledQuery, setCompiledQuery] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  // Productivity States
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [currentFolder, setCurrentFolder] = useState("Default");
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState<string[]>(["Default", "Engineering", "Design", "Management"]);
  const [newTagInput, setNewTagInput] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Undo/Redo Stacks
  const [undoStack, setUndoStack] = useState<{ query: string; filters: any; tree: VisualNode }[]>([]);
  const [redoStack, setRedoStack] = useState<{ query: string; filters: any; tree: VisualNode }[]>([]);

  // Visual Tree Builder State
  const [visualTree, setVisualTree] = useState<VisualNode>({
    id: "root",
    type: "AND",
    children: [
      { id: "node-1", type: "TERM", value: "Software Engineer" },
      {
        id: "node-2",
        type: "OR",
        children: [
          { id: "node-3", type: "TERM", value: "React" },
          { id: "node-4", type: "TERM", value: "TypeScript" }
        ]
      }
    ]
  });

  // Drag and Drop & Drop-over State
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOverNodeId, setDragOverNodeId] = useState<string | null>(null);

  // Feedback notifications
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Infinite Scroll & Virtualized Rendering emulation
  const [visibleCount, setVisibleCount] = useState(10);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Candidates lists state
  const [filteredCandidates, setFilteredCandidates] = useState(recruiterCandidates);

  const filterBuilder = new FilterBuilder();

  // Dynamic Class Theme maps for Enterprise Design System
  const isDark = themeMode === "dark";
  const wrapperClass = isDark ? "text-slate-100 bg-slate-950/20" : "text-slate-800 bg-slate-50/50";
  const cardClass = isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200/80 shadow-sm";
  const subCardClass = isDark ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50 border-slate-200/80";
  const inputClass = isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800 focus:bg-white";
  const selectClass = isDark ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800";
  const labelClass = isDark ? "text-slate-400" : "text-slate-650 font-bold";
  const preClass = isDark ? "bg-slate-955 border-slate-800/60" : "bg-slate-100 border-slate-200";

  // Load Initial Settings & URL Share Parameters
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith("#share=")) {
      try {
        const decoded = JSON.parse(atob(hash.substring(7)));
        if (decoded.query) setSearchQuery(decoded.query);
        if (decoded.filters) setFilters(decoded.filters);
        if (decoded.tree) setVisualTree(decoded.tree);
      } catch (err) {
        console.error("Failed to parse share parameters:", err);
      }
    }

    const savedRecent = localStorage.getItem("workora_recent_searches");
    const savedList = localStorage.getItem("workora_saved_searches");
    const savedFolders = localStorage.getItem("workora_folders");
    const autosave = localStorage.getItem("workora_autosave_state");

    if (savedRecent) setRecentSearches(JSON.parse(savedRecent));
    if (savedList) setSavedSearches(JSON.parse(savedList));
    if (savedFolders) setFolders(JSON.parse(savedFolders));
    if (autosave && !hash) {
      try {
        const state = JSON.parse(autosave);
        setSearchQuery(state.query || "");
        setFilters(state.filters || {});
        if (state.tree) setVisualTree(state.tree);
      } catch (err) {}
    }
  }, []);

  // Autosave current search parameters to localStorage
  useEffect(() => {
    const state = { query: searchQuery, filters, tree: visualTree };
    localStorage.setItem("workora_autosave_state", JSON.stringify(state));
  }, [searchQuery, filters, visualTree]);

  // Debounced search trigger for autocomplete suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Compile visual tree to string
  const compileTree = (node: VisualNode): string => {
    if (node.type === "TERM") {
      const val = node.value || "";
      if (!val) return "";
      return val.includes(" ") ? `"${val}"` : val;
    }
    if (!node.children || node.children.length === 0) return "";
    
    const childStrings = node.children.map(compileTree).filter(Boolean);
    if (childStrings.length === 0) return "";

    if (node.type === "NOT") {
      return `NOT (${childStrings[0]})`;
    }

    const operator = ` ${node.type} `;
    return `(${childStrings.join(operator)})`;
  };

  // Sync tree query to string query in visual mode
  useEffect(() => {
    if (builderTab === "visual") {
      const query = compileTree(visualTree);
      setSearchQuery(query);
    }
  }, [visualTree, builderTab]);

  // Dynamically compile filters to Boolean query preview & run analyzer
  useEffect(() => {
    const compileAndAnalyze = async () => {
      const parsedFilters = {
        experienceYearsMin: filters.experienceYearsMin ? parseInt(filters.experienceYearsMin) : undefined,
        experienceYearsMax: filters.experienceYearsMax ? parseInt(filters.experienceYearsMax) : undefined,
        currentCompany: filters.currentCompany || undefined,
        previousCompany: filters.previousCompany || undefined,
        location: filters.location || undefined,
        radiusMiles: filters.radiusMiles ? parseInt(filters.radiusMiles) : undefined,
        workplaceModel: filters.workplaceModel as any,
        noticePeriod: filters.noticePeriod || undefined,
        degreeType: filters.degreeType || undefined,
        certification: filters.certification || undefined,
        industry: filters.industry || undefined,
        employmentType: filters.employmentType || undefined,
        visaStatus: filters.visaStatus || undefined,
        securityClearance: filters.securityClearance || undefined,
        salaryMin: filters.salaryMin ? parseInt(filters.salaryMin) : undefined,
        salaryMax: filters.salaryMax ? parseInt(filters.salaryMax) : undefined,
        availability: filters.availability || undefined,
        currentDesignation: filters.currentDesignation || undefined,
        previousDesignation: filters.previousDesignation || undefined,
        mustHave: filters.mustHave ? filters.mustHave.split(",").map(s => s.trim()).filter(Boolean) : [],
        niceToHave: filters.niceToHave ? filters.niceToHave.split(",").map(s => s.trim()).filter(Boolean) : [],
        exclude: filters.exclude ? filters.exclude.split(",").map(s => s.trim()).filter(Boolean) : [],
        preferredEmployer: filters.preferredEmployer || undefined,
        preferredUniversity: filters.preferredUniversity || undefined,
        preferredSkillCategory: filters.preferredSkillCategory || undefined
      };

      const query = await filterBuilder.buildQuery(parsedFilters);
      setCompiledQuery(query);

      const combined = searchQuery && query 
        ? `(${searchQuery}) AND (${query})` 
        : (searchQuery || query);

      const analyzer = new BooleanSearchAnalyzer();
      const analysisResult = analyzer.analyze(combined || "React", "GENERIC_ATS");
      setAnalysis(analysisResult);
    };

    compileAndAnalyze();
  }, [searchQuery, filters]);

  // Fetch suggestions when debounced query updates
  useEffect(() => {
    let active = true;
    if (debouncedQuery.trim().length < 2) {
      setSuggestions({ skills: [], jobTitles: [], companies: [], locations: [], frameworks: [] });
      setFlatSuggestions([]);
      setActiveSuggestionIndex(-1);
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/boolean-search/autocomplete?q=${encodeURIComponent(debouncedQuery)}`);
        if (response.ok && active) {
          const data = await response.json();
          const sug = data.suggestions;
          setSuggestions(sug);

          const flatList: SuggestionItem[] = [
            ...sug.jobTitles.map((s: any) => ({ ...s, category: "Job Titles" })),
            ...sug.skills.map((s: any) => ({ ...s, category: "Skills" })),
            ...sug.frameworks.map((s: any) => ({ ...s, category: "Frameworks & Databases" })),
            ...sug.companies.map((s: any) => ({ ...s, category: "Companies" })),
            ...sug.locations.map((s: any) => ({ ...s, category: "Locations" })),
          ];
          setFlatSuggestions(flatList);
          setActiveSuggestionIndex(-1);
        }
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      }
    });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // Keyboard Shortcuts Trigger handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        triggerSearch(searchQuery);
      }
      if (e.key === "Escape") {
        setIsSuggestionsOpen(false);
      }
      if (e.altKey && e.key === "z") {
        e.preventDefault();
        handleUndo();
      }
      if (e.altKey && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery, undoStack, redoStack]);

  // Handle dynamic candidate filtering
  useEffect(() => {
    let result = recruiterCandidates;

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((candidate) => {
        const nameMatch = candidate.name.toLowerCase();
        const headlineMatch = candidate.headline.toLowerCase();
        switch (searchMode) {
          case "exact":
            return nameMatch === q || headlineMatch === q;
          case "starts-with":
            return nameMatch.startsWith(q) || headlineMatch.startsWith(q);
          case "contains":
            return nameMatch.includes(q) || headlineMatch.includes(q);
          case "alias":
            return nameMatch.includes(q) || headlineMatch.includes(q);
          case "fuzzy":
          default:
            return nameMatch.includes(q) || 
                   headlineMatch.includes(q) ||
                   q.split(" ").some(word => nameMatch.includes(word) || headlineMatch.includes(word));
        }
      });
    }

    if (filters.location.trim().length > 0) {
      const loc = filters.location.toLowerCase().trim();
      result = result.filter(c => c.location.toLowerCase().includes(loc));
    }

    if (filters.currentCompany.trim().length > 0) {
      const comp = filters.currentCompany.toLowerCase().trim();
      result = result.filter(c => c.headline.toLowerCase().includes(comp));
    }

    setFilteredCandidates(result);
    setVisibleCount(10);
  }, [searchQuery, searchMode, filters.location, filters.currentCompany]);

  // Undo/Redo State Action
  const pushToUndoStack = (q: string, f: any, t: VisualNode) => {
    setUndoStack(prev => [...prev, { query: q, filters: f, tree: JSON.parse(JSON.stringify(t)) }].slice(-20));
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, { query: searchQuery, filters, tree: JSON.parse(JSON.stringify(visualTree)) }].slice(-20));
    setUndoStack(prev => prev.slice(0, -1));

    setSearchQuery(previous.query);
    setFilters(previous.filters);
    setVisualTree(previous.tree);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, { query: searchQuery, filters, tree: JSON.parse(JSON.stringify(visualTree)) }].slice(-20));
    setRedoStack(prev => prev.slice(0, -1));

    setSearchQuery(next.query);
    setFilters(next.filters);
    setVisualTree(next.tree);
  };

  const handleFilterChange = (key: string, value: string) => {
    pushToUndoStack(searchQuery, filters, visualTree);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const selectSuggestion = (item: SuggestionItem) => {
    pushToUndoStack(searchQuery, filters, visualTree);
    setSearchQuery(item.name);
    setIsSuggestionsOpen(false);
    triggerSearch(item.name);
  };

  const triggerSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== query);
      const updated = [query, ...filtered].slice(0, 10);
      localStorage.setItem("workora_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  // Saved searches block
  const saveSearch = (name: string) => {
    const newSave: SavedSearch = {
      id: `save-${Date.now()}`,
      name,
      query: searchQuery,
      filters,
      folder: currentFolder,
      tags: newTagInput ? newTagInput.split(",").map(t => t.trim()).filter(Boolean) : [],
      isFavorite: false,
      createdAt: new Date().toLocaleDateString()
    };

    setSavedSearches(prev => {
      const updated = [newSave, ...prev];
      localStorage.setItem("workora_saved_searches", JSON.stringify(updated));
      return updated;
    });
    setNewTagInput("");
  };

  const duplicateSearch = (item: SavedSearch) => {
    const duplicated: SavedSearch = {
      ...item,
      id: `save-${Date.now()}`,
      name: `${item.name} (Copy)`
    };
    setSavedSearches(prev => {
      const updated = [duplicated, ...prev];
      localStorage.setItem("workora_saved_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem("workora_saved_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (id: string) => {
    setSavedSearches(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item);
      localStorage.setItem("workora_saved_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const addFolder = () => {
    if (!newFolderName.trim() || folders.includes(newFolderName)) return;
    setFolders(prev => {
      const updated = [...prev, newFolderName];
      localStorage.setItem("workora_folders", JSON.stringify(updated));
      return updated;
    });
    setNewFolderName("");
  };

  // Copy / Share Actions
  const handleCopyToClipboard = () => {
    const content = compiledQuery || searchQuery;
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleGenerateShareUrl = () => {
    const payload = btoa(JSON.stringify({ query: searchQuery, filters, tree: visualTree }));
    const shareUrl = `${window.location.origin}${window.location.pathname}#share=${payload}`;
    navigator.clipboard.writeText(shareUrl);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  // Import / Export Templates
  const handleExportJSON = () => {
    const payload = JSON.stringify({ query: searchQuery, filters, tree: visualTree }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workora-search-${Date.now()}.json`;
    a.click();
  };

  const handleExportTXT = () => {
    const textData = `Query: ${searchQuery}\nCompiled Query: ${compiledQuery}\nFilters:\n${JSON.stringify(filters, null, 2)}`;
    const blob = new Blob([textData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workora-search-${Date.now()}.txt`;
    a.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const state = JSON.parse(event.target?.result as string);
        if (state.query) setSearchQuery(state.query);
        if (state.filters) setFilters(state.filters);
        if (state.tree) setVisualTree(state.tree);
      } catch (err) {
        alert("Invalid JSON configuration file.");
      }
    };
    reader.readAsText(file);
  };

  const applyTemplate = (item: any) => {
    pushToUndoStack(searchQuery, filters, visualTree);
    setSearchQuery(item.query);
    setFilters({ ...filters, ...item.filters });
  };

  // Syntax highlighting emulation for compiled query string
  const renderHighlightedQuery = (queryText: string) => {
    if (!queryText) return <span className="text-slate-500">No compiled expression yet.</span>;
    const parts = queryText.split(/(\bAND\b|\bOR\b|\bNOT\b|\(|\))/g);
    return (
      <span className="font-mono text-sm leading-relaxed">
        {parts.map((part, idx) => {
          if (part === "AND") return <span key={idx} className="text-blue-400 font-bold px-1">{part}</span>;
          if (part === "OR") return <span key={idx} className="text-emerald-400 font-bold px-1">{part}</span>;
          if (part === "NOT") return <span key={idx} className="text-rose-450 font-bold px-1">{part}</span>;
          if (part === "(" || part === ")") return <span key={idx} className="text-slate-400 font-semibold">{part}</span>;
          if (part.startsWith('"') && part.endsWith('"')) return <span key={idx} className="text-amber-350">{part}</span>;
          return <span key={idx} className={isDark ? "text-slate-200" : "text-slate-800"}>{part}</span>;
        })}
      </span>
    );
  };

  // Tree Manipulation Helpers
  const addNodeToTree = (parentId: string, type: VisualNode["type"]) => {
    pushToUndoStack(searchQuery, filters, visualTree);
    const updated = JSON.parse(JSON.stringify(visualTree)) as VisualNode;

    const findAndAdd = (node: VisualNode): boolean => {
      if (node.id === parentId) {
        if (!node.children) node.children = [];
        node.children.push({
          id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type,
          value: type === "TERM" ? "New term" : undefined,
          children: type !== "TERM" ? [] : undefined
        });
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (findAndAdd(child)) return true;
        }
      }
      return false;
    };

    findAndAdd(updated);
    setVisualTree(updated);
  };

  const removeNodeFromTree = (nodeId: string) => {
    pushToUndoStack(searchQuery, filters, visualTree);
    const updated = JSON.parse(JSON.stringify(visualTree)) as VisualNode;

    const findAndRemove = (node: VisualNode): boolean => {
      if (node.children) {
        const index = node.children.findIndex(c => c.id === nodeId);
        if (index !== -1) {
          node.children.splice(index, 1);
          return true;
        }
        for (const child of node.children) {
          if (findAndRemove(child)) return true;
        }
      }
      return false;
    };

    findAndRemove(updated);
    setVisualTree(updated);
  };

  const updateNodeValue = (nodeId: string, val: string) => {
    const updated = JSON.parse(JSON.stringify(visualTree)) as VisualNode;

    const findAndUpdate = (node: VisualNode): boolean => {
      if (node.id === nodeId) {
        node.value = val;
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (findAndUpdate(child)) return true;
        }
      }
      return false;
    };

    findAndUpdate(updated);
    setVisualTree(updated);
  };

  const updateNodeType = (nodeId: string, type: VisualNode["type"]) => {
    pushToUndoStack(searchQuery, filters, visualTree);
    const updated = JSON.parse(JSON.stringify(visualTree)) as VisualNode;

    const findAndUpdateType = (node: VisualNode): boolean => {
      if (node.id === nodeId) {
        node.type = type;
        if (type === "TERM") {
          node.value = "New term";
          delete node.children;
        } else {
          node.children = node.children || [];
          delete node.value;
        }
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (findAndUpdateType(child)) return true;
        }
      }
      return false;
    };

    findAndUpdateType(updated);
    setVisualTree(updated);
  };

  // Drag & Drop HTML5 Node Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedNodeId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedNodeId !== id) {
      setDragOverNodeId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverNodeId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverNodeId(null);
    if (!draggedNodeId || draggedNodeId === targetId) return;

    pushToUndoStack(searchQuery, filters, visualTree);
    const updated = JSON.parse(JSON.stringify(visualTree)) as VisualNode;

    let draggedNodeCopy: VisualNode | null = null;

    const extractNode = (node: VisualNode): boolean => {
      if (node.children) {
        const index = node.children.findIndex(c => c.id === draggedNodeId);
        if (index !== -1) {
          draggedNodeCopy = node.children.splice(index, 1)[0];
          return true;
        }
        for (const child of node.children) {
          if (extractNode(child)) return true;
        }
      }
      return false;
    };

    const findAndInsert = (node: VisualNode): boolean => {
      if (node.id === targetId) {
        if (node.type !== "TERM" && draggedNodeCopy) {
          if (!node.children) node.children = [];
          node.children.push(draggedNodeCopy);
          return true;
        }
      }
      if (node.children) {
        for (const child of node.children) {
          if (findAndInsert(child)) return true;
        }
      }
      return false;
    };

    extractNode(updated);
    if (draggedNodeCopy) {
      findAndInsert(updated);
      setVisualTree(updated);
    }
    setDraggedNodeId(null);
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: VisualNode, depth = 0) => {
    const isGroup = node.type !== "TERM";
    const isHovered = dragOverNodeId === node.id;

    return (
      <div 
        key={node.id} 
        className={`relative border rounded-xl my-2 p-3 transition-all duration-200 ${
          isGroup 
            ? isDark ? "bg-slate-900/35 border-slate-800/80" : "bg-slate-100/50 border-slate-200" 
            : isDark ? "bg-slate-950/60 border-slate-800/60" : "bg-white border-slate-250 shadow-sm"
        } ${draggedNodeId === node.id ? "opacity-30 border-dashed" : ""} ${
          isHovered ? "border-primary/75 ring-1 ring-primary/30" : ""
        }`}
        style={{ marginLeft: `${depth * 14}px` }}
        draggable
        onDragStart={(e) => handleDragStart(e, node.id)}
        onDragOver={(e) => handleDragOver(e, node.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, node.id)}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="cursor-grab text-slate-500 hover:text-slate-400 p-1 rounded">
              <GripVertical className="h-4 w-4" />
            </div>
            
            {/* Operator Selection */}
            {isGroup ? (
              <select
                aria-label="Operator type"
                className={`h-7 text-xs font-bold rounded-lg border px-1.5 focus:outline-none ${
                  node.type === "AND" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" :
                  node.type === "OR" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                  "bg-rose-500/10 border-rose-500/30 text-rose-450"
                }`}
                value={node.type}
                onChange={(e) => updateNodeType(node.id, e.target.value as any)}
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
                <option value="NOT">NOT</option>
              </select>
            ) : (
              <Input
                aria-label="Search term value"
                className={`h-7 w-48 text-xs rounded-lg py-0 px-2 focus:ring-1 focus:ring-primary ${inputClass}`}
                value={node.value || ""}
                onChange={(e) => updateNodeValue(node.id, e.target.value)}
              />
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isGroup && (
              <>
                <Button size="sm" variant="ghost" className="h-7 text-[10px] px-2 text-slate-400" onClick={() => addNodeToTree(node.id, "TERM")}>
                  <Plus className="h-3 w-3 mr-1" /> Add Term
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-[10px] px-2 text-slate-400" onClick={() => addNodeToTree(node.id, "AND")}>
                  <Plus className="h-3 w-3 mr-1" /> Add Group
                </Button>
              </>
            )}
            
            {node.id !== "root" && (
              <button 
                className="text-slate-500 hover:text-red-400 p-1 border border-slate-800 rounded hover:bg-slate-900" 
                onClick={() => removeNodeFromTree(node.id)}
                title="Remove Node"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Children Render with indentation connecting guidelines */}
        {node.children && node.children.length > 0 && (
          <div className="mt-2 border-l border-slate-700/60 pl-3.5 space-y-1">
            {node.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setVisibleCount((prev) => Math.min(prev + 10, filteredCandidates.length));
    }
  };

  return (
    <PlatformShell
      badge="Recruiter Studio"
      description="Run Boolean search, keyword search, and advanced candidate filters across indexed profiles."
      nav={recruiterNav}
      title="Recruiter Search Center"
    >
      <div className={`space-y-6 transition-colors duration-300 ${wrapperClass}`}>
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex gap-2">
            <Button size="sm" variant={activeTab === "search" ? "secondary" : "ghost"} onClick={() => setActiveTab("search")}>
              <Sliders className="h-4 w-4 mr-2" /> Search Builder
            </Button>
            <Button size="sm" variant={activeTab === "saved" ? "secondary" : "ghost"} onClick={() => setActiveTab("saved")}>
              <Folder className="h-4 w-4 mr-2" /> Folders & Collections ({savedSearches.length})
            </Button>
            <Button size="sm" variant={activeTab === "templates" ? "secondary" : "ghost"} onClick={() => setActiveTab("templates")}>
              <BookOpen className="h-4 w-4 mr-2" /> Custom Templates
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowShortcuts(!showShortcuts)}>
              <Keyboard className="h-4 w-4 mr-2" /> Shortcuts
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}>
              {themeMode === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
            </Button>
          </div>
        </div>

        {/* Shortcuts Panel Overlay */}
        {showShortcuts && (
          <div className={`p-4 border rounded-xl text-xs space-y-2 max-w-sm absolute right-10 z-50 shadow-lg ${cardClass}`}>
            <h4 className="font-bold text-slate-200">Recruiter Keyboard Shortcuts</h4>
            <ul className="space-y-1 text-slate-400 font-mono">
              <li className="flex justify-between"><span>Run Search:</span> <span>Ctrl + Enter</span></li>
              <li className="flex justify-between"><span>Undo Action:</span> <span>Alt + Z</span></li>
              <li className="flex justify-between"><span>Redo Action:</span> <span>Alt + Y</span></li>
              <li className="flex justify-between"><span>Dismiss Box:</span> <span>Esc</span></li>
            </ul>
          </div>
        )}

        {/* Tab 1: Split Search Builder Dashboard */}
        {activeTab === "search" && (
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            
            {/* Left Column: Visual expression builder & query filters */}
            <div className="space-y-6">
              <div className={`${cardClass} rounded-xl overflow-hidden`}>
                <WorkflowCard title="Query Builder Panel">
                <div className="flex border-b border-slate-800/80 pb-2 mb-4 gap-2">
                  <button 
                    onClick={() => setBuilderTab("visual")}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                      builderTab === "visual" 
                        ? isDark ? "bg-slate-800 text-slate-250" : "bg-slate-200 text-slate-900" 
                        : "text-slate-500 hover:text-slate-450"
                    }`}
                  >
                    Visual Builder Tree
                  </button>
                  <button 
                    onClick={() => setBuilderTab("text")}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                      builderTab === "text" 
                        ? isDark ? "bg-slate-800 text-slate-250" : "bg-slate-200 text-slate-900" 
                        : "text-slate-500 hover:text-slate-450"
                    }`}
                  >
                    Raw Query Text
                  </button>
                </div>

                {/* Mode Selector */}
                {builderTab === "visual" ? (
                  <div className={`p-4 border rounded-xl ${subCardClass}`}>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Hierarchy Tree View</p>
                    {renderTreeNode(visualTree)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        aria-label="Raw Boolean search input"
                        className={`pl-4 pr-10 py-6 text-base rounded-xl font-mono ${inputClass}`}
                        placeholder='Search using expressions (e.g. "Software Engineer" AND React)'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-4">
                  <Button size="sm" variant={showFilters ? "secondary" : "outline"} onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters Drawer
                    {showFilters ? <ChevronUp className="h-3.5 w-3.5 ml-2" /> : <ChevronDown className="h-3.5 w-3.5 ml-2" />}
                  </Button>

                  <div className="flex gap-2 items-center">
                    <select
                      aria-label="Folder selector"
                      className={`h-8 rounded-lg border text-xs px-2 focus:outline-none ${selectClass}`}
                      value={currentFolder}
                      onChange={(e) => setCurrentFolder(e.target.value)}
                    >
                      {folders.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <Button size="sm" onClick={() => {
                      const name = prompt("Name this search query:", searchQuery || "Developer Search");
                      if (name) saveSearch(name);
                    }}>
                      <Save className="h-3.5 w-3.5 mr-2" /> Save Search
                    </Button>
                  </div>
                </div>

                {/* Advanced Structured Filters */}
                {showFilters && (
                  <div className={`mt-4 p-5 rounded-xl border space-y-6 ${subCardClass}`}>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <label htmlFor="experienceYearsMin" className={`text-xs font-semibold ${labelClass}`}>Min Experience (Yrs)</label>
                        <Input
                          id="experienceYearsMin"
                          type="number"
                          className={`text-sm rounded-lg ${inputClass}`}
                          placeholder="e.g. 2"
                          value={filters.experienceYearsMin}
                          onChange={(e) => handleFilterChange("experienceYearsMin", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="experienceYearsMax" className={`text-xs font-semibold ${labelClass}`}>Max Experience (Yrs)</label>
                        <Input
                          id="experienceYearsMax"
                          type="number"
                          className={`text-sm rounded-lg ${inputClass}`}
                          placeholder="e.g. 10"
                          value={filters.experienceYearsMax}
                          onChange={(e) => handleFilterChange("experienceYearsMax", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-1">
                        <label htmlFor="currentDesignation" className={`text-xs font-semibold ${labelClass}`}>Current Designation</label>
                        <Input
                          id="currentDesignation"
                          className={`text-sm rounded-lg ${inputClass}`}
                          placeholder="e.g. Software Engineer"
                          value={filters.currentDesignation}
                          onChange={(e) => handleFilterChange("currentDesignation", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="currentCompany" className={`text-xs font-semibold ${labelClass}`}>Current Company</label>
                        <Input
                          id="currentCompany"
                          className={`text-sm rounded-lg ${inputClass}`}
                          placeholder="e.g. Google"
                          value={filters.currentCompany}
                          onChange={(e) => handleFilterChange("currentCompany", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="workplaceModel" className={`text-xs font-semibold ${labelClass}`}>Workplace Model</label>
                        <select
                          id="workplaceModel"
                          className={`w-full h-[40px] rounded-lg border px-3 text-sm focus:outline-none ${selectClass}`}
                          value={filters.workplaceModel}
                          onChange={(e) => handleFilterChange("workplaceModel", e.target.value)}
                        >
                          <option value="any">Remote / Onsite / Hybrid</option>
                          <option value="remote">Remote Only</option>
                          <option value="hybrid">Hybrid Only</option>
                          <option value="onsite">Onsite Only</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-slate-800/80 pt-4">
                      <div className="space-y-1">
                        <label htmlFor="mustHave" className={`text-xs font-semibold flex items-center gap-1.5 ${labelClass}`}>
                          <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Must Have Skills (Comma separated)
                        </label>
                        <Input
                          id="mustHave"
                          className={`text-sm rounded-lg ${inputClass}`}
                          placeholder="e.g. React, TypeScript, Node.js"
                          value={filters.mustHave}
                          onChange={(e) => handleFilterChange("mustHave", e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="niceToHave" className={`text-xs font-semibold flex items-center gap-1.5 ${labelClass}`}>
                          <span className="h-2 w-2 rounded-full bg-amber-500"></span> Nice To Have Skills (Comma separated)
                        </label>
                        <Input
                          id="niceToHave"
                          className={`text-sm rounded-lg ${inputClass}`}
                          placeholder="e.g. AWS, Docker, Kubernetes"
                          value={filters.niceToHave}
                          onChange={(e) => handleFilterChange("niceToHave", e.target.value)}
                        />
                      </div>
                    </div>

                  </div>
                )}
                </WorkflowCard>
              </div>

              {/* Live Preview & Diagnostics */}
              <div className={`${cardClass} rounded-xl overflow-hidden`}>
                <WorkflowCard title="Query Analytics & Diagnostics">
                <div className="space-y-4 text-xs">
                  {/* Highlighted Boolean query */}
                  <div className={`p-4 rounded-xl border space-y-2 ${preClass}`}>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <span>Live Syntax Highlights</span>
                      <span>Deterministic</span>
                    </div>
                    <div className="overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[120px] overflow-y-auto">
                      {renderHighlightedQuery(compiledQuery || searchQuery)}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs" onClick={handleCopyToClipboard}>
                      <Copy className="h-3.5 w-3.5 mr-2" /> {copySuccess ? "Copied!" : "Copy Expression"}
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs" onClick={handleGenerateShareUrl}>
                      <Share2 className="h-3.5 w-3.5 mr-2" /> {shareSuccess ? "Shared!" : "Share URL"}
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs" onClick={handleExportJSON}>
                      <FileJson className="h-3.5 w-3.5 mr-2" /> Export Template
                    </Button>
                  </div>

                  {/* Analyzer Result display */}
                  {analysis && (
                    <div className="space-y-4 pt-3 border-t border-slate-800/80">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className={`p-2.5 rounded-xl border ${preClass}`}>
                          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Complexity</div>
                          <div className={`text-sm font-bold mt-1 ${isDark ? "text-slate-200" : "text-slate-900"}`}>{analysis.complexityScore}/100</div>
                        </div>
                        <div className={`p-2.5 rounded-xl border ${preClass}`}>
                          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Readability</div>
                          <div className={`text-sm font-bold mt-1 ${isDark ? "text-slate-200" : "text-slate-900"}`}>{analysis.readabilityScore}/100</div>
                        </div>
                        <div className={`p-2.5 rounded-xl border ${preClass}`}>
                          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Performance</div>
                          <div className={`text-sm font-bold mt-1 ${isDark ? "text-slate-200" : "text-slate-900"}`}>{analysis.performanceScore}/100</div>
                        </div>
                      </div>

                      {/* Warnings / Errors */}
                      {analysis.issues.length > 0 && (
                        <div className="space-y-1">
                          {analysis.issues.map((iss: any, idx: number) => (
                            <div key={idx} className={`flex items-start gap-1.5 py-1 px-2 rounded-md ${
                              iss.severity === "error" ? "bg-red-500/10 text-red-400" :
                              iss.severity === "warning" ? "bg-amber-500/10 text-amber-400" :
                              "bg-blue-500/10 text-blue-400"
                            }`}>
                              {iss.severity === "error" && <MinusCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
                              {iss.severity === "warning" && <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
                              {iss.severity === "info" && <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
                              <span>{iss.message}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Suggestions list */}
                      {analysis.suggestions.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Optimization Suggestions</div>
                          <ul className="list-disc pl-4 space-y-1 text-slate-350 text-[11px]">
                            {analysis.suggestions.map((sug: any, idx: number) => (
                              <li key={idx}>{sug}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </WorkflowCard>
              </div>
            </div>

            {/* Right Column: Candidate Search results list */}
            <div>
              <div className={`${cardClass} rounded-xl overflow-hidden`}>
                <WorkflowCard 
                  title={`Matching Candidates (${filteredCandidates.length})`}
                >
                <div 
                  ref={scrollContainerRef}
                  className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800"
                  onScroll={handleScroll}
                >
                  {filteredCandidates.slice(0, visibleCount).map((candidate) => (
                    <CandidateRow 
                      candidate={candidate} 
                      highlightQuery={searchQuery}
                      key={candidate.name} 
                    />
                  ))}

                  {filteredCandidates.length === 0 && (
                    <div className="py-12 text-center space-y-2 border border-dashed border-slate-800 rounded-xl">
                      <FileText className="h-8 w-8 text-slate-600 mx-auto" />
                      <h3 className="font-semibold text-slate-400 text-sm">No profiles match your search</h3>
                      <p className="text-xs text-slate-500">Try adjusting your filters, query text, or match mode.</p>
                    </div>
                  )}

                  {visibleCount < filteredCandidates.length && (
                    <div className="py-4 text-center text-xs text-muted-foreground animate-pulse">
                      Scroll down to load more candidate profiles...
                    </div>
                  )}
                </div>
                </WorkflowCard>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Saved Searches & Folders */}
        {activeTab === "saved" && (
          <div className={`${cardClass} rounded-xl overflow-hidden`}>
            <WorkflowCard title="Workspace Collections & Folders">
            <div className="flex gap-2 items-center mb-6">
              <Input
                className="max-w-xs bg-slate-900 border-slate-800 rounded-xl"
                placeholder="New Folder Name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <Button onClick={addFolder}>
                <Plus className="h-4 w-4 mr-2" /> Add Collection
              </Button>
            </div>

            <div className="space-y-6">
              {folders.map(folder => {
                const folderItems = savedSearches.filter(s => s.folder === folder);

                return (
                  <div className={`border rounded-xl p-4 ${subCardClass}`} key={folder}>
                    <div className="flex justify-between items-center border-b border-slate-800/60 pb-2 mb-3">
                      <h3 className="font-semibold text-slate-350 text-sm flex items-center gap-2">
                        <Folder className="h-4 w-4 text-primary" /> {folder} ({folderItems.length})
                      </h3>
                    </div>

                    <div className="grid gap-3">
                      {folderItems.map(item => (
                        <div className={`flex justify-between items-start p-4 border rounded-xl ${cardClass}`} key={item.id}>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-slate-200 text-sm">{item.name}</h4>
                              <button onClick={() => toggleFavorite(item.id)}>
                                <Star className={`h-4 w-4 ${item.isFavorite ? "fill-amber-500 text-amber-500" : "text-slate-500"}`} />
                              </button>
                            </div>
                            <code className="text-xs block text-slate-400 font-mono bg-slate-900/80 px-2 py-1 rounded border border-slate-800/40">
                              {item.query}
                            </code>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              setSearchQuery(item.query);
                              setFilters(item.filters);
                              setActiveTab("search");
                            }}>
                              Load Search
                            </Button>
                            <button className="text-slate-500 hover:text-primary p-2 border border-slate-800 rounded-lg hover:bg-slate-900" onClick={() => duplicateSearch(item)} title="Duplicate Search">
                              <CopyPlus className="h-4 w-4" />
                            </button>
                            <button className="text-slate-500 hover:text-red-400 p-2 border border-slate-800 rounded-lg hover:bg-slate-900" onClick={() => deleteSavedSearch(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {folderItems.length === 0 && (
                        <div className="text-xs text-slate-500 text-center py-4">No saved searches in this collection.</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            </WorkflowCard>
          </div>
        )}

        {/* Tab 3: Predefined Templates Library */}
        {activeTab === "templates" && (
          <div className={`${cardClass} rounded-xl overflow-hidden`}>
            <WorkflowCard title="Structured Templates Library">
            <p className="text-xs text-slate-500 mb-6">Select a pre-designed query layout to bootstrap your Boolean search configuration instantly.</p>
            
            <div className="grid gap-4 md:grid-cols-3">
              {DEFAULT_TEMPLATES.map(tmpl => (
                <div className={`border rounded-xl p-4 flex flex-col justify-between ${subCardClass}`} key={tmpl.name}>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-200 text-sm">{tmpl.name}</h3>
                    <code className="text-[10px] block text-slate-400 font-mono bg-slate-900 p-2 rounded max-h-20 overflow-y-auto">
                      {tmpl.query}
                    </code>
                  </div>
                  <Button size="sm" className="mt-4 w-full" variant="outline" onClick={() => applyTemplate(tmpl)}>
                    Apply Template
                  </Button>
                </div>
              ))}
            </div>
            </WorkflowCard>
          </div>
        )}

      </div>
    </PlatformShell>
  );
}

// Child Component for single Candidate Row
function CandidateRow({ candidate, highlightQuery }: { candidate: any; highlightQuery: string }) {
  const [expanded, setExpanded] = useState(false);

  const renderHighlightedText = (text: string, searchWord: string) => {
    if (!searchWord.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${searchWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-primary/20 text-primary font-semibold rounded-sm px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-250 cursor-pointer ${
        expanded 
          ? "border-primary/45 bg-slate-900/60 shadow-lg shadow-slate-950/40" 
          : "border-slate-800/80 hover:border-slate-700/60 bg-slate-950/40"
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200">
            {candidate.name.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 text-sm">
              {renderHighlightedText(candidate.name, highlightQuery)}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {renderHighlightedText(candidate.headline, highlightQuery)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
            {candidate.match}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-800 grid md:grid-cols-3 gap-4 animate-fadeIn">
          <div className="space-y-1">
            <span className="block text-[10px] uppercase font-bold text-slate-500">Location</span>
            <span className="text-xs text-slate-300">{candidate.location}</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] uppercase font-bold text-slate-500">Job Title Match</span>
            <span className="text-xs text-slate-300">{candidate.headline.split(" at ")[0]}</span>
          </div>
          <div className="space-y-1 flex items-center justify-end">
            <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
              View Complete Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
