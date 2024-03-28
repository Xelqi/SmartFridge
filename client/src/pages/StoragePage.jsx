import { useState, useEffect } from "react";
import AddStorage from "../components/AddStorage";
import Storages from "../components/Storages";

const StoragePage = () => {
  const [storages, setStorages] = useState([]);

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
      // Update the list of storages
      const updatedStorages = [...storages, { storage_name: storageName, items: [] }];
      setStorages(updatedStorages);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="row">
      <div className="col-11 mx-auto">
        <Storages storages={storages} />
      </div>
      <AddStorage onAddStorage={handleAddStorage} />
    </div>
  );
};

export default StoragePage;
