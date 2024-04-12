const User = require("../models/user");

// Add a user  to see my storage
async function addUserToSeeMyStorage(req, res) {
  try {
    const user_id = req.user._id;
    const storage_id = req.body.storage_id;
    const userToAddId = req.body.user_id;

    // Find the current user's storage
    const currentUser = await User.findById(user_id);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const storage = currentUser.storage.id(storage_id);
    if (!storage) {
      return res.status(404).json({ error: "Storage not found" });
    }

    // Check if the userToAddId is already in usersWithAccess
    const userIndex = storage.usersWithAccess.findIndex((access) =>
      access.user.equals(userToAddId)
    );
    if (userIndex !== -1) {
      return res
        .status(400)
        .json({ error: "User already has access to this storage" });
    
    }
    

    // Add the user to usersWithAccess
    storage.usersWithAccess.push({ user: userToAddId });

    // Save the updated current user
    await currentUser.save();

    // Find the user to add and update their otherStorages with access to the current user's storage
    const userToAdd = await User.findById(userToAddId);
    if (!userToAdd) {
      return res.status(404).json({ error: "User to add not found" });
    }

    // Check if the current user's storage is already in the userToAdd's otherStorages
    const existingStorageIndex = userToAdd.otherStorages.findIndex((os) =>
      os.storageId.equals(storage_id)
    );
    if (existingStorageIndex !== -1) {
      // Update permissions if needed
      if (!userToAdd.otherStorages[existingStorageIndex].permissions.read) {
        userToAdd.otherStorages[existingStorageIndex].permissions.read = true;
      }
      if (!userToAdd.otherStorages[existingStorageIndex].permissions.write) {
        userToAdd.otherStorages[existingStorageIndex].permissions.write = true;
      }
    } else {
      // Add access to the current user's storage
      userToAdd.otherStorages.push({
        userId: user_id,
        storageId: storage_id,
        permissions: { read: true, write: true },
      });
    }

    // Save the updated userToAdd
    await userToAdd.save();

    return res
      .status(200)
      .json({ message: "User added to see your storage successfully" });
  } catch (error) {
    return res.status(500).json({
      error: `Failed to add user to see your storage: ${error.message}`,
    });
  }
}

// Remove user from my storage
async function removeUserFromMyStorage(req, res) {
  try {
    const user_id = req.user._id;
    const storage_id = req.body.storage_id;
    const userToRemoveId = req.body.user_id;

    // Find the current user's storage
    const currentUser = await User.findById(user_id);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const storage = currentUser.storage.id(storage_id);
    if (!storage) {
      return res.status(404).json({ error: "Storage not found" });
    }

    // Check if the userToRemoveId is in usersWithAccess
    const userIndex = storage.usersWithAccess.findIndex((access) =>
      access.user.equals(userToRemoveId)
    );
    if (userIndex === -1) {
      return res
        .status(400)
        .json({ error: "User does not have access to this storage" });
    }

    // Remove the user from usersWithAccess
    storage.usersWithAccess.splice(userIndex, 1);

    // Save the updated current user
    await currentUser.save();

    // Find the user to remove and update their otherStorages
    const userToRemove = await User.findById(userToRemoveId);
    if (!userToRemove) {
      return res.status(404).json({ error: "User to remove not found" });
    }

    // Remove access to the current user's storage from userToRemove's otherStorages
    userToRemove.otherStorages = userToRemove.otherStorages.filter(
      (os) => !(os.storageId.equals(storage_id) && os.userId.equals(user_id))
    );

    // Save the updated userToRemove
    await userToRemove.save();

    return res
      .status(200)
      .json({ message: "User removed from your storage successfully" });
  } catch (error) {
    return res.status(500).json({
      error: `Failed to remove user from your storage: ${error.message}`,
    });
  }
}

