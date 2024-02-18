import { useState } from 'react';

export default function Login() {
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { fieldName, fieldValue } = e.target;
    setUserCredentials(prevCredentials => ({
      ...prevCredentials,
      [fieldName]: fieldValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userCredentials)
      });
      if (!response.ok) {
        throw new Error('Failed to login');
      }
      const data = await response.json();
      // Handle successful login, e.g., redirect to dashboard
      console.log(data.token); // Token received from server
    } catch (error) {
      console.error('Error:', error); // Handle error
    }
  };

  return (
    <div style={{ margin: "auto", width: "30%" }}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label  className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email-input"
            name='email'
            value={userCredentials.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label  className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="passowrd-input"
            name="password"
            value={userCredentials.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-secondary">
          Submit
        </button>
      </form>
    </div>
  );
}
