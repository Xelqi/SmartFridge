import PropTypes from "prop-types"; // Import PropTypes
import { Link } from "react-router-dom";

export default function Storages({ storages }) {
  // Function to count expiring items in a storage
  function countExpiringItems(items) {
    let count = 0;
    items.forEach((item) => {
      if (item.expiryDays <= 3) {
        count++;
      }
    });
    return count;
  }

  // PropTypes validation
  Storages.propTypes = {
    storages: PropTypes.array.isRequired, // Validate that storages is an array and is required
  };

  return (
    <div
      className="container mt-2 overflow-y-auto"
      style={{ height: "calc(100vh - 57px - 65px - 50px)" }}
    >
      {storages.map((storage) => (
        <Link
          key={storage.storage_name}
          to={"/storage/" + storage.storage_name}
          className="card mb-3 rounded-5 shadow-sm text-decoration-none"
          style={{ cursor: "pointer" }}
        >
          <div className="card-body">
            <div className="card-title d-flex justify-content-between align-items-baseline fw-normal mb-0">
              <div style={{ width: "25px" }}></div>
              <h3 className="mx-auto">{storage.storage_name}</h3>
              <button
                className="btn p-0 m-0"
                id="buttons"
                onClick={() => console.log("Click")}
              >
                <img
                  src="/trash.png"
                  alt=""
                  style={{ cursor: "pointer", width: "25px", height: "25px" }}
                />
              </button>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex">
                <h5 className="me-2">Items:</h5>
                <h5 className="m-0">{storage.items.length}</h5>
              </div>
              <div className="d-flex">
                <h5 className="me-2">Expiring Soon:</h5>
                <h5 className="m-0">{countExpiringItems(storage.items)}</h5>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
