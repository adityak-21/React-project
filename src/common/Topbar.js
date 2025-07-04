import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineBell } from "react-icons/ai";
import "../style/Topbar.css";
import Pusher from "pusher-js";
import { listNotifications } from "../api/NotificationsApi";
import { markAsRead } from "../api/NotificationsApi";
import { useSelector } from "react-redux";

const Topbar = () => {
  const [notifHovered, setNotifHovered] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state?.user);
  const userName = user.userName || "N/A";
  const userEmail = user.userEmail || "N/A";
  const userId = user.userId || "N/A";

  useEffect(() => {
    listNotifications()
      .then((response) => {
        setNotifications(
          response.data.map((n) => ({
            id: n.id,
            title: n.title,
            description: n.description,
            is_read: n.is_read,
          }))
        );
      })
      .catch((error) => {
        console.error("Failed to fetch notifications:", error);
      });

    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe(`task.${userId}`);

    channel.bind("message.sent", function (data) {
      setNotifications((prev) => [
        {
          id: data.notificationId,
          title: data.title || "New Notification",
          description: data.message,
          is_read: false,
        },
        ...prev,
      ]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userId]);

  const handleMarkRead = (id) => {
    markAsRead(id)
      .then(() => {
        console.log("Notification marked as read:", id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
      })
      .catch((error) => {
        console.error("Failed to mark notification as read:", error);
      });
  };

  return (
    <div className="topbar-content">
      <div
        className="icon-wrapper"
        onMouseEnter={() => setNotifHovered(true)}
        onMouseLeave={() => setNotifHovered(false)}
      >
        <AiOutlineBell size={28} />
        {notifications.length > 0 && (
          <span className="badge">
            {" "}
            {notifications.reduce((acc, n) => acc + (!n.is_read ? 1 : 0), 0)}
          </span>
        )}
        {notifHovered && (
          <div
            className="tooltipnew"
            onMouseEnter={() => setNotifHovered(true)}
            onMouseLeave={() => setNotifHovered(false)}
          >
            {notifications.length > 0 ? (
              <div>
                <b>Notifications:</b>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {notifications.map((n, i) => (
                    <li
                      key={n.id || i}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <input
                        type="checkbox"
                        checked={n.is_read}
                        disabled={n.is_read}
                        onChange={() => handleMarkRead(n.id)}
                        style={{
                          cursor: n.is_read ? "not-allowed" : "pointer",
                        }}
                      />
                      <b>{n.title}:</b> <span>{n.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              "No notifications"
            )}
          </div>
        )}
      </div>
      <div
        className="icon-wrapper"
        onMouseEnter={() => setProfileHovered(true)}
        onMouseLeave={() => setProfileHovered(false)}
      >
        <FaUserCircle size={30} />
        {profileHovered && (
          <div className="tooltipnew">
            <div>
              <b>Name:</b> {userName || "N/A"}
            </div>
            <div>
              <b>ID:</b> {userId || "N/A"}
            </div>
            <div>
              <b>Email:</b> {userEmail || "N/A"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
