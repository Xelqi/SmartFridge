import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { onMessage } from "firebase/messaging";
import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ItemScanPage from "./pages/ItemScanPage";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import StoragePage from "./pages/StoragePage";
import StorageItemsPage from "./pages/StorageItemsPage";
import CookingPage from "./pages/CookingPage";
import ProfilePage from "./pages/ProfilePage";
import Recipe from "./pages/Recipe";
import SharedStorageItemPage from "./pages/SharedStorageItemsPage";

import { generateToken, messaging } from "./notifications/firebase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [showNotifications, setShowNotifications] = useState(false); // State to control visibility of notifications panel

  useEffect(() => {
    // Check if user is logged in based on the presence of cookies
    const tokenCookie = getCookie("token");
    const refreshTokenCookie = getCookie("refreshToken");
    if (tokenCookie && refreshTokenCookie) {
      setIsLoggedIn(true);
      generateToken(); // Generate token if user is logged in
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch notifications when the user is logged in
      fetchNotifications();
      // Listen for incoming messages when the user is logged in
      onMessage(messaging, async (payload) => {
        // Update notifications state with the new notification
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          payload.notification.body,
        ]);
        // Fetch notifications again to get the latest data
        await fetchNotifications();
      });
    }
  }, [isLoggedIn]);

  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Redirect to storage page if logged in user visits homepage
    if (isLoggedIn && location.pathname === "/") {
      navigate("/storage");
    }
  }, [isLoggedIn, location.pathname, navigate]);

  // Update the fetchNotifications function to use the new API route
  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notification/fetch-notifications", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data.notifications); // Update notifications state with fetched data
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Function to delete a notification
  const deleteNotificationHandler = async (notificationId) => {
    console.log(notificationId);
    try {
      const response = await fetch(`/api/notification/${notificationId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
      // Remove the deleted notification from the notifications state
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Function to get cookie value by name
  const getCookie = (name) => {
    const cookieValue = document.cookie.match(
      "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    return cookieValue ? cookieValue.pop() : "";
  };

  // Determine if the Navbar should be rendered based on the current route
  const shouldRenderNavbar = !["/login", "/register", "/"].includes(
    location.pathname
  );

  // Determine if the MobileNav should be rendered based on the current route
  const shouldRenderMobileNav = shouldRenderNavbar; // Render MobileNav if Navbar is rendered

  return (
    <div className="app">
      {/* Conditionally render the Navbar */}
      {isLoggedIn && shouldRenderNavbar && <Navbar />}
      {/* Render notifications */}
      {isLoggedIn &&
        !["/", "/login", "/register"].includes(location.pathname) && (
          <div className="notifications-container">
            {/* Bell icon */}
            <div
              className="bell-icon"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <img
                src="bell.png"
                id="button"
                alt=""
                style={{ width: "25px", height: "25px" }}
              />
              {notifications.length > 0 && (
                <span className="badge">{notifications.length}</span>
              )}
            </div>
            {/* Notifications panel */}
            {showNotifications && (
              <div className="notifications-panel">
                <h3>Notifications</h3>
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification._id}>
                      <p className="mb-0">{notification.body}</p>
                      <button
                        onClick={() =>
                          deleteNotificationHandler(notification._id)
                        }
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {isLoggedIn && <Route path="/item-scan" element={<ItemScanPage />} />}
        {isLoggedIn && (
          <Route path="/shopping" element={<ShoppingCartPage />} />
        )}
        {isLoggedIn && <Route path="/storage" element={<StoragePage />} />}
        {isLoggedIn && (
          <Route path="/storage/:storage_name" element={<StorageItemsPage />} />
        )}
        {isLoggedIn && (
          <Route
            path="/shared-storage/:storage_name"
            element={<SharedStorageItemPage />}
          />
        )}
        {isLoggedIn && <Route path="/cooking" element={<CookingPage />} />}
        {isLoggedIn && <Route path="/profile" element={<ProfilePage />} />}{" "}
        {/* Render ProfilePage only if user is logged in */}
        <Route path="/recipe/:id" element={<Recipe />} />
      </Routes>
      {/* Conditionally render the MobileNav */}
      {isLoggedIn && shouldRenderMobileNav && <MobileNav />}
    </div>
  );
}

export default App;
