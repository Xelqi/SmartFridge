import { useEffect, useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";

export default function Recipe() {
  let params = useParams();
  const [details, setDetails] = useState({});
  const [activeTab, setActiveTab] = useState("instructions");
  const [firstRowHeight, setFirstRowHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [topbarHeight, settopbarHeight] = useState(0);

  useEffect(() => {
    fetchDetails();
  }, [params.id]);

  useLayoutEffect(() => {
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
  }, [details.title]); // Trigger the effect when the title changes

  const fetchDetails = async () => {
    const storedVeganData = localStorage.getItem("vegan");
    const storedPopularData = localStorage.getItem("popular");

    if (storedVeganData && storedPopularData) {
      // Check if recipe data exists in localStorage
      const veganRecipes = JSON.parse(storedVeganData);
      const popularRecipes = JSON.parse(storedPopularData);

      const recipe =
        veganRecipes.find((recipe) => recipe.id === parseInt(params.id)) ||
        popularRecipes.find((recipe) => recipe.id === parseInt(params.id));

      if (recipe) {
        // Recipe found in localStorage, set details
        setDetails(recipe);
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
    const apiKey = import.meta.env.VITE_API_KEY; // Accessing environment variable
    const data = await fetch(
      `https://api.spoonacular.com/recipes/${params.id}/information?apiKey=${apiKey}`
    );
    const detailData = await data.json();
    setDetails(detailData);
  };

  const handleAddToShoppingList = async () => {
    try {
      const ingredients = details.extendedIngredients.map((ingredient) => ({
        item_name: ingredient.name,
        quantity: 1, // Default quantity
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

  return (
    <div className="container mt-2">
      <div className="row" id="first-row">
        <div className="col-lg-12">
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
                activeTab === "instructions" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setActiveTab("instructions")}
            >
              <h6 className="mb-0">Instructions</h6>
            </button>
            <button
              type="button"
              className={`btn border-dark-subtle  rounded-end-4 ${
                activeTab === "ingredients" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setActiveTab("ingredients")}
            >
              <h6 className="mb-0">Ingredients</h6>
            </button>
          </div>
        </div>
        <div
          className="col"
          style={{
            height: `calc(100svh - ${firstRowHeight}px - ${navbarHeight}px - ${topbarHeight}px - 15px)`,
            overflowY: "auto",
          }}
        >
          {activeTab === "instructions" && details.analyzedInstructions && (
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
                onClick={handleAddToShoppingList}
              >
                <h6 className="mb-0">Add to Shopping List</h6>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
