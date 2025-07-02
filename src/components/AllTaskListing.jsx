import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../common/Debounce";
import { listAllTasks } from "../api/TaskApi";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Tooltip } from "../common/Tooltip";
import { Button } from "@material-ui/core";
import { deleteTask } from "../api/TaskApi";
import Swal from "sweetalert2";

import { LoaderRow } from "../common/Loading";
import "../style/MyTaskListing.css";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "verified", label: "Verified" },
];

const SORT_BY_OPTIONS = [
  { value: "", label: "Default" },
  { value: "title", label: "Title" },
  { value: "due_date", label: "Due Date" },
  { value: "status", label: "Status" },
];

const SORT_ORDER_OPTIONS = [
  { value: "", label: "Default" },
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

const TABLE_COLUMNS = [
  { label: "Id", key: "id" },
  { label: "Title", key: "title" },
  { label: "Description", key: "description" },
  { label: "Created By", key: "created_by" },
  { label: "Assignee", key: "assignee" },
  { label: "Due Date", key: "due_date" },
  { label: "Status", key: "status" },
  { label: "Created At", key: "created_at" },
  { label: "Updated At", key: "updated_at" },
];

const DEFAULT_FILTERS = {
  title: "",
  created_by: "",
  assignee: "",
  from: "",
  to: "",
  status: "",
  pagenumber: 1,
  perpage: 6,
  sort_by: "",
  sort_order: "",
};

function FilterField({ label, tooltip, ...rest }) {
  return (
    <Tooltip text={tooltip}>
      {rest.type === "select" ? (
        <select {...rest}>{rest.children}</select>
      ) : (
        <input {...rest} />
      )}
    </Tooltip>
  );
}

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

function TaskTableRow({ task, onDelete }) {
  return (
    <TableRow>
      {TABLE_COLUMNS.map((col) => (
        <TableCell key={col.key}>{task[col.key]}</TableCell>
      ))}
      <TableCell>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => onDelete([task.id])}
        >
          Delete
        </Button>
      </TableCell>
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
      {TABLE_COLUMNS.map((col) => (
        <TableCell key={col.key}>{col.label}</TableCell>
      ))}
      <TableCell>Actions</TableCell>
    </TableRow>
  );
}

const AllTaskListing = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tasks, setTasks] = useState([]);
  const [taskFetching, setTaskFetching] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const debouncedFilters = useDebounce(filters, 500);
  useEffect(() => {
    setTaskFetching(true);
    listAllTasks(debouncedFilters)
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

  const handleDelete = (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(taskId)
          .then(() => {
            setTasks((prevTasks) =>
              prevTasks.filter((task) => !taskId.includes(task.id))
            );
            Swal.fire("Deleted!", "Your task has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Failed to delete task:", error);
            Swal.fire("Error!", "Failed to delete the task.", "error");
          });
      }
    });
  };

  return (
    <div>
      <h2 className="my-task-listing-title">All-Tasks-Listing</h2>
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
                  onDelete={handleDelete}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default AllTaskListing;
