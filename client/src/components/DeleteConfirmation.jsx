import PropTypes from "prop-types";
import { useState } from "react";

const DeleteConfirmation = ({ onDeleteAccount, onCancel, user }) => {
  const [passwordInput, setPasswordInput] = useState(""); // State for password input

  const handleDelete = async () => {
    try {
      // Perform password verification here
      // For demonstration purposes, I'm assuming passwordInput matches the user's password
      if (passwordInput !== user.password) {
        alert("Incorrect password")
        throw new Error("Incorrect password");
      }

      // Call the onDeleteAccount function passed from the parent component
      await onDeleteAccount(passwordInput);
      window.location.href = "/register"; // Change the URL to the register page
    } catch (error) {
      alert("Error deleting account");
    }
  };

  return (
    <div className="modal-backdrop blur">
      <div className="modal show" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}>
        <div className="modal-dialog modal-dialog-centered"  style={{width: "80vw",
            maxWidth: "500px",}}>
          <div className="modal-content bg-secondary">
            <div className="modal-header">
              <h5 className="modal-title ms-auto">Confirm Account Deletion</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onCancel}
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete your account?</p>
              <div className="form-floating mb-0">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <label><h6 className="m-0">Password</h6></label>
              </div>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-secondary border-dark-subtle py-2" 
                onClick={handleDelete}
              >
                <h6 className="m-0">Delete Account</h6>
              </button>
              <button
                type="button"
                className="btn  btn-primary border-dark-subtle py-2"
                onClick={onCancel}
              >
                <h6 className="m-0">Cancel</h6>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmation.propTypes = {
  onDeleteAccount: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeleteConfirmation;
