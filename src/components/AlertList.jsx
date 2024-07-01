import React from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import { Info, Warning, Error, CheckCircle, Close } from "@mui/icons-material";

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
  0: {
    icon: CheckCircle,
    color: "success",
  },
};

function AlertItem({ alert }) {
  let alertIcon = alertIconMap[alert.level];

  function createdTime() {
    let d = new Date(alert.created);
    return d.toLocaleTimeString();
  }

  return (
    <ListItem>
      <ListItemIcon>
        <SvgIcon component={alertIcon.icon} color={alertIcon.color}></SvgIcon>
      </ListItemIcon>
      <ListItemText secondary={createdTime()}>
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
      </ListItemText>
      <IconButton sx={{ mx: "4px" }}>
        <Close />
      </IconButton>
    </ListItem>
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
    <List>
      {Object.entries(alertsByDay(alerts || []))
        // Don't like this by JS seems to only do string keys
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .map(([day, alerts]) => {
          return (
            <List component="div" disablePadding key={day}>
              <Divider></Divider>
              <ListItemText>
                <Typography variant="overline" display="block" gutterBottom>
                  {new Date(day).toDateString()}
                </Typography>
              </ListItemText>
              {alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert}></AlertItem>
              ))}
            </List>
          );
        })}
      {}
    </List>
  );
}

export default AlertList;
