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
import {
  Info,
  Warning,
  Error,
  CheckCircle,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

const alertIconMap = {
  Critical: {
    icon: Error,
    color: "error",
  },
  Warning: {
    icon: Warning,
    color: "warning",
  },
  Decent: {
    icon: Info,
    color: "default",
  },
  OK: {
    icon: CheckCircle,
    color: "success",
  },
};

function AlertItem({ alert }) {
  let alertIcon = alertIconMap[alert.type];

  const [open, setOpen] = React.useState(false);

  function createdTime() {
    let d = new Date(alert.created);
    return d.toLocaleTimeString();
  }

  return (
    <div>
      <ListItemButton onClick={() => setOpen(!open)} disabled={alert.resolved}>
        <ListItemIcon>
          <SvgIcon component={alertIcon.icon} color={alertIcon.color}></SvgIcon>
        </ListItemIcon>
        <ListItemText secondary={createdTime()} primary={alert.type} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ListItem sx={{ backgroundColor: "#eeeeee" }}>
          <table>
            <tbody>
              {alert.text.split("\n").map((text) => (
                <tr key={text}>
                  <td style={{ fontWeight: "bold", textAlign: "right" }}>{text.split(":")[0]}</td>
                  <td>{text.split(":")[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <AlertItem key={alert.id} alert={alert}></AlertItem>
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
