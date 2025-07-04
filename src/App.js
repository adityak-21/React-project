import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UserListing from "./components/UserListing";
import UserActivity from "./components/UserActivity";
import Navbar from "./common/Navbar";
import Logout from "./components/Logout";
import Topbar from "./common/Topbar";
import { useDispatch, useSelector } from "react-redux";
import { verifyAdminStatus } from "./redux/verifyAdmin";
import { verifyAdmin } from "./api/AuthApi";
import MyTaskListing from "./components/MyTaskListing";
import ProtectedRoute from "./common/ProtectedRoute";
import AllTaskListing from "./components/AllTaskListing";
import CreatedTaskListing from "./components/CreatedTaskListing";
import Dashboard from "./components/Dashboard";
import {
  PusherListener,
  PusherListenerPrivate,
} from "./components/PusherListener";
import SendMessage from "./components/SendMessages";
import { me } from "./api/AuthApi";
import { Loader } from "./common/Loading";
import ForgotPwdForm from "./components/ForgotPwd";
import ResetPwdForm from "./components/ResetPwd";
import ConfirmEmail from "./components/ConfirmationPage";
import { setUser } from "./redux/userReducer";
import Swal from "sweetalert2";

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
      dispatch(verifyAdminStatus(verifyAdmin))
        .then(() => me())
        .then((response) => {
          if (!response || !response.data) {
            throw new Error("Failed to fetch user data");
          }
          dispatch(setUser(response.data));
          setId(response.data.id);
          console.log("User data fetched successfully:", response.data);
        })
        .catch((error) => {
          alert("Failed to fetch user data.");
          console.error("Failed to fetch user data:", error);
        })
        .finally(() => {
          setIsFetching(false);
        });
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
          <ProtectedRoute path="/userListing" component={UserListing} />
          <ProtectedRoute
            path="/userActivity"
            component={UserActivity}
            adminOnly
          />
          <ProtectedRoute path="/myTasks" component={MyTaskListing} />
          <ProtectedRoute path="/createdTasks" component={CreatedTaskListing} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/sendMessage" component={SendMessage} />
          <ProtectedRoute
            path="/allTasks"
            component={AllTaskListing}
            adminOnly
          />
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
