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
