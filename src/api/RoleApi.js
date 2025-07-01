import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

export const listRoles = () =>
  axios.post(
    `${BASE_URL}/roles`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const assignUserRoles = (userId, roleIds) =>
  axios.post(
    `${BASE_URL}/users/${userId}/roles`,
    { roles: roleIds },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const removeUserRole = (userId, roleId) =>
  axios.post(
    `${BASE_URL}/users/${userId}/roles/${roleId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
