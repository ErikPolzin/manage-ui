import React, { useState, useEffect, useRef } from "react";
import { Typography, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import FastForwardIcon from "@mui/icons-material/FastForward";
import { Box, fontSize } from "@mui/system";
import "./TutorialHeader.css";
import ConfirmationPopup from "./ConfirmationPopup";

const TutorialHeader = ({ tutorialName, stages, stageNo, onExit, onRedoStage, onSkipStage }) => {
  const headerHeight = 29.5;
  const dropDownWidth = 280;
  const [dropDownMenuPosition, setDropDownMenuPosition] = useState({
    open: document.documentElement.clientWidth - dropDownWidth,
    closed: document.documentElement.clientWidth + 5,
  });
  const [isOpen, setIsOpen] = useState(null);

  const [confirmationPopupOpen, setConfirmationPopupOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  const [clickedElement, setClickedElement] = useState(null); // used to call use effect on every window click
  const headerRef = useRef(null);

  // Close menu when a click outside occurs
  useEffect(() => {
    const handleWindowClick = (event) => {
      setClickedElement(event);
    };

    const closeMenu = () => {
      if (
        isOpen &&
        headerRef.current &&
        clickedElement &&
        !headerRef.current.contains(clickedElement.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleWindowClick);

    // Call closeMenu immediately in case the click occurs before the event listener is removed
    closeMenu();

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [clickedElement]);

  // Reset positions on resize
  useEffect(() => {
    const updateMenuPosition = () => {
      setDropDownMenuPosition({
        open: document.documentElement.clientWidth - dropDownWidth,
        closed: document.documentElement.clientWidth + 5,
      });
    };
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [isOpen]);

  const handleMenuOpen = (event) => {
    event.stopPropagation(); // Prevent event bubbling
    setIsOpen(true);
  };

  const handleMenuClose = () => {
    setIsOpen(false);
  };

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

  const dropDownStyle = {
    position: "fixed",
    zIndex: 1000000001,
    top: headerHeight,
    right: isOpen ? dropDownMenuPosition.open : dropDownMenuPosition.closed,
    width: dropDownWidth,
    backgroundColor: "white",
    boxShadow: "0 0 4px 2px rgba(63, 21, 177, 0.2)",
    borderBottomRightRadius: "5px",
    borderBottomLeftRadius: "0px",
    borderTopRightRadius: "0px",
    borderTopLeftRadius: "0px",
    transition: "right 0.3s ease-in-out",
    overflow: "hidden",
  };

  const formattedStages = stages.map((stage, index) => {
    let stageStyle = {};
    if (index === stageNo) {
      stageStyle = {
        color: "#3F15B1",
        fontSize: "0.9rem",
        margin: "4.5px 0",
      };
    } else {
      stageStyle = {
        color: "#262626",
        fontSize: "0.9rem",
        margin: "4.5px 0",
      };
    }

    return (
      <Box
        display="flex"
        justifyContent="left"
        alignItems="center"
        key={stage}
        padding={"0 0 0 10px"}
        marginBottom={"2px"}
      >
        <Typography variant="body2" style={stageStyle} height={"100%"}>
          {index === stageNo ? "→ " + stage : stage}
        </Typography>
      </Box>
    );
  });

  return (
    <Box id="tutorial-header" ref={headerRef} sx={{ pointerEvents: "all" }}>
      <Box
        id="tutorial-bar"
        position="fixed"
        zIndex={1000000006}
        width={"100%"}
        sx={{
          color: "white",
          backgroundColor: "#3F15B1",
          padding: "3px 0 3px 10px",
        }}
        height={headerHeight}
        maxHeight={headerHeight}
      >
        <Box
          display="flex"
          justifyContent="left"
          alignItems="center"
          height={"100%"}
          width={"100%"}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={isOpen ? handleMenuClose : handleMenuOpen}
            disableRipple
            sx={{ padding: "0 0 0 10px" }}
          >
            {isOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </IconButton>
          <Typography
            variant="h8"
            sx={{
              // flexGrow: 1,
              marginLeft: 2,
              padding: "2.7px 0",
              fontSize: "0.75rem",
            }}
          >
            {tutorialName}
          </Typography>
        </Box>
      </Box>
      <Box
        id="header-drop-down-menu"
        sx={dropDownStyle}
        elevation={3}
        className={isOpen ? "dropdownmenu-open" : "dropdownmenu-closed"}
      >
        <Box id="main-content" padding={"16px"} marginBottom={"4px"}>
          <Typography
            variant="h7"
            sx={{
              color: "#180844",
              fontSize: "1rem",
            }}
          >
            Stages
          </Typography>
          <Box marginBottom={"10px"}>{formattedStages}</Box>
          <Box
            id="drop-down-menu-lower-buttons"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width={"75%"}
            margin={"auto"}
          >
            <Button
              size="small"
              startIcon={<ReplayIcon fontSize="0.7rem" />}
              onClick={() => handleOpenConfirmationPopup("Redo")}
              sx={{
                color: "#BFBFBF",
                fontSize: "0.7rem",
                fontWeight: "400",
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
              Redo
            </Button>
            <div
              style={{
                height: "0.7rem",
                width: "0.5px",
                minWidth: "0.5px",
                backgroundColor: "#BFBFBF",
              }}
            ></div>
            <Button
              size="small"
              endIcon={<FastForwardIcon fontSize="0.7rem" />}
              onClick={() => handleOpenConfirmationPopup("Skip")}
              sx={{
                color: "#BFBFBF",
                fontSize: "0.7rem",
                fontWeight: "400",
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
              Skip
            </Button>
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="right"
          sx={{ backgroundColor: "#3F15B1" }}
        >
          <Button
            //variant="contained"
            size="small"
            height={"100%"}
            endIcon={<ExitToAppIcon />}
            onClick={() => handleOpenConfirmationPopup("Exit")}
            sx={{
              fontSize: "0.7rem",
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
            }}
          >
            Exit
          </Button>
        </Box>
      </Box>
      {confirmationPopupOpen && (
        <ConfirmationPopup
          title={`Confirm ${confirmationAction}`}
          description={`Are you sure you want to 
      ${
        confirmationAction === "Exit"
          ? "exit the tutorial?"
          : confirmationAction.toLowerCase() + " Stage " + (stageNo + 1)
      }`}
          cancelBtnText={"Cancel"}
          confirmBtnText={"Confirm"}
          onCancel={() => handleCloseConfirmationPopup(false)}
          onConfirm={() => handleCloseConfirmationPopup(true)}
        ></ConfirmationPopup>
      )}
    </Box>
  );
};

export default TutorialHeader;
