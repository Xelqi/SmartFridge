import AddShoppingList from "../components/AddShoppingList";
import ShoppingList from "../components/ShoppingList";
import { useState, useEffect } from "react";

const ShoppingCartPage = () => {
  const [shoppingLists, setShoppingLists] = useState([]);

  useEffect(() => {
    console.log("Fetching shopping lists...");
    const fetchShoppingLists = async () => {
      try {
        const response = await fetch("/api/shopping/get-all-shopping-lists");
        if (!response.ok) {
          throw new Error("Failed to fetch shopping lists");
        }
        const data = await response.json();
        setShoppingLists(data.shopping_lists);
      } catch (error) {
        console.error(error);
      }
    };

    fetchShoppingLists(); // Call the fetch function inside useEffect

    // Specify an empty dependency array to run the effect only once
  }, []);
  // Function to handle adding a shopping list
  const handleAddShoppingList = async (listName) => {
    try {
      const response = await fetch("/api/shopping/add-shopping-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ list_name: listName }),
      });

      if (!response.ok) {
        throw new Error("Failed to add shopping list");
      }

      // Fetch updated shopping lists after adding a new one
      const updatedListsResponse = await fetch(
        "/api/shopping/get-all-shopping-lists"
      );
      if (!updatedListsResponse.ok) {
        throw new Error("Failed to fetch updated shopping lists");
      }
      const updatedListsData = await updatedListsResponse.json();
      setShoppingLists(updatedListsData.shopping_lists);
    } catch (error) {
      console.error("Error adding shopping list:", error);
    }
  };

  return (
    <div className="row">
      <div className="col-11 mx-auto">
        <ShoppingList
          shoppingLists={shoppingLists}
          setShoppingLists={setShoppingLists}
        />
        <AddShoppingList onAddShoppingList={handleAddShoppingList} />
      </div>
    </div>
  );
};

export default ShoppingCartPage;
