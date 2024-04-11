import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div
      className="container-fluid bg-secondary bg-opacity-25 d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <img
        src="/logo-cropped.png"
        alt=""
        className="img-fluid"
        style={{ maxWidth: "600px", width: "70svw"}}
      />
      <h5 className="fst-italic mt-4 text-center">
         Where simplicity meets sustainability
        <hr className="mb-3 mt-4" />
      </h5>
      <p className="text-muted mb-4 text-center">
        Unlock the power of simplicity with Smart Fridge! Manage groceries
        effortlessly by snapping a photo of your receipt. Get inspiring meal
        suggestions, personalized shopping lists, and receive expiration
        reminders.<br /> Simplify your life, Save Time and Money
      </p>
      <Link
        to="/register"
        className="btn btn-secondary border-dark-subtle rounded-pill px-4 py-2"
      >
        <p className="mb-0">Get Started</p>
      </Link>
    </div>
  );
};

export default HomePage;
