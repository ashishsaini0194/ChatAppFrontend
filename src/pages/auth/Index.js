import React from "react";
import {
  styled,
  css,
  globalCss,
  keyframes,
  theme,
  createTheme,
  getCssText,
} from "@stitches/react";
import { Outlet } from "react-router-dom";

function Auth() {
  return (
    <MainDiv>
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
