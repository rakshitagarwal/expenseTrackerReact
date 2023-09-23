import { Button } from "react-bootstrap";
import React from "react";

import { Navbar,Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth-slice";

const MainNavigation = () => {
  const isLoggedIn=useSelector(state=>state.auth.isLoggedIn)
  const dispatch=useDispatch();

  const navigate=useNavigate();

  const logoutHandler=()=>{
    dispatch(authActions.logout())
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    navigate('/')
  }
  return (
    <Navbar bg="light">
      <Container>
        <Navbar.Brand href="/welcome" >Expense Tracker</Navbar.Brand>
        {isLoggedIn && <Button variant="outline-dark" onClick={logoutHandler} >Logout</Button>}
      </Container>
    </Navbar>
  );
};

export default MainNavigation;