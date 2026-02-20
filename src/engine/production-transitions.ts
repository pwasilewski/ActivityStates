// AUTO-GENERATED: Production-only state transitions with occurrence counts
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
  TOP_75: 21,
  TOP_150: 0,
  ALL: 1
} as const;

// Current filter mode (can be changed at runtime)
let currentFilterMode: TransitionFilterMode = 'ALL';

// Top 75 most common transitions (>= 21 occurrences)
const TRANSITIONS_TOP_75: Record<string, TransitionTarget[]> = {
  "2-2": [
    { toStateId: 2 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 124824 },
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 2170 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 51602 },
  ],
  "2-3": [
    { toStateId: 2 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 39 },
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 553 },
    { toStateId: 4 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 1832 },
    { toStateId: 5 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 959 },
    { toStateId: 7 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 1959 },
    { toStateId: 9 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1321 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 82024 },
    { toStateId: 11 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 24680 },
    { toStateId: 15 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 748 },
    { toStateId: 19 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 187 },
    { toStateId: 20 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 670 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 7621 },
    { toStateId: 23 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 371 },
    { toStateId: 24 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 39 },
  ],
  "3-5": [
    { toStateId: 2 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 28 },
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 149 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 107 },
  ],
  "4-2": [
    { toStateId: 4 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 1258 },
  ],
  "4-3": [
    { toStateId: 4 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 51 },
    { toStateId: 7 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 114 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1003 },
  ],
  "4-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 44 },
    { toStateId: 4 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1260 },
  ],
  "5-2": [
    { toStateId: 5 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 706 },
  ],
  "5-3": [
    { toStateId: 9 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 62 },
    { toStateId: 11 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 589 },
  ],
  "5-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 36 },
    { toStateId: 5 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 706 },
  ],
  "7-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 34 },
    { toStateId: 12 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 225 },
  ],
  "8-4": [
    { toStateId: 13 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 27 },
  ],
  "9-2": [
    { toStateId: 9 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 1372 },
  ],
  "9-3": [
    { toStateId: 9 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 1334 },
  ],
  "9-4": [
    { toStateId: 14 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 176 },
  ],
  "10-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 155 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 82538 },
  ],
  "10-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 65 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 82450 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 21 },
  ],
  "11-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 68 },
    { toStateId: 11 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 24914 },
  ],
  "11-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 26 },
    { toStateId: 6 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 22 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 24861 },
  ],
  "12-2": [
    { toStateId: 12 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 224 },
  ],
  "12-3": [
    { toStateId: 8 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 102 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 99 },
  ],
  "13-2": [
    { toStateId: 13 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 27 },
  ],
  "14-2": [
    { toStateId: 14 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 174 },
  ],
  "14-3": [
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 125 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 49 },
  ],
  "15-2": [
    { toStateId: 2 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 771 },
  ],
  "17-5": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 1310 },
  ],
  "19-2": [
    { toStateId: 19 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 181 },
  ],
  "19-3": [
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 129 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 40 },
  ],
  "20-2": [
    { toStateId: 20 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 713 },
  ],
  "20-3": [
    { toStateId: 21 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 675 },
  ],
  "21-2": [
    { toStateId: 21 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 575 },
  ],
  "21-3": [
    { toStateId: 20 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 45 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 431 },
    { toStateId: 23 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 72 },
    { toStateId: 24 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 25 },
  ],
  "21-4": [
    { toStateId: 21 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 582 },
  ],
  "22-2": [
    { toStateId: 22 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 8085 },
  ],
  "22-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 54 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 7780 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 46 },
  ],
  "23-2": [
    { toStateId: 23 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 446 },
  ],
  "23-3": [
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 416 },
  ],
  "24-2": [
    { toStateId: 24 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 64 },
  ],
  "24-3": [
    { toStateId: 21 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 33 },
  ],
};

