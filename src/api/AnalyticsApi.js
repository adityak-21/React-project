import api from "./axiosInstance";

export const myTaskStatusStats = () => api.post("/myTaskStatusStatistics");

export const averageCompletionTime = () => api.post("/averageCompletionTime");

export const assignedVsCreated = () => api.post("/assignedVsCreated");

export const oldestOpenTasks = () => api.post("/oldestOpenTasks");