import React, { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import { CssBaseline, Box } from "@mui/material";
import StageCompleteCard from "./StageCompleteTile";
import TutorialProgressTile from "./TutorialProgressTile";
import TutorialHeader from "./TutorialHeader";
import TooltipOverlay from "./TooltipOverlay";
import TestProgressTile from "./TestProgressTile";
import WalkthroughCompleteTile from "./WalkthroughCompleteTile";
import BasicBackgroundOverlay from "./BasicBackgroundOverlay";
import IntroTile1 from "./IntroTile1";
import IntroTile2 from "./IntroTile2";

// onActivte will handle the turning on and off of a tutorial
const Tutorial = ({ tutorialContent, onExit }) => {
  const tutorial = tutorialContent;
  const tutorialName = "iNethi Manager Tutorial";
  const [startingScreen1, setStartingScreen1] = useState(true);
  const [startingScreen2, setStartingScreen2] = useState(false);

  const [currentStage, setCurrentStage] = useState(0);

  const [walkthroughActive, setWalkthroughActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipChanging, setTooltipChanging] = useState(false);
  const [walkthroughCompleteIntermission, setWalkthroughCompleteIntermission] =
    useState(false);

  const [testActive, setTestActive] = useState(false);
  const [currentTask, setCurrentTask] = useState(0);
  const [taskChanging, setTaskChanging] = useState(false);

  const [stageCompleteIntermission1, setStageCompleteIntermission1] =
    useState(false);
  const [stageCompleteIntermission2, setStageCompleteIntermission2] =
    useState(false);

  const [scrollHeight, setScrollHeight] = useState(0); // used to fade component onto screen

  // Fade progress tile in smoothly
  useEffect(() => {
    const setHeight = () => {
      setScrollHeight(document.documentElement.scrollHeight);
    };

    setHeight();
    window.addEventListener("click", setHeight);
    return () => window.removeEventListener("click", setHeight);
  }, []);

  const nextStep = () => {
    const currentTooltips = tutorial[currentStage].tooltips;
    if (currentStep < currentTooltips.length - 1) {
      // Move to next tooltip
      setTooltipChanging(true);
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      if (currentStage < tutorial.length - 1) {
        // Stage complete - Move to test
        setWalkthroughActive(false);
        tutorial[currentStage].test.length > 0
          ? setWalkthroughCompleteIntermission(true)
          : setStageCompleteIntermission1(true);
      } else {
        // Tutorial completed
        console.log("Tutorial completed!");
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      // set timeout is delaying transition to next tooltip for effect
      setTimeout(() => {
        setCurrentStep((prevStep) => prevStep - 1);
      }, 500);
    }
    console.log("previous step called");
  };

  // helps to rerender tooltip for animating new tooltip appearing
  const handleTootlipChange = () => {
    setTimeout(() => {
      setTooltipChanging(false);
    }, 5);
  };

  const nextTestStep = () => {
    const currentTasks = tutorial[currentStage].test;

    if (currentTask < currentTasks.length - 1) {
      // All click elements complete - Move to next task
      setTaskChanging(true);
      setCurrentTask((prevTask) => prevTask + 1);
    } else {
      // Finished all tasks - Test and stage completed
      console.log("Test completed!");
      resetTest();
      setStageCompleteIntermission1(true);
    }
  };

  // helps to rerender test progress tile for animating when a task is completed
  const handleTaskChange = () => {
    setTimeout(() => {
      setTaskChanging(false);
    }, 5);
  };

  const handleStartScreen1Next = () => {
    setStartingScreen1(false);
    setStartingScreen2(true);
  };

  const handleStartScreen2Next = () => {
    setStartingScreen2(false);
    setWalkthroughActive(true);
  };

  const handleTakeTest = () => {
    setWalkthroughCompleteIntermission(false);
    setTestActive(true);
  };

  const handleRedoWalkthrough = () => {
    setWalkthroughCompleteIntermission(false);
    setCurrentStep(0);
    setWalkthroughActive(true);
  };

  const handleSkipTest = () => {
    setWalkthroughCompleteIntermission(false);
    resetTest();
    setStageCompleteIntermission2(true);
  };

  const handleStageContinue2 = () => {
    setStageCompleteIntermission2(false);
    setCurrentStep(0);
    setCurrentStage((prevStage) => prevStage + 1);
    setWalkthroughActive(true);
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
    setWalkthroughActive(true);
    // and then not updating the stage
  };

  const handleSkipStage = () => {
    setCurrentStage((prevStage) => prevStage + 1);
    setCurrentStep(0);
    // note tutorial progress tile is still showing
  };

  const handleSkipStageFromHeader = () => {
    setWalkthroughCompleteIntermission(false);
    setWalkthroughActive(false);
    resetTest();
    setCurrentStep(0);
    setStageCompleteIntermission2(true);
    // note tutorial progress tile is still showing
  };

  const resetTest = () => {
    setTestActive(false);
    setCurrentTask(0);
  };

  return (
    <Box
      zIndex={1000000000}
      sx={{
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        height: `${scrollHeight}px`,
        pointerEvents: "none",
      }}
    >
      <CssBaseline />

      <TutorialHeader
        tutorialName={tutorialName}
        stages={tutorial.map((stage) => stage.stageName)}
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
                logoSrc={"iNethiLogoWhite.png"}
                tutorialName={"CommuNethi"}
                description={
                  "This interactive tutorial will walk you through the application, helping you to gain a clear understanding of how it works."
                }
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
              logoSrc={"iNethiLogoWhite.png"}
              stages={tutorial.map((stage) => stage.stageName)}
              onNext={handleStartScreen2Next}
              onExit={handleExitTutorial}
            />
          }
        ></BasicBackgroundOverlay>
      )}

      {tooltipChanging && (
        <>
          {
            handleTootlipChange() // rerender tooltip for animation sake
          }
          <TooltipOverlay
            targetAreaEl={
              tutorial[currentStage].tooltips[currentStep].targetAreaElement
            }
          ></TooltipOverlay>
        </>
      )}
      {!tooltipChanging && walkthroughActive && (
        <>
          <TooltipOverlay
            targetAreaEl={
              tutorial[currentStage].tooltips[currentStep].targetAreaElement
            }
          ></TooltipOverlay>
          <Tooltip
            type={tutorial[currentStage].tooltips[currentStep].type}
            targetEl={
              tutorial[currentStage].tooltips[currentStep].targetElement
            }
            targetAreaEl={
              tutorial[currentStage].tooltips[currentStep].targetAreaElement
            }
            title={tutorial[currentStage].tooltips[currentStep].title}
            content={tutorial[currentStage].tooltips[currentStep].content}
            canGoBack={currentStep !== 0}
            onNext={nextStep}
            onBack={prevStep}
            tooltipNo={currentStep + 1}
            totalTooltips={tutorial[currentStage].tooltips.length}
          />
        </>
      )}

      {taskChanging && (
        <>
          {
            handleTaskChange() // rerender test progress tile for animation sake
          }
        </>
      )}
      {!taskChanging && testActive && (
        <TestProgressTile
          stageName={tutorial[currentStage].stageName}
          stageNo={currentStage}
          taskNames={tutorial[currentStage].test.map((task) => task.text)}
          currentTaskNo={currentTask}
          currentTask={tutorial[currentStage].test[currentTask]}
          onNext={nextTestStep}
          onExit={handleExitTutorial}
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
              stageName={tutorial[currentStage].stageName}
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
              stages={tutorial.map((stage) => stage.stageName)}
              nextStageNo={currentStage + 1}
              onExit={handleExitTutorial}
              onContinue={handleStageContinue2}
              onRedoStage={handleRedoStage}
              onSkipStage={handleSkipStage}
            />
          }
        ></BasicBackgroundOverlay>
      )}
    </Box>
  );
};

export default Tutorial;
