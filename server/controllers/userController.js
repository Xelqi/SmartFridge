const User = require("../models/user"); // Assuming User model file path

// Controller function to add a storage to a user
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
    console.log("Added Storage: " + storage_name)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteStorage(req, res) {
  try {
    const username = req.user.username;
    const storageName = req.params.storage_name;
    
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    // Find the index of the storage with the given name
    const storageIndex = user.storage.findIndex(storage => storage.storage_name === storageName);

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


// Controller function to get all storages of a user
async function getAllStorages(req, res) {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }
    console.log(user.storage);
    // Return all storages belonging to the user
    res.status(200).json({ storages: user.storage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Controller function to add an item to a storage by storage name of a user
async function addItemToStorageByName(req, res) {
  try {
    const username = req.user.username;
    const storageName = req.params.storage_name;
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }
    console.log(storageName);
    // Find the storage by storageName
    const storage = user.storage.find(storage => storage.storage_name === storageName);

    if (!storage) {
      throw new Error("Storage not found");
    }

    // Validate each item in the request body
    for (const item of req.body.items) {
      // Validate item properties
      if (!item.item_name) {
        throw new Error("Item names are required");
      }
      if (!item.expiryDays) {
        throw new Error("Expiry dates are required");
      }
      if (!item.quantity) {
        throw new Error("Quantity cannot be 0");
      }
      if (!item.category) {
        throw new Error("Item Category is required");
      }
      // Push the validated item to the selected storage's items array
      storage.items.push(item);
    }

    // Save the user with updated items array
    await user.save();
    res.status(201).json({ message: "Items added to storage successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


async function getItemsFromStorage(req, res) {
  try {
    console.log("Im here");
    const username = req.user.username;
    const storageName = req.params.storage_name; // Extract storage name from request params
    const user = await User.findOne({ username });
    console.log(user)
    if (!user) {
      throw new Error("User not found");
    }

    // Find the storage by storageName
    const storage = user.storage.find(storage => storage.storage_name === storageName);

    if (!storage) {
      throw new Error("Storage not found");
    }

    res.status(200).json({ items: storage.items });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getOneItemFromStorage(req, res) {
  try {
    const username = req.user.username;
    const storageName = req.params.storage_name;
    const itemId = req.params.item_id;

    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    const storage = user.storage.find(storage => storage.storage_name === storageName);

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


async function deleteItem(req, res) {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    const storageName = req.params.storage_name; // Assuming you pass the storage name as a parameter
    const storage = user.storage.find(storage => storage.storage_name === storageName);
    if (!storage) {
      throw new Error("Storage not found");
    }

    const itemId = req.params.itemId;
    storage.items.pull({ _id: itemId });
    await user.save();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


async function updateItem(req, res) {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    const storageName = req.params.storage_name; // Assuming you pass the storage name as a parameter
    const storage = user.storage.find(storage => storage.storage_name === storageName);
    if (!storage) {
      throw new Error("Storage not found");
    }

    const itemId = req.params.itemId;
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
  addStorage,
  deleteStorage,
  getAllStorages,
  addItemToStorageByName,
  getItemsFromStorage,
  getOneItemFromStorage,
  deleteItem,
  updateItem,
};
