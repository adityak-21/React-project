import React, { useHistory, useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import "../style/Dashboard.css";
import Swal from "sweetalert2";
import { listUsers } from "../api/UserApi";
import { Tooltip } from "../common/Tooltip";
import { LoaderRow } from "../common/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../common/Debounce";
import {
  setAdmin,
  setViewAsAdmin,
  verifyAdminStatus,
} from "../redux/verifyAdmin";
import { verifyAdmin } from "../api/AuthApi";
import { deleteUsers } from "../api/UserApi";
/**
 * debounce                                             done
 * Modal implement replace Swal
 * shift isAdmin to login page and redux store          done
 * Download with all users in the sepcified filters     done
 * sql injection
 * <div>link</div>
 * in-secure html
 */

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

function UserTableRow({ user, isAdmin, checked, onCheck, onDelete }) {
  return (
    <TableRow>
      {isAdmin && (
        <TableCell padding="checkbox">
          <Checkbox checked={checked} onChange={() => onCheck(user.id)} />
        </TableCell>
      )}
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>{user.created_by}</TableCell>
      <TableCell>{user.created_at}</TableCell>
      <TableCell>{user.updated_at}</TableCell>
      {isAdmin && (
        <TableCell>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => onDelete([user.id])}
          >
            Delete
          </Button>
        </TableCell>
      )}
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

function HeadRow({ isAdmin, allChecked, onCheckAll }) {
  return (
    <TableRow>
      {isAdmin && (
        <TableCell padding="checkbox">
          <Checkbox checked={allChecked} onChange={onCheckAll} />
        </TableCell>
      )}
      <TableCell>Id</TableCell>
      <TableCell>Name</TableCell>
      <TableCell>Email</TableCell>
      <TableCell>Role</TableCell>
      <TableCell>Created By</TableCell>
      <TableCell>Created At</TableCell>
      <TableCell>Updated At</TableCell>
      {isAdmin && <TableCell>Action</TableCell>}
    </TableRow>
  );
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isAdmin, viewAsAdmin, verifying } = useSelector(
    (state) => state.admin
  );
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
    pagenumber: 1,
    perpage: 6,
  });
  const [users, setUsers] = useState([]);
  //   const [isAdmin, setIsAdmin] = useState(false);
  //   const [viewAsAdmin, setViewAsAdmin] = useState(false);
  const [userFetching, setUserFetching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const debouncedFilters = useDebounce(filters, 3000);

  //useEffect
  // first time render - componentDidMount
  // when props changes - componentDidUpdate
  // when the componets unmounts - componentWillUnmount
  useEffect(() => {
    setUserFetching(true);

    listUsers(debouncedFilters)
      .then((res) => {
        console.log(res.data);
        setUsers(res.data.users);
        setUserFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setUserFetching(false);
      });

    // verifyAdmin()
    //   .then((res) => {
    //     setIsAdmin(true);
    //     setViewAsAdmin(true);
    //   })
    //   .catch((err) => {
    //     setIsAdmin(false);
    //     setViewAsAdmin(false);
    //   });

    dispatch(verifyAdminStatus(verifyAdmin));
  }, [debouncedFilters]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
      ...(name !== "pagenumber" && name !== "perpage" && { pagenumber: 1 }),
    }));
  };

  const handleCheck = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCheckAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  const handleDelete = (userIds) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${userIds.length} user(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUsers(userIds)
          .then(() => {
            setUsers((prev) => prev.filter((u) => !userIds.includes(u.id)));
            setSelectedUsers((prev) =>
              prev.filter((id) => !userIds.includes(id))
            );
            Swal.fire("Deleted!", "User(s) deleted.", "success");
          })
          .catch((err) => {
            Swal.fire("Error", "Failed to delete users", "error");
          });
      }
    });
  };

  const handleCreateUser = () => {
    Swal.fire("Not Implemented", "Show create user form here", "info");
  };

  const handleDownloadCSV = () => {
    // Swal.fire("Not Implemented", "Download CSV with current filters", "info");
    const allFilters = { ...filters, pagenumber: 1, perpage: 10000 };
    listUsers(allFilters)
      .then((res) => {
        const allUsers = res.data.users;
        // stream
        // batch processing
        // yeild
        // how to handle bulky apis
        const csvContent = [
          "Id,Name,Email,Role,Created By,Created At,Updated At",
          ...allUsers.map(
            (user) =>
              `${user.id},${user.name},${user.email},${user.role},${user.created_by},${user.created_at},${user.updated_at}`
          ),
        ].join("\n");
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "users.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Swal.fire("Success", "CSV downloaded successfully", "success");
      })
      .catch((err) => {
        console.error("Failed to download CSV:", err);
        Swal.fire("Error", "Failed to download CSV", "error");
      });
  };

  const allChecked = users.length > 0 && selectedUsers.length === users.length;
  //why inline style is avoided ?
  return (
    <div>
      <h2 className="user-listing-title">User-Listing</h2>
      {viewAsAdmin && (
        <div style={{ marginBottom: "1rem" }}>
          <Button
            variant={isAdmin ? "contained" : "outlined"}
            color="primary"
            onClick={() => dispatch(setAdmin(true))}
            style={{ marginRight: 8 }}
          >
            Admin
          </Button>
          <Button
            variant={!isAdmin ? "contained" : "outlined"}
            color="secondary"
            onClick={() => dispatch(setAdmin(false))}
          >
            User
          </Button>
        </div>
      )}
      {isAdmin && (
        <div style={{ marginBottom: "1rem" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateUser}
            style={{ marginRight: "1rem" }}
          >
            Create User
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={selectedUsers.length === 0}
            onClick={() => handleDelete(selectedUsers)}
          >
            Delete Selected
          </Button>
        </div>
      )}
      <div style={{ marginBottom: "1rem" }}>
        <Button
          variant="outlined"
          color="default"
          onClick={handleDownloadCSV}
          style={{ marginRight: "1rem" }}
        >
          Download CSV
        </Button>
      </div>
      <UserFilterForm filters={filters} handleInputChange={handleInputChange} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <HeadRow
              isAdmin={isAdmin}
              allChecked={allChecked}
              onCheckAll={handleCheckAll}
            />
          </TableHead>
          <TableBody>
            {userFetching && <LoaderRow colSpan={isAdmin ? 9 : 7} />}
            {!userFetching && users.length === 0 && (
              <NoUsersRow colSpan={isAdmin ? 9 : 7} />
            )}
            {!userFetching &&
              users.length > 0 &&
              users.map((user) => (
                <UserTableRow
                  user={user}
                  key={`${user.id}-${user.role}`}
                  isAdmin={isAdmin}
                  checked={selectedUsers.includes(user.id)}
                  onCheck={handleCheck}
                  onDelete={handleDelete}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default Dashboard;
