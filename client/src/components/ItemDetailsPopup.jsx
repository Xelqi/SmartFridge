// import { useState } from "react";

// // eslint-disable-next-line react/prop-types
// const ItemDetailsPopup = ({ item, onClose }) => {
//   const [updatedItem, setUpdatedItem] = useState(item);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUpdatedItem((prevItem) => ({
//       ...prevItem,
//       [name]: value,
//     }));
//   };

//   const handleSave = () => {
//     // Send a PUT request to update the item on the server
//     // Close the popup after saving
//     onClose();
//   };

//   const handleCancel = () => {
//     // Reset the updated item to the original item
//     setUpdatedItem(item);
//     // Close the popup without saving
//     onClose();
//   };

//   return (
//     <div className="popup">
//       <div className="popup-inner">
//         <h2>Edit Item</h2>
//         <form>
//           <label>
//             Item Name:
//             <input
//               type="text"
//               name="item_name"
//               value={updatedItem.item_name}
//               onChange={handleChange}
//             />
//           </label>
//           <label>
//             Expires in (days):
//             <input
//               type="number"
//               name="expiryDays"
//               value={updatedItem.expiryDays}
//               onChange={handleChange}
//             />
//           </label>
//           <label>
//             Quantity:
//             <input
//               type="number"
//               name="quantity"
//               value={updatedItem.quantity}
//               onChange={handleChange}
//             />
//           </label>
//           <button type="button" onClick={handleSave}>
//             Save
//           </button>
//           <button type="button" onClick={handleCancel}>
//             Cancel
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ItemDetailsPopup;
