import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

export const myTaskStatusStats = () =>
  axios.post(
    `${BASE_URL}/myTaskStatusStatistics`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const averageCompletionTime = () =>
  axios.post(
    `${BASE_URL}/averageCompletionTime`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const assignedVsCreated = () =>
  axios.post(
    `${BASE_URL}/assignedVsCreated`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const oldestOpenTasks = () =>
  axios.post(
    `${BASE_URL}/oldestOpenTasks`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
