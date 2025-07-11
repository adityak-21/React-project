import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Button, IconButton } from "@material-ui/core";
import { listUsers } from "../api/UserApi";
import { createTask } from "../api/TaskApi";
import EditIcon from "@material-ui/icons/Edit";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import { LoaderRow } from "../common/Loading";
import "../style/TaskListing.css";

import { Modal } from "../common/Modal";
import TaskViewModal from "../common/TaskViewModal";

import {
  STATUS_OPTIONS,
  SORT_BY_OPTIONS,
  SORT_ORDER_OPTIONS,
  FilterField,
  NoTasksRow,
} from "./TaskListing";

const TABLE_COLUMNS = [
  { label: "Id", key: "id" },
  { label: "Title", key: "title", editable: true },
  { label: "Description", key: "description", editable: true },
  { label: "Assignee", key: "assignee" },
  { label: "Due Date", key: "due_date", editable: true },
  { label: "Status", key: "status", editable: true },
  { label: "Created At", key: "created_at" },
  { label: "Updated At", key: "updated_at" },
];

function TaskFilterForm({ filters, handleInputChange }) {
  return (
    <form className="task-listing-search-form" style={{ marginBottom: "1rem" }}>
      <FilterField
        type="text"
        name="title"
        placeholder="Search by Title"
        value={filters.title}
        onChange={handleInputChange}
        className="search-name"
        tooltip="Write title to search by title"
      />
      <FilterField
        type="text"
        name="assignee"
        placeholder="Search by Assignee"
        value={filters.assignee}
        onChange={handleInputChange}
        className="search-name"
        tooltip="Write assignee name"
      />
      <FilterField
        type="select"
        name="status"
        value={filters.status}
        onChange={handleInputChange}
        className="search-status"
        tooltip="Status of the task"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option value={opt.value} key={opt.value}>
            {opt.label}
          </option>
        ))}
      </FilterField>
      <FilterField
        type="datetime-local"
        name="from"
        value={filters.from}
        onChange={handleInputChange}
        className="search-date"
        tooltip="Due Date from"
      />
      <FilterField
        type="datetime-local"
        name="to"
        value={filters.to}
        onChange={handleInputChange}
        className="search-date"
        tooltip="Due Date to"
      />
      <FilterField
        type="number"
        name="pagenumber"
        min={1}
        step={1}
        value={filters.pagenumber}
        onChange={handleInputChange}
        className="page-number-input"
        tooltip="Page number to display"
      />
      <FilterField
        type="number"
        name="perpage"
        min={1}
        step={1}
        value={filters.perpage}
        onChange={handleInputChange}
        className="per-page-input"
        tooltip="Number of tasks per page"
      />
      <FilterField
        type="select"
        name="sort_by"
        value={filters.sort_by}
        onChange={handleInputChange}
        className="search-status"
        tooltip="Sort By"
      >
        {SORT_BY_OPTIONS.map((opt) => (
          <option value={opt.value} key={opt.value}>
            {opt.label}
          </option>
        ))}
      </FilterField>
      <FilterField
        type="select"
        name="sort_order"
        value={filters.sort_order}
        onChange={handleInputChange}
        className="search-status"
        tooltip="Sort Order"
      >
        {SORT_ORDER_OPTIONS.map((opt) => (
          <option value={opt.value} key={opt.value}>
            {opt.label}
          </option>
        ))}
      </FilterField>
    </form>
  );
}

function TaskDueDateCell({ task, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(
    task.due_date ? task.due_date.substring(0, 16) : ""
  );

  return (
    <td>
      {!editing ? (
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ flex: 1 }}>
            {task.due_date
              ? task.due_date.replace("T", " ").substring(0, 16)
              : "-"}
          </span>
          <IconButton
            size="small"
            className="edit-icon-btn"
            onClick={() => setEditing(true)}
            aria-label="edit-due-date"
          >
            <CalendarTodayIcon fontSize="small" />
          </IconButton>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ minWidth: 180 }}
            autoFocus
          />
          <IconButton
            size="small"
            onClick={() => {
              onSave(task.id, value);
              setEditing(false);
            }}
            aria-label="save-due-date"
          >
            <CheckIcon style={{ color: "#249d5b" }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              setEditing(false);
              setValue(task.due_date ? task.due_date.substring(0, 16) : "");
            }}
            aria-label="cancel-due-date"
          >
            <CloseIcon style={{ color: "#e74c3c" }} />
          </IconButton>
        </div>
      )}
    </td>
  );
}

