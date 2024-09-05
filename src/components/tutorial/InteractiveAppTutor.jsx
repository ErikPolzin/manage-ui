import React, { useState, useEffect } from "react";
import axios from "axios";
import Tutorial from "./Tutorial";
import ResourceCircle from "./ResourceCircle";
import Documentation from "./Documentation";

const InteractiveAppTutor = ({
  tutorialActive = false,
  exitTutorial,
  tutorialLogoSrc = "",
  documentationOpen = false,
  toggleDocumentationOpen,
  documentationSideToolEnabled = false,
  resourceCircleEnabled = false,
  resourceCircleIconSrc = "",
  resourceCirclePos = {
    positionY: "bottom",
    positionX: "right",
  },
  resourceCircleSize = 60,
  resourceCircleDistFromOuter = 20,
  resourceCircleBorder = "none",
  openDocumentation,
}) => {
  // State for data fetched from APIs
  const [tutorialData, setTutorialData] = useState([]);
  const [infoIconsData, setInfoIconsData] = useState([]);
  const [guidesData, setGuidesData] = useState([]);
  const [documentationData, setDocumentationData] = useState([]);

  // API calls
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8085/api/tutorial/")
      .then((response) => {
        setTutorialData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the tutorial data!", error);
      });

    axios
      .get("http://127.0.0.1:8085/api/info-icons/")
      .then((response) => {
        setInfoIconsData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the info icons data!", error);
      });

    axios
      .get("http://127.0.0.1:8085/api/interactive-guides/")
      .then((response) => {
        setGuidesData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the interactive guides!", error);
      });

    axios
      .get("http://127.0.0.1:8085/api/documentation/")
      .then((response) => {
        setDocumentationData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the documentation!", error);
      });
  }, []);

  return (
    <>
      {tutorialActive && (
        <Tutorial logoSrc={tutorialLogoSrc} tutorialContent={tutorialData} onExit={exitTutorial} />
      )}

      <Documentation
        documentationData={documentationData}
        isOpen={documentationOpen}
        toggleIsOpen={toggleDocumentationOpen}
        canSlideOut={documentationSideToolEnabled}
      />

      {!tutorialActive && resourceCircleEnabled && (
        <ResourceCircle
          circleIconName={resourceCircleIconSrc}
          positionY={resourceCirclePos.positionY}
          positionX={resourceCirclePos.positionX}
          circleSize={resourceCircleSize}
          circleDistFromOuter={resourceCircleDistFromOuter}
          circleBorder={resourceCircleBorder}
          guides={guidesData}
          infoIcons={infoIconsData}
          documentationData={documentationData}
          openDocumentation={openDocumentation}
        />
      )}
    </>
  );
};

export default InteractiveAppTutor;
