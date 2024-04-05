import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function EditItem({ item, onClose, storage_name, onItemUpdate }) {
  // State to manage input values
  const [itemName, setItemName] = useState(item.item_name);
  const [category, setCategory] = useState(item.category);
  const [expiryDays, setExpiryDays] = useState(parseInt(item.expiryDays));
  const [quantity, setQuantity] = useState(parseInt(item.quantity));

  // Update state when item changes
  useEffect(() => {
    setItemName(item.item_name);
    setCategory(item.category);
    setExpiryDays(parseInt(item.expiryDays));
    setQuantity(parseInt(item.quantity));
  }, [item]);

  const handleSave = () => {
    // Validate input values
    if (quantity < 1 || expiryDays < 1 || itemName == "" || category == "") {
      alert("Names cant be empty and values must be 1 or greater");
      return;
    }

    // Construct the updated item object
    const updatedItem = {
      ...item,
      item_name: itemName,
      category: category,
      expiryDays: expiryDays,
      quantity: quantity,
    };
    // Perform update with API call
    fetch(`/api/user/${storage_name}/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Item updated:", data);
        // Call the callback function to update item details in the parent component
        onItemUpdate(updatedItem);
        // Close the popover
        onClose();
      })
      .catch((error) => {
        console.error("Error updating item:", error);
      });
  };

  return (
    <div className="edit-item-popover">
      <div className="form-floating">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="form-control rounded-4 mb-1"
          id="floatingInputItemName"
          placeholder="Item Name"
        />
        <label htmlFor="floatingInputItemName">Item Name</label>
      </div>

      <div className="form-floating">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-control rounded-4 mb-1"
          id="floatingInputCategory"
          placeholder="Category"
        />
        <label htmlFor="floatingInputCategory">Category</label>
      </div>

      <div className="form-floating">
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          className="form-control rounded-4 mb-1"
          id="floatingInputQuantity"
          placeholder="Quantity"
        />
        <label htmlFor="floatingInputQuantity">Quantity</label>
      </div>

      <div className="form-floating">
        <input
          type="number"
          value={expiryDays}
          min={1}
          onChange={(e) => setExpiryDays(parseInt(e.target.value, 10))}
          className="form-control rounded-4 "
          id="floatingInputExpiryDays"
          placeholder="Expiry Days"
        />
        <label htmlFor="floatingInputExpiryDays">Expiry Days</label>
      </div>

      <div className="d-flex justify-content-center mt-2">
        <button
          className="btn bg-white border-dark-subtle me-1 rounded-4"
          onClick={handleSave}
        >
          <p className="p-0 m-0">Save</p>
        </button>
        <button
          className="btn bg-white border-dark-subtle ms-1 rounded-4"
          onClick={onClose}
        >
          <p className="p-0 m-0">Cancel</p>
        </button>
      </div>
    </div>
  );
}

EditItem.propTypes = {
  item: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  storage_name: PropTypes.string.isRequired,
  onItemUpdate: PropTypes.func.isRequired,
};

export default EditItem;
