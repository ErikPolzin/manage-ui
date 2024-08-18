import React from "react";
import { Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExploreIcon from "@mui/icons-material/Explore";

const searchGuides = (searchValue, guidesData) => {
  const results = [];
  if (searchValue === "") {
    return;
  }

  // Search through guide names for matches
  guidesData.forEach((guide) => {
    if (guide.name.toLowerCase().includes(searchValue.toLowerCase())) {
      results.push(guide);
    }
  });

  return results;
};

const searchDocumentation = (searchValue, documentationData) => {
  const results = [];
  if (searchValue === "") {
    return;
  }

  documentationData.forEach((page) => {
    const { pageName, pageId, content } = page;

    // Regex to match all heading elements
    const regex = /\$(pageHeading|heading1|heading2|heading3)\{([^}]*)\}\{([^}]*)\}/g;

    let match;
    let bodyMatch;

    // Search through content only for headings to match search value
    while ((match = regex.exec(content)) !== null) {
      const [fullMatch, headingType, headingId, headingName] = match;

      if (headingName.toLowerCase().includes(searchValue.toLowerCase())) {
        // Find the $body element that is soonest after the found heading
        const bodyRegex = /\$body1\{([^}]*)\}\{([^}]*)\}|\$body2\{([^}]*)\}\{([^}]*)\}/g;
        bodyMatch = bodyRegex.exec(content.slice(regex.lastIndex));

        results.push({
          pageName: pageName,
          pageId: pageId,
          headingName: headingName,
          headingId: headingId,
          content: fullMatch + (bodyMatch ? bodyMatch[0] : ""),
        });
      }
    }
  });

  return results;
};

const SearchResults = ({
  searchValue,
  guidesData,
  handleGuideSelect,
  documentationData,
  setFocusDocumentation,
}) => {
  const docResults = searchDocumentation(searchValue, documentationData);
  const guideResults = searchGuides(searchValue, guidesData);

  return (
    <Box>
      {guideResults &&
        guideResults.map((guide) => {
          return (
            <Box
              onClick={() => handleGuideSelect(guide)}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                margin: "5px 0",
                padding: "5px 0",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  transition: "background-color 0.3s ease",
                },
              }}
            >
              <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                <ExploreIcon
                  sx={{
                    fontSize: "large",
                    marginRight: "8px",
                    cursor: "pointer",
                    color: "grey",
                    "&:hover": { color: "#31119F" },
                  }}
                ></ExploreIcon>
                <Box
                  key={`${guide.page}-${guide.name}`}
                  sx={{
                    textTransform: "none",
                    color: "grey",
                    textAlign: "left",
                    userSelect: "none",
                  }}
                >
                  {`${guide.name}`}
                </Box>
              </Box>
              <ArrowForwardIcon
                sx={{
                  flexShrink: 0,
                  fontSize: "medium",
                  marginRight: "5px",
                  color: "#3F15B1",
                  cursor: "pointer",
                  "&:hover": { color: "#31119F" },
                }}
              ></ArrowForwardIcon>
            </Box>
          );
        })}
      {docResults &&
        docResults.map((result) => {
          return (
            <Box
              onClick={() => setFocusDocumentation(result)}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                margin: "5px 0",
                padding: "5px 0",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  transition: "background-color 0.3s ease",
                },
              }}
            >
              <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                <InsertDriveFileIcon
                  sx={{
                    fontSize: "large",
                    marginRight: "8px",
                    cursor: "pointer",
                    color: "grey",
                    "&:hover": { color: "#31119F" },
                  }}
                ></InsertDriveFileIcon>
                <Box
                  key={`${result.pageId}-${result.headingId}`}
                  sx={{
                    textTransform: "none",
                    color: "grey",
                    textAlign: "left",
                    userSelect: "none",
                  }}
                >
                  {`${result.headingName}`}
                </Box>
              </Box>
              <ArrowForwardIcon
                sx={{
                  flexShrink: 0,
                  fontSize: "medium",
                  marginRight: "5px",
                  color: "#3F15B1",
                  cursor: "pointer",
                  "&:hover": { color: "#31119F" },
                }}
              ></ArrowForwardIcon>
            </Box>
          );
        })}
    </Box>
  );
};

export default SearchResults;
