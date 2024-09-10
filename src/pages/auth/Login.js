import { Button, Input, Link, Typography } from "@mui/material";
import { styled } from "@stitches/react";
import React, { useState } from "react";
import {
  ErrorResponseComp,
  validTypes,
} from "../../components/ErrorResponseComp";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [responseState, setResponseState] = useState({});
  const navigation = useNavigate();
  const login = async () => {
    if (!email || !password) {
      alert("Inavlid email or password");
      return;
    }
    const dataToSend = {
      email,
      password,
    };
    const data = await fetch("http://localhost:3000/login", {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: { "Content-Type": "application/json" },
    });

    const jsonData = await data.json();
    if (data.status > 399) {
      setResponseState({ type: validTypes.error, message: jsonData?.message });
      setInterval(() => {
        setResponseState("");
      }, 1000);
    } else {
      // setResponseState({
      //   type: validTypes.success,
      //   message: jsonData?.message,
      // });
      setTimeout(() => {
        navigation("/");
      }, 0);
    }
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <ParentDiv>
        <LoginText>Sign in</LoginText>

        <Typography variant="h7" color="grey" align="left" marginTop={2}>
          Email
        </Typography>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          color="grey"
          placeholder="your@email.com"
          disableUnderline={true}
          sx={{
            ...basicStyle,
          }}
        />

        <Typography variant="h7" color="grey" align="left" marginTop={2}>
          Password
        </Typography>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          color="white"
          placeholder="*****"
          disableUnderline={true}
          sx={{
            ...basicStyle,
          }}
        />

        <Button
          sx={{ marginTop: 10, backgroundColor: "white", color: "black" }}
          variant="contained"
          // onClick={login}
        >
          Login
        </Button>

        <Typography variant="h7" color="white" align="center" marginTop={2}>
          Don't have an account?{" "}
          <Link color="#ffffff" href="signup">
            Sign up
          </Link>
        </Typography>
        <Typography
          style={{
            color: "palevioletred",
            marginTop: "73px",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Note: Under development
        </Typography>
      </ParentDiv>
      {responseState && <ErrorResponseComp {...responseState} />}
    </div>
  );
};

const ParentDiv = styled("div", {
  display: "flex",
  flexDirection: "column",
  margin: "auto",
  height: "450px",
  width: 320,
  border: "1px solid grey",
  padding: 40,
  borderRadius: 10,
});

const LoginText = styled("h1", {
  margin: 0,
  fontWeight: 600,
  lineHeight: 1.5,
  width: "100%",
  fontSize: "clamp(2rem, 10vw, 2.15rem)",
  margin: "10px 0px",
  color: "White",
  textAlign: "start",
  marginTop: 0,
});

const basicStyle = {
  color: "white",
  border: "0.1px solid grey",
  borderRadius: 1,
  marginTop: 1,
  padding: "5px 10px",
  fontSize: 14,
  "&:hover": {
    border: "0.1px solid white",
  },
};
