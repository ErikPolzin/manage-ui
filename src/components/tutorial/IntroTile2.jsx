import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";

const IntroTile2 = ({ logoSrc, stages, onNext, onExit }) => {
  const [isVisible, setIsVisible] = useState(false); // used to fade component onto screen

  // Fade progress tile in smoothly
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          zIndex: 1000000000,
          pointerEvents: "all",
          width: "400px",
          padding: "16px",
          boxShadow: "0 0 4px 2px rgba(63, 21, 177, 0.2)",
          borderRadius: "5px",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          backgroundColor: "white",
        }}
      >
        <Box
          className="circle"
          sx={{
            position: "absolute",
            top: "-50px",
            left: "150px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "#3F15B1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={logoSrc}
            alt={"altText"}
            className="logo"
            style={{ maxHeight: "70%", maxWidth: "70%" }}
          />
        </Box>
        <Typography
          variant="h5"
          sx={{
            display: "block",
            textAlign: "center",
            margin: "auto",
            marginTop: "50px",
            marginBottom: "10px",
            color: "black",
            fontSize: "1.3rem",
            fontWeight: 500,
          }}
        >
          Tutorial Stages
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
          There are {stages.length} stages in the tutorial. Stages end with a
          test to help assess and solidify your new knowledge.
        </Typography>
        <Box
          id="stages"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          marginBottom={"20px"}
        >
          {stages.map((stage, index) => (
            <Typography key={index} variant="h8" component="div" gutterBottom>
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
            marginBottom: "10px",
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
            marginBottom: "5px",
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
    </>
  );
};

export default IntroTile2;
