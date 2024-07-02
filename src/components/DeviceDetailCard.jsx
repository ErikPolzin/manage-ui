import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Badge from "@mui/material/Badge";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SvgIcon from "@mui/material/SvgIcon";
import { useTheme } from "@mui/material";
import { fetchAPI } from "../keycloak";
import { Divider } from "@mui/material";
import ResourcesGraph from "./graphs/ResourcesGraph";
import RetriesGraph from "./graphs/RetriesGraph";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SignalWifiStatusbarConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AlertList from "./AlertList";

function IconAccordionSummary({ icon, title, badgeNum }) {
  return (
    <AccordionSummary
      sx={{
        "& .MuiAccordionSummary-content": {
          margin: "4px",
        },
      }}
    >
      <ListItem>
        <ListItemIcon>
          {badgeNum ? (
            <Badge badgeContent={badgeNum} color="secondary">
              <SvgIcon component={icon} color="action" />
            </Badge>
          ) : (
            <SvgIcon component={icon} color="action" />
          )}
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    </AccordionSummary>
  );
}

function StatusCheck({ passed, title, feedback }) {
  return (
    <ListItem>
      <ListItemIcon>
        {passed === true ? (
          <CheckCircleOutlineIcon color="success" />
        ) : (
          <CancelOutlinedIcon color="warning" />
        )}
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
            <IconAccordionSummary
              icon={SignalWifiStatusbarConnectedNoInternet4Icon}
              title={"TX Retries"}
            />
            <AccordionDetails>
              <RetriesGraph deviceMac={deviceMac} />
            </AccordionDetails>
          </Accordion>
          <Accordion variant="outlined" defaultExpanded>
            <IconAccordionSummary icon={InfoIcon} title={`Status: ${deviceDetails.status}`} />
            <AccordionDetails>
              <List dense>
                {deviceDetails.checks.map((check) => (
                  <StatusCheck key={check.title} {...check} />
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion variant="outlined" defaultExpanded>
            <IconAccordionSummary icon={MonitorHeartIcon} title="System Info" />
            <AccordionDetails>
              <ResourcesGraph deviceMac={deviceMac} />
            </AccordionDetails>
          </Accordion>
          <Accordion variant="outlined">
            <IconAccordionSummary
              icon={ErrorIcon}
              title="Alert History"
              badgeNum={deviceDetails.num_unresolved_alerts}
            />
            <AccordionDetails>
              <AlertList alerts={deviceDetails.latest_alerts} />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      ) : null}
    </Card>
  );
}

export default DeviceDetailCard;
