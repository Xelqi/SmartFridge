import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import ItemCard from "./ItemCard"; // Import the ItemCard component

export default function ItemScanList() {
  const [file, setFile] = useState();
  const [backendResponse, setBackendResponse] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState("");
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle image upload and OCR processing
  function handleChange(e) {
    const selectedFile = e.target.files[0];

    setFile(URL.createObjectURL(selectedFile));

    if (selectedFile) {
      // Reset backendResponse state when a new file is selected
      setBackendResponse([]);
      setLoading(true);
      Tesseract.recognize(selectedFile, "eng").then(({ data: { text } }) => {
        // Send the extracted text to your backend
        fetch("/api/process-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            // Check if 'items' property exists in the response
            if (data.items) {
              // Set the backend response to the state
              setBackendResponse(data.items);
            } else {
              alert("Response does not contain 'items'.");
              // Handle the error case here
              // For example, setBackendResponse([]) or display an error message
            }
          })
          .catch(() => {
            alert("Error receiving data from backend");
          })
          .finally(() => {
            setLoading(false); // Set loading state to false when processing finishes
          });
      });
    } else {
      // No file selected, handle accordingly (e.g., reset the 'file' state)
      setFile(null);
      setBackendResponse([]); // Clear the backend response when no file is selected
      // Reset the value of the file input element
      e.target.value = null;
    }
  }

  // Cleanup on component unmount or when 'file' changes
  useEffect(() => {
    return () => {
      // Revoke the object URL to free up resources
      if (file) {
        URL.revokeObjectURL(file);
      }
    };
  }, [file]);

  const handleDelete = (index) => {
    const updatedItems = [...backendResponse];
    updatedItems.splice(index, 1);
    setBackendResponse(updatedItems);
  };

  const handleUpdateItem = (index, updatedItem) => {
    const updatedItems = [...backendResponse];
    updatedItems[index] = updatedItem;
    setBackendResponse(updatedItems);
  };

  const handleAddItems = () => {
    if (selectedStorage) {
      // Send backend request to add items to selected storage
      fetch(`/api/user/add-item/${selectedStorage._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendResponse),
      })
        .then((response) => response.json())
        .then(() => {
          // Handle response
          alert("Items added Successfully");
          setFile(null);
          setSelectedStorage("");
          setBackendResponse([]);
        })
        .catch(() => {
          alert("Error adding items to storage:");
        });
    } else {
      // Handle case when no storage is selected
      alert("No storage selected");
    }
  };

  useEffect(() => {
    // Fetch all storages when the component mounts
    fetch("/api/user/get-all-storage")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setStorages(
          data.storages.map((storage) => ({
            name: storage.storage_name,
            _id: storage._id,
          }))
        );
      })
      .catch((error) => console.error("Error fetching storages:", error));
  }, []);

  // Helper function to capitalize the first letter of each word
  function capitalizeFirstLetter(string) {
    return string.replace(/\b\w/g, (match) => match.toUpperCase());
  }

  return (
    <>
      <div
        className="container-fluid text-center"
        style={{ height: "calc(100svh - 57px - 200px)" }}
      >
        <input
          className="form-control mt-4 bg-secondary w-75 mx-auto rounded-4"
          type="file"
          capture="user"
          accept="image/*"
          onChange={handleChange}
        />
        <div>
          <h4 className="mt-3">Items Found in Receipt</h4>
        </div>
        <div
          className="container"
          style={{ height: "50svh", overflowY: "auto" }}
        >
          {loading ? ( // Conditional rendering for the spinner while loading
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            backendResponse.map((item, index) => (
              <ItemCard
                key={index}
                item={item}
                index={index}
                onUpdate={handleUpdateItem}
                onDelete={() => handleDelete(index)}
              />
            ))
          )}
        </div>
      </div>
      <div className="d-flex justify-content-center flex-column align-items-center">
        <div>
          <div className="dropup my-2 mx-auto d-flex align-self-center">
            <button
              className="btn btn-secondary border-dark-subtle rounded-4 w-100 mt-1 py-2"
              type="button"
              id="storageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ maxWidth: "200px" }}
            >
              <p className="m-0 p-0 dropdown-toggle">
                {selectedStorage
                  ? capitalizeFirstLetter(selectedStorage.name)
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
              {storages.map((storage, index) => (
                <li key={index}>
                  <button
                    className="dropdown-item"
                    onClick={() => setSelectedStorage(storage)}
                  >
                    <p className="m-0">{capitalizeFirstLetter(storage.name)}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className="btn btn-secondary border-dark-subtle rounded-4 w-50 mt-2 py-2 mx-auto"
          onClick={handleAddItems}
          style={{ maxWidth: "200px" }}
        >
          <h6 className="m-0">Add Items</h6>
        </button>
      </div>
    </>
  );
}
