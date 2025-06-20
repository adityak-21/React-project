import { register } from "../api/AuthApi";

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

export const registerUser = (formData, history) => (dispatch) => {
  dispatch({ type: "REGISTER_REQUEST" });
  register(formData)
    .then(() => {
      //   dispatch({ type: "REGISTER_SUCCESS", payload });
      dispatch({ type: "REGISTER_SUCCESS" });
      history.push("/login");
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
