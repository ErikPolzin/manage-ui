import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const InteractiveGuideCard = ({ guideNo, guideName, progress }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: "relative",
        top: 2.5,
        width: "100%",
        borderRadius: "5px",
        padding: "7px",
        backgroundColor: "white",
        transition: "top 0.25s ease-out",
        boxShadow: "0 2px 6px 0px rgba(0, 0, 0, 0.1)",
        "&:hover": { top: 0 },
        cursor: "pointer",
      }}
    >
      <ArrowForwardIcon
        fontSize="small"
        sx={{
          position: "absolute",
          padding: 0,
          margin: 0,
          right: isHovered ? 5 : 9,
          opacity: isHovered ? 1 : 0,
          transition: "right 0.3s ease-out, opacity 0.3s ease-out",
          color: "#3F15B1",
          "&:hover": { color: "#3F15B1" },
        }}
      ></ArrowForwardIcon>
      <Box
        className="guide-no-circle"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: "25px",
          height: "25px",
          borderRadius: "50%",
          color: "#7F7F7F",
          backgroundColor: "#E1E3E7",
        }}
      >
        <Typography className="guide-no" sx={{ fontSize: "0.9rem" }}>
          {guideNo}
        </Typography>
      </Box>
      <Typography
        className="guide-name"
        variant="h6"
        sx={{
          color: "black",
          fontSize: "1rem",
          fontWeight: 500,
          marginTop: "8px",
        }}
      >
        {guideName}
      </Typography>
      <Box
        class="guide-progress-container"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          width: "100%",
          margin: "2px 0 3px 0",
          padding: 0,
          backgroundColor: "transparent",
        }}
      >
        <Box
          id="guide-progressbar-container"
          width="83%"
          height="2.5px"
          sx={{
            display: "inline-block",
            margin: "0 0 0 0",
            position: "relative",
            padding: 0,
            border: "none",
          }}
        >
          <Box
            id="guide-progressbar-background"
            height="100%"
            width="100%"
            sx={{
              backgroundColor: "#E8E8E8",
              position: "absolute",
              padding: 0,
              margin: 0,
              borderRadius: "10px",
            }}
          ></Box>
          <Box
            id="guide-progressbar"
            data-testid="guide-progressbar"
            height="100%"
            width={`${progress}%`}
            sx={{
              backgroundColor: "#3F15B1",
              position: "absolute",
              padding: 0,
              margin: 0,
              borderRadius: "10px",
            }}
          ></Box>
        </Box>
        <Typography
          className="guide-progress-number"
          variant="body1"
          sx={{
            display: "inline-block",
            flex: 0.2,
            color: "black",
            fontSize: "0.7rem",
            fontWeight: 400,
            lineHeight: "0.7rem",
            padding: 0,
            marginLeft: "5px",
          }}
        >
          {progress}%
        </Typography>
      </Box>
    </Box>
  );
};

export default InteractiveGuideCard;
