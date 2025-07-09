import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../common/Debounce";
import { listMyTasks } from "../api/TaskApi";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Tooltip } from "../common/Tooltip";
import { updateTaskStatus } from "../api/TaskApi";
import { useLocation } from "react-router-dom";

import { LoaderRow } from "../common/Loading";
import "../style/TaskListing.css";

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
  { label: "Title", key: "title" },
  { label: "Description", key: "description" },
  { label: "Created By", key: "created_by" },
  { label: "Due Date", key: "due_date" },
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
        name="created_by"
        placeholder="Search by Creator"
        value={filters.created_by}
        onChange={handleInputChange}
        className="search-name"
        tooltip="Write creator name"
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

function TaskTableRow({ task, handleStatusChange, onView }) {
  return (
    <TableRow>
      {TABLE_COLUMNS.map((col) =>
        col.key === "status" ? (
          <TableCell key={col.key}>
            {task.status !== "verified" ? (
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className={`status-select status-${task.status}`}
              >
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            ) : (
              <span className="status-badge verified">Verified</span>
            )}
          </TableCell>
        ) : (
          <TableCell key={col.key}>{task[col.key]}</TableCell>
        )
      )}
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
  created_by: "",
  from: "",
  to: "",
  status: "",
  pagenumber: 1,
  perpage: 6,
  sort_by: "",
  sort_order: "",
};

const MyTaskListing = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const getStatusFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("status") || "";
  };
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tasks, setTasks] = useState([]);
  const [taskFetching, setTaskFetching] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [viewTask, setViewTask] = useState(null);
  const userName = useSelector((state) => state.user.userName);

  useEffect(() => {
    const urlStatus = getStatusFromQuery();
    setFilters((prev) => ({
      ...prev,
      status: urlStatus,
      pagenumber: 1,
    }));
  }, [location.search]);

  const debouncedFilters = useDebounce(filters, 500);
  useEffect(() => {
    setTaskFetching(true);
    listMyTasks(debouncedFilters)
      .then((response) => {
        setTasks(response.data.tasks);
        setTaskFetching(false);
      })
      .catch((error) => {
        console.error("Failed to fetch tasks:", error);
        setTaskFetching(false);
      });
  }, [debouncedFilters]);

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

  const handleViewTask = (task) => {
    setViewTask({
      ...task,
      assignee: userName,
    });
  };

  const handleCloseView = () => {
    setViewTask(null);
  };

  return (
    <div>
      <h2 className="my-task-listing-title">My-Tasks-Listing</h2>
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
                  onView={handleViewTask}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TaskViewModal
        open={!!viewTask}
        task={viewTask}
        onClose={handleCloseView}
      />
    </div>
  );
};
export default MyTaskListing;
