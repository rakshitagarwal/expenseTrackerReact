import React, { useContext, useState } from "react";
import ExpenseContext from "./ExpenseContext";
import AuthContext from "./auth-context";

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("user");
  const initialUserEmail = localStorage.getItem("userEmail");
  const [token, setToken] = useState(initialToken);
  const [userEmail, setUserEmail] = useState(initialUserEmail);
  const userLoggedIn = !!token;

  const expCtx = useContext(ExpenseContext);

  const loginHandler = (tokenId, email) => {
    setToken(tokenId);
    setUserEmail(email);
    expCtx.onLogin();
    localStorage.setItem("user", tokenId);
    localStorage.setItem("userEmail", email);
  };

  const logoutHandler = () => {
    setToken(null);
    setUserEmail(null);
    expCtx.items = [];
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.clear();
  };

  setTimeout(() => {
    logoutHandler();
  }, 5 * 600000);

  const contextValue = {
    token: token,
    userEmail: userEmail,
    isLoggedIn: userLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
