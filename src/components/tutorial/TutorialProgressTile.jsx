import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ReplayIcon from "@mui/icons-material/Replay";
import FastForwardIcon from "@mui/icons-material/FastForward";
import "./TutorialProgressTile.css";

const TutorialProgressTile = ({
  tutorialName,
  stages,
  nextStageNo,
  onExit,
  onContinue,
  onRedoStage,
  onSkipStage,
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
      confirmationAction === "Exit"
        ? onExit()
        : confirmationAction === "Redo"
        ? onRedoStage()
        : onSkipStage();
    }
    setConfirmationAction(null);
  };

  const style = {
    position: "absolute",
    zIndex: 1000,
    pointerEvents: "all",
    width: "400px",
    boxShadow: "0 0 4px 2px rgba(63, 21, 177, 0.2)",
    borderRadius: "5px",
    overflow: "hidden",
    opacity: isVisible ? 1 : 0,
    transition: "opacity 0.0s ease-in-out",
  };

  const formattedStages = stages.map((stage, index) => {
    let stageStyle = {};
    if (index === nextStageNo) {
      stageStyle = {
        color: "#262626",
        fontSize: "0.9rem",
        width: "80%",
        textAlign: "center",
        borderRadius: "25px",
        margin: "7px 0",
      };
    } else if (index === nextStageNo - 1) {
      stageStyle = {
        color: "#B4E5A2",
        fontSize: "1.6rem", // starting value that shrinks with css animation
        borderRadius: "25px",
        margin: "4.5px 0",
      };
    } else if (index < nextStageNo) {
      stageStyle = {
        color: "#B4E5A2",
        // textDecoration: "line-through",
        fontSize: "0.9rem",
        margin: "4.5px 0",
      };
    } else {
      stageStyle = { color: "#262626", fontSize: "0.9rem", margin: "4.5px 0" };
    }

    const stageClassNames = [
      index === nextStageNo
        ? "font-grow focus-background"
        : index === nextStageNo - 1
        ? "strike-through-animate-stage font-shrink"
        : index < nextStageNo - 1
        ? "strike-through"
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        key={stage}
        className={index === nextStageNo - 1 ? "focus-background-move" : ""}
      >
        <Typography
          variant="body2"
          style={stageStyle}
          fontWeight={"550"}
          height={"100%"}
          className={stageClassNames}
          overflow={"hidden"}
          marginLeft={"auto"}
        >
          {stage}
        </Typography>
      </Box>
    );
  });

  return (
    <>
      <Paper style={style} elevation={3}>
        <Box backgroundColor={"#3F15B1"}>
          <Button
            variant="contained"
            size="small"
            endIcon={<ExitToAppIcon fontSize="small" />}
            onClick={() => handleOpenConfirmationPopup("Exit")}
            sx={{
              position: "absolute",
              top: "1%",
              right: "-2%",
              color: "white",
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
              padding: "4px 10px 0px 10px",
            }}
          ></Button>
          <Typography
            sx={{
              color: "white",
              width: "80%",
              margin: "auto",
              textAlign: "center",
              padding: "25px 0px 15px",
              fontWeight: "500",
              fontSize: "1.85rem",
            }}
            variant="h4"
          >
            {tutorialName}
          </Typography>
        </Box>
        <Box padding={"16px"} marginBottom={"2px"}>
          {formattedStages}
        </Box>
        <Box
          id="lower-buttons"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          marginBottom="3px"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginBottom={"5px"}
          >
            <Button
              variant="contained"
              className="buttons-appear"
              size="small"
              endIcon={<ArrowForwardIcon fontSize="small" />}
              onClick={onContinue}
              sx={{
                fontSize: "0.9rem",
                backgroundColor: "#3F15B1",
                "&:hover": { backgroundColor: "#31119F" },
                textTransform: "none",
              }}
            >
              Start Stage {nextStageNo + 1}
            </Button>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width={"95%"}
          >
            <Button
              className="buttons-appear"
              size="small"
              startIcon={<ReplayIcon fontSize="0.7rem" />}
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
            <Button
              className="buttons-appear"
              size="small"
              endIcon={<FastForwardIcon fontSize="0.7rem" />}
              onClick={() => handleOpenConfirmationPopup("Skip")}
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
              Skip stage
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Confirmation Popup */}
      {confirmationPopupOpen && (
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
            zIndex: 1007,
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
            <Typography variant="h6">Confirm {confirmationAction}</Typography>
            <Typography variant="body1" style={{ marginTop: "10px" }}>
              Are you sure you want to{" "}
              {confirmationAction === "Exit"
                ? "exit the tutorial?"
                : confirmationAction.toLowerCase() + " Stage "}{" "}
              {confirmationAction === "Skip"
                ? nextStageNo + 1
                : confirmationAction === "Redo"
                ? nextStageNo
                : ""}
            </Typography>
            <Box
              className="conformation-popup-actions"
              display="flex"
              justifyContent="flex-end"
              marginTop="20px"
            >
              <Button
                onClick={() => handleCloseConfirmationPopup(false)}
                color="primary"
                sx={{ padding: 0, marginRight: "20px" }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleCloseConfirmationPopup(true)}
                color="primary"
                sx={{ padding: 0 }}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default TutorialProgressTile;
