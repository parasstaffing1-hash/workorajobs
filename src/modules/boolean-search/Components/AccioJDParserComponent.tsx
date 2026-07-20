import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import {
  normalizeJdText,
  extractTitle,
  extractSkills,
  generateSearchStrings,
  GeneratedSearchString
} from '../Utils/accioJdParser';

interface AccioJDParserComponentProps {
  onAutoFillForm?: (title: string, required: string[], optional: string[]) => void;
}

export const AccioJDParserComponent: React.FC<AccioJDParserComponentProps> = ({ onAutoFillForm }) => {
  const [jdText, setJdText] = useState('');
  const [detectedTitle, setDetectedTitle] = useState('');
  const [keywords, setKeywords] = useState<{ text: string; on: boolean }[]>([]);
  const [customKeyword, setCustomKeyword] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = () => {
    const raw = jdText.trim();
    if (!raw) return;

    const normalized = normalizeJdText(raw);
    const title = extractTitle(normalized);
    const extracted = extractSkills(normalized).map(k => ({ text: k.text, on: true }));

    // Filter out title words from keywords list if duplicate
    let filteredKeywords = extracted;
    if (title) {
      const lowerTitle = title.toLowerCase();
      filteredKeywords = extracted.filter(k => !lowerTitle.includes(k.text.toLowerCase()) || k.text.length > lowerTitle.length);
    }

    setDetectedTitle(title);
    setKeywords(filteredKeywords);
    setHasGenerated(true);

    // Optionally auto-fill the main form
    if (onAutoFillForm) {
      const req = filteredKeywords.slice(0, 5).map(k => k.text);
      const opt = filteredKeywords.slice(5, 10).map(k => k.text);
      onAutoFillForm(title, req, opt);
    }
  };

  const handleClear = () => {
    setJdText('');
    setDetectedTitle('');
    setKeywords([]);
    setCustomKeyword('');
    setHasGenerated(false);
  };

  const toggleKeyword = (index: number) => {
    setKeywords(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], on: !copy[index].on };
      return copy;
    });
  };

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = customKeyword.trim();
    if (!val) return;

    if (!keywords.some(k => k.text.toLowerCase() === val.toLowerCase())) {
      setKeywords(prev => [{ text: val, on: true }, ...prev]);
    }
    setCustomKeyword('');
  };

  const copyToClipboard = async (strId: string, text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedId(strId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const searchStrings: GeneratedSearchString[] = hasGenerated
    ? generateSearchStrings(detectedTitle, keywords)
    : [];

  return (
    <div className="space-y-5">
      {/* Input Box Card */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 font-sans">
            <Lucide.FileText className="w-4 h-4 text-indigo-500" />
            Job Description
          </label>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-gray-400">
              {jdText.length ? `${jdText.length.toLocaleString()} characters` : ''}
            </span>
            {jdText.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        <textarea
          value={jdText}
          onChange={e => setJdText(e.target.value)}
          placeholder="Paste the full job description here...&#10;&#10;Example: We are hiring a Senior Java Developer with 5+ years of experience in Spring Boot, Microservices, AWS and Kubernetes. Knowledge of React and CI/CD is a plus..."
          className="w-full h-44 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-all p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 leading-relaxed resize-none font-sans"
        />

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!jdText.trim()}
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Lucide.Zap className="w-4 h-4 text-amber-300" />
            <span>Generate Strings</span>
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            className="py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Keywords Chips & Custom Adder */}
      {hasGenerated && (
        <div className="p-4 bg-gray-50/70 dark:bg-gray-950/50 border border-gray-200/80 dark:border-gray-850 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
              Detected Keywords — Click to Toggle (or add your own)
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            {detectedTitle && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full">
                <Lucide.Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                {detectedTitle}
              </span>
            )}

            {keywords.map((k, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleKeyword(idx)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  k.on
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                    : 'bg-gray-100 dark:bg-gray-900 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 opacity-60'
                }`}
              >
                <span>{k.text}</span>
                <span className="text-[10px] font-bold">{k.on ? '×' : '+'}</span>
              </button>
            ))}
          </div>

          {/* Add custom keyword */}
          <form onSubmit={handleAddCustom} className="flex gap-2 pt-1">
            <input
              type="text"
              value={customKeyword}
              onChange={e => setCustomKeyword(e.target.value)}
              placeholder="Add keyword (e.g. Terraform) and press Enter"
              className="flex-1 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none"
            />
            <button
              type="submit"
              className="py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              Add
            </button>
          </form>
          
          <p className="text-[9px] text-gray-400 font-mono">
            Strings update instantly as you toggle keywords. The first keyword/star is treated as the primary job title.
          </p>
        </div>
      )}

      {/* Generated Search Strings Cards */}
      {hasGenerated && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-gray-500">
            Generated Boolean Search Strings
          </h3>

          {searchStrings.map(item => (
            <div
              key={item.id}
              className="p-3.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="text-[10px] text-gray-400">{item.meta} • {item.str.length} chars</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(item.id, item.str)}
                  className={`text-[10px] font-bold py-1 px-3 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                    copiedId === item.id
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-300'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-indigo-500'
                  }`}
                >
                  {copiedId === item.id ? (
                    <>
                      <Lucide.Check className="w-3 h-3 text-emerald-500" />
                      <span>Copied ✓</span>
                    </>
                  ) : (
                    <>
                      <Lucide.Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-lg text-xs font-mono text-gray-800 dark:text-gray-200 break-words whitespace-pre-wrap leading-relaxed select-all">
                {item.str || <span className="text-gray-400 italic">No search string generated yet. Select keywords above.</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
