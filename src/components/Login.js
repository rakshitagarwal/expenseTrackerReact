import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { themeActions } from "../store/theme-slice";
import { expenseActions } from "../store/expense-slice";

export default function LogIn() {
  const navigate = useNavigate();
  // const authCntxt = useContext(AuthContext);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const isDarkMode = useSelector((state) => state.theme.isDark);

  const logoutTimerRef = useRef();

  useEffect(() => {
    if (auth.token) {
      startLogoutTimer();
    }
  }, [auth.token]);

  const startLogoutTimer = () => {
    clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, 5 * 600000);
  };

  const handleLogout = () => {
    clearTimeout(logoutTimerRef.current);
    if (isDarkMode === true) {
      dispatch(themeActions.toggelTheme());
    }
    dispatch(authActions.logout());
    dispatch(expenseActions.setItemsEmpty());
    navigate("/login", { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const enteredEmail = data.get("email");
    const enteredPass = data.get("password");
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA4SAXHYrgiGDnv6iLxGnM6era5CLULX8M",
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPass,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        try {
          const response = await fetch(
            "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyA4SAXHYrgiGDnv6iLxGnM6era5CLULX8M",
            {
              method: "POST",
              body: JSON.stringify({
                idToken: data.idToken,
              }),
              headers: {
                "content-type": "application/json",
              },
            }
          );
          const userData = await response.json();
          console.log(userData.users[0]);
          if (!userData.users[0].emailVerified) {
            setIsVerifyEmail(true);
            return;
          } else {
            setIsVerifyEmail(false);
            navigate("/", { replace: true });
            startLogoutTimer();
            dispatch(
              authActions.login({ tokenId: data.idToken, email: data.email })
            );
            const email = enteredEmail.replace(/[\.@]/g, "");
            const modeRes = await axios.get(
              `https://expense-tracker-1672f-default-rtdb.firebaseio.com/${email}/userDetail.json`
            );
            if (modeRes.data) {
              dispatch(themeActions.toggelTheme());
              dispatch(authActions.setIsPremium());
              localStorage.setItem("isPremium", true);
            }
          }
        } catch (error) {
          alert(error);
        }
      } else {
        throw Error("Authentication Failed");
      }
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
          {isVerifyEmail && (
            <p style={{ color: "red" }}>Please verify email before login.</p>
          )}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgotpassword" variant="body2">
                {"Forgot Password?"}
              </Link>
            </Grid>
            <Grid item>
              <Link href="/" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
