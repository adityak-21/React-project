import api from "./axiosInstance";

export const listUsers = (filters) =>
  api.post("/listUsers", {
    name: filters.name,
    email: filters.email,
    role: filters.role,
    pagenumber: filters.pagenumber,
    perpage: filters.perpage,
  });

export const listUserActivities = (filters) =>
  api.post("/listActivities", {
    name: filters.name,
    from: filters.from,
    to: filters.to,
    pagenumber: filters.pagenumber,
    perpage: filters.perpage,
  });

export const getRecentActivities = (userId) =>
  api.post("/getRecentActivities", { user_id: userId });

export const deleteUsers = (userIds) =>
  api.post("/bulkdelete", { user_ids: userIds });

export const updateUserName = (userId, name) =>
  api.post(`/update-name/${userId}`, { name });
