module.exports = {
  feedback_type: [
    'rqcCallFeedback',
    'tutionGroupFeedback',
    'algIntCallFeedback',
    'reAlgIntFeedback',
    'cultFitCallRawInfo',
    'englishIntCallFeedback',
    'parentConversation',
    'travelPlanning'
  ],
  
  status: [ 'pass', 'failed', 'pending', 'forReview'],

  studentStages: [
    // related to the mcq test
    'enrolmentKeyGenerated',
    'basicDetailsEntered',
    'completedTest',
    'completedTestWithDetails',
    'testPassed',
    'testFailed',

    // related to incoming query calls
    'requestCallback',
    'pendingCallbackForQuery',
    'forReviewCallbackQueryResolved',
    'queryResolvedAfterCallback',

    // algebra interviews
    'pendingAlgebraInterview',
    'pendingAlgebraReInterview', // algebra re-interview
    'forReviewAlgebraInterviewDone',
    'algebraInterviewFail',
    'algebraInterviewWaitlisted',

    // english interviews
    'pendingEnglishInterview',
    'forReviewEnglishInterview',
    'englishInterviewFail',
    'englishInterviewWaitlisted',

    // culture fit interviews
    'pendingCultureFitInterview',
    'forReviewCultureFitInterviewDone',
    'cultureFitInterviewWaitlisted',
    'pendingCultureFitReinterview',
    'cultureFitInterviewFail',

    // parent conversations
    'pendingParentConversation',
    'parentConversationFail',
    'forReviewParentConversationFail',

    // travel planning
    'pendingTravelPlanning',
    'finalisedTravelPlans',

    // probation etc. once when the student has joined navgurukul
    'probation',
    'finallyJoined',
    'droppedOut',
    'sentBackAfterProbation',

    // is not reachable
    'becameDisIntersested',
    'forReviewBecameDisintrested',
    'disqualifiedUnreachable',

    // diversity based decision
    'disqualifiedAfterDiversityFilter',
    'diversityBasedDecisionPending',

    // random stages for internal use
    'possibleDuplicate',
    'needAction',
    'demo',
    'caughtCheating',

    // joining
    'deferredJoining',
    'tuitionGroup'
  ],
}