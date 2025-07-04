import api from "./axiosInstance";

export const listMyTasks = (filters = {}) => {
  const params = {
    title: filters.title,
    created_by: filters.created_by,
    from: filters.from,
    to: filters.to,
    status: filters.status,
    pagenumber: filters.pagenumber,
    perpage: filters.perpage,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order,
  };
  return api.post("/listMyTasks", params);
};

export const listAllTasks = (filters = {}) => {
  const params = {
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
  };
  return api.post("/listAllTasks", params);
};

export const listCreatedTasks = (filters = {}) => {
  const params = {
    title: filters.title,
    assignee: filters.assignee,
    from: filters.from,
    to: filters.to,
    status: filters.status,
    pagenumber: filters.pagenumber,
    perpage: filters.perpage,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order,
  };
  return api.post("/listCreatedTasks", params);
};

export function updateTaskStatus(taskId, status) {
  return api.post(`/updateTaskStatus/${taskId}`, { status });
}

export function updateTaskDueDate(taskId, dueDate) {
  return api.post(`/updateTaskDueDate/${taskId}`, { due_date: dueDate });
}

export function updateTaskTitle(taskId, title) {
  return api.post(`/updateTaskTitle/${taskId}`, { title });
}

export function updateTaskDescription(taskId, description) {
  return api.post(`/updateTaskDescription/${taskId}`, { description });
}

export function createTask(requestBody) {
  return api.post("/createTask", requestBody);
}

export function deleteTask(taskId) {
  return api.post(`/deleteTask/${taskId}`);
}
