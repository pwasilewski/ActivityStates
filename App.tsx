
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ActivityStateId, 
  WorkFlowStatus, 
  WorkflowType, 
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
  getWorkflowStatusId
} from './engine.ts';

interface StepNode {
  activity: WorkflowActivity;
  selectedCommand?: WorkflowCommand;
}

type ViewMode = 'explorer' | 'guide';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('FR');
  const [viewMode, setViewMode] = useState<ViewMode>('explorer');
  const [workflowType, setWorkflowType] = useState<WorkflowType>('STANDARD');
  
  // Explorer State (Restored exactly from original snippet)
  const [path, setPath] = useState<StepNode[]>([
    { 
      activity: { 
        state: ActivityStateId.REQUESTED, 
        workflowStatus: WorkFlowStatus.READY_FOR_AGENDA, 
        type: 'STANDARD' 
      } 
    }
  ]);

  // Reference Guide State (The New Page Filters)
  const [guideScenario, setGuideScenario] = useState<WorkflowType | 'ALL'>('ALL');
  const [targetState, setTargetState] = useState<string>('ALL');
  const [targetWorkflow, setTargetWorkflow] = useState<WorkFlowStatus | 'ALL'>('ALL');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewMode === 'explorer' && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [path, viewMode]);

  const changeWorkflow = (type: WorkflowType) => {
    setWorkflowType(type);
    setPath([{ 
      activity: { 
        state: ActivityStateId.REQUESTED, 
        workflowStatus: WorkFlowStatus.READY_FOR_AGENDA, 
        type: type 
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
    if (res.nextStatus === WorkFlowStatus.DONE) return { isValid: true, type: 'TERMINAL' };

    const nextActivity: WorkflowActivity = {
      state: res.nextState,
      workflowStatus: res.nextStatus,
      type: activity.type
    };

    if (!hasProductiveActions(nextActivity)) {
      return { isValid: true, type: 'STALL' };
    }

    return { isValid: true, type: 'PROCEED' };
  };

  const selectCommand = (stepIndex: number, cmd: WorkflowCommand) => {
    const currentStep = path[stepIndex];
    const result = processCommand(currentStep.activity, cmd);
    
    if (result.error) return;

    const newPath = path.slice(0, stepIndex + 1);
    newPath[stepIndex].selectedCommand = cmd;

    newPath.push({
      activity: {
        state: result.nextState,
        workflowStatus: result.nextStatus,
        type: workflowType
      }
    });
    
    setPath(newPath);
  };

  // --- Reference Guide (Look-back) Logic ---
  const allTransitions = useMemo(() => {
    const rules: Array<{
      scenario: WorkflowType;
      fromState: ActivityStateId;
      fromStatus: WorkFlowStatus;
      command: WorkflowCommand;
      toState: ActivityStateId;
      toStatus: WorkFlowStatus;
    }> = [];

    const scenarios: WorkflowType[] = ['STANDARD', 'EE', 'DENTIST'];
    const states = Object.values(ActivityStateId).filter(v => typeof v === 'number') as ActivityStateId[];
    const statuses = Object.values(WorkFlowStatus);

    scenarios.forEach(scen => {
      states.forEach(s => {
        statuses.forEach(st => {
          UI_COMMANDS.forEach(cmd => {
            if (cmd === 'NewRequest') return;
            const res = processCommand({ state: s, workflowStatus: st, type: scen }, cmd);
            if (!res.error && (res.nextState !== s || res.nextStatus !== st)) {
              rules.push({
                scenario: scen,
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
      .filter(r => r.toState === sId && (guideScenario === 'ALL' || r.scenario === guideScenario))
      .map(r => r.toStatus);
    return Array.from(new Set(reachable));
  }, [allTransitions, targetState, guideScenario]);

  useEffect(() => {
    if (targetWorkflow !== 'ALL' && !possibleWorkflowsForState.includes(targetWorkflow as WorkFlowStatus)) {
      setTargetWorkflow('ALL');
    }
  }, [targetState, possibleWorkflowsForState, targetWorkflow]);

  const filteredRules = useMemo(() => {
    return allTransitions.filter(r => {
      const matchScen = guideScenario === 'ALL' || r.scenario === guideScenario;
      const matchState = targetState === 'ALL' || r.toState === parseInt(targetState);
      const matchWf = targetWorkflow === 'ALL' || r.toStatus === targetWorkflow;
      return matchScen && matchState && matchWf;
    });
  }, [allTransitions, guideScenario, targetState, targetWorkflow]);

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
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Top Bar with Tab Navigation */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center flex-shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-10">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-sm tracking-tighter shadow-sm">RIZIV</span>
              {viewMode === 'explorer' ? t.title : t.guideTitle}
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{viewMode === 'explorer' ? t.desc : t.guideDesc}</p>
          </div>

          <nav className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setViewMode('explorer')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'explorer' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.explorer}
            </button>
            <button 
              onClick={() => setViewMode('guide')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'guide' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {translations[lang].guide}
            </button>
          </nav>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
            {(['FR', 'NL', 'EN'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${
                  lang === l ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          
          {viewMode === 'explorer' && (
            <div className="flex bg-slate-900 rounded-lg p-1">
              {(['STANDARD', 'EE', 'DENTIST'] as WorkflowType[]).map(type => (
                <button
                  key={type}
                  onClick={() => changeWorkflow(type)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black transition-all ${
                    workflowType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type === 'EE' ? 'ETHICS' : type}
                </button>
              ))}
            </div>
          )}

          <button 
            onClick={() => viewMode === 'explorer' ? changeWorkflow(workflowType) : (setTargetState('ALL'), setTargetWorkflow('ALL'), setGuideScenario('ALL'))} 
            className="text-[10px] font-black text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100 uppercase tracking-widest"
          >
            {t.reset}
          </button>
        </div>
      </header>

      {/* View Switcher */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'explorer' ? (
          /* --- RESTORED EXPLORER VIEW --- */
          <main 
            ref={scrollContainerRef}
            className="h-full overflow-x-auto flex items-stretch p-12 gap-12 bg-[#F8FAFC]"
          >
            {path.map((node, stepIdx) => {
              const isLast = stepIdx === path.length - 1;
              const isDone = node.activity.workflowStatus === WorkFlowStatus.DONE;
              const theme = statusThemes[node.activity.workflowStatus];

              return (
                <div key={stepIdx} className="flex items-center gap-12 flex-shrink-0 animate-in slide-in-from-right-4 duration-300">
                  <div className="w-[420px] bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col h-full max-h-[850px] relative transition-all duration-300 hover:shadow-2xl overflow-hidden">
                    <div className={`h-1.5 w-full ${theme.bg}`} />
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex flex-col gap-6">
                        <div className="space-y-1">
                          <h3 className="text-base font-black text-slate-900 leading-tight">
                            {getStateLabel(node.activity.state, lang)}
                          </h3>
                          <p className="text-xs font-bold text-slate-500">
                            {getStatusLabel(node.activity.workflowStatus, lang)}
                          </p>
                        </div>
                        <div className="border-l-2 border-slate-200 pl-4 py-0.5 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400">
                            <span className="uppercase opacity-60">State:</span>
                            <span className="text-slate-500">{ActivityStateId[node.activity.state]}</span>
                            <span className="text-slate-300">({node.activity.state})</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400">
                            <span className="uppercase opacity-60">WK:</span>
                            <span className="text-slate-500">{node.activity.workflowStatus}</span>
                            <span className="text-slate-300">({getWorkflowStatusId(node.activity.workflowStatus)})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      {!isDone ? (
                        <>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 pl-1 border-l-2 border-slate-200 ml-1">
                            {t.outcomes}
                          </div>
                          {UI_COMMANDS.map(cmd => {
                            const { isValid, type } = getCommandStatus(node.activity, cmd);
                            if (!isValid) return null;

                            const isSelected = node.selectedCommand === cmd;
                            const isCancel = cmd === 'Cancel';
                            const nextRes = processCommand(node.activity, cmd);
                            
                            let style = "border-slate-100 hover:border-slate-900 text-slate-700 bg-white";
                            let badge = null;

                            if (isCancel) {
                              style = "bg-red-50/20 border-red-100 text-red-700 hover:border-red-400";
                              badge = <span className="bg-red-600 text-white text-[7px] px-1.5 py-0.5 rounded uppercase font-bold">Stop</span>;
                            } else if (type === 'TERMINAL') {
                              style = "border-orange-200 text-slate-800 hover:border-orange-500 bg-orange-50/20";
                              badge = <span className="bg-orange-500 text-white text-[7px] px-1.5 py-0.5 rounded uppercase font-bold">🏁 {t.terminal}</span>;
                            } else if (type === 'STALL') {
                              style = "border-yellow-200 text-slate-800 hover:border-yellow-500 bg-yellow-50/20";
                              badge = <span className="bg-yellow-500 text-white text-[7px] px-1.5 py-0.5 rounded uppercase font-bold">⚠️ {t.stall}</span>;
                            }

                            if (isSelected) {
                              style = "bg-slate-900 border-slate-900 text-white ring-4 ring-slate-100 shadow-lg";
                            }

                            const nextStateKey = ActivityStateId[nextRes.nextState];
                            const nextStateId = nextRes.nextState;
                            const nextWfKey = nextRes.nextStatus;
                            const nextWfId = getWorkflowStatusId(nextWfKey);

                            const technicalTagStyles = isSelected 
                              ? "bg-white/20 text-white border border-white/30" 
                              : "bg-slate-200 text-slate-600 border border-slate-300";

                            return (
                              <button
                                key={cmd}
                                onClick={() => selectCommand(stepIdx, cmd)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex flex-col gap-3 relative group ${style}`}
                              >
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black uppercase tracking-tight leading-tight max-w-[85%]">
                                      {getCommandLabel(cmd, lang)}
                                    </span>
                                    {badge}
                                </div>
                                <div className={`p-3 rounded-lg border flex flex-col gap-2 ${isSelected ? 'bg-white/5 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className={`text-[9px] font-bold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                          {getStateLabel(nextRes.nextState, lang)}
                                        </span>
                                        <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded shadow-sm flex-shrink-0 ${technicalTagStyles}`}>
                                          {nextStateKey} ({nextStateId})
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-1 border-t pt-2 border-slate-200/50">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className={`text-[9px] font-black truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                          {getStatusLabel(nextRes.nextStatus, lang)}
                                        </span>
                                        <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded shadow-sm flex-shrink-0 ${technicalTagStyles}`}>
                                          {nextWfKey} ({nextWfId})
                                        </span>
                                      </div>
                                    </div>
                                </div>
                              </button>
                            );
                          })}
                        </>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-green-50/30 rounded-xl border-2 border-dashed border-green-200">
                           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">🏁</div>
                           <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{t.terminal}</h4>
                           <div className="mt-4 space-y-2">
                              <div className="inline-block px-2 py-0.5 bg-green-600 text-white text-[8px] font-mono font-black rounded uppercase">
                                STATUS: {node.activity.workflowStatus}
                              </div>
                              <p className="text-[11px] text-slate-500 font-bold">{getStatusLabel(node.activity.workflowStatus, lang)}</p>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {!isLast && (
                    <div className="flex-shrink-0 w-12 flex items-center justify-center">
                      <div className="h-0.5 flex-1 bg-slate-300 relative shadow-sm">
                        <div className="absolute right-0 -top-1 border-t-4 border-l-4 border-transparent border-l-slate-300 border-t-slate-300 rotate-45 w-2 h-2"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </main>
        ) : (
          /* --- NEW REFERENCE GUIDE VIEW --- */
          <main className="h-full flex flex-col bg-white">
            {/* Filters Section */}
            <div className="bg-slate-50 border-b border-slate-200 p-8 grid grid-cols-3 gap-6 shadow-inner relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.scenario}</label>
                <select 
                  value={guideScenario} 
                  onChange={(e) => setGuideScenario(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none"
                >
                  <option value="ALL">{t.allScenarios}</option>
                  <option value="STANDARD">STANDARD</option>
                  <option value="EE">ETHICS & ECONOMY (EE)</option>
                  <option value="DENTIST">DENTIST</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.targetState}</label>
                <select 
                  value={targetState} 
                  onChange={(e) => setTargetState(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none"
                >
                  <option value="ALL">{t.allStates}</option>
                  {Object.values(ActivityStateId).filter(v => typeof v === 'number').map(id => (
                    <option key={id} value={id}>{getStateLabel(id as ActivityStateId, lang)} ({ActivityStateId[id as number]})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.targetWorkflow}</label>
                <select 
                  value={targetWorkflow} 
                  onChange={(e) => setTargetWorkflow(e.target.value as any)}
                  disabled={targetState === 'ALL'}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="ALL">{t.allWorkflows}</option>
                  {possibleWorkflowsForState.map(status => (
                    <option key={status} value={status}>{getStatusLabel(status, lang)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Inverted Look-back Results Grid */}
            <div className="flex-1 overflow-y-auto p-12 bg-white">
              <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
                {filteredRules.length > 0 ? filteredRules.map((rule, idx) => {
                  const fromTheme = statusThemes[rule.fromStatus];
                  const toTheme = statusThemes[rule.toStatus];
                  
                  return (
                    <div key={idx} className="group border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all hover:border-slate-300 flex items-stretch animate-in fade-in duration-300">
                      {/* Source Side (Look-back) */}
                      <div className="w-[35%] p-8 border-r border-slate-100 bg-slate-50/50 flex flex-col justify-center">
                        <div className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">{t.precondition}</div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">{rule.scenario}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-black text-slate-900 leading-tight">{getStateLabel(rule.fromState, lang)}</div>
                            <div className={`text-[11px] font-bold ${fromTheme.bg.replace('bg-', 'text-')}`}>{getStatusLabel(rule.fromStatus, lang)}</div>
                          </div>
                          <div className="text-[9px] font-mono font-bold text-slate-300 uppercase">Coord: {ActivityStateId[rule.fromState]} / {rule.fromStatus}</div>
                        </div>
                      </div>

                      {/* Bridge (Action) */}
                      <div className="flex-1 p-8 flex flex-col justify-center items-center bg-white relative">
                        <div className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">{t.action}</div>
                        <div className="flex flex-col items-center gap-4 relative z-10">
                          <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-transform group-hover:scale-105">
                            {getCommandLabel(rule.command, lang)}
                          </div>
                          <div className="flex flex-col items-center text-slate-300">
                             <div className="w-0.5 h-6 bg-slate-100"></div>
                             <div className="border-t-8 border-x-8 border-transparent border-t-slate-100"></div>
                          </div>
                        </div>
                      </div>

                      {/* Result Side */}
                      <div className={`w-[35%] p-8 border-l border-slate-100 ${toTheme.bg.replace('bg-', 'bg-')}/5 flex flex-col justify-center text-right`}>
                        <div className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">{t.targetReached}</div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="text-base font-black text-slate-900 leading-tight">{getStateLabel(rule.toState, lang)}</div>
                            <div className={`inline-block px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider ${toTheme.bg} text-white`}>
                              {getStatusLabel(rule.toStatus, lang)}
                            </div>
                          </div>
                          <div className="text-[10px] font-mono font-black text-slate-400 pt-2 border-t border-slate-200/50 inline-block uppercase">
                            Target: {ActivityStateId[rule.toState]} + {rule.toStatus}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-24 flex flex-col items-center text-slate-300">
                    <svg className="w-20 h-20 mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="font-bold text-lg opacity-50">Aucun parcours trouvé pour ces critères.</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        )}
      </div>

      {/* Legend Footer */}
      <footer className="bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0 shadow-lg relative z-10">
        <div className="flex items-center gap-10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 pr-6">{t.legend}</span>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-orange-500 shadow-sm border border-orange-600"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{t.legendTerm}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-yellow-500 shadow-sm border border-yellow-600"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{t.legendStall}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-red-600 shadow-sm border border-red-800"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Cancel / Stop</span>
          </div>
        </div>
        <div className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-[0.3em]">
          Workflow Engine v4.0 | {viewMode.toUpperCase()} MODE
        </div>
      </footer>
    </div>
  );
};

export default App;
