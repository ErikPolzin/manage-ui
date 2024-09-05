import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";

const IntroTile1 = ({ logoSrc, tutorialName, description, onNext }) => {
  const circleSize = 70;
  const tileWidth = 400;
  const [isVisible, setIsVisible] = useState(false); // used to fade component onto screen

  // Fade progress tile in smoothly
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      id="intro-tile-1"
      sx={{
        position: "absolute",
        zIndex: 1000000000,
        pointerEvents: "all",
        width: `${tileWidth}px`,
        padding: "16px",
        boxShadow: "0 0 4px 2px rgba(63, 21, 177, 0.2)",
        borderRadius: "5px",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 1.5s ease-in-out",
        backgroundColor: "white",
      }}
    >
      <Box
        className="circle"
        sx={{
          position: "absolute",
          top: `-${circleSize / 2}px`,
          left: `${tileWidth / 2 - circleSize / 2}px`,
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          borderRadius: "50%",
          backgroundColor: "#3F15B1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          color: "white",
          fontSize: circleSize - 20,
          userSelect: "none",
        }}
      >
        {logoSrc && (
          <img
            src={logoSrc}
            alt={""}
            className="logo"
            style={{ maxHeight: "70%", maxWidth: "70%" }}
          />
        )}
        {!logoSrc && "?"}
      </Box>
      <Typography
        variant="h7"
        sx={{
          display: "block",
          textAlign: "center",
          margin: "auto",
          marginTop: "50px",
          marginBottom: "10px",
          color: "#747474",
          fontSize: "0.75rem",
          fontWeight: 500,
          textTransform: "capitalize",
        }}
      >
        INTERACTIVE WALKTHROUGH
      </Typography>
      <Typography
        variant="h5"
        sx={{
          display: "block",
          textAlign: "center",
          margin: "auto",
          marginBottom: "10px",
          color: "black",
          fontSize: "1.3rem",
          fontWeight: 500,
        }}
      >
        {tutorialName ? `Welcome to the ${tutorialName}` : `Welcome`}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.85rem",
          display: "block",
          textAlign: "center",
          margin: "auto",
          marginBottom: "22px",
          color: "#595959",
        }}
      >
        {description}
      </Typography>

      <Button
        id="intro-tile-1-next-button"
        variant="contained"
        onClick={onNext}
        sx={{
          display: "block",
          width: "40%",
          margin: "auto",
          marginBottom: "10px",
          fontSize: "1.1rem",
          lineHeight: "1.2rem",
          backgroundColor: "#3F15B1",
          "&:hover": { backgroundColor: "#31119F" },
          borderRadius: "100px",
          textTransform: "capitalize",
          fontWeight: "400",
        }}
      >
        Next
      </Button>
    </Box>
  );
};

export default IntroTile1;
