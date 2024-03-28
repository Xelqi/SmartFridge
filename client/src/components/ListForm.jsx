// ListForm.jsx
import { useState } from "react";
import PropTypes from "prop-types";

function ListForm({ onAdd }) {
  const [itemName, setItemName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd(itemName);
    setItemName(""); // Clear the input field after adding item
  };

  return (
    <form id="shopping-list-form" className="rounded-5" onSubmit={handleSubmit}>
      <input
        className="ps-2 pt-1"
        type="text"
        value={itemName}
        placeholder="Add Item"
        onChange={(event) => setItemName(event.target.value)}
      />
      <button className="rounded-5">
        <img
          src="plus-small.png"
          alt=""
          style={{ width: "25px", height: "25px", cursor: "pointer" }}
        />
      </button>
    </form>
  );
}

ListForm.propTypes = {
  onAdd: PropTypes.func,
};

export default ListForm;
