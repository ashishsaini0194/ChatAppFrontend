import { createTheme } from "@mui/material";
import { createStitches } from "@stitches/react";
export const fixedWidth = 640;

export const { styled, css, keyframes, theme } = createStitches({
  media: {
    bp1: `(max-width: ${fixedWidth}px)`,
    bp3: `(min-width: ${fixedWidth}px)`,
  },
  theme: {
    colors: {
      darkBlue: "rgb(1 17 30)",
    },
  },
});

// export const darkTheme = createTheme({
//   colors: {
//     darkBlue: "rgb(1 23 41)",
//   },
// });
