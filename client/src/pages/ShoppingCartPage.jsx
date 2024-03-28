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

  return (
    <div className="row">
      <div className="col-11 mx-auto">
        <ShoppingList
          shoppingLists={shoppingLists}
          setShoppingLists={setShoppingLists}
        />
      </div>
    </div>
  );
};

export default ShoppingCartPage;
