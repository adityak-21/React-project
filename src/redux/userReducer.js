const SET_USER_NAME = "SET_USER_NAME";
const SET_USER_EMAIL = "SET_USER_EMAIL";
const SET_USER_ID = "SET_USER_ID";
const SET_USER_ROLES = "SET_USER_ROLES";
const LOGOUT = "LOGOUT";

const initialState = {
  userName: null,
  userEmail: null,
  userId: null,
  userRoles: [],
};

export const setUserName = (userName) => ({
  type: SET_USER_NAME,
  payload: userName,
});
export const setUserEmail = (userEmail) => ({
  type: SET_USER_EMAIL,
  payload: userEmail,
});
export const setUserId = (userId) => ({
  type: SET_USER_ID,
  payload: userId,
});
export const setUserRoles = (userRoles) => ({
  type: SET_USER_ROLES,
  payload: userRoles,
});
export const loggingout = () => ({
  type: LOGOUT,
});

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_NAME:
      return { ...state, userName: action.payload };
    case SET_USER_EMAIL:
      return { ...state, userEmail: action.payload };
    case SET_USER_ID:
      return { ...state, userId: action.payload };
    case SET_USER_ROLES:
      return { ...state, userRoles: action.payload };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
