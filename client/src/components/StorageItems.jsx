import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemCard from "./ItemCard"; // Import the ItemCard component

export default function StorageItems() {
  const { storage_name } = useParams();
  const [items, setItems] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/user/${storage_name}`);
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems();
    // fetchItems is a static function that doesn't
    // rely on any external variables or state inside the component.
    // It's safe to ignore the warning in this scenario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storage_name]);

  // Function to handle the click event and toggle offcanvas visibility
  const handleDivClick = async (itemId) => {
    try {
      const response = await fetch(`/api/user/${storage_name}/${itemId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch item details");
      }
      const data = await response.json();
      setSelectedItem(data.item);
      setShowOffcanvas(true); // Always set showOffcanvas to true when an item is clicked
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `/api/user/${storage_name}/${selectedItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedItem),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update item");
      }
      // Update local state with the updated item
      const updatedItem = await response.json();
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        )
      );
      // Close the offcanvas after successful update
      setShowOffcanvas(false);
      // Refetch items to update the items list
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle item deletion
  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`/api/user/${storage_name}/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      // Remove the deleted item from the local state
      setItems(items.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="list-group overflow-y-auto"
      style={{ height: "calc(100svh - 57px - 65px)" }}
    >
      {items.map((item) => (
        <ItemCard
          key={item._id}
          item={item}
          onClick={() => handleDivClick(item._id)}
          onDelete={() => handleDeleteItem(item._id)}
        />
      ))}

      {/* Offcanvas component */}
      <div
        className={`offcanvas offcanvas-top ${showOffcanvas ? "show" : ""}`}
        tabIndex="-1"
        id="offcanvasBottom"
        aria-labelledby="offcanvasBottomLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasBottomLabel">
            Offcanvas bottom
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={() => setShowOffcanvas(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {/* Offcanvas body content */}
          {selectedItem && (
            <div className="">
              <p>Name: {selectedItem.item_name}</p>
              <p>Expiry Days: {selectedItem.expiryDays}</p>
              <p>Quantity: {selectedItem.quantity}</p>
              {/* Buttons to increment and decrement quantity */}
              <a
                onClick={() =>
                  setSelectedItem((prev) => ({
                    ...prev,
                    quantity: prev.quantity + 1,
                  }))
                }
              >
                <img src="/expiry-plus.png" alt="" />
              </a>
              <button
                onClick={() =>
                  setSelectedItem((prev) => ({
                    ...prev,
                    quantity: prev.quantity - 1,
                  }))
                }
              >
                -
              </button>
              {/* Save button */}
              <button onClick={handleSave}>Save</button>
              {/* Add more details as needed */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}