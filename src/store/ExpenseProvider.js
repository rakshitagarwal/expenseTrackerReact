import React, { useContext, useEffect, useState } from "react";
import ExpenseContext from "./ExpenseContext";
import AuthContext from "./authContextProvider";
// import { useReducer } from "react";
import axios from "axios";

// let defaultExpenseState = {
//   expenses: [],
//   totalAmount: 0,
// };

// const ExpenseReducer = (state, action) => {
//   if (action.type === "ADD") {
//     return {
//       expenses: action.expenses,
//       totalAmount: action.totalAmount,
//     };
//   }

//   if (action.type === "REMOVE") {
//     return {
//       expenses: action.expenses,
//       totalAmount: action.totalAmount,
//     };
//   }

//   return defaultExpenseState;
// };

const ExpenseProvider = (props) => {
  const [itemsArr, setItemsArr] = useState([]);
  const [editItems, updateEditItems] = useState(null);
  const authCtx = useContext(AuthContext);
  // Removing @ and . from email to use in firebase
  // let editedEmail;
  // if (localStorage.getItem("email")) {
  //   editedEmail = localStorage
  //     .getItem("email")
  //     .replace("@", "")
  //     .replace(".", "");
  // } else {
  //   editedEmail = "";
  // }

  // const [expenseState, dispatchExpenseAction] = useReducer(
  //   ExpenseReducer,
  //   defaultExpenseState
  // );

  //fetching data from firebase after login//
  // useEffect(() => {
  //   console.log("effect", editedEmail);
  //   const setDefaultValue = async () => {
  //     await fetch(
  //       `https://expense-tracker-1672f-default-rtdb.firebaseio.com/expense/${editedEmail}.json`
  //     )
  //       .then((res) => {
  //         return res.json();
  //       })
  //       .then((data) => {
  //         dispatchExpenseAction({
  //           type: "ADD",
  //           expenses: data?.expenses || [],
  //           totalAmount: data?.totalAmount || 0,
  //         });
  //         console.log(data);
  //       })
  //       .catch((err) => console.log(err));
  //   };
  //   if (editedEmail) {
  //     setDefaultValue();
  //   }
  // }, [editedEmail]);

  //Adding Expense to database//

  // const addExpenseHandler = async (expense) => {
  //   const updatedTotalAmount = expenseState.totalAmount + expense.expenseAmount;

  //   const updatedExpense = (expenseState.expenses || []).concat(expense);

  //   dispatchExpenseAction({
  //     type: "ADD",
  //     expenses: updatedExpense,
  //     totalAmount: updatedTotalAmount,
  //   });
  //   await fetch(
  //     `https://expense-tracker-1672f-default-rtdb.firebaseio.com/expense/${editedEmail}.json`,
  //     {
  //       method: "PUT",
  //       body: JSON.stringify({
  //         expenses: updatedExpense,
  //         totalAmount: updatedTotalAmount,
  //       }),
  //     }
  //   )
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const addItemHandler = (item) => {
    setItemsArr([item, ...itemsArr]);
  };

  const editItemHandler = (item, filtered) => {
    updateEditItems(item);
    setItemsArr(filtered);
  };

  //Removing Expense from database//

  const removeItemHandler = async (item) => {
    const filtered = itemsArr.filter((ele) => ele !== item);
    setItemsArr([...filtered]);
    const email = authCtx.userEmail.replace(/[\.@]/g, "");
    try {
      const res = await axios.get(
        `https://expense-tracker-1672f-default-rtdb.firebaseio.com/${email}/expenses.json`
      );
      const data = res.data;
      const itemId = Object.keys(data).find((id) => data[id].id === item.id);
      try {
        const res = await axios.delete(
          `https://expense-tracker-1672f-default-rtdb.firebaseio.com/${email}/expenses/${itemId}.json`
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
