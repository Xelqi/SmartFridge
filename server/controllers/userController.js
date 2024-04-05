const User = require("../models/user"); // Assuming User model file path

// Storage Related API Calls
// Add a storage
async function addStorage(req, res) {
  try {
    const username = req.user.username;
    const { storage_name } = req.body; // Extract storage_name from request body
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    // Create a new storage object with the provided storage_name
    const newStorage = { storage_name, items: [] };

    // Push the new storage to the user's storage array
    user.storage.push(newStorage);

    // Save the user with the updated storage array
    await user.save();
    res.status(201).json({ message: "Storage added successfully" });
    console.log("Added Storage: " + storage_name);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete a storage
async function deleteStorage(req, res) {
  try {
    const username = req.user.username;
    const storageId = req.params.storage_id; // Change to storage_id

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    // Find the index of the storage with the given _id
    const storageIndex = user.storage.findIndex(
      (storage) => storage._id == storageId // Change to ==
    );

    if (storageIndex === -1) {
      throw new Error("Storage not found");
    }

    // Remove the storage from the user's storage array
    user.storage.splice(storageIndex, 1);

    // Save the user object
    await user.save();

    // Respond with a success message
    res.status(200).json({ message: "Storage deleted successfully" });
  } catch (error) {
    // Respond with an error message if any error occurs
    res.status(400).json({ error: error.message });
  }
}

// Get all storages
async function getAllStorages(req, res) {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }
    // Return all storages belonging to the user
    res.status(200).json({ storages: user.storage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all items from a selected storage
async function getItemsFromStorage(req, res) {
  try {
    const username = req.user.username;
    const storageId = req.params.storage_id; // Change to storage_id
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    // Find the storage by storage _id
    const storage = user.storage.find(
      (storage) => storage._id == storageId // Change to ==
    );

    if (!storage) {
      throw new Error("Storage not found");
    }

    res.status(200).json({ items: storage.items });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function addItemToStorageById(req, res) {
  try {
    const username = req.user.username;
    const storageId = req.params.storage_id; // Change to storage_id
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }
    
    // Find the storage by storage _id
    const storage = user.storage.find(
      (storage) => storage._id == storageId // Change to ==
    );

    if (!storage) {
      throw new Error("Storage not found");
    }
    
    // Check if the request body is an array
    if (Array.isArray(req.body)) {
      // Add each item from the request body to the storage's items array
      for (const item of req.body) {
        // Validate item properties
        if (!item.item_name || !item.expiryDays || !item.quantity || !item.category) {
          throw new Error("Item properties are required");
        }
        
        // Push the item to the storage's items array
        storage.items.push(item);
      }
    } else {
      // If the request body is not an array, assume it's a single item
      const item = req.body;
      // Validate item properties
      if (!item.item_name || !item.expiryDays || !item.quantity || !item.category) {
        throw new Error("Item properties are required");
      }
      // Push the single item to the storage's items array
      storage.items.push(item);
    }

    // Save the user with updated items array
    await user.save();
    res.status(201).json({ message: "Items added to storage successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// Get one item from storage by _id
async function getOneItemFromStorage(req, res) {
  try {
    const username = req.user.username;
    const storageId = req.params.storage_id; // Change to storage_id
    const itemId = req.params.item_id;

    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    const storage = user.storage.find(
      (storage) => storage._id == storageId // Change to ==
    );

    if (!storage) {
      throw new Error("Storage not found");
    }

    // Using findById to find the item by its _id
    const item = storage.items.id(itemId);

    if (!item) {
      throw new Error("Item not found");
    }

    res.status(200).json({ item });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete item by _id
async function deleteItem(req, res) {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    const storageId = req.params.storage_id; // Change to storage_id
    const storage = user.storage.find(
      (storage) => storage._id == storageId // Find storage by _id
    );
    if (!storage) {
      throw new Error("Storage not found");
    }

    const itemId = req.params.item_id;
    storage.items.pull({ _id: itemId });
    await user.save();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Update item by _id
async function updateItem(req, res) {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    const storageId = req.params.storage_id; // Change to storage_id
    const storage = user.storage.find(
      (storage) => storage._id == storageId // Find storage by _id
    );
    if (!storage) {
      throw new Error("Storage not found");
    }

    const itemId = req.params.item_id;
    const item = storage.items.id(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    // Update item properties with the values from the request body
    Object.assign(item, req.body);

    await user.save();
    res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  // Storage-related functions
  addStorage,
  deleteStorage,
  getAllStorages,
  addItemToStorageById,
  getItemsFromStorage,
  getOneItemFromStorage,
  deleteItem,
  updateItem,
};
