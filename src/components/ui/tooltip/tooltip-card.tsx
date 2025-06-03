import React from "react";
import styles from "./tooltip-card.module.css";

// Updated interface to match what MenuItem passes
interface SubRoute {
  to: string;
  text: string;
  roles: ("admin" | "staff")[]; // Added roles property
}

interface TooltipCardProps {
  isVisible: boolean;
  mainRoute: {
    to: string;
    text: string;
  };
  subRoutes: SubRoute[];
  onItemClick: (route: string) => void;
  position: {
    top: number;
    left: number;
  };
}

const TooltipCard: React.FC<TooltipCardProps> = ({
  isVisible,
  mainRoute,
  subRoutes,
  onItemClick,
  position,
}) => {
  if (!isVisible) return null;

  const handleMainRouteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Main route clicked:", mainRoute.to); // Debug log
    onItemClick(mainRoute.to);
  };

  const handleSubRouteClick = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Sub route clicked:", route); // Debug log
    onItemClick(route);
  };

  return (
    <div
      className={styles.tooltipCard}
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999, // Increased z-index
      }}
      onClick={(e) => e.stopPropagation()} // Prevent event bubbling
    >
      {/* Main route */}
      <div
        className={styles.tooltipItem}
        onClick={handleMainRouteClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onItemClick(mainRoute.to);
          }
        }}
      >
        {mainRoute.text}
      </div>

      {/* Subroutes */}
      {subRoutes.map((subRoute) => (
        <div
          key={subRoute.to}
          className={styles.tooltipItem}
          onClick={(e) => handleSubRouteClick(e, subRoute.to)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onItemClick(subRoute.to);
            }
          }}
        >
          {subRoute.text}
        </div>
      ))}
    </div>
  );
};

export default TooltipCard;
