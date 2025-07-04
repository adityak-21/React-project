import Swal from "sweetalert2";
import { register } from "../api/AuthApi";
import { verifyToken } from "../api/AuthApi";
import { getAccessToken } from "../api/AuthApi";
import { removeAccessToken } from "../api/AuthApi";

const initialState = {
  registering: false,
  registered: false,
  error: null,
};

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case "REGISTER_REQUEST":
      return { ...state, registering: true, error: null };
    case "REGISTER_SUCCESS":
      return { ...state, registering: false, registered: true };
    case "REGISTER_FAILURE":
      return { ...state, registering: false, error: action.error };
    default:
      return state;
  }
}

export const registerUser =
  (formData, history, isModal = false) =>
  (dispatch) => {
    dispatch({ type: "REGISTER_REQUEST" });
    const token = getAccessToken();
    let isTokenValid = true;
    if (token) {
      try {
        verifyToken();
        isTokenValid = true;
      } catch (err) {
        removeAccessToken();
        isTokenValid = false;
      }
    }
    console.log("isTokenValid", isTokenValid);
    register(formData, isTokenValid)
      .then(() => {
        //   dispatch({ type: "REGISTER_SUCCESS", payload });
        dispatch({ type: "REGISTER_SUCCESS" });
        console.log(isModal);
        if (!isModal) history.push("/login");
        if (isModal) {
          Swal.fire({
            icon: "success",
            title: "Registration Successful",
            text: "Please check email for confirmation.",
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: "REGISTER_FAILURE",
          error:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again!",
        });
        alert(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again!"
        );
      });
  };
