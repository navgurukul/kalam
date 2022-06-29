/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/display-name */
import React, { forwardRef } from "react";
import AddBox from "@mui/icons-material/AddBox";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import Check from "@mui/icons-material/Check";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Clear from "@mui/icons-material/Clear";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Edit from "@mui/icons-material/Edit";
import FilterList from "@mui/icons-material/FilterList";
import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import Remove from "@mui/icons-material/Remove";
import SaveAlt from "@mui/icons-material/SaveAlt";
import Search from "@mui/icons-material/Search";
import ViewColumn from "@mui/icons-material/ViewColumn";

const GlobalService = {
  tableIcons: {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight color="primary" {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  },
};

export default GlobalService;

export const nextStage = {
  enrolmentKeyGenerated: ["basicDetailsEntered"],
  basicDetailsEntered: ["pendingEnglishInterview", "testFailed"],
  testFailed: ["enrolmentKeyGenerated"],
  pendingEnglishInterview: [
    "englishInterviewFail",
    "pendingAlgebraInterview",
    "notReachable",
    "becameDisIntersested",
    "possibleDuplicate",
  ],
  englishInterviewFail: ["pendingEnglishInterview"],
  pendingAlgebraInterview: [
    "algebraInterviewFail",
    "pendingCultureFitInterview",
    "notReachable",
    "becameDisIntersested",
    "possibleDuplicate",
    "tuitionGroup",
  ],
  tuitionGroup: ["pendingAlgebraInterview"],
  algebraInterviewFail: ["pendingAlgebraInterview"],
  pendingCultureFitInterview: [
    "selectedAndJoiningAwaited",
    "cultureFitInterviewFail",
    "notReachable",
    "becameDisIntersested",
    "possibleDuplicate",
  ],
  selected: ["selectedAndJoiningAwaited", "selectedButNotJoined"],
  cultureFitInterviewFail: ["pendingCultureFitInterview"],
  notReachable: [
    "pendingEnglishInterview",
    "pendingAlgebraInterview",
    "pendingCultureFitInterview",
    "becameDisIntersested",
  ],
  selectedAndJoiningAwaited: ["offerLetterSent", "becameDisIntersested"],
  selectedButNotJoined: [],
  offerLetterSent: [
    "pendingTravelPlanning",
    "pendingParentConversation",
    "finalisedTravelPlans",
    "finallyJoined",
    "offerLetterSent",
    "selectedButNotJoined",
  ],
  pendingParentConversation: [
    "finalisedTravelPlans",
    "pendingTravelPlanning",
    "finallyJoined",
    "selectedButNotJoined",
  ],
  pendingTravelPlanning: [
    "finalisedTravelPlans",
    "offerLetterSent",
    "selectedButNotJoined",
  ],
  possibleDuplicate: [
    "pendingEnglishInterview",
    "pendingAlgebraInterview",
    "pendingCultureFitInterview",
  ],
  finalisedTravelPlans: [
    "finallyJoined",
    "offerLetterSent",
    "selectedButNotJoined",
  ],
  becameDisIntersested: [],
  finallyJoined: ["M1"],
  M1: ["M2", "droppedOut", "onLeave"],
  M2: ["M3", "droppedOut", "onLeave"],
  M3: ["M4", "droppedOut", "onLeave"],
  M4: ["M5", "droppedOut", "onLeave"],
  M5: ["M6", "droppedOut", "onLeave"],
  M6: ["M7", "droppedOut", "onLeave", "inJob"],
  M7: ["M8", "droppedOut", "onLeave", "inJob"],
  M8: ["M9", "droppedOut", "onLeave", "inJob"],
  M9: ["M10", "droppedOut", "onLeave", "inJob"],
  M10: ["M11", "M12", "droppedOut", "onLeave", "inJob"],
  M11: ["M13", "droppedOut", "onLeave", "inJob"],
  M13: ["M15", "droppedOut", "onLeave", "inJob"],
  M15: ["M17", "droppedOut", "onLeave", "inJob"],
  M17: ["M19", "droppedOut", "onLeave", "inJob"],
  M12: ["M14", "droppedOut", "onLeave", "inJob"],
  M14: ["M16", "droppedOut", "onLeave", "inJob"],
  M16: ["M18", "droppedOut", "onLeave", "inJob"],
  M18: ["M19", "droppedOut", "onLeave", "inJob"],
  M19: ["M20", "droppedOut", "onLeave", "inJob"],
  M20: ["M21", "droppedOut", "onLeave", "inJob"],
  M21: ["M22", "droppedOut", "onLeave", "inJob"],
  M22: ["inJob", "droppedOut", "onLeave"],
  onLeave: [
    "M1",
    "M2",
    "M3",
    "M4",
    "M5",
    "M6",
    "M7",
    "M8",
    "M9",
    "M10",
    "M11",
    "M12",
    "M13",
    "M14",
    "M15",
    "M16",
    "M17",
    "M18",
    "M19",
    "M20",
    "M21",
    "M22",
  ],
  droppedOut: [],
  inJob: ["payingForward"],
  payingForward: ["paidForward"],
  paidForward: [],
};

// export const getstudentMachine = (initState = "enrolmentKeyGenerated") => {
//   const machine = createMachine(
//     {
//       id: "student",
//       initial: initState,
//       context: {
//         label: allStages[initState],
//       },
//       states: {
//         enrolmentKeyGenerated: {
//           on: {
//             basicDetailsEntered: {
//               target: "basicDetailsEntered",
//               actions: ["setLabel"],
//             },
//           },
//         },
//         basicDetailsEntered: {
//           on: {
//             pendingEnglishInterview: "pendingEnglishInterview",
//             testFailed: "testFailed",
//           },
//         },
//         testFailed: {
//           on: {
//             enrolmentKeyGenerated: "enrolmentKeyGenerated",
//           },
//         },
//         pendingEnglishInterview: {
//           on: {
//             englishInterviewFail: "englishInterviewFail",
//             pendingAlgebraInterview: "pendingAlgebraInterview",
//             notReachable: "notReachable",
//             becameDisIntersested: "becameDisIntersested",
//           },
//         },
//         englishInterviewFail: {
//           on: {
//             pendingEnglishInterview: "pendingEnglishInterview",
//           },
//         },
//         pendingAlgebraInterview: {
//           on: {
//             algebraInterviewFail: "algebraInterviewFail",
//             pendingCultureFitInterview: "pendingCultureFitInterview",
//             notReachable: "notReachable",
//             becameDisIntersested: "becameDisIntersested",
//           },
//         },
//         algebraInterviewFail: {
//           on: {
//             pendingAlgebraInterview: "pendingAlgebraInterview",
//           },
//         },
//         pendingCultureFitInterview: {
//           on: {
//             selectedAndJoiningAwaited: "selectedAndJoiningAwaited",
//             cultureFitInterviewFail: "cultureFitInterviewFail",
//             notReachable: "notReachable",
//             becameDisIntersested: "becameDisIntersested",
//           },
//         },
//         cultureFitInterviewFail: {
//           on: {
//             pendingCultureFitInterview: "pendingCultureFitInterview",
//           },
//         },
//         notReachable: {
//           on: {
//             pendingEnglishInterview: "pendingEnglishInterview",
//             pendingAlgebraInterview: "pendingAlgebraInterview",
//             pendingCultureFitInterview: "pendingCultureFitInterview",
//             becameDisIntersested: "becameDisIntersested",
//           },
//         },
//         selectedAndJoiningAwaited: {
//           on: {
//             offerLetterSent: "offerLetterSent",
//             becameDisIntersested: "becameDisIntersested",
//           },
//         },
//         offerLetterSent: {
//           on: {
//             pendingTravelPlanning: "pendingTravelPlanning",
//             pendingParentConversation: "pendingParentConversation",
//             finalisedTravelPlans: "finalisedTravelPlans",
//             finallyJoined: "finallyJoined",
//             becameDisIntersested: "becameDisIntersested",
//           },
//         },
//         pendingParentConversation: {
//           on: {
//             finalisedTravelPlans: "finalisedTravelPlans",
//             pendingTravelPlanning: "pendingTravelPlanning",
//             finallyJoined: "finallyJoined",
//             becameDisIntersested: "becameDisIntersested",
//           },
//         },
//         pendingTravelPlanning: {
//           on: {
//             finalisedTravelPlans: "finalisedTravelPlans",
//             becameDisIntersested: "becameDisIntersested",
//           },
//         },
//         possibleDuplicate: {},
//         finalisedTravelPlans: {
//           on: {
//             finallyJoined: "finallyJoined",
//             becameDisIntersested: "becameDisIntersested",
//           },
//         },
//         becameDisIntersested: {
//           type: "final",
//         },

//         finallyJoined: {
//           on: {
//             // "English & Quarantine": "English & Quarantine",
//             M1: "M1",
//           },
//         },
//         // M1: {
//         //   on: {
//         //     "Dry Run": "Dry Run",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "Dry Run": {
//         //   on: {
//         //     "If - Else": "If - Else",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "If - Else": {
//         //   on: {
//         //     Loops: "Loops",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // Loops: {
//         //   on: {
//         //     Lists: "Lists",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // Lists: {
//         //   on: {
//         //     Functions: "Functions",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // Functions: {
//         //   on: {
//         //     "Python Complete": "Python Complete",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "Python Complete": {
//         //   on: {
//         //     "Hangman, Requests & more": "Hangman, Requests & more",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "Hangman, Requests & more": {
//         //   on: {
//         //     "Web Scraping": "Web Scraping",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "Web Scraping": {
//         //   on: {
//         //     "Javascript / ES6": "Javascript / ES6",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "Javascript / ES6": {
//         //   on: {
//         //     "NodeJS - Callbacks & Async": "NodeJS - Callbacks & Async",
//         //     "React - HTML & CSS": "React - HTML & CSS",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "NodeJS - Callbacks & Async": {
//         //   on: {
//         //     "NodeJS - CRUD": "NodeJS - CRUD",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "NodeJS - CRUD": {
//         //   on: {
//         //     "NodeJS - MySQL/Knex/Joi": "NodeJS - MySQL/Knex/Joi",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "NodeJS - MySQL/Knex/Joi": {
//         //   on: {
//         //     "NodeJS: JWT": "NodeJS: JWT",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "NodeJS: JWT": {
//         //   on: {
//         //     "Project 1": "Project 1",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "React - HTML & CSS": {
//         //   on: {
//         //     "React - Bootstrap & Jquery": "React - Bootstrap & Jquery",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "React - Bootstrap & Jquery": {
//         //   on: {
//         //     "React - State, Props & Components":
//         //       "React - State, Props & Components",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "React - State, Props & Components": {
//         //   on: {
//         //     "React - React Lifecycle": "React - React Lifecycle",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "React - React Lifecycle": {
//         //   on: {
//         //     "Project 1": "Project 1",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "Project 1": {
//         //   on: {
//         //     "Project 2": "Project 2",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "Project 2": {
//         //   on: {
//         //     "Interview Preparation": "Interview Preparation",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "Interview Preparation": {
//         //   on: {
//         //     "Job Search": "Job Search",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         // "Job Search": {
//         //   on: {
//         //     inJob: "inJob",
//         //     droppedOut: "droppedOut",
//         //     onLeave: "onLeave",
//         //   },
//         // },
//         inJob: {
//           on: {
//             payingForward: "payingForward",
//           },
//         },
//         payingForward: {
//           on: {
//             paidForward: "paidForward",
//           },
//         },
//         paidForward: {
//           type: "final",
//         },
//         onLeave: {},
//         droppedOut: {
//           type: "final",
//         },

//         //for backend team understanding
//         M1: {
//           on: {
//             M2: "M2",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M2: {
//           on: {
//             M3: "M3",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M3: {
//           on: {
//             M4: "M4",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M4: {
//           on: {
//             M5: "M5",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M5: {
//           on: {
//             M6: "M6",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M6: {
//           on: {
//             M7: "M7",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M7: {
//           on: {
//             M8: "M8",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M8: {
//           on: {
//             M9: "M9",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M9: {
//           on: {
//             M10: "M10",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M10: {
//           on: {
//             M11: "M11",
//             M12: "M12",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M11: {
//           on: {
//             M13: "M13",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M13: {
//           on: {
//             M15: "M15",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M15: {
//           on: {
//             M17: "M17",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M17: {
//           on: {
//             M19: "M19",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M12: {
//           on: {
//             M14: "M14",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M14: {
//           on: {
//             M16: "M16",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M16: {
//           on: {
//             M18: "M18",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M18: {
//           on: {
//             M19: "M19",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M19: {
//           on: {
//             M20: "M20",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M20: {
//           on: {
//             M21: "M21",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M21: {
//           on: {
//             M22: "M22",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//         M22: {
//           on: {
//             inJob: "inJob",
//             droppedOut: "droppedOut",
//             onLeave: "onLeave",
//           },
//         },
//       },
//     }
//     // {
//     //   actions: {
//     //     setLabel: (context, event) => {
//     //       context.label = allStages[event.type];
//     //     },
//     //   },
//     // }
//   );
//   return machine;
// };
