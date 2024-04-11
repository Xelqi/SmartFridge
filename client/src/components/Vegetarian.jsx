import { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { Link } from "react-router-dom";

export default function Vegetarian() {
  const [vegan, setVegan] = useState([]);

  useEffect(() => {
    getVegan();
  }, []);

  const getVegan = async () => {
    const check = localStorage.getItem("vegan");
    if (check) {
      setVegan(JSON.parse(check));
    } else {
      try {
        const apiKey = import.meta.env.VITE_API_KEY; // Accessing environment variable
        const api = await fetch(
          `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=10&tags=vegan`
        );
        const data = await api.json();
        setVegan(data.recipes);
        localStorage.setItem("vegan", JSON.stringify(data.recipes));
      } catch (error) {
        console.error("Error fetching vegan recipes:", error);
      }
    }
  };
  
  return (
    <div>
      <div className="my-1">
        <h3 className="text-center">Vegan Picks</h3>
        <Splide
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
          {vegan.map((recipe) => {
            return (
              <SplideSlide key={recipe.id}>
                <div style={{ minHeight: "14rem", borderRadius: "2rem", overflow: "hidden", position: "relative" }}>
                  <Link to={"/recipe/" + recipe.id}>
                    <p style={{ position: "absolute", zIndex: 10, left: "50%", bottom: "0%", transform: "translate(-50%, 0%)", color: "white", width: "100%", textAlign: "center", height: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>{recipe.title}</p>
                    <img src={recipe.image} alt={recipe.title} style={{ borderRadius: "2rem", position: "absolute", left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ zIndex: 3, position: "absolute", width: "100%", height: "100%", background: "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))" }} />
                  </Link>
                </div>
              </SplideSlide>
            );
          })}
        </Splide>
      </div>
    </div>
  );
}
