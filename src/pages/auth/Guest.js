import { Button, Input, Link, Typography } from "@mui/material";
import { styled } from "@stitches/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Guest = (props) => {
  const nagigate = useNavigate();
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <ParentDiv>
        <LoginText>Guest</LoginText>

        {/* <Typography variant="h7" color="grey" align="left" marginTop={2}>
          Full Name
        </Typography>
        */}

        <div style={{ marginTop: 10 }}>
          <img
            width="100"
            height="100"
            src="https://img.icons8.com/clouds/100/guest-male.png"
            alt="guest-male"
          />
        </div>
        <Button
          sx={{ marginTop: 5, backgroundColor: "white", color: "black" }}
          variant="contained"
          onClick={() => nagigate("/")}
        >
          Continue as Guest
        </Button>

        <Typography variant="h7" color="white" align="center" marginTop={2}>
          Already have an account?{" "}
          <Link color="#ffffff" href="login">
            Sign in
          </Link>
        </Typography>

        <Typography
          variant="h7"
          color="grey"
          align="left"
          marginTop={10}
          fontSize={"14px"}
        >
          <b>Note:</b> As a guest user your message history will not be
          recorded, data can not be saved with our servers and you will be
          entering as a anonymous person with a random name assigned.
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
