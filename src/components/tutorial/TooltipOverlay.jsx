import React, { useEffect, useLayoutEffect, useState } from "react";
import { throttle } from "lodash";
import { Box } from "@mui/material";

const TooltipOverlay = ({ targetAreaEl }) => {
  const [targetAreaPos, setTargetAreaPos] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const svgViewBoxDimensions = {
    right: document.documentElement.scrollWidth,
    bottom: document.documentElement.scrollHeight,
  };
  const parentDimensions = {
    right: document.documentElement.scrollWidth,
    bottom: document.documentElement.scrollHeight,
  };

  // Refresh tooltip position at regular intervals
  const [refreshInterval, setRefreshInterval] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshInterval(new Date());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    const updateTargetAreaPosition = () => {
      const targetAreaElement = document.querySelector(targetAreaEl);
      if (!targetAreaElement) return;

      // Position the target area highlight
      const rect = targetAreaElement.getBoundingClientRect();

      // console.log(
      //   "Element position: ",
      //   rect.left,
      //   rect.top,
      //   rect.width,
      //   rect.height
      // );

      // converting these values to the svg viewBox dimensions you are working in
      setTargetAreaPos({
        left: (rect.left + window.scrollX) * (svgViewBoxDimensions.right / parentDimensions.right),
        top: (rect.top + window.scrollY) * (svgViewBoxDimensions.bottom / parentDimensions.bottom),
        width: rect.width * (svgViewBoxDimensions.right / parentDimensions.right),
        height: rect.height * (svgViewBoxDimensions.bottom / parentDimensions.bottom),
      });
    };

    updateTargetAreaPosition();
    window.addEventListener("resize", updateTargetAreaPosition);
    window.addEventListener("scroll", updateTargetAreaPosition);
    window.addEventListener("click", updateTargetAreaPosition);
    window.addEventListener("orientationchange", updateTargetAreaPosition);

    return () => {
      window.removeEventListener("resize", updateTargetAreaPosition);
      window.removeEventListener("scroll", updateTargetAreaPosition);
      window.removeEventListener("click", updateTargetAreaPosition);
      window.removeEventListener("orientationchange", updateTargetAreaPosition);
    };
  }, [targetAreaEl, refreshInterval]);

  const areaOffset = 5;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: parentDimensions.right,
        height: parentDimensions.bottom,
        pointerEvents: "none", // ensures elements in inner rectangle are clickable
      }}
    >
      {/* Outer rectangles on the top, left, right, and bottom that blocks pointer events */}
      <Box
        id="topRect"
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: Math.max(targetAreaPos.top - areaOffset, 0) + "px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          pointerEvents: "all", // elements behind overlay not clickable
          transition:
            "width 0.5s ease-in-out, height 0.5s ease-in-out, left 0.5s ease-in-out, top 0.5s ease-in-out",
        }}
      />
      <Box
        id="leftRect"
        sx={{
          position: "absolute",
          left: 0,
          top: targetAreaPos.top - areaOffset + "px",
          width: Math.max(targetAreaPos.left - areaOffset, 0) + "px",
          height: Math.max(targetAreaPos.height + 2 * areaOffset, 0) + "px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          pointerEvents: "all", // elements behind overlay not clickable
          transition:
            "width 0.5s ease-in-out, height 0.5s ease-in-out, left 0.5s ease-in-out, top 0.5s ease-in-out",
        }}
      />

      <Box
        id="rightRect"
        sx={{
          position: "absolute",
          left: `${targetAreaPos.left + targetAreaPos.width + areaOffset}px`,
          top: `${targetAreaPos.top - areaOffset}px`,
          width: `${Math.max(
            document.documentElement.clientWidth -
              (targetAreaPos.left + targetAreaPos.width + areaOffset),
            0,
          )}px`,
          height: `${Math.max(targetAreaPos.height + 2 * areaOffset, 0)}px`,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          pointerEvents: "all", // elements behind overlay not clickable
          transition:
            "width 0.5s ease-in-out, height 0.5s ease-in-out, left 0.5s ease-in-out, top 0.5s ease-in-out",
        }}
      />

      <Box
        id="bottomRect"
        sx={{
          position: "absolute",
          left: `0px`,
          top: `${targetAreaPos.top + targetAreaPos.height + areaOffset}px`,
          width: "100%",
          height: `${Math.max(
            document.documentElement.scrollHeight -
              (targetAreaPos.top + targetAreaPos.height + areaOffset),
            0,
          )}px`,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          pointerEvents: "all", // elements behind overlay not clickable
          transition:
            "width 0.5s ease-in-out, height 0.5s ease-in-out, left 0.5s ease-in-out, top 0.5s ease-in-out",
        }}
      />
    </Box>

    // <svg
    //   width="100%"
    //   height="100%"
    //   viewBox={`0 0 ${svgViewBoxDimensions.right} ${svgViewBoxDimensions.bottom}`}
    //   preserveAspectRatio="none"
    //   style={{
    //     position: "absolute",
    //     top: 0,
    //     left: 0,
    //     width: "100%",
    //     height: "100%",
    //     pointerEvents: "none", // ensures elements in inner rectangle are clickable
    //   }}
    // >
    //   {/* Outer rectangles on the top, left, right, and bottom that blocks pointer events */}
    //   <rect
    //     id="topRect"
    //     x="0"
    //     y="0"
    //     width="100%"
    //     height={Math.max(targetAreaPos.top - areaOffset, 0)}
    //     fill="black"
    //     fillOpacity={0.2}
    //     style={{
    //       pointerEvents: "all",
    //       transition:
    //         "width 0.5s ease-in-out, height 0.5s ease-in-out, x 0.5s ease-in-out, y 0.5s ease-in-out",
    //     }} // elements behind overlay not clickable
    //   />
    //   <rect
    //     id="leftRect"
    //     x="0"
    //     y={targetAreaPos.top - areaOffset}
    //     width={Math.max(targetAreaPos.left - areaOffset, 0)}
    //     height={Math.max(targetAreaPos.height + 2 * areaOffset, 0)}
    //     fill="black"
    //     fillOpacity={0.2}
    //     style={{ pointerEvents: "all" }}
    //   />

    //   <rect
    //     id="rightRect"
    //     x={targetAreaPos.left + targetAreaPos.width + areaOffset}
    //     y={targetAreaPos.top - areaOffset}
    //     width={Math.max(
    //       document.documentElement.clientWidth -
    //         (targetAreaPos.left + targetAreaPos.width + areaOffset),
    //       0,
    //     )}
    //     height={Math.max(targetAreaPos.height + 2 * areaOffset, 0)}
    //     fill="black"
    //     fillOpacity={0.2}
    //     style={{ pointerEvents: "all" }}
    //   />

    //   <rect
    //     id="bottomRect"
    //     x="0"
    //     y={targetAreaPos.top + targetAreaPos.height + areaOffset}
    //     width="100%"
    //     height={Math.max(
    //       document.documentElement.scrollHeight -
    //         (targetAreaPos.top + targetAreaPos.height + areaOffset),
    //       0,
    //     )}
    //     fill="black"
    //     fillOpacity={0.2}
    //     style={{ pointerEvents: "all" }}
    //   />
    // </svg>
  );
};

export default TooltipOverlay;
