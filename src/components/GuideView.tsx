import React from 'react';
import {
  ActivityStateId,
  WorkFlowStatusId,
  CommitteeType,
  WorkflowCommand,
  Language
} from '../types';
import { getStateLabel, getStatusLabel, getCommandLabel, getCommitteeLabel } from '../translations';
import { COMMITTEE_STATES } from '../engine';

interface TransitionRule {
  committee: CommitteeType;
  fromState: ActivityStateId;
  fromStatus: WorkFlowStatusId;
  command: WorkflowCommand;
  toState: ActivityStateId;
  toStatus: WorkFlowStatusId;
}

interface GuideViewProps {
  isDark: boolean;
  lang: Language;
  committeeType: CommitteeType;
  targetState: string;
  targetWorkflow: WorkFlowStatusId | 'ALL';
  possibleWorkflowsForState: WorkFlowStatusId[];
  filteredRules: TransitionRule[];
  statusThemes: Record<WorkFlowStatusId, { bg: string }>;
  targetStateLabel: string;
  targetWorkflowLabel: string;
  allStatesLabel: string;
  allWorkflowsLabel: string;
  preconditionLabel: string;
  actionLabel: string;
  targetReachedLabel: string;
  selectTargetStatePrompt: string;
  noRoutesFound: string;
  onTargetStateChange: (state: string) => void;
  onTargetWorkflowChange: (workflow: WorkFlowStatusId | 'ALL') => void;
  onNavigateToState: (state: ActivityStateId, workflow: WorkFlowStatusId) => void;
}

const GuideView: React.FC<GuideViewProps> = ({
  isDark,
  lang,
  committeeType,
  targetState,
  targetWorkflow,
  possibleWorkflowsForState,
  filteredRules,
  statusThemes,
  targetStateLabel,
  targetWorkflowLabel,
  allStatesLabel,
  allWorkflowsLabel,
  preconditionLabel,
  actionLabel,
  targetReachedLabel,
  selectTargetStatePrompt,
  noRoutesFound,
  onTargetStateChange,
  onTargetWorkflowChange,
  onNavigateToState,
}) => {
  return (
    <main className={`h-full flex flex-col ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Filters Section */}
      <div className={`border-b p-8 grid grid-cols-2 gap-6 shadow-inner relative z-10 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="space-y-2">
          <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
            {targetStateLabel}
          </label>
          <select 
            value={targetState} 
            onChange={(e) => onTargetStateChange(e.target.value)}
            className={`w-full border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="ALL">{allStatesLabel}</option>
            {COMMITTEE_STATES[committeeType].map((id: ActivityStateId) => (
              <option key={id} value={id}>{getStateLabel(id, lang)} ({ActivityStateId[id]})</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
            {targetWorkflowLabel}
          </label>
          <select 
            value={targetWorkflow} 
            onChange={(e) => onTargetWorkflowChange(e.target.value as any)}
            disabled={targetState === 'ALL'}
            className={`w-full border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200 disabled:bg-slate-800/50 disabled:text-slate-500' : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400'}`}
          >
            <option value="ALL">{allWorkflowsLabel}</option>
            {possibleWorkflowsForState.map(status => (
              <option key={status} value={status}>{getStatusLabel(status, lang)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className={`flex-1 overflow-y-auto p-12 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
          {targetState === 'ALL' ? (
            <div className={`py-24 flex flex-col items-center ${isDark ? 'text-slate-700' : 'text-gray-400'}`}>
              <svg className="w-20 h-20 mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-bold text-lg opacity-50">{selectTargetStatePrompt}</p>
            </div>
          ) : filteredRules.length > 0 ? filteredRules.map((rule, idx) => {
            const toTheme = statusThemes[rule.toStatus];
            
            return (
              <div key={idx} className={`group border rounded-3xl overflow-hidden hover:shadow-xl transition-all flex items-stretch animate-in fade-in duration-300 ${isDark ? 'border-slate-800 hover:shadow-black/20 hover:border-slate-600' : 'border-gray-200 hover:shadow-gray-300/50 hover:border-gray-300'}`}>
                {/* Source Side */}
                <button 
                  onClick={() => onNavigateToState(rule.fromState, rule.fromStatus)}
                  className={`w-[35%] p-8 border-r flex flex-col justify-center text-left transition-all ${isDark ? 'border-slate-800 bg-slate-800/50 hover:bg-slate-800' : 'border-gray-200 bg-gray-100 hover:bg-gray-200'}`}
                >
                  <div className={`text-[10px] font-black uppercase mb-6 tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                    {preconditionLabel}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${isDark ? 'bg-slate-200 text-slate-900' : 'bg-blue-600 text-white'}`}>
                        {getCommitteeLabel(rule.committee, lang)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className={`text-sm font-black leading-tight ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                        {getStateLabel(rule.fromState, lang)}
                      </div>
                      <div className={`text-[11px] font-black ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        {getStatusLabel(rule.fromStatus, lang)}
                      </div>
                    </div>
                    <div className={`text-[9px] font-mono font-bold uppercase ${isDark ? 'text-slate-600' : 'text-gray-500'}`}>
                      COORD: {ActivityStateId[rule.fromState]} ({rule.fromState}) - {WorkFlowStatusId[rule.fromStatus]} ({rule.fromStatus})
                    </div>
                  </div>
                </button>

                {/* Bridge (Action) */}
                <div className={`flex-1 p-8 flex flex-col justify-center items-center relative ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                  <div className={`text-[10px] font-black uppercase mb-6 tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                    {actionLabel}
                  </div>
                  <div className="flex flex-col items-center gap-4 relative z-10">
                    <div className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-transform group-hover:scale-105 ${isDark ? 'bg-slate-200 text-slate-900' : 'bg-blue-600 text-white'}`}>
                      {getCommandLabel(rule.command, lang)}
                    </div>
                    <svg className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                {/* Result Side */}
                <button
                  onClick={() => onNavigateToState(rule.toState, rule.toStatus)}
                  className={`w-[35%] p-8 border-l flex flex-col justify-center text-right transition-all ${isDark ? `border-slate-800 ${toTheme.bg.replace('bg-', 'bg-')}/20 hover:${toTheme.bg.replace('bg-', 'bg-')}/30` : `border-gray-200 ${toTheme.bg.replace('bg-', 'bg-')}/10 hover:${toTheme.bg.replace('bg-', 'bg-')}/20`}`}
                >
                  <div className={`text-[10px] font-black uppercase mb-6 tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                    {targetReachedLabel}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className={`text-base font-black leading-tight ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                        {getStateLabel(rule.toState, lang)}
                      </div>
                      <div className={`inline-block px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider ${toTheme.bg} text-white`}>
                        {getStatusLabel(rule.toStatus, lang)}
                      </div>
                    </div>
                    <div className={`text-[10px] font-mono font-black pt-2 border-t inline-block uppercase ${isDark ? 'text-slate-500 border-slate-700/50' : 'text-gray-500 border-gray-300'}`}>
                      TARGET: {ActivityStateId[rule.toState]} ({rule.toState}) - {WorkFlowStatusId[rule.toStatus]} ({rule.toStatus})
                    </div>
                  </div>
                </button>
              </div>
            );
          }) : (
            <div className={`py-24 flex flex-col items-center ${isDark ? 'text-slate-700' : 'text-gray-400'}`}>
              <svg className="w-20 h-20 mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-bold text-lg opacity-50">{noRoutesFound}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default GuideView;
