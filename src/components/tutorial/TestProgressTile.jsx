import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FastForwardIcon from "@mui/icons-material/FastForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import "./TestProgressTile.css";

const TestProgressTile = ({
  stageName,
  stageNo,
  taskNames,
  currentTaskNo,
  currentTask,
  onNext,
  onExit,
  onSkipTest,
}) => {
  const [confirmationPopupOpen, setConfirmationPopupOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [tileHeight, setTileHeight] = useState(0);
  const [tileWidth, setTileWidth] = useState(0);
  const [tilePosition, setTilePosition] = useState({
    top: window.innerHeight - tileHeight,
    left: document.documentElement.clientWidth - tileWidth - 20,
  });
  const testProgressTileRef = useRef(null);

  const [clickElementNo, setClickElementNo] = useState(0);
  const clickElements = currentTask.clickElements; // the element objects that need to be clicked to complete the round
  const [windowClickCount, setWindowClickCount] = useState(0);

  const progressBarWidth = `calc(${
    (currentTaskNo / taskNames.length) * 100
  }% - 4px)`;

  // Get the height of the tile
  useLayoutEffect(() => {
    if (!testProgressTileRef.current) {
      return;
    }

    const updateTileDimensions = () => {
      setTileHeight(testProgressTileRef.current.offsetHeight);
      setTileWidth(testProgressTileRef.current.offsetWidth);
    };
    updateTileDimensions();
    window.addEventListener("resize", updateTileDimensions);

    return () => {
      window.removeEventListener("resize", updateTileDimensions);
    };
  }, [isExpanded, currentTaskNo]);

  // Helps reinspect for element after every window click
  useEffect(() => {
    const handleWindowClick = () => {
      setWindowClickCount((prevCount) => prevCount + 1);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  // Test logic
  useLayoutEffect(() => {
    const elementToClickObject = clickElements[clickElementNo]; // the current element (JS object) that needs to be clicked next in the task
    const targetElementId = elementToClickObject.elementId;
    const targetElementToClick = document.querySelector(targetElementId); // the actual DOM element
    const textInputElements = elementToClickObject.textInputElements;

    // If target element not yet on page
    if (!targetElementToClick) {
      console.log(`Target element "${targetElementId}" not yet found`);
      return;
    } else {
      console.log(`Target element "${targetElementId}" found`);
    }

    const handleClick = () => {
      // Check to see if every input element has the correct input
      for (const textInputElement of textInputElements) {
        const inputElement = document.querySelector(textInputElement.elementId);

        if (!textInputElement) {
          console.log(
            `Input field "${textInputElement.elementId}" not found - ignoring`
          );
        } else if (inputElement.value !== textInputElement.requiredInput) {
          console.log("Not all required text inputs are correct");
          return;
        }
      }

      // Move onto next element that needs to be clicked
      if (clickElementNo < clickElements.length - 1) {
        console.log("Moving to the next element that must be clicked");
        setClickElementNo((prevElementNo) => prevElementNo + 1);
      } else {
        // Move onto next task
        console.log("All click elements complete. Moving to next task");
        onNext();
      }
    };

    targetElementToClick.addEventListener("click", handleClick);

    return () => {
      targetElementToClick.removeEventListener("click", handleClick);
    };
  }, [currentTaskNo, clickElementNo, windowClickCount]);

  const textRef = useRef(null);
  const [lineCount, setLineCount] = useState(0);

  // Some formatting logic
  useEffect(() => {
    const measureLines = () => {
      if (textRef.current) {
        const textElement = textRef.current;
        const lineHeight = parseFloat(getComputedStyle(textElement).lineHeight);
        const totalHeight = textElement.offsetHeight;
        const lines = Math.round(totalHeight / lineHeight);
        setLineCount(lines);
        // console.log(
        //   "Single line height for " +
        //     textElement.textContent +
        //     ": " +
        //     lineHeight
        // );
        // console.log("Total line height: " + totalHeight);
        // console.log("Therefore line count is " + lines);
      }
    };
    measureLines();
    window.addEventListener("resize", measureLines); // Re-measure on window resize if need be

    const updateTilePosition = () => {
      setTilePosition({
        top: window.innerHeight - tileHeight,
        left: document.documentElement.clientWidth - tileWidth - 20,
      });
    };
    updateTilePosition();
    window.addEventListener("resize", updateTilePosition);

    return () => {
      window.removeEventListener("resize", measureLines);
      window.removeEventListener("resize", updateTilePosition);
    };
  }, [currentTaskNo, tileHeight]);

  const handleOpenConfirmationPopup = (action) => {
    setConfirmationAction(action); // waiting to see whether this action (exit, skip) will be confirmed
    setConfirmationPopupOpen(true);
  };

  const handleCloseConfirmationPopup = (confirmed) => {
    setConfirmationPopupOpen(false);
    if (confirmed && confirmationAction) {
      confirmationAction === "Exit" ? onExit() : onSkipTest();
    }
    setConfirmationAction(null);
  };

  const style = {
    position: "fixed",
    top: tilePosition.top,
    left: tilePosition.left,
    pointerEvents: "all",
    zIndex: 1000,
    width: "380px",
    boxShadow: "0 0 4px 2px rgba(63, 21, 177, 0.2)",
    borderBottomRightRadius: "0px",
    borderBottomLeftRadius: "0px",
    borderTopRightRadius: "5px",
    borderTopLeftRadius: "5px",
    overflow: "hidden",
    //transition: "opacity 0.0s ease-in-out",
    transition: "top 0.3s ease-out",
  };

  const formattedTasks = taskNames.map((task, index) => {
    // let taskStyle = {};
    // if (index === currentTaskNo - 1) {
    //   taskStyle = {
    //     // the style that the animation starts with
    //   };
    // } else if (index === currentTaskNo) {
    //   taskStyle = {
    //     // the style that the animation starts with
    //   };
    // } else if (index < stageNo) {
    //   taskStyle = {
    //     // style all the tasks that have been completed already
    //   };
    // } else {
    //   taskStyle = {
    //     // style all the tasks still to be completed
    //   };
    // }

    return (
      <ListItem
        key={index}
        disableGutters
        sx={{ margin: "0 0", padding: "2.5px 0" }}
      >
        <ListItemIcon style={{ minWidth: "40px" }}>
          {index < currentTaskNo ? (
            <CheckCircleIcon sx={{ color: "#4CAF50", fontSize: "1.2rem" }} />
          ) : (
            <RadioButtonUncheckedIcon
              className={index === currentTaskNo ? "change-color" : ""}
              sx={{ color: "#BDBDBD", fontSize: "1.2rem" }}
            />
          )}
        </ListItemIcon>
        <ListItemText
          sx={{ overflow: "hidden" }}
          primary={
            <Typography
              ref={index === currentTaskNo - 1 ? textRef : null}
              // className={
              //   index === currentTaskNo - 1
              //     ? `strike-through-animate-task-${lineCount}`
              //     : ""
              // }
              sx={{
                fontSize: "0.95rem",
                // textDecoration:
                //   index < currentTaskNo - 1 ? "line-through" : "none",
                color:
                  index < currentTaskNo ? "rgba(0, 0, 0, 0.54)" : "inherit",
              }}
            >
              <span class="extra-strike"></span>
              {task}
            </Typography>
          }
        />
      </ListItem>
    );
  });

  return (
    <>
      <Box
        id={`test-progress-tile-${isExpanded ? "expanded" : "reduced"}`}
        ref={isExpanded ? testProgressTileRef : null}
        style={style}
        elevation={3}
      >
        <Box
          ref={!isExpanded ? testProgressTileRef : null}
          id="header"
          color="white"
          backgroundColor="#3F15B1"
          padding="12px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              className="fade-in-text"
              variant={isExpanded ? "subtitle2" : "subtitle1"}
              sx={{
                fontSize: isExpanded ? "0.8rem" : "0.8rem",
                fontWeight: isExpanded ? "400" : "400",
                marginBottom: "0px",
                paddingBottom: 0,
              }}
            >
              {isExpanded ? `Stage ${stageNo + 1} Test` : "Next Task:"}
            </Typography>
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{ color: "white", padding: 0, margin: 0 }}
              size="medium"
            >
              {isExpanded ? (
                <ExpandMoreIcon fontSize="medium" />
              ) : (
                <ExpandLessIcon fontSize="medium" />
              )}
            </IconButton>
          </Box>
          <Typography
            className="fade-in-text"
            variant="h6"
            sx={{
              width: isExpanded ? "100%" : "92%",
              fontWeight: isExpanded ? "700" : "500",
              marginBottom: isExpanded ? "5px" : "0px",
              fontSize: isExpanded ? "1.25rem" : "1.2rem",
              lineHeight: isExpanded ? "1.25rem" : "1.3rem",
            }}
          >
            {isExpanded ? stageName : taskNames[currentTaskNo]}
          </Typography>
          {isExpanded && (
            <Box
              id="progress-bar-container"
              className="fade-in-text"
              display="flex"
              alignItems="center"
            >
              <Box
                id="progress-bar-outer"
                position="relative" // Added position relative
                display="flex"
                alignItems="center"
                justifyContent="left"
                sx={{
                  backgroundColor: "white",
                  width: "85%",
                  height: "13px",
                  borderRadius: "10px",
                  padding: "1.5px 1.5px",
                  margin: "0 10px 0 0",
                }}
              >
                <Box
                  id="progress-bar-inner"
                  className="progress-grow"
                  sx={{
                    width: progressBarWidth,
                    "--target-width": progressBarWidth,
                    backgroundColor: "green",
                    height: "100%",
                    borderRadius: "10px",
                    transformOrigin: "0% 50%",
                    padding: 0,
                    margin: 0,
                  }}
                ></Box>
              </Box>
              <Typography variant="body2">
                {Math.round((currentTaskNo / taskNames.length) * 100)}%
              </Typography>
            </Box>
          )}
        </Box>
        <Box id="test-expanded-data" backgroundColor="#F2F2F2">
          <Box id="test-stages" padding="8px 16px" marginBottom="0px">
            <List>{formattedTasks}</List>
          </Box>
          <Box
            id="bottom-buttons"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="95%"
            margin="auto"
            marginBottom="2px"
          >
            <Button
              size="small"
              startIcon={<ExitToAppIcon fontSize="0.7rem" />}
              onClick={() => handleOpenConfirmationPopup("Exit")}
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
              Exit tutorial
            </Button>
            <Button
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
              Skip test
            </Button>
          </Box>
        </Box>
      </Box>

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
                : "skip the test and move to the next stage in the tutorial?"}
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

export default TestProgressTile;
