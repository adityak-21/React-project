import React from "react";
import { useHistory } from "react-router-dom";
import { me } from "../api/AuthApi";
import { myTaskStatusStats } from "../api/AnalyticsApi";
import { useEffect, useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../style/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);
  useEffect(() => {
    me()
      .then((response) => {
        setUser(response.data);
        myTaskStatusStats()
          .then((response) => {
            setMyTasks(response.data);
            console.log(
              "Task status stats fetched successfully:",
              response.data
            );
          })
          .catch((error) => {
            console.error("Failed to fetch task status stats:", error);
          });
        console.log("User data fetched successfully:", response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
      });
  }, []);

  const options = useMemo(() => {
    if (!myTasks) return { title: { text: "Loading..." }, series: [] };

    const pieData = Object.entries(myTasks).map(([status, count]) => ({
      name: status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      y: count,
    }));

    return {
      chart: { type: "pie" },
      title: { text: "My Task Status Distribution" },
      series: [{ name: "Tasks", colorByPoint: true, data: pieData }],
    };
  }, [myTasks]);
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

      <div className="task-summary-slab">
        <SummaryCard
          color="#2d6cdf"
          label="Assigned"
          value={myTasks.assigned}
        />
        <SummaryCard
          color="#f0ad4e"
          label="In Progress"
          value={myTasks.in_progress}
        />
        <SummaryCard
          color="#5cb85c"
          label="Completed"
          value={myTasks.completed}
        />
        <SummaryCard
          color="#17a2b8"
          label="Verified"
          value={myTasks.verified}
        />
        <SummaryCard color="#ff4a4a" label="Overdue" value={myTasks.overdue} />
        <SummaryCard
          color="#9b59b6"
          label="Deadline Today"
          value={myTasks.due_today}
        />
      </div>

      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        style={{ width: "100%", height: "400px" }}
      >
        {" "}
      </HighchartsReact>
    </div>
  );
};

function SummaryCard({ label, value, color }) {
  return (
    <div className="summary-card" style={{ borderColor: color }}>
      <div className="summary-value" style={{ color }}>
        {value}
      </div>
      <div className="summary-label">{label}</div>
    </div>
  );
}

export default Dashboard;
