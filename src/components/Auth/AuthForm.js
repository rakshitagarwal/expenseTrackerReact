import React, { useRef, useState } from "react";

import { Card, Button, Form, Container } from "react-bootstrap";

import axios from "axios";

import { useNavigate,Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";

const AuthForm = () => {
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const dispatch=useDispatch();

  const navigate = useNavigate();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    if (!isLogin) {
      const enteredConfirmPassword = confirmPasswordInputRef.current.value;
      if (enteredPassword === enteredConfirmPassword) {
        try {
          await axios.post(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD-jRUm-dDo3xmPnrSwylPoLvNHMamvWXs",
            {
              email: enteredEmail,
              password: enteredConfirmPassword,
              returnSecureToken: true,
            }
          );
          console.log("User has successfully signed up.");
        } catch (error) {
          setError(error.response.data.error.message);
        }
      } else {
        setError("Password is not matched");
      }
    } else {
      try {
        const response = await axios.post(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD-jRUm-dDo3xmPnrSwylPoLvNHMamvWXs",
          {
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }
        );
        console.log(response)
        dispatch(authActions.login(response.data.idToken))
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem('email',response.data.email)
        navigate("/welcome");
      } catch (error) {
        setError(error.response.data.error.message);
      }
    }
  };

  return (
    <React.Fragment>
      <Card
        style={{
          width: "20rem",
          margin: "auto",
          marginTop: "10vh",
        }}
      >
        <Card.Body>
          <Card.Title style={{ color: "black", textAlign: "center" }}>
            {!isLogin ? "Sign Up" : "Login"}
          </Card.Title>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-4 mt-4">
              <Form.Control
                type="email"
                placeholder="Email"
                required
                ref={emailInputRef}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Control
                type={!isLogin ? "text" : "password"}
                placeholder="Password"
                required
                ref={passwordInputRef}
              />
            </Form.Group>
            {!isLogin && (
              <Form.Group className="mb-4">
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  required
                  ref={confirmPasswordInputRef}
                />
              </Form.Group>
            )}
            <div className="d-grid gap-2">
          <Button type="submit" variant="success" size="md">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </div>
          </Form>
        </Card.Body>
        {isLogin && <Link to='/forgot' style={{textAlign:'center',textDecoration:'none'}}>Forgot password?</Link>}
      </Card>
      <Container
        style={{
          width: "20rem",
          margin: "auto",
          marginTop: "2vh",
          border: "2px solid black",
          borderRadius: "5px",
          backgroundColor: "#dcfaf5",
          textAlign: "center",
        }}
      >
        {!error ? (
          <button
            type="click"
            style={{ backgroundColor: "transparent", border: "none" }}
            onClick={switchAuthModeHandler}
          >
            {!isLogin
              ? "Have an account ? Login"
              : "Don't have an account? Sign up"}
          </button>
        ) : (
          <span>{error}</span>
        )}
      </Container>
    </React.Fragment>
  );
};

export default AuthForm;