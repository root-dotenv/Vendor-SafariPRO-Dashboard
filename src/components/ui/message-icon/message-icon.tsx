import styles from "./message-icon.module.css";
import { LuMessageSquareText } from "react-icons/lu";

interface MessageIconProps {
  messageCount?: number;
  onClick?: () => void;
  className?: string;
}

const MessageIcon = ({
  messageCount = 4,
  onClick,
  className = "",
}: MessageIconProps) => {
  return (
    <button
      className={`${styles.messageContainer} ${className}`}
      onClick={onClick}
      type="button"
      aria-label={`View messages (${messageCount} unread)`}
    >
      <LuMessageSquareText size={22} className={styles.messageIcon} />
      {messageCount > 0 && (
        <div className={styles.messageCount}>
          {messageCount > 99 ? "99+" : messageCount}
        </div>
      )}
    </button>
  );
};

export default MessageIcon;
