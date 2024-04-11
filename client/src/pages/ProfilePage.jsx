import { useState, useEffect } from "react";
import ChangePasswordForm from "../components/ChangePassword";
import DeleteConfirmation from "../components/DeleteConfirmation";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [passwordInput, setPasswordInput] = useState(""); // State for password input
  const [changingPassword, setChangingPassword] = useState(false); // State for changing password mode
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for showing delete confirmation modal

  useEffect(() => {
    // Fetch user details when component mounts
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/profile/", {
          method: "GET",
          headers: {
            // Add any necessary headers for authentication
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const userData = await response.json();
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();

    // Cleanup function
    return () => {
      // Optionally, perform cleanup or cancel any pending requests
    };
  }, []); // Empty dependency array to run effect only once

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEditDetails = () => {
    setEditing(true);
    // Initialize edited user with current user data
    setEditedUser({ ...user });
    // Clear the password input field
    setPasswordInput("");
  };

  const handleCancelEdit = () => {
    setEditing(false);
    // Reset editedUser to null
    setEditedUser(null);
    // Clear the password input field
    setPasswordInput("");
  };

  const handleSaveChanges = async () => {
    try {
      // Perform password verification here
      // For demonstration purposes, I'm assuming passwordInput matches the user's password
      if (passwordInput !== user.password) {
        alert("Incorrect password");
        throw new Error("Incorrect password");
      }

      // Send edited user data to the server
      const response = await fetch("/api/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add any necessary headers for authentication
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      // Update user state with editedUser
      setUser(editedUser);
      setEditing(false);
      setEditedUser(null); // Reset editedUser to null
      // Clear the password input field
      setPasswordInput("");
      alert("Changed Successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error: Failed to fetch user details</div>;
  }

  const handleChangePassword = () => {
    setChangingPassword(true);
    setEditing(false); // Disable editing mode
    // Reset editedUser to null
    setEditedUser(null);
    // Clear password input field
    setPasswordInput("");
  };

  const handleCancelChangePassword = () => {
    setChangingPassword(false);
  };

  if (changingPassword) {
    return (
      <ChangePasswordForm onCancel={handleCancelChangePassword} user={user} />
    );
  }

  const handleDeleteAccount = async () => {
    try {
      // Perform delete account action
      const response = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          // Add any necessary headers for authentication
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      // Clear all cookies
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [name] = cookie.split("=");
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
      alert("Account deleted successfully!");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "calc(100vh - 57px - 65px)" }}
    >
      <div className="w-75 d-flex flex-column mx-auto my-auto text-center">
        <h1 className="mx-auto text-center fw-bold fst-italic">
          Profile Details
        </h1>
        {/* Username */}
        <div className="form-floating mb-4 mt-4">
          <input
            type="text"
            className="form-control rounded-4"
            id="floatingUsername"
            placeholder="Username"
            value={editing ? editedUser.username : user.username}
            readOnly={!editing} // Make the input read-only when not editing
            onChange={(e) =>
              setEditedUser({ ...editedUser, username: e.target.value })
            } // Update editedUser when input changes
          />
          <label htmlFor="floatingUsername">
            <p>Username</p>
          </label>
        </div>
        {/* Email */}
        <div className="form-floating mb-4">
          <input
            type="email"
            className="form-control rounded-4"
            id="floatingEmail"
            placeholder="name@example.com"
            value={editing ? editedUser.email : user.email}
            readOnly={!editing} // Make the input read-only when not editing
            onChange={(e) =>
              setEditedUser({ ...editedUser, email: e.target.value })
            } // Update editedUser when input changes
          />
          <label htmlFor="floatingEmail">
            <p>Email address</p>
          </label>
        </div>
        {/* Current Password */}
        {editing ? (
          <div className="form-floating mb-4" style={{ position: "relative" }}>
            <input
              type="password"
              className="form-control rounded-4"
              id="floatingNewPassword"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)} // Update passwordInput when input changes
            />
            <label htmlFor="floatingNewPassword">
              <p>Password</p>
            </label>
          </div>
        ) : (
          <div className="form-floating mb-4" style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control rounded-4"
              id="floatingPassword"
              placeholder="Current Password"
              value={editing ? editedUser.password : user.password}
              name="password"
              readOnly={!editing} // Make the input read-only when not editing
              onChange={(e) =>
                setEditedUser({ ...editedUser, password: e.target.value })
              } // Update editedUser when input changes
            />
            <label htmlFor="floatingPassword">
              <p>Current Password</p>
            </label>
            <img
              src={showPassword ? "/eye.png" : "/crossed-eye.png"}
              alt={showPassword ? "Hide" : "Show"}
              style={{
                width: "22px",
                height: "22px",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
              onClick={togglePasswordVisibility}
            />
          </div>
        )}
        {/* Button group */}
        {editing ? (
          <div
            className="btn-group mb-4"
            role="group"
            aria-label="Edit buttons"
          >
            <button
              type="button"
              className="btn btn-secondary border-dark-subtle rounded-start-4"
              onClick={handleSaveChanges}
            >
              <p className="m-0">Save</p>
            </button>
            <button
              type="button"
              className="btn btn-secondary border-dark-subtle rounded-end-4"
              onClick={handleCancelEdit}
            >
              <p className="m-0">Cancel</p>
            </button>
          </div>
        ) : (
          <div
            className="btn-group mb-4"
            role="group"
            aria-label="Edit buttons"
          >
            <button
              type="button"
              className="btn btn-secondary border-dark-subtle rounded-start-4"
              onClick={handleEditDetails}
            >
              <p className="m-0">Edit Details</p>
            </button>
            <button
              type="button"
              className="btn btn-secondary border-dark-subtle rounded-end-4"
              onClick={handleChangePassword}
            >
              <p className="m-0">Change Password</p>
            </button>
          </div>
        )}
        {/* Delete Account */}
        {!editing && (
          <button
            type="button"
            className="btn btn-secondary border-dark-subtle rounded-4 w-75 mx-auto mb-3"
            style={{maxWidth: "300px"}}
            onClick={() => setShowDeleteConfirmation(true)} // Show delete confirmation modal
          >
            <p className="m-0">Delete Account</p>
          </button>
        )}
        {showDeleteConfirmation && (
          <DeleteConfirmation
            user={user}
            onDeleteAccount={handleDeleteAccount}
            onCancel={() => setShowDeleteConfirmation(false)} // Close delete confirmation modal
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
