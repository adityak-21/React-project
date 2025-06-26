import React from "react";
import { useHistory } from "react-router-dom";
import { me } from "../api/AuthApi";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    me()
      .then((response) => {
        setUser(response.data);
        console.log("User data fetched successfully:", response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
      });
  }, []);
  const roleNames = user?.roles?.map((role) => role.role);
  return (
    <div className="container" style={{ maxWidth: 600, marginTop: 100 }}>
      {user ? (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <p>Id: {user.id}</p>
          <p>Email: {user.email}</p>
          <p>Roles: {roleNames.join(", ")}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
