import React, { useHistory } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "../style/Dashboard.css";
import Swal from "sweetalert2";
import { listUsers } from "../api/UserApi";
import { Tooltip } from "../common/Tooltip";
import { LoaderRow } from "../common/Loading";

function UserFilterForm({ filters, handleInputChange }) {
  return (
    <form className="dashboard-search-form" style={{ marginBottom: "1rem" }}>
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
      <Tooltip text="Write full email to search by email">
        <input
          type="text"
          name="email"
          placeholder="Search by Full Email"
          value={filters.email}
          onChange={handleInputChange}
          className="search-email"
        />
      </Tooltip>
      <Tooltip text="Write role to search by role">
        <input
          type="text"
          name="role"
          placeholder="Search by Role"
          value={filters.role}
          onChange={handleInputChange}
          className="search-role"
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

function UserTableRow({ user }) {
  return (
    <TableRow>
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>{user.created_by}</TableCell>
      <TableCell>{user.created_at}</TableCell>
      <TableCell>{user.updated_at}</TableCell>
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
      <TableCell>Email</TableCell>
      <TableCell>Role</TableCell>
      <TableCell>Created By</TableCell>
      <TableCell>Created At</TableCell>
      <TableCell>Updated At</TableCell>
    </TableRow>
  );
}

const Dashboard = () => {
  const [filters, setFilters] = React.useState({
    name: "",
    email: "",
    role: "",
    pagenumber: 1,
    perpage: 6,
  });
  const [users, setUsers] = React.useState([]);
  const [userFetching, setUserFetching] = React.useState(false);

  //useEffect
  // first time render - componentDidMount
  // when props changes - componentDidUpdate
  // when the componets unmounts - componentWillUnmount
  React.useEffect(() => {
    setUserFetching(true);

    listUsers(filters)
      .then((res) => {
        console.log(res.data);
        setUsers(res.data.users);
        setUserFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setUserFetching(false);
      });
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
      ...(name !== "pagenumber" && name !== "perpage" && { pagenumber: 1 }),
    }));
  };
  //why inline style is avoided ?
  return (
    <div>
      <h2 className="user-listing-title">User-Listing</h2>
      <UserFilterForm filters={filters} handleInputChange={handleInputChange} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <HeadRow />
          </TableHead>
          <TableBody>
            {userFetching && <LoaderRow colSpan={7} />}
            {!userFetching && users.length === 0 && <NoUsersRow colSpan={7} />}
            {!userFetching &&
              users.length > 0 &&
              users.map((user) => (
                <UserTableRow user={user} key={`${user.id}-${user.role}`} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default Dashboard;
