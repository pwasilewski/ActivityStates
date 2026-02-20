import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ActivityStateId, 
  WorkFlowStatusId, 
  CommitteeType, 
  WorkflowActivity, 
  WorkflowCommand,
  Language
} from './types';
import { 
  processCommand, 
  UI_COMMANDS, 
  COMMITTEE_STATES
} from './engine';
import { setTransitionFilter } from './engine/production-transitions';
import { getUIText } from './translations';
import { Header, ScenarioSelector, ExplorerView, GuideView } from './components';
import PatternsPage from './pages/PatternsPage';
import { Pattern, detectCommitteeType } from './utils/pattern-analysis';

interface StepNode {
  activity: WorkflowActivity;
  selectedCommand?: WorkflowCommand;
}

type ViewMode = 'explorer' | 'guide' | 'patterns';

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
  
  const [path, setPath] = useState<StepNode[]>([
    { 
      activity: { 
        state: ActivityStateId.REQUESTED, 
        workflowStatus: WorkFlowStatusId.READY_FOR_AGENDA,
        committee: 'STANDARD CP' 
      } 
    }
  ]);

  const [targetState, setTargetState] = useState<string>('ALL');
  const [targetWorkflow, setTargetWorkflow] = useState<WorkFlowStatusId | 'ALL'>('ALL');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const t = getUIText(lang);

  // Initialize filter on mount
  useEffect(() => {
    setTransitionFilter('ALL');
  }, []);

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
        workflowStatus: WorkFlowStatusId.READY_FOR_AGENDA,
        committee: committee 
      } 
    }]);
  };

  const hasProductiveActions = (act: WorkflowActivity): boolean => {
    if (act.workflowStatus === WorkFlowStatusId.DONE) return false;
    return UI_COMMANDS.some((cmd: WorkflowCommand) => {
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
    
    const allowedStates = COMMITTEE_STATES[activity.committee];
    if (!allowedStates.includes(res.nextState)) {
      return { isValid: false, type: 'INVALID' };
    }
    
    if (res.nextStatus === WorkFlowStatusId.DONE) return { isValid: true, type: 'TERMINAL' };

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

  const allTransitions = useMemo(() => {
    const rules: Array<{
      committee: CommitteeType;
      fromState: ActivityStateId;
      fromStatus: WorkFlowStatusId;
      command: WorkflowCommand;
      toState: ActivityStateId;
      toStatus: WorkFlowStatusId;
    }> = [];

    const committees: CommitteeType[] = ['STANDARD CP', 'EE', 'DENTIST'];
    const states = Object.values(ActivityStateId).filter(v => typeof v === 'number') as ActivityStateId[];
    const statuses = Object.values(WorkFlowStatusId).filter(v => typeof v === 'number') as WorkFlowStatusId[];

    committees.forEach(comm => {
      states.forEach(s => {
        statuses.forEach(st => {
          UI_COMMANDS.forEach((cmd: WorkflowCommand) => {
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
    if (targetState === 'ALL') return Object.values(WorkFlowStatusId).filter(v => typeof v === 'number') as WorkFlowStatusId[];
    const sId = parseInt(targetState);
    const reachable = allTransitions
      .filter(r => r.toState === sId && r.committee === committeeType)
      .map(r => r.toStatus);
    return Array.from(new Set(reachable));
  }, [allTransitions, targetState, committeeType]);

  useEffect(() => {
    if (targetWorkflow !== 'ALL' && !possibleWorkflowsForState.includes(targetWorkflow as WorkFlowStatusId)) {
      setTargetWorkflow('ALL');
    }
  }, [targetState, possibleWorkflowsForState, targetWorkflow]);

  const filteredRules = useMemo(() => {
    const allowedStates = COMMITTEE_STATES[committeeType];
    return allTransitions.filter(r => {
      const matchCommittee = r.committee === committeeType;
      const matchState = targetState === 'ALL' || r.toState === parseInt(targetState);
      const matchWf = targetWorkflow === 'ALL' || r.toStatus === targetWorkflow;
      
      const validSourceState = allowedStates.includes(r.fromState);
      const validTargetState = allowedStates.includes(r.toState);
      
      return matchCommittee && matchState && matchWf && validSourceState && validTargetState;
    });
  }, [allTransitions, committeeType, targetState, targetWorkflow]);

  const statusThemes = {
    [WorkFlowStatusId.UNKNOWN]: { bg: 'bg-gray-500' },
    [WorkFlowStatusId.READY_FOR_AGENDA]: { bg: 'bg-blue-500' },
    [WorkFlowStatusId.WAITING_FOR_DECISION]: { bg: 'bg-orange-500' },
    [WorkFlowStatusId.WAITING_FOR_REQUESTOR]: { bg: 'bg-purple-500' },
    [WorkFlowStatusId.DONE]: { bg: 'bg-green-500' },
  };

  const handleReset = () => {
    if (viewMode === 'explorer') {
      changeWorkflow(committeeType);
    } else {
      setTargetState('ALL');
      setTargetWorkflow('ALL');
    }
  };

  const handleNavigateToState = (state: ActivityStateId, workflow: WorkFlowStatusId) => {
    setTargetState(state.toString());
    setTargetWorkflow(workflow);
  };

  const handleSimulatePattern = (pattern: Pattern) => {
    // Detect the correct committee type based on pattern states
    const detectedCommittee = detectCommitteeType(pattern);
    setCommitteeType(detectedCommittee);
    
    // Build path from pattern steps
    const newPath: StepNode[] = [
      {
        activity: {
          state: pattern.steps[0].state,
          workflowStatus: pattern.steps[0].status,
          committee: detectedCommittee
        }
      }
    ];

    // For each subsequent step, try to find the command that leads to it
    for (let i = 1; i < pattern.steps.length; i++) {
      const currentActivity = newPath[i - 1].activity;
      const targetStep = pattern.steps[i];
      
      // Find a command that produces this transition
      let foundCommand: WorkflowCommand | undefined;
      for (const cmd of UI_COMMANDS) {
        const result = processCommand(currentActivity, cmd);
        if (!result.error && 
            result.nextState === targetStep.state && 
            result.nextStatus === targetStep.status) {
          foundCommand = cmd;
          break;
        }
      }
      
      // Set the command on the previous step
      if (foundCommand) {
        newPath[i - 1].selectedCommand = foundCommand;
      }
      
      // Add the new step
      newPath.push({
        activity: {
          state: targetStep.state,
          workflowStatus: targetStep.status,
          committee: detectedCommittee
        }
      });
    }
    
    setPath(newPath);
    setViewMode('explorer');
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Header
        isDark={isDark}
        lang={lang}
        viewMode={viewMode}
        title={t.title}
        guideTitle={t.guideTitle}
        desc={t.desc}
        guideDesc={t.guideDesc}
        explorerLabel={t.explorer}
        guideLabel={t.guide}
        patternsLabel={t.patterns}
        onViewModeChange={(mode) => setViewMode(mode)}
        onLanguageChange={setLang}
        onThemeToggle={() => setIsDark(!isDark)}
      />

      {viewMode !== 'patterns' && (
        <ScenarioSelector
          isDark={isDark}
          lang={lang}
          committeeType={committeeType}
          scenarioLabel={t.scenario}
          resetLabel={t.reset}
          onCommitteeChange={changeWorkflow}
          onReset={handleReset}
        />
      )}

      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'patterns' ? (
          <PatternsPage
            isDark={isDark}
            lang={lang}
            onSimulatePattern={handleSimulatePattern}
          />
        ) : viewMode === 'explorer' ? (
          <ExplorerView
            isDark={isDark}
            lang={lang}
            path={path}
            scrollContainerRef={scrollContainerRef}
            outcomeLabel={t.outcomes}
            terminalLabel={t.terminal}
            stallLabel={t.stall}
            statusThemes={statusThemes}
            getCommandStatus={getCommandStatus}
            onSelectCommand={selectCommand}
            uiCommands={UI_COMMANDS}
          />
        ) : (
          <GuideView
            isDark={isDark}
            lang={lang}
            committeeType={committeeType}
            targetState={targetState}
            targetWorkflow={targetWorkflow}
            possibleWorkflowsForState={possibleWorkflowsForState}
            filteredRules={filteredRules}
            statusThemes={statusThemes}
            targetStateLabel={t.targetState}
            targetWorkflowLabel={t.targetWorkflow}
            allStatesLabel={t.allStates}
            allWorkflowsLabel={t.allWorkflows}
            preconditionLabel={t.precondition}
            actionLabel={t.action}
            targetReachedLabel={t.targetReached}
            selectTargetStatePrompt={t.selectTargetStatePrompt}
            noRoutesFound={t.noRoutesFound}
            onTargetStateChange={setTargetState}
            onTargetWorkflowChange={setTargetWorkflow}
            onNavigateToState={handleNavigateToState}
          />
        )}
      </div>
    </div>
  );
};

export default App;
