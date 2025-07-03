import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/LoginForm.css";
import Swal from "sweetalert2";
import { resetpwd } from "../api/AuthApi";
import { useParams } from "react-router-dom";

const ResetPwdForm = () => {
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const { token } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestBody = {
      password,
      password_confirmation,
    };
    resetpwd(requestBody, token)
      .then(
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your password has been reset.",
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
      <h2 className="login-title">Enter New Password</h2>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          //callbacks
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
          id="password"
          placeholder="Enter new password"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password_confirmation">Confirm Password</label>
        <input
          //callbacks
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          type="password"
          className="form-control"
          id="password_confirmation"
          placeholder="Confirm new password"
          required
        />
      </div>

      <button className="login-btn" type="submit">
        Confirm
      </button>
      <p className="text-center mt-3">
        Back to Login Page? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};
export default ResetPwdForm;
