import { useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import SharedStorageEditItem from "./SharedStorageEditItem";

function SharedStoragePageItemCard({ item, onDelete, onItemNewValue, user_id }) {
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
    const newValue =
      setter === setQuantity ? quantity + value : expiryDays + value;
    // Ensure the new value is not less than 1
    if (newValue < 1) return;
    setter((prevValue) => prevValue + value);
    // Perform update with API call
    fetch(`/api/storage/update-item`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storage_id: storage_name,
        item_id: item._id,
        target_user_id: user_id,
        updatedItem: {
          quantity: setter === setQuantity ? newValue : quantity,
          expiryDays: setter === setExpiryDays ? newValue : expiryDays,
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
      
        // Pass updated values to EditItem component
        handleItemUpdate({
          ...item,
          [setter === setQuantity ? "quantity" : "expiryDays"]: newValue,
        });
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        // Revert the state change if there's an error
        setter((prevValue) => prevValue - value);
      });
  };

  return (
    <div className="px-4 py-2 border mb-2 rounded-5 bg-secondary bg-opacity-75 shadow-sm">
      {/* Conditionally render Edit button or Edit popover */}
      {isPopoverOpen ? (
        <SharedStorageEditItem
          item={{ ...item, quantity, expiryDays }}
          onClose={() => setIsPopoverOpen(false)}
          storage_name={storage_name}
          user_id={user_id}
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

          <h5
            className="ms-auto text-capitalize fst-"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "calc(100% - 70px)", // Adjusted width considering button sizes
            }}
          >
            {itemName}
          </h5>
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
            <h6
              className="me-auto my-auto fst-italic"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "calc(100% - 140px)", // Adjusted width considering button sizes
              }}
            >
              {category}
            </h6>
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
      <h6 className="me-auto my-auto fst-italic">{value}</h6>
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
      <h6 className="me-auto my-auto fst-italic">{value}</h6>
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

SharedStoragePageItemCard.propTypes = {
  item: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onItemNewValue: PropTypes.func.isRequired,
  user_id: PropTypes.string,
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

export default SharedStoragePageItemCard;
