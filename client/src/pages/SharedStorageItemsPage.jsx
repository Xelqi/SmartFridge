import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SharedStoragePageItemCard from "../components/SharedStoragePageItemCard";
import AddItem from "../components/AddItem";

const SharedStorageItemPage = () => {
  const { storage_name } = useParams();
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetchSharedStorages();
  }, [storage_name]);

  async function fetchSharedStorages() {
    try {
      const response = await fetch("/api/storage/storages");
      if (!response.ok) {
        throw new Error("Failed to fetch shared storages");
      }
      const data = await response.json();

      // Find the storage with storage_id matching storage_name
      const matchedStorage = data.find(
        (storage) => storage.storage_id === storage_name
      );
      if (!matchedStorage) {
        throw new Error("Storage not found");
      }

      // Extract items from the matched storage
      const items = matchedStorage.items;

      // Extract user_id from the matched storage
      const userId = matchedStorage.user_id;

      // Set the items to the state variable
      setItems(items);

      // Set the user_id to the state variable
      setUserId(userId);

    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`/api/storage/remove-item`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storage_id: storage_name, // Provide the storage ID
          item_id: itemId, // Provide the item ID to delete
          target_user_id: userId, // Provide the target user ID
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      setItems(items.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddItem = async (newItemData) => {
    try {
      const itemsToAdd = Array.isArray(newItemData) ? newItemData : [newItemData]; // Ensure newItemData is an array
      const response = await fetch(`/api/storage/add-to-storage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storage_id: storage_name,
          items: itemsToAdd,
          target_user_id: userId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add item");
      }
      fetchSharedStorages();
    } catch (error) {
      console.error(error);
    }
  };

  const handleItemUpdate = (updatedItem) => {
    // Find the index of the updated item
    const index = items.findIndex((item) => item._id === updatedItem._id);
    // Create a new array with the updated item
    const updatedItems = [...items];
    updatedItems[index] = updatedItem;
    // Update the state with the new array
    setItems(updatedItems);
  };

  return (
    <div className="row">
      <div className="col-11 mx-auto">
        <AddItem onAddItem={handleAddItem} />
        <div
          className="list-group overflow-y-auto"
          style={{ height: "calc(100svh - 57px - 65px - 70px)" }}
        >
          {items.map((item) => (
            <SharedStoragePageItemCard
              key={item._id}
              item={item}
              user_id={userId}
              onDelete={() => handleDeleteItem(item._id)}
              onItemNewValue={handleItemUpdate} // Pass the handleItemUpdate function
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharedStorageItemPage;
