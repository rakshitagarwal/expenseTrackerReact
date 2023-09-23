import * as React from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { expenseActions } from "../store/expense-slice";
import { themeActions } from "../store/theme-slice";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "darkgray",
    color: theme.palette.common.black,
    fontSize: 18,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ExpenseTable(props) {
  // const ExpenseCntxt = useContext(ExpenseContext);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const expense = useSelector((state) => state.expenseStore);
  const hasItems = expense.items.length > 0;

  const editClickHandler = (item) => {
    const filter = expense.items.filter((ele) => ele !== item);
    // expense.editItem(item, filter);
    dispatch(expenseActions.editItem({ item: item, filtered: filter }));
  };

  const expenseRemoveHandler = async (item) => {
    dispatch(expenseActions.removeItem(item));
    const editedEmail = localStorage
      .getItem("userEmail")
      .replace("@", "")
      .replace(".", "");
    try {
      const res = await axios.get(
        `https://expense-tracker-1672f-default-rtdb.firebaseio.com/${editedEmail}/expenses.json`
      );

      const data = res.data;
      const Id = Object.keys(data).find((eleId) => data[eleId].id === item.id);
      try {
        const res = await axios.delete(
          `https://expense-tracker-1672f-default-rtdb.firebaseio.com/${editedEmail}/expenses/${Id}.json`
        );
      } catch (error) {
        alert(error);
      }
    } catch (error) {
      alert(error);
    }
  };

  const restoreExpenses = async () => {
    const editedEmail = localStorage
      .getItem("userEmail")
      .replace("@", "")
      .replace(".", "");

    try {
      const res = await axios.get(
        `https://expense-tracker-1672f-default-rtdb.firebaseio.com/${editedEmail}/expenses.json`
      );
      const data = res.data;
      if (data) {
        const realData = Object.values(data).reverse();
        dispatch(expenseActions.setItems(realData));
      }
    } catch (error) {
      alert(error);
    }
  };

  React.useEffect(() => {
    if (auth.userEmail !== null) {
      restoreExpenses();
    }
  }, [auth.userEmail]);

  let total = 0;
  let totalAmount;
  expense.items.forEach((element) => {
    total += Number(element.enteredAmt);
    totalAmount = total.toLocaleString("en-IN");
  });

  const clickActPremiumHandler = async () => {
    dispatch(themeActions.toggelTheme());
    const editedEmail = localStorage
      .getItem("userEmail")
      .replace("@", "")
      .replace(".", "");
    try {
      const res = await axios.post(
        `https://expense-tracker-1672f-default-rtdb.firebaseio.com/${editedEmail}/userDetail.json`,
        { isPremium: true }
      );
    } catch (error) {
      alert(error);
    }
    dispatch(authActions.setIsPremium());
    localStorage.setItem("isPremium", true);
  };

  const clickDownloadHandler = () => {
    const generateCSV = (itemsArr) => {
      const csvRows = [];
      const headers = ["Description", "Amount", "Category"];
      csvRows.push(headers.join(","));

      itemsArr.forEach((e) => {
        const row = [e.enteredDes, e.enteredAmt, e.enteredDes];
        csvRows.push(row.join(","));
      });
      return csvRows.join("\n");
    };
    const csvContent = generateCSV(expense.items);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "expenses.csv";
    downloadLink.click();
  };

  return (
    <Container>
      {!hasItems && (
        <div>
          <Card style={{ padding: 20 }}>
            <h3>No Expense Recorded.</h3>
          </Card>
        </div>
      )}
      {hasItems && (
        <Card style={{ padding: 20, display: "flex" }}>
          <h3>
            Total Expense: <span>Rs {totalAmount}</span>
          </h3>
          {total > 10000 &&
            (!auth.isPremium ? (
              <Button variant="danger" onClick={clickActPremiumHandler}>
                Activate Premium
              </Button>
            ) : (
              <Button
                variant="warning"
                sx={{ marginLeft: 2 }}
                onClick={clickDownloadHandler}
              >
                Download List
              </Button>
            ))}
          {total >= 10000 && !auth.isPremium && (
            <p style={{ color: "red" }}>
              *Please Activate Premium total expenses more than 10000
            </p>
          )}
        </Card>
      )}
      {hasItems && (
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Expense Description</StyledTableCell>
                <StyledTableCell>ExpenseAmount</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expense.items.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.enteredDes}
                  </StyledTableCell>
                  <StyledTableCell>
                    Rs {row.enteredAmt.toLocaleString("en-IN")}
                  </StyledTableCell>
                  <StyledTableCell>{row.category}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={editClickHandler.bind(null, row)}
                    >
                      {" "}
                      Edit
                    </Button>
                  </StyledTableCell>

                  <StyledTableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={expenseRemoveHandler.bind(null, row)}
                    >
                      {" "}
                      Delete
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