// Top 150 most common transitions (>= 0 occurrences)
const TRANSITIONS_TOP_150: Record<string, TransitionTarget[]> = {
  "2-2": [
    { toStateId: 2 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1 },
    { toStateId: 2 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 124824 },
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 2170 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 51602 },
  ],
  "2-3": [
    { toStateId: 2 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 39 },
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 553 },
    { toStateId: 4 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 1832 },
    { toStateId: 5 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 959 },
    { toStateId: 7 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 1959 },
    { toStateId: 9 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1321 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 82024 },
    { toStateId: 11 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 24680 },
    { toStateId: 15 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 748 },
    { toStateId: 19 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 187 },
    { toStateId: 20 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 670 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 7621 },
    { toStateId: 23 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 371 },
    { toStateId: 24 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 39 },
  ],
  "3-5": [
    { toStateId: 2 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 28 },
    { toStateId: 2 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 16 },
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 149 },
    { toStateId: 4 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 1 },
    { toStateId: 7 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 1 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 8 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 4 },
    { toStateId: 11 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 3 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 107 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 4 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 12 },
    { toStateId: 23 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 3 },
  ],
  "4-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 1 },
    { toStateId: 4 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 1258 },
  ],
  "4-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 4 },
    { toStateId: 4 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 51 },
    { toStateId: 7 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 114 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1003 },
    { toStateId: 15 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 7 },
    { toStateId: 19 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 6 },
  ],
  "4-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 44 },
    { toStateId: 4 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1260 },
  ],
  "5-2": [
    { toStateId: 5 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 706 },
  ],
  "5-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 6 },
    { toStateId: 5 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 11 },
    { toStateId: 9 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 62 },
    { toStateId: 11 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 589 },
    { toStateId: 15 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 17 },
    { toStateId: 19 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 6 },
  ],
  "5-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 36 },
    { toStateId: 5 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 706 },
  ],
  "6-2": [
    { toStateId: 6 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 13 },
  ],
  "6-3": [
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 4 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 9 },
  ],
  "6-4": [
    { toStateId: 6 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 16 },
  ],
  "7-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 34 },
    { toStateId: 12 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 225 },
  ],
  "8-4": [
    { toStateId: 13 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 27 },
  ],
  "9-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 4 },
    { toStateId: 9 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 1372 },
  ],
  "9-3": [
    { toStateId: 6 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 4 },
    { toStateId: 9 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 1334 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 2 },
  ],
  "9-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 9 },
    { toStateId: 14 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 176 },
  ],
  "10-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 155 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 82538 },
  ],
  "10-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 65 },
    { toStateId: 6 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 3 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 82450 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 21 },
  ],
  "11-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 68 },
    { toStateId: 11 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 24914 },
  ],
  "11-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 26 },
    { toStateId: 6 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 22 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 24861 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 5 },
  ],
  "12-2": [
    { toStateId: 12 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 224 },
  ],
  "12-3": [
    { toStateId: 4 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 10 },
    { toStateId: 8 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 102 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 99 },
    { toStateId: 15 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 6 },
    { toStateId: 19 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 2 },
  ],
  "13-2": [
    { toStateId: 13 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 27 },
  ],
  "13-3": [
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 19 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 8 },
  ],
  "14-2": [
    { toStateId: 14 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 174 },
  ],
  "14-3": [
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 125 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 49 },
  ],
  "15-2": [
    { toStateId: 2 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 771 },
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 3 },
  ],
  "17-5": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 1310 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 1 },
  ],
  "18-5": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 3 },
  ],
  "19-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 10 },
    { toStateId: 19 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 181 },
  ],
  "19-3": [
    { toStateId: 6 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 10 },
    { toStateId: 15 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 2 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 129 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 40 },
  ],
  "20-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 3 },
    { toStateId: 20 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 713 },
  ],
  "20-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 4 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 5 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 2 },
    { toStateId: 20 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1 },
    { toStateId: 21 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 675 },
  ],
  "21-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 2 },
    { toStateId: 21 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 575 },
  ],
  "21-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 2 },
    { toStateId: 20 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 45 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 431 },
    { toStateId: 23 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 72 },
    { toStateId: 24 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 25 },
  ],
  "21-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 15 },
    { toStateId: 21 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 582 },
  ],
  "22-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 17 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 8085 },
  ],
  "22-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 54 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 7780 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 11 },
    { toStateId: 21 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 5 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 46 },
  ],
  "23-2": [
    { toStateId: 23 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 446 },
  ],
  "23-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 5 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 5 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 416 },
    { toStateId: 21 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 13 },
    { toStateId: 23 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 3 },
  ],
  "24-2": [
    { toStateId: 24 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 64 },
  ],
  "24-3": [
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 16 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 8 },
    { toStateId: 21 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 33 },
  ],
};

