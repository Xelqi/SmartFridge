import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-sm bg-body-tertiary">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link to="/" className="navbar-brand">
          <img src="/vite.svg" alt="logo" width="30" height="30" className="d-inline-block align-text-top"/>
          Smart Fridge
        </Link>
        <div className="offcanvas offcanvas-start" tabIndex="-1" id="navbarNav" aria-labelledby="navbarNavLabel" style={{width: "40%"}}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="navbarNavLabel">Menu</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/login" className="nav-link active" aria-current="page">
                  <img src="/house.svg" alt="" className="d-inline-block d-sm-none" style={{paddingRight: "20px"}} />
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  <img src="/camera.svg" alt="" className="d-inline-block d-sm-none" style={{paddingRight: "20px"}}/>
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/item-scan" className="nav-link">
                  <img src="/inboxes.svg" alt="" className="d-inline-block d-sm-none" style={{paddingRight: "20px"}} />
                  Item Scan
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link disabled" aria-disabled="true">Disabled</Link>
              </li>
            </ul>
          </div>
        </div>
      </div> 
    </nav>
  );
}
