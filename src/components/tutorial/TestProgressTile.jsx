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
import FastForwardIcon from "@mui/icons-material/FastForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import "./TestProgressTile.css";
import ConfirmationPopup from "./ConfirmationPopup";

const TestProgressTile = ({
  stageName,
  stageNo,
  taskNames,
  currentTaskNo,
  currentTask,
  onNext,
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

  const progressBarWidth = `calc(${(currentTaskNo / taskNames.length) * 100}% - 4px)`;

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
          console.log(`Input field "${textInputElement.elementId}" not found - ignoring`);
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
        top: isExpanded
          ? document.documentElement.clientHeight - tileHeight
          : document.documentElement.clientHeight - tileHeight + 15,
        left: document.documentElement.clientWidth - tileWidth - 20,
      });
    };
    updateTilePosition();
    window.addEventListener("resize", updateTilePosition);
    window.addEventListener("click", updateTilePosition);

    return () => {
      window.removeEventListener("resize", measureLines);
      window.removeEventListener("resize", updateTilePosition);
      window.removeEventListener("click", updateTilePosition);
    };
  }, [currentTaskNo, tileHeight]);

  const handleOpenConfirmationPopup = (action) => {
    setConfirmationAction(action); // waiting to see whether this action (exit, skip) will be confirmed
    setConfirmationPopupOpen(true);
  };

  const handleCloseConfirmationPopup = (confirmed) => {
    setConfirmationPopupOpen(false);
    if (confirmed && confirmationAction) {
      onSkipTest();
    }
    setConfirmationAction(null);
  };

  const style = {
    position: "fixed",
    top: tilePosition.top,
    left: tilePosition.left,
    pointerEvents: "all",
    zIndex: 1000000000,
    width: "380px",
    backgroundColor: "white",
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
    return (
      <ListItem key={index} disableGutters sx={{ margin: "0 0", padding: "2.5px 0" }}>
        <ListItemIcon
          style={{
            minWidth: "40px",
            color: index < currentTaskNo ? "#4CAF50" : "#BDBDBD",
            transition: "color 2.0s ease",
          }}
        >
          {index < currentTaskNo ? (
            <CheckCircleIcon sx={{ fontSize: "1.2rem" }} />
          ) : (
            <RadioButtonUncheckedIcon
              className={index === currentTaskNo ? "change-color" : ""}
              sx={{ fontSize: "1.2rem" }}
            />
          )}
        </ListItemIcon>
        <ListItemText
          sx={{ overflow: "hidden" }}
          primary={
            <Typography
              ref={index === currentTaskNo - 1 ? textRef : null}
              sx={{
                fontSize: "0.95rem",
                color: index < currentTaskNo ? "rgba(0, 0, 0, 0.54)" : "inherit",
                transition: "color 2.0s ease",
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
          <Box display="flex" justifyContent="space-between" alignItems="center">
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
              aria-label={isExpanded ? "expand more" : "expand less"}
            >
              {isExpanded ? (
                <ExpandMoreIcon aria-label="expand more" fontSize="medium" />
              ) : (
                <ExpandLessIcon aria-label="expand less" fontSize="medium" />
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
          <Box
            id="progress-bar-container"
            className="fade-in-text"
            display="flex"
            alignItems="center"
            opacity={isExpanded ? 1 : 0}
          >
            <Box
              id="progress-bar-outer"
              opacity={isExpanded ? 1 : 0}
              display="flex"
              alignItems="center"
              justifyContent="left"
              sx={{
                backgroundColor: isExpanded ? "white" : "transparent",
                width: "85%",
                height: "13px",
                borderRadius: "10px",
                padding: "1.5px 1.5px",
                margin: "0 10px 0 0",
              }}
            >
              <Box
                id="progress-bar-inner"
                data-testid="progress-bar-inner"
                sx={{
                  opacity: isExpanded ? 1 : 0,
                  width: isExpanded ? progressBarWidth : 0,
                  backgroundColor: isExpanded ? "green" : "transparent",
                  height: "100%",
                  borderRadius: "10px",
                  transformOrigin: "0% 50%",
                  padding: 0,
                  margin: 0,
                  transition: isExpanded ? "width 1.5s 0.3s ease-out" : "none",
                }}
              ></Box>
            </Box>
            <Typography
              variant="body2"
              sx={{ position: isExpanded ? "relative" : "absolute", opacity: isExpanded ? 1 : 0 }}
            >
              {Math.round((currentTaskNo / taskNames.length) * 100)}%
            </Typography>
          </Box>
        </Box>
        <Box id="test-expanded-data" backgroundColor="#F2F2F2">
          <Box id="test-stages" padding="8px 16px" marginBottom="0px">
            <List>{formattedTasks}</List>
          </Box>
          <Box
            id="bottom-buttons"
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            width="95%"
            margin="auto"
            marginBottom="2px"
          >
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
      {confirmationPopupOpen && (
        <ConfirmationPopup
          title={`Confirm ${confirmationAction}`}
          description={`Are you sure you want to skip the test and move to the next stage in the tutorial?`}
          cancelBtnText={"Cancel"}
          confirmBtnText={"Confirm"}
          onCancel={() => handleCloseConfirmationPopup(false)}
          onConfirm={() => handleCloseConfirmationPopup(true)}
        ></ConfirmationPopup>
      )}
    </>
  );
};

export default TestProgressTile;
