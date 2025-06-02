import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./SubMenuItem.module.css";
import { BsDash } from "react-icons/bs";

interface SubMenuItemProps {
  to: string;
  text: string;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ to, text }) => {
  return (
    <li className={`mb-1 mt-2`}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          ` ${styles.link} ${isActive ? styles.active : ""} `
        }
      >
        <BsDash />
        {text}
      </NavLink>
    </li>
  );
};

export default SubMenuItem;
