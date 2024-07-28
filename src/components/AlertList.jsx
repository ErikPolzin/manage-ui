import React from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItem from "@mui/material/ListItem";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import { Info, Warning, Error, ExpandLess, ExpandMore } from "@mui/icons-material";

const alertIconMap = {
  3: {
    icon: Error,
    color: "error",
  },
  2: {
    icon: Warning,
    color: "warning",
  },
  1: {
    icon: Info,
    color: "default",
  },
};

function AlertItem({ alert, ...props }) {
  let alertIcon = alertIconMap[alert.level];

  const [open, setOpen] = React.useState(false);

  function createdTime() {
    let d = new Date(alert.created);
    return d.toLocaleTimeString();
  }

  return (
    <div {...props}>
      <ListItemButton onClick={() => setOpen(!open)} disabled={alert.resolved}>
        <ListItemIcon>
          <SvgIcon component={alertIcon.icon} color={alertIcon.color}></SvgIcon>
        </ListItemIcon>
        <ListItemText secondary={createdTime()} primary={alert.title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ListItem sx={{ backgroundColor: "#eeeeee" }}>
          <ListItemText primary={alert.text} />
        </ListItem>
      </Collapse>
    </div>
  );
}

function AlertList({ alerts, error }) {
  function alertsByDay(alerts) {
    let datesDict = {};
    let currentDay = null;
    for (let alert of alerts) {
      let day = new Date(alert.created);
      if (!currentDay || day.toDateString() !== currentDay.toDateString()) {
        currentDay = day;
        datesDict[currentDay] = [];
      }
      datesDict[currentDay].push(alert);
    }
    return datesDict;
  }

  return (
    <List dense>
      {Object.entries(alertsByDay(alerts || []))
        // Don't like this by JS seems to only do string keys
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .map(([day, alerts]) => {
          return (
            <List component="div" disablePadding key={day} dense>
              <ListItemText>
                <Typography variant="overline" display="block" gutterBottom>
                  {new Date(day).toDateString()}
                </Typography>
              </ListItemText>
              {alerts.map((alert) => (
                <AlertItem alert={alert} key={alert.id}></AlertItem>
              ))}
              <Divider />
            </List>
          );
        })}
      {}
    </List>
  );
}

export default AlertList;
