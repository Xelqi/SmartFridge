import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StoragePageItemCard from "../components/StoragePageItemCard";
import AddItem from "../components/AddItem";

const StorageItemsPage = () => {
  const { storage_name } = useParams();
  const [items, setItems] = useState([]);

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
  }, [storage_name]);

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`/api/user/${storage_name}/${itemId}`, {
        method: "DELETE",
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
      const response = await fetch(`/api/user/add-item/${storage_name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newItemData)
      });
      if (!response.ok) {
        throw new Error("Failed to add item");
      }
      fetchItems();
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
        <div className="list-group overflow-y-auto" style={{ height: "calc(100svh - 57px - 65px - 70px)" }}>
          {items.map((item) => (
            <StoragePageItemCard
              key={item._id}
              item={item}
              onDelete={() => handleDeleteItem(item._id)}
              onItemNewValue={handleItemUpdate} // Pass the handleItemUpdate function
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorageItemsPage;
