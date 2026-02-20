import { ActivityStateId, WorkFlowStatusId } from './enums';

/**
 * Committee Type
 * Different types of committees that can process workflow activities
 */
export type CommitteeType = 'STANDARD CP' | 'EE' | 'DENTIST';

/**
 * Workflow Command
 * All possible commands that can be executed on a workflow activity
 */
export type WorkflowCommand = 
  | 'NewRequest'
  | 'Cancel'
  | 'ReceiveMissingInfoFromRequestor'
  | 'Dispute'
  | 'CommitAgenda'
  | 'Refuse'
  | 'RefuseCE'
  | 'Approve'
  | 'ApproveCE'
  | 'RegisterWrongComiteParitaire'
  | 'RegisterNotTreated'
  | 'ReturnToOriginalCP'
  | 'RegisterMissingInfoNeed'
  | 'RegisterMissingInfoCENeed'
  | 'RegisterDecsByGda'
  | 'RegisterDecsByGdpq';

/**
 * Workflow Activity
 * Represents a single workflow activity with its current state and metadata
 */
export interface WorkflowActivity {
  state: ActivityStateId;
  workflowStatus: WorkFlowStatusId;
  committee: CommitteeType;
}

/**
 * Transition Result
 * Result of executing a workflow command, including the next state or an error
 */
export interface TransitionResult {
  nextState: ActivityStateId;
  nextStatus: WorkFlowStatusId;
  error?: string;
}
