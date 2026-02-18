import { 
  ActivityStateId, 
  WorkFlowStatus, 
  WorkflowCommand, 
  WorkflowActivity, 
  TransitionResult,
  Language
} from './types.ts';

const ActivityStateTranslations: Record<ActivityStateId, { EN: string; FR: string; NL: string }> = {
  [ActivityStateId.UNKNOWN]: { EN: 'Initial State', FR: 'État Initial', NL: 'Initiële Status' },
  [ActivityStateId.REQUESTED]: { EN: 'Requested', FR: 'Demande introduite', NL: 'Aanvraag ingediend' },
  [ActivityStateId.CANCELLED]: { EN: 'Cancelled', FR: 'Demande annulée', NL: 'Aanvraag geannuleerd' },
  [ActivityStateId.MISSINGINFO_CP]: { EN: 'Missing Info CP', FR: 'Infos supplémentaires demandées par le CP', NL: 'Bijkomende info gevraagd door het PC' },
  [ActivityStateId.MISSINGINFO_EE]: { EN: 'Missing Info EE', FR: 'Infos supplémentaires demandées par le GT E&E', NL: 'Bijkomende info gevraagd door de WG E&E' },
  [ActivityStateId.MISSINGINFO_GDA]: { EN: 'Missing Info GDA', FR: 'Infos supplémentaires demandées par le GDA', NL: 'Bijkomende info gevraagd door de AS' },
  [ActivityStateId.REFUSED_CP]: { EN: 'Refused by CP', FR: 'Pas accepté par le CP', NL: 'Niet aanvaard door het PC' },
  [ActivityStateId.REFUSED_CP_2]: { EN: 'Refused by CP (2)', FR: 'Pas accepté par le CP (2)', NL: 'Niet aanvaard door het PC (2)' },
  [ActivityStateId.REFUSED_EE]: { EN: 'Refused by EE', FR: 'Pas accepté par le GT E&E', NL: 'Niet aanvaard door de WG E&E' },
  [ActivityStateId.APPROVED_CP]: { EN: 'Approved by CP', FR: 'Traité par le CP', NL: 'Behandeld door het PC' },
  [ActivityStateId.APPROVED_EE]: { EN: 'Approved by EE', FR: 'Traité par le GT E&E', NL: 'Behandeld door de WG E&E' },
  [ActivityStateId.DISPUTED_CP]: { EN: 'Disputed CP', FR: 'Contestation de la décision du CP', NL: 'Betwisting van de beslissing van het PC' },
  [ActivityStateId.DISPUTED_CP_2]: { EN: 'Disputed CP (2)', FR: 'Contestation de la décision du CP (2)', NL: 'Betwisting van de beslissing van het PC (2)' },
  [ActivityStateId.DISPUTED_EE]: { EN: 'Disputed EE', FR: 'Contestation de la décision du GT E&E', NL: 'Betwisting van de beslissing van de WG E&E' },
  [ActivityStateId.WRONG_CP]: { EN: 'Wrong CP', FR: 'Renvoyé à un autre CP / le GT E&E', NL: 'Doorgestuurd naar een ander PC / de WG E&E' },
  [ActivityStateId.RETURN_TO_ORIGINAL_CP]: { EN: 'Return to CP', FR: 'Renvoyé au CP', NL: 'Teruggestuurd naar het PC' },
  [ActivityStateId.APPROVED]: { EN: 'Approved', FR: 'Approuvé', NL: 'Goedgekeurd' },
  [ActivityStateId.REFUSED]: { EN: 'Refused', FR: 'Refusé', NL: 'Geweigerd' },
  [ActivityStateId.DECISIONBYGDA]: { EN: 'Decision by GDA', FR: 'Décision par le GDA', NL: 'Beslissing door de AS' },
  [ActivityStateId.MISSINGINFO_CE]: { EN: 'Missing Info CE', FR: 'Infos supplémentaires demandées par la CE', NL: 'Bijkomende info gevraagd door de EC' },
  [ActivityStateId.MISSINGINFO_GDPQ]: { EN: 'Missing Info GDPQ', FR: 'Infos supplémentaires demandées par le GDPQ', NL: 'Bijkomende info gevraagd door de ST' },
  [ActivityStateId.APPROVED_CE]: { EN: 'Approved by CE', FR: 'Acceptée par la CE', NL: 'Goedgekeurd door de EC' },
  [ActivityStateId.REFUSED_CE]: { EN: 'Refused by CE', FR: 'Refusée par la CE', NL: 'Geweigerd door de EC' },
  [ActivityStateId.DECISIONBYGDPQ]: { EN: 'Decision by GDPQ', FR: 'Décision par le GDPQ', NL: 'Beslissing door de ST' },
};

