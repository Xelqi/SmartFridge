import PropTypes from "prop-types";
import ShoppingListItem from "./ShoppingListItem";
import ListForm from "./ListForm";
import { useState } from "react";

function ShoppingList({ shoppingLists, setShoppingLists }) {
  const [editListNameId, setEditListNameId] = useState(null);
  const [newListName, setNewListName] = useState("");

  const startEditingListName = (listId, currentName) => {
    setEditListNameId(listId);
    setNewListName(currentName);
  };

  const saveEditedListName = async (listId) => {
    try {
      await renameList(listId, newListName);
      setEditListNameId(null);
      setNewListName("");
    } catch (error) {
      console.error("Error renaming shopping list:", error);
    }
  };

  const renameList = async (listId, newName) => {
    try {
      const response = await fetch(
        `/api/shopping/update-shopping-list-name/${listId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ list_name: newName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to rename shopping list");
      }

      const updatedListsResponse = await fetch(
        "/api/shopping/get-all-shopping-lists"
      );
      if (!updatedListsResponse.ok) {
        throw new Error("Failed to fetch updated shopping lists");
      }
      const updatedListsData = await updatedListsResponse.json();
      setShoppingLists(updatedListsData.shopping_lists);
    } catch (error) {
      console.error("Error renaming shopping list:", error);
    }
  };

  const addItem = async (itemName, listName) => {
    try {
      const response = await fetch(
        `/api/shopping/add-item-to-shopping-list/${listName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [{ item_name: itemName, quantity: 1 }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add item to shopping list");
      }

      const updatedListsResponse = await fetch(
        "/api/shopping/get-all-shopping-lists"
      );
      if (!updatedListsResponse.ok) {
        throw new Error("Failed to fetch updated shopping lists");
      }
      const updatedListsData = await updatedListsResponse.json();
      setShoppingLists(updatedListsData.shopping_lists);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleToggle = async (itemId, newDoneValue, listName) => {
    try {
      const response = await fetch(
        `/api/shopping/update-shopping-list-item/${listName}/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ checked: newDoneValue }), // Send the new checked value
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle item");
      }

      // If toggle successful, fetch updated shopping lists
      const updatedListsResponse = await fetch(
        "/api/shopping/get-all-shopping-lists"
      );
      if (!updatedListsResponse.ok) {
        throw new Error("Failed to fetch updated shopping lists");
      }
      const updatedListsData = await updatedListsResponse.json();
      setShoppingLists(updatedListsData.shopping_lists);
    } catch (error) {
      console.error("Error toggling item:", error);
    }
  };

  const deleteItem = async (itemId, listName) => {
    try {
      const response = await fetch(
        `/api/shopping/delete-item-from-shopping-list/${listName}/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      const updatedListsResponse = await fetch(
        "/api/shopping/get-all-shopping-lists"
      );
      if (!updatedListsResponse.ok) {
        throw new Error("Failed to fetch updated shopping lists");
      }
      const updatedListsData = await updatedListsResponse.json();
      setShoppingLists(updatedListsData.shopping_lists);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const renameItem = async (itemId, newName, listName, newQuantity) => {
    try {
      const response = await fetch(
        `/api/shopping/update-shopping-list-item/${listName}/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ item_name: newName, quantity: newQuantity }), // Include quantity in the request payload
        }
      );

      if (!response.ok) {
        throw new Error("Failed to rename item");
      }

      // If renaming successful, fetch updated shopping lists
      const updatedListsResponse = await fetch(
        "/api/shopping/get-all-shopping-lists"
      );
      if (!updatedListsResponse.ok) {
        throw new Error("Failed to fetch updated shopping lists");
      }
      const updatedListsData = await updatedListsResponse.json();
      setShoppingLists(updatedListsData.shopping_lists);
    } catch (error) {
      console.error("Error renaming item:", error);
    }
  };

  const deleteList = async (listId) => {
    try {
      const response = await fetch(
        `/api/shopping/delete-shopping-list/${listId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete shopping list");
      }

      const updatedListsResponse = await fetch(
        "/api/shopping/get-all-shopping-lists"
      );
      if (!updatedListsResponse.ok) {
        throw new Error("Failed to fetch updated shopping lists");
      }
      const updatedListsData = await updatedListsResponse.json();
      setShoppingLists(updatedListsData.shopping_lists);
    } catch (error) {
      console.error("Error deleting shopping list:", error);
    }
  };

  return (
    <div
      className="container mt-4 overflow-y-auto"
      style={{ height: "calc(100svh - 57px - 65px - 70px)" }}
    >
      {shoppingLists.map((list) => {
        const checkedItemsCount = list.items.filter(
          (item) => item.checked
        ).length;
        const totalItemsCount = list.items.length;

        return (
          <div
            className="card mb-3 rounded-5 shadow-sm mx-auto"
            style={{ cursor: "pointer", maxWidth: "450px" }}
            key={list._id}
          >
            <div className="card-body">
              <div
                data-bs-toggle="collapse"
                data-bs-target={`#collapseMe${list._id}`}
              >
                <div className="card-title d-flex justify-content-between align-items-baseline fw-normal mb-0">
                  {editListNameId === list._id ? (
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control text-center rounded-4"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        onBlur={() => saveEditedListName(list._id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveEditedListName(list._id);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <button
                        className="btn p-0 m-0"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingListName(list._id, list.list_name);
                        }}
                      >
                        <img
                          src="/edit.png"
                          alt=""
                          style={{ width: "25px", height: "25px" }}
                        />
                      </button>
                      <h3
                        className="mx-auto text-center"
                       
                      >
                        {list.list_name}
                      </h3>
                      <button
                        className="btn p-0 m-0"
                        id="buttons"
                        onClick={() => deleteList(list._id)}
                      >
                        <img
                          src="/trash.png"
                          alt=""
                          style={{
                            cursor: "pointer",
                            width: "25px",
                            height: "25px",
                          }}
                        />
                      </button>
                    </>
                  )}
                </div>
                <h3 className="d-flex justify-content-center align-items-baseline">
                  {checkedItemsCount}
                  <span className="text-muted fs-6 ms-1">
                    {" "}
                    / {totalItemsCount}
                  </span>
                </h3>
                <div className="progress rounded-pill bg-secondary mt-1 mb-3">
                  <div
                    className="progress-bar bg-primary"
                    aria-valuenow={checkedItemsCount}
                    aria-valuemin="0"
                    aria-valuemax={totalItemsCount}
                    style={{
                      width: `${
                        (checkedItemsCount / list.items.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className={`collapse `} id={`collapseMe${list._id}`}>
                <ListForm
                  onAdd={(itemName) => addItem(itemName, list.list_name)}
                />
                <div>
                  {list.items.map((item) => (
                    <ShoppingListItem
                      key={item._id}
                      item={item}
                      done={item.checked}
                      onToggle={(newDoneValue) =>
                        handleToggle(item._id, newDoneValue, list.list_name)
                      }
                      onDelete={(itemId) => deleteItem(itemId, list.list_name)}
                      onRename={(itemId, newName, newQuantity) =>
                        renameItem(itemId, newName, list.list_name, newQuantity)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

ShoppingList.propTypes = {
  shoppingLists: PropTypes.array.isRequired,
  setShoppingLists: PropTypes.func.isRequired,
};

export default ShoppingList;
