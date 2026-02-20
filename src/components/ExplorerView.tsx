import React, { RefObject } from 'react';
import {
  ActivityStateId,
  WorkFlowStatusId,
  WorkflowActivity,
  WorkflowCommand,
  Language
} from '../types';
import { getStateLabel, getStatusLabel, getCommandLabel } from '../translations';
import { processCommand } from '../engine';
import { getTransitionCount } from '../engine/production-transitions';
import { formatOccurrenceCount } from '../utils/pattern-analysis';

interface StepNode {
  activity: WorkflowActivity;
  selectedCommand?: WorkflowCommand;
}

interface ExplorerViewProps {
  isDark: boolean;
  lang: Language;
  path: StepNode[];
  scrollContainerRef: RefObject<HTMLDivElement>;
  outcomeLabel: string;
  terminalLabel: string;
  stallLabel: string;
  statusThemes: Record<WorkFlowStatusId, { bg: string }>;
  getCommandStatus: (activity: WorkflowActivity, cmd: WorkflowCommand) => { isValid: boolean; type: string };
  onSelectCommand: (stepIndex: number, cmd: WorkflowCommand) => void;
  uiCommands: readonly WorkflowCommand[];
}

const ExplorerView: React.FC<ExplorerViewProps> = ({
  isDark,
  lang,
  path,
  scrollContainerRef,
  outcomeLabel,
  terminalLabel,
  stallLabel,
  statusThemes,
  getCommandStatus,
  onSelectCommand,
  uiCommands,
}) => {
  return (
    <main 
      ref={scrollContainerRef}
      className={`h-full overflow-x-auto flex items-stretch p-12 gap-12 ${isDark ? 'bg-slate-950' : 'bg-gray-100'}`}
    >
      {path.map((node, stepIdx) => {
        const isLast = stepIdx === path.length - 1;
        const isDone = node.activity.workflowStatus === WorkFlowStatusId.DONE;
        const theme = statusThemes[node.activity.workflowStatus];

        return (
          <div key={stepIdx} className="flex items-center gap-12 flex-shrink-0 animate-in slide-in-from-right-4 duration-300">
            <div className={`w-[420px] border rounded-2xl shadow-xl flex flex-col h-full max-h-[850px] relative transition-all duration-300 hover:shadow-2xl overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700 shadow-black/20' : 'bg-white border-gray-200 shadow-gray-300/30'}`}>
              <div className={`h-1.5 w-full ${
                isDone && node.activity.state === ActivityStateId.CANCELLED
                  ? 'bg-red-500'
                  : theme.bg
              }`} />
              <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                <div className="flex flex-col gap-6">
                  <div className="space-y-1">
                    <h3 className={`text-lg font-black leading-tight ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                      {getStateLabel(node.activity.state, lang)}
                    </h3>
                    <p className={`text-sm font-black ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      {getStatusLabel(node.activity.workflowStatus, lang)}
                    </p>
                  </div>
                  <div className={`border-l-2 pl-4 py-0.5 flex flex-col gap-1.5 ${isDark ? 'border-slate-600' : 'border-gray-300'}`}>
                    <div className={`flex items-center gap-2 text-xs font-mono font-bold ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                      <span className="uppercase opacity-60">State:</span>
                      <span className={isDark ? 'text-slate-400' : 'text-gray-700'}>{ActivityStateId[node.activity.state]}</span>
                      <span className={isDark ? 'text-slate-400' : 'text-gray-700'}>({node.activity.state})</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-mono font-bold ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                      <span className="uppercase opacity-60">WK:</span>
                      <span className={isDark ? 'text-slate-400' : 'text-gray-700'}>{WorkFlowStatusId[node.activity.workflowStatus]}</span>
                      <span className={isDark ? 'text-slate-400' : 'text-gray-700'}>({node.activity.workflowStatus})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {!isDone ? (
                  <>
                    {(() => {
                      const validCommands = uiCommands.filter((cmd: WorkflowCommand) => {
                        const { isValid } = getCommandStatus(node.activity, cmd);
                        return isValid;
                      });
                      
                      // Sort commands by occurrence count (descending), but keep Cancel at the end
                      const sortedCommands = [...validCommands].sort((cmdA, cmdB) => {
                        // Always put Cancel and Wrong CP at the end
                        const isResetA = cmdA === 'Cancel' || cmdA === 'RegisterWrongComiteParitaire';
                        const isResetB = cmdB === 'Cancel' || cmdB === 'RegisterWrongComiteParitaire';
                        
                        if (isResetA && !isResetB) return 1;
                        if (!isResetA && isResetB) return -1;
                        
                        // If both are reset commands, keep Cancel after Wrong CP
                        if (isResetA && isResetB) {
                          if (cmdA === 'Cancel') return 1;
                          if (cmdB === 'Cancel') return -1;
                          return 0;
                        }
                        
                        // Get occurrence counts for both commands
                        const resA = processCommand(node.activity, cmdA);
                        const resB = processCommand(node.activity, cmdB);
                        
                        const countA = getTransitionCount(
                          node.activity.state,
                          node.activity.workflowStatus,
                          resA.nextState,
                          resA.nextStatus
                        );
                        
                        const countB = getTransitionCount(
                          node.activity.state,
                          node.activity.workflowStatus,
                          resB.nextState,
                          resB.nextStatus
                        );
                        
                        // Sort by count descending (higher count first)
                        return countB - countA;
                      });
                      
                      const count = validCommands.length;
                      
                      return (
                        <>
                          <div className={`flex items-center justify-between mb-4`}>
                            <div className={`text-xs font-bold uppercase tracking-widest pl-1 border-l-2 ml-1 ${isDark ? 'text-slate-500 border-slate-700' : 'text-gray-500 border-gray-300'}`}>
                              {outcomeLabel}
                            </div>
                            <div className={`text-xs font-mono font-black px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'}`}>
                              {count}
                            </div>
                          </div>
                          {sortedCommands.map((cmd: WorkflowCommand) => {
                            const { isValid, type } = getCommandStatus(node.activity, cmd);
                            if (!isValid) return null;

                            const isSelected = node.selectedCommand === cmd;
                            const isCancel = cmd === 'Cancel';
                            const isWrongCP = cmd === 'RegisterWrongComiteParitaire';
                            const nextRes = processCommand(node.activity, cmd);
                            
                            // Get occurrence count for this transition
                            const occurrenceCount = getTransitionCount(
                              node.activity.state,
                              node.activity.workflowStatus,
                              nextRes.nextState,
                              nextRes.nextStatus
                            );
                            
                            let style = isDark 
                              ? "border-slate-700 hover:border-slate-500 text-slate-300 bg-slate-800/50 hover:bg-slate-700"
                              : "border-gray-300 hover:border-gray-400 text-gray-700 bg-gray-50 hover:bg-gray-100";
                            let badge = null;

                            if (isCancel) {
                              style = isDark 
                                ? "bg-red-950/50 border-red-800/40 text-red-300 hover:border-red-700"
                                : "bg-red-50 border-red-300 text-red-700 hover:border-red-400 hover:bg-red-100";
                              badge = <span className={isDark ? "bg-red-700 text-red-100 text-[10px] px-2 py-1 rounded uppercase font-bold" : "bg-red-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold"}>Stop</span>;
                            } else if (isWrongCP) {
                              style = isDark 
                                ? "bg-purple-950/50 border-purple-800/40 text-purple-300 hover:border-purple-700"
                                : "bg-purple-50 border-purple-300 text-purple-700 hover:border-purple-400 hover:bg-purple-100";
                              badge = <span className={isDark ? "bg-purple-700 text-purple-100 text-[10px] px-2 py-1 rounded uppercase font-bold" : "bg-purple-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold"}>🔄 Reset</span>;
                            } else if (type === 'TERMINAL') {
                              style = isDark
                                ? "border-orange-700/40 text-orange-300 hover:border-orange-600 bg-orange-950/50"
                                : "border-orange-400 text-orange-800 hover:border-orange-500 bg-orange-50 hover:bg-orange-100";
                              badge = <span className={isDark ? "bg-orange-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold" : "bg-orange-500 text-white text-[10px] px-2 py-1 rounded uppercase font-bold"}>🏁 {terminalLabel}</span>;
                            } else if (type === 'STALL') {
                              style = isDark
                                ? "border-amber-700/40 text-amber-300 hover:border-amber-600 bg-amber-950/50"
                                : "border-amber-400 text-amber-800 hover:border-amber-500 bg-amber-50 hover:bg-amber-100";
                              badge = <span className={isDark ? "bg-amber-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold" : "bg-amber-500 text-white text-[10px] px-2 py-1 rounded uppercase font-bold"}>⚠️ {stallLabel}</span>;
                            }

                            if (isSelected) {
                              style = "bg-blue-500 border-blue-500 text-white ring-4 ring-blue-500/20 shadow-lg";
                            }

                            const nextStateKey = ActivityStateId[nextRes.nextState];
                            const nextStateId = nextRes.nextState;
                            const nextWfKey = WorkFlowStatusId[nextRes.nextStatus];
                            const nextWfId = nextRes.nextStatus;

                            const technicalTagStyles = isSelected 
                              ? "bg-white/20 text-white border border-white/30" 
                              : isDark 
                                ? "bg-slate-600 text-slate-300 border border-slate-500"
                                : "bg-gray-200 text-gray-700 border border-gray-400";

                            return (
                              <button
                                key={cmd}
                                onClick={() => onSelectCommand(stepIdx, cmd)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex flex-col gap-3 relative group ${style}`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                      <span className="text-xs font-black uppercase tracking-tight leading-tight">
                                        {getCommandLabel(cmd, lang)}
                                      </span>
                                      {badge}
                                    </div>
                                    {occurrenceCount > 0 && (
                                      <div className={`text-[9px] font-mono ${isSelected ? 'text-white/80' : isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        {formatOccurrenceCount(occurrenceCount)} occurrences
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className={`p-3 rounded-lg border flex flex-col gap-2 ${isSelected ? 'bg-white/10 border-white/20' : isDark ? 'bg-slate-700/50 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className={`text-[10px] font-black truncate ${isSelected ? 'text-white' : isDark ? 'text-slate-200' : 'text-gray-900'}`}>
                                        {getStateLabel(nextRes.nextState, lang)}
                                      </span>
                                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded shadow-sm flex-shrink-0 ${technicalTagStyles}`}>
                                        {nextStateKey} ({nextStateId})
                                      </span>
                                    </div>
                                  </div>
                                  <div className={`flex flex-col gap-1 border-t pt-2 ${isSelected ? 'border-white/20' : isDark ? 'border-slate-700/50' : 'border-gray-200'}`}>
                                    <div className="flex items-center justify-between gap-2">
                                      <span className={`text-[10px] font-black truncate ${isSelected ? 'text-white' : isDark ? 'text-slate-200' : 'text-gray-900'}`}>
                                        {getStatusLabel(nextRes.nextStatus, lang)}
                                      </span>
                                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded shadow-sm flex-shrink-0 ${technicalTagStyles}`}>
                                        {nextWfKey} ({nextWfId})
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <div className={`h-full flex flex-col items-center justify-center text-center p-8 rounded-xl border-2 border-dashed ${
                    node.activity.state === ActivityStateId.CANCELLED
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-green-500/10 border-green-500/20'
                  }`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner ${
                      node.activity.state === ActivityStateId.CANCELLED
                        ? 'bg-red-500/20'
                        : 'bg-green-500/20'
                    }`}>
                      {node.activity.state === ActivityStateId.CANCELLED ? '🚫' : '🏁'}
                    </div>
                    <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{terminalLabel}</h4>
                    <div className="mt-4 space-y-2">
                      <div className={`inline-block px-2 py-0.5 text-white text-[9px] font-mono font-black rounded uppercase ${
                        node.activity.state === ActivityStateId.CANCELLED
                          ? 'bg-red-600'
                          : 'bg-green-600'
                      }`}>
                        STATUS: {node.activity.workflowStatus}
                      </div>
                      <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{getStatusLabel(node.activity.workflowStatus, lang)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {!isLast && (
              <div className="flex-shrink-0 w-12 flex items-center justify-center">
                <svg className={`w-12 h-12 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </main>
  );
};

export default ExplorerView;
