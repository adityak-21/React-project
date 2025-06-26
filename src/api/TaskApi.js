import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

export const listMyTasks = (filters) =>
  axios.post(
    `${BASE_URL}/listMyTasks`,
    {
      title: filters.title,
      created_by: filters.created_by,
      from: filters.from,
      to: filters.to,
      status: filters.status,
      pagenumber: filters.pagenumber,
      perpage: filters.perpage,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const listAllTasks = (filters) =>
  axios.post(
    `${BASE_URL}/listAllTasks`,
    {
      title: filters.title,
      created_by: filters.created_by,
      assignee: filters.assignee,
      from: filters.from,
      to: filters.to,
      status: filters.status,
      pagenumber: filters.pagenumber,
      perpage: filters.perpage,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

// export const deleteTasks = (taskIds) =>
//   axios.post(
//     `${BASE_URL}/bulkdeleteTasks`,
//     { task_ids: taskIds },
//     {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//       },
//     }
//   );
