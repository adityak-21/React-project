import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

export const listUsers = (filters) =>
  axios.post(
    `${BASE_URL}/listUsers`,
    {
      name: filters.name,
      email: filters.email,
      role: filters.role,
      pagenumber: filters.pagenumber,
      perpage: filters.perpage,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const listUserActivities = (filters) =>
  axios.post(
    `${BASE_URL}/listActivities`,
    {
      name: filters.name,
      from: filters.from,
      to: filters.to,
      pagenumber: filters.pagenumber,
      perpage: filters.perpage,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const deleteUsers = (userIds) =>
  axios.post(
    `${BASE_URL}/bulkdelete`,
    { user_ids: userIds },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const updateUserName = (userId, name) =>
  axios.post(
    `${BASE_URL}/update-name/${userId}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
