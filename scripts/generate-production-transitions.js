/**
 * Script to generate production-transitions.ts from FlowPatterns.xlsx CSV
 * 
 * This parses the CSV file and extracts all unique state transitions that have
 * occurred in production, then generates the TypeScript lookup table with occurrence counts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the CSV file - Using Sheet2 (last 6 years of data)
const csvPath = path.join(__dirname, '../data/FlowPatterns.xlsx - Sheet2.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV lines (skip header)
const lines = csvContent.split('\n').slice(1).filter(line => line.trim());

// Map to store transitions with occurrence counts: "fromState-fromStatus" -> Map<"toState-toStatus", count>
const transitionsMap = new Map();

// Parse each flow pattern
lines.forEach(line => {
  // Match pattern: "flow pattern,number" where flow pattern may contain commas in rare cases
  const lastCommaIndex = line.lastIndexOf(',');
  if (lastCommaIndex === -1) return;
  
  const flowPattern = line.substring(0, lastCommaIndex).trim();
  const countStr = line.substring(lastCommaIndex + 1).trim();
  const occurrenceCount = parseInt(countStr, 10);
  
  if (!flowPattern || isNaN(occurrenceCount)) return;
  
  const steps = flowPattern.split(' -> ').map(step => step.trim());
  
  // Extract transitions and accumulate occurrence counts
  for (let i = 0; i < steps.length - 1; i++) {
    const from = steps[i];
    const to = steps[i + 1];
    
    if (!transitionsMap.has(from)) {
      transitionsMap.set(from, new Map());
    }
    
    const targetMap = transitionsMap.get(from);
    const currentCount = targetMap.get(to) || 0;
    targetMap.set(to, currentCount + occurrenceCount);
  }
});

// Build array of all transitions with counts for ranking
const allTransitions = [];
transitionsMap.forEach((targets, fromKey) => {
  targets.forEach((count, toKey) => {
    const [fromStateId, fromWorkflowId] = fromKey.split('-').map(Number);
    const [toStateId, toWorkflowId] = toKey.split('-').map(Number);
    allTransitions.push({
      fromStateId,
      fromWorkflowId,
      toStateId,
      toWorkflowId,
      count
    });
  });
});

// Sort by occurrence count (descending)
allTransitions.sort((a, b) => b.count - a.count);

console.log(`\n?? Total unique transitions: ${allTransitions.length}`);
console.log(`?? Top 10 transitions by occurrence:`);
allTransitions.slice(0, 10).forEach((t, i) => {
  console.log(`   ${i + 1}. ${t.fromStateId}-${t.fromWorkflowId} ? ${t.toStateId}-${t.toWorkflowId}: ${t.count.toLocaleString()} times`);
});

// Define threshold sets
const thresholds = {
  TOP_75: allTransitions[74]?.count || 0,   // 75th most common transition's count
  TOP_150: allTransitions[149]?.count || 0,  // 150th most common transition's count
  ALL: 1  // Include everything that happened at least once
};

console.log(`\n?? Threshold values:`);
console.log(`   Top 75:  >= ${thresholds.TOP_75.toLocaleString()} occurrences`);
console.log(`   Top 150: >= ${thresholds.TOP_150.toLocaleString()} occurrences`);
console.log(`   All:     >= ${thresholds.ALL.toLocaleString()} occurrences`);

// Generate filtered transition maps for each threshold
function buildTransitionMap(minOccurrences) {
  const filtered = allTransitions.filter(t => t.count >= minOccurrences);
  const map = new Map();
  
  filtered.forEach(t => {
    const key = `${t.fromStateId}-${t.fromWorkflowId}`;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push({
      toStateId: t.toStateId,
      toWorkflowId: t.toWorkflowId,
      count: t.count
    });
  });
  
  return map;
}

const filteredMaps = {
  TOP_75: buildTransitionMap(thresholds.TOP_75),
  TOP_150: buildTransitionMap(thresholds.TOP_150),
  ALL: buildTransitionMap(thresholds.ALL)
};

console.log(`\n?? Filtered transition counts:`);
console.log(`   Top 75:  ${allTransitions.filter(t => t.count >= thresholds.TOP_75).length} transitions`);
console.log(`   Top 150: ${allTransitions.filter(t => t.count >= thresholds.TOP_150).length} transitions`);
console.log(`   All:     ${allTransitions.filter(t => t.count >= thresholds.ALL).length} transitions`);

// Generate TypeScript code
function generateTransitionObject(filteredMap, indent = '  ') {
  const sortedKeys = Array.from(filteredMap.keys()).sort((a, b) => {
    const [aState, aWorkflow] = a.split('-').map(Number);
    const [bState, bWorkflow] = b.split('-').map(Number);
    return aState !== bState ? aState - bState : aWorkflow - bWorkflow;
  });
  
  let code = '';
  sortedKeys.forEach(key => {
    const targets = filteredMap.get(key);
    // Sort targets by state ID, then workflow ID
    targets.sort((a, b) => {
      return a.toStateId !== b.toStateId 
        ? a.toStateId - b.toStateId 
        : a.toWorkflowId - b.toWorkflowId;
    });
    
    code += `${indent}"${key}": [\n`;
    targets.forEach(target => {
      code += `${indent}  { toStateId: ${target.toStateId} as ActivityStateId, toWorkflowId: ${target.toWorkflowId} as WorkFlowStatusId, count: ${target.count} },\n`;
    });
    code += `${indent}],\n`;
  });
  
  return code;
}

const tsCode = `// AUTO-GENERATED: Production-only state transitions with occurrence counts
// Generated from actual production flow data from FlowPatterns.xlsx - Sheet2.csv (last 6 years)
// DO NOT EDIT MANUALLY - regenerate from CSV if production data changes
//
// This file contains all state-to-state transitions that have actually occurred in production.
// The workflow engine uses this to restrict possible transitions to only those validated by real usage.

import { ActivityStateId, WorkFlowStatusId } from '../types';

export interface TransitionTarget {
  toStateId: ActivityStateId;
  toWorkflowId: WorkFlowStatusId;
  count: number; // Number of times this transition occurred in production
}

export type TransitionFilterMode = 'TOP_75' | 'TOP_150' | 'ALL';

// Threshold values for each filter mode (minimum occurrence count)
export const FILTER_THRESHOLDS = {
  TOP_75: ${thresholds.TOP_75},
  TOP_150: ${thresholds.TOP_150},
  ALL: ${thresholds.ALL}
} as const;

// Current filter mode (can be changed at runtime)
let currentFilterMode: TransitionFilterMode = 'ALL';

// Top 75 most common transitions (>= ${thresholds.TOP_75} occurrences)
const TRANSITIONS_TOP_75: Record<string, TransitionTarget[]> = {
${generateTransitionObject(filteredMaps.TOP_75)}};

// Top 150 most common transitions (>= ${thresholds.TOP_150} occurrences)
const TRANSITIONS_TOP_150: Record<string, TransitionTarget[]> = {
${generateTransitionObject(filteredMaps.TOP_150)}};

// All production transitions (>= ${thresholds.ALL} occurrence)
const TRANSITIONS_ALL: Record<string, TransitionTarget[]> = {
${generateTransitionObject(filteredMaps.ALL)}};

// Map to quickly access the right dataset
const TRANSITION_MAPS = {
  TOP_75: TRANSITIONS_TOP_75,
  TOP_150: TRANSITIONS_TOP_150,
  ALL: TRANSITIONS_ALL
} as const;

/**
 * Set the filter mode for production transitions
 * @param mode Filter mode to apply
 */