function TaskTableRow({
  task,
  handleStatusChange,
  handleDueDateChange,
  handleTitleChange,
  handleDescriptionChange,
  onView,
}) {
  return (
    <TableRow>
      <TableCell>{task.id}</TableCell>
      <TableCell>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            className="editable-cell"
            style={{
              cursor: "pointer",
              color: task.description ? "#1976d2" : "#999",
              flex: 1,
            }}
            onClick={() => handleTitleChange(task)}
          >
            {task.title || "No Title"}
          </span>
          <IconButton
            size="small"
            className="edit-icon-btn"
            onClick={() => handleTitleChange(task)}
            aria-label="edit-description"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
      </TableCell>
      <TableCell>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            className="editable-cell"
            style={{
              cursor: "pointer",
              color: task.description ? "#1976d2" : "#999",
              flex: 1,
            }}
            onClick={() => handleDescriptionChange(task)}
          >
            {task.description || "No Description"}
          </span>
          <IconButton
            size="small"
            className="edit-icon-btn"
            onClick={() => handleDescriptionChange(task)}
            aria-label="edit-description"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
      </TableCell>
      <TableCell>{task.assignee}</TableCell>
      <TableCell>
        <TaskDueDateCell task={task} onSave={handleDueDateChange} />
      </TableCell>
      <TableCell>
        {task.status !== "verified" ? (
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task.id, e.target.value)}
            className={`status-select status-${task.status}`}
          >
            <option value={task.status}>{task.status}</option>
            <option value="verified">Verified</option>
          </select>
        ) : (
          <span className="status-badge verified">Verified</span>
        )}
      </TableCell>
      <TableCell>{task.created_at}</TableCell>
      <TableCell>{task.updated_at}</TableCell>
      <TableCell>
        <button
          className="view-task-btn"
          onClick={() => onView(task)}
          title="View Task Details"
        >
          View
        </button>
      </TableCell>
    </TableRow>
  );
}

function HeadRow() {
  return (
    <TableRow>
      {TABLE_COLUMNS.map((col) => (
        <TableCell key={col.key}>{col.label}</TableCell>
      ))}
      <TableCell>View</TableCell>
    </TableRow>
  );
}

const DEFAULT_FILTERS = {
  title: "",
  assignee: "",
  from: "",
  to: "",
  status: "",
  pagenumber: 1,
  perpage: 6,
  sort_by: "",
  sort_order: "",
};

const DEFAULT_NEWTASK = {
  title: "",
  description: "",
  due_date: "",
  assignee_id: "",
};

const CreatedTaskListing = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tasks, setTasks] = useState([]);
  const [taskFetching, setTaskFetching] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState(DEFAULT_NEWTASK);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [assigneeLoading, setAssigneeLoading] = useState(false);
  const debouncedAssigneeSearch = useDebounce(assigneeSearch, 400);
  const [viewTask, setViewTask] = useState(null);
  const userName = useSelector((state) => state.user.userName);

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
    setEditTaskTitle(task.title || "");
    setIsTitleModalOpen(true);
  };

  const handleEditDescription = (task) => {
    setSelectedTaskId(task.id);
    setEditTaskDescription(task.description || "");
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
        setNewTask(DEFAULT_NEWTASK);
        setFilters({ ...filters });
      })
      .catch((err) => {
        alert("Failed to create task");
      });
  };

  const handleViewTask = (task) => {
    setViewTask({
      ...task,
      created_by: userName,
    });
  };

  const handleCloseView = () => {
    setViewTask(null);
  };

  return (
    <div>
      <h2 className="my-task-listing-title">My-Created-Tasks-Listing</h2>
      <div className="create-task-btn-container">
        <Button
          variant="outlined"
          color="default"
          onClick={() => setIsCreateModalOpen(true)}
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
            {taskFetching && <LoaderRow colSpan={TABLE_COLUMNS.length + 1} />}
            {!taskFetching && tasks.length === 0 && (
              <NoTasksRow colSpan={TABLE_COLUMNS.length + 1} />
            )}
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
                  onView={handleViewTask}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={isTitleModalOpen} onClose={() => setIsTitleModalOpen(false)}>
        <div className="common-modal">
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
        </div>
      </Modal>
      <Modal
        open={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
      >
        <div className="common-modal">
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
        </div>
      </Modal>
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <div className="common-modal">
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
        </div>
      </Modal>
      <TaskViewModal
        open={!!viewTask}
        task={viewTask}
        onClose={handleCloseView}
      />
    </div>
  );
};
export default CreatedTaskListing;
