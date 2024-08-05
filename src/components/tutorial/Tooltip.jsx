import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Box, Button, Typography, Paper, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

const Tooltip = ({
  type,
  targetEl,
  targetAreaEl,
  title,
  content,
  onNext,
  canGoBack,
  onBack,
  canExit = false,
  onExit,
  tooltipNo,
  totalTooltips,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipArrowPosition, setTooltipArrowPosition] = useState({
    top: 0,
    left: 0,
  });
  const [targetAreaPos, setTargetAreaPos] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [isVisible, setIsVisible] = useState(false); // used to fade component onto screen
  const tooltipRef = useRef(null);

  useLayoutEffect(() => {
    const targetElement = document.querySelector(targetEl);
    const targetAreaElement = document.querySelector(targetAreaEl);

    if (!tooltipRef.current) {
      return;
    }

    // If target element not found, display it in the center
    if (!targetElement || !targetAreaElement) {
      console.log("The provided target or area element is not found");
      setTooltipPosition({
        top: `calc(${document.documentElement.clientHeight / 2}px - ${
          tooltipRef.current.offsetHeight / 2
        }px)`,
        left: `calc(${document.documentElement.clientWidth / 2}px - ${
          tooltipRef.current.offsetWidth / 2
        }px)`,
      });
      setTooltipArrowPosition({ top: -40, left: -40 });
      return;
    }

    const rect = targetAreaElement.getBoundingClientRect(); // more reliable than using targetAreaElement directly

    const handleAction = () => {
      if (type === "action") {
        onNext();
      }
    };

    if (type === "action") {
      targetElement.addEventListener("click", handleAction);
    }

    // Position the target area highlight
    const updateTargetAreaPosition = () => {
      setTargetAreaPos({
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      });
    };

    // Position the tooltip (and tooltip arrow)
    const updateTooltipPosition = () => {
      const tooltipWidth = 270;
      const offset = 20; // Offset from the target area
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const arrowSize = 30;
      let position = "right";

      // Default tooltip positioning: right of the target area and vertically centered
      let top = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2;
      let left = rect.left + window.scrollX + rect.width + offset;

      // Default arrow positioning: pointing left, centered vertically
      let arrowTop = top + tooltipHeight / 2 - arrowSize / 2;
      let arrowLeft = left - arrowSize / 2;

      // Check if tooltip goes out of viewport on the right
      if (left + tooltipWidth > window.innerWidth) {
        position = "left";
        left = rect.left + window.scrollX - tooltipWidth - offset; // Reposition to the left of the target area
        arrowLeft = left + tooltipWidth - arrowSize / 2; // Arrow pointing right
      }

      // Check if tooltip goes out of viewport on the left
      if (left < 0) {
        position = null;
        left =
          (2 * (rect.left + window.scrollX) + rect.width) / 2 -
          tooltipWidth / 2; // Adjust to fit within the viewport
        arrowLeft = left + tooltipWidth / 2 - arrowSize / 2; // Arrow centered horizontally

        top = rect.top + window.scrollY - tooltipHeight - offset; // If tooltip cannot fit on both the left and right, try it on top
        arrowTop = top + tooltipHeight - arrowSize / 2; // Arrow pointing down
      }

      // Check if tooltip goes out of viewport vertically above
      if (top < 0) {
        console.log("Out above");
        if (position) {
          top = rect.top + window.scrollY - offset / 2;
          arrowTop = rect.top + rect.height / 2 + window.scrollY - offset / 2;
        } else {
          top = rect.top + window.scrollY + rect.height + offset; // Place tooltip on bottom
          arrowTop = top - arrowSize / 2; // Arrow pointing up
        }
      }

      setTooltipPosition({ top, left });
      setTooltipArrowPosition({ top: arrowTop, left: arrowLeft });
    };

    updateTooltipPosition();
    updateTargetAreaPosition();

    window.addEventListener("resize", updateTooltipPosition);
    window.addEventListener("resize", updateTargetAreaPosition);

    return () => {
      if (type === "action") {
        targetElement.removeEventListener("click", handleAction);
      }
      window.removeEventListener("resize", updateTooltipPosition);
      window.removeEventListener("resize", updateTargetAreaPosition);
    };
  }, [targetEl, targetAreaEl, type, onNext, tooltipNo]);

  // Scroll to tooltip automatically
  useLayoutEffect(() => {
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const offsetBottom = 130;
    const offsetTop = 50;
    let scrollPos = null;

    const calculateScrollPos = () => {
      scrollPos = null;
      // Ignore initial tooltip position of 0
      // Initially, both tooltipPosition and targetAreaPos are likely 0, leading to the if condition in calculateScrollPos always evaluating to true and scrolling to the top unnecessarily.
      if (
        tooltipPosition.top !== 0 ||
        tooltipPosition.left !== 0 ||
        targetAreaPos.top !== 0 ||
        targetAreaPos.left !== 0
      ) {
        console.log("Tooltip top: " + tooltipPosition.top);
        console.log("Target Element top: " + targetAreaPos.top);
        console.log("Window top: " + window.scrollY);
        console.log(
          "Window bottom: " +
            (window.scrollY + document.documentElement.clientHeight)
        );

        // Check first if tooltip or target element higher
        // if tooltip higher, you want to scroll to its top
        if (tooltipPosition.top < targetAreaPos.top) {
          // if tooltip is out of viewport
          if (
            tooltipPosition.top - offsetTop < window.scrollY ||
            tooltipPosition.top + tooltipHeight + offsetBottom >
              window.scrollY + document.documentElement.clientHeight
          ) {
            // scroll to tooltip top
            scrollPos = tooltipPosition.top - offsetTop;
          }
        }
        // else if target element is higher, you want to scroll to its top
        else {
          // if target element is out of viewport
          if (
            targetAreaPos.top - offsetTop < window.scrollY ||
            targetAreaPos.top + targetAreaPos.height + offsetBottom >
              window.scrollY + document.documentElement.clientHeight
          ) {
            // scroll to target area top
            scrollPos = targetAreaPos.top - offsetTop;
          }
        }
      }
    };
    calculateScrollPos();

    if (scrollPos !== null) {
      window.scrollTo({ top: scrollPos, behavior: "smooth" });
    }
  }, [tooltipPosition, targetAreaPos]);

  // Fade tooltip in smoothly
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, [tooltipNo]);

  // Replace \n with <br> for line breaks
  const formattedContent = content.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  const tooltipWidth = 270;

  const tooltipStyle = {
    position: "absolute",
    top: tooltipPosition.top,
    left: tooltipPosition.left,
    zIndex: 1000000000,
    padding: "16px",
    width: tooltipWidth,
    boxShadow: "0 0 4px 2px rgba(63, 21, 177, 0.2)",
  };

  return (
    <Box
      key={tooltipNo}
      sx={{
        pointerEvents: "all",
        opacity: isVisible ? 1 : 0,
        transition:
          type === "informative"
            ? "opacity 0.5s ease-in-out"
            : "opacity 0.25s ease-in-out",
      }}
    >
      <Box
        id="tooltip-arrow"
        top={tooltipArrowPosition.top}
        left={tooltipArrowPosition.left}
        sx={{
          position: "absolute",
          width: 30,
          height: 30,
          backgroundColor: "#3F15B1",
          transform: "rotate(45deg)",
          boxShadow: "0 0 4px 2px rgba(63, 21, 177, 0.2)",
        }}
      ></Box>
      <Paper id="tooltip" ref={tooltipRef} style={tooltipStyle} elevation={3}>
        {canExit && (
          <CloseIcon
            onClick={onExit}
            sx={{
              position: "absolute",
              right: "5px",
              top: "5px",
              fontSize: "large",
              color: "#D1D1D1",
              cursor: "pointer",
              "&:hover": { color: "#979797" },
              transition: "color 0.1s ease-in",
            }}
          ></CloseIcon>
        )}
        {type === "informative" ? (
          <>
            <Typography
              id="tooltip-title"
              sx={{ marginBottom: "6px" }}
              variant="h6"
            >
              {title}
            </Typography>
            <Typography
              id="tooltip-informative-content"
              variant="body2"
              paragraph
            >
              {formattedContent}
            </Typography>
            <Box
              display="flex"
              justifyContent={canGoBack ? "space-between" : "flex-end"}
              alignItems="center"
            >
              {canGoBack && (
                <IconButton
                  id="tooltip-back-button"
                  onClick={onBack}
                  size="small"
                  sx={{ color: "#3F15B1" }}
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              )}
              <Button
                id="tooltip-next-button"
                variant="contained"
                size="small"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                onClick={onNext}
                sx={{
                  backgroundColor: "#3F15B1",
                  "&:hover": { backgroundColor: "#31119F" },
                }}
              >
                {tooltipNo === totalTooltips ? "Finish" : "Next"}
              </Button>
            </Box>
          </>
        ) : (
          <Typography
            id="tooltip-action-content"
            variant="body2"
            fontSize={"1.3rem"}
            fontWeight={550}
            textAlign={"center"}
          >
            {formattedContent}
          </Typography>
        )}
        <Box
          id="tooltip-progress-container"
          width={tooltipWidth}
          sx={{
            margin: "6px 0px 0px",
            transform: "translateX(-16px)",
            position: "relative",
            padding: 0,
          }}
        >
          <Box display={"flex"} justifyContent={"flex-end"} alignItems={"end"}>
            {type === "action" && canGoBack && (
              <IconButton
                onClick={onBack}
                size="small"
                sx={{ color: "#3F15B1", padding: 0, marginLeft: "2px" }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            )}
            <Typography
              id="tooltip-progress-numbers"
              sx={{
                padding: "0 3px 0 0",
                marginLeft: "auto",
                fontSize: "10px",
                color: "#BFBFBF",
              }}
            >
              {tooltipNo}/{totalTooltips}
            </Typography>
          </Box>
          <Box
            id="tooltip-progressbar-container"
            width="100%"
            height="2.5px"
            sx={{
              margin: "2px 0px 0px",
              position: "relative",
              padding: 0,
              border: "none",
            }}
          >
            <Box
              id="tooltip-progressbar-background"
              height="100%"
              width="100%"
              sx={{
                backgroundColor: "#E8E8E8",
                position: "absolute",
                padding: 0,
                margin: 0,
              }}
            ></Box>
            <Box
              id="tooltip-progressbar"
              height="100%"
              width={`${(tooltipNo / totalTooltips) * 100}%`}
              sx={{
                backgroundColor: "#3F15B1",
                position: "absolute",
                padding: 0,
                margin: 0,
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            ></Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Tooltip;
