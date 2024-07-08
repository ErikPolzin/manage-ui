import React from "react";
import { Card, CardContent, Typography, Divider, Box, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MappedNodeCard = ({ node, handleCloseMarkerClick, id, onMoreDetailsClick }) => {
  return (
    <Card sx={{ width: 160, backgroundColor: "#1c1c1e", color: "white", p: "1px" }}>
      <CardContent id={id} sx={{ p: "10px", cursor: "default" }}>
        <Typography
          variant="overline"
          color={"#bababa"}
          display="inline"
          gutterBottom
          fontSize={`0.5rem`}
          my={"-2px"}
        >
          Access Point
        </Typography>
        <IconButton
          sx={{ float: "right", p: 0, color: "#b5b5b5" }}
          onClick={() => handleCloseMarkerClick(null)}
        >
          <CloseIcon sx={{ width: "1rem", height: "1rem" }} />
        </IconButton>
        <Typography variant="h4" fontSize={`1.5rem`} p={0} m={0}>
          {node.name}
        </Typography>
        <Typography
          variant="subtitle1"
          fontSize={`0.7rem`}
          sx={{ color: node.isOnline ? "green" : "red", mt: "-4px" }}
        >
          Status: {node.isOnline ? "online" : "offline"}
        </Typography>
        <Divider sx={{ my: 1, borderColor: "grey" }} />
        <Box>
          <Typography variant="body2" fontSize={`0.75rem`} color={"#f0f0f0"}>
            MAC: {node.mac}
          </Typography>
          <Typography variant="body2" fontSize={`0.75rem`} color={"#f0f0f0"}>
            Memory usage: {node.memoryUsage}
          </Typography>
          <Typography variant="body2" fontSize={`0.75rem`} color={"#f0f0f0"}>
            CPU usage: {node.cpuUsage}
          </Typography>
          <Typography variant="body2" fontSize={`0.75rem`} color={"#f0f0f0"}>
            Connected devices: {node.connectedDevices}
          </Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Link
            onClick={onMoreDetailsClick}
            underline="hover"
            sx={{
              color: "white",
              fontSize: "0.6rem",
              float: "right",
              color: "#bababa",
              cursor: "pointer",
            }}
          >
            More details `{">>"}`
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MappedNodeCard;
