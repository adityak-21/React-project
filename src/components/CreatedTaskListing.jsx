import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../common/Loading";
import { useDebounce } from "../common/Debounce";
import { listCreatedTasks, updateTaskTitle } from "../api/TaskApi";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Tooltip } from "../common/Tooltip";
import { updateTaskStatus } from "../api/TaskApi";
import { updateTaskDueDate } from "../api/TaskApi";
import { updateTaskDescription } from "../api/TaskApi";
import { Button } from "@material-ui/core";
import { listUsers } from "../api/UserApi";
import { createTask } from "../api/TaskApi";

import { LoaderRow } from "../common/Loading";
import "../style/MyTaskListing.css";

import { Modal } from "../common/Modal";

function TaskFilterForm({ filters, handleInputChange }) {
  return (
    <form className="task-listing-search-form" style={{ marginBottom: "1rem" }}>
      <Tooltip text="Write title to search by title">
        <input
          type="text"
          name="title"
          placeholder="Search by Title"
          value={filters.title}
          onChange={handleInputChange}
          className="search-name"
        />
      </Tooltip>
      <Tooltip text="Write assignee name">
        <input
          type="text"
          name="assignee"
          placeholder="Search by Assignee"
          value={filters.assignee}
          onChange={handleInputChange}
          className="search-name"
        />
      </Tooltip>
      <Tooltip text="Status of the task">
        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
          className="search-status"
        >
          <option value="">All Statuses</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="verified">Verified</option>
        </select>
      </Tooltip>
      <Tooltip text="Due Date from">
        <input
          type="datetime-local"
          name="from"
          //   placeholder="Search by Full Email"
          value={filters.from}
          onChange={handleInputChange}
          className="search-date"
        />
      </Tooltip>
      <Tooltip text="Due Date to">
        <input
          type="datetime-local"
          name="to"
          //   placeholder="Search by Role"
          value={filters.to}
          onChange={handleInputChange}
          className="search-date"
        />
      </Tooltip>
      <Tooltip text="Page number to display">
        <input
          type="number"
          name="pagenumber"
          min={1}
          step={1}
          value={filters.pagenumber}
          onChange={handleInputChange}
          className="page-number-input"
        />
      </Tooltip>
      <Tooltip text="Number of tasks per page">
        <input
          type="number"
          name="perpage"
          min={1}
          step={1}
          value={filters.perpage}
          onChange={handleInputChange}
          className="per-page-input"
        />
      </Tooltip>
      <Tooltip text="Sort By">
        <select
          name="sort_by"
          value={filters.sort_by || ""}
          onChange={handleInputChange}
          className="search-status"
        >
          <option value="">Default</option>
          <option value="title">Title</option>
          <option value="due_date">Due Date</option>
          <option value="status">Status</option>
        </select>
      </Tooltip>
      <Tooltip text="Sort Order">
        <select
          name="sort_order"
          value={filters.sort_order || ""}
          onChange={handleInputChange}
          className="search-status"
        >
          <option value="">Default</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </Tooltip>
    </form>
  );
}

function TaskTableRow({
  task,
  handleStatusChange,
  handleDueDateChange,
  handleTitleChange,
  handleDescriptionChange,
}) {
  const currStatus = task.status;
  return (
    <TableRow>
      <TableCell>{task.id}</TableCell>
      {/* <TableCell>{task.title}</TableCell>
      <TableCell>{task.description}</TableCell> */}
      <TableCell>
        {task.title && (
          <span
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#1976d2",
            }}
            onClick={() => handleTitleChange(task)}
            title="Click to edit title"
          >
            {task.title}
          </span>
        )}
        {!task.title && (
          <span
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#999",
            }}
            onCliclk={() => handleTitleChange(task)}
            title="Click to add title"
          >
            No Title
          </span>
        )}
      </TableCell>
      <TableCell>
        {task.description && (
          <span
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#1976d2",
            }}
            onClick={() => handleDescriptionChange(task)}
            title="Click to edit description"
          >
            {task.description}
          </span>
        )}
        {!task.description && (
          <span
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#999",
            }}
            onClick={() => handleDescriptionChange(task)}
            title="Click to add description"
          >
            No Description
          </span>
        )}
      </TableCell>
      <TableCell>{task.assignee}</TableCell>
      <TableCell>
        <input
          type="datetime-local"
          value={task.due_date ? task.due_date.substring(0, 16) : ""}
          onChange={(e) => handleDueDateChange(task.id, e.target.value)}
          style={{ minWidth: 180 }}
        />
      </TableCell>
      <TableCell>
        {task.status !== "verified" && (
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task.id, e.target.value)}
          >
            <option value={currStatus}>{currStatus}</option>
            <option value="verified">Verified</option>
          </select>
        )}
        {task.status === "verified" && <span>Verified</span>}
      </TableCell>
      <TableCell>{task.created_at}</TableCell>
      <TableCell>{task.updated_at}</TableCell>
    </TableRow>
  );
}

