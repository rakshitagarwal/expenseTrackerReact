import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/expenses.png";
import { authActions } from "../store/auth-slice";
import { expenseActions } from "../store/expense-slice";
import { useDispatch, useSelector } from "react-redux";
import { themeActions } from "../store/theme-slice";
import Switch from "@mui/material/Switch";
import { useState } from "react";
import ProfileForm from "./ProfileForm";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const auth = useSelector((state) => state.auth);
  const isDarkMode = useSelector((state) => state.theme.isDark);
  const location = useLocation();
  const isLocation = location.pathname === "/profileform";

  const updateVisibleHandler = async () => {
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDeTrjpAdKVNqCov-5MwyTKP3LyJuKbC-o",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: localStorage.getItem("user"),
          }),
        }
      );
      const data = await res.json();
      if (data.users) {
        setUserData(data.users[0]);
      }

      console.log("data", data);
    } catch (error) {
      alert(error);
    }
  };

  React.useEffect(() => {
    updateVisibleHandler();
  }, []);

  const handleLogout = () => {
    if (isDarkMode === true) {
      dispatch(themeActions.toggelTheme());
    }
    dispatch(authActions.logout());
    dispatch(expenseActions.setItemsEmpty());
    navigate("/login", { replace: true });
  };

  const clickModeHandler = async () => {
    dispatch(themeActions.toggelTheme());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{ height: 50, padding: 5, margin: 5 }}
            ></img>
            Welcome to Expense Tracker !!!{"      "}
          </Typography>
          <Typography style={{ margin: 10, padding: 5 }} sx={{ flexGrow: 0.5 }}>
            Welcome{" "}
            {auth.isLoggedIn &&
            userData !== null &&
            userData.displayName !== undefined
              ? userData.displayName
              : ""}{" "}
            !!
          </Typography>

          {auth.isPremium && (
            <>
              <WbSunnyOutlinedIcon />
              <Switch
                defaultChecked
                color="warning"
                onChange={clickModeHandler}
              />
              <DarkModeIcon style={{ marginRight: 8 }} />
            </>
          )}

          {auth.isLoggedIn && (
            <>
              <Button onClick={() => navigate("/")} style={{ color: "white" }}>
                {" "}
                Home
              </Button>

              <Button
                onClick={() => navigate("/profileform")}
                style={{ color: "white" }}
              >
                Profile
              </Button>
            </>
          )}
          {auth.isLoggedIn && (
            <Button
              onClick={handleLogout}
              style={{ margin: 10, color: "white" }}
            >
              Log Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {isLocation && <ProfileForm user={userData} />}
    </Box>
  );
}
