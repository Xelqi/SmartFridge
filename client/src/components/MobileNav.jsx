// MobileNav.js
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function MobileNav() {
  const [activeNavItem, setActiveNavItem] = useState("");
  const location = useLocation();

  // Update activeNavItem based on location change
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === "/") setActiveNavItem("home");
    else if (pathname === "/item-scan") setActiveNavItem("item-scan");
    else if (pathname === "/storage") setActiveNavItem("storage");
    else if (pathname === "/shopping") setActiveNavItem("shopping");
  }, [location]);

  return (
    <nav className="navbar fixed-bottom navbar-expand-lg navbar-light bg-primary shadow rounded-top d-lg-none">
      <div className="container-fluid justify-content-around">
        <Link
          to="/"
          className={`navbar-brand ${activeNavItem === "home" ? "active" : ""}`}
          onClick={() => setActiveNavItem("home")}
        >
          <img src="/home-icon.svg" alt="" />
        </Link>
        <Link
          to="/item-scan"
          className={`navbar-brand ${activeNavItem === "item-scan" ? "active" : ""}`}
          onClick={() => setActiveNavItem("item-scan")}
        >
          <img src="/camera.svg" alt="" />
        </Link>
        <Link
          to="/storage"
          className={`navbar-brand ${activeNavItem === "storage" ? "active" : ""}`}
          onClick={() => setActiveNavItem("storage")}
        >
          <img src="/pizza-slice.svg" alt="" />
        </Link>
        <Link
          to="/shopping"
          className={`navbar-brand ${activeNavItem === "shopping" ? "active" : ""}`}
          onClick={() => setActiveNavItem("shopping")}
        >
          <img src="/shopping-cart.svg" alt="" />
        </Link>
      </div>
    </nav>
  );
}
