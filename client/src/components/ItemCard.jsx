import PropTypes from "prop-types";
import { useState } from "react";

function ItemCard({ item, index, onUpdate, onDelete }) {
  const [name, setName] = useState(item.item_name);
  const [category, setCategory] = useState(item.category);
  const [quantity, setQuantity] = useState(item.quantity);
  const [expiryDays, setExpiryDays] = useState(item.expiryDays);
  const [nameEditMode, setNameEditMode] = useState(false);
  const [categoryEditMode, setCategoryEditMode] = useState(false);
  const [quantityEditMode, setQuantityEditMode] = useState(false);
  const [expiryDaysEditMode, setExpiryDaysEditMode] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleExpiryDaysChange = (e) => {
    setExpiryDays(parseInt(e.target.value));
  };

  const handleNameClick = () => {
    setNameEditMode(true);
  };

  const handleCategoryClick = () => {
    setCategoryEditMode(true);
  };

  const handleQuantityClick = () => {
    setQuantityEditMode(true);
  };

  const handleExpiryDaysClick = () => {
    setExpiryDaysEditMode(true);
  };

  const handleNameBlur = () => {
    onUpdate(index, { ...item, item_name: name });
    setNameEditMode(false);
  };

  const handleCategoryBlur = () => {
    onUpdate(index, { ...item, category });
    setCategoryEditMode(false);
  };

  const handleQuantityBlur = () => {
    onUpdate(index, { ...item, quantity });
    setQuantityEditMode(false);
  };

  const handleExpiryDaysBlur = () => {
    onUpdate(index, { ...item, expiryDays });
    setExpiryDaysEditMode(false);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
    onUpdate(index, { ...item, quantity: quantity + 1 });
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      onUpdate(index, { ...item, quantity: quantity - 1 });
    }
  };

  const increaseExpiryDays = () => {
    setExpiryDays(expiryDays + 1);
    onUpdate(index, { ...item, expiryDays: expiryDays + 1 });
  };

  const decreaseExpiryDays = () => {
    if (expiryDays > 1) {
      setExpiryDays(expiryDays - 1);
      onUpdate(index, { ...item, expiryDays: expiryDays - 1 });
    }
  };
  
  const handleKeyDown = (event, handleBlur) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleBlur(); // Handle blur event
    }
  };

  return (
    <div className="px-4 py-2 border mb-2 rounded-5 bg-secondary shadow-sm">
      <div className="d-flex">
        {nameEditMode ? (
          <input
            className="form-control ms-auto"
            type="text"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyDown={(event) => handleKeyDown(event, handleNameBlur)}
          />
        ) : (
          <>
            <h5
              className="ms-auto"
              onClick={handleNameClick}
              style={{ cursor: "pointer" }}
            >
              {item.item_name}
            </h5>
            <img
              id="buttons"
              className="ms-auto"
              src="/trash.png"
              alt=""
              onClick={onDelete}
              style={{ width: "25px", height: "25px", cursor: "pointer" }}
            />
          </>
        )}
      </div>
      <div className="d-flex mb-1">
        {categoryEditMode ? (
          <div className="d-flex align-items-center">
            <input
              className="form-control me-auto my-auto"
              type="text"
              value={category}
              onChange={handleCategoryChange}
              onBlur={handleCategoryBlur}
              onKeyDown={(event) => handleKeyDown(event, handleNameBlur)}
            />
          </div>
        ) : (
          <>
            <h6 className="mb-1" style={{ width: "50%" }}>
              Category:
            </h6>
            <h6
              className="me-auto my-auto"
              onClick={handleCategoryClick}
              style={{ cursor: "pointer" }}
            >
              {item.category}
            </h6>
          </>
        )}
      </div>
      {/* Render quantity section */}
      <div className="d-flex mb-1">
        {quantityEditMode ? (
          <div className="d-flex align-items-center">
            <input
              className="form-control me-auto my-auto"
              type="number"
              min={1}
              value={quantity}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
              onKeyDown={(event) => handleKeyDown(event, handleNameBlur)}
            />
          </div>
        ) : (
          <>
            <h6 className="mb-1" style={{ width: "50%" }}>
              Quantity:
            </h6>
            <h6
              className="me-auto my-auto"
              onClick={handleQuantityClick}
              style={{ cursor: "pointer" }}
            >
              {item.quantity}
            </h6>
            <div className="d-flex align-items-center">
              <img
                className="me-1"
                id="buttons"
                src="/add-btn.png"
                alt=""
                onClick={increaseQuantity}
                style={{ width: "25px", height: "25px", cursor: "pointer" }}
              />
              <img
                src="/minus-btn.png"
                id="buttons"
                alt=""
                onClick={decreaseQuantity}
                style={{ width: "25px", height: "25px", cursor: "pointer" }}
              />
            </div>
          </>
        )}
      </div>
      {/* Render expiration section */}
      <div className="d-flex">
        {expiryDaysEditMode ? (
          <div className="d-flex align-items-center">
            <input
              className="form-control me-auto my-auto"
              type="number"
              min={1}
              value={expiryDays}
              onChange={handleExpiryDaysChange}
              onBlur={handleExpiryDaysBlur}
              onKeyDown={(event) => handleKeyDown(event, handleNameBlur)}
            />
          </div>
        ) : (
          <>
            <h6 className="mb-1" style={{ width: "50%" }}>
              Expiry Days:
            </h6>
            <h6
              className="me-auto my-auto "
              onClick={handleExpiryDaysClick}
              style={{ cursor: "pointer" }}
            >
              {item.expiryDays}
            </h6>
            <div className="d-flex align-items-center">
              <img
                className="me-1"
                id="buttons"
                src="/add-btn.png"
                alt=""
                onClick={increaseExpiryDays}
                style={{ width: "25px", height: "25px", cursor: "pointer" }}
              />
              <img
                src="/minus-btn.png"
                id="buttons"
                alt=""
                onClick={decreaseExpiryDays}
                style={{ width: "25px", height: "25px", cursor: "pointer" }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

ItemCard.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ItemCard;
