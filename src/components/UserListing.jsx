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
import "../style/UserListing.css";
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
import RegisterModal from "../common/RegisterModal";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import { updateUserName } from "../api/UserApi";
import { listRoles, assignUserRoles, removeUserRole } from "../api/RoleApi";
import CloseIcon from "@material-ui/icons/Close";

/**
 * debounce                                             done
 * Modal implement replace Swal
 * shift isAdmin to login page and redux store          done
 * Download with all users in the sepcified filters     done
 * sql injection
 * <div>link</div>
 * in-secure html
 *
 * shift isAdmin to login time so only one time loading
 */

const TABLE_COLUMNS = [
  { label: "Id", key: "id" },
  { label: "Name", key: "name", editable: true },
  { label: "Email", key: "email" },
  { label: "Role", key: "roles" },
  { label: "Created By", key: "created_by" },
  { label: "Created At", key: "created_at" },
  { label: "Updated At", key: "updated_at" },
];

function FilterField({ tooltip, ...rest }) {
  return (
    <Tooltip text={tooltip}>
      <input {...rest} />
    </Tooltip>
  );
}
function UserFilterForm({ filters, handleInputChange }) {
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
        type="text"
        name="email"
        placeholder="Search by Full Email"
        value={filters.email}
        onChange={handleInputChange}
        className="search-email"
        tooltip="Write full email to search by email"
      />
      <FilterField
        type="text"
        name="role"
        placeholder="Search by Role"
        value={filters.role}
        onChange={handleInputChange}
        className="search-role"
        tooltip="Write role to search by role"
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

function UserTableRow({
  user,
  isAdmin,
  checked,
  onCheck,
  onDelete,
  onEdit,
  onEditRoles,
  onRemoveRole,
}) {
  return (
    <TableRow>
      {isAdmin && (
        <TableCell padding="checkbox">
          <Checkbox checked={checked} onChange={() => onCheck(user.id)} />
        </TableCell>
      )}
      <TableCell>{user.id}</TableCell>
      <TableCell>
        <span>{user.name}</span>
        {isAdmin && (
          <IconButton
            size="small"
            style={{ marginLeft: 6 }}
            onClick={() => onEdit(user)}
            aria-label="Edit Name"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      {/* <TableCell>{user.role}</TableCell> */}
      <TableCell>
        {user.roles && user.roles.length > 0 ? (
          user.roles.map((role) => (
            <span key={role.id} style={{ marginRight: 6 }}>
              {role.name}
              {isAdmin && (
                <IconButton
                  size="small"
                  onClick={() => onRemoveRole(user.id, role.id)}
                  style={{ marginLeft: 2 }}
                  aria-label="Remove Role"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </span>
          ))
        ) : (
          <em>No roles</em>
        )}
        {isAdmin && (
          <Button
            size="small"
            variant="outlined"
            style={{ marginLeft: 8 }}
            onClick={() => onEditRoles(user)}
          >
            Edit Roles
          </Button>
        )}
      </TableCell>
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
      {TABLE_COLUMNS.map((col) => (
        <TableCell key={col.key}>{col.label}</TableCell>
      ))}
      {isAdmin && <TableCell>Action</TableCell>}
    </TableRow>
  );
}

function uniqueUsersById(users) {
  const seen = new Set();
  return users.filter((user) => {
    if (seen.has(user.id)) return false;
    seen.add(user.id);
    return true;
  });
}

const DEFAULT_FILTERS = {
  name: "",
  email: "",
  role: "",
  pagenumber: 1,
  perpage: 6,
};

const UserListing = () => {
  const dispatch = useDispatch();
  const { isAdmin, viewAsAdmin, verifying } = useSelector(
    (state) => state.admin
  );
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [users, setUsers] = useState([]);
  const [userFetching, setUserFetching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState("");
  const debouncedFilters = useDebounce(filters, 500);
  const [allRoles, setAllRoles] = useState([]);
  const [editRolesUser, setEditRolesUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [savingRoles, setSavingRoles] = useState(false);

  //useEffect
  // first time render - componentDidMount
  // when props changes - componentDidUpdate
  // when the componets unmounts - componentWillUnmount
  useEffect(() => {
    setUserFetching(true);

    listUsers(debouncedFilters)
      .then((res) => {
        console.log(res.data);
        const unique = uniqueUsersById(res.data.users);
        setUsers(unique);
        setUserFetching(false);
        listRoles().then((res) => {
          console.log("Roles fetched:", res.data.roles);
          setAllRoles(res.data.roles || []);
        });
      })
      .catch((err) => {
        console.error(err);
        setUserFetching(false);
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

  const handleDownloadCSV = () => {
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

  const openEditName = (user) => {
    setEditUser(user);
    setEditName(user.name);
  };
  const closeEditName = () => {
    setEditUser(null);
    setEditName("");
  };

  const openEditRoles = (user) => {
    setEditRolesUser(user);
    setSelectedRoles(user.roles ? user.roles.map((r) => r.id) : []);
  };
  const closeEditRoles = () => {
    setEditRolesUser(null);
    setSelectedRoles([]);
  };

  const handleSaveName = () => {
    updateUserName(editUser.id, editName)
      .then((res) => {
        setUsers((prev) =>
          prev.map((u) => (u.id === editUser.id ? { ...u, name: editName } : u))
        );
        closeEditName();
        Swal.fire("Success", "Name updated!", "success");
      })
      .catch(() => {
        Swal.fire("Error", "Failed to update name", "error");
      });
  };

  const handleSaveRoles = () => {
    setSavingRoles(true);
    assignUserRoles(editRolesUser.id, selectedRoles)
      .then(() => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editRolesUser.id
              ? {
                  ...u,
                  roles: allRoles.filter((r) => selectedRoles.includes(r.id)),
                }
              : u
          )
        );
        closeEditRoles();
        Swal.fire("Success", "Roles updated!", "success");
      })
      .catch(() => {
        Swal.fire("Error", "Failed to update roles", "error");
      })
      .finally(() => setSavingRoles(false));
  };

  const handleRemoveRole = (userId, roleId) => {
    console.log("Removing role", roleId, "from user", userId);
    removeUserRole(userId, roleId)
      .then(() => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, roles: u.roles.filter((r) => r.id !== roleId) }
              : u
          )
        );
        Swal.fire("Success", "Role removed", "success");
      })
      .catch(() => Swal.fire("Error", "Failed to remove role", "error"));
  };

  const allChecked = users.length > 0 && selectedUsers.length === users.length;
  //why inline style is avoided ?
  return (
    <div>
      <h2 className="user-listing-title">User-Listing</h2>
      {viewAsAdmin && (
        <div className="admin-toggle-topright">
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
      <div className="action-bar">
        {isAdmin && (
          <div>
            <RegisterModal
              trigger={({ onClick }) => (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onClick}
                  style={{ marginRight: "1rem" }}
                >
                  Create User
                </Button>
              )}
            />
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
        <div className="csv-download-container">
          <Button
            variant="outlined"
            color="default"
            onClick={handleDownloadCSV}
            style={{ marginRight: "1rem" }}
          >
            Download CSV
          </Button>
        </div>
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
                  onEdit={openEditName}
                  onEditRoles={openEditRoles}
                  onRemoveRole={handleRemoveRole}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isAdmin && editUser && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Edit Name</h3>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{ width: "100%", marginBottom: 12 }}
              maxLength={100}
              autoFocus
            />
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveName}
                style={{ marginRight: 8 }}
                disabled={editName.trim() === ""}
              >
                Save
              </Button>
              <Button variant="outlined" onClick={closeEditName}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {isAdmin && editRolesUser && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Edit Roles for {editRolesUser.name}</h3>
            <div style={{ marginBottom: 12, width: "300px" }}>
              <select
                multiple
                value={selectedRoles}
                onChange={(e) =>
                  setSelectedRoles(
                    Array.from(e.target.selectedOptions, (opt) =>
                      Number(opt.value)
                    )
                  )
                }
                style={{ width: "100%", minHeight: "100px" }}
              >
                {allRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveRoles}
                style={{ marginRight: 8 }}
                disabled={savingRoles}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={closeEditRoles}
                disabled={savingRoles}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserListing;
