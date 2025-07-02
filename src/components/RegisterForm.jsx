// import React from "react";
// import axios from "axios";
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { connect } from "react-redux";
// import { useHistory, Link } from "react-router-dom";
// import "../style/RegisterForm.css";
// import { register } from "../api/AuthApi";
// import { registerUser } from "../redux/authReducer";

// const RegisterForm = ({
//   registering,
//   registered,
//   error,
//   registerUser,
//   history,
// }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     password_confirmation: "",
//   });
//   //   const dispatch = useDispatch();
//   //   const history = useHistory();
//   //Promise
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // const { name, email, password, password_confirmation } = formData;
//     // const requestBody = { name, email, password, password_confirmation };

//     // register(requestBody)
//     //   .then((response) => {
//     //     console.log(response.data);
//     //     history.push("/login");
//     //   })
//     //   .catch((error) => {
//     //     console.error("Registration failed:", error);
//     //     alert(
//     //       error.response?.data?.message ||
//     //         error.message ||
//     //         "Something went wrong. Please try again!"
//     //     );
//     //   });
//     registerUser(formData, history);
//   };

//   return (
//     <form className="register-form" onSubmit={handleSubmit}>
//       <h2 className="register-title">Register</h2>
//       {registering && <div>Registering...</div>}
//       {error && <div className="error">{error}</div>}
//       {registered && (
//         <div className="success">Registration successful! Redirecting...</div>
//       )}
//       <div className="form-group">
//         <label htmlFor="name">Name</label>
//         <input
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           type="text"
//           className="form-control"
//           id="name"
//           placeholder="Enter your name"
//           required
//         />
//       </div>
//       <div className="form-group">
//         <label htmlFor="email">Email address</label>
//         <input
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           type="email"
//           className="form-control"
//           id="email"
//           placeholder="Enter email"
//           required
//         />
//       </div>
//       <div className="form-group">
//         <label htmlFor="password">Password</label>
//         <input
//           onChange={(e) =>
//             setFormData({ ...formData, password: e.target.value })
//           }
//           type="password"
//           className="form-control"
//           id="password"
//           placeholder="Password"
//           required
//         />
//       </div>
//       <div className="form-group">
//         <label htmlFor="confirmPassword">Confirm Password</label>
//         <input
//           onChange={(e) =>
//             setFormData({ ...formData, password_confirmation: e.target.value })
//           }
//           type="password"
//           className="form-control"
//           id="confirmPassword"
//           placeholder="Confirm Password"
//           required
//         />
//       </div>
//       <button className="register-btn" type="submit">
//         Register
//       </button>
//       <p className="text-center mt-3">
//         Already have an account? <Link to="/login">Login here</Link>
//       </p>
//     </form>
//   );
// };
// //HOC
// const mapStateToProps = (state) => ({
//   registering: state.auth.registering,
//   registered: state.auth.registered,
//   error: state.auth.error,
// });
// const mapDispatchToProps = (dispatch) => ({
//   registerUser: (formData, history) =>
//     dispatch(registerUser(formData, history)),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);

import React, { useState } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { registerUser } from "../redux/authReducer";
import { Link } from "react-router-dom";
import "../style/RegisterForm.css";
import { withRouter } from "react-router-dom";

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
}) => {
  const onSubmit = (values) => {
    registerUser(values, history, isModal);
  };

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
      <Field
        name="password"
        type="password"
        component={renderField}
        label="Password"
        id="password"
        placeholder="Password"
      />
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
        disabled={submitting || pristine}
      >
        Register
      </button>
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
});
const mapDispatchToProps = (dispatch) => ({
  registerUser: (formData, history, isModal = false) =>
    dispatch(registerUser(formData, history, isModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
