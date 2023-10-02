import * as React from "react";
import { useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";

export default function ProfileForm() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const formRef = useRef();
  let nameRef = useRef();
  let contactRef = useRef();

  const updateVisibleHandler = async () => {
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyA4SAXHYrgiGDnv6iLxGnM6era5CLULX8M",
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
        // setUserData(data.users[0]);
        nameRef.current.value = data.users[0].displayName.toUpperCase() || "";
        contactRef.current.value = data.users[0].photoUrl || "";
      }

      console.log("data", data);
    } catch (error) {
      alert(error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  React.useEffect(() => {
    updateVisibleHandler();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // const enteredName = nameRef.current.value;
    // const contact = contactRef.current.value;

    const data = new FormData(event.currentTarget);
    let userDetails = {
      userName: data.get("name"),
      photoUrl: data.get("photoUrl"),
    };
    console.log(userDetails);

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyA4SAXHYrgiGDnv6iLxGnM6era5CLULX8M",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: localStorage.getItem("user"),
          displayName: userDetails.userName,
          photoUrl: userDetails.photoUrl,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          alert("Profile Updated");
          localStorage.setItem("name", userDetails.userName);

          return res.json();
        } else {
          return res.json().then((data) => {
            console.log("failed", data);
            let errorMessage = "Profile Update Failed";
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // navigate("/home");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <Container component="main" maxWidth="l">
      <CssBaseline />
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar src="/broken-image.jpg" />
        <Typography component="h1" variant="h5">
          Profile Details
        </Typography>
        <Box
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              // alignItems: "center",
            }}
          >
            <label>Full Name:</label>
            <TextField
              style={{ margin: 10 }}
              required={true}
              id="name"
              // label="Full Name"
              name="name"
              inputRef={nameRef}
              autoFocus
            />
          </Box>
          <Box
            sx={{
              mt: 1,
              marginLeft: 2,
              display: "flex",
              flexDirection: "column",
              // alignItems: "center",
            }}
          >
            <label>Contact no:</label>
            <TextField
              style={{ margin: 10 }}
              required={true}
              name="photoUrl"
              // label="Photo url"
              id="photoUrl"
              inputRef={contactRef}
              autoFocus
            />
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="error"
            style={{ margin: 10 }}
            sx={{ mt: 3, mb: 2 }}
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ margin: 10 }}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
