import PropTypes from "prop-types";
import { useState, useRef } from "react";

export default function AddStorage({ onAddStorage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const modalRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = async () => {
    try {
      await onAddStorage(inputValue);
      setInputValue(""); // Reset input value after adding storage
      setIsModalOpen(false); // Close modal after adding storage
    } catch (error) {
      console.error(error);
    }
  };

  AddStorage.propTypes = {
    onAddStorage: PropTypes.func.isRequired,
  };

  return (
    <>
      {isModalOpen && <div className="modal-backdrop blur"></div>}
      <div
        id="add-storage-div"
        className={`modal ${isModalOpen ? "show" : ""}`}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          ref={modalRef}
          style={{
            transform: `translateY(${isModalOpen ? "0%" : "100%"})`,
            transition: "transform 0.3s ease-in-out",
            width: "80vw",
            maxWidth: "500px",
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Enter storage name</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Example: Fridge"
                value={inputValue}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSave}
              >
                <h5 className="mb-0">Create</h5>
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setIsModalOpen(false)}
              >
                <h5 className="mb-0">Cancel</h5>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-5">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setIsModalOpen(true)}
        >
          <h5 className="p-0 mb-1">Create New Storage</h5>
        </button>
      </div>
    </>
  );
}
