import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

const TooltipOverlay = ({ targetAreaEl, areaClickable = true, willScroll = true }) => {
  const [targetAreaPos, setTargetAreaPos] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const prevRectPositionRef = useRef({ top: 0, left: 0, height: 0, width: 0 });
  const [targetElementFound, setTargetElementFound] = useState(false);

  // Refresh overlay position at regular intervals
  const [refreshInterval, setRefreshInterval] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshInterval(new Date());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Target area positioning
  const updateTargetAreaPosition = (rect) => {
    // converting these values to the svg viewBox dimensions you are working in
    setTargetAreaPos({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
  };

  useLayoutEffect(() => {
    const targetAreaElement = document.getElementById(targetAreaEl);
    if (!targetAreaElement) {
      setTargetElementFound(false);
      return;
    }

    setTargetElementFound(true);
    const rect = targetAreaElement.getBoundingClientRect();

    const handlePositioning = () => {
      // Only change positions if target element has changed
      if (
        prevRectPositionRef.current.top !== rect.top ||
        prevRectPositionRef.current.left !== rect.left ||
        prevRectPositionRef.current.height !== rect.height ||
        prevRectPositionRef.current.width !== rect.width
      ) {
        requestAnimationFrame(() => {
          updateTargetAreaPosition(rect);
        });
        prevRectPositionRef.current = {
          top: rect.top,
          left: rect.left,
          height: rect.height,
          width: rect.width,
        };
      }
    };
    handlePositioning(); // Interval update

    // Use MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(() => {
      handlePositioning();
    });

    // Observe changes to the entire document
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", handlePositioning);
    window.addEventListener("click", handlePositioning);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handlePositioning);
      window.removeEventListener("click", handlePositioning);
    };
  }, [targetAreaEl, refreshInterval]);

  const areaOffset = 5;

  return (
    <Box
      role="tooltip-overlay"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        // width: parentDimensions.right,
        width: document.documentElement.clientWidth,
        // height: parentDimensions.bottom,
        height: document.documentElement.clientHeight,
        backgroundColor: targetElementFound ? "transparent" : "rgba(0, 0, 0, 0.2)",
        pointerEvents: areaClickable ? "none" : "all", // ensures elements in inner rectangle are clickable
        transition: !willScroll ? "width 0.5s ease-in-out, height 0.5s ease-in-out" : "none",
      }}
    >
      {/* Outer rectangles on the top, left, right, and bottom that blocks pointer events */}
      {targetElementFound && (
        <>
          <Box
            id="topRect"
            data-testid="topRect"
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: Math.max(targetAreaPos.top - areaOffset, 0) + "px",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              pointerEvents: "all", // elements behind overlay not clickable
              transition: !willScroll
                ? "width 0.5s ease-in-out,height 0.5s ease-in-out,left 0.5s ease-in-out,top 0.5s ease-in-out"
                : "none",
            }}
          />
          <Box
            id="leftRect"
            data-testid="leftRect"
            sx={{
              position: "absolute",
              left: 0,
              top: targetAreaPos.top - areaOffset + "px",
              width: Math.max(targetAreaPos.left - areaOffset, 0) + "px",
              height: Math.max(targetAreaPos.height + 2 * areaOffset, 0) + "px",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              pointerEvents: "all", // elements behind overlay not clickable
              transition: !willScroll
                ? "width 0.5s ease-in-out, height 0.5s ease-in-out, left 0.5s ease-in-out, top 0.5s ease-in-out"
                : "none",
            }}
          />

          <Box
            id="rightRect"
            data-testid="rightRect"
            sx={{
              position: "absolute",
              left: `${targetAreaPos.left + targetAreaPos.width + areaOffset}px`,
              top: `${targetAreaPos.top - areaOffset}px`,
              width: `calc(100% - ${targetAreaPos.left + targetAreaPos.width + areaOffset}px)`,
              height: `${Math.max(targetAreaPos.height + 2 * areaOffset, 0)}px`,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              pointerEvents: "all", // elements behind overlay not clickable
              transition: !willScroll
                ? "width 0.5s ease-in-out, height 0.5s ease-in-out, left 0.5s ease-in-out, top 0.5s ease-in-out"
                : "none",
            }}
          />

          <Box
            id="bottomRect"
            data-testid="bottomRect"
            sx={{
              position: "absolute",
              left: `0px`,
              top: `${targetAreaPos.top + targetAreaPos.height + areaOffset}px`,
              width: "100%",
              height: `calc(100% - ${targetAreaPos.top + targetAreaPos.height + areaOffset}px)`,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              pointerEvents: "all", // elements behind overlay not clickable
              transition: !willScroll
                ? "width 0.5s ease-in-out, height 0.5s ease-in-out, left 0.5s ease-in-out, top 0.5s ease-in-out"
                : "none",
            }}
          />
        </>
      )}
    </Box>
  );
};

export default TooltipOverlay;
