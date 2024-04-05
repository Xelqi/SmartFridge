import { useState } from "react";

export default function Login() {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if email or password is empty
    if (!userCredentials.email || !userCredentials.password) {
      console.error("Error: Email or password cannot be empty");
      return; // Exit the function early
    }

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });
      if (!response.ok) {
        alert("Invalid details failed to log in")
        throw new Error("Failed to login");
        
      }
      const data = await response.json();
      console.log(data.token);
      window.location.href = "/";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center h-100 flex-column">
      <div className="w-75 mt-auto mb-auto d-sm-block d-md-none">
        <img src="/logo-cropped.png" alt="" className="img-fluid" />
      </div>
      <h1 className="m-0 text-center fw-bold fst-italic">Let's sign you in.</h1>
      <p className="m-0 p-0 text-muted fs-6">
        Sign in using your details during registration
      </p>
      <form
        onSubmit={handleSubmit}
        className="rounded-3 p-3 bg-light w-100 mb-3"
        style={{ maxWidth: "400px" }}
      >
        <div className="form-floating mb-4">
          <input
            type="email"
            className="form-control rounded-4"
            id="floatingInput"
            placeholder="name@example.com"
            value={userCredentials.email}
            onChange={handleChange}
            name="email"
            required
          />
          <label htmlFor="floatingInput">
            <p>Email address</p>
          </label>
        </div>
        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control rounded-4"
            id="floatingPassword"
            placeholder="Password"
            value={userCredentials.password}
            onChange={handleChange}
            name="password"
            required
          />
          <label htmlFor="floatingPassword">
            <p>Password</p>
          </label>
        </div>

        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-secondary border-dark-subtle rounded-5 w-75"
          >
            <p className="m-0 py-1 fw-bold">Log In</p>
          </button>
        </div>
        <div className="mt-3 w-75 text-center d-flex justify-content-center mx-auto">
          <h6 className="d-flex flex-column">
            Dont have an account?{" "}
            <a
              href="/register"
              className="text-decoration-none text-primary d-flex mx-auto"
            >
              Register Now
            </a>
          </h6>
        </div>
      </form>
    </div>
  );
}
