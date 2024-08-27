import React, { useState } from "react";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import DocumentationMarkdownRenderer from "./DocumentationMarkdownRenderer";
import SearchResults from "./SearchResults";

const Documentation = ({ documentationData, isOpen, toggleIsOpen, canSlideOut = true }) => {
  const [selectedPage, setSelectedPage] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const toggleSlideOut = () => {
    toggleIsOpen();
  };

  const handlePageSelection = (docPage) => {
    setSelectedPage(docPage);
  };

  const handleSelectSearchResult = (focusDocumentation) => {
    setSearchValue("");
    setTimeout(() => {
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
    <Box zIndex={isOpen ? 1000000001 : 1000000000}>
      {/* Icon Button fixed to the right side of the screen */}
      <Box
        id={"documentation-slideout-button"}
        zIndex={isOpen ? 1000000001 : 1000000000}
        onClick={toggleSlideOut}
        sx={{
          position: "fixed",
          right: isOpen ? "96%" : "0",
          transition: "right 0.3s ease-in-out",
          top: "50%",
          transform: "translateY(-50%)",
          height: "50px",
          width: "30px",
          backgroundColor: "#3F15B1",
          color: "white",
          borderBottomLeftRadius: "10px",
          borderTopLeftRadius: "10px",
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: isOpen ? "-2px 0 5px rgba(0,0,0,0.5)" : "none",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#31119F",
          },
          opacity: canSlideOut ? 1 : 0,
          pointerEvents: canSlideOut ? "all" : "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <InsertDriveFileIcon size="extra-large" sx={{ fontSize: "extra-large" }} />
        {isOpen ? (
          <ArrowForwardIcon size="small" sx={{ fontSize: "small" }} />
        ) : (
          <ArrowBackIcon size="small" sx={{ fontSize: "small" }} />
        )}
      </Box>

      {/* Slide-out panel */}
      <Box
        id={"documentation-slideout"}
        zIndex={isOpen ? 1000000001 : 1000000000}
        sx={{
          position: "fixed",
          top: "50%",
          transform: "translateY(-50%)",
          right: 0,
          width: isOpen ? "96%" : "0",
          height: "95%",
          backgroundColor: "#F7F7F7",
          border: "0px solid black",
          borderBottomLeftRadius: "10px",
          borderTopLeftRadius: "10px",
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: isOpen ? "-2px 0 5px rgba(0,0,0,0.5)" : "none",
          transition: "width 0.3s ease-in-out",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Box
          id="top-documentation-heading"
          sx={{
            width: "100%",
            backgroundColor: "#3F15B1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CloseIcon
            size="extra-large"
            onClick={() => {
              toggleIsOpen();
            }}
            sx={{
              color: "white",
              fontSize: "extra-large",
              cursor: "pointer",
              "&:hover": {
                color: "grey",
              },
              margin: "5px 0 5px 5px",
            }}
          ></CloseIcon>
          <Typography
            variant="h6"
            sx={{ fontSize: "1rem", color: "white", fontWeight: "400", margin: "5px 15px 5px 0" }}
          >
            Documentation
          </Typography>
        </Box>
        <Box
          id="search-documentation-heading"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
            backgroundColor: "#333333",
          }}
        >
          <Typography variant="h4" sx={{ color: "white" }}>
            {selectedPage ? selectedPage.pageName : "Pages"}
          </Typography>
          <TextField
            id="search-input-field"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
            variant="outlined"
            onChange={(value) => {
              setSearchValue(value.target.value);
            }}
            value={searchValue}
            sx={{ backgroundColor: "white", borderRadius: "20px" }}
          />
        </Box>
        <Box
          id="search-results-container"
          zIndex={1000000001}
          sx={{
            position: "absolute",
            top: "100px",
            right: "15px",
            flexGrow: 1,
            width: "250px",
            height: "300px",
            padding: "16px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            opacity: searchValue ? 1 : 0,
            pointerEvents: searchValue ? "all" : "none",
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
            documentationData={selectedPage ? [{ ...selectedPage }] : documentationData}
            setFocusDocumentation={(focusDoc) => {
              handleSelectSearchResult(focusDoc);
            }}
          ></SearchResults>
        </Box>
        {/* Conditionally render the Documentation component */}
        <Box
          id="doc-component-container"
          sx={{
            width: "100%",
            height: "100%",
            padding: "20px",
            overflow: "hidden",
          }}
        >
          <Box
            id="doc-container"
            sx={{ width: "100%", height: "100%", backgroundColor: "#F7F7F7" }}
          >
            {!selectedPage && (
              <Box id="doc-main-page-container">
                {documentationData.map((docPage) => (
                  <Button
                    key={docPage.pageId}
                    id={docPage.pageId}
                    variant="outlined"
                    sx={{ display: "block", margin: "10px 0" }}
                    onClick={() => handlePageSelection(docPage)}
                  >
                    {docPage.pageName}
                  </Button>
                ))}
              </Box>
            )}
            {selectedPage && (
              <Box
                id={"documentation-page-container"}
                sx={{
                  position: "relative",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  padding: "0px",
                  backgroundColor: "#F7F7F7",
                  transition: "left 0.3s ease-in-out, opacity 0.3s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  id={"documentation-page-back-button-container"}
                  sx={{
                    flexShrink: 0,
                    position: "relative",
                    top: 0,
                    left: 0,
                    width: "100%",
                    backgroundColor: "#F7F7F7",
                    marginBottom: "5px",
                  }}
                >
                  {" "}
                  <Button
                    id="documentation-page-back-button"
                    variant="outlined"
                    onClick={() => {
                      handlePageSelection(null);
                    }}
                    sx={{ position: "relative", top: "-5px", left: "-5px" }}
                  >
                    Back
                  </Button>
                </Box>

                <Box
                  id="documentation-page-content"
                  sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    borderRadius: "10px",
                    padding: "15px",
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
                  <DocumentationMarkdownRenderer
                    text={selectedPage.content}
                  ></DocumentationMarkdownRenderer>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Documentation;
