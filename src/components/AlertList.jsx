import React from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import AlertItem from "./AlertItem";

function AlertList({ alerts, error }) {

  function alertsByDay(alerts) {
    let datesDict = {};
    let currentDay = null;
    for (let alert of alerts) {
      let day = new Date(alert.created_time);
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
