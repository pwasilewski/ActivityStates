import { 
  ActivityStateId, 
  WorkFlowStatusId,
  WorkflowCommand, 
  WorkflowActivity, 
  TransitionResult,
  CommitteeType
} from '../types';
import { isProductionTransition } from './production-transitions';

export const COMMITTEE_STATES: Record<CommitteeType, ActivityStateId[]> = {
  'DENTIST': [
    ActivityStateId.APPROVED,           // 17
    ActivityStateId.REQUESTED,          // 2
    ActivityStateId.CANCELLED,          // 3
    ActivityStateId.APPROVED_CE,        // 22
    ActivityStateId.MISSINGINFO_GDPQ,   // 21
    ActivityStateId.DECISIONBYGDPQ,     // 24
    ActivityStateId.MISSINGINFO_CE,     // 20
    ActivityStateId.REFUSED_CE,         // 23
    ActivityStateId.REFUSED,            // 18
  ],
  'STANDARD CP': [
    ActivityStateId.APPROVED,              // 17
    ActivityStateId.APPROVED_CP,           // 10
    ActivityStateId.REFUSED,               // 18
    ActivityStateId.DECISIONBYGDA,         // 19
    ActivityStateId.DISPUTED_EE,           // 14
    ActivityStateId.REQUESTED,             // 2
    ActivityStateId.MISSINGINFO_GDA,       // 6
    ActivityStateId.REFUSED_CP,            // 7
    ActivityStateId.CANCELLED,             // 3
    ActivityStateId.DISPUTED_CP,           // 12
    ActivityStateId.DISPUTED_CP_2,         // 13
    ActivityStateId.APPROVED_EE,           // 11
    ActivityStateId.REFUSED_CP_2,          // 8
    ActivityStateId.WRONG_CP,              // 15
    ActivityStateId.REFUSED_EE,            // 9
    ActivityStateId.MISSINGINFO_CP,        // 4
    ActivityStateId.MISSINGINFO_EE,        // 5
  ],
  'EE': [
    ActivityStateId.APPROVED,              // 17
    ActivityStateId.APPROVED_CP,           // 10
    ActivityStateId.REFUSED,               // 18
    ActivityStateId.DECISIONBYGDA,         // 19
    ActivityStateId.DISPUTED_EE,           // 14
    ActivityStateId.REQUESTED,             // 2
    ActivityStateId.MISSINGINFO_GDA,       // 6
    ActivityStateId.REFUSED_CP,            // 7
    ActivityStateId.CANCELLED,             // 3
    ActivityStateId.DISPUTED_CP,           // 12
    ActivityStateId.DISPUTED_CP_2,         // 13
    ActivityStateId.APPROVED_EE,           // 11
    ActivityStateId.REFUSED_CP_2,          // 8
    ActivityStateId.WRONG_CP,              // 15
    ActivityStateId.REFUSED_EE,            // 9
    ActivityStateId.MISSINGINFO_CP,        // 4
    ActivityStateId.MISSINGINFO_EE,        // 5
  ],
};

export const UI_COMMANDS: WorkflowCommand[] = [
  'NewRequest',
  'CommitAgenda',
  'RegisterMissingInfoNeed',
  'RegisterMissingInfoCENeed',
  'ReceiveMissingInfoFromRequestor',
  'Approve',
  'ApproveCE',
  'Refuse',
  'RefuseCE',
  'Dispute',
  'RegisterDecsByGda',
  'RegisterDecsByGdpq',
  'RegisterWrongComiteParitaire',
  'RegisterNotTreated',
  'ReturnToOriginalCP',
  'Cancel'
];

