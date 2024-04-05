import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const requestData = { ...formData }; // Copy formData to requestData
      delete requestData.confirmPassword; // Remove confirmPassword field
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        const data = await response.json();
        if (
          response.status === 400 &&
          data.error &&
          data.error.includes("username")
        ) {
          alert("Username already exists"); // Display duplicate username error message
        } else if (
          response.status === 400 &&
          data.error &&
          data.error.includes("email")
        ) {
          alert("Email already exists"); // Display duplicate email error message
        } else {
          throw new Error(data.message);
        }
        return;
      }
      const data = await response.json();
      alert(data.message); // Registration success message
      window.location.href = "/login";
    } catch (error) {
      console.error("Error:", error.message); // Log generic error message
      alert("Failed to register");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center h-100 flex-column">
      <form
        onSubmit={handleSubmit}
        className="rounded-3 p-3 bg-light w-100 mb-3 mt-auto"
        style={{ maxWidth: "400px" }}
      >
        <h1 className="m-0 text-center fw-bold fst-italic mb-2">
          Create an account
        </h1>
        <p className="m-0 p-0 text-muted fs-6 text-center">
          Please fill in the following details to create an account.
        </p>
        <div className="form-floating mb-4 mt-4">
          <input
            type="text"
            className="form-control rounded-4"
            id="floatingUsername"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            name="username"
            required
            style={{ border: "1px solid #dee2e6" }}
          />
          <label htmlFor="floatingUsername">
            <p>Username</p>
          </label>
        </div>
        <div className="form-floating mb-4">
          <input
            type="email"
            className="form-control rounded-4"
            id="floatingEmail"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            name="email"
            required
          />
          <label htmlFor="floatingEmail">
            <p>Email address</p>
          </label>
        </div>
        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control rounded-4"
            id="floatingPassword"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            required
          />
          <label htmlFor="floatingPassword">
            <p>Password</p>
          </label>
        </div>
        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control rounded-4"
            id="floatingConfirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            required
          />
          <label htmlFor="floatingConfirmPassword">
            <p>Confirm Password</p>
          </label>
        </div>
        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-secondary border-dark-subtle rounded-5 w-75"
          >
            <p className="m-0 py-1 fw-bold">Register</p>
          </button>
        </div>
        <div className="mt-3 w-75 text-center d-flex justify-content-center mx-auto">
          <h6 className="d-flex flex-column">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-decoration-none text-primary d-flex mx-auto"
            >
              Log In
            </a>
          </h6>
        </div>
      </form>
    </div>
  );
}
