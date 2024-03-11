import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";

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
            // Check if 'food_items' property exists in the response
            if (data.food_items) {
              console.log("Backend response:", data.food_items);
              // Set the backend response to the state
              setBackendResponse(data.food_items);
            } else {
              console.log("Response does not contain 'food_items'.", data);
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

  const increaseQuantity = (index) => {
    const updatedItems = [...backendResponse];
    updatedItems[index].quantity++;
    setBackendResponse(updatedItems);
  };

  const decreaseQuantity = (index) => {
    const updatedItems = [...backendResponse];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity--;
      setBackendResponse(updatedItems);
    }
  };

  const increaseExpiration = (index) => {
    const updatedItems = [...backendResponse];
    updatedItems[index].expiryDays++;
    setBackendResponse(updatedItems);
  };

  const decreaseExpiration = (index) => {
    const updatedItems = [...backendResponse];
    if (updatedItems[index].expiryDays > 0) {
      updatedItems[index].expiryDays--;
      setBackendResponse(updatedItems);
    }
  };

  const handleDelete = (index) => {
    const updatedItems = [...backendResponse];
    updatedItems.splice(index, 1);
    setBackendResponse(updatedItems);
  };

  const handleAddItems = () => {
    if (selectedStorage) {
      // Send backend request to add items to selected storage
      fetch(`/api/user/add-item/${selectedStorage}`, {
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
        setStorages(data.storages.map((storage) => storage.storage_name));
      })
      .catch((error) => console.error("Error fetching storages:", error));
  }, []);

  return (
    <div className="container-fluid text-center">
      <h1>Quick Add</h1>
      <input className="form-control" type="file" onChange={handleChange} />
      <div>
        <h4 className="mt-3">Items Found in Receipt</h4>
      </div>
      <div className="container" style={{ height: "45vh", overflowY: "auto" }}>
        {backendResponse.map((item, index) => (
          <div
            key={index}
            className="px-4 py-2 border mb-2 rounded-5 bg-secondary"
          >
            <div className="d-flex">
              <h5 className="ms-auto">{item.item_name}</h5>
              <img
                className="ms-auto"
                src="/bin.svg"
                alt=""
                onClick={() => handleDelete(index)}
              />
            </div>
            <div className="d-flex">
              <h6 className="mb-1" style={{ width: "50%" }}>
                Category:
              </h6>
              <h6 className="me-auto my-auto">{item.category}</h6>
            </div>
            <div className="d-flex">
              <h6 className="mb-1 mt-1" style={{ width: "50%" }}>
                Quantity:
              </h6>
              <h6 className="me-auto my-auto">{item.quantity}</h6>
              <div className="d-flex align-items-center">
                <img
                  src="/plus-btn.svg"
                  alt=""
                  className="me-1"
                  onClick={() => increaseQuantity(index)}
                />
                <img
                  src="/minus-btn.svg"
                  alt=""
                  onClick={() => decreaseQuantity(index)}
                />
              </div>
            </div>
            <div className="d-flex">
              <h6 className="mb-1 mt-1" style={{ width: "50%" }}>
                Expiry Days:
              </h6>
              <h6 className="me-auto my-auto">{item.expiryDays}</h6>
              <div className="d-flex align-items-center">
                <img
                  src="/plus-btn.svg"
                  alt=""
                  className="me-1"
                  onClick={() => increaseExpiration(index)}
                />
                <img
                  src="/minus-btn.svg"
                  alt=""
                  onClick={() => decreaseExpiration(index)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="my-3">
        <select
          value={selectedStorage}
          onChange={(e) => setSelectedStorage(e.target.value)}
        >
          <option value="">Select Storage</option>
          {storages.map((storage) => (
            <option key={storage} value={storage}>
              {storage}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary" onClick={handleAddItems}>
        <p className="m-0">Add Items</p>
      </button>
    </div>
  );
}
