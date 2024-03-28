const express = require("express");
const {
    addShoppingList,
    deleteShoppingList,
    getAllShoppingLists,
    addItemToShoppingList,
    getItemsFromShoppingList,
    deleteItemFromShoppingList,
    updateShoppingListItem,
} = require("../controllers/shoppingListController");

const {
    authenticateToken,
} = require("../controllers/authController");
  
const router = express.Router();


router.post("/add-shopping-list", authenticateToken, addShoppingList);
router.delete("/delete-shopping-list/:list_name", authenticateToken, deleteShoppingList);
router.get("/get-all-shopping-lists", authenticateToken, getAllShoppingLists);
router.get("/get-items-from-shopping-list/:list_name", authenticateToken, getItemsFromShoppingList);
router.post("/add-item-to-shopping-list/:list_name", authenticateToken, addItemToShoppingList);
router.delete("/delete-item-from-shopping-list/:list_name/:item_id", authenticateToken, deleteItemFromShoppingList);
router.put("/update-shopping-list-item/:list_name/:item_id", authenticateToken, updateShoppingListItem);


module.exports = router;