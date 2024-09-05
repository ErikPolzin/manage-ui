import { CssBaseline, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";

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
  const [hasScrollableParents, setHasScrollableParents] = useState(false);
  const [visible, setVisible] = useState(true);

  const [clickedElement, setClickedElement] = useState(null); // used to call use effect on every window click
  const fullIconRef = useRef(null);
  const iconRef = useRef(null);
  const scrollableParents = useRef([]);

  // Close menu when a click outside occurs
  useEffect(() => {
    const handleWindowClick = (event) => {
      setClickedElement(event);
    };

    const closeMenu = () => {
      if (
        isOpen &&
        fullIconRef.current &&
        clickedElement &&
        !fullIconRef.current.contains(clickedElement.target)
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

  // Find scrollable parents of the target element
  const findScrollableParents = (element) => {
    const scrollableParentsList = [];
    while (element) {
      const style = window.getComputedStyle(element);
      if (/(scroll|auto)/.test(style.overflow + style.overflowY + style.overflowX)) {
        scrollableParentsList.push(element);
      }
      element = element.parentElement;
    }
    return scrollableParentsList;
  };

  // Is the target element out of visible sight to the user
  const hiddenByScrollableContainer = (targetElement) => {
    let rect = targetElement.getBoundingClientRect();
    let containerElement = targetElement.parentElement;

    while (containerElement) {
      const style = window.getComputedStyle(containerElement);

      if (/(scroll|auto)/.test(style.overflow + style.overflowY + style.overflowX)) {
        const containerRect = containerElement.getBoundingClientRect();
        // if the element is within the visible area of the container, continue to verify visibility in the rest of its ancestors
        if (
          rect.top >= containerRect.top &&
          rect.top + infoIconSize / 2 <= containerRect.bottom &&
          rect.right - infoIconSize / 2 >= containerRect.left &&
          rect.right <= containerRect.right
        ) {
        }
        // If not visible, immediately set visible to false
        else {
          return false;
        }
      }
      containerElement = containerElement.parentElement; // Move up to the parent element
    }
    return true; // Visible in all its parent containers
  };

  // Is the target element (or any of its parents) positioned fixed
  const hasFixedPosition = (element) => {
    while (element) {
      const style = window.getComputedStyle(element);
      if (style.position === "fixed") {
        return true;
      }
      element = element.parentElement; // Move up to the parent element
    }
    return false; // No fixed position parents found
  };

  // Icon positioning logic
  const updatePositions = (targetElement, hasFixedPos) => {
    const rect = targetElement.getBoundingClientRect();

    // Position the icon
    let iconLeft;
    let iconTop;

    // If fixed positioning, do not use window.scroll for positioning
    if (hasFixedPos) {
      iconLeft =
        rect.left + rect.width - infoIconSize > document.documentElement.scrollWidth
          ? rect.left + rect.width - infoIconSize
          : rect.left + rect.width - infoIconSize / 2;
      iconTop = rect.top - infoIconSize / 2;
    } else {
      iconLeft =
        rect.left + window.scrollX + rect.width - infoIconSize >
        document.documentElement.scrollWidth
          ? rect.left + window.scrollX + rect.width - infoIconSize
          : rect.left + window.scrollX + rect.width - infoIconSize / 2;
      iconTop = rect.top + window.scrollY - infoIconSize / 2;
    }

    // Position the popup box
    let popupLeft;
    let popupTop;

    if (iconLeft + (infoBoxWidth + 5) < document.documentElement.clientWidth) {
      popupLeft = iconLeft + infoIconSize + 5;
      popupTop = iconTop;
    } else {
      popupLeft = iconLeft - (infoBoxWidth + 5);
      popupTop = iconTop + infoIconSize + 5;
    }

    // Only update position and visibility if it has changed
    if (iconRef.current) {
      if (
        Math.round(iconLeft) !== iconRef.current.offsetLeft ||
        Math.round(iconTop) !== iconRef.current.offsetTop
      ) {
        setInfoIconPos({
          left: iconLeft,
          top: iconTop,
        });
        setInfoBoxPos({
          left: popupLeft,
          top: popupTop,
        });
        setVisible(hiddenByScrollableContainer(targetElement));
      }
    }
  };

  // Logic for when to update icon positions
  useEffect(() => {
    const handleUpdateInfoIcon = () => {
      const targetElement = document.getElementById(targetEl);

      // If target element not found
      if (!targetElement) {
        setTargetElementFound(false); // Will not render target element
        // Reset position
        setInfoIconPos({
          top: document.documentElement.clientHeight + window.scrollY - infoIconSize,
          left: document.documentElement.clientWidth + window.scrollX - infoIconSize,
        });
        return;
      }

      // If target element found
      setTargetElementFound(true);

      const hasFixedPos = hasFixedPosition(targetElement);
      setAttachedTofixedElement(hasFixedPos);

      // Add event listeners to each scrollable parent of the target element
      scrollableParents.current = findScrollableParents(targetElement);
      setHasScrollableParents(scrollableParents.current.length !== 0);
      scrollableParents.current.forEach((parent) =>
        parent.addEventListener("scroll", () => updatePositions(targetElement, hasFixedPos)),
      );

      updatePositions(targetElement, hasFixedPos);
    };

    // Use MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(() => {
      handleUpdateInfoIcon();
    });

    // Observe changes to the entire document
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("click", handleUpdateInfoIcon);
    window.addEventListener("resize", handleUpdateInfoIcon);

    return () => {
      observer.disconnect();

      scrollableParents.current.forEach((parent) =>
        parent.removeEventListener("scroll", updatePositions),
      );

      window.removeEventListener("click", handleUpdateInfoIcon);
      window.removeEventListener("resize", handleUpdateInfoIcon);
    };
  }, [targetEl]);

  // Clicking on an info icon
  const handleInfoIconClick = (event) => {
    if (isOpen) {
      event.stopPropagation(); // Prevent event bubbling
    }
    setIsOpen((prevValue) => !prevValue);
  };

  if (targetElementFound) {
    return (
      <Box ref={fullIconRef} zIndex={999999999} sx={{ pointerEvents: "all" }}>
        <CssBaseline />
        <Box
          zIndex={999999999}
          id="info-icon"
          data-testid="info-icon"
          onClick={handleInfoIconClick}
          ref={iconRef}
          sx={{
            position: attachedTofixedElement ? "fixed" : "absolute",
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
            transition: hasScrollableParents
              ? `none`
              : `top ${transitionTime}s ${delayTime}s ease-out, left ${transitionTime}s ${delayTime}s ease-out`,
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? "all" : "none",
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
  }
};

export default InfoIcon;
