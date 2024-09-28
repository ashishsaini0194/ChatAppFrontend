import { Alert } from "@mui/material";
import React, { useEffect } from "react";
export const validTypes = {
  success: "success",
  info: "info",
  warning: "warning",
  error: "error",
};

export function ErrorResponseComp({
  type,
  message = "",
  setState = (data) => {},
  timeout = 2000,
  propStyle = {},
}) {
  if (!validTypes[type]) return <></>;
  if (setState) {
    setTimeout(() => {
      setState(undefined);
    }, timeout);
  }
  return (
    <>
      {" "}
      <Alert
        sx={{ ...CommonStyle, ...propStyle }}
        variant="filled"
        severity={validTypes[type]}
      >
        {message}
      </Alert>
    </>
  );
}

const CommonStyle = {
  right: "5%",
  position: "absolute",
  bottom: "5%",
  width: 290,
};
