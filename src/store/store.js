// oldImports
import thunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import authReducer from "./reducers/auth";
import dataReducer from "./reducers/data";

// newImports
// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";
// import dataReducer from "./slices/dataSlice";
// import uiReducer from "./slices/uiSlice";

//oldCOnfig
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// oldConfig
export default createStore(
  combineReducers({
    auth: authReducer,
    data: dataReducer,
  }),
  composeEnhancers(applyMiddleware(thunk))
);

//newConfig
// export default configureStore({
//   reducer: {
//     auth: authReducer,
//     data: dataReducer,
//     ui: uiReducer,
//   },
// });
