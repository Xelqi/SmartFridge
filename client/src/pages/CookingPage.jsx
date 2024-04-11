import Popular from "../components/Popular";
import RecipeFinder from "../components/RecipeFinder";
import { useState, useLayoutEffect } from "react";

const CookingPage = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [topbarHeight, setTopbarHeight] = useState(0);

  useLayoutEffect(() => {
    const navbar = document.getElementById("bottom-navbar");
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }

    const topNavbar = document.getElementById("navbar-top");
    if (topNavbar) {
      setTopbarHeight(topNavbar.offsetHeight);
    }
  }, []); // Remove unnecessary dependency

  return (
    <div
      className="row"
      style={{
        height: `calc(100svh - ${navbarHeight}px - ${topbarHeight}px - 15px)`,
        overflowY: "auto",
      }}
    >
      <div className="col-11 mx-auto">
        <Popular />
        <RecipeFinder/>
      </div>
    </div>
  );
};

export default CookingPage;
