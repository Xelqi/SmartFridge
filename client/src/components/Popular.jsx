import { useEffect, useState, useRef } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { Link } from "react-router-dom";

export default function Popular() {
  const [popular, setPopular] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10;
  const splideRef = useRef(null);

  useEffect(() => {
    const storedRecipes = localStorage.getItem("popular");
    if (storedRecipes) {
      setPopular(JSON.parse(storedRecipes));
    } else {
      fetchPopularRecipes();
    }
  }, []); // Fetch recipes only once on initial render

  useEffect(() => {
    // Scroll to the first slide when currentPage changes
    if (splideRef.current) {
      splideRef.current.go(0);
    }
  }, [currentPage]);

  const fetchPopularRecipes = async () => {
    try {
      const rapidApiKey = import.meta.env.VITE_API_RAPIDAPI_KEY; // Replace 'YOUR_RAPIDAPI_KEY' with your actual RapidAPI key
      const response = await fetch(
        'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=100',
        {
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
          },
        }
      );
      const data = await response.json();
      setPopular(data.recipes);
      localStorage.setItem('popular', JSON.stringify(data.recipes));
    } catch (error) {
      console.error('Error fetching popular recipes:', error);
    }
  };

  const handleLoadMore = () => {
    // Check if there are more recipes to display
    if (currentPage * recipesPerPage < popular.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else {
      // If at the end of the list, fetch new recipes and update local storage
      fetchPopularRecipes();
      setCurrentPage(1);
    }
  };

  return (
    <div>
      <div className="my-1">
        <h3 className="text-center">Popular Picks</h3>
        <Splide
          ref={splideRef}
          options={{
            perPage: 4,
            drag: "free",
            snap: true,
            gap: "5rem",
            arrows: false,
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
          {/* Display only the recipes for the current page */}
          {popular
            .slice((currentPage - 1) * recipesPerPage, currentPage * recipesPerPage)
            .map((recipe) => (
              <SplideSlide key={recipe.id}>
                <div
                  style={{
                    minHeight: "14rem",
                    borderRadius: "2rem",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Link to={"/recipe/" + recipe.id}>
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
        <div className="text-center mt-3">
          <button  id="buttons" className="btn btn-secondary border-dark-subtle d-flex mx-auto rounded-4 py-2 w-50" onClick={handleLoadMore}  style={{maxWidth: "200px"}}>
           <h6 className="mb-0 mx-auto">Load more recipes</h6>
          </button>
        </div>
      </div>
    </div>
  );
}
