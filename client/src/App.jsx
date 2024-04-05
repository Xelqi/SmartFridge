// App.jsx
import { Routes, Route, useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ItemScanPage from "./pages/ItemScanPage";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import StoragePage from "./pages/StoragePage";
import  StorageItemsPage  from "./pages/StorageItemsPage";

function App() {
  const location = useLocation();
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    // Set background image based on the current route
    if (location.pathname === "/login" || location.pathname === "/register") {
      setBackgroundImage('/phone-background.svg');
    } else if (location.pathname.startsWith("/storage")) {
      setBackgroundImage('/phone-background.svg');
    } else {
      setBackgroundImage('/phone-background.svg');
    }
  }, [location]);

  // Determine if the Navbar should be rendered based on the current route
  const shouldRenderNavbar = !["/login", "/register"].includes(location.pathname);

  // Determine if the MobileNav should be rendered based on the current route
  const shouldRenderMobileNav = shouldRenderNavbar; // Render MobileNav if Navbar is rendered

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover', // Ensures the background image covers the entire container
    backgroundRepeat: 'no-repeat', // Prevents the background image from repeating
  };

  return (
    <div className="app" style={backgroundStyle}>
      {shouldRenderNavbar && <Navbar />} {/* Conditionally render the Navbar */}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/item-scan" element={<ItemScanPage/>} />
        <Route path="/shopping" element={<ShoppingCartPage/>} />
        <Route path="/storage" element={<StoragePage/>} />
        <Route path="/storage/:storage_name" element={<StorageItemsPage/>} />
      </Routes>
      
      {shouldRenderMobileNav && <MobileNav />} {/* Conditionally render the MobileNav */}
    </div>
  );
}

export default App;
