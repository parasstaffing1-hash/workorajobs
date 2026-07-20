import React, { useState, useEffect, useRef } from 'react';
import * as Lucide from 'lucide-react';
import { roleLibrary } from '../engines/RoleLibrary';
import { skillLibrary } from '../engines/SkillLibrary';
import certificationsJson from '../data/certifications.json';
import companiesJson from '../data/companies.json';

interface AutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  type: 'roles' | 'skills' | 'companies' | 'certifications' | 'locations';
  placeholder?: string;
  label: string;
  icon?: keyof typeof Lucide;
  required?: boolean;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  type,
  placeholder,
  label,
  icon,
  required = false,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const IconComponent = icon ? (Lucide[icon] as React.ComponentType<{ className?: string }>) : null;

  // Static list for companies
  const companyList = companiesJson as string[];
  // Static list for certifications
  const certList = (certificationsJson as { name: string; abbreviation: string; synonyms: string[] }[]).reduce<string[]>((acc, c) => {
    acc.push(c.name);
    if (c.abbreviation && !acc.includes(c.abbreviation)) {
      acc.push(c.abbreviation);
    }
    return acc;
  }, []);
  // Popular locations
  const locationList = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
    'India', 'London', 'New York', 'San Francisco', 'Paris', 'Berlin', 'Munich',
    'Remote', 'Hybrid', 'On-site', 'Singapore', 'Amsterdam', 'Toronto', 'Austin'
  ];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    // Find the word after the last comma
    const parts = val.split(',');
    const activePart = parts[parts.length - 1].trim();
    setCurrentWord(activePart);

    if (activePart.length >= 2) {
      let filtered: string[] = [];
      const query = activePart.toLowerCase();

      if (type === 'roles') {
        filtered = roleLibrary.searchRoles(query).slice(0, 8);
      } else if (type === 'skills') {
        filtered = skillLibrary.searchSkills(query).slice(0, 8);
      } else if (type === 'companies') {
        filtered = companyList.filter(c => c.toLowerCase().includes(query)).slice(0, 8);
      } else if (type === 'certifications') {
        filtered = certList.filter(c => c.toLowerCase().includes(query)).slice(0, 8);
      } else if (type === 'locations') {
        filtered = locationList.filter(l => l.toLowerCase().includes(query)).slice(0, 8);
      }

      setSuggestions(filtered);
      setActiveSuggestionIndex(0);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const parts = value.split(',');
    // Replace the last part with selected suggestion
    parts[parts.length - 1] = ` ${suggestion}`;
    const newValue = parts.join(',').trim() + ', ';
    onChange(newValue);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (suggestions[activeSuggestionIndex]) {
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono flex items-center justify-between">
        <span>
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {type !== 'locations' && (
          <span className="text-[8px] text-indigo-500 font-bold lowercase">
            [dict active]
          </span>
        )}
      </label>
      <div className="relative">
        {IconComponent && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            <IconComponent className="w-4 h-4" />
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-all py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500
            ${IconComponent ? 'pl-10' : ''}
          `}
        />

        {showSuggestions && (
          <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl shadow-xl max-h-52 overflow-y-auto font-sans">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors
                  ${idx === activeSuggestionIndex
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }
                `}
              >
                <span>{suggestion}</span>
                <span className="text-[9px] text-gray-400 font-normal">Press Enter</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
