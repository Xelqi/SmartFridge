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
  // Function to delete a storage
const deleteStorage = async (storageId) => {
  try {
    const token = localStorage.getItem('accessToken'); // Assuming you're using JWT for authentication and storing the access token in localStorage
    
    const response = await fetch(`/api/user/${storageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    return await response.json(); // Return the response data if successful
  } catch (error) {
    throw new Error(error.message); // Throw an error with the error message if request fails
  }
};

  // PropTypes validation
  Storages.propTypes = {
    storages: PropTypes.array.isRequired, // Validate that storages is an array and is required
  };

  return (
    <div
      className="container mt-2 overflow-y-auto "
      style={{ height: "calc(100vh - 57px - 65px - 50px)" }}
    >
      {storages.map((storage) => (
        <Link
          key={storage._id} // Change to storage._id
          to={"/storage/" + storage._id} // Change to storage._id
          className="card mb-3 rounded-5 shadow-sm text-decoration-none bg-secondary"
          style={{ cursor: "pointer" }}
        >
          <div className="card-body">
            <div className="card-title d-flex justify-content-between align-items-baseline fw-normal mb-0">
              <div style={{ width: "25px" }}></div>
              <h3 className="mx-auto">{storage.storage_name}</h3>
              <button
                className="btn p-0 m-0"
                id="buttons"
                onClick={(event) => {
                  event.preventDefault(); // Prevent the default behavior of the link
                  deleteStorage(storage._id).then(() => {
                    // Optional: If you want to refresh the page after deletion
                    window.location.reload();
                  }).catch(error => {
                    console.error('Error deleting storage:', error);
                    // Handle error, show error message to user, etc.
                  });
                }}
              >
                <img
                  src="/trash.png"
                  alt=""
                  style={{ cursor: "pointer", width: "25px", height: "25px" }}
                />
              </button>
            </div>
            <div className="d-flex flex-column mt-2">
              <div className="d-flex">
                <h5 className="me-auto fst-italic ms-3">Items:</h5>
                <h5 className="me-2">{storage.items.length}</h5>
              </div>
              <div className="d-flex">
                <h5 className="me-auto fst-italic ms-3">Expiring Soon:</h5>
                <h5 className="me-2">{countExpiringItems(storage.items)}</h5>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}