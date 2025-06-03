import React from "react";
import styles from "./tooltip-card.module.css";

interface SubRoute {
  to: string;
  text: string;
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

  return (
    <div
      className={styles.tooltipCard}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Main route */}
      <div
        className={styles.mainRoute}
        onClick={() => onItemClick(mainRoute.to)}
      >
        {mainRoute.text}
      </div>

      {/* Subroutes */}
      {subRoutes.map((subRoute) => (
        <div
          key={subRoute.to}
          className={styles.subRoute}
          onClick={() => onItemClick(subRoute.to)}
        >
          {subRoute.text}
        </div>
      ))}
    </div>
  );
};

export default TooltipCard;
