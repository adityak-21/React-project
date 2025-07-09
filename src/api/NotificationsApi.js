import api from "./axiosInstance";

export const messageNotifications = (requestBody) =>
  api.post("/sendMessage", requestBody);

export const messagePrivateNotifications = (requestBody) =>
  api.post("/sendToUser", requestBody);

export const listNotifications = () => api.post("/listNotifications");

export const markAsRead = (notificationId) =>
  api.post(`/markAsRead/${notificationId}`);

export const getRecent = () => api.post("/getRecent");
