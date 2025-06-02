import { useState, useRef, useEffect } from "react";
import { IoChevronDown, IoLogOut } from "react-icons/io5";
import styles from "./user-dropdown.module.css";
import { TbLogout } from "react-icons/tb";

interface User {
  username: string;
  email?: string;
  avatar?: string;
}

interface UserDropdownProps {
  user: User;
  onLogout: () => void;
  className?: string;
}

const UserDropdown = ({
  user,
  onLogout,
  className = "",
}: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  // Generate initials from username for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`${styles.userDropdown} ${className}`} ref={dropdownRef}>
      <button
        className={styles.userButton}
        onClick={toggleDropdown}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={styles.userAvatar}>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.username}'s avatar`}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatarFallback}>
              {getInitials(user.username)}
            </div>
          )}
        </div>
        <span className={styles.username}>{user.username}</span>
        <IoChevronDown
          className={`${styles.chevronIcon} ${
            isOpen ? styles.chevronOpen : ""
          }`}
          size={16}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <div className={styles.displayName}>{user.username}</div>
              {user.email && (
                <div className={styles.userEmail}>{user.email}</div>
              )}
            </div>
          </div>
          <div className={styles.divider}></div>
          <button
            className={styles.logoutButton}
            onClick={handleLogoutClick}
            type="button"
          >
            <TbLogout size={24} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
