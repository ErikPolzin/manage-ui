import React, { useState, useEffect } from "react";
import { fetchAPI } from "../keycloak";
import ResourcesGraph from "./graphs/ResourcesGraph";
import RetriesGraph from "./graphs/RetriesGraph";
import AlertList from "./AlertList";
import { formatBitsPerSecond } from "../units";
// MUI components
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
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";
// Icons
import SvgIcon from "@mui/material/SvgIcon";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SignalWifiStatusbarConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

function IconAccordionSummary({ icon, title, badgeNum }) {
  return (
    <AccordionSummary
      sx={{
        "& .MuiAccordionSummary-content": {
          margin: "4px",
        },
        "& .Mui-expanded": {
          maxHeight: "40px",
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
    <Card
      {...props}
      sx={{
        backgroundColor: theme.palette.action.selected,
        margin: 1,
        // Device details remain fixed when the rest of the page is scrollable
        [theme.breakpoints.up("lg")]: {
          position: "fixed",
        },
      }}
    >
      <CardHeader
        title={"Device: " + (deviceDetails?.name || deviceMac)}
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
        }}
      />
      <Divider></Divider>
      {deviceDetails ? (
        <CardContent
          sx={{
            [theme.breakpoints.up("lg")]: {
              // window - navbar - card header - padding - some extra padding
              maxHeight: "calc(100vh - 64px - 64px - 16px - 10px)",
              overflowY: "auto",
            },
          }}
        >
          <Accordion variant="outlined" defaultExpanded>
            <IconAccordionSummary
              icon={SignalWifiStatusbarConnectedNoInternet4Icon}
              title={"TX Retries"}
            />
            <Divider />
            <AccordionDetails>
              <RetriesGraph deviceMac={deviceMac} />
              <Box sx={{ display: "flex", alignItems: "center", marginX: 1, marginY: 2, fontSize: "0.9rem" }}>
                <Box component={"span"} sx={{ display: "flex", alignItems: "center", marginRight: 1, color: "#1ba6c9" }}>
                  <ArrowDownwardIcon /> {(deviceDetails.download_speed !== null) ? formatBitsPerSecond(deviceDetails.download_speed) : "??"}
                </Box>
                <Box component={"span"} sx={{ display: "flex", alignItems: "center", color: "#be20cc" }}>
                  <ArrowUpwardIcon /> {(deviceDetails.upload_speed !== null) ? formatBitsPerSecond(deviceDetails.upload_speed) : "??"}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion variant="outlined" defaultExpanded>
            <IconAccordionSummary icon={InfoIcon} title={`Status: ${deviceDetails.status}`} />
            <Divider />
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
            <Divider />
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
            <Divider />
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
