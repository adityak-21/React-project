import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import UserActivity from "./components/UserActivity";
import Navbar from "./common/Navbar";
import Logout from "./components/Logout";

function AppContent() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  const [sidebar, setSidebar] = useState(false);

  return (
    <>
      {!hideNavbar && <Navbar sidebar={sidebar} setSidebar={setSidebar} />}
      <div
        className="main-content"
        style={{
          marginLeft: !hideNavbar && sidebar ? 250 : 0,
          transition: "margin-left 0.3s",
        }}
      >
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterForm} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/userActivity" component={UserActivity} />
          <Route path="/logout" component={Logout} />
          <Redirect from="/" to="/login" />
        </Switch>
      </div>
    </>
  );
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
