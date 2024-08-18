import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import DocumentationRenderer from "./DocumentationRenderer";

const Documentation = ({ documentationData }) => {
  const [selectedPage, setSelectedPage] = useState(null);

  const handlePageSelection = (docPage) => {
    setSelectedPage(docPage);
  };

  return (
    <Box id="doc-container" sx={{ width: "100%", height: "100%", backgroundColor: "white" }}>
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
            //height: document.documentElement.clientHeight - containerPos.top - 85,
            height: "100%",
            padding: "0px",
            backgroundColor: "white",
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
              backgroundColor: "rgba(250, 250, 250, 0.5)",
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
            <DocumentationRenderer text={selectedPage.content}></DocumentationRenderer>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Documentation;
