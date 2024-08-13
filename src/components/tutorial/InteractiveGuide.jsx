import React, { useState } from "react";
import Tooltip from "./Tooltip";
import { BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";

const InteractiveGuide = ({ guide, onExit, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipChanging, setTooltipChanging] = useState(true);
  const [walkthroughActive, setWalkthroughActive] = useState(true);

  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation(); // Destructure pathname from useLocation

  const navigateToPage = (targetPage) => {
    if (navigate) {
      // Only navigate if the target page is different from the current path
      if (currentPath !== targetPage) {
        navigate(targetPage);
      }
    } else {
      console.warn(
        "Navigate function is not available. Are you sure you wrapped your <Tutorial> component in a <Router> component?",
      );
    }
  };

  const nextStep = () => {
    const tooltips = guide.tooltips;
    if (currentStep < tooltips.length - 1) {
      // Move to next tooltip
      navigateToPage(guide.tooltips[currentStep + 1].page);
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      // Guide completed
      console.log("Guide completed!");
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      navigateToPage(guide.tooltips[currentStep - 1].page);
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
  );
};

export default InteractiveGuide;
