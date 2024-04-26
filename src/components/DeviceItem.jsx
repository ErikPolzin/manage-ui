import React from "react";
import { ListItem, ListItemText, ListItemIcon, IconButton, CardContent, Card } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import apIcon from "../images/wifi.png";
import switchIcon from "../images/hub.png";
import firewallIcon from "../images/firewall.png";
import localServerIcon from "../images/local_server.png";
import globalServerIcon from "../images/cloud_server.png";
import dnsIcon from "../images/dns.png";

const deviceIconMap = {
  access_point: apIcon,
  switch: switchIcon,
  firewall: firewallIcon,
  local_server: localServerIcon,
  global_server: globalServerIcon,
  dns_server: dnsIcon,
};

function DeviceItem({ device, onDelete, onEdit }) {
  let deviceIcon = deviceIconMap[device.device_type] || switchIcon;
  return (
    <Card
      sx={{
        margin: 2,
        maxWidth: 600,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <ListItem>
          <ListItemIcon
          >
            <img
              src={deviceIcon}
              alt={device.device_type}
              style={{ width: "48px", height: "48px" }}
            />
          </ListItemIcon>
          <ListItemText primary={device.name} secondary={device.ip_address} />
          <IconButton
            onClick={() => onEdit(device)}
            aria-label="edit"
            sx={{ mx: "4px" }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => onDelete(device)}
            color="error"
            sx={{ mx: "4px" }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItem>
      </CardContent>
    </Card>
  );
}

export default DeviceItem;
