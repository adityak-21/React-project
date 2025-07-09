import api from "./axiosInstance";

export const listRoles = () => api.post("/roles");

export const assignUserRoles = (userId, roleIds) =>
  api.post(`/users/${userId}/roles`, { roles: roleIds });

export const removeUserRole = (userId, roleId) =>
  api.post(`/users/${userId}/roles/${roleId}`);

export const changeRoles = (userId, roleIds) => {
  return api.post(`/users/${userId}/changeRoles`, { roles: roleIds });
};
