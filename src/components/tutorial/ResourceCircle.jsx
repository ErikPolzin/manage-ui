import {
  Button,
  CssBaseline,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ExploreIcon from "@mui/icons-material/Explore";
import SearchIcon from "@mui/icons-material/Search";
import HelpIcon from "@mui/icons-material/Help";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InteractiveGuideCard from "./InteractiveGuideCard";
import InteractiveGuide from "./InteractiveGuide";
import InfoIcon from "./InfoIcon";
import { BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";
import { usePersistantState } from "./hooks";
import DocumentationRenderer from "./DocumentationMarkdownRenderer";
import SearchResults from "./SearchResults";

const ResourceCircle = ({
  circleIconName,
  positionX = "right",
  positionY = "bottom",
  circleSize = 60,
  circleDistFromOuter = 20,
  circleBorder = "none",
  guides,
  infoIcons,
  documentationData,
  openDocumentation,
}) => {
  positionX = positionX !== "right" && positionX !== "left" ? "left" : positionX;
  positionY = positionY !== "top" && positionY !== "bottom" ? "top" : positionY;
  const circlePosition = {
    left: positionX === "left" ? circleDistFromOuter : "auto",
    top: positionY === "top" ? circleDistFromOuter : "auto",
    right: positionX === "right" ? circleDistFromOuter : "auto",
    bottom: positionY === "bottom" ? circleDistFromOuter : "auto",
  };
  const circleMenuHeight = circleSize * 0.85;
  const [circleMenuWidth, setCircleMenuWidth] = useState(500);
  const popupBoxPosition = {
    left: positionX === "left" ? circleDistFromOuter : "auto",
    top: positionY === "top" ? circleDistFromOuter + circleSize : "auto",
    right: positionX === "right" ? circleDistFromOuter : "auto",
    bottom: positionY === "bottom" ? circleDistFromOuter + circleSize : "auto",
  };
  const popupBoxHeight = 300;

  const [isOpen, setIsOpen] = useState(false);
  const [interactiveGuidesMenuOpen, setInteractiveGuidesMenuOpen] = useState(true);
  const [searchToolMenuOpen, setSearchToolMenuOpen] = useState(false);
  const [helpIconsMenuOpen, setHelpIconsMenuOpen] = useState(false);

  const [interactiveGuides, setInteractiveGuides] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [focusDocumentation, setFocusDocumentation] = useState(null);

  const circleMenuRef = useRef(null);

  const [helpIconsEnabled, setHelpIconsEnabled] = usePersistantState("helpIconsEnabled", false);
  const [guideActive, setGuideActive] = useState({
    active: false,
    guide: null,
  });

  const { pathname: currentPath } = useLocation(); // Destructure pathname from useLocation
  const navigate = useNavigate();

  // Interactive guides start on a particular page
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

  // Are there guides on other pages
  const [isGuidesOnOtherPages, setIsGuidesOnOtherPage] = useState(false);
  useEffect(() => {
    setInteractiveGuides(guides);
    setIsGuidesOnOtherPage(guides.some((guide) => guide.starting_page !== currentPath));
  }, [guides]);

  // Get the width of the circle menu
  useLayoutEffect(() => {
    if (!circleMenuRef.current) {
      return;
    }

    const updateCircleMenuWidth = () => {
      if (!circleMenuRef.current) {
        return;
      }
      setCircleMenuWidth(circleMenuRef.current.offsetWidth);
    };
    updateCircleMenuWidth();
    window.addEventListener("resize", updateCircleMenuWidth);

    return () => {
      window.removeEventListener("resize", updateCircleMenuWidth);
    };
  }, []);

  const handleCircleMenuClick = (menuItem) => {
    if (menuItem === "interactive-guides") {
      setInteractiveGuidesMenuOpen(true);
      setSearchToolMenuOpen(false);
      setHelpIconsMenuOpen(false);
    } else if (menuItem === "search-tools") {
      setInteractiveGuidesMenuOpen(false);
      setSearchToolMenuOpen(true);
      setHelpIconsMenuOpen(false);
    } else if (menuItem === "help-icons") {
      setInteractiveGuidesMenuOpen(false);
      setSearchToolMenuOpen(false);
      setHelpIconsMenuOpen(true);
    }
  };

  const handleHelpIconChange = () => {
    setHelpIconsEnabled(!helpIconsEnabled);
  };

  const handleGuideSelection = (guide) => {
    //setIsOpen(false);
    navigateToPage(guide.tooltips[0].page);
    setGuideActive({ active: true, guide: guide });
  };

  const handleGuideExit = () => {
    setGuideActive({ active: false, guide: null });
  };

  const handleGuideComplete = () => {
    setGuideActive({ active: false, guide: null });
  };

  const handleDocSelection = (docPage) => {
    setFocusDocumentation(docPage);
  };

  const handleOpenDocPage = () => {
    setTimeout(() => {
      setTimeout(() => {
        if (openDocumentation) {
          openDocumentation();
        }
      }, 500);
      setTimeout(() => {
        const target2 = document.getElementById(focusDocumentation.pageId);
        if (target2) {
          target2.click();
        }
        setTimeout(() => {
          const target3 = document.getElementById(focusDocumentation.headingId);
          if (target3) {
            target3.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 500);
      }, 500);
    }, 0);
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
      {!guideActive.active && (
        <Box id="circle-resources" zIndex={1000000003} sx={{ pointerEvents: "all" }}>
          <Box
            id="circle"
            zIndex={1000000003}
            onClick={() => setIsOpen(true)}
            sx={{
              position: "fixed",
              top: `${circlePosition.top}${circlePosition.top !== "auto" ? "px" : ""}`,
              left: `${circlePosition.left}${circlePosition.left !== "auto" ? "px" : ""}`,
              bottom: `${circlePosition.bottom}${circlePosition.bottom !== "auto" ? "px" : ""}`,
              right: `${circlePosition.right}${circlePosition.right !== "auto" ? "px" : ""}`,
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              borderRadius: "50%",
              backgroundColor: "#3F15B1",
              cursor: "pointer",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              border: circleBorder,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: circleSize - 20,
              userSelect: "none",
            }}
          >
            {circleIconName && (
              <img
                alt=""
                src={circleIconName}
                style={{ width: "80%", height: "80%", maxWidth: "80%", maxHeight: "80%" }}
              ></img>
            )}
            {circleIconName ? "" : "?"}
            <Box
              id="circle-exit-overlay"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              sx={{
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.45)",
                cursor: isOpen ? "pointer" : "none",
                pointerEvents: isOpen ? "all" : "none",
                opacity: isOpen ? 1 : 0,
                transition: "opacity 0.3s ease-out",
                color: "white",
                "&:hover": { color: "#d6d6d6" },
              }}
            >
              <CloseIcon
                sx={{
                  padding: 0,
                  margin: 0,
                  transform: isOpen
                    ? "rotate(0deg)"
                    : `rotate(${
                        (circlePosition.left !== "auto" && circlePosition.top !== "auto") ||
                        (circlePosition.right !== "auto" && circlePosition.bottom !== "auto")
                          ? "-"
                          : ""
                      }45deg)`,
                  transition: "transform 0.3s ease-out",
                }}
              ></CloseIcon>
            </Box>
          </Box>
          <Box
            id="circle-menu-transparent-container"
            zIndex={1000000002}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "fixed",
              top: `${circlePosition.top + (circleSize - circleMenuHeight) / 2}${
                circlePosition.top !== "auto" ? "px" : ""
              }`,
              bottom: `${circlePosition.bottom + (circleSize - circleMenuHeight) / 2}${
                circlePosition.bottom !== "auto" ? "px" : ""
              }`,
              left: `${circlePosition.left + circleSize - circleMenuHeight / Math.PI}${
                circlePosition.left !== "auto" ? "px" : ""
              }`,
              right: `${circlePosition.right + circleSize - circleMenuHeight / Math.PI}${
                circlePosition.right !== "auto" ? "px" : ""
              }`,
              height: `${circleMenuHeight}px`,
              borderBottomLeftRadius: circlePosition.left !== "auto" ? "0" : "100px",
              borderTopLeftRadius: circlePosition.left !== "auto" ? "0" : "100px",
              borderBottomRightRadius: circlePosition.left !== "auto" ? "100px" : "0",
              borderTopRightRadius: circlePosition.left !== "auto" ? "100px" : "0",
              padding: "0",
              backgroundColor: "transparent",
              pointerEvents: "none",
              overflow: "hidden",
              boxShadow: isOpen ? "0 4px 8px 0 rgba(0, 0, 0, 0.2)" : "none",
              transition: isOpen ? "box-shadow 0.25s 0.3s ease-out" : "none",
            }}
          >
            <Box
              id="circle-menu"
              ref={circleMenuRef}
              zIndex={1000000003}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "left",
                position: "relative",
                left: positionX === "right" ? (isOpen ? 0 : "100%") : "auto",
                right: positionX === "left" ? (isOpen ? 0 : "100%") : "auto",
                transition: "left 0.3s ease-out, right 0.3s ease-out",
                height: `${circleMenuHeight}px`,
                borderBottomLeftRadius: circlePosition.left !== "auto" ? "0" : "100px",
                borderTopLeftRadius: circlePosition.left !== "auto" ? "0" : "100px",
                borderBottomRightRadius: circlePosition.left !== "auto" ? "100px" : "0",
                borderTopRightRadius: circlePosition.left !== "auto" ? "100px" : "0",
                padding: `${
                  positionX === "right"
                    ? `2px ${circleSize / Math.PI + 6}px 2px 2px`
                    : `2px 2px 2px ${circleSize / Math.PI + 6}px`
                }`,
                backgroundColor: "white",
                pointerEvents: isOpen ? "all" : "none",
                overflow: "hidden",
              }}
            >
              <Box
                id="menu-item-interactive-guides-container"
                onClick={() => handleCircleMenuClick("interactive-guides")}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  padding: "0 12px",
                  margin: "0 1px 0 0",
                  backgroundColor: interactiveGuidesMenuOpen ? "#DFD6FA" : "transparent",
                  borderRadius: "100px",
                  color: interactiveGuidesMenuOpen ? "#3F15B1" : "#262626",
                  border: interactiveGuidesMenuOpen ? "2px solid #3F15B1" : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                <IconButton
                  id="menu-item-interactive-guides"
                  size="small"
                  sx={{
                    color: interactiveGuidesMenuOpen ? "#3F15B1" : "#262626",
                    "&:hover": {
                      backgroundColor: interactiveGuidesMenuOpen ? "transparent" : "",
                    },
                  }}
                >
                  <ExploreIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box
                id="menu-item-search-tools-container"
                onClick={() => handleCircleMenuClick("search-tools")}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  padding: "0 12px",
                  margin: "0 1px 0 1px",
                  backgroundColor: searchToolMenuOpen ? "#DFD6FA" : "transparent",
                  borderRadius: "100px",
                  color: searchToolMenuOpen ? "#3F15B1" : "#262626",
                  border: searchToolMenuOpen ? "2px solid #3F15B1" : "2px solid transparent",
                  cursor: "pointer",
                  pointerEvents: isOpen ? "all" : "none",
                }}
              >
                <IconButton
                  id="menu-item-search-tools"
                  size="small"
                  sx={{
                    color: searchToolMenuOpen ? "#3F15B1" : "#262626",
                    "&:hover": {
                      backgroundColor: searchToolMenuOpen ? "transparent" : "",
                    },
                  }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box
                id="menu-item-help-icons-container"
                onClick={() => handleCircleMenuClick("help-icons")}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  padding: "0 12px",
                  margin: "0 0 0 1px",
                  backgroundColor: helpIconsMenuOpen ? "#DFD6FA" : "transparent",
                  borderRadius: "100px",
                  color: helpIconsMenuOpen ? "#3F15B1" : "#262626",
                  border: helpIconsMenuOpen ? "2px solid #3F15B1" : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                <IconButton
                  id="menu-item-help-icons"
                  size="small"
                  sx={{
                    color: helpIconsMenuOpen ? "#3F15B1" : "#262626",
                    "&:hover": {
                      backgroundColor: helpIconsMenuOpen ? "transparent" : "",
                    },
                  }}
                >
                  <HelpIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box
            id="popup-box-container"
            zIndex={1000000003}
            sx={{
              position: "fixed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bottom: isOpen ? popupBoxPosition.bottom + 10 : popupBoxPosition.bottom,
              top: isOpen ? popupBoxPosition.top + 10 : popupBoxPosition.top,
              left: popupBoxPosition.left,
              right: popupBoxPosition.right,
              height: `${popupBoxHeight}px`,
              width: circleMenuWidth + circleSize + 20,
              borderRadius: "10px",
              backgroundColor: "white",
              pointerEvents: isOpen ? "all" : "none",
              overflow: "hidden",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              opacity: isOpen ? 1 : 0,
              transition: isOpen
                ? "bottom 0.25s 0.25s ease-out, top 0.25s 0.25s ease-out, opacity 0.25s 0.25s ease-out"
                : "none",
            }}
          >
            <Box
              id="popup-box-interactive-guides"
              zIndex={1000000003}
              sx={{
                position: interactiveGuidesMenuOpen ? "relative" : "absolute",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                height: "100%",
                width: "100%",
                borderRadius: "10px",
                padding: "18px",
                backgroundColor: "white",
                pointerEvents: interactiveGuidesMenuOpen && isOpen ? "all" : "none",
                opacity: interactiveGuidesMenuOpen ? 1 : 0,
                transition: interactiveGuidesMenuOpen ? "opacity 0.3s ease-out" : "none",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#220B61",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginBottom: "5px",
                }}
              >
                Interactive Guides
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#7F7F7F",
                  fontSize: "0.7rem",
                  lineHeight: "1rem",
                  marginBottom: "10px",
                }}
              >
                Learn how to use this application step by step
              </Typography>
              <Box
                id="interactive-guides-container"
                zIndex={1000000003}
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                  height: "100%",
                  overflowY: "scroll",
                  paddingRight: "5px",
                  "&::-webkit-scrollbar": {
                    width: "5px", // width of the scrollbar
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1", // track color
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#E1E3E7", // thumb color
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555", // thumb color on hover
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "0",
                    right: "-10px", // Move scrollbar outside the box
                    width: "10px",
                    height: "100%",
                    backgroundColor: "#f1f1f1",
                    borderRadius: "10px",
                    zIndex: 1,
                  },
                }}
              >
                {interactiveGuides.reduce((acc, guide) => {
                  if (guide.starting_page === currentPath) {
                    acc.push(
                      <Box
                        key={guide.name}
                        onClick={() => handleGuideSelection(guide)}
                        sx={{
                          position: "relative",
                          width: "100%",
                          marginBottom: "15px",
                        }}
                      >
                        <InteractiveGuideCard
                          guideNo={acc.length + 1} // Sequential index
                          guideName={guide.name}
                          progress={0}
                        />
                      </Box>,
                    );
                  }
                  return acc;
                }, [])}
                {isGuidesOnOtherPages && (
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#cccccc",
                        fontSize: "0.65rem",
                        lineHeight: "1rem",
                        margin: "10px 0 5px 0",
                      }}
                    >
                      Guides on other pages
                    </Typography>
                    {interactiveGuides
                      .filter((guide) => guide.starting_page !== currentPath)
                      .map((guide, index) => (
                        <Box
                          key={index}
                          onClick={() => handleGuideSelection(guide)}
                          sx={{
                            position: "relative",
                            width: "100%",
                            marginBottom: "15px",
                          }}
                        >
                          <InteractiveGuideCard
                            guideNo={index + 1}
                            guideName={guide.name}
                            progress={0}
                          />
                        </Box>
                      ))}
                  </>
                )}
              </Box>
            </Box>
            <Box
              id="popup-box-search-tools"
              sx={{
                position: searchToolMenuOpen ? "relative" : "absolute",
                height: "100%",
                width: "100%",
                borderRadius: "10px",
                padding: "18px",
                backgroundColor: "white",
                pointerEvents: searchToolMenuOpen && isOpen ? "all" : "none",
                opacity: searchToolMenuOpen ? 1 : 0,
                transition: searchToolMenuOpen ? "opacity 0.3s ease-out" : "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                id="popup-box-search-tools-top-components-container"
                sx={{ flexShrink: 0, backgroundColor: "white" }}
              >
                <TextField
                  id="search-input-field"
                  label="Search documentation and guides"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  variant="standard"
                  fullWidth
                  onChange={(value) => {
                    setSearchValue(value.target.value);
                  }}
                  value={searchValue}
                />
              </Box>

              <Box
                id="search-results-container"
                sx={{
                  flexGrow: 1,
                  width: "100%",
                  backgroundColor: "white",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  "&::-webkit-scrollbar": {
                    width: "5px", // width of the scrollbar
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1", // track color
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#E1E3E7", // thumb color
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555", // thumb color on hover
                  },
                }}
              >
                <SearchResults
                  searchValue={searchValue}
                  guidesData={interactiveGuides}
                  handleGuideSelect={handleGuideSelection}
                  documentationData={documentationData}
                  setFocusDocumentation={setFocusDocumentation}
                ></SearchResults>
              </Box>
              <Box
                id="popup-box-search-tools-documentation-container"
                sx={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  top: 0,
                  left:
                    searchToolMenuOpen && focusDocumentation
                      ? 0
                      : circleMenuWidth + circleSize + 20,
                  borderRadius: "10px",
                  padding: "18px",
                  backgroundColor: "white",
                  pointerEvents:
                    searchToolMenuOpen && isOpen && focusDocumentation ? "all" : "none",
                  opacity: searchToolMenuOpen ? 1 : 0,
                  transition: "left 0.3s ease-out",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  id="search-tools-documentation-back-button"
                  sx={{
                    flexShrink: 0,
                    width: "100%",
                    backgroundColor: "white",
                    color: "#3F15B1",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <ArrowBackIcon
                    onClick={() => {
                      handleDocSelection(null);
                    }}
                    sx={{
                      fontSize: "large",
                      color: "#3F15B1",
                      cursor: "pointer",
                      "&:hover": { color: "#31119F" },
                    }}
                  />
                </Box>
                <Box
                  id="search-tools-documentation-content"
                  sx={{
                    flexGrow: 1,
                    width: "100%",
                    backgroundColor: "white",
                    overflowY: "scroll",
                    overflowX: "hidden",
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
                  {isOpen && searchToolMenuOpen && focusDocumentation && (
                    <DocumentationRenderer
                      text={focusDocumentation.content}
                    ></DocumentationRenderer>
                  )}
                </Box>
                <Box
                  id="search-tools-documentation-full-docs"
                  sx={{
                    flexShrink: 0,
                    width: "100%",
                    backgroundColor: "white",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    id="open-full-docs-button"
                    variant="text"
                    size="small"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: "small" }} />}
                    onClick={() => {
                      handleOpenDocPage();
                      setIsOpen(false);
                    }}
                    sx={{ marginLeft: "auto" }}
                  >
                    Open full docs
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box
              id="popup-box-help-icons"
              sx={{
                position: helpIconsMenuOpen ? "relative" : "absolute",
                height: "100%",
                width: "100%",
                borderRadius: "10px",
                padding: "18px",
                backgroundColor: "white",
                pointerEvents: helpIconsMenuOpen && isOpen ? "all" : "none",
                opacity: helpIconsMenuOpen ? 1 : 0,
                transition: helpIconsMenuOpen ? "opacity 0.3s ease-out" : "none",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#220B61",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginBottom: "5px",
                }}
              >
                Help Icons
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#7F7F7F",
                  fontSize: "0.7rem",
                  lineHeight: "1rem",
                }}
              >
                Help icons provide details about different features and elements. Click on them for
                more information and insight into the application's functionality.
              </Typography>
              <Switch
                checked={helpIconsEnabled}
                onChange={handleHelpIconChange}
                size="large"
                sx={{
                  position: "absolute",
                  bottom: 10,
                  "& .Mui-checked": {
                    color: "#3F15B1", // switch thumb
                  },
                  "& .Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#3F15B1", // switch track
                  },
                }}
              ></Switch>
            </Box>
          </Box>
        </Box>
      )}
      {!guideActive.active &&
        infoIcons.map((infoIcon, index) => {
          return (
            <InfoIcon
              targetEl={helpIconsEnabled ? infoIcon.target_element_id : "acegikmoqsuwyz"}
              title={infoIcon.title}
              body={infoIcon.body}
            ></InfoIcon>
          );
        })}
      {guideActive.active && (
        <InteractiveGuide
          guide={guideActive.guide}
          onExit={handleGuideExit}
          onComplete={handleGuideComplete}
        ></InteractiveGuide>
      )}
    </Box>
  );
};

export default ResourceCircle;
