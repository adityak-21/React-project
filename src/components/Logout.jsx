import React from "react";
import { logout } from "../api/AuthApi";
import { useHistory } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { loggingout } from "../redux/userReducer";
import { useDispatch } from "react-redux";

const Logout = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleLogout = (event) => {
    event.preventDefault();
    try {
      dispatch(loggingout());
      logout();
      localStorage.removeItem("access_token");
      history.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again!"
      );
    }
  };

  return (
    <a
      href="#"
      onClick={handleLogout}
      style={{ display: "flex", alignItems: "center" }}
    >
      <FaSignOutAlt style={{ marginRight: "10px" }} />
      Logout
    </a>
  );
};

export default Logout;
