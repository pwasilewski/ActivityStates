<Serializable()> _
Public Class UnknownState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (1)
    End Sub

    Public Overrides Sub NewRequest (ByVal activity As Activity)
        activity.SetStatus (REQUESTED, WorkFlowState.READY_FOR_AGENDA)
    End Sub
End Class

<Serializable()>
Public Class RequestedState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue(2)
    End Sub

    Public Overrides Sub NewRequest(ByVal activity As Activity)
        activity.SetStatus(REQUESTED, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub CommitAgenda(ByVal activity As Activity)
        activity.SetStatus(REQUESTED, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed(ByVal activity As Activity)
        If activity.ComiteParitaire.IsEthicAndEconomy Then
            activity.SetStatus(MISSINGINFO_EE, WorkFlowState.WAITING_FOR_REQUESTOR)
        Else
            activity.SetStatus(MISSINGINFO_CP, WorkFlowState.WAITING_FOR_REQUESTOR)
        End If
    End Sub
    Public Overrides Sub RegisterMissingInfoCENeed(ByVal activity As Activity)
        activity.SetStatus(MISSINGINFO_CE, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve(ByVal activity As Activity)
        If activity.ComiteParitaire.IsEthicAndEconomy Then
            activity.SetStatus(APPROVED_EE, WorkFlowState.READY_FOR_AGENDA)
        ElseIf activity.ComiteParitaire.IsInsuranceMedecine Or activity.ComiteParitaire.IsMixedInsuranceMedecine Then
            activity.SetStatus(APPROVED, WorkFlowState.DONE)
        Else
            activity.SetStatus(APPROVED_CP, WorkFlowState.READY_FOR_AGENDA)
        End If

    End Sub

    Public Overrides Sub Refuse(ByVal activity As Activity)
        If activity.ComiteParitaire.IsEthicAndEconomy Then
            'if EE and first time refused => to agenda for GDA
            activity.SetStatus(REFUSED_EE, WorkFlowState.READY_FOR_AGENDA)
        Else
            'Not EE: waiting for requestor
            activity.SetStatus(REFUSED_CP, WorkFlowState.WAITING_FOR_REQUESTOR)
        End If
    End Sub

    Public Overrides Sub RegisterDecsByGda(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDA, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterWrongComiteParitaire(ByVal activity As Activity)
        activity.SetStatus(WRONG_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterNotTreated(ByVal activity As Activity)
        activity.SetStatus(activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub
    Public Overrides Sub ApproveCE(ByVal activity As Activity)
        activity.SetStatus(APPROVED_CE, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RefuseCE(ByVal activity As Activity)
        activity.SetStatus(REFUSED_CE, WorkFlowState.READY_FOR_AGENDA)
    End Sub
    Public Overrides Sub RegisterDecsByGdpq(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDPQ, WorkFlowState.READY_FOR_AGENDA)
    End Sub

End Class

<Serializable()> _
Public Class CancelledState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (3)
    End Sub

    Public Overrides Sub RegisterNotTreated (ByVal activity As Activity)
        'so canceled activities are not stucked in a AgendaNote WFD
        'keep the same state: CANCELLED/DONE
        activity.SetStatus (activity.State, activity.WorkFlowState)
    End Sub
End Class

<Serializable()> _
Public Class MissingInfoForCPState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (4)
    End Sub

    Public Overrides Sub ReceiveMissingInfoFromRequestor (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub CommitAgenda (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_CP, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_CP, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterWrongComiteParitaire (ByVal activity As Activity)
        activity.SetStatus (WRONG_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterNotTreated (ByVal activity As Activity)
        activity.SetStatus (activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve(ByVal activity As Activity)
        If activity.ComiteParitaire.IsCpForAG Then
            activity.SetStatus(APPROVED, WorkFlowState.DONE)
        Else
            activity.SetStatus(APPROVED_CP, WorkFlowState.READY_FOR_AGENDA)
        End If

    End Sub

    Public Overrides Sub Refuse (ByVal activity As Activity)
        activity.SetStatus (REFUSED_CP, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterDecsByGda(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDA, WorkFlowState.READY_FOR_AGENDA)
    End Sub
    Public Overrides Sub RegisterDecsByGdpq(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDPQ, WorkFlowState.READY_FOR_AGENDA)
    End Sub

End Class

<Serializable()> _
Public Class MissingInfoForEEState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (5)
    End Sub

    Public Overrides Sub ReceiveMissingInfoFromRequestor (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_EE, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub CommitAgenda (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_EE, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_EE, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterWrongComiteParitaire (ByVal activity As Activity)
        activity.SetStatus (WRONG_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterNotTreated (ByVal activity As Activity)
        activity.SetStatus (activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve (ByVal activity As Activity)
        activity.SetStatus (APPROVED_EE, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Refuse (ByVal activity As Activity)
        activity.SetStatus (REFUSED_EE, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterDecsByGda(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDA, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterDecsByGdpq(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDPQ, WorkFlowState.READY_FOR_AGENDA)
    End Sub

End Class

<Serializable()> _
Public Class MissingInfoForGDAState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (6)
    End Sub

    Public Overrides Sub ReceiveMissingInfoFromRequestor (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_GDA, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub CommitAgenda (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_GDA, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_GDA, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterWrongComiteParitaire (ByVal activity As Activity)
        activity.SetStatus (WRONG_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterNotTreated (ByVal activity As Activity)
        activity.SetStatus (activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve (ByVal activity As Activity)
        activity.SetStatus (APPROVED, WorkFlowState.DONE)
    End Sub

    Public Overrides Sub Refuse (ByVal activity As Activity)
        activity.SetStatus (REFUSED, WorkFlowState.DONE)
    End Sub
End Class

<Serializable()> _
Public Class RefusedByCPState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (7)
    End Sub

    'DS2018 Only action posible is dispute! (myby cancel?)

    Public Overrides Sub Dispute (ByVal activity As Activity)
        activity.SetStatus (DISPUTED_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_GDA, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterWrongComiteParitaire (ByVal activity As Activity)
        activity.SetStatus (RETURN_TO_ORIGINAL_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve (ByVal activity As Activity)
        activity.SetStatus (APPROVED, WorkFlowState.DONE)
    End Sub

    Public Overrides Sub RegisterDecsByGda(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDA, WorkFlowState.READY_FOR_AGENDA)
    End Sub
    Public Overrides Sub RegisterDecsByGdpq(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDPQ, WorkFlowState.READY_FOR_AGENDA)
    End Sub

End Class

<Serializable()> _
Public Class RefusedByCP2State
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (8)
    End Sub

    'DS2018 Only action posible is dispute! (myby cancel?)

    Public Overrides Sub Dispute (ByVal activity As Activity)
        activity.SetStatus (DISPUTED_CP_2, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_GDA, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterWrongComiteParitaire (ByVal activity As Activity)
        activity.SetStatus (RETURN_TO_ORIGINAL_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve (ByVal activity As Activity)
        activity.SetStatus (APPROVED, WorkFlowState.DONE)
    End Sub
    

End Class

<Serializable()> _
Public Class RefusedByEEState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (9)
    End Sub

    Public Overrides Sub CommitAgenda (ByVal activity As Activity)
        activity.SetStatus (REFUSED_EE, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_GDA, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterNotTreated (ByVal activity As Activity)
        activity.SetStatus (activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Dispute (ByVal activity As Activity)
        activity.SetStatus (DISPUTED_EE, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve (ByVal activity As Activity)
        activity.SetStatus (APPROVED, WorkFlowState.DONE)
    End Sub

    Public Overrides Sub Refuse (ByVal activity As Activity)
        'EE and  second refuse (GDA refused)
        activity.SetStatus (REFUSED_EE, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub
End Class

<Serializable()> _
Public Class ApprovedByCPState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (10)
    End Sub

    Public Overrides Sub CommitAgenda (ByVal activity As Activity)
        activity.SetStatus (APPROVED_CP, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_GDA, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterWrongComiteParitaire (ByVal activity As Activity)
        activity.SetStatus (WRONG_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterNotTreated (ByVal activity As Activity)
        activity.SetStatus (activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve (ByVal activity As Activity)
        activity.SetStatus (APPROVED, WorkFlowState.DONE)
    End Sub

    Public Overrides Sub Refuse (ByVal activity As Activity)
        activity.SetStatus (REFUSED, WorkFlowState.DONE)
    End Sub
End Class

<Serializable()> _
Public Class ApprovedByEEState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (11)
    End Sub

    Public Overrides Sub CommitAgenda (ByVal activity As Activity)
        activity.SetStatus (APPROVED_EE, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_GDA, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterWrongComiteParitaire (ByVal activity As Activity)
        activity.SetStatus (WRONG_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterNotTreated (ByVal activity As Activity)
        activity.SetStatus (activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve (ByVal activity As Activity)
        activity.SetStatus (APPROVED, WorkFlowState.DONE)
    End Sub

    Public Overrides Sub Refuse (ByVal activity As Activity)
        activity.SetStatus (REFUSED, WorkFlowState.DONE)
    End Sub
End Class

<Serializable()> _
Public Class DisputedCPState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (12)
    End Sub

    'is first dispute

    Public Overrides Sub CommitAgenda (ByVal activity As Activity)
        activity.SetStatus (DISPUTED_CP, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_CP, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterWrongComiteParitaire (ByVal activity As Activity)
        activity.SetStatus (WRONG_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterNotTreated (ByVal activity As Activity)
        activity.SetStatus (activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve(ByVal activity As Activity)
        If activity.ComiteParitaire.IsCpForAG Then
            activity.SetStatus(APPROVED, WorkFlowState.DONE)
        Else
            activity.SetStatus(APPROVED_CP, WorkFlowState.READY_FOR_AGENDA)
        End If

    End Sub

    Public Overrides Sub Refuse (ByVal activity As Activity)
        activity.SetStatus (REFUSED_CP_2, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterDecsByGda(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDA, WorkFlowState.READY_FOR_AGENDA)
    End Sub
    Public Overrides Sub RegisterDecsByGdpq(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDPQ, WorkFlowState.READY_FOR_AGENDA)
    End Sub
End Class

<Serializable()> _
Public Class DisputedCP2State
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (13)
    End Sub

    'is second dispute

    Public Overrides Sub CommitAgenda (ByVal activity As Activity)
        activity.SetStatus (DISPUTED_CP_2, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_GDA, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterWrongComiteParitaire (ByVal activity As Activity)
        activity.SetStatus (WRONG_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterNotTreated (ByVal activity As Activity)
        activity.SetStatus (activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve (ByVal activity As Activity)
        activity.SetStatus (APPROVED, WorkFlowState.DONE)
    End Sub

    Public Overrides Sub Refuse (ByVal activity As Activity)
        activity.SetStatus (REFUSED, WorkFlowState.DONE)
    End Sub
End Class

<Serializable()> _
Public Class DisputedEEState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (14)
    End Sub

    Public Overrides Sub CommitAgenda (ByVal activity As Activity)
        activity.SetStatus (DISPUTED_EE, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed (ByVal activity As Activity)
        activity.SetStatus (MISSINGINFO_GDA, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterWrongComiteParitaire (ByVal activity As Activity)
        activity.SetStatus (WRONG_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RegisterNotTreated (ByVal activity As Activity)
        activity.SetStatus (activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve (ByVal activity As Activity)
        activity.SetStatus (APPROVED, WorkFlowState.DONE)
    End Sub

    Public Overrides Sub Refuse (ByVal activity As Activity)
        activity.SetStatus (REFUSED, WorkFlowState.DONE)
    End Sub
End Class

<Serializable()> _
Public Class WrongCPState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (15)
    End Sub

    Public Overrides Sub CommitAgenda (ByVal activity As Activity)
        activity.SetStatus (REQUESTED, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterNotTreated (ByVal activity As Activity)
        activity.SetStatus (activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub
End Class

<Serializable()> _
Public Class ReturnToOriginalCPState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (16)
    End Sub

    Public Overrides Sub CommitAgenda (ByVal activity As Activity)
        activity.SetStatus (REQUESTED, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterNotTreated (ByVal activity As Activity)
        activity.SetStatus (activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub
End Class

<Serializable()> _
Public Class ApprovedState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (17)
    End Sub
End Class

<Serializable()> _
Public Class RefusedState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue (18)
    End Sub
End Class

<Serializable()>
Public Class DecisionByGdaState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue(19)
    End Sub

    Public Overrides Sub CommitAgenda(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDA, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub RegisterMissingInfoNeed(ByVal activity As Activity)
        activity.SetStatus(MISSINGINFO_GDA, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub

    Public Overrides Sub RegisterWrongComiteParitaire(ByVal activity As Activity)
        activity.SetStatus(WRONG_CP, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub Approve(ByVal activity As Activity)
        activity.SetStatus(APPROVED, WorkFlowState.DONE)
    End Sub

    Public Overrides Sub Refuse(ByVal activity As Activity)
        activity.SetStatus(REFUSED, WorkFlowState.DONE)
    End Sub
    Public Overrides Sub RegisterNotTreated(ByVal activity As Activity)
        activity.SetStatus(activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub
End Class

#Region "Dentist"

<Serializable()>
Public Class MissingInfoForCEState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue(20)
    End Sub
    Public Overrides Sub CommitAgenda(ByVal activity As Activity)
        activity.SetStatus(MISSINGINFO_CE, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub Approve(ByVal activity As Activity)
        activity.SetStatus(APPROVED, WorkFlowState.DONE)
    End Sub
    Public Overrides Sub Refuse(ByVal activity As Activity)
        activity.SetStatus(REFUSED, WorkFlowState.DONE)
    End Sub
    Public Overrides Sub RegisterMissingInfoNeed(ByVal activity As Activity)
        activity.SetStatus(MISSINGINFO_GDPQ, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub
    Public Overrides Sub RegisterNotTreated(ByVal activity As Activity)
        activity.SetStatus(activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub


End Class

<Serializable()>
Public Class ApprovedByCEState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue(22)
    End Sub
    Public Overrides Sub CommitAgenda(ByVal activity As Activity)
        activity.SetStatus(APPROVED_CE, WorkFlowState.WAITING_FOR_DECISION)
    End Sub

    Public Overrides Sub Approve(ByVal activity As Activity)
        activity.SetStatus(APPROVED, WorkFlowState.DONE)
    End Sub
    Public Overrides Sub Refuse(ByVal activity As Activity)
        activity.SetStatus(REFUSED, WorkFlowState.DONE)
    End Sub
    Public Overrides Sub RegisterMissingInfoNeed(ByVal activity As Activity)
        activity.SetStatus(MISSINGINFO_GDPQ, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub
    Public Overrides Sub RegisterNotTreated(ByVal activity As Activity)
        activity.SetStatus(activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub

End Class

<Serializable()>
Public Class RefusedByCEState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue(23)
    End Sub
    Public Overrides Sub CommitAgenda(ByVal activity As Activity)
        activity.SetStatus(REFUSED_CE, WorkFlowState.WAITING_FOR_DECISION)
    End Sub
    Public Overrides Sub Approve(ByVal activity As Activity)
        activity.SetStatus(APPROVED, WorkFlowState.DONE)
    End Sub
    Public Overrides Sub Refuse(ByVal activity As Activity)
        activity.SetStatus(REFUSED, WorkFlowState.DONE)
    End Sub
    Public Overrides Sub RegisterMissingInfoNeed(ByVal activity As Activity)
        activity.SetStatus(MISSINGINFO_GDPQ, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub
    Public Overrides Sub RegisterNotTreated(ByVal activity As Activity)
        activity.SetStatus(activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub

End Class

<Serializable()>
Public Class DecisionByGdpqState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue(24)
    End Sub
    Public Overrides Sub CommitAgenda(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDPQ, WorkFlowState.WAITING_FOR_DECISION)
    End Sub
    Public Overrides Sub Approve(ByVal activity As Activity)
        activity.SetStatus(APPROVED, WorkFlowState.DONE)
    End Sub
    Public Overrides Sub Refuse(ByVal activity As Activity)
        activity.SetStatus(REFUSED, WorkFlowState.DONE)
    End Sub
    Public Overrides Sub RegisterMissingInfoNeed(ByVal activity As Activity)
        activity.SetStatus(MISSINGINFO_GDPQ, WorkFlowState.WAITING_FOR_REQUESTOR)
    End Sub
    Public Overrides Sub RegisterNotTreated(ByVal activity As Activity)
        activity.SetStatus(activity.State, WorkFlowState.READY_FOR_AGENDA)
    End Sub

End Class

<Serializable()>
Public Class MissingInfoForGDPQState
    Inherits ActivityState

    Public Sub New()
        MyBase.New()
        SetIdFieldValue(21)
    End Sub

    Public Overrides Sub ReceiveMissingInfoFromRequestor(ByVal activity As Activity)
        activity.SetStatus(MISSINGINFO_GDPQ, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub CommitAgenda(ByVal activity As Activity)
        activity.SetStatus(MISSINGINFO_GDPQ, WorkFlowState.WAITING_FOR_DECISION)
    End Sub
    Public Overrides Sub ApproveCE(ByVal activity As Activity)
        activity.SetStatus(APPROVED_CE, WorkFlowState.READY_FOR_AGENDA)
    End Sub

    Public Overrides Sub RefuseCE(ByVal activity As Activity)
        activity.SetStatus(REFUSED_CE, WorkFlowState.READY_FOR_AGENDA)
    End Sub
    Public Overrides Sub RegisterDecsByGdpq(ByVal activity As Activity)
        activity.SetStatus(DECISIONBYGDPQ, WorkFlowState.READY_FOR_AGENDA)
    End Sub
    Public Overrides Sub RegisterMissingInfoCENeed(ByVal activity As Activity)
        activity.SetStatus(MISSINGINFO_CE, WorkFlowState.READY_FOR_AGENDA)
    End Sub

End Class

#End Region