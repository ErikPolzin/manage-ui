import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ReplayIcon from "@mui/icons-material/Replay";
import FastForwardIcon from "@mui/icons-material/FastForward";
import "./TutorialProgressTile.css";
import ConfirmationPopup from "./ConfirmationPopup";

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
  const [tileHeight, setTileHeight] = useState(0);
  const tileRef = useRef(null);

  // Fade progress tile in smoothly
  useEffect(() => {
    setTileHeight(tileRef.current.offsetHeight);
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenConfirmationPopup = (action) => {
    setConfirmationAction(action); // waiting to see whether this action (exit, redo, or skip) will be confirmed
    setConfirmationPopupOpen(true);
  };

  // Scroll automatically to the focus stage to make it visible
  const focusedStageRef = useRef(null);

  useEffect(() => {
    if (focusedStageRef.current) {
      setTimeout(() => {
        // Scroll the container to the focused stage
        focusedStageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
    }
  }, [nextStageNo]); // Depend on nextStageNo to trigger scroll when it changes

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
    zIndex: 1000000000,
    pointerEvents: "all",
    width: "400px",
    backgroundColor: "white",
    boxShadow: "0 0 4px 2px rgba(63, 21, 177, 0.2)",
    borderRadius: "5px",
    overflow: "hidden",
    opacity: isVisible ? 1 : 0,
    transition: "opacity 0.0s ease-in-out",
  };

  return (
    <>
      <Box ref={tileRef} style={style} elevation={3}>
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
        <Box
          id="stages-container"
          sx={{
            padding: "16px",
            margin: "10px auto 15px auto",
            width: "85%",
            height: tileHeight * 0.9,
            overflowY: "auto",
            paddingRight: "5px",
            "&::-webkit-scrollbar": {
              width: "5px", // width of the scrollbar
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1", // track color
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#E1E3E7", // thumb color
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555", // thumb color on hover
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: "0",
              right: "-10px", // Move scrollbar outside the box
              width: "10px",
              height: "100%",
              backgroundColor: "#f1f1f1",
              borderRadius: "10px",
              zIndex: 1,
            },
          }}
        >
          {stages.map((stage, index) => {
            let stageStyle = {};
            if (index === nextStageNo) {
              stageStyle = {
                color: "#262626",
                fontSize: "1.1rem",
                width: "80%",
                textAlign: "center",
                borderRadius: "25px",
                margin: "7px 0",
              };
            } else if (index === nextStageNo - 1) {
              stageStyle = {
                fontSize: "1.6rem", // starting value that shrinks with css animation
                textAlign: "center",
                borderRadius: "25px",
                margin: "4.5px 0",
              };
            } else if (index < nextStageNo) {
              stageStyle = {
                color: "#B4E5A2",
                // textDecoration: "line-through",
                fontSize: "1.1rem",
                margin: "4.5px 0",
              };
            } else {
              stageStyle = { color: "#262626", fontSize: "1.1rem", margin: "4.5px 0" };
            }

            const stageClassNames = [
              index === nextStageNo
                ? "font-grow focus-background"
                : index === nextStageNo - 1
                ? "font-color font-shrink"
                : index < nextStageNo - 1
                ? "strike-through"
                : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <Box
                ref={index === nextStageNo ? focusedStageRef : null} // Assign ref to the focused stage
                key={stage}
                className={index === nextStageNo - 1 ? "focus-background-move font-color" : ""}
                sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <Typography
                  variant="body2"
                  className={stageClassNames}
                  sx={{
                    ...stageStyle,
                    fontWeight: "550",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  {stage}
                </Typography>
              </Box>
            );
          })}
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
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "5px",
            }}
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
          <Box display="flex" justifyContent="space-between" alignItems="center" width={"95%"}>
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
              id="skip-stage-button"
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
      </Box>

      {confirmationPopupOpen && (
        <ConfirmationPopup
          title={`Confirm ${confirmationAction}`}
          description={`Are you sure you want to 
      ${
        confirmationAction === "Exit"
          ? "exit the tutorial?"
          : confirmationAction.toLowerCase() + " Stage "
      }${
            confirmationAction === "Skip"
              ? nextStageNo + 1
              : confirmationAction === "Redo"
              ? nextStageNo
              : ""
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

export default TutorialProgressTile;