const WorkflowStatusTranslations: Record<WorkFlowStatus, { EN: string; FR: string; NL: string }> = {
  [WorkFlowStatus.READY_FOR_AGENDA]: { EN: 'Ready for Agenda', FR: "Vérification par l'INAMI", NL: 'Nazicht door het RIZIV' },
  [WorkFlowStatus.WAITING_FOR_DECISION]: { EN: 'Waiting for Decision', FR: "Transmise pour évaluation par l'INAMI", NL: 'Ter evaluatie doorgestuurd door het RIZIV' },
  [WorkFlowStatus.WAITING_FOR_REQUESTOR]: { EN: 'Waiting for Requestor', FR: 'Renvoi du dossier au demandeur', NL: 'Dossier teruggestuurd naar aanvrager' },
  [WorkFlowStatus.DONE]: { EN: 'Done', FR: 'Procédure de demande clôturée', NL: 'Aanvraagprocedure afgerond' },
};

const WorkflowStatusIdsMap: Record<WorkFlowStatus, number> = {
  [WorkFlowStatus.READY_FOR_AGENDA]: 1,
  [WorkFlowStatus.WAITING_FOR_DECISION]: 2,
  [WorkFlowStatus.WAITING_FOR_REQUESTOR]: 3,
  [WorkFlowStatus.DONE]: 4,
};

const CommandTranslations: Record<WorkflowCommand, { EN: string; FR: string; NL: string }> = {
  'Cancel': { EN: 'Cancel activity', FR: "Annuler l'activité", NL: 'Annuleer activiteit' },
  'CommitAgenda': { EN: 'Add to agenda', FR: "Ajouter à l'agenda", NL: 'Toevoegen aan agenda' },
  'RegisterMissingInfoNeed': { EN: 'Request missing info', FR: 'Demander des infos manquantes', NL: 'Vragen ontbrekende info' },
  'RegisterMissingInfoCENeed': { EN: 'Request missing info CE', FR: 'Demander des infos manquantes par le CE', NL: 'Vragen ontbrekende info door de EC' },
  'Refuse': { EN: 'Refuse', FR: 'Refuser', NL: 'Weiger' },
  'RefuseCE': { EN: 'Refuse by CE', FR: 'Refuser par le CE', NL: 'Weigeren door de EC' },
  'Approve': { EN: 'Approve', FR: 'Approuver', NL: 'Goedkeuren' },
  'ApproveCE': { EN: 'Accept by CE', FR: 'Accepter par la CE', NL: 'Goedgekeuren door de EC' },
  'RegisterDecsByGda': { EN: 'Register GDA decision', FR: 'Enregistrer la décision du GDA', NL: 'Registreren beslissing AS' },
  'RegisterDecsByGdpq': { EN: 'Register GDPQ decision', FR: 'Enregistrer la décision du GDPQ', NL: 'Registreren beslissing ST' },
  'RegisterWrongComiteParitaire': { EN: 'Wrong CP', FR: 'Enregistrer comité paritaire fautif', NL: 'Registreer foutief paritair comité' },
  'RegisterNotTreated': { EN: 'Not treated', FR: 'Enregistrer pas traiter', NL: 'Registreer niet behandeld' },
  'ReceiveMissingInfoFromRequestor': { EN: 'Missing info from requestor received', FR: 'Infos supplémentaires du demandeur reçues', NL: 'Aanvullende informatie van de aanvrager ontvangen' },
  'Dispute': { EN: 'Dispute', FR: 'Contestation de la décision du CP', NL: 'Betwisting van de beslissing van het PC' },
  'ReturnToOriginalCP': { EN: 'Return to original CP', FR: 'Enregistrer retour vers le comité paritaire original', NL: 'Registreer terug naar origineel paritair comité' },
  'NewRequest': { EN: 'New Request', FR: 'Nouvelle demande', NL: 'Nieuwe aanvraag' },
};

export const getCommandLabel = (cmd: WorkflowCommand, lang: Language = 'EN'): string => {
  return CommandTranslations[cmd][lang];
};

export const getStateLabel = (id: ActivityStateId, lang: Language = 'EN'): string => {
  return ActivityStateTranslations[id][lang];
};

export const getStatusLabel = (status: WorkFlowStatus, lang: Language = 'EN'): string => {
  return WorkflowStatusTranslations[status][lang];
};

