import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/LoginForm.css";
import Swal from "sweetalert2";
import { forgotpwd } from "../api/AuthApi";

const ForgotPwdForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestBody = {
      email,
    };
    forgotpwd(requestBody)
      .then(
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password reset link has been sent to your email.",
        })
      )
      .catch((error) => {
        console.error("Forgot Password failed:", error);
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
      <h2 className="login-title">Forgot Password?</h2>
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

      <button className="login-btn" type="submit">
        Send
      </button>
      <p className="text-center mt-3">
        Back to Login Page? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};
export default ForgotPwdForm;
