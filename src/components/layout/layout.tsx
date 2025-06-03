import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopNavbar from "../top-navbar/top-navbar"; // Adjust import path if needed
import SideNavbar from "../sidebar/sidebar";
import styles from "./layout.module.css"; // Adjust import path if needed

const Layout: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className={styles.container}>
      {/* Pass toggleSidebar to TopNavbar as well if it has a button to control sidebar */}
      <TopNavbar toggleSidebar={toggleSidebar} />
      <div className={styles.contentWrapper}>
        {/* Pass isExpanded and toggleSidebar to SideNavbar */}
        <SideNavbar
          isExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
        />
        <main
          className={`${styles.mainContent} ${
            isSidebarExpanded ? "" : styles.mainContentCollapsed
          } bg-[#f8f8f8] z-20`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
