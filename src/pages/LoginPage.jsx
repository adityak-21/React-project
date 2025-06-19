import React from "react";
import LoginForm from "../components/LoginForm";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

const LoginPage = () => {
  const history = useHistory();
  const handleSuccessfulLogin = () => {
    history.push("/dashboard");
  };
  const handleFailedLogin = (error) => {
    console.error("Login failed:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again!",
    });
  };
  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 100 }}>
      <LoginForm
        apiUrl="http://localhost:8000/api/v1/login"
        onSuccess={handleSuccessfulLogin}
        onError={handleFailedLogin}
        redirectPath="/dashboard"
        history={history}
      />
    </div>
  );
};
export default LoginPage;
