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
import React, { useState } from "react";

const ResourcesPage = ({
  onStartTutorial,
  toggleResourceCircle,
  resourceCircleEnabled,
  onCircleReposition,
  circlePos,
}) => {
  const [positionX, setPositionX] = useState(circlePos.positionX);
  const [positionY, setPositionY] = useState(circlePos.positionY);

  const handleSave = () => {
    onCircleReposition(positionY, positionX);
  };

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
          The Resource Circle is a small icon on your screen that provides some great extra features
          to help learn and understand the application and its functionalities. Some features
          include interactive guides, search tools, and help icons. Enable and disable it as you
          please, but this lightweight feature is always ready to help when you need.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: "20px", margin: "20px 0 0px" }}>
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
    </Box>
  );
};

export default ResourcesPage;
