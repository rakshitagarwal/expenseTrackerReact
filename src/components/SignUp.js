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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
// import { Paper } from "@mui/material";
import { useState } from "react";

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [verifyMail, setVerifymail] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);

    const enteredEmail = data.get("email");
    const enteredPass = data.get("password");
    const enteredConPass = data.get("confirmpassword");

    // const editedEmail = enteredEmail.replace("@", "").replace(".", "");

    if (enteredPass !== enteredConPass) {
      alert("Password do not match");
    }
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA4SAXHYrgiGDnv6iLxGnM6era5CLULX8M",
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
      console.log(data);
      if (res.ok) {
        try {
          const response = await fetch(
            "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyA4SAXHYrgiGDnv6iLxGnM6era5CLULX8M",
            {
              method: "POST",
              body: JSON.stringify({
                requestType: "VERIFY_EMAIL",
                idToken: data.idToken,
              }),
              headers: {
                "content-type": "application/json",
              },
            }
          );
          if (response.ok) {
            setIsLoading(false);
            alert("Verification email sent.");
            setVerifymail(true);
            setTimeout(() => {
              setVerifymail(false);
            }, 10000);
          } else {
            throw new Error("Sign Up failed. Try again.");
          }
        } catch (error) {
          alert(error);
        }
      } else {
        throw Error("Authentication Failed");
      }
    } catch (error) {
      alert(error);
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: 3,
            borderRadius: 10,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmpassword"
              label=" Confirm Password"
              type="password"
              id="confirmpassword"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {!isLoading ? "Sign up" : "Sending request..."}
            </Button>
            {verifyMail && (
              <p style={{ margin: "1rem", color: "green" }}>
                Please varify email. Verfication mail already sent.
              </p>
            )}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2"></Link>
              </Grid>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
