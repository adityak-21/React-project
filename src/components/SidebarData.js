import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <AiIcons.AiFillDashboard />,
    cName: "nav-text",
  },
  {
    title: "User-Listing",
    path: "/userListing",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "User-Activities",
    path: "/userActivity",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "My-Tasks",
    path: "/myTasks",
    icon: <FaIcons.FaTasks />,
    cName: "nav-text",
  },
  {
    title: "Created-Tasks",
    path: "/createdTasks",
    icon: <FaIcons.FaTasks />,
    cName: "nav-text",
  },
  {
    title: "All-Tasks",
    path: "/allTasks",
    icon: <FaIcons.FaTasks />,
    cName: "nav-text",
    adminOnly: true,
  },
];
