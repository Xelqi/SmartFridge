import { useState } from "react";
import PropTypes from "prop-types";

const ChangePasswordForm = ({ onCancel, user }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      // Check if the new password matches the confirmation
      if (newPassword !== confirmPassword) {
        alert("New password and confirmation password do not match");
        throw new Error("New password and confirmation password do not match");
      }

      // Check if the current password matches the user's password
      if (currentPassword !== user.password) {
        alert("Current password is incorrect");
        throw new Error("Current password is incorrect");
      }

      // Perform API call to update the user details
      const updateResponse = await fetch("/api/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!updateResponse.ok) {
        alert("Server error failed to update");
        throw new Error("Failed to update password");
      }

      // Password updated successfully
      alert("Password updated successfully!");
      // Redirect the user to another page or reload the current page
      window.location.href = "/profile"; // Replace '/profile' with the desired URL
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "calc(100vh - 57px - 65px)" }}
    >
      <div className="w-75 d-flex flex-column mx-auto my-auto text-center">
        <h1 className="mx-auto text-center fw-bold fst-italic">
          Change Password
        </h1>
        <div className="form-floating mb-4 mt-4">
          <input
            type="password"
            className="form-control rounded-4"
            id="currentPassword"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <label htmlFor="currentPassword">
            <p>Current Password</p>
          </label>
        </div>
        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control rounded-4"
            id="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label htmlFor="newPassword">
            <p>New Password</p>
          </label>
        </div>
        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control rounded-4"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label htmlFor="confirmPassword">
            <p>Confirm New Password</p>
          </label>
        </div>
        <div className="btn-group mb-4" role="group" aria-label="Edit buttons">
          <button
            className="btn btn-secondary border-dark-subtle rounded-start-4"
            onClick={handleChangePassword}
          >
            <p className="m-0">Change Password</p>
          </button>
          <button
            className="btn btn-secondary border-dark-subtle rounded-end-4"
            onClick={onCancel}
          >
            <p className="m-0">Cancel</p>
          </button>
        </div>
      </div>
    </div>
  );
};

ChangePasswordForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired, // Add validation for the user prop
};

export default ChangePasswordForm;
