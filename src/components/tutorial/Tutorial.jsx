import React, { useEffect, useRef, useState } from "react";
import Tooltip from "./Tooltip";
import { CssBaseline, Box } from "@mui/material";
import StageCompleteCard from "./StageCompleteTile";
import TutorialProgressTile from "./TutorialProgressTile";
import TestProgressTile from "./TestProgressTile";
import WalkthroughCompleteTile from "./WalkthroughCompleteTile";
import BasicBackgroundOverlay from "./BasicBackgroundOverlay";
import IntroTile1 from "./IntroTile1";
import IntroTile2 from "./IntroTile2";
import { BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";
import TutorialCompleteTile from "./TutorialCompleteTile";
import TutorialMenu from "./TutorialMenu";

const Tutorial = ({
  logoSrc,
  tutorialName = "iNethi Manager Tutorial",
  tutorialDescription,
  tutorialContent = [],
  onExit,
}) => {
  const tutorial = tutorialContent;
  const [startingScreen1, setStartingScreen1] = useState(true);
  const [startingScreen2, setStartingScreen2] = useState(false);

  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation(); // Destructure pathname from useLocation

  const [currentStage, setCurrentStage] = useState(0);

  const [walkthroughActive, setWalkthroughActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipChanging, setTooltipChanging] = useState(false);
  const [walkthroughCompleteIntermission, setWalkthroughCompleteIntermission] = useState(false);

  const [testActive, setTestActive] = useState(false);
  const [currentTask, setCurrentTask] = useState(0);
  const [taskChanging, setTaskChanging] = useState(false);

  const [stageCompleteIntermission1, setStageCompleteIntermission1] = useState(false);
  const [stageCompleteIntermission2, setStageCompleteIntermission2] = useState(false);

  const [tutorialComplete, setTutorialComplete] = useState(false);

  const navigateToPage = (targetPage) => {
    if (navigate) {
      // Only navigate if the target page is different from the current path
      if (currentPath !== targetPage) {
        navigate(targetPage);
      } else {
        //console.log("Already on the correct page:", currentPath);
      }
    } else {
      console.warn(
        "Navigate function is not available. Are you sure you wrapped your <Tutorial> component in a <Router> component?",
      );
    }
  };

  const nextStep = () => {
    const currentTooltips = tutorial[currentStage].tooltips;
    if (currentStep < currentTooltips.length - 1) {
      // Move to next tooltip
      navigateToPage(tutorial[currentStage].tooltips[currentStep + 1].page);
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      if (currentStage < tutorial.length - 1) {
        // Stage complete - Move to test
        setWalkthroughActive(false);
        tutorial[currentStage].test_tasks.length > 0
          ? setWalkthroughCompleteIntermission(true)
          : setStageCompleteIntermission1(true);
      } else {
        setWalkthroughActive(false);

        if (tutorial[currentStage].test_tasks.length > 0) {
          // if there is a test for your last stage
          setWalkthroughCompleteIntermission(true);
        } else {
          // Tutorial completed
          console.log("Tutorial completed!");
          resetTest();
          setTutorialComplete(true);
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      navigateToPage(tutorial[currentStage].tooltips[currentStep - 1].page);
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const nextTestStep = () => {
    const currentTasks = tutorial[currentStage].test_tasks;

    if (currentTask < currentTasks.length - 1) {
      // All click elements complete - Move to next task
      //setTaskChanging(true);
      setCurrentTask((prevTask) => prevTask + 1);
    } else {
      // Finished all tasks - Test and stage completed
      console.log("Test completed!");
      resetTest();
      if (currentStage < tutorial.length - 1) {
        // if not last test of last stage
        setStageCompleteIntermission1(true);
      } else {
        console.log("Tutorial completed!");
        setTutorialComplete(true);
      }
    }
  };

  const handleStartScreen1Next = () => {
    setStartingScreen1(false);
    setStartingScreen2(true);
  };

  const handleStartScreen2Next = () => {
    setStartingScreen2(false);
    setWalkthroughActive(true);
    navigateToPage(tutorial[currentStage].tooltips[0].page);
  };

  const handleTakeTest = () => {
    setWalkthroughCompleteIntermission(false);
    setTestActive(true);
  };

  const handleRedoWalkthrough = () => {
    setWalkthroughCompleteIntermission(false);
    setCurrentStep(0);
    setWalkthroughActive(true);
    navigateToPage(tutorial[currentStage].tooltips[0].page);
  };

  const handleSkipTest = () => {
    setWalkthroughCompleteIntermission(false);
    resetTest();
    if (currentStage < tutorial.length - 1) {
      setStageCompleteIntermission2(true);
    } else {
      setTutorialComplete(true);
    }
  };

  const handleStageContinue2 = () => {
    setStageCompleteIntermission2(false);
    setCurrentStep(0);
    setCurrentStage((prevStage) => prevStage + 1);
    setWalkthroughActive(true);
    navigateToPage(tutorial[currentStage].tooltips[0].page);
  };

  const handleStageContinue1 = () => {
    setStageCompleteIntermission1(false);
    setStageCompleteIntermission2(true);
  };

  const handleExitTutorial = () => {
    setStageCompleteIntermission1(false);
    setStageCompleteIntermission2(false);
    setCurrentStep(0);
    setCurrentStage(0);
    resetTest();
    onExit();
  };

  const handleRedoStage = () => {
    setStageCompleteIntermission2(false);
    setCurrentStep(0);
    resetTest();
    setTutorialComplete(false);
    setWalkthroughActive(true);
    navigateToPage(tutorial[currentStage].tooltips[0].page);

    // and then not updating the stage
  };

  const handleSkipStage = () => {
    if (currentStage + 1 >= tutorial.length - 1) {
      setStageCompleteIntermission2(false);
      setTutorialComplete(true);
    }
    setCurrentStage((prevStage) => prevStage + 1);
    setCurrentStep(0);
    // note tutorial progress tile is still showing
  };

  const handleSkipStageFromHeader = () => {
    setWalkthroughCompleteIntermission(false);
    setWalkthroughActive(false);
    resetTest();
    setCurrentStep(0);
    if (currentStage < tutorial.length - 1) {
      setStageCompleteIntermission2(true);
    } else {
      setTutorialComplete(true);
    }
  };

  const resetTest = () => {
    setTestActive(false);
    setCurrentTask(0);
  };

  const handleRestartTutorial = () => {
    setWalkthroughCompleteIntermission(false);
    setWalkthroughActive(false);
    resetTest();
    setCurrentStep(0);
    setCurrentStage(0);
    setTutorialComplete(false);
    setStartingScreen1(true);
  };

  return (
    <Box
      zIndex={1000000000}
      sx={{
        position: "absolute",
        top: "0px",
        left: "0px",
        pointerEvents: "none",
      }}
    >
      <CssBaseline />

      <TutorialMenu
        positionY="top"
        positionX="right"
        tutorialName={tutorialName}
        stages={tutorial.map((stage) => stage.name)}
        stageNo={currentStage}
        onExit={handleExitTutorial}
        onRedoStage={handleRedoStage}
        onSkipStage={handleSkipStageFromHeader}
      />

      {startingScreen1 && (
        <>
          {window.scrollTo({ top: 0, behavior: "smooth" })}
          <BasicBackgroundOverlay
            focusElement={
              <IntroTile1
                logoSrc={logoSrc}
                tutorialName={tutorialName}
                description={tutorialDescription}
                onNext={handleStartScreen1Next}
              />
            }
          ></BasicBackgroundOverlay>
        </>
      )}
      {startingScreen2 && (
        <BasicBackgroundOverlay
          focusElement={
            <IntroTile2
              logoSrc={logoSrc}
              stages={tutorial.map((stage) => stage.name)}
              onNext={handleStartScreen2Next}
              onExit={handleExitTutorial}
            />
          }
        ></BasicBackgroundOverlay>
      )}

      {walkthroughActive && (
        <Tooltip
          type={tutorial[currentStage].tooltips[currentStep].type}
          targetEl={tutorial[currentStage].tooltips[currentStep].target_element_id}
          targetAreaEl={tutorial[currentStage].tooltips[currentStep].target_area_element_id}
          title={tutorial[currentStage].tooltips[currentStep].title}
          content={tutorial[currentStage].tooltips[currentStep].content}
          canGoBack={currentStep !== 0}
          onNext={nextStep}
          onBack={prevStep}
          tooltipNo={currentStep + 1}
          totalTooltips={tutorial[currentStage].tooltips.length}
        />
      )}

      {testActive && (
        <TestProgressTile
          stageName={tutorial[currentStage].name}
          stageNo={currentStage}
          taskNames={tutorial[currentStage].test_tasks.map((task) => task.description)}
          currentTaskNo={currentTask}
          currentTask={tutorial[currentStage].test_tasks[currentTask]}
          onNext={nextTestStep}
          onSkipTest={handleSkipTest}
        ></TestProgressTile>
      )}

      {walkthroughCompleteIntermission && (
        <BasicBackgroundOverlay
          focusElement={
            <WalkthroughCompleteTile
              stageNo={currentStage + 1}
              onTakeTest={handleTakeTest}
              onRedoWalkthrough={handleRedoWalkthrough}
              onSkip={handleSkipTest}
            ></WalkthroughCompleteTile>
          }
        ></BasicBackgroundOverlay>
      )}

      {stageCompleteIntermission1 && (
        <BasicBackgroundOverlay
          focusElement={
            <StageCompleteCard
              stageNo={currentStage + 1}
              stageName={tutorial[currentStage].name}
              onContinue={handleStageContinue1}
            />
          }
        ></BasicBackgroundOverlay>
      )}
      {stageCompleteIntermission2 && (
        <BasicBackgroundOverlay
          focusElement={
            <TutorialProgressTile
              tutorialName={tutorialName}
              stages={tutorial.map((stage) => stage.name)}
              nextStageNo={currentStage + 1}
              onExit={handleExitTutorial}
              onContinue={handleStageContinue2}
              onRedoStage={handleRedoStage}
              onSkipStage={handleSkipStage}
            />
          }
        ></BasicBackgroundOverlay>
      )}

      {tutorialComplete && (
        <BasicBackgroundOverlay
          focusElement={
            <TutorialCompleteTile
              tutorialName={tutorialName}
              prevStageNo={currentStage + 1}
              prevStageName={tutorial[currentStage].name}
              onExit={handleExitTutorial}
              onRedoStage={handleRedoStage}
              onRestartTutorial={handleRestartTutorial}
            ></TutorialCompleteTile>
          }
        ></BasicBackgroundOverlay>
      )}
    </Box>
  );
};

export default Tutorial;
