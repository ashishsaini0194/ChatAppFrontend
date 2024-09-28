import { Alert } from "@mui/material";
import React, { useEffect } from "react";
export const validTypes = {
  success: "success",
  info: "info",
  warning: "warning",
  error: "error",
};

export function ErrorResponseComp({ type, message = "", setState }) {
  if (!validTypes[type]) return <></>;
  if (setState) {
    setTimeout(() => {
      setState(undefined);
    }, 2000);
  }
  return (
    <>
      {" "}
      <Alert
        sx={{ ...CommonStyle }}
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
