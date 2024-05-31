import React from "react";
import { ListItem, ListItemText, ListItemIcon, IconButton, SvgIcon } from "@mui/material";
import { Info, Warning, Error, CheckCircle, Close } from "@mui/icons-material";

const alertIconMap = {
  error: {
    icon: Error,
    color: "error"
  },
  warning: {
    icon: Warning,
    color: "warning"
  },
  info: {
    icon: Info,
    color: "default"
  },
  success: {
    icon: CheckCircle,
    color: "success"
  }
};

function AlertItem({ alert }) {
  let alertIcon = alertIconMap[alert.type];

  function createdTime() {
    let d = new Date(alert.created_time);
    return d.toLocaleTimeString();
  }

  return (
    <ListItem>
      <ListItemIcon><SvgIcon component={alertIcon.icon} color={alertIcon.color}></SvgIcon></ListItemIcon>
      <ListItemText primary={alert.text} secondary={createdTime()} />
      <IconButton sx={{ mx: "4px" }}>
        <Close />
      </IconButton>
    </ListItem>
  );
}

export default AlertItem;
