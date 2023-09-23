import * as React from "react";
import { useRef, useState, useEffect } from "react";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { v4 as uuidv4 } from "uuid";
import ExpenseTable from "./ExpenseTable";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { expenseActions } from "../store/expense-slice";

export default function ExpenseForm() {
  const desInputRef = useRef();
  const amtInputRef = useRef();
  const cateRef = useRef();
  const [category, setCategory] = React.useState("");

  const auth = useSelector((state) => state.auth);
  const expense = useSelector((state) => state.expenseStore);
  const dispatch = useDispatch();
  // const ExpenseCntxt = React.useContext(ExpenseContext);
  // const hasItems = (ExpenseCntxt.expenses || []).length > 0;
  const [isInputValid, setIsInputValid] = useState(true);

  useEffect(() => {
    if (expense.editItems !== null) {
      amtInputRef.current.value = expense.editItems.enteredAmt;
      desInputRef.current.value = expense.editItems.enteredDes;
      cateRef.current.value = expense.editItems.category;
      setCategory(expense.editItems.category);
      // dispatch(expenseActions.setEditItemsNull());
    }
  }, [expense.editItems]);

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const addExpenseHandler = async (event) => {
    event.preventDefault();
    if (amtInputRef.current.value === "" || desInputRef.current.value === "") {
      setIsInputValid(false);
      return;
    }

    setIsInputValid(true);
    if (expense.editItems !== null) {
      // expCtx.removeItem(expCtx.editItems);
      console.log(expense.editItems);
      const email = auth.userEmail.replace(/[\.@]/g, "");
      try {
        const res = await axios.get(
          `https://expense-tracker-1672f-default-rtdb.firebaseio.com/${email}/expenses.json`
        );

        const data = res.data;
        const Id = Object.keys(data).find(
          (eleId) => data[eleId].id === expense.editItems.id
        );
        try {
          const resDlt = await axios.delete(
            `https://expense-tracker-1672f-default-rtdb.firebaseio.com/${email}/expenses/${Id}.json`
          );
        } catch (error) {
          alert(error);
        }
      } catch (error) {
        alert(error);
      }

      // dispatch(expenseActions.removeItem(expense.editItems));
      dispatch(expenseActions.setEditItemsNull());
    }

    const expDetail = {
      enteredDes: desInputRef.current.value,
      enteredAmt: +amtInputRef.current.value,
      category: cateRef.current.value,
      id: uuidv4(),
    };
    event.target.reset();
    setCategory("");
    const email = auth.userEmail.replace(/[\.@]/g, "");

    try {
      const res = await axios.post(
        `https://expense-tracker-1672f-default-rtdb.firebaseio.com/${email}/expenses.json`,
        expDetail
      );
    } catch (error) {
      alert(error);
    }
    dispatch(expenseActions.addItem(expDetail));
  };

  return (
    <Container>
      <Container component="main" maxWidth="l">
        {/* <Card> */}
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 5,
          }}
        >
          <Typography
            variant="h5"
            // sx={{ fontWeight: "bold", color: "#19376D" }}
          >
            Add New Expense
          </Typography>
        </Box>

        <Container
          component="form"
          onSubmit={addExpenseHandler}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>
              <InputLabel id="demo-simple-label">
                Expense Description:
              </InputLabel>
              <TextField
                style={{ margin: 10 }}
                required
                inputRef={desInputRef}
                id="description"
                // label="Description"
                name="description"
                autoFocus
              />
            </Box>

            <Box>
              <InputLabel id="demo-simple-label">Expense Amount:</InputLabel>
              <TextField
                style={{ margin: 10 }}
                required
                inputRef={amtInputRef}
                name="expenseAmount"
                // label="Expense Amount"
                type="number"
                id="expenseAmount"
              />
            </Box>
            <Box>
              <InputLabel id="demo-simple-label">Category:</InputLabel>
              <Select
                style={{ minWidth: 100 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="category"
                inputRef={cateRef}
                value={category}
                onChange={handleChange}
                // label="category"
              >
                <MenuItem value={"Food"}>Food</MenuItem>
                <MenuItem value={"Clothes"}>Clothes</MenuItem>
                <MenuItem value={"Grocery"}>Grocery</MenuItem>
                <MenuItem value={"Health"}>Health</MenuItem>
                <MenuItem value={"Rent"}>Rent</MenuItem>
                <MenuItem value={"Education"}>Education</MenuItem>
                <MenuItem value={"Travel"}>Travel</MenuItem>
                <MenuItem value={"Others"}>Others</MenuItem>
              </Select>
            </Box>
            <Box>
              <Button type="submit" variant="contained" style={{ margin: 10 }}>
                Add Expense
              </Button>
            </Box>
          </Box>
        </Container>
      </Container>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ExpenseTable />
      </Container>
    </Container>
  );
}
