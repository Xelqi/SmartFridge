import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  // Get the current location
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/user/logout", {
        method: "POST",
        credentials: "include", // Include credentials for cross-origin requests
      });
      //   // Redirect to the login page or perform any other necessary actions
      window.location.href = "/login";
    } catch (error) {
      console.log("Logout Failed", error);
    }
  };

  return (
    <nav className="navbar bg-transparent rounded-bottom" id="navbar-top">
      <div className="container-fluid">
        <button
          className="navbar-toggler shadow-sm"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Off Canvas Navbar */}
        <div
          className="offcanvas offcanvas-start rounded-end-3"
          tabIndex="-1"
          id="navbarNav"
          aria-labelledby="navbarNavLabel"
          style={{ width: "55%" }}
        >
          {/* Header of Off Canvas */}
          <div className="offcanvas-header d-flex flex-column align-items-center">
            <div style={{ width: "100%" }}>
              <button
                type="button"
                className="btn-close d-flex ms-auto"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
          </div>
          {/* Body of off canvas */}
          <div className="offcanvas-body pt-2">
            <div className="w-100 mx-auto">
              <img src="/logo-cropped.png" alt="" className="img-fluid" />
              <h6 className="text-muted fst-italic text-center mt-2"> Where simplicity meets sustainability</h6>
            </div>
            <ul
              className="navbar-nav mt-4"
            >
              <li className="nav-item">
                <Link
                  to="/storage"
                  className={` d-flex nav-link ${
                    location.pathname === "/storage" ? "active" : ""
                  }`}
                >
                  <img
                    src="/fi-rr-cube.svg"
                    alt=""
                    className="d-flex me-4"
                  />
                  <p className="d-flex me-auto my-auto">Storages</p>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/item-scan"
                  className={` d-flex nav-link ${
                    location.pathname === "/item-scan" ? "active" : ""
                  }`}
                >
                  <img src="/camera.svg" alt="" className="d-flex me-4" />
                  <p className="d-flex my-auto me-auto ">Quick Add</p>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/cooking"
                  className={` d-flex nav-link ${
                    location.pathname === "/cooking" ? "active" : ""
                  }`}
                >
                  <img
                    src="/utensils.png"
                    style={{ width: "25px", height: "25px" }}
                    alt=""
                    className="d-flex  me-4"
                  />
                  <p className="d-flex my-auto  me-auto">Cooking</p>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/shopping"
                  className={` d-flex nav-link ${
                    location.pathname === "/shopping" ? "active" : ""
                  }`}
                >
                  <img
                    src="/shopping-cart.png"
                    style={{ width: "25px", height: "25px" }}
                    alt=""
                    className="d-flex me-4"
                  />
                  <p className="d-flex my-auto me-auto ">Shopping</p>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/profile"
                  className={`pt-sm-0  d-flex nav-link ${
                    location.pathname === "/profile" ? "active" : ""
                  }`}
                >
                  <img
                    src="/user.png"
                    alt=""
                    style={{ width: "25px", height: "25px" }}
                    className="d-flex me-4"
                  />
                  <p className="d-flex my-auto me-auto ">Profile</p>
                </Link>
              </li>

              {/* Render navlink for large screen and btn for small so it looks good */}
            </ul>
            <div
              className="d-flex justify-content-center mb-4"
              style={{ marginTop: "13svh" }}
            >
              <button
                onClick={handleLogout}
                className="btn btn-primary rounded-pill d-flex"
              >
                <img
                  src="/logout-btn.png"
                  alt=""
                  className="d-inline-block me-2 "
                  style={{ width: "25px", height: "25px" }}
                />
                <p className="d-flex my-auto ">Log out</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
