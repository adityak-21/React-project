import React, { useState, useEffect } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { registerUser } from "../redux/authReducer";
import { Link } from "react-router-dom";
import "../style/RegisterForm.css";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import zxcvbn from "zxcvbn";

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error },
  id,
  placeholder,
}) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <input
      {...input}
      type={type}
      className="form-control"
      id={id}
      placeholder={placeholder}
      required
    />
    {touched && error && <span className="error">{error}</span>}
  </div>
);

const validate = (values) => {
  const errors = {};
  if (!values.name) errors.name = "Required";
  if (!values.email) errors.email = "Required";
  if (!values.password) errors.password = "Required";
  if (!values.password_confirmation) errors.password_confirmation = "Required";
  if (
    values.password &&
    values.password_confirmation &&
    values.password !== values.password_confirmation
  )
    errors.password_confirmation = "Passwords must match";
  return errors;
};

const PasswordStrengthMeter = ({ password }) => {
  const result = zxcvbn(password || "");
  const score = result.score;
  const strength = ["Weak", "Weak", "Fair", "Good", "Strong"][score];
  const barColors = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60"];

  return (
    <div className="password-strength-meter">
      <div className="meter-bar-background">
        <div
          className="meter-bar"
          style={{
            width: `${((score + 1) / 5) * 100}%`,
            background: barColors[score],
            height: "8px",
            borderRadius: "4px",
            transition: "width 0.3s",
          }}
        />
      </div>
      <div
        className="meter-label"
        style={{
          color: barColors[score],
          fontWeight: "bold",
          marginTop: "4px",
          fontSize: "0.95em",
        }}
      >
        {strength}
      </div>
    </div>
  );
};

let RegisterForm = ({
  handleSubmit,
  submitting,
  pristine,
  registering,
  registered,
  error,
  registerUser,
  history,
  isModal = false,
  passwordValue,
  dispatch,
}) => {
  const [canSubmit, setCanSubmit] = useState(false);
  useEffect(() => {
    const result = zxcvbn(passwordValue || "");
    setCanSubmit(result.score >= 2);
  }, [passwordValue]);

  const onSubmit = (values) => {
    if (!canSubmit) return;
    registerUser(values, history, isModal);
  };

  useEffect(() => {
    if (registered) {
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Confirmation email has been sent. Please check your inbox.",
      });
    }
  }, [registered]);

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="register-title">Register</h2>
      {registering && <div>Registering...</div>}
      {error && <div className="error">{error}</div>}
      {registered && (
        <div className="success">Registration successful! Redirecting...</div>
      )}
      <Field
        name="name"
        type="text"
        component={renderField}
        label="Name"
        id="name"
        placeholder="Enter your name"
      />
      <Field
        name="email"
        type="email"
        component={renderField}
        label="Email address"
        id="email"
        placeholder="Enter email"
      />
      <div>
        <Field
          name="password"
          type="password"
          component={renderField}
          label="Password"
          id="password"
          placeholder="Password"
        />
        <PasswordStrengthMeter password={passwordValue} />
      </div>
      <Field
        name="password_confirmation"
        type="password"
        component={renderField}
        label="Confirm Password"
        id="confirmPassword"
        placeholder="Confirm Password"
      />
      <button
        className="register-btn"
        type="submit"
        disabled={submitting || pristine || !canSubmit}
      >
        Register
      </button>
      {!canSubmit && passwordValue && (
        <div style={{ color: "#e74c3c", marginTop: "6px" }}>
          Password is too weak to register.
        </div>
      )}
      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
};
RegisterForm = reduxForm({
  form: "register",
  validate,
})(RegisterForm);

const mapStateToProps = (state) => ({
  registering: state.auth.registering,
  registered: state.auth.registered,
  error: state.auth.error,
  passwordValue: state.form?.register?.values?.password || "",
});
const mapDispatchToProps = (dispatch) => ({
  registerUser: (formData, history, isModal = false) =>
    dispatch(registerUser(formData, history, isModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
