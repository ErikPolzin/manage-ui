import { CssBaseline } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import TooltipOverlay from "./TooltipOverlay";
import Tooltip from "./Tooltip";
import {
  BrowserRouter as Router,
  useNavigate,
  useLocation,
} from "react-router-dom";

const InteractiveGuide = ({ guide, onExit, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipChanging, setTooltipChanging] = useState(true);
  const [walkthroughActive, setWalkthroughActive] = useState(true);

  const [scrollHeight, setScrollHeight] = useState(
    document.documentElement.scrollHeight
  );
  const [scrollWidth, setScrollWidth] = useState(
    document.documentElement.scrollHeight
  );

  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation(); // Destructure pathname from useLocation

  // Get height and width of entire page (including scroll)
  useEffect(() => {
    const setPageDimensions = () => {
      setScrollHeight(document.documentElement.scrollHeight);
      setScrollWidth(document.documentElement.scrollWidth);
    };
    setPageDimensions();

    window.addEventListener("click", setPageDimensions);
    window.addEventListener("resize", setPageDimensions);

    return () => {
      window.removeEventListener("click", setPageDimensions);
      window.removeEventListener("resize", setPageDimensions);
    };
  }, []);

  const navigateToPage = () => {
    if (navigate) {
      const targetPage = guide.tooltips[currentStep].page;

      // Only navigate if the target page is different from the current path
      if (currentPath !== targetPage) {
        navigate(targetPage);
      } else {
        console.log("Already on the correct page:", currentPath);
      }
    } else {
      console.warn(
        "Navigate function is not available. Are you sure you wrapped your <Tutorial> component in a <Router> component?"
      );
    }
  };

  const nextStep = () => {
    const tooltips = guide.tooltips;
    if (currentStep < tooltips.length - 1) {
      // Move to next tooltip
      setTooltipChanging(true);
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      // Guide completed
      console.log("Guide completed!");
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setTooltipChanging(true);
      setCurrentStep((prevStep) => prevStep - 1);
    }
    console.log("previous step called");
  };

  // helps to rerender tooltip for animating new tooltip appearing
  const handleTootlipChange = () => {
    setTimeout(() => {
      navigateToPage();
      setTooltipChanging(false);
    }, 5);
  };

  return (
    <>
      <CssBaseline />
      {tooltipChanging && (
        <>
          {
            handleTootlipChange() // rerender tooltip for animation sake
          }
          <TooltipOverlay
            targetAreaEl={guide.tooltips[currentStep].targetAreaElement}
          ></TooltipOverlay>
        </>
      )}
      {!tooltipChanging && walkthroughActive && (
        <>
          <TooltipOverlay
            targetAreaEl={guide.tooltips[currentStep].targetAreaElement}
          ></TooltipOverlay>
          <Tooltip
            type={guide.tooltips[currentStep].type}
            targetEl={guide.tooltips[currentStep].targetElement}
            targetAreaEl={guide.tooltips[currentStep].targetAreaElement}
            title={guide.tooltips[currentStep].title}
            content={guide.tooltips[currentStep].content}
            onNext={nextStep}
            canGoBack={currentStep !== 0}
            onBack={prevStep}
            canExit={true}
            onExit={onExit}
            tooltipNo={currentStep + 1}
            totalTooltips={guide.tooltips.length}
          />
        </>
      )}
    </>
  );
};

export default InteractiveGuide;
