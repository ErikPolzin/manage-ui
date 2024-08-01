import React from "react";
import { Box } from "@mui/material";

const BasicBackgroundOverlay = ({ focusElement }) => {
  return (
    <Box
      id="completion-screen-overlay"
      position="fixed"
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      top="0"
      left="0"
      style={{
        zIndex: 1007,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        pointerEvents: "all",
      }}
    >
      {focusElement}
    </Box>
  );
};

export default BasicBackgroundOverlay;