export const getWorkflowStatusId = (status: WorkFlowStatus): number => {
  return WorkflowStatusIdsMap[status];
};

export const processCommand = (
  activity: WorkflowActivity, 
  command: WorkflowCommand
): TransitionResult => {
  const { state, workflowStatus, type } = activity;

  if (command === 'Cancel') {
    return { nextState: ActivityStateId.CANCELLED, nextStatus: WorkFlowStatus.DONE };
  }

  // Global start
  if (state === ActivityStateId.UNKNOWN) {
    if (command === 'NewRequest') {
      return { nextState: ActivityStateId.REQUESTED, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
    }
    return { nextState: state, nextStatus: workflowStatus, error: 'Seule une nouvelle demande est possible.' };
  }

  switch (state) {
    case ActivityStateId.REQUESTED:
      switch (command) {
        case 'CommitAgenda':
          return { nextState: ActivityStateId.REQUESTED, nextStatus: WorkFlowStatus.WAITING_FOR_DECISION };
        case 'RegisterMissingInfoNeed':
          return type === 'EE' 
            ? { nextState: ActivityStateId.MISSINGINFO_EE, nextStatus: WorkFlowStatus.WAITING_FOR_REQUESTOR }
            : { nextState: ActivityStateId.MISSINGINFO_CP, nextStatus: WorkFlowStatus.WAITING_FOR_REQUESTOR };
        case 'RegisterMissingInfoCENeed':
          return { nextState: ActivityStateId.MISSINGINFO_CE, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'Approve':
          if (type === 'EE') return { nextState: ActivityStateId.APPROVED_EE, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
          return { nextState: ActivityStateId.APPROVED_CP, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'Refuse':
          return type === 'EE'
            ? { nextState: ActivityStateId.REFUSED_EE, nextStatus: WorkFlowStatus.READY_FOR_AGENDA }
            : { nextState: ActivityStateId.REFUSED_CP, nextStatus: WorkFlowStatus.WAITING_FOR_REQUESTOR };
        case 'RegisterDecsByGda':
          return { nextState: ActivityStateId.DECISIONBYGDA, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'RegisterWrongComiteParitaire':
          return { nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'RegisterNotTreated':
          return { nextState: state, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'ApproveCE':
          return { nextState: ActivityStateId.APPROVED_CE, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'RefuseCE':
          return { nextState: ActivityStateId.REFUSED_CE, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'RegisterDecsByGdpq':
          return { nextState: ActivityStateId.DECISIONBYGDPQ, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
      }
      break;

    case ActivityStateId.MISSINGINFO_CP:
      switch (command) {
        case 'ReceiveMissingInfoFromRequestor':
          return { nextState: ActivityStateId.MISSINGINFO_CP, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'CommitAgenda':
          return { nextState: ActivityStateId.MISSINGINFO_CP, nextStatus: WorkFlowStatus.WAITING_FOR_DECISION };
        case 'RegisterMissingInfoNeed':
          return { nextState: ActivityStateId.MISSINGINFO_CP, nextStatus: WorkFlowStatus.WAITING_FOR_REQUESTOR };
        case 'RegisterWrongComiteParitaire':
          return { nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'Approve':
          return { nextState: ActivityStateId.APPROVED_CP, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'Refuse':
          return { nextState: ActivityStateId.REFUSED_CP, nextStatus: WorkFlowStatus.WAITING_FOR_REQUESTOR };
        case 'RegisterDecsByGda':
          return { nextState: ActivityStateId.DECISIONBYGDA, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
      }
      break;

    case ActivityStateId.MISSINGINFO_EE:
      switch (command) {
        case 'ReceiveMissingInfoFromRequestor':
          return { nextState: ActivityStateId.MISSINGINFO_EE, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'CommitAgenda':
          return { nextState: ActivityStateId.MISSINGINFO_EE, nextStatus: WorkFlowStatus.WAITING_FOR_DECISION };
        case 'RegisterMissingInfoNeed':
          return { nextState: ActivityStateId.MISSINGINFO_EE, nextStatus: WorkFlowStatus.WAITING_FOR_REQUESTOR };
        case 'Approve':
          return { nextState: ActivityStateId.APPROVED_EE, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'Refuse':
          return { nextState: ActivityStateId.REFUSED_EE, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
      }
      break;

    case ActivityStateId.WRONG_CP:
      switch (command) {
        case 'ReturnToOriginalCP':
          return { nextState: ActivityStateId.RETURN_TO_ORIGINAL_CP, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'CommitAgenda':
          return { nextState: ActivityStateId.WRONG_CP, nextStatus: WorkFlowStatus.WAITING_FOR_DECISION };
      }
      break;

    case ActivityStateId.RETURN_TO_ORIGINAL_CP:
      switch (command) {
        case 'CommitAgenda':
          return { nextState: ActivityStateId.RETURN_TO_ORIGINAL_CP, nextStatus: WorkFlowStatus.WAITING_FOR_DECISION };
        case 'Approve':
          return { nextState: ActivityStateId.APPROVED_CP, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'Refuse':
          return { nextState: ActivityStateId.REFUSED_CP, nextStatus: WorkFlowStatus.WAITING_FOR_REQUESTOR };
      }
      break;

    case ActivityStateId.REFUSED_CP:
    case ActivityStateId.REFUSED_CP_2:
      switch (command) {
        case 'Dispute':
          return { 
            nextState: state === ActivityStateId.REFUSED_CP ? ActivityStateId.DISPUTED_CP : ActivityStateId.DISPUTED_CP_2, 
            nextStatus: WorkFlowStatus.READY_FOR_AGENDA 
          };
        case 'Approve':
          return { nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatus.DONE };
      }
      break;

    case ActivityStateId.DISPUTED_CP:
      switch (command) {
        case 'CommitAgenda':
          return { nextState: ActivityStateId.DISPUTED_CP, nextStatus: WorkFlowStatus.WAITING_FOR_DECISION };
        case 'Approve':
          return { nextState: ActivityStateId.APPROVED_CP, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'Refuse':
          return { nextState: ActivityStateId.REFUSED_CP_2, nextStatus: WorkFlowStatus.WAITING_FOR_REQUESTOR };
      }
      break;

    case ActivityStateId.MISSINGINFO_CE:
      switch(command) {
        case 'CommitAgenda':
          return { nextState: ActivityStateId.MISSINGINFO_CE, nextStatus: WorkFlowStatus.WAITING_FOR_DECISION };
        case 'Approve':
          return { nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatus.DONE };
        case 'Refuse':
          return { nextState: ActivityStateId.REFUSED, nextStatus: WorkFlowStatus.DONE };
        case 'RegisterMissingInfoNeed':
          return { nextState: ActivityStateId.MISSINGINFO_GDPQ, nextStatus: WorkFlowStatus.WAITING_FOR_REQUESTOR };
      }
      break;

    case ActivityStateId.MISSINGINFO_GDPQ:
      switch(command) {
        case 'ReceiveMissingInfoFromRequestor':
          return { nextState: ActivityStateId.MISSINGINFO_GDPQ, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'CommitAgenda':
          return { nextState: ActivityStateId.MISSINGINFO_GDPQ, nextStatus: WorkFlowStatus.WAITING_FOR_DECISION };
        case 'ApproveCE':
          return { nextState: ActivityStateId.APPROVED_CE, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'RefuseCE':
          return { nextState: ActivityStateId.REFUSED_CE, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'RegisterDecsByGdpq':
          return { nextState: ActivityStateId.DECISIONBYGDPQ, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
        case 'RegisterMissingInfoCENeed':
          return { nextState: ActivityStateId.MISSINGINFO_CE, nextStatus: WorkFlowStatus.READY_FOR_AGENDA };
      }
      break;
      
    case ActivityStateId.DECISIONBYGDA:
    case ActivityStateId.DECISIONBYGDPQ:
      switch(command) {
        case 'Approve':
          return { nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatus.DONE };
        case 'Refuse':
          return { nextState: ActivityStateId.REFUSED, nextStatus: WorkFlowStatus.DONE };
        case 'CommitAgenda':
          return { nextState: state, nextStatus: WorkFlowStatus.WAITING_FOR_DECISION };
      }
      break;

    case ActivityStateId.APPROVED_CE:
    case ActivityStateId.REFUSED_CE:
      switch(command) {
        case 'Approve':
          return { nextState: ActivityStateId.APPROVED, nextStatus: WorkFlowStatus.DONE };
        case 'Refuse':
          return { nextState: ActivityStateId.REFUSED, nextStatus: WorkFlowStatus.DONE };
        case 'CommitAgenda':
          return { nextState: state, nextStatus: WorkFlowStatus.WAITING_FOR_DECISION };
      }
      break;
  }

  return { nextState: state, nextStatus: workflowStatus, error: `Command "${command}" is not valid for state ${ActivityStateId[state]}` };
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