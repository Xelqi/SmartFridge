import PropTypes from "prop-types"; // Import PropTypes
import { Link } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useState and useEffect

export default function Storages({ storages, sharedStorages }) {
  const [topHalfHeight, setTopHalfHeight] = useState(0); // State to store the height of the top-half element

  useEffect(() => {
    // Function to fetch the height of the top-half element
    const updateTopHalfHeight = () => {
      const topHalfElement = document.getElementById("top-half");
      if (topHalfElement) {
        const height = topHalfElement.clientHeight;
        setTopHalfHeight(height);
      }
    };

    updateTopHalfHeight(); // Call the function initially

    // Update the height whenever the window is resized
    window.addEventListener("resize", updateTopHalfHeight);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", updateTopHalfHeight);
    };
  }, []);

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
      const token = localStorage.getItem("accessToken"); // Assuming you're using JWT for authentication and storing the access token in localStorage

      const response = await fetch(`/api/user/${storageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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

   // Function to leave other user's storage
 // Function to leave other user's storage
 const leaveOtherUsersStorage = async (storageId, targetUserId) => {
  try {

    const leaveResponse = await fetch(`/api/storage/leave-storage`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target_user_id: targetUserId,
        storage_id: storageId,
      }),
    });

    if (!leaveResponse.ok) {
      throw new Error("Failed to leave storage");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error leaving storage:", error);
  }
};

  // PropTypes validation
  Storages.propTypes = {
    storages: PropTypes.array.isRequired, // Validate that storages is an array and is required
    sharedStorages: PropTypes.array.isRequired, // Validate that sharedStorages is an array and is required
  };

  return (
    <div className="container mt-2 overflow-y-auto" style={{ height: `calc(100vh - 57px - 65px - 130px - ${topHalfHeight}px)` }}>
      {storages.map((storage) => (
        <Link
          key={storage._id} // Change to a unique identifier for the storage
          to={"/storage/" + storage._id} // Change to a route for the storage
          className="card mb-3 rounded-5 shadow-sm text-decoration-none bg-secondary mx-auto bg-secondary shadow-sm"
          style={{ cursor: "pointer", maxWidth: "500px" }}
        >
          <div className="card-body">
            <div className="card-title d-flex justify-content-between align-items-baseline fw-normal mb-0">
              <div style={{ width: "25px" }}></div>
              <h3 className="mx-auto fst-italic">{storage.storage_name}</h3>
              <button
                className="btn p-0 m-0"
                id="buttons"
                onClick={(event) => {
                  event.preventDefault();
                  deleteStorage(storage._id)
                    .then(() => {
                      window.location.reload();
                    })
                    .catch((error) => {
                      console.error("Error deleting storage:", error);
                    });
                }}
              >
                <img src="/trash.png" alt="" style={{ cursor: "pointer", width: "25px", height: "25px" }} />
              </button>
            </div>
            <div className="d-flex flex-column mt-2">
              <div className="d-flex">
                <h5 className="me-auto ms-3">Items:</h5>
                <h5 className="me-2 fst-italic">{storage.items.length}</h5>
              </div>
              <div className="d-flex">
                <h5 className="me-auto ms-3">Expiring Soon:</h5>
                <h5 className="me-2 fst-italic">{countExpiringItems(storage.items)}</h5>
              </div>
            </div>
          </div>
        </Link>
      ))}
      {sharedStorages.map((storage) => (
        <Link
          key={storage.storage_id} // Change to a unique identifier for the storage
          to={"/shared-storage/" + storage.storage_id} // Change to a route for the storage
          className="card mb-3 rounded-5 shadow-sm text-decoration-none bg-secondary mx-auto bg-secondary shadow-sm"
          style={{ cursor: "pointer", maxWidth: "500px" }}
        >
          <div className="card-body">
            <div className="card-title d-flex justify-content-between align-items-baseline fw-normal mb-0">
            <div style={{ width: "25px" }}></div>
              <h3 className="mx-auto fst-italic">{storage.username}'s {storage.storage_name}</h3>
              <button
                className="btn p-0 m-0"
                id="buttons"
                onClick={(event) => {
                  event.preventDefault();
                  const confirmLeave = window.confirm("Are you sure you want to leave this shared storage? Once you leave, you can only join by being added by a storage owner.");
                  if (confirmLeave) {
                    leaveOtherUsersStorage(storage.storage_id, storage.user_id)
                      .catch((error) => {
                        console.error("Error leaving storage:", error);
                      });
                  }
                }}
              >
                <img src="/trash.png" alt="" style={{ cursor: "pointer", width: "25px", height: "25px" }} />
              </button>
            </div>
            <div className="d-flex flex-column mt-2">
              <div className="d-flex">
                <h5 className="me-auto ms-3">Items:</h5>
                <h5 className="me-2 fst-italic">{storage.items.length}</h5>
              </div>
              <div className="d-flex">
                <h5 className="me-auto ms-3">Expiring Soon:</h5>
                <h5 className="me-2 fst-italic">{countExpiringItems(storage.items)}</h5>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}