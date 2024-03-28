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
    <nav
      className="navbar navbar-expand-lg bg-transparent rounded-bottom"
      id="navbar-top"
    >
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
        <Link to="/" className="navbar-brand d-none d-lg-block">
          <img
            src="/shopping-cart.svg"
            alt="logo"
            width="25"
            height="25"
            className="d-inline-block align-text-top"
          />
          Smart Fridge
        </Link>
         {/* Render h1 element for small and medium screens */}
         {location.pathname === "/" && (
          <h1 className="d-block d-md-none my-auto" style={{ marginRight: "calc(56vw - 68px)" }}>
          Home
        </h1>
        )}
        {location.pathname === "/item-scan" && (
          <h1 className="d-block d-md-none my-auto" style={{ marginRight: "calc(50vw - 67px)" }}>
          Quick Add
        </h1>
        )}
        {location.pathname === "/storage" && (
          <h1 className="d-block d-md-none my-auto" style={{ marginRight: "calc(50vw - 67px)" }}>
          Storages
        </h1>     
        )}
        {location.pathname === "/shopping" && (
          <h1 className="d-block d-md-none my-auto" style={{ marginRight: "calc(50vw - 67px)" }}>
          Shopping
        </h1>  
        )}
        {/* Off Canvas Navbar */}
        <div
          className="offcanvas offcanvas-start rounded-end-3"
          tabIndex="-1"
          id="navbarNav"
          aria-labelledby="navbarNavLabel"
          style={{ width: "55%" }}
        >
          {/* Header of Off Canvas */}
          <div className="offcanvas-header d-flex flex-column align-items-center mb-auto d-lg-none">
            <div style={{ width: "100%" }}>
              <button
                type="button"
                className="btn-close d-flex ms-auto d-lg-none"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            {/* Avatar */}
            <img
              className="d-flex align-self-start"
              src="/pizza-slice.svg"
              alt=""
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
            {/* Name and Email */}
            <div className="align-self-start mt-3">
              <h5
                style={{
                  marginBottom: "0",
                }}
              >
                Milo L
              </h5>
              <p
                style={{
                  color: "grey",
                  marginTop: "0",
                  marginBottom: "0",
                  fontSize: "13px",
                }}
              >
                milek1093@gmail.com
              </p>
            </div>
          </div>
          {/* Body of off canvas */}
          <div className="offcanvas-body pt-2 pt-lg-0">
            <ul className="navbar-nav align-items-start">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`pt-sm-0 py-lg-0 d-flex nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                >
                  <img
                    src="/home-icon.svg"
                    alt=""
                    className="d-flex d-lg-none me-4"
                  />
                  <p className="d-flex my-auto m-lg-0">Home</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/item-scan"
                  className={`py-lg-0 d-flex nav-link ${
                    location.pathname === "/item-scan" ? "active" : ""
                  }`}
                >
                  <img
                    src="/camera.svg"
                    alt=""
                    className="d-flex d-lg-none me-4"
                  />
                  <p className="d-flex my-auto m-lg-0">Quick Add</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/storage"
                  className={`py-lg-0 d-flex nav-link ${
                    location.pathname === "/storage" ? "active" : ""
                  }`}
                >
                  <img
                    src="/pizza-slice.svg"
                    alt=""
                    className="d-flex d-lg-none me-4"
                  />
                  <p className="d-flex my-auto m-lg-0">Storages</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/shopping"
                  className={`py-lg-0 d-flex nav-link ${
                    location.pathname === "/shopping" ? "active" : ""
                  }`}
                >
                  <img
                    src="/shopping-cart.svg"
                    alt=""
                    className="d-flex d-lg-none me-4"
                  />
                  <p className="d-flex my-auto m-lg-0">Shopping</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/register"
                  className={`py-lg-0 d-flex nav-link ${
                    location.pathname === "/register" ? "active" : ""
                  }`}
                >
                  <img
                    src="/portrait-user.svg"
                    alt=""
                    className="d-flex d-lg-none me-4"
                  />
                  <p className="d-flex my-auto m-lg-0">Sign Up</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/login"
                  className={`py-lg-0 d-flex nav-link ${
                    location.pathname === "/login" ? "active" : ""
                  }`}
                >
                  <img
                    src="/sign-in.svg"
                    alt=""
                    className="d-inline-block d-lg-none me-4"
                  />
                  <p className="d-flex my-auto m-lg-0">Log In</p>
                </Link>
              </li>
              {/* Render navlink for large screen and btn for small so it looks good */}
              <li className="nav-item align-self-center mt-lg-0 mt-5">
                <button
                  onClick={handleLogout}
                  className="nav-link d-lg-flex align-items-center justify-content-center mt-lg-0 mt-5 rounded-pill py-lg-0 d-none"
                >
                  <img
                    src="/logout-btn.png"
                    alt=""
                    className="d-inline-block me-2 d-lg-none"
                    style={{ width: "25px", height: "25px" }}
                  />
                  <p className="d-flex my-auto m-lg-0">Log out</p>
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-primary d-flex d-lg-none align-items-center justify-content-center mt-lg-0 mt-5 rounded-pill py-lg-0"
                >
                  <img
                    src="/logout-btn.png"
                    alt=""
                    className="d-inline-block me-2 d-lg-none d-"
                    style={{ width: "25px", height: "25px" }}
                  />
                  <p className="d-flex my-auto m-lg-0">Log out</p>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
