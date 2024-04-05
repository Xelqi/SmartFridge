import { useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import EditItem from "./EditItem";

function StoragePageItemCard({ item, onDelete, onItemNewValue }) {
  const [itemName, setItemName] = useState(item.item_name);
  const [category, setCategory] = useState(item.category);
  const [quantity, setQuantity] = useState(item.quantity);
  const [expiryDays, setExpiryDays] = useState(item.expiryDays);
  const { storage_name } = useParams();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleItemUpdate = (updatedItem) => {
    setQuantity(updatedItem.quantity);
    setExpiryDays(updatedItem.expiryDays);
    setItemName(updatedItem.item_name);
    setCategory(updatedItem.category);
    onItemNewValue(updatedItem);
  };

  const handleValueChange = (setter, value) => {
    const newValue = setter === setQuantity ? quantity + value : expiryDays + value;
    // Ensure the new value is not less than 1
    if (newValue < 1) return;
  
    setter((prevValue) => prevValue + value);
    // Perform update with API call
    fetch(`/api/user/${storage_name}/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: setter === setQuantity ? newValue : quantity,
        expiryDays: setter === setExpiryDays ? newValue : expiryDays,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Item updated:", data);
        // Pass updated values to EditItem component
        handleItemUpdate({ ...item, [setter === setQuantity ? 'quantity' : 'expiryDays']: newValue });
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        // Revert the state change if there's an error
        setter((prevValue) => prevValue - value);
      });
  };

  return (
    <div className="px-4 py-2 border mb-2 rounded-5 bg-secondary shadow-sm">
      {/* Conditionally render Edit button or Edit popover */}
      {isPopoverOpen ? (
        <EditItem
          item={{ ...item, quantity, expiryDays }}
          onClose={() => setIsPopoverOpen(false)}
          storage_name={storage_name}
          onItemUpdate={handleItemUpdate}
        />
      ) : (
        <div className="d-flex">
          <img
            id="buttons"
            src="/sedit.png"
            alt=""
            style={{ width: "22px", height: "22px" }}
            className=""
            onClick={() => setIsPopoverOpen(true)}
          />

          <h3 className="ms-auto">{itemName}</h3>
          <img
            id="buttons"
            className="ms-auto"
            src="/trash.png"
            alt=""
            onClick={onDelete}
            style={{ width: "22px", height: "22px" }}
          />
        </div>
      )}
      {/* Render other content only if popover is closed */}
      {!isPopoverOpen && (
        <>
          <div className="d-flex">
            <h6 className="mb-1" style={{ width: "50%" }}>
              Category:
            </h6>
            <h6 className="me-auto my-auto">{category}</h6>
          </div>
          {/* Render quantity section */}
          <QuantitySection
            value={quantity}
            onIncrease={() => handleValueChange(setQuantity, 1)}
            onDecrease={() => handleValueChange(setQuantity, -1)}
          />
          {/* Render expiration section */}
          <ExpirySection
            value={expiryDays}
            onIncrease={() => handleValueChange(setExpiryDays, 1)}
            onDecrease={() => handleValueChange(setExpiryDays, -1)}
          />
        </>
      )}
    </div>
  );
}

// Quantity section component
function QuantitySection({ value, onIncrease, onDecrease }) {
  return (
    <div className="d-flex">
      <h6 className="mb-1 mt-1" style={{ width: "50%" }}>
        Quantity:
      </h6>
      <h6 className="me-auto my-auto">{value}</h6>
      <div className="d-flex align-items-center">
        <img
          className="me-2"
          id="buttons"
          src="/add-btn.png"
          alt=""
          onClick={onIncrease}
          style={{ width: "22px", height: "22px", cursor: "pointer" }}
        />
        <img
          src="/minus-btn.png"
          id="buttons"
          alt=""
          onClick={onDecrease}
          style={{ width: "22px", height: "22px", cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

// Expiry section component
function ExpirySection({ value, onIncrease, onDecrease }) {
  return (
    <div className="d-flex">
      <h6 className="mb-1 mt-1" style={{ width: "50%" }}>
        Expiry Days:
      </h6>
      <h6 className="me-auto my-auto">{value}</h6>
      <div className="d-flex align-items-center">
        <img
          className="me-2"
          id="buttons"
          src="/add-btn.png"
          alt=""
          onClick={onIncrease}
          style={{ width: "22px", height: "22px", cursor: "pointer" }}
        />
        <img
          src="/minus-btn.png"
          id="buttons"
          alt=""
          onClick={onDecrease}
          style={{ width: "22px", height: "22px", cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

StoragePageItemCard.propTypes = {
  item: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onItemNewValue: PropTypes.func.isRequired,
};

QuantitySection.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
};

ExpirySection.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
};

export default StoragePageItemCard;
