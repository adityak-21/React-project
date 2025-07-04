import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "../components/SidebarData";
import { IconContext } from "react-icons";
import "../style/Navbar.css";
import Logout from "../components/Logout";
import { useSelector } from "react-redux";

function Navbar({ sidebar, setSidebar }) {
  const showSidebar = () => setSidebar(!sidebar);
  const isAdmin = useSelector((state) => state?.admin?.isAdmin);

  return (
    <>
      <IconContext.Provider value={{ color: "undefined" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items">
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose onClick={showSidebar} />
              </Link>
            </li>
            {SidebarData.filter((item) => !item.adminOnly || isAdmin).map(
              (item, index) => {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              }
            )}
            <li className="nav-text">
              <Logout />
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
