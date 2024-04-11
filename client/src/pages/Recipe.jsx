import { useEffect, useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";

export default function Recipe() {
  let params = useParams();
  const [details, setDetails] = useState(null); // Initialize details state as null
  const [activeTab, setActiveTab] = useState("instructions");
  const [firstRowHeight, setFirstRowHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [topbarHeight, settopbarHeight] = useState(0);
  const [rendered, setRendered] = useState(false); // State to track whether component is rendered
  const [showItemList, setShowItemList] = useState(false); // State to track the visibility of item list
  const [selectedItems, setSelectedItems] = useState([]); // New state to hold selected items
  // Assume you have a state variable to store the items fetched from the backend
  const [storageItems, setStorageItems] = useState([]);

  useEffect(() => {
    fetchDetails();
  }, [params.id]);

  useEffect(() => {
    if (details && details.extendedIngredients) {
      setSelectedItems(details.extendedIngredients);
    }
  }, [details]);

  useEffect(() => {
    fetchAllStorageItems(); // Fetch storage items when the component mounts
  }, []);

  useLayoutEffect(() => {
    // Delay height calculation until after the component is rendered
    if (!rendered) {
      return;
    }

    const timeout = setTimeout(() => {
      const firstRow = document.getElementById("first-row");
      if (firstRow) {
        setFirstRowHeight(firstRow.offsetHeight);
      }

      const navbar = document.getElementById("bottom-navbar");
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }

      const topNavbar = document.getElementById("navbar-top");
      if (topNavbar) {
        settopbarHeight(topNavbar.offsetHeight);
      }
    }, 2000); // Wait for 2 seconds

    // Clear the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, [rendered]); // Trigger the effect when rendered state changes

  const fetchAllStorageItems = async () => {
    try {
      const response = await fetch("/api/user/get-all-storage", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Extract all item names from storages
        const allItems = data.storages.flatMap((storage) =>
          storage.items.map((item) => item.item_name)
        );
        setStorageItems(allItems); // Set the fetched item names to the state variable
      } else {
        console.error("Failed to fetch storage items");
      }
    } catch (error) {
      console.error("Error fetching storage items:", error);
    }
  };
  const fetchDetails = async () => {
    const storedPopularData = localStorage.getItem("popular");

    if (storedPopularData) {
      // Check if recipe data exists in localStorage

      const popularRecipes = JSON.parse(storedPopularData);

      const recipe = popularRecipes.find(
        (recipe) => recipe.id === parseInt(params.id)
      );

      if (recipe) {
        // Recipe found in localStorage, set details
        setDetails(recipe);
        setRendered(true);
      } else {
        // Recipe not found in localStorage, fetch from API
        fetchDataFromAPI();
      }
    } else {
      // If no data in localStorage, fetch from API
      fetchDataFromAPI();
    }
  };

  const fetchDataFromAPI = async () => {
    const data = await fetch(
      `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${params.id}/information`,
      {
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_API_RAPIDAPI_KEY,
          "X-RapidAPI-Host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        },
      }
    );
    const detailData = await data.json();
    setDetails(detailData);
    setRendered(true); // Set rendered state to true after fetching data
  };

  const capitalizeFirstLetter = (string) => {
    return string.replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const handleAddToShoppingList = async () => {
    try {
      const ingredients = selectedItems.map((ingredient) => ({
        item_name: capitalizeFirstLetter(ingredient.name),
        quantity: 1,
      }));
      const recipeName = details.title;
      const response = await fetch("/api/shopping/add-shopping-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ list_name: recipeName, items: ingredients }),
      });
      if (response.ok) {
        console.log("Shopping list created successfully");
        alert("Added Item to Shopping Lists!");
      } else {
        console.error("Failed to create shopping list");
      }
    } catch (error) {
      console.error("Error creating shopping list:", error);
    }
  };

  const toggleItemList = () => {
    setShowItemList(!showItemList);
  };

  const handleRemoveItem = (indexToRemove) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="container mt-2">
      <div className="row">
        {details && ( // Render only when details are loaded
          <>
            <div className="col-lg-12" id="first-row">
              <h2 className="text-center fst-italic">{details.title}</h2>
              <img
                src={details.image}
                alt=""
                className="img-fluid rounded-5 card shadow mx-auto"
              />
              <div
                className="btn-group my-3 d-flex justify-content-center"
                role="group"
              >
                <button
                  type="button"
                  className={`btn  border-dark-subtle rounded-start-4  ${
                    activeTab === "instructions"
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                  onClick={() => setActiveTab("instructions")}
                >
                  <h6 className="mb-0">Instructions</h6>
                </button>
                <button
                  type="button"
                  className={`btn border-dark-subtle  rounded-end-4 ${
                    activeTab === "ingredients"
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                  onClick={() => setActiveTab("ingredients")}
                >
                  <h6 className="mb-0">Ingredients</h6>
                </button>
              </div>
            </div>
            {rendered && ( // Render the col only when the component is rendered
              <div
                className="col"
                style={{
                  height: `calc(100svh - ${firstRowHeight}px - ${navbarHeight}px - ${topbarHeight}px - 30px)`,
                  overflowY: "auto",
                }}
              >
                {activeTab === "instructions" &&
                  details.analyzedInstructions && (
                    <ol className="mt-3">
                      {details.analyzedInstructions.map((instruction) =>
                        instruction.steps.map((step) => (
                          <h6 key={step.number}>
                            <li>{step.step}</li>
                          </h6>
                        ))
                      )}
                    </ol>
                  )}
                {activeTab === "ingredients" && (
                  <>
                    <ul className="mt-3">
                      {Array.from(
                        details.extendedIngredients.reduce(
                          (uniqueIngredients, ingredient) => {
                            if (!uniqueIngredients.has(ingredient.id)) {
                              uniqueIngredients.add(ingredient.id);
                              return uniqueIngredients;
                            }
                            return uniqueIngredients;
                          },
                          new Set()
                        )
                      ).map((ingredientId) => {
                        const ingredient = details.extendedIngredients.find(
                          (ing) => ing.id === ingredientId
                        );
                        return (
                          <h6 key={ingredient.id}>
                            <li>{ingredient.original}</li>
                          </h6>
                        );
                      })}
                    </ul>
                    <button
                      className="btn btn-secondary border-dark-subtle d-flex mx-auto"
                      onClick={toggleItemList}
                    >
                      <p className="mb-0">Add to shopping list</p>
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {showItemList && (
        <div className="overlay">
          <div className="item-list">
            <h3 className="text-center fst-italic">Selected Items</h3>
            <hr className="mt-0" />
            <h6 className=" text-center text-muted">
              Pick only items you need to add to shopping
            </h6>
            <ul className="overflow-y-scroll" style={{ maxHeight: "40svh" }}>
              {selectedItems.map((ingredient, index) => {
                // Check if the current ingredient name exists in the storageItems array
                const isInStorage = storageItems.some(
                  (item) => item.toLowerCase() === ingredient.name.toLowerCase()
                );

                // Define the class name based on whether the ingredient is in storage
                const className = `d-flex justify-content-between align-items-center text-capitalize mb-2 rounded-4 py-2 px-2 ${
                  isInStorage ? "bg-success" : "bg-secondary"
                }`;

                return (
                  <li className={className} key={index}>
                    <div>
                      <h5 className="my-auto ms-2">{ingredient.name}</h5>
                    </div>
                    <div className="ms-3">
                      <img
                        id="buttons"
                        src="/trash.png"
                        alt=""
                        onClick={() => handleRemoveItem(index)}
                        style={{
                          width: "23px",
                          height: "23px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="row justify-content-center">
              <div className="btn-group">
                <button
                  className="btn btn-secondary border-dark-subtle rounded-start-4"
                  onClick={handleAddToShoppingList}
                >
                  <h6 className="mb-0">Add Items</h6>
                </button>
                <button
                  className="btn btn-secondary border-dark-subtle rounded-end-4"
                  onClick={toggleItemList}
                >
                  <h6 className="mb-0">Close</h6>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
