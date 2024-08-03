import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useWebSocket from "react-use-websocket";

import DeviceList from "../components/DeviceList";
import DataUsageGraph from "../components/graphs/DataUsageGraph";
import DataRateGraph from "../components/graphs/DataRateGraph";
import RTTGraph from "../components/graphs/RTTGraph";
import UptimeGraph from "../components/graphs/UptimeGraph";
import DeviceDetailCard from "../components/DeviceDetailCard";
import { MS_IN } from "../components/graphs/utils";
import { useQueryState } from "../hooks";
import { fetchAPI } from "../keycloak";
import { Container } from "@mui/material";

function GraphTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`graph-tabpanel-${index}`}
      aria-labelledby={`graph-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: "10%", py: 1 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `graph-tab-${index}`,
    "aria-controls": `graph-tabpanel-${index}`,
  };
}

function DevicePage() {
  const [devices, setDevices] = React.useState([]);
  const [selectedDeviceMac, setSelectedDeviceMac] = useQueryState("selected");
  const [alert, setAlert] = React.useState({ show: false, message: "", type: "error" });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [minTime, setMinTime] = React.useState(null);
  const [showDays, setShowDays] = React.useState("month");
  const [tabValue, setTabValue] = React.useState(0);

  const { lastJsonMessage } = useWebSocket(
    `${process.env.REACT_APP_WS_URL}/ws/updates/`,
    {
      share: true,
      shouldReconnect: () => true,
    },
  );

  // Run when a new WebSocket message is received (lastJsonMessage)
  React.useEffect(() => {
    if (lastJsonMessage) {
      if (lastJsonMessage.type === "sync:devices") {
        console.log("WS: Syncing devices");
        setDevices(lastJsonMessage.devices);
      } else if (lastJsonMessage.type === "sync:device") {
        console.log("WS: Syncing device");
        handleUpdate(lastJsonMessage.device);
      }
    }
  }, [lastJsonMessage]);

  // Sync min time when the user changes the toggle button
  React.useEffect(() => setMinTime(new Date() - MS_IN[showDays]), [showDays]);

  React.useEffect(() => {
    fetchDevices();
  }, []);

  const selectedDevice = () => {
    for (let device of devices) {
      if (device.mac === selectedDeviceMac) return device;
    }
    return null;
  };

  const handleCloseAlert = () => {
    setAlert({ show: false, message: "", type: "success" });
  };

  const fetchDevices = () => {
    setError(null); // Clear any existing errors
    // Fetch list of mesh nodes
    setLoading(true);
    fetchAPI("/monitoring/devices/")
      .then((data) => {
        setDevices(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (deletedDevice) => {
    setDevices(devices.filter((d) => d.mac !== deletedDevice.mac));
  };

  const handleAdd = (addedDevice) => {
    setDevices(devices.concat([addedDevice]));
  };

  /**
   * Device has been updated in the device detail component, sync the parent
   * device list. Note this will likely trigger an update to the selected device.
   * @param {Object} newDevice
   */
  const handleUpdate = (newDevice) => {
    // For some stupid reason django returns MAC addresses in a slightly different
    // format, so I can't check for exact equality here.
    newDevice.mac = newDevice.mac.replaceAll("-", ":")
    setDevices(devices.map((d) => (d.mac === newDevice.mac ? newDevice : d)));
  };

  return (
    <Grid container spacing={2}>
      <Grid xs={12} lg={selectedDeviceMac ? 8 : 12} xl={selectedDeviceMac ? 9 : 12}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
            <Tab label="Data Usage" {...a11yProps(0)} />
            <Tab label="Speed" {...a11yProps(1)} />
            <Tab label="RTT" {...a11yProps(2)} />
            <Tab label="Uptime" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <Container maxWidth="lg" disableGutters>
          <GraphTabPanel value={tabValue} index={0}>
            <DataUsageGraph showDays={showDays} selectedDevice={selectedDeviceMac} />
          </GraphTabPanel>
          <GraphTabPanel value={tabValue} index={1}>
            <DataRateGraph showDays={showDays} selectedDevice={selectedDeviceMac} />
          </GraphTabPanel>
          <GraphTabPanel value={tabValue} index={2}>
            <RTTGraph showDays={showDays} selectedDevice={selectedDeviceMac} />
          </GraphTabPanel>
          <GraphTabPanel value={tabValue} index={3}>
            <UptimeGraph showDays={showDays} selectedDevice={selectedDeviceMac} />
          </GraphTabPanel>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 2,
            }}
          >
            <ToggleButtonGroup
              color="primary"
              value={showDays}
              onChange={(e, v) => v !== null && setShowDays(v)}
              exclusive
              size="small"
              aria-label="Date Range"
            >
              <ToggleButton value={"day"}>24 Hours</ToggleButton>
              <ToggleButton value={"week"}>Week</ToggleButton>
              <ToggleButton value={"month"}>Month</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {alert.show && (
            <Alert severity={alert.type} onClose={handleCloseAlert}>
              {alert.message}
            </Alert>
          )}
          <DeviceList
            sx={{
              marginRight: 2,
              marginLeft: 2,
            }}
            isLoading={loading}
            devices={devices}
            selectedDevice={selectedDevice()}
            minTime={minTime}
            onSelect={setSelectedDeviceMac}
            onUpdate={handleUpdate}
            onAdd={handleAdd}
            onDelete={handleDelete}
          />
        </Container>
      </Grid>
      {selectedDeviceMac ? (
        <Grid xs={12} lg={4} xl={3} id="detail-cell">
          <DeviceDetailCard
            device={selectedDevice()}
            onUpdate={handleUpdate}
            onClose={() => setSelectedDeviceMac(null)}
            onDelete={handleDelete}
            sx={{
              margin: 1,
            }}
          />
        </Grid>
      ) : null}
    </Grid>
  );
}

export default DevicePage;
