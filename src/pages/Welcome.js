import axios from "axios";
import React from "react";
import { Container, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Expenses from "../components/Expenses/Expenses";
import ThemeChange from "../components/Layout/ThemeChange";

import classes from "./Welcome.module.css";

import { useSelector } from "react-redux";
import { premiumActions } from "../store/premium-slice";
import { useDispatch } from "react-redux";

const WelcomePage = () => {
  const token = useSelector((state) => state.auth.idToken);
  const totalAmount = useSelector((state) => state.expense.totalAmount);

  // const showPremium=useSelector(state=>state.premium.showPremium);

  const dispatch = useDispatch();
  const varifyEmailHandler = async () => {
    try {
      const response = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyD-jRUm-dDo3xmPnrSwylPoLvNHMamvWXs",
        {
          requestType: "VERIFY_EMAIL",
          idToken: token,
        }
      );
      console.log(response);
      alert("A verification link has been send to your mail id");
    } catch (error) {
      alert(error.response.data.error.message);
    }
  };

  const premiumHandler = () => {
    dispatch(premiumActions.setTheme("dark"));
  };
  return (
    <>
      <Container fluid className={classes.msg}>
        <p class={classes.welcome}>WELCOME TO EXPENSE TRACKER</p>
        <p>
          Your profile is incomplete.
          <NavLink to="/updateProfile">Complete Now</NavLink>
        </p>
      </Container>
      <Container className="mt-5">
        <div className="d-flex justify-content-between">
          <Button
            variant="outline-success"
            onClick={varifyEmailHandler}
            className="mb-3"
          >
            Verify Email
          </Button>
          <ThemeChange />
          {Number(totalAmount) >= 10000 ? (
            <Button variant="warning" className="mb-3" onClick={premiumHandler}>
              Active Premium
            </Button>
          ) : (
            ""
          )}
        </div>
        <h2 style={{ textAlign: "center" }}>Your Expenses</h2>
        <Expenses />
      </Container>
    </>
  );
};

export default WelcomePage;