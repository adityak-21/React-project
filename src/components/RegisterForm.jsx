import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import "../style/RegisterForm.css";
import { register } from "../api/AuthApi";
import { registerUser } from "../redux/authReducer";
const RegisterForm = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const dispatch = useDispatch();
  const history = useHistory();
  //Promise
  const handleSubmit = (event) => {
    event.preventDefault();
    // const { name, email, password, password_confirmation } = formData;
    // const requestBody = { name, email, password, password_confirmation };

    // register(requestBody)
    //   .then((response) => {
    //     console.log(response.data);
    //     history.push("/login");
    //   })
    //   .catch((error) => {
    //     console.error("Registration failed:", error);
    //     alert(
    //       error.response?.data?.message ||
    //         error.message ||
    //         "Something went wrong. Please try again!"
    //     );
    //   });
    dispatch(registerUser(formData, history));
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2 className="register-title">Register</h2>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          type="text"
          className="form-control"
          id="name"
          placeholder="Enter your name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          onChange={(e) =>
            setFormData({ ...formData, password_confirmation: e.target.value })
          }
          type="password"
          className="form-control"
          id="confirmPassword"
          placeholder="Confirm Password"
          required
        />
      </div>
      <button className="register-btn" type="submit">
        Register
      </button>
      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
};
export default RegisterForm;
