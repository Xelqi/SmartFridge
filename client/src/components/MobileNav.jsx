// MobileNav.js
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function MobileNav() {
  const [activeNavItem, setActiveNavItem] = useState("");
  const location = useLocation();

  // Update activeNavItem based on location change
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === "/cooking") setActiveNavItem("cooking");
    else if (pathname === "/profile") setActiveNavItem("profile");
    else if (pathname === "/storage") setActiveNavItem("storage");
    else if (pathname === "/shopping") setActiveNavItem("shopping");
    else setActiveNavItem("");
  }, [location]);

  return (
    <nav className="navbar fixed-bottom navbar-expand-lg navbar-light bg-primary shadow rounded-top d-lg-none">
      <div className="container-fluid justify-content-around">
        <Link
          to="/storage"
          className={`navbar-brand ${
            activeNavItem === "storage" ? "active" : ""
          }`}
          onClick={() => setActiveNavItem("storage")}
        >
          <img
            src="/fi-rr-cube.svg"
            style={{ width: "25px", height: "25px" }}
            alt=""
          />
        </Link>
        <Link
          to="/cooking"
          className={`navbar-brand ${
            activeNavItem === "cooking" ? "active" : ""
          }`}
          onClick={() => setActiveNavItem("cooking")}
        >
          <img
            src="/utensils.png"
            style={{ width: "25px", height: "25px" }}
            alt=""
          />
        </Link>
        <Link
          to="/shopping"
          className={`navbar-brand ${
            activeNavItem === "shopping" ? "active" : ""
          }`}
          onClick={() => setActiveNavItem("shopping")}
        >
          <img
            src="/shopping-cart.png"
            style={{ width: "25px", height: "25px" }}
            alt=""
          />
        </Link>
        <Link
          to="/profile"
          className={`navbar-brand ${
            activeNavItem === "profile" ? "active" : ""
          }`}
          onClick={() => setActiveNavItem("profile")}
        >
          <img
            src="/user.png"
            alt=""
            style={{ width: "25px", height: "25px" }}
          />
        </Link>
      </div>
    </nav>
  );
}
