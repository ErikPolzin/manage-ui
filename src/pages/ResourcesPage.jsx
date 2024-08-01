import { Box, Button, CssBaseline, Typography } from "@mui/material";
import React from "react";

const ResourcesPage = ({ onActivate }) => {
  return (
    <Box id="resources-page" sx={{ padding: 4 }}>
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
        This interactive tutorial will walk you step-by-step through the application, helping you to
        gain a clear understanding of how it works. There are 5 different stages to this tutorial,
        each of them ending with an optional test to help solidify the knowledge you gained.
      </Typography>
      <Button
        id="resources-start-tutorial-button"
        variant="contained"
        onClick={onActivate}
        sx={{
          backgroundColor: "#3F15B1",
          "&:hover": { backgroundColor: "#31119F" },
        }}
      >
        Start Tutorial
      </Button>
    </Box>
  );
};

export default ResourcesPage;
