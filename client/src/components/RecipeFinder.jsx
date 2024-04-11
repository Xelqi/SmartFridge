import { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { Link } from "react-router-dom";

export default function RecipeFinder() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [userStorage, setUserStorage] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes"));
    if (storedRecipes) {
      // If recipes are stored in local storage, set the state with them
      setRecipes(storedRecipes);
      fetchUserStorage();
    } else {
      // If no recipes are stored in local storage, fetch them
      fetchRecipes();
    }
  }, []);

  const fetchUserStorage = async () => {
    try {
      const response = await fetch("api/user/get-all-storage", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      // Sort the items by expiry days before setting the state
      const sortedItems = data.storages
        .flatMap((storage) => storage.items)
        .sort((a, b) => a.expiryDays - b.expiryDays);

      setUserStorage(data.storages);
      setSelectedItems(sortedItems);
    } catch (error) {
      console.error("Error fetching user storage:", error);
    }
  };

  const handleDeleteItem = (itemId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((selectedItem) => selectedItem._id !== itemId)
    );
  };

  const fetchRecipes = async () => {
    try {
      const selectedNames = selectedItems.map((item) => item.item_name);
      const queryString = selectedNames.join(",");

      const apiKey = import.meta.env.VITE_API_KEY;
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${queryString}&number=10`
      );
      const data = await response.json();
      setRecipes(data);

      localStorage.setItem("recipes", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleSubmit = () => {
    if (selectedItems.length > 0) {
      fetchRecipes();
    }
  };

  return (
    <div className="container">
      <hr />
      <div className="my-1">
        <h3 className="text-center fst-italic mt-4">
          Find Recipes with Storage Items
        </h3>
        <h6 className="text-center fst-italic text-muted">
          Get suggested recipes based on the items you choose!
        </h6>
        <div className="row mb-2">
          {/* Map through sortedItems instead of userStorage */}
          {selectedItems.map((storageItem) => (
            <div
              key={storageItem._id}
              className="px-1"
            >
              <div
                id="task"
                className="d-flex align-items-center mb-2 w-75 mx-auto py-1"
                style={{ maxWidth: "18rem" }}
              >
                <h6 className="m-0 flex-shrink-0" style={{ width: "auto" }}>
                  Days: {storageItem.expiryDays}
                </h6>
                <div className="flex-grow-1 overflow-hidden text-center">
                  <h6
                    className="mb-0  ms-3"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {storageItem.item_name}
                  </h6>
                </div>
                <button
                  className="btn ms-auto p-0 pb-1"
                  id="buttons"
                  onClick={() => handleDeleteItem(storageItem._id)}
                >
                  <img
                    src="/trash.png"
                    alt=""
                    style={{
                      cursor: "pointer",
                      height: "20px",
                      width: "20px",
                    }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn btn-secondary border-dark-subtle d-flex mx-auto rounded-4 w-50 py-2"
          onClick={handleSubmit}
          style={{ maxWidth: "200px" }}
        >
          <h6 className="mb-0 mx-auto">Get Recipes</h6>
        </button>
        <hr />
      </div>
      <div className="mt-4 mb-4">
        <h3 className="text-center">Recipes</h3>

        <Splide
          options={{
            perPage: 4,
            drag: "free",
            gap: "1rem",
            breakpoints: {
              768: {
                perPage: 2,
              },
              640: {
                perPage: 2,
              },
              480: {
                perPage: 1,
              },
            },
          }}
        >
          {recipes.map((recipe) => (
            <SplideSlide key={recipe.id}>
              <div
                style={{
                  minHeight: "14rem",
                  borderRadius: "2rem",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Link to={`/recipe/${recipe.id}`}>
                  <p
                    style={{
                      position: "absolute",
                      zIndex: 10,
                      left: "50%",
                      bottom: "0%",
                      transform: "translate(-50%, 0%)",
                      color: "white",
                      width: "100%",
                      textAlign: "center",
                      height: "40%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {recipe.title}
                  </p>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    style={{
                      borderRadius: "2rem",
                      position: "absolute",
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      zIndex: 3,
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))",
                    }}
                  />
                </Link>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
}
