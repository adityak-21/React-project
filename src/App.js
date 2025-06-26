import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterForm from "./components/RegisterForm";
import UserListing from "./components/UserListing";
import PrivateRoute from "./components/PrivateRoute";
import UserActivity from "./components/UserActivity";
import Navbar from "./common/Navbar";
import Logout from "./components/Logout";
import { useDispatch, useSelector } from "react-redux";
import { verifyAdminStatus } from "./redux/verifyAdmin";
import { verifyAdmin } from "./api/AuthApi";
import MyTaskListing from "./components/MyTaskListing";
import AdminRoute from "./components/AdminRoute";
import AllTaskListing from "./components/AllTaskListing";
import CreatedTaskListing from "./components/CreatedTaskListing";
import Dashboard from "./components/Dashboard";

function AppContent() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  const [sidebar, setSidebar] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verifyAdminStatus(verifyAdmin));
  }, [dispatch]);

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
          <PrivateRoute path="/userListing" component={UserListing} />
          <PrivateRoute path="/userActivity" component={UserActivity} />
          <PrivateRoute path="/myTasks" component={MyTaskListing} />
          <PrivateRoute path="/createdTasks" component={CreatedTaskListing} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <AdminRoute path="/allTasks" component={AllTaskListing} />
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
