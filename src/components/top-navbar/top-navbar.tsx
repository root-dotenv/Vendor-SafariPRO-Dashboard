import styles from "./top-navbar.module.css";
import hotel_logo from "../../../public/images/stylex-logo-blue.png";
import { useAuth } from "../../contexts/authcontext";
import { useNavigate } from "react-router-dom";

// Import new components
import SearchBar from "../ui/search-bar/search-bar";
import NotificationBell from "../ui/notification-bell/notification-bell";
import MessageIcon from "../ui/message-icon/message-icon";
import UserDropdown from "../ui/user-dropdown/user-dropdown";
import { useHotelContext } from "../../contexts/hotelContext";

const TopNavbar = () => {
  const hotel = useHotelContext();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (query: string) => {
    console.log("Search executed for:", query);
    // The DOM search is now handled automatically by the SearchBar component
    // You can add additional search logic here if needed (e.g., API calls)
  };

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
    // Implement notification panel logic
  };

  const handleMessageClick = () => {
    console.log("Messages clicked");
    // Implement messages panel logic
  };

  return (
    <nav
      className={`bg-[#FFF] border-b-[1px] border-[#EFF2F6] w-screen h-[70px] text-white flex items-center px-[1rem] sticky top-0 z-50`}
    >
      <div className={styles.container}>
        {/* Hotel Name and Logo */}
        <div className={styles.logoSection}>
          <img
            className={styles.hotelLogo}
            src={hotel_logo}
            height={32}
            width={32}
            alt="hotel-logo"
          />
          <h1
            className={`${styles.hotelName} text-[1.75rem] text-[#3c75f9] font-bold`}
          >
            {hotel.name}
          </h1>
        </div>

        {/* Center Section - Search Bar */}
        <div className={styles.centerSection}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search something..."
          />
        </div>

        {/* Right Section - User Controls */}
        <div className={styles.userSection}>
          {user && (
            <>
              <div className={styles.actionIcons}>
                <NotificationBell
                  hasNotifications={true}
                  onClick={handleNotificationClick}
                />
                <MessageIcon messageCount={4} onClick={handleMessageClick} />
              </div>

              <UserDropdown
                user={{
                  username: user.username,
                  email: user.email || `${user.username}@oasis.com`,
                }}
                onLogout={handleLogout}
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
