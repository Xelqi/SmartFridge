import { useState, useEffect } from "react";
import AddStorage from "../components/AddStorage";
import Storages from "../components/Storages";

const StoragePage = () => {
  const [storages, setStorages] = useState([]);
  const [sharedStorages, setSharedStorages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");

  useEffect(() => {
    async function fetchStorages() {
      try {
        const response = await fetch("/api/user/get-all-storage");
        if (!response.ok) {
          throw new Error("Failed to fetch storages");
        }
        const data = await response.json();
        setStorages(data.storages);
      } catch (error) {
        console.error(error);
      }
    }

    fetchStorages();
  }, []);

  useEffect(() => {
    async function fetchSharedStorages() {
      try {
        const response = await fetch("/api/storage/storages");
        if (!response.ok) {
          throw new Error("Failed to fetch shared storages");
        }
        const data = await response.json();
        setSharedStorages(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchSharedStorages();
  }, []);

  const handleAddStorage = async (storageName) => {
    try {
      const response = await fetch("api/user/add-storage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storage_name: storageName }),
      });
      if (!response.ok) {
        throw new Error("Failed to add Storage");
      }

      // Fetch the updated list of storages after adding a new storage
      const updatedResponse = await fetch("/api/user/get-all-storage");
      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch updated storages");
      }
      const updatedData = await updatedResponse.json();

      // Update the list of storages with the fetched updated list
      setStorages(updatedData.storages);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchUser = async (username) => {
    try {
      const response = await fetch(`/api/search/find?username=${username}`);
      if (!response.ok) {
        throw new Error("Failed to search user");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUserId(userId === selectedUserId ? "" : userId);
  };

  const handleStorageSelection = (storage) => {
    setSelectedStorage(storage);
  };

  const handleAddUserToStorage = async () => {
    try {
      const response = await fetch("/api/storage/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: selectedUserId,
          storage_id: selectedStorage._id, // Pass storage name instead of ID
        }),
      });
      if (!response.ok) {
        const errorMessage = await response.json(); // Parse the error message from JSON
        alert(errorMessage.error); // Display the error message in the alert
         // Clear search bar and user list
         setUsers([]);
         // Clear selected user
         setSelectedUserId("");
         // Clear selected storage
         setSelectedStorage("");
         // Clear search input
         document.getElementById("searchInput").value = "";
      } else {
        const responseData = await response.json();
        alert(responseData.message); // Log response data
        // Clear search bar and user list
        setUsers([]);
        // Clear selected user
        setSelectedUserId("");
        // Clear selected storage
        setSelectedStorage("");
        // Clear search input
        document.getElementById("searchInput").value = "";
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Helper function to capitalize the first letter of each word
  function capitalizeFirstLetter(string) {
    return string.replace(/\b\w/g, (match) => match.toUpperCase());
  }

  return (
    <div className="row">
      <div className="col-11 mx-auto">
        <div className="row justify-content-center" id="top-half">
          <h4 className="fst-italic text-center mt-3">
            Add Friends to Your Storages
          </h4>
          <div className="col-12">
            <input
              type="text"
              className="form-control mb-3 mx-auto rounded-4 w-50"
              placeholder="Search users..."
              onChange={(e) => handleSearchUser(e.target.value)}
            />
            <ul
              className="list-group overflow-y-scroll mb-3"
              style={{ maxHeight: "10svh" }}
            >
              {users.map((user) => (
                <li
                  key={user._id}
                  className="list-group-item bg-secondary rounded-4 mb-1 w-50 mx-auto"
                >
                  <div className="form-check">
                    <input
                      type="radio"
                      id={`user_${user._id}`}
                      className="form-check-input me-auto"
                      onChange={() => handleUserSelection(user._id)}
                      checked={user._id === selectedUserId}
                    />
                    <label
                      htmlFor={`user_${user._id}`}
                      className="form-check-label d-flex align-items-center justify-content-center"
                    >
                      <p className="mb-0">{user.username}</p>
                    </label>
                  </div>
                </li>
              ))}
            </ul>
            <div className="col-12 mx-auto text-center">
              <div className="dropdown mb-3 mx-auto">
                <button
                  className="btn btn-secondary border-dark-subtle rounded-4 w-50 mt-1"
                  type="button"
                  id="storageDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ maxWidth: "200px" }}
                >
                  <p className="m-0 p-0 dropdown-toggle">
                    {selectedStorage
                      ? capitalizeFirstLetter(selectedStorage.storage_name)
                      : "Select Storage"}
                  </p>
                </button>
                <ul
                  className="dropdown-menu bg-primary p-0 text-center w-50 rounded-4"
                  aria-labelledby="storageDropdown"
                  style={{
                    maxHeight: "10rem",
                    overflowY: "auto",
                    bottom: "100%",
                    width: "130px",
                    minWidth: "130px",
                    maxWidth: "200px",
                  }}
                >
                  {storages.map((storage) => (
                    <li key={storage._id}>
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() =>
                          handleStorageSelection(storage)
                        } // Pass storage name instead of ID
                      >
                        <p className="m-0">
                          {capitalizeFirstLetter(storage.storage_name)}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-secondary rounded-5 w-75 border-dark-subtle"
                onClick={handleAddUserToStorage}
              >
                <p className="mb-0">Add user to Storage</p>
              </button>
            </div>
          </div>
        </div>
        <Storages storages={storages} sharedStorages={sharedStorages} />
      </div>
      <AddStorage onAddStorage={handleAddStorage} />
    </div>
  );
};

export default StoragePage;