import React from "react";
import { Card, CardContent, Typography, Divider, Box, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MappedNodeCard = ({ node, handleCloseMarkerClick, id, onMoreDetailsClick }) => {
  return (
    <Card sx={{ width: 160, p: "1px" }}>
      <CardContent id={id} sx={{ p: "10px", cursor: "default" }}>
        <Typography
          variant="overline"
          color="text.secondary"
          display="inline"
          gutterBottom
          fontSize={`0.5rem`}
          my={"-2px"}
        >
          Access Point
        </Typography>
        <IconButton sx={{ float: "right", p: 0 }} onClick={() => handleCloseMarkerClick(null)}>
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
        <Divider sx={{ my: 1 }} />
        <Box>
          <Typography variant="body2" fontSize={`0.75rem`}>
            MAC: {node.mac}
          </Typography>
          <Typography variant="body2" fontSize={`0.75rem`}>
            Memory usage: {node.memoryUsage}
          </Typography>
          <Typography variant="body2" fontSize={`0.75rem`}>
            CPU usage: {node.cpuUsage}
          </Typography>
          <Typography variant="body2" fontSize={`0.75rem`}>
            Connected devices: {node.connectedDevices}
          </Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Link
            onClick={onMoreDetailsClick}
            underline="hover"
            sx={{
              color: "text.disabled",
              fontSize: "0.6rem",
              float: "right",
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
