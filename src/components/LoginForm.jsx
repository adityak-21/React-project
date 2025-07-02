import React, { useState } from "react";
import axios from "axios";
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
        localStorage.setItem("access_token", response.data.access_token);
        // console.log(response.data);
        dispatch(verifyAdminStatus(verifyAdmin));
        dispatch(setUserName(response.data.user.name));
        dispatch(setUserEmail(response.data.user.email));
        dispatch(setUserId(response.data.user.id));
        dispatch(setUserRoles(response.data.user.roles));

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
    </form>
  );
};
export default LoginForm;

// class LoginForm extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             email: '',
//             password: ''
//         }
//     }
//     handleChange = (e) => {
//         this.setState({ [e.target.id]: e.target.value });
//     }
//     handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const { email, password } = this.state;
//             const requestBody = { email, password };
//             const response = await axios.post('http://localhost:8000/api/v1/login', requestBody);
//             localStorage.setItem('access_token', response.data.access_token);
//             console.log(response.data);
//             this.props.history.push('/');
//         } catch (error) {
//             console.log(error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Oops...",
//                 text: error.response?.data?.message || error.message || "Something went wrong. Please try again!"
//             });
//         }
//     }
//     render () {
//         return (
//             <form className="login-form" onSubmit={this.handleSubmit}>
//                 <h2 className="login-title">Login</h2>
//                 <div className="form-group">
//                     <label htmlFor="email">Email address</label>
//                     <input
//                         onChange={this.handleChange}
//                         type="email"
//                         className="form-control"
//                         id="email"
//                         placeholder="Enter email"
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="password">Password</label>
//                     <input
//                         onChange={this.handleChange}
//                         type="password"
//                         className="form-control"
//                         id="password"
//                         placeholder="Password"
//                         required
//                     />
//                 </div>

//                 <button className="login-btn" type="submit">Login</button>
//             </form>
//         );
//     }
// }
// export default withRouter(LoginForm);

// const LoginForm = ({
//   apiUrl = "http://localhost:8000/api/v1/login",
//   onSuccess,
//   onError,
//   redirectPath = "/",
//   history: propHistory,
// }) => {
//   const hookHistory = useHistory();
//   const history = propHistory || hookHistory;
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const requestBody = {
//         email,
//         password,
//       };
//       const response = await axios.post(apiUrl, requestBody);
//       localStorage.setItem("access_token", response.data.access_token);
//       console.log(response.data);
//       if (onSuccess) {
//         onSuccess(response.data);
//       } else if (history) {
//         history.push(redirectPath);
//       }
//     } catch (error) {
//       if (onError) {
//         onError(error);
//       } else {
//         alert(
//           error.response?.data?.message ||
//             error.message ||
//             "Something went wrong!"
//         );
//       }
//     }
//   };
//   //arrow function
//   return (
//     <form className="login-form" onSubmit={handleSubmit}>
//       <h2 className="login-title">Login</h2>
//       <p className="text-center mt-3">
//         Don't have an account? <Link to="/register">Register</Link>
//       </p>
//       <div className="form-group">
//         <label htmlFor="email">Email address</label>
//         <input
//           //callbacks
//           onChange={(e) => setEmail(e.target.value)}
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
//           onChange={(e) => setPassword(e.target.value)}
//           type="password"
//           className="form-control"
//           id="password"
//           placeholder="Password"
//           required
//         />
//       </div>

//       <button className="login-btn" type="submit">
//         Login
//       </button>
//     </form>
//   );
// };
// export default LoginForm;
