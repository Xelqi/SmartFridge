import { useEffect, useState } from "react";
import styled from "styled-components";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { Link } from "react-router-dom";

export default function Vegetarian() {
  const [vegan, setVegan] = useState([]);

  useEffect(() => {
    getVegan();
  }, []);

  const Wrapper = styled.div`
    margin: 2rem 0rem;
  `;

  const Card = styled.div`
    min-height: 15rem;
    border-radius: 2rem;
    overflow: hidden;
    position: relative;

    img {
      border-radius: 2rem;
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    p {
      position: absolute;
      z-index: 10;
      left: 50%;
      bottom: 0%;
      transform: translate(-50%, 0%);
      color: white;
      width: 100%;
      text-align: center;
      height: 40%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  const Gradient = styled.div`
    z-index: 3;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  `;

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
        console.log(data);
        setVegan(data.recipes);
        localStorage.setItem("vegan", JSON.stringify(data.recipes));
      } catch (error) {
        console.error("Error fetching vegan recipes:", error);
      }
    }
  };
  return (
    <div>
      <Wrapper>
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
                <Card>
                  <Link to={"/recipe/" + recipe.id}>
                    <p>{recipe.title}</p>
                    <img src={recipe.image} alt={recipe.title} />
                    <Gradient />
                  </Link>
                </Card>
              </SplideSlide>
            );
          })}
        </Splide>
      </Wrapper>
    </div>
  );
}

{
  /* <div className="card" style={{ flex: '0 0 auto', marginRight: '10px'}} key={recipe.id}>
                        <img src={recipe.image} className="card-img-top" alt={recipe.title} />
                        <div className="card-body pt-1">
                            <h5 className="card-title">{recipe.title}</h5>
                            <p className="mb-0">Serves: {recipe.servings}</p>
                            <p className="mb-0">Cooking Time: {recipe.readyInMinutes}m</p>
                            {recipe.vegetarian && <p className="mb-0">Vegetarian</p>}
                            {recipe.vegan && <p className="mb-0">Vegan</p>}
                            {recipe.dairyFree && <p className="mb-0">Dairy Free</p>}
                            {recipe.glutenFree && <p className="mb-0">Gluten Free</p>}
                        </div>
                    </div> */
}
