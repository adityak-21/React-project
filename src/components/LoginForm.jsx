import React, { useState } from "react";
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

const LoginForm = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestBody = {
      email,
      password,
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
