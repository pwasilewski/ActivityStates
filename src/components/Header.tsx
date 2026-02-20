import React from 'react';
import { Language } from '../types';

interface HeaderProps {
  isDark: boolean;
  lang: Language;
  viewMode: 'explorer' | 'guide' | 'patterns';
  title: string;
  guideTitle: string;
  desc: string;
  guideDesc: string;
  explorerLabel: string;
  guideLabel: string;
  patternsLabel: string;
  onViewModeChange: (mode: 'explorer' | 'guide' | 'patterns') => void;
  onLanguageChange: (lang: Language) => void;
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isDark,
  lang,
  viewMode,
  title,
  guideTitle,
  desc,
  guideDesc,
  explorerLabel,
  guideLabel,
  patternsLabel,
  onViewModeChange,
  onLanguageChange,
  onThemeToggle,
}) => {
  return (
    <header className={`border-b px-8 py-4 flex justify-between items-center flex-shrink-0 z-20 shadow-md ${isDark ? 'bg-slate-800 border-slate-700 shadow-black/20' : 'bg-white border-gray-200 shadow-gray-200/50'}`}>
      <div className="flex items-center gap-10">
        <div>
          <h1 className={`text-xl font-black flex items-center gap-3 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
            {viewMode === 'explorer' ? title : viewMode === 'guide' ? guideTitle : patternsLabel}
          </h1>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
            {viewMode === 'explorer' ? desc : viewMode === 'guide' ? guideDesc : 'Production Data Analysis'}
          </p>
        </div>

        <nav className={`flex p-1 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
          <button 
            onClick={() => onViewModeChange('explorer')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'explorer' ? (isDark ? 'bg-slate-700 shadow-sm text-slate-100' : 'bg-white shadow-sm text-gray-900') : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-900')}`}
          >
            {explorerLabel}
          </button>
          <button 
            onClick={() => onViewModeChange('guide')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'guide' ? (isDark ? 'bg-slate-700 shadow-sm text-slate-100' : 'bg-white shadow-sm text-gray-900') : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-900')}`}
          >
            {guideLabel}
          </button>
          <button 
            onClick={() => onViewModeChange('patterns')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'patterns' ? (isDark ? 'bg-slate-700 shadow-sm text-slate-100' : 'bg-white shadow-sm text-gray-900') : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-900')}`}
          >
            {patternsLabel}
          </button>
        </nav>
      </div>
      
      <div className="flex items-center gap-6">
        <div className={`flex rounded-lg p-1 border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
          {(['FR', 'NL', 'EN'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => onLanguageChange(l)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${
                lang === l ? (isDark ? 'bg-slate-700 text-slate-100 shadow-sm' : 'bg-white text-gray-900 shadow-sm') : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-500 hover:text-gray-900')
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className={`flex rounded-lg p-1 border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
          <button
            onClick={onThemeToggle}
            className={`px-4 py-1.5 rounded-md transition-all ${isDark ? 'text-yellow-400 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-200'}`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
