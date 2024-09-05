import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import ConfirmationPopup from "./ConfirmationPopup";

const TutorialCompleteTile = ({
  tutorialName,
  prevStageNo,
  prevStageName,
  onExit,
  onRedoStage,
  onRestartTutorial,
}) => {
  const [confirmationPopupOpen, setConfirmationPopupOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // used to fade component onto screen

  // Fade progress tile in smoothly
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenConfirmationPopup = (action) => {
    setConfirmationAction(action); // waiting to see whether this action (exit, redo, or skip) will be confirmed
    setConfirmationPopupOpen(true);
  };

  const handleCloseConfirmationPopup = (confirmed) => {
    setConfirmationPopupOpen(false);
    if (confirmed && confirmationAction) {
      confirmationAction === "Restart" ? onRestartTutorial() : onRedoStage();
    }
    setConfirmationAction(null);
  };

  const style = {
    position: "absolute",
    zIndex: 1000000000,
    pointerEvents: "all",
    padding: "16px",
    width: "420px",
    boxShadow: "0 0 4px 2px rgba(63, 21, 177, 0.2)",
    opacity: isVisible ? 1 : 0,
    transition: "opacity 2s ease-in-out",
  };

  return (
    <>
      <Paper style={style} elevation={3} id="tutorial-complete-tile">
        <Typography
          sx={{
            width: "100%",
            textAlign: "center",
            marginBottom: "6px",
            color: "#3F15B1",
            fontWeight: "bold",
          }}
          variant="h4"
        >
          {tutorialName} Complete !!
        </Typography>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "30vh",
            width: "100%",
            margin: "20px 0 20px 0",
          }}
        >
          <img
            src="/images/OrangeCorrectTickCircle.png"
            alt="Well done tick"
            style={{ maxWidth: "100%", maxHeight: "100%", height: "auto" }} // Ensure image is responsive
          />
          <img
            src="https://i.gifer.com/origin/03/03270abe66b1c66ef8832c57aa6da0c1_w200.gif"
            alt="Confetti"
            style={{
              position: "absolute",
              maxWidth: "100%",
              maxHeight: "100%",
              height: "auto",
            }}
          />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button
            id="finish-tutorial-button"
            variant="contained"
            size="small"
            onClick={onExit}
            sx={{
              fontSize: "1.1rem",
              backgroundColor: "#3F15B1",
              "&:hover": { backgroundColor: "#31119F" },
              marginBottom: "10px",
            }}
          >
            Finish Tutorial
          </Button>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box display="flex" justifyContent="space-between" alignItems="center" width={"95%"}>
            <Button
              size="small"
              startIcon={<ReplayIcon fontSize="0.7rem" />}
              onClick={() => handleOpenConfirmationPopup("Restart")}
              sx={{
                color: "#BFBFBF",
                fontSize: "0.7rem",
                backgroundColor: "transparent",
                "&:hover": {
                  color: "#858585",
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                },
                border: "none",
                boxShadow: "none",
                textTransform: "none",
              }}
            >
              Restart tutorial
            </Button>
            <Button
              size="small"
              endIcon={<ReplayIcon fontSize="0.7rem" />}
              onClick={() => handleOpenConfirmationPopup("Redo")}
              sx={{
                color: "#BFBFBF",
                fontSize: "0.7rem",
                backgroundColor: "transparent",
                "&:hover": {
                  color: "#858585",
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                },
                border: "none",
                boxShadow: "none",
                textTransform: "none",
              }}
            >
              Redo stage
            </Button>
          </Box>
        </Box>
      </Paper>
      {confirmationPopupOpen && (
        <ConfirmationPopup
          title={`Confirm ${confirmationAction}`}
          description={`Are you sure you want to 
      ${
        confirmationAction === "Restart"
          ? "restart the tutorial?"
          : `redo stage ${prevStageNo}: ${prevStageName}`
      }`}
          cancelBtnText={"Cancel"}
          confirmBtnText={"Confirm"}
          onCancel={() => handleCloseConfirmationPopup(false)}
          onConfirm={() => handleCloseConfirmationPopup(true)}
        ></ConfirmationPopup>
      )}
    </>
  );
};

export default TutorialCompleteTile;
