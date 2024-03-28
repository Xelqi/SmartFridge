import Checkbox from "./Checkbox";
import PropTypes from "prop-types";
import { useState } from "react";

function ShoppingListItem({ item, onToggle, onDelete, onRename }) {
  const { item_name, checked, quantity, _id } = item;
  const [editedItemName, setEditedItemName] = useState(item_name);
  const [editMode, setEditMode] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(quantity);

  // Handle input change
  const handleInputChange = (event) => {
    setEditedItemName(event.target.value);
  };

  // Handle blur event on input field
  const handleBlur = () => {
    setEditMode(false); // Exit edit mode
    // Call onRename with the updated item name and ID
    onRename(_id, editedItemName);
  };

  // Handle key down event on input field
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleBlur(); // Handle blur event
    }
  };

  const handleIncreaseQuantity = () => {
    const newQuantity = itemQuantity + 1;
    setItemQuantity(newQuantity);
    // Update the quantity in the database
    onRename(_id, editedItemName, newQuantity);
  };

  const handleDecreaseQuantity = () => {
    if (itemQuantity > 1) {
      const newQuantity = itemQuantity - 1;
      setItemQuantity(newQuantity);
      // Update the quantity in the database
      onRename(_id, editedItemName, newQuantity);
    }
  };

  return (
    <div
      id={"task"}
      className={`d-flex align-items-center ${checked ? "checked" : ""}`}
      style={{ flexWrap: "nowrap" }} // Ensure items don't wrap
    >
      <Checkbox checked={checked} onClick={() => onToggle(!checked, _id)} />

      {!editMode && (
        <h5
          onClick={() => setEditMode(true)}
          className="m-0 ms-3 pt-1"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "calc(100% - 132px)", // Adjusted width considering button sizes
          }}
        >
          {item_name}
        </h5>
      )}
      {editMode && (
        <form>
          <input
            type="text"
            value={editedItemName}
            onChange={handleInputChange}
            onBlur={handleBlur} // Handle blur event
            onKeyDown={handleKeyDown} // Handle key down event
          />
        </form>
      )}
      <button className="btn p-0 ms-auto" onClick={handleIncreaseQuantity}>
        <img
          src="fi-br-angle-small-left.svg"
          alt=""
          id="buttons"
          style={{ cursor: "pointer", height: "24px", width: "24px" }}
        />
      </button>
      <h4 className="m-0 pt-1">{itemQuantity}</h4>
      <button className="btn p-0" onClick={handleDecreaseQuantity}>
        <img
          src="fi-br-angle-small-right.svg"
          alt=""
          id="buttons"
          style={{ cursor: "pointer", height: "24px", width: "24px" }}
        />
      </button>
      <button className="btn px-1" id="buttons" onClick={() => onDelete(_id)}>
        <img src="/trash.png" alt="" style={{ cursor: "pointer" }} />
      </button>
    </div>
  );
}

ShoppingListItem.propTypes = {
  item: PropTypes.shape({
    item_name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    quantity: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
};

export default ShoppingListItem;
