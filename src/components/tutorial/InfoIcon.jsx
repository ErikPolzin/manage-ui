import { CssBaseline, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const InfoIcon = ({ targetEl, title, body }) => {
  const infoIconSize = 15;
  const infoBoxWidth = 150;
  const transitionTime = Math.random() * (0.8 - 0.2) + 0.2;
  const delayTime = Math.random() * 0.3;
  const [isOpen, setIsOpen] = useState(false);
  const [infoIconPos, setInfoIconPos] = useState({
    top: document.documentElement.clientHeight + window.scrollY - infoIconSize,
    left: document.documentElement.clientWidth + window.scrollX - infoIconSize,
  });
  const [infoBoxPos, setInfoBoxPos] = useState({ top: 0, left: 0 });
  const [targetElementFound, setTargetElementFound] = useState(false);
  const [attachedTofixedElement, setAttachedTofixedElement] = useState(false);
  const [visible, setVisible] = useState(true);

  const [clickedElement, setClickedElement] = useState(null); // used to call use effect on every window click
  const iconRef = useRef(null);

  // Refresh icon position at regular intervals
  const [refreshInterval, setRefreshInterval] = useState(new Date());
  const [refreshIntervalValue, setRefreshIntervalValue] = useState(500);

  // Set interval refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshInterval(new Date());
    }, refreshIntervalValue);

    return () => clearInterval(interval);
  }, []);

  // Update icon position on interval if attached to a fixed element
  useEffect(() => {
    if (attachedTofixedElement) {
      console.log("updating node");
      updatePositions();
    }
  }, [refreshInterval]);

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

    closeMenu();

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [clickedElement]);

  // Icon positioning and displaying logic
  const updatePositions = () => {
    const targetElement = document.querySelector(targetEl);
    if (!targetElement) {
      setTargetElementFound(false);
      setInfoIconPos({
        top: document.documentElement.clientHeight + window.scrollY - infoIconSize,
        left: document.documentElement.clientWidth + window.scrollX - infoIconSize,
      });
      return;
    }

    setTargetElementFound(true);
    const rect = targetElement.getBoundingClientRect();

    // Is the target element out of visible sight to the user
    const hiddenByScrollableContainer = (element) => {
      while (element) {
        const style = window.getComputedStyle(element);
        if (
          style.overflow === "scroll" ||
          style.overflow === "auto" ||
          style.overflowY === "scroll" ||
          style.overflowY === "auto" ||
          style.overflowX === "scroll" ||
          style.overflowX === "auto"
        ) {
          const containerRect = element.getBoundingClientRect();
          // if the element is within the visible area of the container, continue to verify visibility in the rest of its ancestors
          if (
            rect.top + infoIconSize / 2 > containerRect.top &&
            rect.top < containerRect.bottom &&
            rect.right - infoIconSize / 2 > containerRect.left &&
            rect.right + infoIconSize / 2 < containerRect.right
          ) {
          }
          // If not visible, immediately set visible to false
          else {
            return false;
          }
        }
        element = element.parentElement; // Move up to the parent element
      }
      return true; // Visible in all its parent containers
    };
    setVisible(hiddenByScrollableContainer(targetElement.parentElement));

    // Is the target element (or any of its parents) positioned fixed
    const hasFixedPosition = (element) => {
      while (element) {
        const style = window.getComputedStyle(element);
        if (style.position === "fixed") {
          return true;
        }
        element = element.parentElement; // Move up to the parent element
      }
      return false; // No fixed position found
    };

    const hasFixedPos = hasFixedPosition(targetElement);
    hasFixedPos ? setAttachedTofixedElement(true) : setAttachedTofixedElement(false);

    let left;
    if (hasFixedPos) {
      left =
        rect.left + rect.width - infoIconSize > document.documentElement.scrollWidth
          ? rect.left + rect.width - infoIconSize
          : rect.left + rect.width - infoIconSize / 2;
    } else {
      left =
        rect.left + window.scrollX + rect.width - infoIconSize >
        document.documentElement.scrollWidth
          ? rect.left + window.scrollX + rect.width - infoIconSize
          : rect.left + window.scrollX + rect.width - infoIconSize / 2;
    }

    setInfoIconPos({
      left: left,
      top: hasFixedPos ? rect.top - infoIconSize / 2 : rect.top + window.scrollY - infoIconSize / 2,
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
    if (!attachedTofixedElement) {
      window.addEventListener("scroll", updatePositions);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("resize", updatePositions);
      if (!attachedTofixedElement) {
        window.removeEventListener("scroll", updatePositions);
      }
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

  return (
    <Box ref={iconRef} zIndex={999999999} sx={{ pointerEvents: "all" }}>
      <CssBaseline />
      <Box
        zIndex={999999999}
        id="info-icon"
        onClick={handleInfoIconClick}
        sx={{
          position: !targetElementFound
            ? "absolute"
            : attachedTofixedElement
            ? "fixed"
            : "absolute",
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
          transition: attachedTofixedElement
            ? `top 0.3s 0s ease-out, left 0.3s 0s ease-out`
            : `top ${transitionTime}s ${delayTime}s ease-out, left ${transitionTime}s ${delayTime}s ease-out`,
          opacity: targetElementFound && visible ? 1 : 0,
          pointerEvents: targetElementFound && visible ? "all" : "none",
        }}
      >
        ?
      </Box>
      {isOpen && (
        <Box
          zIndex={999999999}
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
