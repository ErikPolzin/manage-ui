import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";

const IntroTile2 = ({ logoSrc = null, stages = [], onNext, onExit }) => {
  const circleSize = 70;
  const tileWidth = 400;
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

  return (
    <Box
      ref={tileRef}
      sx={{
        position: "absolute",
        zIndex: 1000000000,
        pointerEvents: "all",
        width: `${tileWidth}px`,
        padding: "16px",
        boxShadow: "0 0 4px 2px rgba(63, 21, 177, 0.2)",
        borderRadius: "5px",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
        backgroundColor: "white",
        overflow: "visible",
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
        variant="h5"
        sx={{
          display: "block",
          textAlign: "center",
          margin: "auto",
          marginTop: `${circleSize / 2 - 6}px`,
          marginBottom: "3px",
          color: "black",
          fontSize: "1.2rem",
          fontWeight: 500,
        }}
      >
        Tutorial Stages
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.8rem",
          display: "block",
          textAlign: "center",
          margin: "auto",
          marginBottom: "15px",
          color: "#595959",
        }}
      >
        There are {stages.length} stages in the tutorial. Stages end with a test to help assess and
        solidify your new knowledge.
      </Typography>
      <Box
        id="stages-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: tileHeight * 0.6,
          overflowY: "auto",
          marginBottom: "15px",
          paddingLeft: "5px",
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
        }}
      >
        {stages.map((stage, index) => (
          <Typography
            key={index}
            variant="h8"
            component="div"
            gutterBottom
            sx={{ fontSize: "0.95rem", lineHeight: "1.3rem" }}
          >
            {stage}
          </Typography>
        ))}
      </Box>
      <Button
        variant="contained"
        onClick={onNext}
        sx={{
          display: "block",
          width: "60%",
          margin: "auto",
          marginBottom: "8px",
          fontSize: "1.1rem",
          lineHeight: "1.3rem",
          backgroundColor: "#3F15B1",
          "&:hover": { backgroundColor: "#31119F" },
          borderRadius: "100px",
          textTransform: "capitalize",
          fontWeight: "400",
        }}
      >
        GET STARTED!
      </Button>
      <Button
        variant="contained"
        onClick={onExit}
        sx={{
          display: "block",
          width: "40%",
          margin: "auto",
          marginBottom: "0",
          padding: 0,
          color: "#BFBFBF",
          fontSize: "0.8rem",
          backgroundColor: "transparent",
          "&:hover": {
            color: "#858585",
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
          },
          border: "none",
          boxShadow: "none",
          fontWeight: "400",
          textTransform: "none",
        }}
      >
        Exit
      </Button>
    </Box>
  );
};

export default IntroTile2;
