import { CssBaseline, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useLayoutEffect, useState } from "react";

const InfoIcon = ({
  targetEl,
  title,
  body,
  transitionTime = 0.3,
  delayTime = 0,
}) => {
  const infoIconSize = 15;
  const infoBoxWidth = 150;
  const [isOpen, setIsOpen] = useState(false);
  const [infoIconPos, setInfoIconPos] = useState({
    top: document.documentElement.clientHeight + window.scrollY - infoIconSize,
    left: document.documentElement.clientWidth + window.scrollX - infoIconSize,
  });
  const [infoBoxPos, setInfoBoxPos] = useState({ top: 0, left: 0 });

  const [targetElementFound, setTargetElementFound] = useState(true);

  const updatePositions = () => {
    const targetElement = document.querySelector(targetEl);
    setTargetElementFound(true);

    if (!targetElement) {
      setTargetElementFound(false);
      return;
    }

    const rect = targetElement.getBoundingClientRect();

    setInfoIconPos({
      left: rect.left + window.scrollX + rect.width - infoIconSize,
      top: rect.top + window.scrollY - infoIconSize / 2,
    });
  };

  const handleWindowClick = () => {
    updatePositions();
  };

  useEffect(() => {
    // Initial positioning
    updatePositions();

    window.addEventListener("click", handleWindowClick, false);
    window.addEventListener("resize", updatePositions);

    return () => {
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("resize", updatePositions);
    };
  }, []);

  useLayoutEffect(() => {
    // Position the info box
    const updateInfoBoxPos = () => {
      if (
        infoIconPos.left + (infoBoxWidth + 5) <
        document.documentElement.clientWidth
      ) {
        setInfoBoxPos({
          left: infoIconPos.left + infoIconSize + 5,
          top: infoIconPos.top,
        });
      } else {
        setInfoBoxPos({
          left: infoIconPos.left - (infoBoxWidth + 5),
          top: infoIconPos.top + infoIconSize + 5,
        });
      }
    };
    updateInfoBoxPos();
  }, [infoIconPos]);

  const handleInfoIconClick = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  if (targetElementFound) {
    return (
      <Box
        zIndex={1000000000}
        sx={{
          pointerEvents: "all",
        }}
      >
        <CssBaseline />
        <Box
          zIndex={1000000001}
          id="info-icon"
          onClick={handleInfoIconClick}
          sx={{
            position: "absolute",
            top: infoIconPos.top,
            left: infoIconPos.left,
            width: infoIconSize,
            height: infoIconSize,
            borderRadius: "50%",
            textAlign: "center",
            fontSize: "0.6rem",
            color: "white",
            backgroundColor: "#3F15B1",
            boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            "&:hover": { color: "#d6d6d6" },
            userSelect: "none",
            transition: `top ${transitionTime}s ${delayTime}s ease-out, left ${transitionTime}s ${delayTime}s ease-out`,
          }}
        >
          ?
        </Box>
        {isOpen && (
          <Box
            zIndex={1000000008}
            id="info-box"
            sx={{
              position: "absolute",
              top: infoBoxPos.top,
              left: infoBoxPos.left,
              width: infoBoxWidth,
              backgroundColor: "white",
              borderRadius: "3px",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              padding: "5px",
            }}
          >
            {title && (
              <Typography
                id="info-box-title"
                variant="h6"
                sx={{ fontSize: "0.9rem" }}
              >
                {title}
              </Typography>
            )}
            <Typography
              id="info-box-body"
              variant="body2"
              sx={{ fontSize: "0.7rem" }}
            >
              {body}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
};

export default InfoIcon;
