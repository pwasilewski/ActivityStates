import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ActivityStateId, 
  WorkFlowStatus, 
  CommitteeType, 
  WorkflowActivity, 
  WorkflowCommand,
  Language
} from './types.ts';
import { 
  processCommand, 
  UI_COMMANDS, 
  getStateLabel, 
  getStatusLabel,
  getCommandLabel,
  getWorkflowStatusId,
  getCommitteeLabel,
  COMMITTEE_STATES
} from './engine.ts';

interface StepNode {
  activity: WorkflowActivity;
  selectedCommand?: WorkflowCommand;
}

type ViewMode = 'explorer' | 'guide';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved !== 'light';
  });
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'FR' || saved === 'NL' || saved === 'EN') ? saved as Language : 'FR';
  });
  const [viewMode, setViewMode] = useState<ViewMode>('explorer');
  const [committeeType, setCommitteeType] = useState<CommitteeType>('STANDARD CP');
  
  // Explorer State (Restored exactly from original snippet)
  const [path, setPath] = useState<StepNode[]>([
    { 
      activity: { 
        state: ActivityStateId.REQUESTED, 
        workflowStatus: WorkFlowStatus.READY_FOR_AGENDA, 
        committee: 'STANDARD CP' 
      } 
    }
  ]);

  // Reference Guide State (The New Page Filters)
  const [targetState, setTargetState] = useState<string>('ALL');
  const [targetWorkflow, setTargetWorkflow] = useState<WorkFlowStatus | 'ALL'>('ALL');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('language', lang);
  }, [lang]);

  useEffect(() => {
    if (viewMode === 'explorer' && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [path, viewMode]);

  const changeWorkflow = (committee: CommitteeType) => {
    setCommitteeType(committee);
    setPath([{ 
      activity: { 
        state: ActivityStateId.REQUESTED, 
        workflowStatus: WorkFlowStatus.READY_FOR_AGENDA, 
        committee: committee 
      } 
    }]);
  };

  const hasProductiveActions = (act: WorkflowActivity): boolean => {
    if (act.workflowStatus === WorkFlowStatus.DONE) return false;
    return UI_COMMANDS.some(cmd => {
      if (cmd === 'Cancel' || cmd === 'NewRequest') return false;
      const res = processCommand(act, cmd);
      return !res.error && (res.nextState !== act.state || res.nextStatus !== act.workflowStatus);
    });
  };

  const getCommandStatus = (activity: WorkflowActivity, cmd: WorkflowCommand) => {
    if (cmd === 'NewRequest') return { isValid: false, type: 'INVALID' };

    const res = processCommand(activity, cmd);
    const isValid = !res.error && (res.nextState !== activity.state || res.nextStatus !== activity.workflowStatus);
    
    if (!isValid) return { isValid: false, type: 'INVALID' };
    
    // Check if the resulting state is allowed for the current committee type
    const allowedStates = COMMITTEE_STATES[activity.committee];
    if (!allowedStates.includes(res.nextState)) {
      return { isValid: false, type: 'INVALID' };
    }
    
    if (res.nextStatus === WorkFlowStatus.DONE) return { isValid: true, type: 'TERMINAL' };

    const nextActivity: WorkflowActivity = {
      state: res.nextState,
      workflowStatus: res.nextStatus,
      committee: activity.committee
    };

    if (!hasProductiveActions(nextActivity)) {
      return { isValid: true, type: 'STALL' };
    }

    return { isValid: true, type: 'PROCEED' };
  };

  const selectCommand = (stepIndex: number, cmd: WorkflowCommand) => {
    const currentStep = path[stepIndex];
    
    // If clicking on an already selected command, unselect it
    if (currentStep.selectedCommand === cmd) {
      const newPath = path.slice(0, stepIndex + 1);
      newPath[stepIndex].selectedCommand = undefined;
      setPath(newPath);
      return;
    }
    
    const result = processCommand(currentStep.activity, cmd);
    
    if (result.error) return;

    const newPath = path.slice(0, stepIndex + 1);
    newPath[stepIndex].selectedCommand = cmd;

    newPath.push({
      activity: {
        state: result.nextState,
        workflowStatus: result.nextStatus,
        committee: committeeType
      }
    });
    
    setPath(newPath);
  };

  // --- Reference Guide (Look-back) Logic ---
  const allTransitions = useMemo(() => {
    const rules: Array<{
      committee: CommitteeType;
      fromState: ActivityStateId;
      fromStatus: WorkFlowStatus;
      command: WorkflowCommand;
      toState: ActivityStateId;
      toStatus: WorkFlowStatus;
    }> = [];

    const committees: CommitteeType[] = ['STANDARD CP', 'EE', 'DENTIST'];
    const states = Object.values(ActivityStateId).filter(v => typeof v === 'number') as ActivityStateId[];
    const statuses = Object.values(WorkFlowStatus);

    committees.forEach(comm => {
      states.forEach(s => {
        statuses.forEach(st => {
          UI_COMMANDS.forEach(cmd => {
            if (cmd === 'NewRequest') return;
            const res = processCommand({ state: s, workflowStatus: st, committee: comm }, cmd);
            if (!res.error && (res.nextState !== s || res.nextStatus !== st)) {
              rules.push({
                committee: comm,
                fromState: s,
                fromStatus: st,
                command: cmd,
                toState: res.nextState,
                toStatus: res.nextStatus
              });
            }
          });
        });
      });
    });
    return rules;
  }, []);

  const possibleWorkflowsForState = useMemo(() => {
    if (targetState === 'ALL') return Object.values(WorkFlowStatus);
    const sId = parseInt(targetState);
    const reachable = allTransitions
      .filter(r => r.toState === sId && r.committee === committeeType)
      .map(r => r.toStatus);
    return Array.from(new Set(reachable));
  }, [allTransitions, targetState, committeeType]);

  useEffect(() => {
    if (targetWorkflow !== 'ALL' && !possibleWorkflowsForState.includes(targetWorkflow as WorkFlowStatus)) {
      setTargetWorkflow('ALL');
    }
  }, [targetState, possibleWorkflowsForState, targetWorkflow]);

  const filteredRules = useMemo(() => {
    const allowedStates = COMMITTEE_STATES[committeeType];
    return allTransitions.filter(r => {
      const matchCommittee = r.committee === committeeType;
      const matchState = targetState === 'ALL' || r.toState === parseInt(targetState);
      const matchWf = targetWorkflow === 'ALL' || r.toStatus === targetWorkflow;
      
      // Ensure both source and target states are valid for this committee
      const validSourceState = allowedStates.includes(r.fromState);
      const validTargetState = allowedStates.includes(r.toState);
      
      return matchCommittee && matchState && matchWf && validSourceState && validTargetState;
    });
  }, [allTransitions, committeeType, targetState, targetWorkflow]);

  const statusThemes = {
    [WorkFlowStatus.READY_FOR_AGENDA]: { bg: 'bg-blue-500' },
    [WorkFlowStatus.WAITING_FOR_DECISION]: { bg: 'bg-orange-500' },
    [WorkFlowStatus.WAITING_FOR_REQUESTOR]: { bg: 'bg-purple-500' },
    [WorkFlowStatus.DONE]: { bg: 'bg-green-500' },
  };

  // Fixed translations by adding missing explorer and guide keys
  const translations = {
    FR: { title: 'Explorateur de Flux Riziv', guideTitle: 'Guide de Référence', desc: 'Visualisation arborescente des états et transitions.', guideDesc: 'Identification des actions menant à un résultat.', reset: 'Réinitialiser', status: 'Statut', terminal: 'TERMINER', stall: 'IMPASSE', step: 'Étape', outcomes: 'Résultats possibles', legend: 'Légende', legendTerm: 'Ferme le dossier', legendStall: 'Plus d\'actions possibles', scenario: 'Scénario', targetState: 'État Cible', targetWorkflow: 'Workflow Cible', allScenarios: 'Tous les Scénarios', allStates: 'Tous les États', allWorkflows: 'Tous les Workflows', precondition: 'D\'où l\'on part', action: 'Action effectuée', targetReached: 'Cible atteinte', explorer: 'Explorateur', guide: 'Guide' },
    NL: { title: 'Riziv Workflow Verkenner', guideTitle: 'Referentiegids', desc: 'Boomstructuur visualisatie van statussen en overgangen.', guideDesc: 'Identificeer acties die naar een resultaat leiden.', reset: 'Resetten', status: 'Status', terminal: 'AFRONDEN', stall: 'DOODLOPEN', step: 'Stap', outcomes: 'Mogelijke uitkomsten', legend: 'Legenda', legendTerm: 'Sluit dossier', legendStall: 'Geen acties meer mogelijk', scenario: 'Scenario', targetState: 'Doel Status', targetWorkflow: 'Doel Workflow', allScenarios: 'Alle Scenario\'s', allStates: 'Alle Statussen', allWorkflows: 'Alle Workflows', precondition: 'Startpunt', action: 'Actie uitgevoerd', targetReached: 'Doel bereikt', explorer: 'Verkenner', guide: 'Gids' },
    EN: { title: 'Riziv Workflow Explorer', guideTitle: 'Reference Guide', desc: 'Tree-like visualization of states and transitions.', guideDesc: 'Identify actions leading to a specific result.', reset: 'Reset', status: 'Status', terminal: 'FINISH', stall: 'DEAD END', step: 'Step', outcomes: 'Possible outcomes', legend: 'Legend', legendTerm: 'Closes dossier', legendStall: 'No more actions left', scenario: 'Scenario', targetState: 'Target State', targetWorkflow: 'Target Workflow', allScenarios: 'All Scenarios', allStates: 'All States', allWorkflows: 'All Workflows', precondition: 'Starting from', action: 'Action performed', targetReached: 'Target reached', explorer: 'Explorer', guide: 'Guide' },
  };

  const t = translations[lang];

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Top Bar with Tab Navigation */}
      <header className={`border-b px-8 py-4 flex justify-between items-center flex-shrink-0 z-20 shadow-md ${isDark ? 'bg-slate-800 border-slate-700 shadow-black/20' : 'bg-white border-gray-200 shadow-gray-200/50'}`}>
        <div className="flex items-center gap-10">
          <div>
            <h1 className={`text-xl font-black flex items-center gap-3 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
              <span className={`px-2 py-0.5 rounded text-sm tracking-tighter shadow-sm ${isDark ? 'bg-slate-200 text-slate-900' : 'bg-blue-600 text-white'}`}>RIZIV</span>
              {viewMode === 'explorer' ? t.title : t.guideTitle}
            </h1>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{viewMode === 'explorer' ? t.desc : t.guideDesc}</p>
          </div>

          <nav className={`flex p-1 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
            <button 
              onClick={() => setViewMode('explorer')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'explorer' ? (isDark ? 'bg-slate-700 shadow-sm text-slate-100' : 'bg-white shadow-sm text-gray-900') : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-900')}`}
            >
              {t.explorer}
            </button>
            <button 
              onClick={() => setViewMode('guide')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'guide' ? (isDark ? 'bg-slate-700 shadow-sm text-slate-100' : 'bg-white shadow-sm text-gray-900') : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-900')}`}
            >
              {translations[lang].guide}
            </button>
          </nav>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`flex rounded-lg p-1 border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
            {(['FR', 'NL', 'EN'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
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
              onClick={() => setIsDark(!isDark)}
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

      {/* Secondary Control Bar - Scenario Selection */}
      <div className={`border-b px-8 py-3 flex justify-between items-center flex-shrink-0 z-10 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center gap-4">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{t.scenario}:</span>
          <div className={`flex rounded-lg p-1 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
            {(['STANDARD CP', 'EE', 'DENTIST'] as CommitteeType[]).map(committee => (
              <button
                key={committee}
                onClick={() => changeWorkflow(committee)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${
                  committeeType === committee ? (isDark ? 'bg-slate-200 text-slate-900 shadow-sm' : 'bg-blue-600 text-white shadow-sm') : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-900')
                }`}
              >
                {getCommitteeLabel(committee, lang)}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => viewMode === 'explorer' ? changeWorkflow(committeeType) : (setTargetState('ALL'), setTargetWorkflow('ALL'))} 
          className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors border uppercase tracking-widest ${isDark ? 'text-red-500 hover:bg-red-500/10 border-transparent hover:border-red-500/20' : 'text-red-600 hover:bg-red-50 border-transparent hover:border-red-200'}`}
        >
          {t.reset}
        </button>
      </div>

      {/* View Switcher */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'explorer' ? (
          /* --- EXPLORER VIEW --- */
          <main 
            ref={scrollContainerRef}
            className={`h-full overflow-x-auto flex items-stretch p-12 gap-12 ${isDark ? 'bg-slate-950' : 'bg-gray-100'}`}
          >
            {path.map((node, stepIdx) => {
              const isLast = stepIdx === path.length - 1;
              const isDone = node.activity.workflowStatus === WorkFlowStatus.DONE;
              const theme = statusThemes[node.activity.workflowStatus];

              return (
                <div key={stepIdx} className="flex items-center gap-12 flex-shrink-0 animate-in slide-in-from-right-4 duration-300">
                  <div className={`w-[420px] border rounded-2xl shadow-xl flex flex-col h-full max-h-[850px] relative transition-all duration-300 hover:shadow-2xl overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700 shadow-black/20' : 'bg-white border-gray-200 shadow-gray-300/30'}`}>
                    <div className={`h-1.5 w-full ${theme.bg}`} />
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
                            <span className={isDark ? 'text-slate-400' : 'text-gray-700'}>{node.activity.workflowStatus}</span>
                            <span className={isDark ? 'text-slate-400' : 'text-gray-700'}>({getWorkflowStatusId(node.activity.workflowStatus)})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      {!isDone ? (
                        <>
                          {(() => {
                            const validCommands = UI_COMMANDS.filter(cmd => {
                              const { isValid } = getCommandStatus(node.activity, cmd);
                              return isValid;
                            });
                            const count = validCommands.length;
                            
                            return (
                              <>
                                <div className={`flex items-center justify-between mb-4`}>
                                  <div className={`text-xs font-bold uppercase tracking-widest pl-1 border-l-2 ml-1 ${isDark ? 'text-slate-500 border-slate-700' : 'text-gray-500 border-gray-300'}`}>
                                    {t.outcomes}
                                  </div>
                                  <div className={`text-xs font-mono font-black px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'}`}>
                                    {count}
                                  </div>
                                </div>
                                {validCommands.map(cmd => {
                                  const { isValid, type } = getCommandStatus(node.activity, cmd);
                                  if (!isValid) return null;

                                  const isSelected = node.selectedCommand === cmd;
                                  const isCancel = cmd === 'Cancel';
                                  const nextRes = processCommand(node.activity, cmd);
                                  
                                  let style = isDark 
                                    ? "border-slate-700 hover:border-slate-500 text-slate-300 bg-slate-800/50 hover:bg-slate-700"
                                    : "border-gray-300 hover:border-gray-400 text-gray-700 bg-gray-50 hover:bg-gray-100";
                                  let badge = null;

                                  if (isCancel) {
                                    style = isDark 
                                      ? "bg-red-950/50 border-red-800/40 text-red-300 hover:border-red-700"
                                      : "bg-red-50 border-red-300 text-red-700 hover:border-red-400 hover:bg-red-100";
                                    badge = <span className={isDark ? "bg-red-700 text-red-100 text-[10px] px-2 py-1 rounded uppercase font-bold" : "bg-red-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold"}>Stop</span>;
                                  } else if (type === 'TERMINAL') {
                                    style = isDark
                                      ? "border-orange-700/40 text-orange-300 hover:border-orange-600 bg-orange-950/50"
                                      : "border-orange-400 text-orange-800 hover:border-orange-500 bg-orange-50 hover:bg-orange-100";
                                    badge = <span className={isDark ? "bg-orange-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold" : "bg-orange-500 text-white text-[10px] px-2 py-1 rounded uppercase font-bold"}>🏁 {t.terminal}</span>;
                                  } else if (type === 'STALL') {
                                    style = isDark
                                      ? "border-amber-700/40 text-amber-300 hover:border-amber-600 bg-amber-950/50"
                                      : "border-amber-400 text-amber-800 hover:border-amber-500 bg-amber-50 hover:bg-amber-100";
                                    badge = <span className={isDark ? "bg-amber-600 text-white text-[10px] px-2 py-1 rounded uppercase font-bold" : "bg-amber-500 text-white text-[10px] px-2 py-1 rounded uppercase font-bold"}>⚠️ {t.stall}</span>;
                                  }

                                  if (isSelected) {
                                    style = "bg-blue-500 border-blue-500 text-white ring-4 ring-blue-500/20 shadow-lg";
                                  }

                                  const nextStateKey = ActivityStateId[nextRes.nextState];
                                  const nextStateId = nextRes.nextState;
                                  const nextWfKey = nextRes.nextStatus;
                                  const nextWfId = getWorkflowStatusId(nextWfKey);

                                  const technicalTagStyles = isSelected 
                                    ? "bg-white/20 text-white border border-white/30" 
                                    : isDark 
                                      ? "bg-slate-600 text-slate-300 border border-slate-500"
                                      : "bg-gray-200 text-gray-700 border border-gray-400";

                                  return (
                                    <button
                                      key={cmd}
                                      onClick={() => selectCommand(stepIdx, cmd)}
                                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex flex-col gap-3 relative group ${style}`}
                                    >
                                      <div className="flex justify-between items-baseline">
                                          <span className="text-xs font-black uppercase tracking-tight leading-tight max-w-[85%]">
                                            {getCommandLabel(cmd, lang)}
                                          </span>
                                          {badge}
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
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-green-500/10 rounded-xl border-2 border-dashed border-green-500/20">
                           <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">🏁</div>
                           <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{t.terminal}</h4>
                           <div className="mt-4 space-y-2">
                              <div className="inline-block px-2 py-0.5 bg-green-600 text-white text-[9px] font-mono font-black rounded uppercase">
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
        ) : (
          /* --- REFERENCE GUIDE VIEW --- */
          <main className={`h-full flex flex-col ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Filters Section */}
            <div className={`border-b p-8 grid grid-cols-2 gap-6 shadow-inner relative z-10 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-200'}`}>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{t.targetState}</label>
                <select 
                  value={targetState} 
                  onChange={(e) => setTargetState(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="ALL">{t.allStates}</option>
                  {COMMITTEE_STATES[committeeType].map(id => (
                    <option key={id} value={id}>{getStateLabel(id, lang)} ({ActivityStateId[id]})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{t.targetWorkflow}</label>
                <select 
                  value={targetWorkflow} 
                  onChange={(e) => setTargetWorkflow(e.target.value as any)}
                  disabled={targetState === 'ALL'}
                  className={`w-full border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200 disabled:bg-slate-800/50 disabled:text-slate-500' : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400'}`}
                >
                  <option value="ALL">{t.allWorkflows}</option>
                  {possibleWorkflowsForState.map(status => (
                    <option key={status} value={status}>{getStatusLabel(status, lang)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Inverted Look-back Results Grid */}
            <div className={`flex-1 overflow-y-auto p-12 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
                {targetState === 'ALL' ? (
                  <div className={`py-24 flex flex-col items-center ${isDark ? 'text-slate-700' : 'text-gray-400'}`}>
                    <svg className="w-20 h-20 mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-bold text-lg opacity-50">{lang === 'FR' ? 'Veuillez sélectionner un état cible pour afficher les parcours.' : lang === 'NL' ? 'Selecteer een doelstatus om de routes weer te geven.' : 'Please select a target state to display routes.'}</p>
                  </div>
                ) : filteredRules.length > 0 ? filteredRules.map((rule, idx) => {
                  const toTheme = statusThemes[rule.toStatus];
                  
                  return (
                    <div key={idx} className={`group border rounded-3xl overflow-hidden hover:shadow-xl transition-all flex items-stretch animate-in fade-in duration-300 ${isDark ? 'border-slate-800 hover:shadow-black/20 hover:border-slate-600' : 'border-gray-200 hover:shadow-gray-300/50 hover:border-gray-300'}`}>
                      {/* Source Side (Look-back) - Clickable to filter by source */}
                      <button 
                        onClick={() => {
                          setTargetState(rule.fromState.toString());
                          setTargetWorkflow(rule.fromStatus);
                        }}
                        className={`w-[35%] p-8 border-r flex flex-col justify-center text-left transition-all ${isDark ? 'border-slate-800 bg-slate-800/50 hover:bg-slate-800' : 'border-gray-200 bg-gray-100 hover:bg-gray-200'}`}
                      >
                        <div className={`text-[10px] font-black uppercase mb-6 tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{t.precondition}</div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${isDark ? 'bg-slate-200 text-slate-900' : 'bg-blue-600 text-white'}`}>{getCommitteeLabel(rule.committee, lang)}</span>
                          </div>
                          <div className="space-y-1">
                            <div className={`text-sm font-black leading-tight ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{getStateLabel(rule.fromState, lang)}</div>
                            <div className={`text-[11px] font-black ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{getStatusLabel(rule.fromStatus, lang)}</div>
                          </div>
                          <div className={`text-[9px] font-mono font-bold uppercase ${isDark ? 'text-slate-600' : 'text-gray-500'}`}>Coord: {ActivityStateId[rule.fromState]} / {rule.fromStatus}</div>
                        </div>
                      </button>

                      {/* Bridge (Action) */}
                      <div className={`flex-1 p-8 flex flex-col justify-center items-center relative ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className={`text-[10px] font-black uppercase mb-6 tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{t.action}</div>
                        <div className="flex flex-col items-center gap-4 relative z-10">
                          <div className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-transform group-hover:scale-105 ${isDark ? 'bg-slate-200 text-slate-900' : 'bg-blue-600 text-white'}`}>
                            {getCommandLabel(rule.command, lang)}
                          </div>
                          <svg className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>

                      {/* Result Side - Clickable to filter by target */}
                      <button
                        onClick={() => {
                          setTargetState(rule.toState.toString());
                          setTargetWorkflow(rule.toStatus);
                        }}
                        className={`w-[35%] p-8 border-l flex flex-col justify-center text-right transition-all ${isDark ? `border-slate-800 ${toTheme.bg.replace('bg-', 'bg-')}/20 hover:${toTheme.bg.replace('bg-', 'bg-')}/30` : `border-gray-200 ${toTheme.bg.replace('bg-', 'bg-')}/10 hover:${toTheme.bg.replace('bg-', 'bg-')}/20`}`}
                      >
                        <div className={`text-[10px] font-black uppercase mb-6 tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{t.targetReached}</div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className={`text-base font-black leading-tight ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{getStateLabel(rule.toState, lang)}</div>
                            <div className={`inline-block px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider ${toTheme.bg} text-white`}>
                              {getStatusLabel(rule.toStatus, lang)}
                            </div>
                          </div>
                          <div className={`text-[10px] font-mono font-black pt-2 border-t inline-block uppercase ${isDark ? 'text-slate-500 border-slate-700/50' : 'text-gray-500 border-gray-300'}`}>
                            Target: {ActivityStateId[rule.toState]} + {rule.toStatus}
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                }) : (
                  <div className={`py-24 flex flex-col items-center ${isDark ? 'text-slate-700' : 'text-gray-400'}`}>
                    <svg className="w-20 h-20 mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="font-bold text-lg opacity-50">Aucun parcours trouvé pour ces critères.</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default App;
