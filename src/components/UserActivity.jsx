import React, { useHistory } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "../style/UserActivity.css";
import Swal from "sweetalert2";
import { listUserActivities } from "../api/UserApi";
import { Tooltip } from "../common/Tooltip";
import { LoaderRow } from "../common/Loading";
import { useDebounce } from "../common/Debounce";

const TABLE_COLUMNS = [
  { label: "Id", key: "user_id" },
  { label: "Name", key: "user_name" },
  { label: "Login Time", key: "login_time" },
  { label: "Logout Time", key: "logout_time" },
  { label: "Duration", key: "duration" },
];

function FilterField({ tooltip, ...rest }) {
  return (
    <Tooltip text={tooltip}>
      <input {...rest} />
    </Tooltip>
  );
}

function ActivityFilterForm({ filters, handleInputChange }) {
  return (
    <form className="user-listing-search-form" style={{ marginBottom: "1rem" }}>
      <FilterField
        type="text"
        name="name"
        placeholder="Search by Name"
        value={filters.name}
        onChange={handleInputChange}
        className="search-name"
        tooltip="Write name to search by name"
      />
      <FilterField
        type="datetime-local"
        name="from"
        value={filters.from}
        onChange={handleInputChange}
        className="search-date"
        tooltip="Activity from (login time)"
      />
      <FilterField
        type="datetime-local"
        name="to"
        value={filters.to}
        onChange={handleInputChange}
        className="search-date"
        tooltip="Activity to (logout time)"
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
        tooltip="Number of users per page"
      />
    </form>
  );
}

function ActivityTableRow({ activity }) {
  return (
    <TableRow>
      {TABLE_COLUMNS.map((col) => (
        <TableCell key={col.key}>{activity[col.key]}</TableCell>
      ))}
    </TableRow>
  );
}

function NoUsersRow({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} style={{ textAlign: "center" }}>
        No users found
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
    </TableRow>
  );
}

const DEFAULT_FILTERS = {
  name: "",
  from: "",
  to: "",
  pagenumber: 1,
  perpage: 6,
};

const ListUserActivity = () => {
  const [filters, setFilters] = React.useState(DEFAULT_FILTERS);
  const [activities, setActivities] = React.useState([]);
  const [activityFetching, setActivityFetching] = React.useState(false);

  //useEffect
  // first time render - componentDidMount
  // when props changes - componentDidUpdate
  // when the componets unmounts - componentWillUnmount

  const debouncedFilters = useDebounce(filters, 500);

  React.useEffect(() => {
    setActivityFetching(true);

    listUserActivities(filters)
      .then((res) => {
        console.log(res.data);
        setActivities(res.data);
        setActivityFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setActivityFetching(false);
      });
  }, [debouncedFilters]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : type === "date"
          ? new Date(value)
          : value,
      ...(name !== "pagenumber" && name !== "perpage" && { pagenumber: 1 }),
    }));
  };
  //why inline style is avoided ?
  return (
    <div>
      <h2 className="activity-listing-title">Activities-Listing</h2>
      <ActivityFilterForm
        filters={filters}
        handleInputChange={handleInputChange}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <HeadRow />
          </TableHead>
          <TableBody>
            {activityFetching && <LoaderRow colSpan={7} />}
            {!activityFetching && activities.length === 0 && (
              <NoUsersRow colSpan={7} />
            )}
            {!activityFetching &&
              activities.length > 0 &&
              activities.map((activity) => (
                <ActivityTableRow
                  activity={activity}
                  key={`${activity.user_id}-${activity.login_time}`}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default ListUserActivity;
