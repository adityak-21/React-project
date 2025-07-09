import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Avatar from "@material-ui/core/Avatar";
import {
  Button,
  Checkbox,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Chip,
  InputLabel,
  FormControl,
  OutlinedInput,
  Box,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import { listUsers, deleteUsers, updateUserName } from "../api/UserApi";
import { useDebounce } from "../common/Debounce";
import "../style/CardUserListing.css";
import { Tooltip } from "../common/Tooltip";
import { getRecentActivities } from "../api/UserApi";
import { useDispatch, useSelector } from "react-redux";
import { DownloadCSV } from "../common/DownloadCSV";
import Swal from "sweetalert2";
import RegisterModal from "../common/RegisterModal";
import {
  listRoles,
  assignUserRoles,
  removeUserRole,
  changeRoles,
} from "../api/RoleApi";
import { setAdmin } from "../redux/verifyAdmin";

const DEFAULT_FILTERS = {
  name: "",
  email: "",
  role: "",
  pagenumber: 1,
  perpage: 6,
};

function uniqueUsersById(users) {
  const seen = new Set();
  return users.filter((user) => {
    if (seen.has(user.id)) return false;
    seen.add(user.id);
    return true;
  });
}

function FilterField({ tooltip, ...rest }) {
  return (
    <Tooltip text={tooltip}>
      <input {...rest} />
    </Tooltip>
  );
}

function UserFilterForm({ filters, handleInputChange, handleDownloadCSV }) {
  return (
    <form className="user-listing-search-form">
      <FilterField
        tooltip="Search users by their name"
        type="text"
        name="name"
        placeholder="Search by Name"
        value={filters.name}
        onChange={handleInputChange}
        className="search-name"
      />
      <FilterField
        tooltip="Search users by their full email address"
        type="text"
        name="email"
        placeholder="Search by Full Email"
        value={filters.email}
        onChange={handleInputChange}
        className="search-email"
      />
      <FilterField
        tooltip="Search users by their role"
        type="text"
        name="role"
        placeholder="Search by Role"
        value={filters.role}
        onChange={handleInputChange}
        className="search-role"
      />
      <FilterField
        tooltip="Page number to display"
        type="number"
        name="pagenumber"
        min={1}
        step={1}
        value={filters.pagenumber}
        onChange={handleInputChange}
        className="page-number-input"
      />
      <FilterField
        tooltip="Number of users to display per page"
        type="number"
        name="perpage"
        min={1}
        step={1}
        value={filters.perpage}
        onChange={handleInputChange}
        className="per-page-input"
      />
      <Tooltip text="Download all users as CSV">
        <Button
          variant="contained"
          color="primary"
          startIcon={<GetAppIcon />}
          onClick={(e) => {
            e.preventDefault();
            handleDownloadCSV();
          }}
        >
          Download CSV
        </Button>
      </Tooltip>
    </form>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function UserCard({ user, isAdmin, checked, onCheck, onClick }) {
  return (
    <Card className="user-card-modern" onClick={onClick} tabIndex={0}>
      {isAdmin && (
        <Checkbox
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            onCheck(user.id);
          }}
          onClick={(e) => e.stopPropagation()}
          style={{ position: "absolute", left: 8, top: 8, zIndex: 2 }}
          color="primary"
        />
      )}
      <div className="user-card-modern-avatar">
        <Avatar>{getInitials(user.name)}</Avatar>
      </div>
      <CardContent style={{ flex: 1, width: "100%" }}>
        <Typography variant="h6" className="user-card-modern-title">
          {user.name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className="user-card-modern-email"
        >
          {user.email}
        </Typography>
        <Typography variant="body2" className="user-card-modern-role">
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((r) => r.name || r.role).join(", ")
          ) : (
            <span style={{ color: "#bbb" }}>No role</span>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}

const UserModal = ({
  open,
  user,
  onClose,
  isAdmin,
  allRoles,
  onNameSave,
  onRolesSave,
  onDelete,
  loadingRoles,
}) => {
  const [editName, setEditName] = useState("");
  const [editingName, setEditingName] = useState(false);

  const [editRoles, setEditRoles] = useState([]);
  const [editingRoles, setEditingRoles] = useState(false);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditRoles(user.roles ? user.roles.map((r) => r.id) : []);
      setEditingName(false);
      setEditingRoles(false);
    }
  }, [user]);

  useEffect(() => {
    if (open && user && isAdmin) {
      setLoading(true);
      getRecentActivities(user.id).then((res) => {
        setActivities(res.data || []);
        setLoading(false);
      });
    } else {
      setActivities([]);
    }
  }, [open, user, isAdmin]);
  if (!user) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-content user-modal" sx={{ outline: "none" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Avatar
            style={{
              width: 70,
              height: 70,
              fontSize: 30,
              background: "#3949ab",
            }}
          >
            {getInitials(user.name)}
          </Avatar>
        </div>
        <div style={{ marginBottom: 18, textAlign: "center" }}>
          {isAdmin && editingName ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
            >
              <TextField
                variant="outlined"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                size="small"
                autoFocus
                inputProps={{
                  maxLength: 100,
                  style: {
                    fontWeight: 700,
                    fontSize: "1.35rem",
                    textAlign: "center",
                  },
                }}
                style={{ width: 200 }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  onNameSave(user, editName, () => setEditingName(false));
                }}
                disabled={editName.trim() === ""}
                style={{ marginLeft: 8 }}
              >
                Save
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setEditingName(false);
                  setEditName(user.name);
                }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Typography
              variant="h5"
              style={{
                fontWeight: 700,
                color: "#23395d",
                letterSpacing: "0.5px",
                marginBottom: 0,
              }}
            >
              {user.name}
              {isAdmin && (
                <Button
                  style={{ marginLeft: 10, padding: "2px 10px" }}
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => setEditingName(true)}
                >
                  Edit
                </Button>
              )}
            </Typography>
          )}
        </div>
        <div
          className="user-modal-info"
          style={{ textAlign: "center", marginBottom: 18 }}
        >
          <span style={{ color: "#556080", fontWeight: 500 }}>
            {user.email}
          </span>
        </div>
        <div style={{ marginBottom: 16 }}>
          <InputLabel
            style={{ color: "#23395d", fontWeight: 700, marginBottom: 4 }}
          >
            Roles
          </InputLabel>
          {isAdmin && editingRoles ? (
            <Box display="flex" alignItems="center" gap={2}>
              <FormControl sx={{ minWidth: 180, maxWidth: 270 }} size="small">
                <Select
                  multiple
                  value={editRoles}
                  onChange={(e) =>
                    setEditRoles(
                      typeof e.target.value === "string"
                        ? e.target.value.split(",").map(Number)
                        : e.target.value
                    )
                  }
                  input={<OutlinedInput label="Roles" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((id) => {
                        const role = allRoles.find((r) => r.id === id);
                        return (
                          <Chip
                            key={id}
                            label={role ? role.name || role.role : id}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {allRoles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      <Checkbox checked={editRoles.indexOf(role.id) > -1} />
                      {role.name || role.role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ minWidth: 64 }}
                onClick={() => {
                  onRolesSave(user, editRoles, () => setEditingRoles(false));
                }}
                disabled={loadingRoles}
              >
                Save
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setEditingRoles(false);
                  setEditRoles(user.roles ? user.roles.map((r) => r.id) : []);
                }}
                disabled={loadingRoles}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <Chip
                    key={role.id}
                    label={role.name || role.role}
                    color="primary"
                    variant="outlined"
                    size="small"
                    style={{ fontSize: "1.01rem" }}
                  />
                ))
              ) : (
                <span style={{ color: "#bbb" }}>No roles</span>
              )}
              {isAdmin && (
                <Button
                  style={{ marginLeft: 10 }}
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => setEditingRoles(true)}
                >
                  Edit
                </Button>
              )}
            </Box>
          )}
        </div>
        <div style={{ marginBottom: 8, fontSize: "1.01rem", color: "#3949ab" }}>
          <div className="user-modal-info">
            <b>Id:</b> {user.id}
          </div>
          <div className="user-modal-info">
            <b>Created By:</b> {user.created_by}
          </div>
          <div className="user-modal-info">
            <b>Created At:</b> {user.created_at}
          </div>
          <div className="user-modal-info">
            <b>Updated At:</b> {user.updated_at}
          </div>
        </div>
        {isAdmin && (
          <div className="user-modal-activities">
            <h4>Recent Login Activities</h4>
            {loading ? (
              <div>Loading...</div>
            ) : activities.length === 0 ? (
              <div className="user-modal-activity-empty">
                No recent activity
              </div>
            ) : (
              <div className="activity-timeline">
                {activities.map((a) => (
                  <div key={a.id} className="activity-item">
                    <div className="activity-dot" />
                    <div className="activity-main">
                      <div>
                        <span className="act-label">Login:</span>{" "}
                        <span>
                          {a.login_time
                            ? new Date(a.login_time).toLocaleString()
                            : "-"}
                        </span>
                      </div>
                      <div>
                        <span className="act-label">Logout:</span>{" "}
                        <span>
                          {a.logout_time
                            ? new Date(a.logout_time).toLocaleString()
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {isAdmin && (
          <div style={{ marginTop: 26, textAlign: "center" }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={() => onDelete([user.id])}
            >
              Delete User
            </Button>
          </div>
        )}
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </Box>
    </Modal>
  );
};

const CardUserListing = () => {
  const dispatch = useDispatch();
  const { isAdmin, viewAsAdmin } = useSelector((state) => state.admin);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [users, setUsers] = useState([]);
  const [userFetching, setUserFetching] = useState(false);
  const [modalUser, setModalUser] = useState(null);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    setUserFetching(true);
    listUsers(debouncedFilters)
      .then((res) => {
        const unique = uniqueUsersById(res.data.users);
        setUsers(unique);
        setUserFetching(false);
        if (isAdmin) {
          listRoles().then((res) => setAllRoles(res.data.roles || []));
        }
      })
      .catch(() => setUserFetching(false));
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
    if (selectedUsers.length === users.length) setSelectedUsers([]);
    else setSelectedUsers(users.map((u) => u.id));
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
            if (modalUser && userIds.includes(modalUser.id)) setModalUser(null);
          })
          .catch(() => {
            Swal.fire("Error", "Failed to delete users", "error");
          });
      }
    });
  };

  const handleClear = () => setFilters(DEFAULT_FILTERS);

  const handleDownloadCSV = () => {
    const allFilters = { ...filters, pagenumber: 1, perpage: 10000 };
    listUsers(allFilters)
      .then((res) => {
        const allUsers = res.data.users;
        const fields = [
          "id",
          "name",
          "email",
          "roles",
          "created_by",
          "created_at",
          "updated_at",
        ];
        const processedUsers = allUsers.map((user) => ({
          ...user,
          roles: user.roles ? user.roles.map((r) => r.name).join("; ") : "",
        }));
        console.log("Processed users for CSV:", processedUsers);
        DownloadCSV(fields, processedUsers, "users.csv");
      })
      .catch((err) => {
        console.error("Failed to download CSV:", err);
        Swal.fire("Error", "Failed to download CSV", "error");
      });
  };

  const handleModalNameSave = (user, name, close) => {
    updateUserName(user.id, name)
      .then(() => {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, name } : u))
        );
        if (modalUser) setModalUser((u) => ({ ...u, name }));
        close();
        Swal.fire("Success", "Name updated!", "success");
      })
      .catch(() => Swal.fire("Error", "Failed to update name", "error"));
  };

  const handleModalRolesSave = (user, newRoles, close) => {
    setLoadingRoles(true);
    changeRoles(user.id, newRoles)
      .then(() => {
        listRoles().then((res) => setAllRoles(res.data.roles || []));
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? {
                  ...u,
                  roles: allRoles.filter((r) => newRoles.includes(r.id)),
                }
              : u
          )
        );
        if (modalUser)
          setModalUser((u) => ({
            ...u,
            roles: allRoles.filter((r) => newRoles.includes(r.id)),
          }));
        close();
        Swal.fire("Success", "Roles updated!", "success");
      })
      .catch(() => Swal.fire("Error", "Failed to update roles", "error"))
      .finally(() => setLoadingRoles(false));
  };

  const allChecked = users.length > 0 && selectedUsers.length === users.length;

  return (
    <div>
      <h2 className="user-listing-title">User Listing</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1.5rem",
          gap: 12,
        }}
      >
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
        {isAdmin && (
          <>
            <RegisterModal
              trigger={({ onClick }) => (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onClick}
                  style={{ marginLeft: 12, marginRight: 8 }}
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
              style={{ marginRight: 16 }}
            >
              Delete Selected
            </Button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Checkbox
                checked={allChecked}
                onChange={handleCheckAll}
                color="primary"
                inputProps={{ "aria-label": "Select all users" }}
              />
              <Chip
                label="SELECT ALL"
                style={{
                  background: allChecked ? "#5c7cff" : "#e5e7fa",
                  color: allChecked ? "#fff" : "#23395d",
                  fontWeight: 500,
                  fontSize: 15,
                }}
                size="small"
              />
            </div>
          </>
        )}
      </div>
      <UserFilterForm
        filters={filters}
        handleInputChange={handleInputChange}
        handleDownloadCSV={handleDownloadCSV}
      />
      <div className="user-card-grid-modern">
        {userFetching ? (
          <div style={{ textAlign: "center", width: "100%" }}>Loading...</div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: "center", width: "100%" }}>
            No users found
          </div>
        ) : (
          users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isAdmin={isAdmin}
              checked={selectedUsers.includes(user.id)}
              onCheck={handleCheck}
              onClick={() => setModalUser(user)}
            />
          ))
        )}
      </div>
      <UserModal
        open={!!modalUser}
        user={modalUser}
        onClose={() => setModalUser(null)}
        isAdmin={isAdmin}
        allRoles={allRoles}
        onNameSave={handleModalNameSave}
        onRolesSave={handleModalRolesSave}
        onDelete={handleDelete}
        loadingRoles={loadingRoles}
      />
    </div>
  );
};

export default CardUserListing;
