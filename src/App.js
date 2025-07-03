import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UserListing from "./components/UserListing";
import PrivateRoute from "./components/PrivateRoute";
import UserActivity from "./components/UserActivity";
import Navbar from "./common/Navbar";
import Logout from "./components/Logout";
import Topbar from "./common/Topbar";
import { useDispatch, useSelector } from "react-redux";
import { verifyAdminStatus } from "./redux/verifyAdmin";
import { verifyAdmin } from "./api/AuthApi";
import MyTaskListing from "./components/MyTaskListing";
import AdminRoute from "./components/AdminRoute";
import AllTaskListing from "./components/AllTaskListing";
import CreatedTaskListing from "./components/CreatedTaskListing";
import Dashboard from "./components/Dashboard";
import {
  PusherListener,
  PusherListenerPrivate,
} from "./components/PusherListener";
import SendMessage from "./components/SendMessages";
import { me } from "./api/AuthApi";
import {
  setUserName,
  setUserEmail,
  setUserId,
  setUserRoles,
} from "./redux/userReducer";
import { Loader } from "./common/Loading";
import ForgotPwdForm from "./components/ForgotPwd";
import ResetPwdForm from "./components/ResetPwd";
import ConfirmEmail from "./components/ConfirmationPage";

function AppContent() {
  const location = useLocation();
  const [id, setId] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const hideNavbar =
    ["/login", "/register", "/forgotpwd"].includes(location.pathname) ||
    location.pathname.startsWith("/resetpwd/") ||
    location.pathname.startsWith("/confirmEmail/");

  const [sidebar, setSidebar] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(verifyAdminStatus(verifyAdmin));
        const response = await me();
        dispatch(setUserName(response.data.name));
        dispatch(setUserEmail(response.data.email));
        dispatch(setUserId(response.data.id));
        dispatch(setUserRoles(response.data.roles));
        setId(response.data.id);
        console.log("User data fetched successfully:", response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);
  if (isFetching) {
    return <Loader />;
  }
  return (
    <>
      {!hideNavbar && <Topbar />}
      {!hideNavbar && <PusherListener />}
      {!hideNavbar && id && <PusherListenerPrivate userId={id} />}
      {!hideNavbar && <Navbar sidebar={sidebar} setSidebar={setSidebar} />}
      <div
        className="main-content"
        style={{
          marginLeft: !hideNavbar && sidebar ? 250 : 0,
          transition: "margin-left 0.3s",
        }}
      >
        <Switch>
          <Route path="/login" component={LoginForm} />
          <Route path="/register" component={RegisterForm} />
          <Route path="/forgotpwd" component={ForgotPwdForm} />
          <Route path="/resetpwd/:token" component={ResetPwdForm} />
          <Route path="/confirmEmail/:token" component={ConfirmEmail} />
          <PrivateRoute path="/userListing" component={UserListing} />
          <AdminRoute path="/userActivity" component={UserActivity} />
          <PrivateRoute path="/myTasks" component={MyTaskListing} />
          <PrivateRoute path="/createdTasks" component={CreatedTaskListing} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/sendMessage" component={SendMessage} />
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
