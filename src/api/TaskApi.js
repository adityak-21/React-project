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
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
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
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export const listCreatedTasks = (filters) =>
  axios.post(
    `${BASE_URL}/listCreatedTasks`,
    {
      title: filters.title,
      assignee: filters.assignee,
      from: filters.from,
      to: filters.to,
      status: filters.status,
      pagenumber: filters.pagenumber,
      perpage: filters.perpage,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

export function updateTaskStatus(taskId, status) {
  return axios.post(
    `${BASE_URL}/updateTaskStatus/${taskId}`,
    { status: status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
}

export function updateTaskDueDate(taskId, dueDate) {
  return axios.post(
    `${BASE_URL}/updateTaskDueDate/${taskId}`,
    { due_date: dueDate },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
}

export function updateTaskTitle(taskId, title) {
  return axios.post(
    `${BASE_URL}/updateTaskTitle/${taskId}`,
    { title: title },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
}

export function updateTaskDescription(taskId, description) {
  return axios.post(
    `${BASE_URL}/updateTaskDescription/${taskId}`,
    { description: description },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
}

export function createTask(requestBody) {
  return axios.post(`${BASE_URL}/createTask`, requestBody, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
}

export function deleteTask(taskId) {
  return axios.post(
    `${BASE_URL}/deleteTask/${taskId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );
}
