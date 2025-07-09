import React, { useState, useRef } from "react";
import { useHistory, Link } from "react-router-dom";
import "../style/LoginForm.css";
import { withRouter } from "react-router-dom";
import { login } from "../api/AuthApi";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { verifyAdminStatus } from "../redux/verifyAdmin";
import { verifyAdmin } from "../api/AuthApi";
import {
  setUserName,
  setUserEmail,
  setUserId,
  setUserRoles,
} from "../redux/userReducer";
import { setUser } from "../redux/userReducer";
import { setAccessToken } from "../api/AuthApi";
import ReCAPTCHA from "react-google-recaptcha";

const LoginForm = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const recaptchaRef = useRef(null);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!recaptchaToken) {
      Swal.fire({
        icon: "warning",
        title: "Please verify you are not a robot",
      });
      return;
    }
    const requestBody = {
      email,
      password,
      recaptchaToken,
      rememberMe,
    };
    login(requestBody)
      .then((response) => {
        setAccessToken(response.data.access_token);
        dispatch(verifyAdminStatus(verifyAdmin));
        dispatch(setUser(response.data.user));
        history.push("/dashboard");
      })
      .catch((error) => {
        console.error("Login failed:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again!",
        });
      });
  };
  //arrow function
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-title">Login</h2>
      <p className="text-center mt-3">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          //callbacks
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          required
        />
      </div>

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.REACT_APP_SITE_KEY}
        onChange={handleRecaptchaChange}
      />

      <div className="form-group remember-me">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="rememberMe">Remember me</label>
      </div>

      <button className="login-btn" type="submit">
        Login
      </button>
      <p className="text-center mt-3">
        Fogot Password? <Link to="/forgotpwd">Click Here</Link>
      </p>
    </form>
  );
};
export default LoginForm;
