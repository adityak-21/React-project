import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import { authReducer } from "./authReducer";
import { userReducer } from "./userReducer";
import { reducer as formReducer } from "redux-form";

const rootReducer = combineReducers({
  auth: authReducer,
  form: formReducer,

  //   users: userReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