export const processCommand = (
  activity: WorkflowActivity, 
  command: WorkflowCommand
): TransitionResult => {
  const { state, workflowStatus, committee } = activity;

  const validateTransition = (result: TransitionResult): TransitionResult => {
    if (result.error) {
      return result;
    }
    
    if (!isProductionTransition(state, workflowStatus, result.nextState, result.nextStatus)) {
      return { 
        nextState: state, 
        nextStatus: workflowStatus, 
        error: `Cette transition (${ActivityStateId[state]}-${workflowStatus} → ${ActivityStateId[result.nextState]}-${result.nextStatus}) n'est pas autorisée selon les données de production.` 
      };
    }
    
    return result;
  };

  if (command === 'Cancel') {
    return validateTransition({ nextState: ActivityStateId.CANCELLED, nextStatus: WorkFlowStatusId.DONE });
  }

  if (state === ActivityStateId.UNKNOWN) {
    if (command === 'NewRequest') {
      return { nextState: ActivityStateId.REQUESTED, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA };
    }
    return { nextState: state, nextStatus: workflowStatus, error: 'Seule une nouvelle demande est possible.' };
  }

  switch (state) {
    case ActivityStateId.REQUESTED:
      switch (command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.REQUESTED, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterMissingInfoNeed':
          return validateTransition(committee === 'EE' 
            ? { nextState: ActivityStateId.MISSINGINFO_EE, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR }
            : { nextState: ActivityStateId.MISSINGINFO_CP, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterMissingInfoCENeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_CE, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          if (committee === 'EE') return validateTransition({ nextState: ActivityStateId.APPROVED_EE, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
          return validateTransition({ nextState: ActivityStateId.APPROVED_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Refuse':
          return validateTransition(committee === 'EE'
            ? { nextState: ActivityStateId.REFUSED_EE, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA }
            : { nextState: ActivityStateId.REFUSED_CP, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterDecsByGda':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDA, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterWrongComiteParitaire':
          return validateTransition({ nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'ApproveCE':
          return validateTransition({ nextState: ActivityStateId.APPROVED_CE, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RefuseCE':
          return validateTransition({ nextState: ActivityStateId.REFUSED_CE, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterDecsByGdpq':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDPQ, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;

    case ActivityStateId.CANCELLED:
      switch (command) {
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: workflowStatus });
      }
      break;

    case ActivityStateId.MISSINGINFO_CP:
      switch (command) {
        case 'ReceiveMissingInfoFromRequestor':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_CP, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_CP, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterWrongComiteParitaire':
          return validateTransition({ nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED_CP, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterDecsByGda':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDA, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterDecsByGdpq':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDPQ, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;

    case ActivityStateId.MISSINGINFO_EE:
      switch (command) {
        case 'ReceiveMissingInfoFromRequestor':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_EE, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_EE, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_EE, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterWrongComiteParitaire':
          return validateTransition({ nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED_EE, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED_EE, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterDecsByGda':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDA, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterDecsByGdpq':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDPQ, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;

    case ActivityStateId.MISSINGINFO_GDA:
      switch (command) {
        case 'ReceiveMissingInfoFromRequestor':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDA, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDA, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDA, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterWrongComiteParitaire':
          return validateTransition({ nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatusId.DONE });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED, nextStatus: WorkFlowStatusId.DONE });
      }
      break;

    case ActivityStateId.REFUSED_CP:
      switch (command) {
        case 'Dispute':
          return validateTransition({ nextState: ActivityStateId.DISPUTED_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDA, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterWrongComiteParitaire':
          return validateTransition({ nextState: ActivityStateId.RETURN_TO_ORIGINAL_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatusId.DONE });
        case 'RegisterDecsByGda':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDA, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterDecsByGdpq':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDPQ, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;

    case ActivityStateId.REFUSED_CP_2:
      switch (command) {
        case 'Dispute':
          return validateTransition({ nextState: ActivityStateId.DISPUTED_CP_2, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDA, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterWrongComiteParitaire':
          return validateTransition({ nextState: ActivityStateId.RETURN_TO_ORIGINAL_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatusId.DONE });
      }
      break;

    case ActivityStateId.REFUSED_EE:
      switch (command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.REFUSED_EE, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDA, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Dispute':
          return validateTransition({ nextState: ActivityStateId.DISPUTED_EE, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatusId.DONE });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED_EE, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
      }
      break;

    case ActivityStateId.APPROVED_CP:
      switch (command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.APPROVED_CP, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDA, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterWrongComiteParitaire':
          return validateTransition({ nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatusId.DONE });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED, nextStatus: WorkFlowStatusId.DONE });
        case 'RegisterDecsByGda':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDA, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;

    case ActivityStateId.APPROVED_EE:
      switch (command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.APPROVED_EE, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDA, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterWrongComiteParitaire':
          return validateTransition({ nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatusId.DONE });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED, nextStatus: WorkFlowStatusId.DONE });
      }
      break;

    case ActivityStateId.DISPUTED_CP:
      switch (command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.DISPUTED_CP, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_CP, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterWrongComiteParitaire':
          return validateTransition({ nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED_CP_2, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterDecsByGda':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDA, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterDecsByGdpq':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDPQ, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;

    case ActivityStateId.DISPUTED_CP_2:
      switch (command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.DISPUTED_CP_2, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDA, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterWrongComiteParitaire':
          return validateTransition({ nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatusId.DONE });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED, nextStatus: WorkFlowStatusId.DONE });
      }
      break;

    case ActivityStateId.DISPUTED_EE:
      switch (command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.DISPUTED_EE, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDA, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterWrongComiteParitaire':
          return validateTransition({ nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatusId.DONE });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED, nextStatus: WorkFlowStatusId.DONE });
      }
      break;

    case ActivityStateId.WRONG_CP:
      switch (command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.REQUESTED, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;

    case ActivityStateId.RETURN_TO_ORIGINAL_CP:
      switch (command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.REQUESTED, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;

    case ActivityStateId.MISSINGINFO_CE:
      switch(command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_CE, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatusId.DONE });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED, nextStatus: WorkFlowStatusId.DONE });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDPQ, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;

    case ActivityStateId.MISSINGINFO_GDPQ:
      switch(command) {
        case 'ReceiveMissingInfoFromRequestor':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDPQ, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDPQ, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'ApproveCE':
          return validateTransition({ nextState: ActivityStateId.APPROVED_CE, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RefuseCE':
          return validateTransition({ nextState: ActivityStateId.REFUSED_CE, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterDecsByGdpq':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDPQ, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'RegisterMissingInfoCENeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_CE, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;

    case ActivityStateId.APPROVED_CE:
    case ActivityStateId.REFUSED_CE:
      switch(command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatusId.DONE });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED, nextStatus: WorkFlowStatusId.DONE });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDPQ, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;
      
    case ActivityStateId.DECISIONBYGDA:
      switch(command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDA, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDA, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'RegisterWrongComiteParitaire':
          return validateTransition({ nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatusId.DONE });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED, nextStatus: WorkFlowStatusId.DONE });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;

    case ActivityStateId.DECISIONBYGDPQ:
      switch(command) {
        case 'CommitAgenda':
          return validateTransition({ nextState: ActivityStateId.DECISIONBYGDPQ, nextStatus: WorkFlowStatusId.WAITING_FOR_DECISION });
        case 'RegisterMissingInfoNeed':
          return validateTransition({ nextState: ActivityStateId.MISSINGINFO_GDPQ, nextStatus: WorkFlowStatusId.WAITING_FOR_REQUESTOR });
        case 'Approve':
          return validateTransition({ nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatusId.DONE });
        case 'Refuse':
          return validateTransition({ nextState: ActivityStateId.REFUSED, nextStatus: WorkFlowStatusId.DONE });
        case 'RegisterNotTreated':
          return validateTransition({ nextState: state, nextStatus: WorkFlowStatusId.READY_FOR_AGENDA });
      }
      break;
  }

  return { nextState: state, nextStatus: workflowStatus, error: `Command "${command}" is not valid for state ${ActivityStateId[state]}` };
};
