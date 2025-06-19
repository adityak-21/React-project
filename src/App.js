import logo from "./logo.svg";
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

const App = () => (
  <Router>
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterForm} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <Redirect from="/" to="/login" />
    </Switch>
  </Router>
);

export default App;
