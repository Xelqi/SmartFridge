import Popular from "../components/Popular";
import Vegetarian from "../components/Vegetarian";

const CookingPage = () => {
    return (
        <div className="row">
        <div className="col-11 mx-auto">
          <Popular/>
          <Vegetarian/>
        </div>
      </div>
    );
  };
  
  export default CookingPage;
  