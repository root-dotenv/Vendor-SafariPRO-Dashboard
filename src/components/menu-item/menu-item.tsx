import React, { useState, useRef, useEffect } from "react";
import {
  NavLink,
  useResolvedPath,
  useMatch,
  useNavigate,
} from "react-router-dom";
import styles from "./MenuItem.module.css";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import SubMenuItem from "./sub-menu-item/sub-menu-item";
import TooltipCard from "../ui/tooltip/tooltip-card";

// Updated interface to match what SideNavbar passes
interface SubRoute {
  to: string;
  text: string;
  roles: ("admin" | "staff")[]; // Added roles property
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
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const menuItemRef = useRef<HTMLLIElement>(null);

  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: false });

  const handleToggleSubRoutes = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSubRoutes(!showSubRoutes);
  };

  const handleCollapsedClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (hasSubRoutes && subRoutes.length > 0) {
      // Calculate position for tooltip
      if (menuItemRef.current) {
        const rect = menuItemRef.current.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top,
          left: rect.right + 20,
        });
      }
      setShowTooltip(!showTooltip);
    } else {
      // Navigate directly to the route
      navigate(to);
    }
  };

  const handleTooltipItemClick = (route: string) => {
    console.log("Navigating to:", route); // Debug log
    navigate(route);
    setShowTooltip(false);
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuItemRef.current &&
        !menuItemRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  // Close tooltip when sidebar expands
  useEffect(() => {
    if (isExpanded) {
      setShowTooltip(false);
    }
  }, [isExpanded]);

  return (
    <>
      <li className={`${styles.menuItem}`} ref={menuItemRef}>
        {isExpanded ? (
          <>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `${styles.link} ${isActive || match ? styles.active : ""}`
              }
              onClick={hasSubRoutes ? handleToggleSubRoutes : undefined}
            >
              <div className={styles.icon}>{icon}</div>
              <span className={styles.text}>{text}</span>
              {hasSubRoutes && (
                <div className={styles.chevron}>
                  {showSubRoutes ? (
                    <IoChevronUp size={16} />
                  ) : (
                    <IoChevronDown size={16} />
                  )}
                </div>
              )}
            </NavLink>
            {hasSubRoutes && showSubRoutes && (
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
          </>
        ) : (
          <div
            className={`${styles.link} ${
              match ? styles.active : ""
            } cursor-pointer flex items-center justify-center p-[0.75rem] rounded-md transition-all`}
            onClick={handleCollapsedClick}
          >
            <div className={styles.icon}>{icon}</div>
          </div>
        )}
      </li>

      {/* - - - Tooltip Card */}
      {!isExpanded && (
        <TooltipCard
          isVisible={showTooltip && hasSubRoutes}
          mainRoute={{ to, text }}
          subRoutes={subRoutes}
          onItemClick={handleTooltipItemClick}
          position={tooltipPosition}
        />
      )}
    </>
  );
};

export default MenuItem;
