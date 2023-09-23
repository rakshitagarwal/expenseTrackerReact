import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import NewExpense from "./NewExpense";
import { expenseActions } from "../../store/expense-slice";
import axios from "axios";
// import { premiumActions } from "../../store/premium-slice";

const ExpenseList = (props) => {
  console.log(props,"list");
  const expenses = useSelector((state) => state.expense.expenses);
  const totalAmount = useSelector((state) => state.expense.totalAmount);
  
  const dispatch = useDispatch();
  const email = localStorage.getItem("email");
  const newEmail = email.replace("@", "").replace(".", "").replace(".", "");
  
  // if(Number(totalAmount)>=10000){
  //   dispatch(premiumActions.showPremium(true))
  // }else{
  //   dispatch(premiumActions.showPremium(false))
  // }
console.log(props.id)
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `https://crudcrud.com/api/3b35b85687b34694a4096e84a33e8e67/${newEmail}`
        );
        const data = response.data;
        
        const loadedExpenses = [];
        let totalAmount = 0;
        for (const key in data) {
          loadedExpenses.push({
            id: data.expenses,
            amount: data[key].expenseDetails.amount,
            category: data[key].expenseDetails.category,
            description: data[key].expenseDetails.description,
          } ); 
          totalAmount = +totalAmount + Number(data[key].expenseDetails.amount);
        }
       
        console.log(loadedExpenses);
        dispatch(
          expenseActions.replaceExpenses({
            expenses: loadedExpenses,
            amount: totalAmount,
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, [dispatch, newEmail]);

  return (
    <Card border="info">
      <Card.Header className="d-flex justify-content-between">
        <div>
          <p className="fw-bold">
        Expense List
          </p>
        </div>
        <div>
          <p className="fw-bold">Total Amount: &#8377;{totalAmount}</p>
        </div>
      </Card.Header>

      <Card.Body>
        <ListGroup as="ol" numbered>
          {expenses.map((ele) => (
            <NewExpense
              id={ele.id}
              key={ele.id}
              category={ele.category}
              description={ele.description}
              amount={ele.amount}
              onClick={props.onClick}
            />
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default ExpenseList;