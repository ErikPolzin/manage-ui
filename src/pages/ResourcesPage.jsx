import {
  Box,
  Button,
  CssBaseline,
  Switch,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DocumentationRenderer from "../components/tutorial/DocumentationRenderer";
import documentationData from "../tutorialData/documentationData";
import Documentation from "../components/tutorial/Documentation";

const ResourcesPage = ({
  onStartTutorial,
  toggleResourceCircle,
  resourceCircleEnabled,
  onCircleReposition,
  circlePos,
}) => {
  const [positionX, setPositionX] = useState(circlePos.positionX);
  const [positionY, setPositionY] = useState(circlePos.positionY);
  const [documentationOpen, setDocumentationOpen] = useState(false);

  const [containerPos, setContainerPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (documentationOpen && containerRef) {
      setContainerPos({
        top: containerRef.current.offsetTop,
        left: containerRef.current.offsetLeft,
      });
      console.log(containerRef.current.offsetTop, containerRef.current.offsetLeft);
    }
  }, [documentationOpen]);

  const handleSave = () => {
    onCircleReposition(positionY, positionX);
  };

  return (
    <Box
      id="resources-page"
      sx={{
        position: "relative",
        padding: "16px",
        backgroundColor: "white",
      }}
    >
      {!documentationOpen && (
        <Box>
          <CssBaseline id="resources-css-baseline"></CssBaseline>
          <Typography id="resources-title" variant="h4" sx={{ marginBottom: "15px" }}>
            Resources
          </Typography>
          <Typography id="resources-subtitle" variant="h6" sx={{ marginBottom: "5px" }}>
            Interactive Tutorial Walkthrough
          </Typography>
          <Typography
            id="resources-description"
            variant="body1"
            sx={{ display: "block", marginBottom: "10px" }}
          >
            This interactive tutorial will walk you step-by-step through the application, helping
            you to gain a clear understanding of how it works. There are 5 different stages to this
            tutorial, each of them ending with an optional test to help solidify the knowledge you
            gained.
          </Typography>
          <Button
            id="resources-start-tutorial-button"
            variant="contained"
            onClick={onStartTutorial}
            sx={{
              backgroundColor: "#3F15B1",
              "&:hover": { backgroundColor: "#31119F" },
            }}
          >
            Start Tutorial
          </Button>
          <Typography id="resources-subtitle" variant="h6" sx={{ margin: "20px 0 5px 0 " }}>
            Resource Circle
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                marginRight: "5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: `70px`,
                  height: `70px`,
                  borderRadius: "50%",
                  backgroundColor: resourceCircleEnabled ? "#3F15B1" : "#9E9E9E",
                  boxShadow: resourceCircleEnabled ? "0 4px 8px 0 rgba(0, 0, 0, 0.2)" : "none",
                  color: "white",
                  fontSize: "50px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ?
              </Box>
              <Switch
                checked={resourceCircleEnabled}
                onChange={toggleResourceCircle}
                size="large"
                sx={{
                  marginTop: "5px",
                  "& .Mui-checked": {
                    color: "#3F15B1", // switch thumb
                  },
                  "& .Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#3F15B1", // switch track
                  },
                }}
              ></Switch>
            </Box>
            <Typography id="resources-description" variant="body1" sx={{ marginLeft: "10px" }}>
              The Resource Circle is a small icon on your screen that provides some great extra
              features to help learn and understand the application and its functionalities. Some
              features include interactive guides, search tools, and help icons. Enable and disable
              it as you please, but this lightweight feature is always ready to help when you need.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "20px", margin: "20px 0 20px" }}>
            <FormControl>
              <InputLabel id="position-y-label" sx={{ backgroundColor: "white" }}>
                Vertical Position
              </InputLabel>
              <Select
                labelId="position-y-label"
                value={positionY}
                onChange={(e) => setPositionY(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="bottom">Bottom</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="position-x-label" sx={{ backgroundColor: "white" }}>
                Horizontal Position
              </InputLabel>
              <Select
                labelId="position-x-label"
                value={positionX}
                onChange={(e) => setPositionX(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={circlePos.positionX === positionX && circlePos.positionY === positionY}
              sx={{
                alignSelf: "flex-end",
                backgroundColor: "#3F15B1",
                "&:hover": { backgroundColor: "#31119F" },
              }}
            >
              Save Position
            </Button>
          </Box>
          <Box sx={{ marginTop: "20px" }}>
            <Typography
              id="documentation-subtitle"
              variant="h6"
              sx={{ marginBottom: "20px 0 5px 0" }}
            >
              Documentation
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "10px" }}>
              Get detailed information about the application and its features in the documentation
              section.
            </Typography>
            <Button
              id="open-documentation-button"
              variant="contained"
              size="small"
              endIcon={<ArrowForwardIcon fontSize="small" />}
              onClick={() => {
                setDocumentationOpen(true);
              }}
              sx={{
                backgroundColor: "#3F15B1",
                "&:hover": { backgroundColor: "#31119F" },
              }}
            >
              {"Open Documentation"}
            </Button>
          </Box>
        </Box>
      )}
      {/* {documentationData.map((docPage) => (
        <Button
          key={docPage.pageId}
          variant="outlined"
          sx={{ display: "block", margin: "10px 0" }}
          //onClick={() => handlePageSelection(docPage)}
        >
          {docPage.pageName}
        </Button>
      ))} */}
      {documentationOpen && (
        <Box
          ref={containerRef}
          sx={{
            position: "relative",
            top: 0,
            left: 0,
            width: "100%",
            height: document.documentElement.clientHeight - containerPos.top - 85,
            backgroundColor: "white",
          }}
        >
          <Documentation documentationData={documentationData}></Documentation>
        </Box>
      )}
      {documentationOpen && false && (
        <Box
          id={"documentation-page-container"}
          ref={containerRef}
          sx={{
            position: "relative",
            top: 0,
            left: documentationOpen ? 0 : -10,
            width: "100%",
            height: document.documentElement.clientHeight - containerPos.top - 85,
            padding: "0px",
            backgroundColor: "white",
            opacity: documentationOpen ? 1 : 0,
            transition: "left 0.3s ease-in-out, opacity 0.3s ease-in-out",
            pointerEvents: documentationOpen ? "all" : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Box
            id={"documentation-page-back-button-container"}
            sx={{
              position: "relative",
              top: 0,
              left: 0,
              width: "100%",
              backgroundColor: "rgba(250, 250, 250, 0.5)",
              marginBottom: "5px",
            }}
          >
            {" "}
            <Button
              id="documentation-page-back-button"
              variant="outlined"
              onClick={() => {
                setDocumentationOpen(false);
              }}
              sx={{ position: "relative", top: "-5px", left: "-5px" }}
            >
              Back
            </Button>
          </Box>

          <Box
            sx={{
              overflow: "auto",
              // border: "4px solid #3F15B1",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              "&::-webkit-scrollbar": {
                width: "10px", // width of the scrollbar
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1", // track color
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c6c8cc", // thumb color
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555", // thumb color on hover
              },
            }}
          >
            <DocumentationRenderer text={documentationData}></DocumentationRenderer>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ResourcesPage;
