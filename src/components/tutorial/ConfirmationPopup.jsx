import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";

const ConfirmationPopup = ({
  title,
  description,
  cancelBtnText,
  confirmBtnText,
  onCancel,
  onConfirm,
}) => {
  return (
    <Box
      position="fixed"
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      top="0"
      left="0"
      style={{
        zIndex: 1000000007,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        pointerEvents: "all",
      }}
    >
      <Box
        className="confirmation-container"
        backgroundColor="white"
        padding={"12px 18px"}
        borderRadius={"3px"}
      >
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          {description}
        </Typography>
        <Box
          className="conformation-popup-actions"
          display="flex"
          justifyContent="flex-end"
          marginTop="20px"
        >
          <Button onClick={onCancel} color="primary" sx={{ padding: 0, marginRight: "20px" }}>
            {cancelBtnText}
          </Button>
          <Button onClick={onConfirm} color="primary" sx={{ padding: 0 }}>
            {confirmBtnText}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmationPopup;