// All production transitions (>= 1 occurrence)
const TRANSITIONS_ALL: Record<string, TransitionTarget[]> = {
  "2-2": [
    { toStateId: 2 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1 },
    { toStateId: 2 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 124824 },
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 2170 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 51602 },
  ],
  "2-3": [
    { toStateId: 2 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 39 },
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 553 },
    { toStateId: 4 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 1832 },
    { toStateId: 5 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 959 },
    { toStateId: 7 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 1959 },
    { toStateId: 9 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1321 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 82024 },
    { toStateId: 11 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 24680 },
    { toStateId: 15 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 748 },
    { toStateId: 19 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 187 },
    { toStateId: 20 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 670 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 7621 },
    { toStateId: 23 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 371 },
    { toStateId: 24 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 39 },
  ],
  "3-5": [
    { toStateId: 2 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 28 },
    { toStateId: 2 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 16 },
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 149 },
    { toStateId: 4 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 1 },
    { toStateId: 7 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 1 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 8 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 4 },
    { toStateId: 11 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 3 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 107 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 4 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 12 },
    { toStateId: 23 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 3 },
  ],
  "4-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 1 },
    { toStateId: 4 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 1258 },
  ],
  "4-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 4 },
    { toStateId: 4 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 51 },
    { toStateId: 7 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 114 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1003 },
    { toStateId: 15 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 7 },
    { toStateId: 19 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 6 },
  ],
  "4-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 44 },
    { toStateId: 4 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1260 },
  ],
  "5-2": [
    { toStateId: 5 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 706 },
  ],
  "5-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 6 },
    { toStateId: 5 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 11 },
    { toStateId: 9 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 62 },
    { toStateId: 11 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 589 },
    { toStateId: 15 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 17 },
    { toStateId: 19 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 6 },
  ],
  "5-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 36 },
    { toStateId: 5 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 706 },
  ],
  "6-2": [
    { toStateId: 6 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 13 },
  ],
  "6-3": [
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 4 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 9 },
  ],
  "6-4": [
    { toStateId: 6 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 16 },
  ],
  "7-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 34 },
    { toStateId: 12 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 225 },
  ],
  "8-4": [
    { toStateId: 13 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 27 },
  ],
  "9-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 4 },
    { toStateId: 9 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 1372 },
  ],
  "9-3": [
    { toStateId: 6 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 4 },
    { toStateId: 9 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 1334 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 2 },
  ],
  "9-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 9 },
    { toStateId: 14 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 176 },
  ],
  "10-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 155 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 82538 },
  ],
  "10-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 65 },
    { toStateId: 6 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 3 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 82450 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 21 },
  ],
  "11-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 68 },
    { toStateId: 11 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 24914 },
  ],
  "11-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 26 },
    { toStateId: 6 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 22 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 24861 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 5 },
  ],
  "12-2": [
    { toStateId: 12 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 224 },
  ],
  "12-3": [
    { toStateId: 4 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 10 },
    { toStateId: 8 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 102 },
    { toStateId: 10 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 99 },
    { toStateId: 15 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 6 },
    { toStateId: 19 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 2 },
  ],
  "13-2": [
    { toStateId: 13 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 27 },
  ],
  "13-3": [
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 19 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 8 },
  ],
  "14-2": [
    { toStateId: 14 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 174 },
  ],
  "14-3": [
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 125 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 49 },
  ],
  "15-2": [
    { toStateId: 2 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 771 },
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 3 },
  ],
  "17-5": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 1310 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 1 },
  ],
  "18-5": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 3 },
  ],
  "19-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 10 },
    { toStateId: 19 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 181 },
  ],
  "19-3": [
    { toStateId: 6 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 10 },
    { toStateId: 15 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 2 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 129 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 40 },
  ],
  "20-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 3 },
    { toStateId: 20 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 713 },
  ],
  "20-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 4 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 5 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 2 },
    { toStateId: 20 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 1 },
    { toStateId: 21 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 675 },
  ],
  "21-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 2 },
    { toStateId: 21 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 575 },
  ],
  "21-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 2 },
    { toStateId: 20 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 45 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 431 },
    { toStateId: 23 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 72 },
    { toStateId: 24 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 25 },
  ],
  "21-4": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 15 },
    { toStateId: 21 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 582 },
  ],
  "22-2": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 17 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 8085 },
  ],
  "22-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 54 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 7780 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 11 },
    { toStateId: 21 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 5 },
    { toStateId: 22 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 46 },
  ],
  "23-2": [
    { toStateId: 23 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 446 },
  ],
  "23-3": [
    { toStateId: 3 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 5 },
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 5 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 416 },
    { toStateId: 21 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 13 },
    { toStateId: 23 as ActivityStateId, toWorkflowId: 2 as WorkFlowStatusId, count: 3 },
  ],
  "24-2": [
    { toStateId: 24 as ActivityStateId, toWorkflowId: 3 as WorkFlowStatusId, count: 64 },
  ],
  "24-3": [
    { toStateId: 17 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 16 },
    { toStateId: 18 as ActivityStateId, toWorkflowId: 5 as WorkFlowStatusId, count: 8 },
    { toStateId: 21 as ActivityStateId, toWorkflowId: 4 as WorkFlowStatusId, count: 33 },
  ],
};

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
  console.log(`?? Transition filter changed to: ${mode} (min ${FILTER_THRESHOLDS[mode]} occurrences)`);
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
  const key = `${fromState}-${fromWorkflowId}`;
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
  const key = `${fromState}-${fromWorkflowId}`;
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
  const key = `${fromState}-${fromWorkflowId}`;
  const allTransitions = TRANSITIONS_ALL[key];
  
  if (!allTransitions) {
    return 0;
  }
  
  const transition = allTransitions.find(
    t => t.toStateId === toState && t.toWorkflowId === toWorkflowId
  );
  
  return transition?.count || 0;
}
