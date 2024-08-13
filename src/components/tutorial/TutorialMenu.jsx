import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import FastForwardIcon from "@mui/icons-material/FastForward";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ConfirmationPopup from "./ConfirmationPopup";

const TutorialMenu = ({
  positionX = "right",
  positionY = "top",
  circleDistFromOuter = 10,
  tutorialName = "Tutorial Mode",
  stages = [],
  stageNo,
  onExit,
  onRedoStage,
  onSkipStage,
}) => {
  positionX = positionX !== "right" && positionX !== "left" ? "left" : positionX;
  positionY = positionY !== "top" && positionY !== "bottom" ? "top" : positionY;
  const circleSize = 35;
  const rectHeaderHeight = circleSize * 0.9;
  const rectHeaderWidth = 130;
  const circlePosition = {
    left: positionX === "left" ? circleDistFromOuter : "auto",
    top: positionY === "top" ? circleDistFromOuter : "auto",
    right: positionX === "right" ? circleDistFromOuter : "auto",
    bottom: positionY === "bottom" ? circleDistFromOuter : "auto",
  };
  const menuWidth = rectHeaderWidth + circleSize + 40;
  const menuHeight = 220;
  const menuPosition = {
    left: positionX === "left" ? circleDistFromOuter : "auto",
    top: positionY === "top" ? circleDistFromOuter + circleSize : "auto",
    right: positionX === "right" ? circleDistFromOuter : "auto",
    bottom: positionY === "bottom" ? circleDistFromOuter + circleSize : "auto",
  };
  const [isOpen, setIsOpen] = useState(false);
  const [menuHovering, setMenuHovering] = useState(false);

  const [confirmationPopupOpen, setConfirmationPopupOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  const [clickedElement, setClickedElement] = useState(null); // used to call use effect on every window click
  const menuRef = useRef(null);

  // Close menu when a click outside occurs
  useEffect(() => {
    const handleWindowClick = (event) => {
      setClickedElement(event);
    };

    const closeMenu = () => {
      if (
        isOpen &&
        menuRef.current &&
        clickedElement &&
        !menuRef.current.contains(clickedElement.target)
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

  // Scroll automatically to the focus stage to make it visible
  const stagesContainerRef = useRef(null);
  const focusedStageRef = useRef(null);

  useEffect(() => {
    if (focusedStageRef.current && stagesContainerRef.current) {
      setTimeout(() => {
        if (isOpen) {
          // Scroll the container to the focused stage
          focusedStageRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } else {
          stagesContainerRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }, 300);
    }
  }, [isOpen]); // Depend on isOpen to trigger scroll when it changes

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

  return (
    <Box
      zIndex={1000000003}
      id="tutorial-menu-container"
      ref={menuRef}
      sx={{
        position: "absolute",
        top: `${circlePosition.top}${circlePosition.top !== "auto" ? "px" : ""}`,
        left: `${circlePosition.left}${circlePosition.left !== "auto" ? "px" : ""}`,
        bottom: `${circlePosition.bottom}${circlePosition.bottom !== "auto" ? "px" : ""}`,
        right: `${circlePosition.right}${circlePosition.right !== "auto" ? "px" : ""}`,
        pointerEvents: "none",
      }}
    >
      <Box
        id="circle"
        zIndex={1000000006}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        onMouseEnter={() => setMenuHovering(true)}
        onMouseLeave={() => setMenuHovering(false)}
        sx={{
          position: "fixed",
          top: `${circlePosition.top}${circlePosition.top !== "auto" ? "px" : ""}`,
          left: `${circlePosition.left}${circlePosition.left !== "auto" ? "px" : ""}`,
          bottom: `${circlePosition.bottom}${circlePosition.bottom !== "auto" ? "px" : ""}`,
          right: `${circlePosition.right}${circlePosition.right !== "auto" ? "px" : ""}`,
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          borderRadius: "50%",
          backgroundColor: "#3F15B1",
          border: "2px solid white",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: menuHovering ? "#d6d6d6" : "white",
          transition: "color 0.1s ease",
          fontSize: circleSize - 20,
          pointerEvents: "all",
          userSelect: "none",
          cursor: "pointer",
        }}
      >
        <MenuIcon fontSize="small" />
        <Box
          id="circle-exit-overlay"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
          sx={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            cursor: isOpen ? "pointer" : "none",
            pointerEvents: isOpen ? "all" : "none",
            opacity: isOpen ? 1 : 0,
            color: menuHovering ? "#d6d6d6" : "white",
            transition: "opacity 0.3s ease-out, color 0.1s ease",
          }}
        >
          <CloseIcon
            sx={{
              padding: 0,
              margin: 0,
              transform: isOpen
                ? "rotate(0deg)"
                : `rotate(${
                    (circlePosition.left !== "auto" && circlePosition.top !== "auto") ||
                    (circlePosition.right !== "auto" && circlePosition.bottom !== "auto")
                      ? "-"
                      : ""
                  }45deg)`,
              transition: "transform 0.3s ease-out",
            }}
          ></CloseIcon>
        </Box>
      </Box>
      <Box
        id="menu-rectangle-header"
        zIndex={1000000005}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prevValue) => !prevValue);
        }}
        onMouseEnter={() => setMenuHovering(true)}
        onMouseLeave={() => setMenuHovering(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: `${circlePosition.top + (circleSize - rectHeaderHeight) / 2}${
            circlePosition.top !== "auto" ? "px" : ""
          }`,
          bottom: `${circlePosition.bottom + (circleSize - rectHeaderHeight) / 2}${
            circlePosition.bottom !== "auto" ? "px" : ""
          }`,
          left: `${circlePosition.left + circleSize - rectHeaderHeight / Math.PI}${
            circlePosition.left !== "auto" ? "px" : ""
          }`,
          right: `${circlePosition.right + circleSize - rectHeaderHeight / Math.PI}${
            circlePosition.right !== "auto" ? "px" : ""
          }`,
          height: `${rectHeaderHeight}px`,
          width: `${rectHeaderWidth}px`,
          borderBottomLeftRadius: circlePosition.left !== "auto" ? "0" : "100px",
          borderTopLeftRadius: circlePosition.left !== "auto" ? "0" : "100px",
          borderBottomRightRadius: circlePosition.left !== "auto" ? "100px" : "0",
          borderTopRightRadius: circlePosition.left !== "auto" ? "100px" : "0",
          padding: "0",
          backgroundColor: "#3F15B1",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          pointerEvents: "all",
          userSelect: "none",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: `${rectHeaderHeight * 0.4}px`,
            color: "white",
            margin: "0 auto 0 auto",
            textAlign: "center",
            lineHeight: `${rectHeaderHeight * 0.4}px`,
          }}
        >
          {isOpen ? tutorialName : "Tutorial Mode"}
        </Typography>
      </Box>
      <Box
        id="popup-box-container"
        zIndex={1000000005}
        sx={{
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          bottom: isOpen ? menuPosition.bottom + 10 : menuPosition.bottom,
          top: isOpen ? menuPosition.top + 10 : menuPosition.top,
          left: menuPosition.left,
          right: menuPosition.right,
          height: `${menuHeight}px`,
          width: `${menuWidth}px`,
          borderRadius: "10px",
          backgroundColor: "white",
          pointerEvents: isOpen ? "all" : "none",
          overflow: "hidden",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          opacity: isOpen ? 1 : 0,
          transition: "bottom 0.25s ease-out, top 0.25s ease-out, opacity 0.25s ease-out",
          padding: "10px 5px 5px 5px",
        }}
      >
        <Box
          id="main-content"
          sx={{
            padding: "5px",
            marginBottom: "auto",
            width: "100%",
            height: "68%",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h7"
            sx={{
              width: "100%",
              color: "#180844",
              fontSize: "1.15rem",
            }}
          >
            Stages
          </Typography>
          <Box
            id="menu-stages-container"
            ref={stagesContainerRef}
            sx={{
              marginTop: "5px",
              width: "100%",
              height: "80%",
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
              if (index === stageNo) {
                stageStyle = {
                  color: "#3F15B1",
                  fontSize: "0.85rem",
                  margin: "1px 0",
                };
              } else {
                stageStyle = {
                  color: "#262626",
                  fontSize: "0.85rem",
                  margin: "1px 0",
                };
              }

              return (
                <Box
                  ref={index === stageNo ? focusedStageRef : null} // Assign ref to the focused stage
                  sx={{
                    id: index === stageNo ? `typo-stage-index-focus` : `typo-stage-index${index}`,
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                    padding: "0 0 0 5px",
                    width: "100%",
                  }}
                  key={index} // Ensure a unique key for each Box
                >
                  <Typography
                    variant="body2"
                    style={stageStyle}
                    sx={{ width: "100%", height: "100%" }}
                  >
                    {index === stageNo ? "→ " + stage : stage}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
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
        <Box
          id="exit-bar"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "right",
            width: "100%",
            backgroundColor: "#3F15B1",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          }}
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

export default TutorialMenu;
