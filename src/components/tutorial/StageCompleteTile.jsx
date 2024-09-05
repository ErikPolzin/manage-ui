import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const StageCompleteCard = ({ stageNo, stageName, onContinue }) => {
  const [isVisible, setIsVisible] = useState(false); // used to fade component onto screen

  // Fade progress tile in smoothly
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
    <Paper style={style} elevation={3}>
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
        {"Stage Complete !!"}
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
      <Typography
        sx={{
          width: "100%",
          textAlign: "center",
          fontSize: "1rem",
          marginBottom: "0px",
        }}
        variant="body2"
        paragraph
      >
        {"You've succesfully completed"}
      </Typography>
      <Typography
        sx={{
          width: "100%",
          textAlign: "center",
          color: "#3F15B1",
          fontWeight: "bold",
          fontSize: "1.4rem",
        }}
        variant="body2"
        paragraph
      >
        {`Stage ${stageNo} - ${stageName}`}
      </Typography>
      <Box
        id="stage-complete-card-continue-button"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button
          variant="contained"
          size="small"
          endIcon={<ArrowForwardIcon fontSize="small" />}
          onClick={onContinue}
          sx={{
            backgroundColor: "#3F15B1",
            "&:hover": { backgroundColor: "#31119F" },
          }}
        >
          Continue
        </Button>
      </Box>
    </Paper>
  );
};

export default StageCompleteCard;
