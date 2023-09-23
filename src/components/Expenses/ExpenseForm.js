import React, { useRef, useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ExpenseList from "./ExpenseList";
import axios from "axios";
import { expenseActions } from "../../store/expense-slice";

const ExpenseForm = () => {
  const [isEdit, setIsEdit] = useState(null);
  const desInputRef = useRef();
  const amountInputRef = useRef();
  const catInputRef = useRef();

  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expense.expenses);
  const totalAmount = useSelector((state) => state.expense.totalAmount);

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredAmount = amountInputRef.current.value;
    const enteredDes = desInputRef.current.value;
    const enteredCat = catInputRef.current.value;

    const expenseDetails = {
      amount: enteredAmount,
      description: enteredDes,
      category: enteredCat,
    };
    const email = localStorage.getItem("email");
    const newEmail = email.replace("@", "").replace(".", "").replace(".", "");
    if (isEdit === null) {
      try {
        const response = await axios.post(
          `https://crudcrud.com/api/3b35b85687b34694a4096e84a33e8e67/${newEmail}`,
          { expenseDetails }
        );
        
        const updatedExpense = {
          ...expenseDetails,
          id: response.data._id,
        };
        console.log(updatedExpense)
        dispatch(
          expenseActions.addExpense({
            expense: updatedExpense,
            amount: updatedExpense.amount,
          })
        ); 
        amountInputRef.current.value = "";
        desInputRef.current.value = "";
      } catch (error) {
        console.log(error);
      }
    } else {

        console.log(isEdit)
      const id = isEdit.id;
      const amount = isEdit.amount;
      try {
        await axios.put(
          `https://crudcrud.com/api/3b35b85687b34694a4096e84a33e8e67${newEmail}/${id}`,
          { expenseDetails }
        );
        const existingExpenseIndex = expenses.findIndex((ele) => ele.id === id);
        const updatedexpenses = [...expenses];
        const updatedexpense = {
          ...expenseDetails,
          id: id,
        };
        updatedexpenses[existingExpenseIndex] = updatedexpense;
        const removeAmount = Math.abs(amount - updatedexpense.amount);
        dispatch(
          expenseActions.editExpense({
            expenses: updatedexpenses,
            amount: removeAmount,
          })
        );
        amountInputRef.current.value = "";
        desInputRef.current.value = "";
        setIsEdit(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editExpenseHandler = (expense) => {
    
    console.log(expense);
    amountInputRef.current.value = expense.amount;
    desInputRef.current.value = expense.description;
    catInputRef.current.value = expense.category;
    setIsEdit({ _id: expense._id, amount: expense.amount });
  };

  const downloadHandler = () => {
    const headers = Object.keys(expenses[0]).toString();

    const main = expenses.map((item) => {
      return Object.values(item).toString();
    });
    const amount = `Total Amount: ${totalAmount} Rs`;
    const csv = [headers, ...main, amount].join("\n");
    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.download = "expenselist.csv";
    a.href = url;
    a.click();
  };

  return (
    <Container>
      <Form onSubmit={submitHandler} className='fw-semibold'>
        <Form.Group className="mt-3">
          <Form.Label>Expense Amount</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text>&#8377;</InputGroup.Text>
            <Form.Control type="number" ref={amountInputRef} />
            <InputGroup.Text>.00</InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Description"
            ref={desInputRef}
          />
        </Form.Group>
        <Form.Select className="mb-3" ref={catInputRef}>
          <option>Choose Category</option>
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Salary">Salary</option>
          <option value="Furniture">Furniture</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Electronics">Electronics</option>
          <option value="Others">Others</option>
        </Form.Select>
        <div className="d-grid gap-2">
          <Button type="submit" variant="outline-warning" size="lg">
            {!isEdit ? "Add Expense" : "Edit Expense"}
          </Button>
        </div>
      </Form>
      <div className="d-flex justify-content-center my-5">
        <Button variant="outline-info" onClick={downloadHandler}>
          Download Expense List
        </Button>
      </div>
      <ExpenseList onClick={editExpenseHandler} />
    </Container>
  );
};

export default ExpenseForm;