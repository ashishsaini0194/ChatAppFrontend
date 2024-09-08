import React, { useEffect } from "react";
import {
  styled,
  css,
  globalCss,
  keyframes,
  theme,
  createTheme,
  getCssText,
} from "@stitches/react";
import { Outlet, useNavigate } from "react-router-dom";
import { Typography, Link } from "@mui/material";

function Auth() {
  const navigate = useNavigate();
  const urlParam = window.location;
  useEffect(() => {
    const getLoginInfo = sessionStorage.getItem("guest");
    if (getLoginInfo === "true") navigate("/", { replace: true });

    if (urlParam.pathname == "/mode") {
      console.log("heh");
      navigate("guest");
    }
  }, []);
  return (
    <MainDiv>
      {!urlParam.pathname.includes("guest") && (
        <Typography
          variant="h7"
          color="white"
          align="left"
          marginTop={2}
          position={"absolute"}
          right={17}
          style={{ cursor: "pointer" }}
        >
          <Link color="#ffffff" href="guest">
            Guest Mode
          </Link>
        </Typography>
      )}
      <Outlet />
    </MainDiv>
  );
}

export default Auth;

const MainDiv = styled("div", {
  backgroundColor: "black",
  backgroundImage:
    "radial-gradient(at 50% 50%, rgba(0, 41, 82, 0.5), rgb(9, 11, 17))",
  height: "100vh",
});
