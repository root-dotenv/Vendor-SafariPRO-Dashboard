import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./SubMenuItem.module.css";
import { BsDash } from "react-icons/bs";

interface SubMenuItemProps {
  to: string;
  text: string;
  onSubItemClick?: () => void; // New prop to handle closing the parent card
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({
  to,
  text,
  onSubItemClick,
}) => {
  const handleClick = () => {
    if (onSubItemClick) {
      onSubItemClick(); // Call the function to close the parent card
    }
  };

  return (
    <li className={`mb-1 mt-2`}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          ` ${styles.link} ${isActive ? styles.active : ""} `
        }
        onClick={handleClick} // Add onClick handler
      >
        <BsDash />
        {text}
      </NavLink>
    </li>
  );
};

export default SubMenuItem;
