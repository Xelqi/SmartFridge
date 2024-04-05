import PropTypes from "prop-types";
import { useState, useRef } from "react";

export default function AddItem({ onAddItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDays, setExpiryDays] = useState("");
  const [quantity, setQuantity] = useState("");
  const modalRef = useRef(null);

  const handleSave = async () => {
    try {
      // Check if any required field is empty
      if (!itemName || !category || !expiryDays || !quantity) {
        return alert("Please fill out all fields");
      }
  
      // Check if quantity and expiryDays are greater than 0
      const parsedExpiryDays = parseInt(expiryDays);
      const parsedQuantity = parseInt(quantity);
      if (parsedExpiryDays <= 0 || parsedQuantity <= 0) {
        return alert("Expiry days and quantity must be greater than 0");
      }
  
      // Construct the new item object
      const newItem = {
        item_name: itemName,
        category: category,
        expiryDays: parsedExpiryDays,
        quantity: parsedQuantity,
      };
  
      // Call the onAddItem function with the new item
      await onAddItem(newItem);
  
      // Reset input values and close modal
      setItemName("");
      setCategory("");
      setExpiryDays("");
      setQuantity("");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  AddItem.propTypes = {
    onAddItem: PropTypes.func.isRequired,
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
              <h5 className="modal-title">Add Item</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="form-control border-warning border-opacity-50"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control border-warning border-opacity-50"
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  placeholder="Expiry Days"
                  value={expiryDays}
                  min={1} // Ensures the value is greater than 0
                  onChange={(e) => setExpiryDays(e.target.value)}
                  className="form-control border-warning border-opacity-50"
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  min={1} // Ensures the value is greater than 0
                  onChange={(e) => setQuantity(e.target.value)}
                  className="form-control border-warning border-opacity-50"
                />
              </div>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-primary border-warning border-opacity-50"
                onClick={handleSave}
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
        style={{ marginBottom: "10vh" }}
      >
        <button
          type="button"
          className="btn btn-secondary border-dark-subtle"
          onClick={() => setIsModalOpen(true)}
        >
          <h6 className="p-0 m-0">New Item</h6>
        </button>
      </div>
    </>
  );
}
