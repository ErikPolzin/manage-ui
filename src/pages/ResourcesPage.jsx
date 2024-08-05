import { Box, Button, CssBaseline, Switch, Typography } from "@mui/material";
import React, { useState } from "react";

const ResourcesPage = ({ onStartTutorial, onChangeResourceCircle, resourceCircleEnabled }) => {
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
            onChange={onChangeResourceCircle}
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
          The Resource Circle is a small icon on your screen that provides some great extra features
          to help learn and understand the application and its functionalities. Some features
          include interactive guides, search tools, and help icons. Enable and disable it as you
          please, but this lightweight feature is always ready to help when you need.
        </Typography>
      </Box>
    </Box>
  );
};

export default ResourcesPage;
