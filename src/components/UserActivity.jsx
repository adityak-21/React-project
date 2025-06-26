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

function ActivityFilterForm({ filters, handleInputChange }) {
  return (
    <form className="user-listing-search-form" style={{ marginBottom: "1rem" }}>
      <Tooltip text="Write name to search by name">
        <input
          type="text"
          name="name"
          placeholder="Search by Name"
          value={filters.name}
          onChange={handleInputChange}
          className="search-name"
        />
      </Tooltip>
      <Tooltip text="Activity from (login time)">
        <input
          type="datetime-local"
          name="from"
          //   placeholder="Search by Full Email"
          value={filters.from}
          onChange={handleInputChange}
          className="search-date"
        />
      </Tooltip>
      <Tooltip text="Activity to (logout time)">
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
      <Tooltip text="Number of users per page">
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

function ActivityTableRow({ activity }) {
  return (
    <TableRow>
      <TableCell>{activity.user_id}</TableCell>
      <TableCell>{activity.user_name}</TableCell>
      <TableCell>{activity.login_time}</TableCell>
      <TableCell>{activity.logout_time}</TableCell>
      <TableCell>{activity.duration}</TableCell>
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
      <TableCell>Id</TableCell>
      <TableCell>Name</TableCell>
      <TableCell>Login_time</TableCell>
      <TableCell>Logout_time</TableCell>
      <TableCell>Duration</TableCell>
    </TableRow>
  );
}

const ListUserActivity = () => {
  const [filters, setFilters] = React.useState({
    name: "",
    from: "",
    to: "",
    pagenumber: 1,
    perpage: 6,
  });
  const [activities, setActivities] = React.useState([]);
  const [activityFetching, setActivityFetching] = React.useState(false);

  //useEffect
  // first time render - componentDidMount
  // when props changes - componentDidUpdate
  // when the componets unmounts - componentWillUnmount
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
  }, [filters]);

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
