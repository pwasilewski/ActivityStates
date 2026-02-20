import React, { useMemo } from 'react';
import { ActivityStateId, WorkFlowStatusId, Language } from '../types';
import { getTransitionCount } from '../engine/production-transitions';
import { getStateLabel, getStatusLabel } from '../translations';
import { formatOccurrenceCount } from '../utils/pattern-analysis';

interface NextStepsPanelProps {
  isDark: boolean;
  lang: Language;
  currentState: ActivityStateId;
  currentStatus: WorkFlowStatusId;
  onNavigateToPatterns: () => void;
}

const NextStepsPanel: React.FC<NextStepsPanelProps> = ({
  isDark,
  lang,
  currentState,
  currentStatus,
  onNavigateToPatterns
}) => {
  const topTransitions = useMemo(() => {
    // Get all possible transitions
    const transitions: Array<{
      toState: ActivityStateId;
      toStatus: WorkFlowStatusId;
      count: number;
    }> = [];
    
    // Check all possible state/status combinations
    Object.values(ActivityStateId)
      .filter(v => typeof v === 'number')
      .forEach(toState => {
        Object.values(WorkFlowStatusId)
          .filter(v => typeof v === 'number')
          .forEach(toStatus => {
            const count = getTransitionCount(
              currentState,
              currentStatus,
              toState as ActivityStateId,
              toStatus as WorkFlowStatusId
            );
            if (count > 0) {
              transitions.push({
                toState: toState as ActivityStateId,
                toStatus: toStatus as WorkFlowStatusId,
                count
              });
            }
          });
      });
    
    // Sort by count and take top 5
    transitions.sort((a, b) => b.count - a.count);
    const top5 = transitions.slice(0, 5);
    
    const maxCount = top5[0]?.count || 1;
    
    return top5.map(t => ({
      toState: t.toState,
      toStatus: t.toStatus,
      count: t.count,
      percentage: (t.count / maxCount) * 100
    }));
  }, [currentState, currentStatus]);

  if (topTransitions.length === 0) return null;

  return (
    <div className={`p-4 rounded-lg border ${
      isDark 
        ? 'bg-slate-800/50 border-slate-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold ${
          isDark ? 'text-slate-200' : 'text-gray-800'
        }`}>
          Common Next Steps
        </h3>
        <button
          onClick={onNavigateToPatterns}
          className={`text-xs px-2 py-1 rounded ${
            isDark
              ? 'text-blue-400 hover:bg-slate-700'
              : 'text-blue-600 hover:bg-gray-100'
          }`}
        >
          View All Patterns ?
        </button>
      </div>
      
      <div className="space-y-2">
        {topTransitions.map((transition, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>
                {getStateLabel(transition.toState, lang)} - {getStatusLabel(transition.toStatus, lang)}
              </span>
              <span className={`font-mono ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                {formatOccurrenceCount(transition.count)}
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${
              isDark ? 'bg-slate-700' : 'bg-gray-200'
            }`}>
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${transition.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextStepsPanel;
