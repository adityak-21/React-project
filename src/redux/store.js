import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import { authReducer } from "./authReducer";
import { userReducer } from "./userReducer";
import { reducer as formReducer } from "redux-form";
import { verifyAdmin } from "../api/AuthApi";
import { verifyAdminReducer } from "./verifyAdmin";

const rootReducer = combineReducers({
  auth: authReducer,
  form: formReducer,
  admin: verifyAdminReducer,

  //   users: userReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
