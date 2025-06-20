import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "User-Listing",
    path: "/dashboard",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "User-Activities",
    path: "/userActivity",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
];
