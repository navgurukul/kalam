/* eslint-disable import/no-cycle */
// oldImports
// import thunk from "redux-thunk";
// import { createStore, combineReducers, applyMiddleware, compose } from "redux";
// import authReducer from "./reducers/auth";
// import dataReducer from "./reducers/data";

// newImports
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dataReducer from "./slices/dataSlice";
import campusReducer from "./slices/campusSlice";
import onlineTestReducer from "./slices/onlineTestSlice";
import ownerReducer from "./slices/ownerSlice";
import studentsReducer from "./slices/studentSlice";
import uiReducer from "./slices/uiSlice";

//oldCOnfig
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// oldConfig
// export default createStore(
//   combineReducers({
//     auth: authReducer,
//     data: dataReducer,
//   }),
//   composeEnhancers(applyMiddleware(thunk))
// );

//newConfig
export default configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer
    campus: campusReducer,
    onlineTest: onlineTestReducer,
    owners: ownerReducer,
    students: studentsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          "ui.dialogContent",
          "ui.dialogActions",
          "students.fromDate",
          "students.toDate",
        ],
        ignoreActions: ["ui/showDialog"],
      },
    }),
});
