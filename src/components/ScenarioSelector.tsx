import React from 'react';
import { CommitteeType, Language } from '../types';
import { getCommitteeLabel } from '../translations';

interface ScenarioSelectorProps {
  isDark: boolean;
  lang: Language;
  committeeType: CommitteeType;
  scenarioLabel: string;
  resetLabel: string;
  onCommitteeChange: (committee: CommitteeType) => void;
  onReset: () => void;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  isDark,
  lang,
  committeeType,
  scenarioLabel,
  resetLabel,
  onCommitteeChange,
  onReset,
}) => {
  return (
    <div className={`border-b px-8 py-3 flex justify-between items-center flex-shrink-0 z-10 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
            {scenarioLabel}:
          </span>
          <div className={`flex rounded-lg p-1 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
            {(['STANDARD CP', 'EE', 'DENTIST'] as CommitteeType[]).map(committee => (
              <button
                key={committee}
                onClick={() => onCommitteeChange(committee)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${
                  committeeType === committee 
                    ? (isDark ? 'bg-slate-200 text-slate-900 shadow-sm' : 'bg-blue-600 text-white shadow-sm') 
                    : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-900')
                }`}
              >
                {getCommitteeLabel(committee, lang)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={onReset}
        className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors border uppercase tracking-widest ${isDark ? 'text-red-500 hover:bg-red-500/10 border-transparent hover:border-red-500/20' : 'text-red-600 hover:bg-red-50 border-transparent hover:border-red-200'}`}
      >
        {resetLabel}
      </button>
    </div>
  );
};

export default ScenarioSelector;
