import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

export const messageNotifications = (requestBody) =>
  axios.post(`${BASE_URL}/sendMessage`, requestBody, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

export const messagePrivateNotifications = (requestBody) =>
  axios.post(`${BASE_URL}/sendToUser`, requestBody, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

export const listNotifications = () =>
  axios.post(
    `${BASE_URL}/listNotifications`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const markAsRead = (notificationId) =>
  axios.post(
    `${BASE_URL}/markAsRead/${notificationId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
