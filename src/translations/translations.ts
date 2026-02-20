import { 
  ActivityStateId, 
  WorkFlowStatusId, 
  WorkflowCommand, 
  CommitteeType,
  Language 
} from '../types';

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

const WorkflowStatusTranslations: Record<WorkFlowStatusId, { EN: string; FR: string; NL: string }> = {
  [WorkFlowStatusId.UNKNOWN]: { EN: 'Unknown', FR: 'Inconnu', NL: 'Onbekend' },
  [WorkFlowStatusId.READY_FOR_AGENDA]: { EN: 'Ready for Agenda', FR: "Vérification par l'INAMI", NL: 'Nazicht door het RIZIV' },
  [WorkFlowStatusId.WAITING_FOR_DECISION]: { EN: 'Waiting for Decision', FR: "Transmise pour évaluation par l'INAMI", NL: 'Ter evaluatie doorgestuurd door het RIZIV' },
  [WorkFlowStatusId.WAITING_FOR_REQUESTOR]: { EN: 'Waiting for Requestor', FR: 'Renvoi du dossier au demandeur', NL: 'Dossier teruggestuurd naar aanvrager' },
  [WorkFlowStatusId.DONE]: { EN: 'Done', FR: 'Procédure de demande clôturée', NL: 'Aanvraagprocedure afgerond' },
};

const CommandTranslations: Record<WorkflowCommand, { EN: string; FR: string; NL: string }> = {
  'Cancel': { EN: 'Cancel activity', FR: "Annuler l'activité", NL: 'Annuleer activiteit' },
  'CommitAgenda': { EN: 'Add to agenda', FR: "Ajouter à l'agenda", NL: 'Toevoegen aan agenda' },
  'RegisterMissingInfoNeed': { EN: 'Request missing info', FR: 'Demander des infos manquantes', NL: 'Vragen ontbrekende info' },
  'RegisterMissingInfoCENeed': { EN: 'Request missing info CE', FR: 'Demander des infos manquantes par le CE', NL: 'Vragen ontbrekende info door de EC' },
  'Refuse': { EN: 'Refuse', FR: 'Refuser', NL: 'Weiger' },
  'RefuseCE': { EN: 'Refuse by CE', FR: 'Refuser par le CE', NL: 'Weigeren door de EC' },
  'Approve': { EN: 'Approve', FR: 'Approuver', NL: 'Goedkeuren' },
  'ApproveCE': { EN: 'Accept by CE', FR: 'Accepter par le CE', NL: 'Goedgekeuren door de EC' },
  'RegisterDecsByGda': { EN: 'Register GDA decision', FR: 'Enregistrer la décision du GDA', NL: 'Registreren beslissing AS' },
  'RegisterDecsByGdpq': { EN: 'Register GDPQ decision', FR: 'Enregistrer la décision du GDPQ', NL: 'Registreren beslissing ST' },
  'RegisterWrongComiteParitaire': { EN: 'Wrong CP', FR: 'Enregistrer comité paritaire fautif', NL: 'Registreer foutief paritair comité' },
  'RegisterNotTreated': { EN: 'Not treated', FR: 'Enregistrer pas traiter', NL: 'Registreer niet behandeld' },
  'ReceiveMissingInfoFromRequestor': { EN: 'Missing info from requestor received', FR: 'Infos supplémentaires du demandeur reçues', NL: 'Aanvullende informatie van de aanvrager ontvangen' },
  'Dispute': { EN: 'Dispute', FR: 'Contestation de la décision du CP', NL: 'Betwisting van de beslissing van het PC' },
  'ReturnToOriginalCP': { EN: 'Return to original CP', FR: 'Enregistrer retour vers le comité paritaire original', NL: 'Registreer terug naar origineel paritair comité' },
  'NewRequest': { EN: 'New Request', FR: 'Nouvelle demande', NL: 'Nieuwe aanvraag' },
};

const CommitteeTypeTranslations: Record<CommitteeType, { EN: string; FR: string; NL: string }> = {
  'STANDARD CP': { EN: 'Physician CP', FR: 'Comités paritaires', NL: 'Paritaire Comités' },
  'EE': { EN: 'Ethics & Economics', FR: 'Éthique et Économie', NL: 'Ethiek en Economie' },
  'DENTIST': { EN: 'Dentist', FR: 'Dentiste', NL: 'Tandarts' },
};

interface UITranslations {
  title: string;
  guideTitle: string;
  desc: string;
  guideDesc: string;
  reset: string;
  status: string;
  terminal: string;
  stall: string;
  step: string;
  outcomes: string;
  legend: string;
  legendTerm: string;
  legendStall: string;
  scenario: string;
  productionFilter: string;
  targetState: string;
  targetWorkflow: string;
  allScenarios: string;
  allStates: string;
  allWorkflows: string;
  precondition: string;
  action: string;
  targetReached: string;
  explorer: string;
  guide: string;
  patterns: string;
  selectTargetStatePrompt: string;
  noRoutesFound: string;
  minOccurrences: string;
  patternLength: string;
  filterByState: string;
  steps: string;
  patternsCount: string;
  totalOccurrences: string;
  showMore: string;
  showLess: string;
  noMatchingPatterns: string;
}

