"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BooleanStateProvider, useBooleanState } from './Hooks/useBooleanState';
import { SidebarItem, Breadcrumb, Search } from './Components';
import { NewSearchPage } from './NewSearch';
import { TemplatesPage } from './Templates';
import { XrayPage } from './Xray';
import { ValidationPage } from './Validation';
import { HistoryPage } from './History';
import { SettingsPage } from './Settings';
import * as Lucide from 'lucide-react';

const SourcingOrchestratorContent: React.FC = () => {
  const { activeTab, setActiveTab, theme, toggleTheme, searchQuery, setSearchQuery } = useBooleanState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Handle active tab switches internally
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Sidebar links detailing requested recruiting tools
  const sidebarLinks = [
    { id: 'boolean-search', title: 'New Search', icon: 'Home' as const },
    { id: 'templates', title: 'Role Templates', icon: 'Layers' as const },
    { id: 'xray-builder', title: 'Google X-Ray Builder', icon: 'Globe' as const },
    { id: 'syntax-validator', title: 'Syntax Validator', icon: 'ShieldCheck' as const },
    { id: 'saved-searches', title: 'Saved Searches', icon: 'BookmarkCheck' as const },
    { id: 'settings', title: 'Settings', icon: 'Settings' as const },
  ];

  // Map activeTab to metadata for breadcrumbs
  const tabMetadata: Record<string, { title: string; bc: string }> = {
    'boolean-search': { title: 'Boolean Search Generator', bc: 'New Search' },
    'templates': { title: 'Role Sourcing Blueprints', bc: 'Role Templates' },
    'xray-builder': { title: 'Google X-Ray Sourcing', bc: 'X-Ray Builder' },
    'syntax-validator': { title: 'Boolean Syntax Validator', bc: 'Syntax Validator' },
    'saved-searches': { title: 'Sourcing Records & Saved Vault', bc: 'Saved Searches' },
    'settings': { title: 'Preferences & Storage Settings', bc: 'Settings' },
  };

  const currentMetadata = tabMetadata[activeTab] || { title: 'Recruiter Toolkit', bc: 'New Search' };

  const breadcrumbItems = [
    { label: 'Workora Jobs' },
    { label: 'Recruiter Panel', onClick: () => handleTabChange('boolean-search') },
    { label: currentMetadata.bc }
  ];

  const renderMainContent = () => {
    switch (activeTab) {
      case 'boolean-search':
        return <NewSearchPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'xray-builder':
        return <XrayPage />;
      case 'syntax-validator':
        return <ValidationPage />;
      case 'saved-searches':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <NewSearchPage />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex transition-colors duration-200`}>
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-sm flex items-center justify-center">
            <Lucide.SearchCode className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white uppercase tracking-wider font-display">
              Workora Jobs
            </span>
            <span className="text-[10px] text-slate-400 font-bold block leading-none">
              Boolean Toolkit
            </span>
          </div>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-4.5 py-5 flex flex-col gap-1.5 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <SidebarItem
              key={link.id}
              title={link.title}
              icon={link.icon}
              active={activeTab === link.id}
              onClick={() => handleTabChange(link.id)}
            />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-[10px] font-semibold text-slate-500 text-center uppercase tracking-widest font-mono">
          Workora v4.9.0
        </div>
      </aside>

      {/* 2. MOBILE SIDEBAR DRAWER OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Sidebar drawer body */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.22 }}
              className="relative w-64 max-w-xs bg-slate-900 border-r border-slate-800 flex flex-col h-full"
            >
              <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-sm flex items-center justify-center">
                    <Lucide.SearchCode className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-sm text-white uppercase tracking-wider font-display">
                    Workora
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none"
                >
                  <Lucide.X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-5 flex flex-col gap-1 overflow-y-auto">
                {sidebarLinks.map((link) => (
                  <SidebarItem
                    key={link.id}
                    title={link.title}
                    icon={link.icon}
                    active={activeTab === link.id}
                    onClick={() => {
                      handleTabChange(link.id);
                      setMobileMenuOpen(false);
                    }}
                  />
                ))}
              </nav>

              <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-[10px] font-semibold text-slate-500 text-center tracking-wider font-mono">
                Workora Sourcing Toolkit
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CORE PORTAL WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR HEADER */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6.5 shrink-0 transition-colors duration-200 shadow-xs">
          <div className="flex items-center gap-4 min-w-0">
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-850 cursor-pointer lg:hidden focus:outline-none shrink-0"
            >
              <Lucide.Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb indexing */}
            <div className="hidden sm:block min-w-0">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>

          {/* Right utility tray */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle widget */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-750 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer transition-all duration-200 focus:outline-none"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? (
                <Lucide.Moon className="w-4.5 h-4.5" />
              ) : (
                <Lucide.Sun className="w-4.5 h-4.5 text-amber-500" />
              )}
            </button>

            {/* Notification bell utility */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-750 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer relative transition-all focus:outline-none"
                title="Notifications"
              >
                <Lucide.Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
              </button>

              <AnimatePresence>
                {showNotificationMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotificationMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl py-3 z-50 text-xs text-gray-600 dark:text-gray-300"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between font-bold text-gray-950 dark:text-white text-sm">
                        <span>Sourcing Updates</span>
                        <Lucide.BellOff className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="max-h-60 overflow-y-auto py-2">
                        <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-850 flex gap-3 cursor-pointer">
                          <div className="p-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-950 rounded-lg h-fit shrink-0">
                            <Lucide.CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">Workspace initialized</p>
                            <p className="text-[10px] text-gray-400 mt-1 leading-normal">The Sourcing Toolkit has been restructured for recruiters.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <span className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

            {/* Recruiter Email Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 cursor-pointer p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-850 focus:outline-none transition-colors"
                title="parasbelwal15@gmail.com"
              >
                <div className="w-8.5 h-8.5 rounded-full bg-indigo-600 text-white font-bold font-display text-sm flex items-center justify-center border border-white shadow-sm shrink-0">
                  PB
                </div>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl py-2 z-50 text-xs text-gray-600 dark:text-gray-300"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="font-bold text-gray-950 dark:text-white">Paras Belwal</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 select-all truncate font-mono">parasbelwal15@gmail.com</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { handleTabChange('settings'); setShowUserMenu(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-850 flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold cursor-pointer focus:outline-none"
                        >
                          <Lucide.Settings className="w-4 h-4 text-gray-400" />
                          Sourcing Preferences
                        </button>
                        <button
                          onClick={() => { handleTabChange('saved-searches'); setShowUserMenu(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-850 flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold cursor-pointer focus:outline-none"
                        >
                          <Lucide.BookmarkCheck className="w-4 h-4 text-gray-400" />
                          Sourcing Records
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* MAIN VIEWS WORKSPACE CANVAS */}
        <main className="flex-1 p-4 sm:p-6.5 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export const SourcingOrchestrator: React.FC = () => {
  return (
    <BooleanStateProvider>
      <SourcingOrchestratorContent />
    </BooleanStateProvider>
  );
};