// Read-only permissions
async function changePermissionsOfOtherUser(req, res) {
  try {
    const requester_id = req.user._id; // ID of the user making the request
    const target_user_id = req.body.target_user_id; // ID of the user whose permissions are being modified
    const storage_id = req.body.storage_id; // ID of the storage whose permissions are being modified

    // Find the user making the request
    const requester = await User.findById(requester_id);
    if (!requester) {
      return res.status(404).json({ error: "Requester not found" });
    }

    // Ensure the requester has permission to modify permissions
    // For simplicity, let's assume only the owner of the storage can modify permissions
    // You can adjust this logic based on your specific requirements
    const storage = requester.storage.id(storage_id);
    if (!storage) {
      return res.status(404).json({ error: "Storage not found" });
    }
    if (
      !storage.usersWithAccess.some(
        (access) => access.user.equals(requester_id) && access.permissions.write
      )
    ) {
      return res.status(403).json({
        error:
          "You do not have permission to modify permissions for this storage",
      });
    }

    // Find the target user
    const targetUser = await User.findById(target_user_id);
    if (!targetUser) {
      return res.status(404).json({ error: "Target user not found" });
    }

    // Find the otherStorages entry corresponding to the target user and storage
    const otherStorageIndex = targetUser.otherStorages.findIndex(
      (os) => os.userId.equals(requester_id) && os.storageId.equals(storage_id)
    );
    if (otherStorageIndex === -1) {
      return res.status(404).json({ error: "Other storage entry not found" });
    }

    // Update permissions to read-only
    targetUser.otherStorages[otherStorageIndex].permissions.write = false;

    // Save the updated target user
    await targetUser.save();

    return res
      .status(200)
      .json({ message: "Permissions updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Failed to update permissions: ${error.message}` });
  }
}

// Write permissions
async function changePermissionsOfUserToWrite(req, res) {
  try {
    const requester_id = req.user._id; // ID of the user making the request
    const target_user_id = req.body.target_user_id; // ID of the user whose permissions are being modified
    const storage_id = req.body.storage_id; // ID of the storage whose permissions are being modified

    // Find the user making the request
    const requester = await User.findById(requester_id);
    if (!requester) {
      return res.status(404).json({ error: "Requester not found" });
    }

    // Ensure the requester has permission to modify permissions
    // For simplicity, let's assume only the owner of the storage can modify permissions
    // You can adjust this logic based on your specific requirements
    const storage = requester.storage.id(storage_id);
    if (!storage) {
      return res.status(404).json({ error: "Storage not found" });
    }
    if (
      !storage.usersWithAccess.some(
        (access) => access.user.equals(requester_id) && access.permissions.write
      )
    ) {
      return res.status(403).json({
        error:
          "You do not have permission to modify permissions for this storage",
      });
    }

    // Find the target user
    const targetUser = await User.findById(target_user_id);
    if (!targetUser) {
      return res.status(404).json({ error: "Target user not found" });
    }

    // Find the otherStorages entry corresponding to the target user and storage
    const otherStorageIndex = targetUser.otherStorages.findIndex(
      (os) => os.userId.equals(requester_id) && os.storageId.equals(storage_id)
    );
    if (otherStorageIndex === -1) {
      return res.status(404).json({ error: "Other storage entry not found" });
    }

    // Update permissions to write
    targetUser.otherStorages[otherStorageIndex].permissions.write = true;

    // Save the updated target user
    await targetUser.save();

    return res
      .status(200)
      .json({ message: "Permissions updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Failed to update permissions: ${error.message}` });
  }
}

// Get storages from other user storages
async function getStoragesFromOtherUserStorages(req, res) {
  try {
    const user_id = req.user._id;

    // Step 1: Get current user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Step 2: Find all otherStorages the user has access to and extract userID and storageID
    const otherStorages = user.otherStorages;

    // Step 3: For each userID and storageID, find the user and return the storage with that ID
    const sharedStorages = [];
    for (const { userId, storageId } of otherStorages) {
      const otherUser = await User.findById(userId);
      if (!otherUser) continue;

      const otherStorage = otherUser.storage.id(storageId);
      if (!otherStorage) continue;

      // Construct shared storage object
      const sharedStorage = {
        user_id: otherUser._id,
        username: otherUser.username,
        storage_id: otherStorage._id,
        storage_name: otherStorage.storage_name,
        items: otherStorage.items,
      };
      sharedStorages.push(sharedStorage);
    }

    return res.status(200).json(sharedStorages);
  } catch (error) {
    return res.status(500).json({
      error: `Failed to get storages from other user storages: ${error.message}`,
    });
  }
}

// Add items to other user's storage
async function addManyItemsToOtherUserStorage(req, res) {
  try {
    const user_id = req.user._id;
    const storage_id = req.body.storage_id;
    const items = req.body.items; // Assuming items is an array of objects containing item_name, category, expiryDays, and quantity
    const target_user_id = req.body.target_user_id;

    // Find the target user
    const targetUser = await User.findById(target_user_id);
    if (!targetUser) {
      return res.status(404).json({ error: "Target user not found" });
    }

    // Find the target user's storage
    const targetStorage = targetUser.storage.id(storage_id);
    if (!targetStorage) {
      return res
        .status(404)
        .json({ error: "Storage not found for the target user" });
    }

    // Find the current user in the database
    const currentUser = await User.findById(user_id);
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    // Check if the current user has permission to write to the target storage
    const userStorageAccess =
      currentUser.otherStorages &&
      currentUser.otherStorages.find((storage) =>
        storage.storageId.equals(storage_id)
      );
    if (
      !userStorageAccess ||
      !userStorageAccess.permissions ||
      !userStorageAccess.permissions.write
    ) {
      return res
        .status(403)
        .json({ error: "You do not have permission to write to this storage" });
    }

    // Add each item to the target storage
    items.forEach((item) => {
      targetStorage.items.push(item);
    });

    // Save the updated target user
    await targetUser.save();

    return res
      .status(200)
      .json({ message: "Items added to other user's storage successfully" });
  } catch (error) {
    return res.status(500).json({
      error: `Failed to add items to other user's storage: ${error.message}`,
    });
  }
}

async function removeItemFromOtherUserStorage(req, res) {
  try {
    const user_id = req.user._id;
    const storage_id = req.body.storage_id;
    const item_id = req.body.item_id; // Assuming item_id is provided

    // Find the current user
    const currentUser = await User.findById(user_id);
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    // Find the target user
    const target_user_id = req.body.target_user_id;
    const targetUser = await User.findById(target_user_id);
    if (!targetUser) {
      return res.status(404).json({ error: "Target user not found" });
    }

    // Check if the current user has permission to write to any of the target user's storages
    const userStorageAccess = currentUser.otherStorages.find((storage) =>
      storage.storageId.equals(storage_id)
    );
    if (!userStorageAccess || !userStorageAccess.permissions.write) {
      return res.status(403).json({
        error: "You do not have permission to write to this storage",
      });
    }

    // Find the target user's storage
    const targetStorage = targetUser.storage.id(storage_id);
    if (!targetStorage) {
      return res
        .status(404)
        .json({ error: "Storage not found for the target user" });
    }

    // Find the index of the item to remove
    const itemIndex = targetStorage.items.findIndex((item) =>
      item._id.equals(item_id)
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ error: "Item not found in the target storage" });
    }

    // Remove the item from the target storage
    targetStorage.items.splice(itemIndex, 1);

    // Save the updated target user
    await targetUser.save();

    return res
      .status(200)
      .json({ message: "Item removed from other user's storage successfully" });
  } catch (error) {
    return res.status(500).json({
      error: `Failed to remove item from other user's storage: ${error.message}`,
    });
  }
}
// Update item in other user's storage
async function updateItemInOtherUserStorage(req, res) {
  try {
    const user_id = req.user._id;
    const storage_id = req.body.storage_id;
    const item_id = req.body.item_id; // Assuming item_id is provided
    const updatedItem = req.body.updatedItem; // Assuming updatedItem is an object containing the updated item fields

    // Find the target user in the database
    const targetUser = await User.findById(req.body.target_user_id);
    if (!targetUser) {
      return res.status(404).json({ error: "Target user not found" });
    }

    // Find the current user in the database
    const currentUser = await User.findById(user_id);
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    // Check if the current user has permission to write to the target storage
    const userStorageAccess =
      currentUser.otherStorages &&
      currentUser.otherStorages.find((storage) =>
        storage.storageId.equals(storage_id)
      );
    if (
      !userStorageAccess ||
      !userStorageAccess.permissions ||
      !userStorageAccess.permissions.write
    ) {
      return res
        .status(403)
        .json({ error: "You do not have permission to write to this storage" });
    }

    // Find the target user's storage
    const targetStorage = targetUser.storage.find((storage) =>
      storage._id.equals(storage_id)
    );
    if (!targetStorage) {
      return res
        .status(404)
        .json({ error: "Storage not found for the target user" });
    }

    // Find the index of the item to update
    const itemIndex = targetStorage.items.findIndex((item) =>
      item._id.equals(item_id)
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ error: "Item not found in the target storage" });
    }

    // Get the existing item
    const existingItem = targetStorage.items[itemIndex];

    // Merge the existing item with the updated fields
    const newItem = {
      ...existingItem.toObject(), // Convert the Mongoose document to a plain JavaScript object
      ...updatedItem,
    };

    // Update the item in the target storage
    targetStorage.items[itemIndex].set(newItem);

    // Save the updated target user
    await targetUser.save();

    return res
      .status(200)
      .json({ message: "Item updated in other user's storage successfully" });
  } catch (error) {
    return res.status(500).json({
      error: `Failed to update item in other user's storage: ${error.message}`,
    });
  }
}
// Leave other user's storage
async function leaveOtherUsersStorage(req, res) {
  try {
    const user_id = req.user._id; // ID of the user leaving the storage
    const target_user_id = req.body.target_user_id; // ID of the user who owns the storage
    const storage_id = req.body.storage_id; // ID of the storage being left

    // Find the user leaving the storage
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the storage being left
    const storage = user.otherStorages.find(
      (os) =>
        os.userId.equals(target_user_id) && os.storageId.equals(storage_id)
    );
    if (!storage) {
      return res.status(404).json({ error: "Storage not found" });
    }

    // Remove the storage from the user's otherStorages
    user.otherStorages.pull(storage._id);

    // Remove the user from the usersWithAccess of the storage owner
    const owner = await User.findById(target_user_id);
    if (!owner) {
      return res.status(404).json({ error: "Storage owner not found" });
    }

    // Find the storage being left
    let ownerStorageIndex = -1;
    for (let i = 0; i < owner.storage.length; i++) {
      if (owner.storage[i]._id.equals(storage_id)) {
        ownerStorageIndex = i;
        break;
      }
    }

    if (ownerStorageIndex === -1) {
      return res.status(404).json({ error: "Storage not found for owner" });
    }

    // Remove the user from the usersWithAccess of the storage owner
    owner.storage[ownerStorageIndex].usersWithAccess = owner.storage[
      ownerStorageIndex
    ].usersWithAccess.filter((access) => !access.user.equals(user_id));

    // Save changes
    await Promise.all([user.save(), owner.save()]);

    return res.status(200).json({ message: "Left storage successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Failed to leave storage: ${error.message}` });
  }
}

module.exports = {
  removeUserFromMyStorage,
  addUserToSeeMyStorage,
  changePermissionsOfOtherUser,
  changePermissionsOfUserToWrite,
  getStoragesFromOtherUserStorages,
  addManyItemsToOtherUserStorage,
  removeItemFromOtherUserStorage,
  updateItemInOtherUserStorage,
  leaveOtherUsersStorage,
};
