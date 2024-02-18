import { Link } from "react-router-dom"

export default function Sidebar() {
  return (
    <>
    <a className="navbar-toggler-icon" data-bs-toggle="offcanvas" href="#sideBar" role="button" aria-controls="sideBar">
    </a>
    <div className="offcanvas offcanvas-start" tabIndex="-1" id="sideBar" aria-labelledby="offcanvasSideBarLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasSideBarLabel">Smart Fridge</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
      <ul className="nav nav-pills flex-column mb-auto">
      <Link to="/" className="nav-link text-white text" >
        <img src="/house.svg" alt=""  style={{paddingRight: "20px"}}/>
        Home
      </Link>
      <Link to="/item-scan" className="nav-link text-white" >
        <img src="/camera.svg" alt="" style={{paddingRight: "20px"}} />
        Add Items
      </Link>
      <Link to="/notifications" className="nav-link text-white" >
        <img src="/inboxes.svg" alt=""  style={{paddingRight: "20px"}}/>
        Storage
      </Link>
      <Link to="/shopping" className="nav-link text-white">
        <img src="/handbag.svg" alt=""  style={{paddingRight: "20px"}}/>
        Shopping
      </Link>
    </ul>
      </div>
    </div>
    </>
  )
}