export function setTransitionFilter(mode: TransitionFilterMode): void {
  currentFilterMode = mode;
  console.log(\`?? Transition filter changed to: \${mode} (min \${FILTER_THRESHOLDS[mode]} occurrences)\`);
}

/**
 * Get the current filter mode
 */
export function getTransitionFilter(): TransitionFilterMode {
  return currentFilterMode;
}

/**
 * Check if a state transition is valid according to production data and current filter
 * @param fromState Current activity state ID
 * @param fromWorkflowId Current workflow status ID
 * @param toState Target activity state ID
 * @param toWorkflowId Target workflow status ID
 * @returns true if this transition has occurred in production (based on current filter), false otherwise
 */
export function isProductionTransition(
  fromState: ActivityStateId,
  fromWorkflowId: number,
  toState: ActivityStateId,
  toWorkflowId: number
): boolean {
  const key = \`\${fromState}-\${fromWorkflowId}\`;
  const currentMap = TRANSITION_MAPS[currentFilterMode];
  const allowedTransitions = currentMap[key];
  
  if (!allowedTransitions) {
    return false;
  }
  
  return allowedTransitions.some(
    t => t.toStateId === toState && t.toWorkflowId === toWorkflowId
  );
}

/**
 * Get all valid next states from a given state according to production data and current filter
 * @param fromState Current activity state ID
 * @param fromWorkflowId Current workflow status ID
 * @returns Array of valid next states with occurrence counts, or empty array if none exist
 */
export function getValidNextStates(
  fromState: ActivityStateId,
  fromWorkflowId: number
): TransitionTarget[] {
  const key = \`\${fromState}-\${fromWorkflowId}\`;
  const currentMap = TRANSITION_MAPS[currentFilterMode];
  return currentMap[key] || [];
}

/**
 * Get occurrence count for a specific transition (from ALL dataset)
 * @param fromState Current activity state ID
 * @param fromWorkflowId Current workflow status ID
 * @param toState Target activity state ID
 * @param toWorkflowId Target workflow status ID
 * @returns Number of times this transition occurred, or 0 if never
 */
export function getTransitionCount(
  fromState: ActivityStateId,
  fromWorkflowId: number,
  toState: ActivityStateId,
  toWorkflowId: number
): number {
  const key = \`\${fromState}-\${fromWorkflowId}\`;
  const allTransitions = TRANSITIONS_ALL[key];
  
  if (!allTransitions) {
    return 0;
  }
  
  const transition = allTransitions.find(
    t => t.toStateId === toState && t.toWorkflowId === toWorkflowId
  );
  
  return transition?.count || 0;
}
`;

// Write the generated file
const outputPath = path.join(__dirname, '../src/engine/production-transitions.ts');
fs.writeFileSync(outputPath, tsCode, 'utf-8');

console.log('\n? Generated production-transitions.ts');

// Verify the specific transition we're looking for
const key54 = '5-4';
const all54 = filteredMaps.ALL.get(key54);
if (all54) {
  console.log(`\n?? Transitions from 5-4 (MISSINGINFO_EE/WAITING_FOR_REQUESTOR):`);
  all54.slice(0, 6).forEach(t => {
    console.log(`   ? ${t.toStateId}-${t.toWorkflowId}: ${t.count.toLocaleString()} occurrences`);
  });
  
  const transition52 = all54.find(t => t.toStateId === 5 && t.toWorkflowId === 2);
  if (transition52) {
    console.log(`\n? Confirmed: 5-4 ? 5-2 transition present with ${transition52.count.toLocaleString()} occurrences!`);
  }
}
