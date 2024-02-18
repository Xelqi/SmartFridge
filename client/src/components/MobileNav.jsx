import { Link } from "react-router-dom";

export default function MobileNav() {
  return (
    <nav className="mobile-nav bg-body-tertiary">
      <Link to="/" className="bloc-icon">
        <img src="/house.svg" alt="" />
      </Link>
      <Link to="/item-scan" className="bloc-icon">
        <img src="/camera.svg" alt="" />
      </Link>
      <Link to="/notifications" className="bloc-icon">
        <img src="/inboxes.svg" alt="" />
      </Link>
      <Link to="/shopping" className="bloc-icon">
        <img src="/handbag.svg" alt="" />
      </Link>
      {/* <Link to="/settings" className="bloc-icon">
        <img src="/gear.svg" alt="" />
      </Link> */}
    </nav>
  );
}
