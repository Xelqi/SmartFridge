import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  // Get the current location
  const location = useLocation();

  const handleLogout = async () => {
    try {
        await fetch("http://localhost:8080/api/user/logout", {
          method: "POST",
          credentials: "include", // Include credentials for cross-origin requests
        })
      //   // Redirect to the login page or perform any other necessary actions
      window.location.href = "/login";
    } catch (error) {
      console.log('Logout Failed', error)
    }
  }

  return (
    <nav className="navbar navbar-expand-sm bg-body-tertiary">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link to="/" className="navbar-brand">
          <img
            src="/vite.svg"
            alt="logo"
            width="30"
            height="30"
            className="d-inline-block align-text-top"
          />
          Smart Fridge
        </Link>
        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="navbarNav"
          aria-labelledby="navbarNavLabel"
          style={{ width: "50%" }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="navbarNavLabel">
              Menu
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav">
            <li className="nav-item">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                  <img
                    src="/house.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "20px" }}
                  />
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/item-scan" className={`nav-link ${location.pathname === '/item-scan' ? 'active' : ''}`}>
                  <img
                    src="/camera.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "20px" }}
                  />
                  Scan Items
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/storage" className={`nav-link ${location.pathname === '/storage' ? 'active' : ''}`}>
                  <img
                    src="/inboxes.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "20px" }}
                  />
                  Storage
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/shopping"
                  className={`nav-link ${location.pathname === '/shopping' ? 'active' : ''}`}
                >
                  <img
                    src="/handbag.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "20px" }}
                  />
                  Shopping
                </Link>
              </li>
              <hr/>
              <li className="nav-item">
                <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
                  <img
                    src="/key.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "20px" }}
                  />
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                  <img
                    src="/arrow-bar-right.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "20px" }}
                  />
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link">
                  <img
                    src="/arrow-bar-left.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "20px" }}
                  />
                  Log Out
                </button>
              </li>
              <li className="nav-item">
                <Link className="nav-link disabled" aria-disabled="true">
                  Disabled
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
