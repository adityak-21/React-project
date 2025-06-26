import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../common/Loading";
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

import { LoaderRow } from "../common/Loading";
import "../style/MyTaskListing.css";

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
      <Tooltip text="Write creator name">
        <input
          type="text"
          name="created_by"
          placeholder="Search by Creator"
          value={filters.created_by}
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
    </form>
  );
}

function TaskTableRow({ task }) {
  return (
    <TableRow>
      <TableCell>{task.id}</TableCell>
      <TableCell>{task.title}</TableCell>
      <TableCell>{task.description}</TableCell>
      <TableCell>{task.created_by}</TableCell>
      <TableCell>{task.assignee}</TableCell>
      <TableCell>{task.due_date}</TableCell>
      <TableCell>{task.status}</TableCell>
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
      <TableCell>Created By</TableCell>
      <TableCell>Assignee</TableCell>
      <TableCell>Due Date</TableCell>
      <TableCell>Status</TableCell>
      <TableCell>Created At</TableCell>
      <TableCell>Updated At</TableCell>
    </TableRow>
  );
}

const AllTaskListing = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    title: "",
    created_by: "",
    assignee: "",
    from: "",
    to: "",
    status: "",
    pagenumber: 1,
    perpage: 6,
  });
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

  return (
    <div>
      <h2 className="my-task-listing-title">All-Tasks-Listing</h2>
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
      <TaskFilterForm filters={filters} handleInputChange={handleInputChange} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <HeadRow />
          </TableHead>
          <TableBody>
            {taskFetching && <LoaderRow colSpan={8} />}
            {!taskFetching && tasks.length === 0 && <NoTasksRow colSpan={8} />}
            {!taskFetching &&
              tasks.length > 0 &&
              tasks.map((task) => (
                <TaskTableRow task={task} key={`${task.id}`} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default AllTaskListing;
