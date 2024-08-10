import { CssBaseline, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const InfoIcon = ({ targetEl, title, body, transitionTime = 0.3, delayTime = 0 }) => {
  const infoIconSize = 15;
  const infoBoxWidth = 150;
  const [isOpen, setIsOpen] = useState(false);
  const [infoIconPos, setInfoIconPos] = useState({
    top: document.documentElement.clientHeight + window.scrollY - infoIconSize,
    left: document.documentElement.clientWidth + window.scrollX - infoIconSize,
  });
  const [infoBoxPos, setInfoBoxPos] = useState({ top: 0, left: 0 });
  const [targetElementFound, setTargetElementFound] = useState(false);

  const [clickedElement, setClickedElement] = useState(null); // used to call use effect on every window click
  const iconRef = useRef(null);

  // Close menu when a click outside occurs
  useEffect(() => {
    const handleWindowClick = (event) => {
      setClickedElement(event);
    };

    const closeMenu = () => {
      if (
        isOpen &&
        iconRef.current &&
        clickedElement &&
        !iconRef.current.contains(clickedElement.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleWindowClick);

    // Call closeMenu immediately in case the click occurs before the event listener is removed
    closeMenu();

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [clickedElement]);

  const updatePositions = () => {
    const targetElement = document.querySelector(targetEl);
    if (!targetElement) {
      setTargetElementFound(false);
      return;
    }

    setTargetElementFound(true);
    const rect = targetElement.getBoundingClientRect();

    const left =
      rect.left + window.scrollX + rect.width - infoIconSize > document.documentElement.scrollWidth
        ? rect.left + window.scrollX + rect.width - infoIconSize
        : rect.left + window.scrollX + rect.width - infoIconSize / 2;
    setInfoIconPos({
      left: left,
      top: rect.top + window.scrollY - infoIconSize / 2,
    });
  };

  useEffect(() => {
    // Initial positioning
    updatePositions();

    // Use MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(() => {
      updatePositions();
    });

    // Observe changes to the entire document
    observer.observe(document.body, { childList: true, subtree: true });

    // Event listeners for resize and click
    const handleWindowClick = () => {
      updatePositions();
    };

    window.addEventListener("click", handleWindowClick);
    window.addEventListener("resize", updatePositions);

    return () => {
      observer.disconnect();
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("resize", updatePositions);
    };
  }, [targetEl]);

  useLayoutEffect(() => {
    const updateInfoBoxPos = () => {
      if (infoIconPos.left + (infoBoxWidth + 5) < document.documentElement.clientWidth) {
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

  const handleInfoIconClick = (event) => {
    if (isOpen) {
      event.stopPropagation(); // Prevent event bubbling
    }
    setIsOpen((prevValue) => !prevValue);
  };

  if (!targetElementFound) {
    return null;
  }

  return (
    <Box ref={iconRef} zIndex={1000000000} sx={{ pointerEvents: "all" }}>
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
            <Typography id="info-box-title" variant="h6" sx={{ fontSize: "0.9rem" }}>
              {title}
            </Typography>
          )}
          <Typography id="info-box-body" variant="body2" sx={{ fontSize: "0.7rem" }}>
            {body}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default InfoIcon;
