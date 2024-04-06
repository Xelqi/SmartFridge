import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import ItemCard from "./ItemCard"; // Import the ItemCard component

export default function ItemScanList() {
  const [file, setFile] = useState();
  const [backendResponse, setBackendResponse] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState("");
  const [storages, setStorages] = useState([]);

  // Function to handle image upload and OCR processing
  function handleChange(e) {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    setFile(URL.createObjectURL(selectedFile));
  
    if (selectedFile) {
      // Reset backendResponse state when a new file is selected
      setBackendResponse([]);
      Tesseract.recognize(selectedFile, "eng").then(({ data: { text } }) => {
        console.log("Text:", text);
  
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
            console.log("Received from backend:", data);
            // Check if 'items' property exists in the response
            if (data.items) {
              console.log("Backend response:", data.items);
              // Set the backend response to the state
              setBackendResponse(data.items);
            } else {
              console.log("Response does not contain 'items'.", data);
              // Handle the error case here
              // For example, setBackendResponse([]) or display an error message
            }
          })
          .catch((error) => {
            console.error("Error receiving data from backend:", error);
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
        .then((data) => {
          // Handle response
          console.log("Items added to storage:", data);
          alert("Items added Successfully");
          setFile(null);
          setSelectedStorage("");
          setBackendResponse([]);
        })
        .catch((error) => {
          console.error("Error adding items to storage:", error);
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
        setStorages(data.storages.map((storage) => ({ name: storage.storage_name, _id: storage._id })));
      })
      .catch((error) => console.error("Error fetching storages:", error));
  }, []);

  // Helper function to capitalize the first letter of each word
  function capitalizeFirstLetter(string) {
    return string.replace(/\b\w/g, (match) => match.toUpperCase());
  }

  return (
    <div className="container-fluid text-center" style={{height: "calc(100svh -57px - 65px)"}}>
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
      <div className="container" style={{ height: "51vh", overflowY: "auto" }}>
        {backendResponse.map((item, index) => (
          <ItemCard
          key={index}
          item={item}
          index={index}
          onUpdate={handleUpdateItem}
          onDelete={() => handleDelete(index)}
        />
        ))}
      </div>
      <div className="dropup my-2 mt-lg-4 mt-2">
        <button
          className="btn btn-secondary border-dark-subtle"
          type="button"
          id="storageDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ width: "130px" }} // Adjust the width as needed
        >
          <p className="m-0 p-0 dropdown-toggle">
            {selectedStorage
              ? capitalizeFirstLetter(selectedStorage.name)
              : "Select Storage"}
          </p>
        </button>
        <ul
          className="dropdown-menu bg-secondary pb-0 pt-0 text-center"
          aria-labelledby="storageDropdown"
          style={{
            maxHeight: "10rem",
            overflowY: "auto",
            bottom: "100%",
            width: "130px",
            minWidth: "130px",
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

      <button className="btn btn-secondary border-dark-subtle mt-lg-2" onClick={handleAddItems}>
        <p className="m-0">Add Items</p>
      </button>
    </div>
  );
}
