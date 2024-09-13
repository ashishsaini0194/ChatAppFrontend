import { Alert, Button, Input, Link, Typography } from "@mui/material";
import { styled } from "@stitches/react";
import React, { useRef, useState } from "react";
import {
  ErrorResponseComp,
  validTypes,
} from "../../components/ErrorResponseComp";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [responseState, setResponseState] = useState({});
  const navigation = useNavigate();
  const signup = async () => {
    if (!email || !password || !name) {
      console.log(email, password, name);

      setResponseState({
        type: validTypes.error,
        message: "Invalid data !",
      });
      return;
    }
    const dataToSend = {
      email,
      password,
      name,
    };
    let data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
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
        navigation("/mode/login");
      }, 0);
    }
  };
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <ParentDiv>
        <Signuptext>Sign up</Signuptext>

        <Typography variant="h7" color="grey" align="left" marginTop={2}>
          Full Name
        </Typography>
        <Input
          type="text"
          color="grey"
          placeholder="Bond 007"
          disableUnderline={true}
          onChange={(e) => setName(e.target.value)}
          sx={{
            ...basicStyle,
          }}
        />

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
          autoComplete="off"
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
          // onClick={signup}
        >
          Sign up
        </Button>

        <Typography variant="h7" color="white" align="center" marginTop={2}>
          Already have an account?{" "}
          <Link color="#ffffff" href="login">
            Sign in
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

const Signuptext = styled("h1", {
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
