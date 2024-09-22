import { createStitches } from "@stitches/react";
export const fixedWidth = 640;

export const { styled, css, keyframes } = createStitches({
  media: {
    bp1: `(max-width: ${fixedWidth}px)`,
    bp3: `(min-width: ${fixedWidth}px)`,
  },
});
