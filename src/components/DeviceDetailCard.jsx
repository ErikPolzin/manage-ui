import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material";
import { fetchAPI } from "../keycloak";
import { Divider } from "@mui/material";
import ResourcesGraph from "./graphs/ResourcesGraph";
import RetriesGraph from "./graphs/RetriesGraph";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

function StatusCheck({ passed, title, feedback }) {
  return (
    <ListItem>
      <ListItemIcon>
        {passed === true ? <CheckCircleIcon color="success" /> : <CancelIcon color="warning" />}
      </ListItemIcon>
      <ListItemText primary={title} secondary={feedback} />
    </ListItem>
  );
}

function DeviceDetailCard({ deviceMac, ...props }) {
  const [deviceDetails, setDeviceDetails] = useState(null);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const fetchDetails = React.useCallback(() => {
    if (!deviceMac) return;
    fetchAPI(`/monitoring/devices/${deviceMac}/`)
      .then((data) => {
        setDeviceDetails(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [deviceMac]);

  useEffect(() => {
    setError(null);
    fetchDetails();
  }, [deviceMac, fetchDetails]);

  return (
    <Card {...props} sx={{ backgroundColor: theme.palette.action.selected, margin: 1 }}>
      <CardHeader
        title={"Device: " + (deviceDetails?.name || deviceMac)}
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
        }}
      />
      <Divider></Divider>
      {deviceDetails ? (
        <CardContent>
          <Accordion variant="outlined" defaultExpanded>
            <AccordionSummary>
              <Typography>TX Retries</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <RetriesGraph deviceMac={deviceMac} />
            </AccordionDetails>
          </Accordion>
          <Accordion variant="outlined" defaultExpanded>
            <AccordionSummary>
              <Typography>Status: {deviceDetails.status}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {deviceDetails.checks.map((check) => (
                  <StatusCheck key={check.title} {...check} />
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion variant="outlined" defaultExpanded>
            <AccordionSummary>
              <Typography>System Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ResourcesGraph deviceMac={deviceMac} />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      ) : null}
    </Card>
  );
}

export default DeviceDetailCard;
