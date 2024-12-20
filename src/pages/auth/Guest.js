import {
  Backdrop,
  Button,
  CircularProgress,
  Input,
  Link,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "../../stichesConfig";

export const Guest = (props) => {
  const navigate = useNavigate();

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
          onClick={() => {
            sessionStorage.setItem("guest", "true");
            navigate("../../", { replace: true });
          }}
        >
          Continue as Guest
        </Button>

        <Typography variant="h7" color="white" align="center" marginTop={3}>
          Already have an account?{" "}
          <Link color="#ffffff" href="login">
            Sign in
          </Link>
        </Typography>

        <StyledTypography
          variant="h7"
          color="grey"
          align="left"
          fontSize={"14px"}
        >
          <b>Note:</b> As a guest user your message history will not be
          recorded, data can not be saved with our servers and you will be
          entering as a anonymous person with a random name assigned.
        </StyledTypography>
      </ParentDiv>
    </div>
  );
};

const StyledTypography = styled(Typography, {
  marginTop: "80px !important",
  "@bp1": {
    marginTop: "65px !important",
  },
});

const ParentDiv = styled("div", {
  display: "flex",
  flexDirection: "column",
  margin: "auto",
  height: "450px",
  width: 320,
  border: "1px solid grey",
  padding: 40,
  borderRadius: 10,
  "@bp1": {
    padding: "30px 20px",
    width: "280px",
  },
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
