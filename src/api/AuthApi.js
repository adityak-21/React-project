import api from "./axiosInstance";

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

export const setAccessToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const removeAccessToken = () => {
  localStorage.removeItem("access_token");
};

export const login = (requestBody) => api.post("/login", requestBody);

export const logout = () => api.post("/logout");

export const register = (requestBody, withAuth = true) => {
  if (withAuth) {
    return api.post("/register", requestBody);
  } else {
    return api.post("/register", requestBody, { headers: {} });
  }
};

export const verifyToken = () => api.post("/validate");

export const verifyAdmin = () => api.post("/isAdmin");

export const me = () => api.post("/user-profile");

export const forgotpwd = (requestBody) => api.post("/forgotpwd", requestBody);

export const resetpwd = (requestBody, token) =>
  api.post(`/resetpwd/${token}`, requestBody);

export const confirmEmail = (token) => api.post(`/confirm-email/${token}`, {});
