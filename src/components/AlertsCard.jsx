import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  List,
  Divider,
  ListItemText,
  Typography,
} from "@mui/material";
import { useKeycloak } from "@react-keycloak/web";

import AlertItem from "./AlertItem";

function AlertsCard() {
  const { keycloak } = useKeycloak();
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  const fetchAlerts = () => {
    fetch(`${process.env.REACT_APP_API_URL}/monitoring/alerts/`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAlerts(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message);
      });
  };

  function alertsByDay() {
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

  useEffect(() => {
    setError(null); // Clear any existing errors
    fetchAlerts();
  }, []);

  return (
    <Card sx={{ minWidth: 345, position: "fixed", top: "72px", right: "8px", zIndex: 1000 }}>
      <CardHeader title="Alerts"></CardHeader>
      <CardContent sx={{ paddingTop: 0 }}>
        <List>
          {Object.entries(alertsByDay())
            // Don't like this by JS seems to only do string keys
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([day, alerts]) => {
              return (
                <List component="div" disablePadding>
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
      </CardContent>
    </Card>
  );
}

export default AlertsCard;
