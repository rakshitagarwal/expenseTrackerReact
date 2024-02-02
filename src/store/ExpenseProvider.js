import React, { useContext, useEffect, useState } from "react";
import ExpenseContext from "./ExpenseContext";
import AuthContext from "./authContextProvider";
import axios from "axios";

const ExpenseProvider = (props) => {
  const [itemsArr, setItemsArr] = useState([]);
  const [editItems, updateEditItems] = useState(null);
  const authCtx = useContext(AuthContext);
 
  const addItemHandler = (item) => {
    setItemsArr([item, ...itemsArr]);
  };

  const editItemHandler = (item, filtered) => {
    updateEditItems(item);
    setItemsArr(filtered);
  };

  const removeItemHandler = async (item) => {
    const filtered = itemsArr.filter((ele) => ele !== item);
    setItemsArr([...filtered]);
    const email = authCtx.userEmail.replace(/[\.@]/g, "");
    try {
      const res = await axios.get(
        `https://expense-tracker-6bd50-default-rtdb.firebaseio.com/${email}/expenses.json`
      );
      const data = res.data;
      const itemId = Object.keys(data).find((id) => data[id].id === item.id);
      try {
        const res = await axios.delete(
          `https://expense-tracker-6bd50-default-rtdb.firebaseio.com/${email}/expenses/${itemId}.json`
        );
      } catch (error) {
        alert(error);
      }
    } catch (error) {
      alert(error);
    }
  };

  const expenseContext = {
    items: itemsArr,
    editItems: editItems,
    addItem: addItemHandler,
    removeItem: removeItemHandler,
    editItem: editItemHandler,
  };

  return (
    <ExpenseContext.Provider value={expenseContext}>
      {props.children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseProvider;
