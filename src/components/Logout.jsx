import React from "react";
import { logout } from "../api/AuthApi";
import { useHistory } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { loggingout } from "../redux/userReducer";
import { useDispatch } from "react-redux";
import { removeAccessToken } from "../api/AuthApi";

const Logout = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      dispatch(loggingout());
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again!"
      );
    } finally {
      removeAccessToken();
      history.push("/login");
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
