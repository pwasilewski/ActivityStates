export enum ActivityStateId {
  UNKNOWN = 1,
  REQUESTED = 2,
  CANCELLED = 3,
  MISSINGINFO_CP = 4,
  MISSINGINFO_EE = 5,
  MISSINGINFO_GDA = 6,
  REFUSED_CP = 7,
  REFUSED_CP_2 = 8,
  REFUSED_EE = 9,
  APPROVED_CP = 10,
  APPROVED_EE = 11,
  DISPUTED_CP = 12,
  DISPUTED_CP_2 = 13,
  DISPUTED_EE = 14,
  WRONG_CP = 15,
  RETURN_TO_ORIGINAL_CP = 16,
  APPROVED = 17,
  REFUSED = 18,
  DECISIONBYGDA = 19,
  MISSINGINFO_CE = 20,
  MISSINGINFO_GDPQ = 21,
  APPROVED_CE = 22,
  REFUSED_CE = 23,
  DECISIONBYGDPQ = 24
}

export enum WorkFlowStatus {
  READY_FOR_AGENDA = 'READY_FOR_AGENDA',
  WAITING_FOR_DECISION = 'WAITING_FOR_DECISION',
  WAITING_FOR_REQUESTOR = 'WAITING_FOR_REQUESTOR',
  DONE = 'DONE'
}

export type Language = 'EN' | 'FR' | 'NL';

export type CommitteeType = 'STANDARD CP' | 'EE' | 'DENTIST';

export interface WorkflowActivity {
  state: ActivityStateId;
  workflowStatus: WorkFlowStatus;
  committee: CommitteeType;
}

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

export interface TransitionResult {
  nextState: ActivityStateId;
  nextStatus: WorkFlowStatus;
  error?: string;
}