function NoTasksRow({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} style={{ textAlign: "center" }}>
        No tasks found
      </TableCell>
    </TableRow>
  );
}

function HeadRow() {
  return (
    <TableRow>
      <TableCell>Id</TableCell>
      <TableCell>Title</TableCell>
      <TableCell>Description</TableCell>
      <TableCell>Assignee</TableCell>
      <TableCell>Due Date</TableCell>
      <TableCell>Status</TableCell>
      <TableCell>Created At</TableCell>
      <TableCell>Updated At</TableCell>
    </TableRow>
  );
}

const CreatedTaskListing = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    title: "",
    assignee: "",
    from: "",
    to: "",
    status: "",
    pagenumber: 1,
    perpage: 6,
    sort_by: "",
    sort_order: "",
  });
  const [tasks, setTasks] = useState([]);
  const [taskFetching, setTaskFetching] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    assignee_id: "",
  });
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [assigneeLoading, setAssigneeLoading] = useState(false);
  const debouncedAssigneeSearch = useDebounce(assigneeSearch, 400);

  const debouncedFilters = useDebounce(filters, 500);
  useEffect(() => {
    setTaskFetching(true);
    listCreatedTasks(debouncedFilters)
      .then((response) => {
        setTasks(response.data.tasks);
        console.log("Fetched tasks:", response.data.tasks);
        setTaskFetching(false);
      })
      .catch((error) => {
        console.error("Failed to fetch tasks:", error);
        setTaskFetching(false);
      });
  }, [debouncedFilters]);

  useEffect(() => {
    if (!isCreateModalOpen) return;
    setAssigneeLoading(true);
    listUsers({ name: debouncedAssigneeSearch })
      .then((response) => {
        setAssigneeOptions(response.data.users || []);
        setAssigneeLoading(false);
      })
      .catch(() => setAssigneeLoading(false));
  }, [debouncedAssigneeSearch, isCreateModalOpen]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
      ...(name !== "pagenumber" && name !== "perpage" && { pagenumber: 1 }),
    }));
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus)
      .then((response) => {
        console.log("Task status updated successfully:", response.data);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update task status:", error);
      });
  };

  const handleDueDateChange = (taskId, newDueDate) => {
    updateTaskDueDate(taskId, newDueDate)
      .then((response) => {
        console.log("Task due date updated successfully:", response.data);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, due_date: newDueDate } : task
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update task due date:", error);
      });
  };

  const handleEditTitle = (task) => {
    setSelectedTaskId(task.id);
    setEditTaskTitle(task.title);
    setIsTitleModalOpen(true);
  };

  const handleEditDescription = (task) => {
    setSelectedTaskId(task.id);
    setEditTaskDescription(task.description);
    setIsDescriptionModalOpen(true);
  };

  const handleTitleSave = () => {
    updateTaskTitle(selectedTaskId, editTaskTitle)
      .then((response) => {
        console.log("Task title updated successfully:", response.data);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === selectedTaskId
              ? { ...task, title: editTaskTitle }
              : task
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update task title:", error);
      });
  };

  const handleDescriptionSave = () => {
    updateTaskDescription(selectedTaskId, editTaskDescription)
      .then((response) => {
        console.log("Task description updated successfully:", response.data);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === selectedTaskId
              ? { ...task, description: editTaskDescription }
              : task
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update task description:", error);
      });
  };

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssigneeSearch = (e) => setAssigneeSearch(e.target.value);

  const handleSelectAssignee = (userId) => {
    setNewTask((prev) => ({ ...prev, assignee_id: userId }));
  };

  const handleCreateTaskSave = () => {
    if (!newTask.title.trim()) {
      alert("Title is required");
      return;
    }
    createTask(newTask)
      .then(() => {
        setIsCreateModalOpen(false);
        setNewTask({
          title: "",
          description: "",
          due_date: "",
          assignee_id: "",
        });
        setFilters({ ...filters });
      })
      .catch((err) => {
        alert("Failed to create task");
      });
  };

  return (
    <div>
      <h2 className="my-task-listing-title">My-Created-Tasks-Listing</h2>
      {/* <div style={{ marginBottom: "1rem" }}>
        <Button
          variant="outlined"
          color="default"
          onClick={handleDownloadCSV}
          style={{ marginRight: "1rem" }}
        >
          Download CSV
        </Button>
      </div> */}
      <div style={{ marginBottom: "1rem" }}>
        <Button
          variant="outlined"
          color="default"
          onClick={() => setIsCreateModalOpen(true)}
          style={{ marginRight: "1rem" }}
        >
          Create Task
        </Button>
      </div>
      <TaskFilterForm filters={filters} handleInputChange={handleInputChange} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <HeadRow />
          </TableHead>
          <TableBody>
            {taskFetching && <LoaderRow colSpan={9} />}
            {!taskFetching && tasks.length === 0 && <NoTasksRow colSpan={9} />}
            {!taskFetching &&
              tasks.length > 0 &&
              tasks.map((task) => (
                <TaskTableRow
                  task={task}
                  key={`${task.id}`}
                  handleStatusChange={handleStatusChange}
                  handleDueDateChange={handleDueDateChange}
                  handleTitleChange={handleEditTitle}
                  handleDescriptionChange={handleEditDescription}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={isTitleModalOpen} onClose={() => setIsTitleModalOpen(false)}>
        {/* //Modal Header, Body and Footer// */}
        <h3>Edit Title</h3>
        <input
          type="text"
          name="title"
          value={editTaskTitle}
          onChange={(e) => setEditTaskTitle(e.target.value)}
          style={{ width: "100%" }}
        />
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleTitleSave}>Save</button>
          <button
            onClick={() => setIsTitleModalOpen(false)}
            style={{ marginLeft: "1rem" }}
          >
            Cancel
          </button>
        </div>
      </Modal>
      <Modal
        open={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
      >
        <h3>Edit Description</h3>
        <textarea
          name="description"
          value={editTaskDescription}
          onChange={(e) => setEditTaskDescription(e.target.value)}
          rows={4}
          style={{ width: "100%" }}
        />
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleDescriptionSave}>Save</button>
          <button
            onClick={() => setIsDescriptionModalOpen(false)}
            style={{ marginLeft: "1rem" }}
          >
            Cancel
          </button>
        </div>
      </Modal>
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <h3>Create New Task</h3>
        <form>
          <div>
            <label>
              Title <span style={{ color: "red" }}>*</span>
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleNewTaskChange}
                required
                maxLength={255}
                style={{ width: "100%" }}
              />
            </label>
          </div>
          <div>
            <label>
              Description
              <textarea
                name="description"
                value={newTask.description}
                onChange={handleNewTaskChange}
                rows={3}
                style={{ width: "100%" }}
              />
            </label>
          </div>
          <div>
            <label>
              Due Date
              <input
                type="datetime-local"
                name="due_date"
                value={newTask.due_date}
                onChange={handleNewTaskChange}
                style={{ width: "100%", marginBottom: "0.7rem" }}
              />
            </label>
          </div>
          <div>
            <label>
              Assignee <span style={{ color: "red" }}>*</span>
              <input
                type="text"
                placeholder="Search user..."
                value={assigneeSearch}
                onChange={handleAssigneeSearch}
                required
                style={{ width: "100%" }}
              />
              <div
                style={{
                  maxHeight: 120,
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  marginTop: 2,
                }}
              >
                {assigneeLoading ? (
                  <div>Loading...</div>
                ) : (
                  assigneeOptions.map((u, idx) => (
                    <div
                      key={`${u.id}-${idx}`}
                      style={{
                        padding: 4,
                        background:
                          newTask.assignee_id === u.id ? "#e0e0e0" : "#fff",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSelectAssignee(u.id)}
                    >
                      {u.name} ({u.email})
                    </div>
                  ))
                )}
                {assigneeOptions.length === 0 && !assigneeLoading && (
                  <div>No users found</div>
                )}
              </div>
              {newTask.assignee_id && (
                <div style={{ fontSize: 12, color: "#388e3c", marginTop: 2 }}>
                  Selected:{" "}
                  {
                    assigneeOptions.find((u) => u.id === newTask.assignee_id)
                      ?.name
                  }
                </div>
              )}
            </label>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <button type="button" onClick={handleCreateTaskSave}>
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default CreatedTaskListing;
