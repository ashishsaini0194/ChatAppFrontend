import { Button, Input, Link, Typography } from "@mui/material";
import { styled } from "@stitches/react";
import React from "react";

export const Signup = () => {
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
          sx={{
            ...basicStyle,
          }}
        />

        <Typography variant="h7" color="grey" align="left" marginTop={2}>
          Email
        </Typography>
        <Input
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
        >
          Login
        </Button>

        <Typography variant="h7" color="white" align="center" marginTop={2}>
          Already have an account?{" "}
          <Link color="#ffffff" href="login">
            Sign in
          </Link>
        </Typography>
      </ParentDiv>
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
