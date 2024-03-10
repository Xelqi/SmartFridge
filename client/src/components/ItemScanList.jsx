import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";

export default function ItemScanList() {
  const [file, setFile] = useState();
  const [backendResponse, setBackendResponse] = useState([]);

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
            // Check if 'openaiJsonResponse' property exists in the response
            if (data.openaiJsonResponse) {
              // Parse the JSON string in 'openaiJsonResponse'
              const parsedResponse = JSON.parse(data.openaiJsonResponse);
              // Check if 'food_items' property exists in the parsed response
              if (parsedResponse.food_items) {
                console.log("OpenAI JSON response:", parsedResponse.food_items);
                // Set the parsed content to the state
                setBackendResponse(parsedResponse.food_items);
              } else {
                console.log(
                  "Response does not contain 'food_items'.",
                  parsedResponse
                );
              }
            } else {
              console.log(
                "Response does not contain 'openaiJsonResponse'.",
                data
              );
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

  return (
    <div className="container-fluid text-center">
      <h1>Quick Add</h1>
      <input className="form-control" type="file" onChange={handleChange} />
      <div>
        <h4 className="mt-3">Items Found in Receipt</h4>
      </div>
      <div className="container" style={{ height: "50vh", overflowY: "auto"}}>
        {backendResponse.map((item, index) => (
          <div key={index} className="px-4 py-2 border mb-2 rounded-5 bg-secondary">
            <div className="d-flex">
              <h5 className="ms-auto">{item.name}</h5>
              <img className="ms-auto" src="/bin.svg" alt="" />
            </div>
            <div className="d-flex">
              <h6  className="mb-1" style={{ width: "50%" }}>Category:</h6>
              <h6 className="me-auto my-auto">{item.category}</h6>
            </div>
            <div className="d-flex">
              <h6 className="mb-1 mt-1" style={{ width: "50%" }}>Quantity:</h6>
              <h6 className="me-auto my-auto">{item.quantity}</h6>
              <div className="d-flex align-items-center">
                <img src="/plus-btn.svg" alt="" className="me-1" />
                <img src="/minus-btn.svg" alt="" />
              </div>
            </div>
            <div className="d-flex">
              <h6 className="mb-1 mt-1" style={{ width: "50%" }}>Expiry Days:</h6>
              <h6 className="me-auto my-auto">{item.expiry_date}</h6>
              <div className="d-flex align-items-center">
                <img src="/plus-btn.svg" alt="" className="me-1" />
                <img src="/minus-btn.svg" alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
