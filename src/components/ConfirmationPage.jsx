import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/LoginForm.css";
import Swal from "sweetalert2";
import { resetpwd } from "../api/AuthApi";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { confirmEmail } from "../api/AuthApi";

const ConfirmEmail = () => {
  const { token } = useParams();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Invalid Token",
        text: "The token provided is invalid or expired.",
      });
    }
    confirmEmail(token)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Email Confirmed",
          text: "Your email has been successfully confirmed. You can login now.",
        });
        setConfirmed(true);
      })
      .catch((error) => {
        console.error("Email confirmation failed:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again!",
        });
      });
  }, [token]);

  return confirmed ? (
    <Link to="/login">Click here to Login</Link>
  ) : (
    <div className="login-form">
      <h2 className="login-title">Confirming Email...</h2>
      <p>Please wait while we confirm your email...</p>
    </div>
  );
};
export default ConfirmEmail;
