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
          <div className="modal-content bg-secondary">
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
                placeholder="Fridge"
                value={inputValue}
                onChange={handleInputChange}
                className="form-control border-warning border-opacity-50"
              />
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className={`btn btn-primary border-warning border-opacity-50 ${
                  inputValue.trim() === "" ? "disabled" : ""
                }`}
                onClick={handleSave}
                disabled={inputValue.trim() === ""}
              >
                <h5 className="mb-0">Create</h5>
              </button>
              <button
                type="button"
                className="btn btn-warning border-opacity-10"
                onClick={() => setIsModalOpen(false)}
              >
                <h5 className="mb-0">Cancel</h5>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="fixed-bottom text-center"
        style={{ marginBottom: "9svh" }}
      >
        <button
          type="button"
          className="btn btn-secondary border-dark-subtle rounded-4 w-50 mt-1 py-2"
          style={{maxWidth: "200px"}}
          onClick={() => setIsModalOpen(true)}
        >
          <h6 className="m-0">New Storage</h6>
        </button>
      </div>
    </>
  );
}
