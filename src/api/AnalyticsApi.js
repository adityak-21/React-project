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
