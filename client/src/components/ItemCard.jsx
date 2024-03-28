import PropTypes from 'prop-types';

import  { useState } from "react";

function ItemCard({ item, onDelete }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [expiryDays, setExpiryDays] = useState(item.expiryDays);

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleIncreaseExpiration = () => {
    setExpiryDays((prevExpiryDays) => prevExpiryDays + 1);
  };

  const handleDecreaseExpiration = () => {
    if (expiryDays > 1) {
      setExpiryDays((prevExpiryDays) => prevExpiryDays - 1);
    }
  };

  return (
    <div className="px-4 py-2 border mb-2 rounded-5 bg-secondary shadow-sm">
      <div className="d-flex">
        <h5 className="ms-auto">{item.item_name}</h5>
        <img
          id="buttons"
          className="ms-auto"
          src="/trash.png"
          alt=""
          onClick={onDelete}
          style={{ width: "25px", height: "25px" }}
        />
      </div>
      <div className="d-flex">
        <h6 className="mb-1" style={{ width: "50%" }}>
          Category:
        </h6>
        <h6 className="me-auto my-auto">{item.category}</h6>
      </div>
      <div className="d-flex">
        <h6 className="mb-1 mt-1" style={{ width: "50%" }}>
          Quantity:
        </h6>
        <h6 className="me-auto my-auto">{quantity}</h6>
        <div className="d-flex align-items-center">
          <img
            className='me-2'
            id="buttons"
            src="/add-btn.png"
            alt=""
            onClick={handleIncreaseQuantity}
            style={{ width: "25px", height: "25px", cursor: "pointer" }}
          />
          <img
            src="/minus-btn.png"
            id="buttons"
            alt=""
            onClick={handleDecreaseQuantity}
            style={{ width: "25px", height: "25px", cursor: "pointer" }}
          />
        </div>
      </div>
      <div className="d-flex">
        <h6 className="mb-1 mt-1" style={{ width: "50%" }}>
          Expiry Days:
        </h6>
        <h6 className="me-auto my-auto">{expiryDays}</h6>
        <div className="d-flex align-items-center">
          <img
            className='me-2'
            id="buttons"
            src="/add-btn.png"
            alt=""
            onClick={handleIncreaseExpiration}
            style={{ width: "25px", height: "25px", cursor: "pointer" }}
          />
          <img
            src="/minus-btn.png"
            id="buttons"
            alt=""
            onClick={handleDecreaseExpiration}
            style={{ width: "25px", height: "25px", cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}


ItemCard.propTypes = {
    item: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
  };
  

export default ItemCard;
