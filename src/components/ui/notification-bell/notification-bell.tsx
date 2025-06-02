import styles from "./notification-bell.module.css";
import { IoNotificationsOutline } from "react-icons/io5";

interface NotificationBellProps {
  hasNotifications?: boolean;
  onClick?: () => void;
  className?: string;
}

const NotificationBell = ({
  hasNotifications = true,
  onClick,
  className = "",
}: NotificationBellProps) => {
  return (
    <button
      className={`${styles.bellContainer} ${className}`}
      onClick={onClick}
      type="button"
      aria-label="View notifications"
    >
      <IoNotificationsOutline size={22} className={styles.bellIcon} />
      {hasNotifications && <div className={styles.alertDot}></div>}
    </button>
  );
};

export default NotificationBell;
