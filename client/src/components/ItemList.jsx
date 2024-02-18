import Tesseract from "tesseract.js"; // Import OCR image processing engine
import { useState, useEffect } from "react";

export default function ItemList() {
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
        fetch("http://localhost:8080/api/process-text", {
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
            // Check if 'content' property exists in the response
            if (data.openaiJsonResponse && data.openaiJsonResponse.content) {
              const contentString = data.openaiJsonResponse.content;
              // Parse the content string into a JavaScript object
              const parsedContent = JSON.parse(contentString);
              // Set the parsed content to the state
              setBackendResponse(parsedContent.food_items || []);
            }
          })
          .catch((error) => {
            console.error("Error sending text to backend:", error);
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
      <h1>Smart Fridge</h1>
      <input className="form-control" type="file" onChange={handleChange} />
      <img
        src={file}
        style={{ width: "300px", height: "300px" }}
        alt="Uploaded file"
      />
      <div>
        <h2>Items Found in Receipt</h2>
        <ul>
          {backendResponse.map((item, index) => (
            <li key={index}>
              <strong>Name:</strong> {item.name}, <strong>Category:</strong>{" "}
              {item.category}, <strong>Expiry Date:</strong> {item.expiry_date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
