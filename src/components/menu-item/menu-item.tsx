import React, { useState } from "react";
import { NavLink, useResolvedPath, useMatch } from "react-router-dom";
import styles from "./MenuItem.module.css";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import SubMenuItem from "./sub-menu-item/sub-menu-item";

interface SubRoute {
  to: string;
  text: string;
}

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isExpanded: boolean;
  hasSubRoutes?: boolean;
  subRoutes?: SubRoute[];
}

const MenuItem: React.FC<MenuItemProps> = ({
  to,
  icon,
  text,
  isExpanded,
  hasSubRoutes = false,
  subRoutes = [],
}) => {
  const [showSubRoutes, setShowSubRoutes] = useState(false);

  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: false });

  const handleToggleSubRoutes = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSubRoutes(!showSubRoutes);
  };

  return (
    <li className={styles.menuItem}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${styles.link} ${isActive || match ? styles.active : ""}`
        }
        onClick={hasSubRoutes ? handleToggleSubRoutes : undefined}
      >
        <div className={styles.icon}>{icon}</div>
        {isExpanded && <span className={styles.text}>{text}</span>}
        {isExpanded && hasSubRoutes && (
          <div className={styles.chevron}>
            {showSubRoutes ? (
              <IoChevronUp size={16} />
            ) : (
              <IoChevronDown size={16} />
            )}
          </div>
        )}
      </NavLink>
      {isExpanded && hasSubRoutes && showSubRoutes && (
        <ul className={styles.subMenu}>
          {subRoutes.map((subRoute) => (
            <SubMenuItem
              key={subRoute.to}
              to={subRoute.to}
              text={subRoute.text}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;
