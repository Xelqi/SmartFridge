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
    <nav className="navbar navbar-expand-sm bg-body-secondary">
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
        <Link to="/" className="navbar-brand d-none d-sm-block">
          <img
            src="/vite.svg"
            alt="logo"
            width="30"
            height="30"
            className="d-inline-block align-text-top"
          />
          Smart Fridge
        </Link>
         {/* Off Canvas Navbar */}
        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="navbarNav"
          aria-labelledby="navbarNavLabel"
          style={{ width: "50%" }}
        >
        <div className="offcanvas-body pe-1 pt-1 pb-0 ps-2">
          <div className="d-flex">
          {/* <h4 className="mx-auto mb-0" style={{fontFamily: "Roboto, sans-serif", fontWeight: "400"}}>Smart Fridge</h4> */}
          <button
                    type="button"
                    className="btn-close d-flex ms-auto d-sm-none"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
          ></button>
          </div>
            <ul className="navbar-nav">
            <li className="nav-item">
                <Link to="/" className={`pt-sm-0 d-flex nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                  <img
                    src="/house.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "5vw" }}
                  />
                  <p className="mb-0 mt-1" style={{fontFamily: "Roboto, sans-serif", fontWeight: "400"}}>Home</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/item-scan" className={`py-sm-0 d-flex nav-link ${location.pathname === '/item-scan' ? 'active' : ''}`}>
                  <img
                    src="/camera.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "5vw" }}
                  />
                  <p className="mb-0 mt-1" style={{fontFamily: "Roboto, sans-serif", fontWeight: "400"}}>Quick Add</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/storage" className={`py-sm-0 d-flex nav-link ${location.pathname === '/storage' ? 'active' : ''}`}>
                  <img
                    src="/inboxes.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "5vw" }}
                  />
                  <p className="mb-0 mt-1" style={{fontFamily: "Roboto, sans-serif", fontWeight: "400"}}>Storage</p>
                </Link>                
              </li>
              <li className="nav-item">
                <Link
                  to="/shopping"
                  className={`py-sm-0 d-flex nav-link ${location.pathname === '/shopping' ? 'active' : ''}`}
                >
                  <img
                    src="/cart3.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "5vw" }}
                  />
                  <p className="mb-0 mt-1" style={{fontFamily: "Roboto, sans-serif", fontWeight: "400"}}>Shopping List</p>
                </Link>
                
              </li>
              <hr className="my-1 d-sm-none" style={{transform: 'translateX(-2vw)', width: '49.3vw'}}/>
              <li className="nav-item">
                <Link to="/register" className={`py-sm-0 d-flex nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
                  <img
                    src="/key.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "5vw" }}
                  />
                  <p className="mb-0 mt-1" style={{fontFamily: "Roboto, sans-serif", fontWeight: "400"}}>Register</p>
                </Link>          
              </li>
              <li className="nav-item">
                <Link to="/login" className={`py-sm-0 d-flex nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                  <img
                    src="/arrow-bar-right.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "5vw" }}
                  />
                  <p className="mb-0 mt-1" style={{fontFamily: "Roboto, sans-serif", fontWeight: "400"}}>Login</p>
                </Link>               
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="py-sm-0 nav-link d-flex">
                  <img
                    src="/arrow-bar-left.svg"
                    alt=""
                    className="d-inline-block d-sm-none"
                    style={{ paddingRight: "5vw" }}
                  />
                  <p className="mb-0 mt-1" style={{fontFamily: "Roboto, sans-serif", fontWeight: "400"}}>Logout</p>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
