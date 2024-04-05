const User = require("../models/user"); // Assuming User model file path

// Shopping list-related controller functions
async function getAllShoppingLists(req, res) {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }
    // Return all shopping lists belonging to the user
    res.status(200).json({ shopping_lists: user.shopping_lists });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function addShoppingList(req, res) {
  try {
    const username = req.user.username;
    const { list_name } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    // Create a new shopping list object with the provided list_name
    const newShoppingList = { list_name, items: [] };

    // Push the new shopping list to the user's shopping_lists array
    user.shopping_lists.push(newShoppingList);

    // Save the user with the updated shopping_lists array
    await user.save();
    res.status(201).json({ message: "Shopping list added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateShoppingListName(req, res) {
  try {
    const username = req.user.username;
    const listId = req.params.list_id;
    const newName = req.body.list_name; // Corrected field name
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    const shoppingList = user.shopping_lists.find(
      (list) => list._id.toString() === listId
    );

    if (!shoppingList) {
      throw new Error("Shopping list not found");
    }

    shoppingList.list_name = newName;
    await user.save();

    res.status(200).json({ message: "Shopping list name updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteShoppingList(req, res) {
  try {
    const username = req.user.username;
    const listId = req.params.list_id; // Assuming the parameter is named list_id

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    // Find the shopping list by _id
    const shoppingListIndex = user.shopping_lists.findIndex(
      (list) => list._id.toString() === listId
    );

    if (shoppingListIndex === -1) {
      throw new Error("Shopping list not found");
    }

    // Remove the shopping list from the user's shopping_lists array
    user.shopping_lists.splice(shoppingListIndex, 1);

    // Save the user object
    await user.save();

    // Respond with a success message
    res.status(200).json({ message: "Shopping list deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
async function addItemToShoppingList(req, res) {
  try {
    const username = req.user.username;
    const listName = req.params.list_name;
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    // Find the shopping list by listName
    const shoppingList = user.shopping_lists.find(
      (list) => list.list_name === listName
    );

    if (!shoppingList) {
      throw new Error("Shopping list not found");
    }

    // Validate each item in the request body
    for (const item of req.body.items) {
      // Validate item properties
      if (!item.item_name) {
        throw new Error("Item names are required");
      }
      if (!item.quantity) {
        throw new Error("Quantity cannot be 0");
      }
      // Push the validated item to the selected shopping list's items array
      shoppingList.items.push({ ...item, checked: false });
    }

    // Save the user with updated items array
    await user.save();
    res
      .status(201)
      .json({ message: "Items added to shopping list successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getItemsFromShoppingList(req, res) {
  try {
    const username = req.user.username;
    const listName = req.params.list_name;
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    // Find the shopping list by listName
    const shoppingList = user.shopping_lists.find(
      (list) => list.list_name === listName
    );

    if (!shoppingList) {
      throw new Error("Shopping list not found");
    }

    res.status(200).json({ items: shoppingList.items });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteItemFromShoppingList(req, res) {
  try {
    const username = req.user.username;
    const listName = req.params.list_name;
    const itemId = req.params.item_id;
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    const shoppingList = user.shopping_lists.find(
      (list) => list.list_name === listName
    );

    if (!shoppingList) {
      throw new Error("Shopping list not found");
    }

    shoppingList.items.pull({ _id: itemId });
    await user.save();
    res
      .status(200)
      .json({ message: "Item deleted from shopping list successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateShoppingListItem(req, res) {
  try {
    const username = req.user.username;
    const listName = req.params.list_name;
    const itemId = req.params.item_id;
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    const shoppingList = user.shopping_lists.find(
      (list) => list.list_name === listName
    );

    if (!shoppingList) {
      throw new Error("Shopping list not found");
    }

    const item = shoppingList.items.id(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    // Update item properties with the values from the request body
    Object.assign(item, req.body);

    await user.save();
    res
      .status(200)
      .json({ message: "Shopping list item updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  // Shopping list-related functions
  addShoppingList,
  deleteShoppingList,
  getAllShoppingLists,
  addItemToShoppingList,
  getItemsFromShoppingList,
  deleteItemFromShoppingList,
  updateShoppingListItem,
  updateShoppingListName,
};
