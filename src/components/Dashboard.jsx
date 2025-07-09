import React from "react";
import { useHistory } from "react-router-dom";
import {
  myTaskStatusStats,
  averageCompletionTime,
  assignedVsCreated,
  oldestOpenTasks,
} from "../api/AnalyticsApi";
import { useEffect, useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../style/Dashboard.css";
import { useSelector } from "react-redux";
import { getRecent } from "../api/NotificationsApi";
import { getTodayTasks } from "../api/TaskApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const SUMMARY_CONFIG = [
  { key: "assigned", label: "Assigned", color: "#2d6cdf", clickable: true },
  {
    key: "in_progress",
    label: "In Progress",
    color: "#f0ad4e",
    clickable: true,
  },
  { key: "completed", label: "Completed", color: "#5cb85c", clickable: true },
  { key: "verified", label: "Verified", color: "#17a2b8", clickable: true },
  { key: "overdue", label: "Overdue", color: "#ff4a4a", clickable: false },
  {
    key: "due_today",
    label: "Deadline Today",
    color: "#9b59b6",
    clickable: false,
  },
];

const Dashboard = () => {
  const [myTasks, setMyTasks] = useState([]);
  const [avgCompletion, setAvgCompletion] = useState({});
  const [assignedCreated, setAssignedCreated] = useState({});
  const [oldestOpen, setOldestOpen] = useState([]);
  const history = useHistory();
  const userName = useSelector((state) => state.user.userName);
  const userEmail = useSelector((state) => state.user.userEmail);
  const userId = useSelector((state) => state.user.userId);
  const userRoles = useSelector((state) => state.user.userRoles);
  const [recentActivities, setRecentActivities] = useState([]);
  const [todayDueTasks, setTodayDueTasks] = useState([]);
  useEffect(() => {
    getTodayTasks()
      .then((response) => {
        setTodayDueTasks(response.data.tasks);
        console.log("Today's due tasks fetched successfully:", response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch today's due tasks:", error);
      });
    getRecent().then((res) => {
      setRecentActivities(
        res.data.map((a) => ({
          ...a,
          time: dayjs(a.time).fromNow(),
        }))
      );
    });
    myTaskStatusStats()
      .then((response) => {
        setMyTasks(response.data);
        console.log("Task status stats fetched successfully:", response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch task status stats:", error);
      });
    averageCompletionTime()
      .then((response) => {
        setAvgCompletion(response.data);
        console.log(
          "Average completion time fetched successfully:",
          response.data
        );
      })
      .catch((error) => {
        console.error("Failed to fetch average completion time:", error);
      });
    assignedVsCreated()
      .then((response) => {
        setAssignedCreated(response.data);
        console.log(
          "Assigned vs Created tasks fetched successfully:",
          response.data
        );
      })
      .catch((error) => {
        console.error("Failed to fetch assigned vs created tasks:", error);
      });
    oldestOpenTasks()
      .then((response) => {
        setOldestOpen(response.data);
        console.log("Oldest open tasks fetched successfully:", response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch oldest open tasks:", error);
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

  const roleNames = userRoles.map((role) => role.role);

  const avgCompletionOptions = useMemo(() => {
    const avgCompletionData = avgCompletion.average_completion_time || {};
    const months = Object.keys(avgCompletionData);
    return {
      chart: { type: "column" },
      title: { text: "Avg. Completion Time (Days)" },
      xAxis: { categories: months, title: { text: "Month" } },
      yAxis: { min: 0, allowDecimals: true, title: { text: "Average Days" } },
      series: [
        {
          name: "Avg Days",
          data: months.map((m) => avgCompletionData[m]),
        },
      ],
      credits: { enabled: false },
    };
  }, [avgCompletion]);

  const assignedCreatedOptions = useMemo(
    () => ({
      chart: { type: "column" },
      title: { text: "Tasks: Assigned to Me vs. Created by Me" },
      xAxis: { categories: ["Assigned to Me", "Created by Me"] },
      yAxis: { min: 0, allowDecimals: false, title: { text: "Tasks" } },
      series: [
        {
          name: "Tasks",
          data: [
            assignedCreated.assigned_to_me || 0,
            assignedCreated.created_by_me || 0,
          ],
        },
      ],
      credits: { enabled: false },
    }),
    [assignedCreated]
  );

  const oldestOpenOptions = useMemo(
    () => ({
      chart: { type: "bar" },
      title: { text: "Top 5 Oldest Open Tasks" },
      xAxis: { categories: oldestOpen.map((t) => t.title || `Task ${t.id}`) },
      yAxis: { min: 0, allowDecimals: false, title: { text: "Days Open" } },
      series: [
        {
          name: "Days Open",
          data: oldestOpen.map((t) => t.days_open),
        },
      ],
      credits: { enabled: false },
    }),
    [oldestOpen]
  );

  const handleSummaryCardClick = (status) => {
    history.push(`/myTasks?status=${status}`);
  };

  return (
    <div className="dashboard-root">
      <div
        className="container main-dashboard-content"
        style={{ maxWidth: 900, marginTop: 50 }}
      >
        <div>
          <h2>Welcome, {userName}!</h2>
          <p>Id: {userId}</p>
          <p>Email: {userEmail}</p>
          <p>Roles: {roleNames.join(", ")}</p>
        </div>

        <div className="task-summary-slab">
          {SUMMARY_CONFIG.map(({ key, label, color, clickable }) => (
            <SummaryCard
              key={key}
              color={color}
              label={label}
              value={myTasks[key]}
              onClick={
                clickable ? () => handleSummaryCardClick(key) : undefined
              }
            />
          ))}
        </div>

        <div className="dashboard-charts">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            style={{ width: "100%", height: "400px" }}
          >
            {" "}
          </HighchartsReact>
          <HighchartsReact
            highcharts={Highcharts}
            options={avgCompletionOptions}
            style={{ width: "100%", height: "400px", marginTop: "20px" }}
          />
          <HighchartsReact
            highcharts={Highcharts}
            options={assignedCreatedOptions}
            style={{ width: "100%", height: "400px", marginTop: "20px" }}
          />
          <HighchartsReact
            highcharts={Highcharts}
            options={oldestOpenOptions}
            style={{ width: "100%", height: "400px", marginTop: "20px" }}
          />
        </div>
      </div>
      <div className="dashboard-right-sidebars">
        <div className="sidebar-panel">
          <h3>Today's Tasks</h3>
          <ul>
            {todayDueTasks.length === 0 ? (
              <li className="empty-state">No tasks due today.</li>
            ) : (
              todayDueTasks.map((task) => (
                <li key={task.id} className="today-task-list-item">
                  <div className="today-task-title">{task.title}</div>
                  <div className="today-task-due">
                    {dayjs(task.due_date).format("MMM D, YYYY h:mm A")}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="sidebar-panel">
          <h3>Recent Activities</h3>
          <ul>
            {recentActivities.length === 0 ? (
              <li className="empty-state">No recent activity.</li>
            ) : (
              recentActivities.map((act, idx) => (
                <li key={idx} className="activity-list-item">
                  <div className="activity-text">{act.activity}</div>
                  <div className="activity-time">{act.time}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

function SummaryCard({ label, value, color, onClick }) {
  return (
    <div
      className="summary-card"
      style={{ borderColor: color, cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter") onClick();
            }
          : undefined
      }
    >
      <div className="summary-value" style={{ color }}>
        {value}
      </div>
      <div className="summary-label">{label}</div>
    </div>
  );
}

export default Dashboard;
