import { ActivityStateId, WorkFlowStatusId } from '../types';

export interface PatternStep {
  state: ActivityStateId;
  status: WorkFlowStatusId;
}

export interface Pattern {
  id: string;
  steps: PatternStep[];
  occurrenceCount: number;
  length: number;
  raw: string;
}

const parseStep = (stepStr: string): PatternStep | null => {
  const parts = stepStr.trim().split('-');
  if (parts.length !== 2) return null;
  
  const state = parseInt(parts[0]);
  const status = parseInt(parts[1]);
  
  if (isNaN(state) || isNaN(status)) return null;
  
  return {
    state: state as ActivityStateId,
    status: status as WorkFlowStatusId
  };
};

export const parsePattern = (patternStr: string, occurrenceCount: number): Pattern | null => {
  const stepStrings = patternStr.split('->').map(s => s.trim());
  const steps: PatternStep[] = [];
  
  for (const stepStr of stepStrings) {
    const step = parseStep(stepStr);
    if (!step) return null;
    steps.push(step);
  }
  
  return {
    id: patternStr,
    steps,
    occurrenceCount,
    length: steps.length,
    raw: patternStr
  };
};

export const loadPatterns = async (): Promise<Pattern[]> => {
  const response = await fetch('/ActivityStates/data/FlowPatterns.xlsx - Sheet2.csv');
  const text = await response.text();
  const lines = text.split('\n').slice(1); // Skip header
  
  const patterns: Pattern[] = [];
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const lastCommaIndex = line.lastIndexOf(',');
    if (lastCommaIndex === -1) continue;
    
    const patternStr = line.substring(0, lastCommaIndex).trim();
    const countStr = line.substring(lastCommaIndex + 1).trim();
    const count = parseInt(countStr);
    
    if (isNaN(count)) continue;
    
    const pattern = parsePattern(patternStr, count);
    if (pattern) {
      patterns.push(pattern);
    }
  }
  
  return patterns.sort((a, b) => b.occurrenceCount - a.occurrenceCount);
};

export const filterPatterns = (
  patterns: Pattern[],
  filters: {
    searchText?: string;
    minOccurrences?: number;
    maxOccurrences?: number;
    minLength?: number;
    maxLength?: number;
    state?: ActivityStateId;
    status?: WorkFlowStatusId;
  }
): Pattern[] => {
  return patterns.filter(pattern => {
    if (filters.searchText) {
      const search = filters.searchText.toLowerCase();
      if (!pattern.raw.toLowerCase().includes(search)) return false;
    }
    
    if (filters.minOccurrences !== undefined && pattern.occurrenceCount < filters.minOccurrences) {
      return false;
    }
    
    if (filters.maxOccurrences !== undefined && pattern.occurrenceCount > filters.maxOccurrences) {
      return false;
    }
    
    if (filters.minLength !== undefined && pattern.length < filters.minLength) {
      return false;
    }
    
    if (filters.maxLength !== undefined && pattern.length > filters.maxLength) {
      return false;
    }
    
    if (filters.state !== undefined) {
      const hasState = pattern.steps.some(s => s.state === filters.state);
      if (!hasState) return false;
    }
    
    if (filters.status !== undefined) {
      const hasStatus = pattern.steps.some(s => s.status === filters.status);
      if (!hasStatus) return false;
    }
    
    return true;
  });
};

export const formatOccurrenceCount = (count: number): string => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

export const detectCommitteeType = (pattern: Pattern): 'DENTIST' | 'EE' | 'STANDARD CP' => {
  // Check for DENTIST-specific states
  const dentistStates = [20, 21, 22, 23, 24]; // MISSINGINFO_CE, MISSINGINFO_GDPQ, APPROVED_CE, REFUSED_CE, DECISIONBYGDPQ
  const hasDentistState = pattern.steps.some(step => dentistStates.includes(step.state));
  
  if (hasDentistState) {
    return 'DENTIST';
  }
  
  // Check for EE-specific states (APPROVED_EE, REFUSED_EE, MISSINGINFO_EE)
  const eeStates = [5, 9, 11]; // MISSINGINFO_EE, REFUSED_EE, APPROVED_EE
  const hasEEState = pattern.steps.some(step => eeStates.includes(step.state));
  
  if (hasEEState) {
    return 'EE';
  }
  
  // Default to STANDARD CP
  return 'STANDARD CP';
};
