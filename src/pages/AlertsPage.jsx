import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AlertList from "../components/AlertList";
import Typography from "@mui/material/Typography";
import { fetchAPI } from "../keycloak";

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  const fetchAlerts = () => {
    fetchAPI("/monitoring/alerts/")
      .then((data) => {
        setAlerts(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  useEffect(() => {
    setError(null); // Clear any existing errors
    fetchAlerts();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Card
        sx={{
          margin: 2,
          maxWidth: 600,
          boxShadow: 3,
        }}
      >
        <CardContent>
          {alerts && alerts.length > 0 ? (
            <AlertList alerts={alerts} error={error}></AlertList>
          ) : (
            <Typography>
                There are no alerts currently.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default AlertsPage;
