const SET_ADMIN = "SET_ADMIN";
const SET_VIEW_AS_ADMIN = "SET_VIEW_AS_ADMIN";
const VERIFY_ADMIN_REQUEST = "VERIFY_ADMIN_REQUEST";
const VERIFY_ADMIN_SUCCESS = "VERIFY_ADMIN_SUCCESS";
const VERIFY_ADMIN_FAILURE = "VERIFY_ADMIN_FAILURE";

const initialState = {
  isAdmin: false,
  viewAsAdmin: false,
  verifying: false,
  error: null,
};
// selector
// createSeletor
// caching
// itemsByid - [1: {id: 1, name: "item1"}, 2: {id: 2, name: "item2"}]
// items - [1,2 3]
// Promise - Promise.all([promise1, promise2])
// const getItems = (state) => state.items;
export function verifyAdminReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ADMIN:
      return { ...state, isAdmin: action.payload };
    case SET_VIEW_AS_ADMIN:
      return { ...state, viewAsAdmin: action.payload };
    case VERIFY_ADMIN_REQUEST:
      return { ...state, verifying: true, error: null };
    case VERIFY_ADMIN_SUCCESS:
      return { ...state, verifying: false, isAdmin: true, viewAsAdmin: true };
    case VERIFY_ADMIN_FAILURE:
      return {
        ...state,
        verifying: false,
        isAdmin: false,
        viewAsAdmin: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export const setAdmin = (isAdmin) => ({
  type: SET_ADMIN,
  payload: isAdmin,
});

export const setViewAsAdmin = (viewAsAdmin) => ({
  type: SET_VIEW_AS_ADMIN,
  payload: viewAsAdmin,
});

export const verifyAdminStatus = (verifyAdminApi) => (dispatch) => {
  dispatch({ type: VERIFY_ADMIN_REQUEST });
  verifyAdminApi()
    .then(() => {
      console.log("Admin verification successful");
      dispatch({ type: VERIFY_ADMIN_SUCCESS });
    })
    .catch((error) => {
      console.error("Admin verification failed");
      dispatch({
        type: VERIFY_ADMIN_FAILURE,
        error: error.message || "Verification failed",
      });
    });
};
