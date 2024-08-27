import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Box, Button, Typography, Paper, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import TooltipOverlay from "./TooltipOverlay";

const Tooltip = ({
  type = "informative",
  targetEl,
  targetAreaEl,
  title = "No Title Given",
  content = "No Content Given",
  onNext,
  canGoBack = false,
  onBack,
  canExit = false,
  onExit,
  tooltipNo,
  totalTooltips,
  headerHeight = 30,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipArrowPosition, setTooltipArrowPosition] = useState({
    top: 0,
    left: 0,
  });
  const tooltipWidth = 270;
  const arrowSize = 30;
  console.log((tooltipNo - 1 / totalTooltips) * 100);
  console.log(totalTooltips);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const [targetAreaPos, setTargetAreaPos] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [isVisible, setIsVisible] = useState(false); // used to fade component onto screen
  const tooltipRef = useRef(null);
  const [willScroll, setWillScroll] = useState(true);
  const [changedTooltipSince, setChangedTooltipSince] = useState(true);

  // Refresh tooltip position at regular intervals
  const [refreshInterval, setRefreshInterval] = useState(new Date());
  const [refreshIntervalValue, setRefreshIntervalValue] = useState(500);
  const [tooltipChanging, setTooltipChanging] = useState(false);

  // Set refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (!tooltipChanging) {
        setRefreshInterval(new Date());
        setProgressBarWidth((tooltipNo / totalTooltips) * 100);
        console.log("Refreshing");
      }
    }, refreshIntervalValue);

    return () => clearInterval(interval);
  }, [tooltipChanging]);

  // Positioning the tooltip
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
      setTooltipArrowPosition({
        top: document.documentElement.clientHeight / 2 - arrowSize / 2,
        left: document.documentElement.clientWidth / 2 - arrowSize / 2,
      });
      return;
    }

    const rect = targetAreaElement.getBoundingClientRect(); // more reliable than using targetAreaElement directly
    // Scroll the target element into view
    targetAreaElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

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
      const offsetOuter = 20; // Offset from outer screen border
      const tooltipHeight = tooltipRef.current.offsetHeight;
      let position = "right";

      // Default tooltip positioning: right of the target area and vertically centered
      let top = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2;
      let left = rect.left + window.scrollX + rect.width + offset;
      let minSpaceOver = {
        side: "right",
        amount: left + tooltipWidth - document.documentElement.clientWidth,
      };

      // Default arrow positioning: pointing left, centered vertically
      let arrowTop = top + tooltipHeight / 2 - arrowSize / 2;
      let arrowLeft = left - arrowSize / 2;

      // Check if tooltip goes out of viewport on the right
      if (left + tooltipWidth > document.documentElement.clientWidth) {
        position = "left";
        left = rect.left + window.scrollX - tooltipWidth - offset; // Reposition to the left of the target area
        arrowLeft = left + tooltipWidth - arrowSize / 2; // Arrow pointing right

        if (minSpaceOver.amount > Math.abs(left)) {
          minSpaceOver.amount = Math.abs(left);
          minSpaceOver.side = "left";
        }
      }

      // Check if tooltip goes out of viewport on the left
      if (left < 0) {
        left = (2 * (rect.left + window.scrollX) + rect.width) / 2 - tooltipWidth / 2; // Adjust to fit within the viewport
        arrowLeft = left + tooltipWidth / 2 - arrowSize / 2; // Arrow centered horizontally

        position = "top";
        top = rect.top + window.scrollY - tooltipHeight - offset; // If tooltip cannot fit on both the left and right, try it on top
        arrowTop = top + tooltipHeight - arrowSize / 2; // Arrow pointing down
      }

      // Check if tooltip goes out of viewport vertically above
      if (top < offsetOuter) {
        // if its positioned right or left
        if (position === "right" || position === "left") {
          top = rect.top + window.scrollY - offset / 2;
          arrowTop = rect.top + rect.height / 2 + window.scrollY - offset / 2;
          if (
            top + tooltipHeight + offsetOuter + 40 >
            window.scrollY + document.documentElement.clientHeight
          ) {
            top = window.scrollY + document.documentElement.clientHeight - offset - tooltipHeight;
          }
        } // else if its positioned directly above
        else {
          // if it can't fit on bottom neither (i.e. can't fit anywhere on the page)
          if (
            rect.top + window.scrollY + rect.height + offset + tooltipHeight >
            window.scrollY + document.documentElement.clientHeight
          ) {
            if (minSpaceOver.side === "right") {
              // Tooltip positioning: right side of the page area and vertically centered
              top = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2;
              left = window.scrollX - rect.width - offset;

              // Arrow positioning: pointing left, centered vertically
              arrowTop = top + tooltipHeight / 2 - arrowSize / 2;
              arrowLeft = left - arrowSize / 2;
            } else if (minSpaceOver.side === "left") {
              // Tooltip positioning: left side of the page area and vertically centered
              top = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2;
              left = offset;

              // Arrow positioning: pointing right, centered vertically
              arrowTop = top + tooltipHeight / 2 - arrowSize / 2;
              arrowLeft = tooltipWidth + offset - arrowSize / 2;
            }
          } // else if we can position directly below
          else {
            top = rect.top + window.scrollY + rect.height + offset;
            arrowTop = top - arrowSize / 2; // Arrow pointing up
          }
        }
      }

      // if it goes out vertically below after final positioning
      if (
        top + tooltipHeight + offsetOuter >
        window.scrollY + document.documentElement.clientHeight
      ) {
        top = window.scrollY + document.documentElement.clientHeight - offset - tooltipHeight;
        arrowTop = rect.top + rect.height / 2 + window.scrollY - offset / 2;
      }

      // if the tooltip is busy changing, don't allow refresh interval to interfere - just leave final if statement if you get rid of the interval updates
      // if (tooltipChanging) {
      //   setTooltipPosition({ top, left });
      //   setTooltipArrowPosition({ top: arrowTop, left: arrowLeft });
      //   setTimeout(() => {
      //     setTooltipChanging(false);
      //   }, 600);
      // } else {
      setTooltipPosition({ top, left });
      setTooltipArrowPosition({ top: arrowTop, left: arrowLeft });
      // }
    };

    updateTooltipPosition();
    updateTargetAreaPosition();

    window.addEventListener("resize", updateTooltipPosition);
    window.addEventListener("resize", updateTooltipPosition);
    window.addEventListener("click", updateTargetAreaPosition);
    window.addEventListener("click", updateTargetAreaPosition);

    const handleAction = () => {
      if (type === "action") {
        setChangedTooltipSince(true);
        handleTooltipChanging();
        if (tooltipNo === totalTooltips) {
          setProgressBarWidth(0);
        }
        onNext();
      }
    };

    if (type === "action") {
      targetElement.addEventListener("click", handleAction);
    }

    return () => {
      if (type === "action") {
        targetElement.removeEventListener("click", handleAction);
      }
      window.removeEventListener("resize", updateTooltipPosition);
      window.removeEventListener("resize", updateTooltipPosition);
      window.removeEventListener("click", updateTargetAreaPosition);
      window.removeEventListener("click", updateTargetAreaPosition);
    };
  }, [targetEl, targetAreaEl, type, onNext, onBack, tooltipNo, refreshInterval]);
  // ***** I think try to remove all these and just leave one like the targetEl to prevent so many refreshes. And do the same with all useEffects and stuff

  // Scroll to tooltip automatically
  useLayoutEffect(() => {
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const offsetBottom = 130;
    const offsetTop = 50;
    let scrollPos = null;

    const calculateScrollPos = () => {
      setTimeout(() => {
        scrollPos = null;
        // Ignore initial tooltip position of 0
        // Initially, both tooltipPosition and targetAreaPos are likely 0, leading to the if condition in calculateScrollPos always evaluating to true and scrolling to the top unnecessarily.
        if (
          tooltipPosition.top !== 0 ||
          tooltipPosition.left !== 0 ||
          targetAreaPos.top !== 0 ||
          targetAreaPos.left !== 0
        ) {
          // Check first if tooltip or target element higher - if tooltip higher, you want to scroll to its top
          if (tooltipPosition.top < targetAreaPos.top) {
            // if tooltip is out of viewport
            if (
              tooltipPosition.top - offsetTop < window.scrollY ||
              tooltipPosition.top + tooltipHeight + offsetBottom >
                window.scrollY + document.documentElement.clientHeight
            ) {
              // scroll to tooltip top
              scrollPos = tooltipPosition.top - offsetTop - headerHeight;
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
              scrollPos = targetAreaPos.top - offsetTop - headerHeight;
            }
          }
        }

        if (changedTooltipSince) {
          // if the tooltip has indeed changed the scroll positions
          if (scrollPos !== null) {
            // if attempting to scroll higher, but already at top
            if (window.scrollY === 0 && scrollPos <= 0 && changedTooltipSince) {
              //console.log("Won't scroll");
              setWillScroll(false);
            } else {
              //console.log("Will scroll");
              setWillScroll(true);
              window.scrollTo({ top: scrollPos, behavior: "smooth" });
            }
          }
          // otherwise, if the tooltip hasn't changed positions, then you want to
          else if (changedTooltipSince) {
            //console.log("Won't scroll 2");
            setWillScroll(false);
          }
          setChangedTooltipSince(false);
        }
      }, 0);
    };
    calculateScrollPos();
  }, [tooltipPosition, targetAreaPos]);

  // Fade tooltip in smoothly
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, [tooltipNo]);

  const handleTooltipChanging = () => {
    console.log("Tooltip changing:", true);
    setTooltipChanging(true);
    setTimeout(() => {
      console.log("Tooltip changing:", false);
      setTooltipChanging(false);
    }, 0);
  };

  // Replace \n with <br> for line breaks
  const formattedContent = content.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  const tooltipStyle = {
    position: "absolute",
    top: tooltipPosition.top,
    left: tooltipPosition.left,
    zIndex: 1000000000,
    padding: "16px",
    width: tooltipWidth,
    boxShadow: "0 0 4px 2px rgba(63, 21, 177, 0.2)",
    transition: "top 0.5s ease-in-out, left 0.5s ease-in-out",
  };

  return (
    <>
      <TooltipOverlay targetAreaEl={targetAreaEl} willScroll={willScroll}></TooltipOverlay>
      <Box
        key={tooltipNo}
        sx={{
          pointerEvents: "all",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <Box
          id="tooltip-arrow"
          top={tooltipArrowPosition.top}
          left={tooltipArrowPosition.left}
          sx={{
            position: "absolute",
            width: arrowSize,
            height: arrowSize,
            backgroundColor: "#3F15B1",
            transform: "rotate(45deg)",
            boxShadow: "0 0 4px 2px rgba(63, 21, 177, 0.2)",
            transition: "top 0.5s ease-in-out, left 0.5s ease-in-out",
            opacity:
              tooltipArrowPosition.top ===
                document.documentElement.clientHeight / 2 - arrowSize / 2 &&
              tooltipArrowPosition.left === document.documentElement.clientWidth / 2 - arrowSize / 2
                ? 0
                : 1,
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
              <Typography id="tooltip-title" sx={{ marginBottom: "6px" }} variant="h6">
                {title}
              </Typography>
              <Typography id="tooltip-informative-content" variant="body2" paragraph>
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
                    onClick={() => {
                      setChangedTooltipSince(true);
                      handleTooltipChanging();
                      onBack();
                    }}
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
                  onClick={() => {
                    setChangedTooltipSince(true);
                    handleTooltipChanging();
                    if (tooltipNo === totalTooltips) {
                      setProgressBarWidth(0);
                    }
                    onNext();
                  }}
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
                  onClick={() => {
                    setChangedTooltipSince(true);
                    handleTooltipChanging();
                    onBack();
                  }}
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
                width={`${progressBarWidth}%`}
                sx={{
                  backgroundColor: "#3F15B1",
                  position: "absolute",
                  padding: 0,
                  margin: 0,
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                  transition: "width 0.2s 0s ease",
                }}
              ></Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Tooltip;
