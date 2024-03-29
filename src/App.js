import "./App.css";
import SignUp from "./components/SignUp";
import LogIn from "./components/Login";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./Home";
import { useSelector } from "react-redux";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);  

  return (
    <div>
      <Header />
      {!isLoggedIn && (
        <Routes>
          <Route exact path="/" element={<SignUp />}></Route>
          <Route
            exact
            path="/forgotpassword"
            element={<ForgotPassword />}
          ></Route>
          <Route path="*" element={<LogIn />}></Route>
        </Routes>
      )}
      {isLoggedIn && (
        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
