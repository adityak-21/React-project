import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";
//xhr
//axios
// fetch
//extend
export const login = (requestBody) =>
  axios.post(`${BASE_URL}/login`, requestBody);

export const logout = () =>
  axios.post(
    `${BASE_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const register = (requestBody, withAuth = true) => {
  const headers =
    withAuth && localStorage.getItem("access_token")
      ? { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
      : {};
  // console.log("headers", headers);
  return axios.post(`${BASE_URL}/register`, requestBody, { headers });
};

export const verifyToken = () =>
  axios.post(
    `${BASE_URL}/validate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const verifyAdmin = () => {
  return axios.post(
    `${BASE_URL}/isAdmin`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
};
