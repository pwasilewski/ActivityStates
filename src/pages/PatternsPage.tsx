import React, { useState, useEffect, useMemo } from 'react';
import { Language, ActivityStateId } from '../types';
import { Pattern, loadPatterns, filterPatterns, formatOccurrenceCount } from '../utils/pattern-analysis';
import { getStateLabel, getStatusLabel, getUIText } from '../translations';

interface PatternsPageProps {
  isDark: boolean;
  lang: Language;
  onSimulatePattern: (pattern: Pattern) => void;
}

const PatternsPage: React.FC<PatternsPageProps> = ({
  isDark,
  lang,
  onSimulatePattern,
}) => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [minOccurrences, setMinOccurrences] = useState(0);
  const [minLength, setMinLength] = useState(2);
  const [maxLength, setMaxLength] = useState(19);
  const [selectedState, setSelectedState] = useState<ActivityStateId | undefined>();
  const [expandedPatterns, setExpandedPatterns] = useState<Set<string>>(new Set());
  
  const t = getUIText(lang);

  useEffect(() => {
    loadPatterns().then(data => {
      setPatterns(data);
      setLoading(false);
    });
  }, []);
  
  const filteredPatterns = useMemo(() => {
    return filterPatterns(patterns, {
      minOccurrences,
      minLength,
      maxLength,
      state: selectedState
    });
  }, [patterns, minOccurrences, minLength, maxLength, selectedState]);
  
  const totalOccurrences = useMemo(() => {
    return filteredPatterns.reduce((sum, p) => sum + p.occurrenceCount, 0);
  }, [filteredPatterns]);
  
  const handlePatternClick = (pattern: Pattern) => {
    onSimulatePattern(pattern);
  };

  const toggleExpand = (patternId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedPatterns);
    if (newExpanded.has(patternId)) {
      newExpanded.delete(patternId);
    } else {
      newExpanded.add(patternId);
    }
    setExpandedPatterns(newExpanded);
  };

  if (loading) {
    return (
      <div className={`h-full flex items-center justify-center ${
        isDark ? 'bg-slate-900 text-slate-200' : 'bg-gray-50 text-gray-800'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>Loading patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Filters Section - Matching GuideView style */}
      <div className={`border-b p-8 grid grid-cols-3 gap-6 shadow-inner relative z-10 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="space-y-2">
          <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
            {t.minOccurrences}: {formatOccurrenceCount(minOccurrences)}
          </label>
          <div className="flex items-center h-[52px]">
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={minOccurrences}
              onChange={(e) => setMinOccurrences(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: isDark 
                  ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(minOccurrences / 10000) * 100}%, #334155 ${(minOccurrences / 10000) * 100}%, #334155 100%)`
                  : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(minOccurrences / 10000) * 100}%, #e5e7eb ${(minOccurrences / 10000) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
            {t.patternLength}: {minLength}-{maxLength}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="2"
              max="19"
              value={minLength}
              onChange={(e) => setMinLength(Math.min(Number(e.target.value), maxLength))}
              className={`w-full border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-300 text-gray-900'}`}
            />
            <input
              type="number"
              min="2"
              max="19"
              value={maxLength}
              onChange={(e) => setMaxLength(Math.max(Number(e.target.value), minLength))}
              className={`w-full border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
            {t.filterByState}
          </label>
          <select
            value={selectedState ?? ''}
            onChange={(e) => setSelectedState(e.target.value ? Number(e.target.value) as ActivityStateId : undefined)}
            className={`w-full border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="">{t.allStates}</option>
            {Object.values(ActivityStateId)
              .filter(v => typeof v === 'number')
              .map(stateId => (
                <option key={stateId} value={stateId}>
                  {getStateLabel(stateId as ActivityStateId, lang)}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Pattern List */}
      <div className={`flex-1 overflow-y-auto p-12 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-[1920px] mx-auto">
          <div className={`mb-6 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            <p className="text-sm font-bold">
              {filteredPatterns.length} {t.patternsCount} • {formatOccurrenceCount(totalOccurrences)} {t.totalOccurrences}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPatterns.map((pattern, idx) => {
              const percentage = (pattern.occurrenceCount / totalOccurrences) * 100;
              const isExpanded = expandedPatterns.has(pattern.id);
              const maxStepsToShow = 7;
              const hasMore = pattern.steps.length > maxStepsToShow;
              const stepsToDisplay = isExpanded ? pattern.steps : pattern.steps.slice(0, maxStepsToShow);
              
              return (
                <div
                  key={`${pattern.id}-${idx}`}
                  className={`p-4 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-black/20'
                      : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg'
                  }`}
                >
                  {/* Header */}
                  <div 
                    onClick={() => handlePatternClick(pattern)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                          isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          #{idx + 1}
                        </span>
                        <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                          {pattern.length} {t.steps}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-black ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>
                          {formatOccurrenceCount(pattern.occurrenceCount)}
                        </div>
                        <div className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2 mb-3">
                      {stepsToDisplay.map((step, stepIdx) => {
                        const isFirst = stepIdx === 0;
                        const isActualLast = stepIdx === pattern.steps.length - 1;
                        const isDisplayLast = stepIdx === stepsToDisplay.length - 1;
                        const isDone = step.status === 5;
                        
                        let icon = '○';
                        let iconColor = isDark ? 'text-blue-400' : 'text-blue-500';
                        
                        if (isFirst) {
                          icon = '▶';
                          iconColor = isDark ? 'text-green-400' : 'text-green-600';
                        } else if (isDone) {
                          icon = '■';
                          iconColor = isDark ? 'text-red-400' : 'text-red-600';
                        } else if (isActualLast) {
                          icon = '◉';
                          iconColor = isDark ? 'text-orange-400' : 'text-orange-600';
                        }
                        
                        return (
                          <div key={stepIdx}>
                            <div className="flex items-start gap-2">
                              <span className={`text-sm font-bold ${iconColor} flex-shrink-0 mt-0.5`}>
                                {icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className={`text-xs font-bold leading-tight truncate ${
                                  isDark ? 'text-slate-200' : 'text-gray-900'
                                }`}>
                                  {getStateLabel(step.state, lang)}
                                </div>
                                <div className={`text-[10px] truncate ${
                                  isDark ? 'text-slate-400' : 'text-gray-600'
                                }`}>
                                  {getStatusLabel(step.status, lang)}
                                </div>
                              </div>
                            </div>
                            {!isDisplayLast && (
                              <div className={`ml-1.5 my-0.5 border-l-2 h-2 ${
                                isDark ? 'border-slate-700' : 'border-gray-300'
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expand/Collapse button */}
                  {hasMore && (
                    <button
                      onClick={(e) => toggleExpand(pattern.id, e)}
                      className={`w-full text-xs font-bold py-1.5 rounded-lg mb-3 transition-colors ${
                        isDark
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isExpanded ? `▲ ${t.showLess}` : `▼ ${t.showMore} ${pattern.steps.length - maxStepsToShow}`}
                    </button>
                  )}

                  {/* Progress bar */}
                  <div className={`h-1.5 rounded-full overflow-hidden ${
                    isDark ? 'bg-slate-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            
            {filteredPatterns.length === 0 && (
              <div className={`col-span-full py-24 flex flex-col items-center ${isDark ? 'text-slate-700' : 'text-gray-400'}`}>
                <svg className="w-20 h-20 mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-bold text-lg opacity-50">{t.noMatchingPatterns}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternsPage;