const UITextTranslations: Record<Language, UITranslations> = {
  FR: {
    title: 'Explorateur de Flux',
    guideTitle: 'Guide de Référence',
    desc: 'Visualisation arborescente des états et transitions.',
    guideDesc: 'Identification des actions menant à un résultat.',
    reset: 'Réinitialiser',
    status: 'Statut',
    terminal: 'TERMINER',
    stall: 'IMPASSE',
    step: 'Étape',
    outcomes: 'Résultats possibles',
    legend: 'Légende',
    legendTerm: 'Ferme le dossier',
    legendStall: 'Plus d\'actions possibles',
    scenario: 'Scénario',
    productionFilter: 'Filtre de Production',
    targetState: 'État Cible',
    targetWorkflow: 'Workflow Cible',
    allScenarios: 'Tous les Scénarios',
    allStates: 'Tous les États',
    allWorkflows: 'Tous les Workflows',
    precondition: 'D\'où l\'on part',
    action: 'Action effectuée',
    targetReached: 'Cible atteinte',
    explorer: 'Explorateur',
    guide: 'Guide',
    patterns: 'Modèles',
    selectTargetStatePrompt: 'Veuillez sélectionner un état cible pour afficher les parcours.',
    noRoutesFound: 'Aucun parcours trouvé pour ces critères.',
    minOccurrences: 'Occurrences minimales',
    patternLength: 'Longueur du modèle',
    filterByState: 'Filtrer par état',
    steps: 'Étapes',
    patternsCount: 'Nombre de modèles',
    totalOccurrences: 'Occurrences totales',
    showMore: 'Montrer plus',
    showLess: 'Montrer moins',
    noMatchingPatterns: 'Aucun modèle correspondant trouvé'
  },
  NL: {
    title: 'Workflow Verkenner',
    guideTitle: 'Referentiegids',
    desc: 'Boomstructuur visualisatie van statussen en overgangen.',
    guideDesc: 'Identificeer acties die naar een resultaat leiden.',
    reset: 'Resetten',
    status: 'Status',
    terminal: 'AFRONDEN',
    stall: 'DOODLOPEN',
    step: 'Stap',
    outcomes: 'Mogelijke uitkomsten',
    legend: 'Legenda',
    legendTerm: 'Sluit dossier',
    legendStall: 'Geen acties meer mogelijk',
    scenario: 'Scenario',
    productionFilter: 'Productiefilter',
    targetState: 'Doel Status',
    targetWorkflow: 'Doel Workflow',
    allScenarios: 'Alle Scenario\'s',
    allStates: 'Alle Statussen',
    allWorkflows: 'Alle Workflows',
    precondition: 'Startpunt',
    action: 'Actie uitgevoerd',
    targetReached: 'Doel bereikt',
    explorer: 'Verkenner',
    guide: 'Gids',
    patterns: 'Patronen',
    selectTargetStatePrompt: 'Selecteer een doelstatus om de routes weer te geven.',
    noRoutesFound: 'Geen routes gevonden voor deze criteria.',
    minOccurrences: 'Minimale voorvallen',
    patternLength: 'Patroonlengte',
    filterByState: 'Filteren op status',
    steps: 'Stappen',
    patternsCount: 'Aantal patronen',
    totalOccurrences: 'Totaal aantal voorvallen',
    showMore: 'Meer tonen',
    showLess: 'Minder tonen',
    noMatchingPatterns: 'Geen overeenkomende patronen gevonden'
  },
  EN: {
    title: 'Workflow Explorer',
    guideTitle: 'Reference Guide',
    desc: 'Tree-like visualization of states and transitions.',
    guideDesc: 'Identify actions leading to a specific result.',
    reset: 'Reset',
    status: 'Status',
    terminal: 'FINISH',
    stall: 'DEAD END',
    step: 'Step',
    outcomes: 'Possible outcomes',
    legend: 'Legend',
    legendTerm: 'Closes dossier',
    legendStall: 'No more actions left',
    scenario: 'Scenario',
    productionFilter: 'Production Filter',
    targetState: 'Target State',
    targetWorkflow: 'Target Workflow',
    allScenarios: 'All Scenarios',
    allStates: 'All States',
    allWorkflows: 'All Workflows',
    precondition: 'Starting from',
    action: 'Action performed',
    targetReached: 'Target reached',
    explorer: 'Explorer',
    guide: 'Guide',
    patterns: 'Patterns',
    selectTargetStatePrompt: 'Please select a target state to display routes.',
    noRoutesFound: 'No routes found for these criteria.',
    minOccurrences: 'Min occurrences',
    patternLength: 'Pattern length',
    filterByState: 'Filter by state',
    steps: 'Steps',
    patternsCount: 'Patterns count',
    totalOccurrences: 'Total occurrences',
    showMore: 'Show more',
    showLess: 'Show less',
    noMatchingPatterns: 'No matching patterns found'
  }
};

export const getCommandLabel = (cmd: WorkflowCommand, lang: Language = 'EN'): string => {
  return CommandTranslations[cmd][lang];
};

export const getCommitteeLabel = (committee: CommitteeType, lang: Language = 'EN'): string => {
  return CommitteeTypeTranslations[committee][lang];
};

export const getStateLabel = (id: ActivityStateId, lang: Language = 'EN'): string => {
  return ActivityStateTranslations[id][lang];
};

export const getStatusLabel = (status: WorkFlowStatusId, lang: Language = 'EN'): string => {
  return WorkflowStatusTranslations[status][lang];
};

export const getUIText = (lang: Language = 'EN'): UITranslations => {
  return UITextTranslations[lang];
};
