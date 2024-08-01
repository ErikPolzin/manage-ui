import { Box, Button, CssBaseline, Typography } from "@mui/material";
import React from "react";

const ResourcesPage = ({ onActivate }) => {
  return (
    <Box sx={{ padding: 4 }}>
      <CssBaseline></CssBaseline>
      <Typography variant="h4" sx={{ marginBottom: "15px" }}>
        Resources
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: "5px" }}>
        Interactive Tutorial Walkthrough
      </Typography>
      <Typography variant="body" sx={{ display: "block", marginBottom: "10px" }}>
        This interactive tutorial will walk you step-by-step through the application, helping you to
        gain a clear understanding of how it works. There are 5 different stages to this tutorial,
        each of them ending with an optional test to help solidify the knowledge you gained.
      </Typography>
      <Button
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
