import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

const App = () => (
  <Router>
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Redirect from="/" to="/login" />
    </Switch>
  </Router>

);

export default App;
