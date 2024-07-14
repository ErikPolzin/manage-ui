import React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import AlertTitle from "@mui/material/AlertTitle";
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
import ConfirmDeleteDialogue from "../components/ConfirmDeleteDialogue";
import AddDeviceDialogue from "../components/AddDeviceDialogue";
import DeviceDetailCard from "../components/DeviceDetailCard";
import { useQueryState } from "../hooks";
import { fetchAPI } from "../keycloak";

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
  const [selectedDevice, setSelectedDevice] = React.useState(null);
  const [unknownDevices, setUnknownDevices] = React.useState([]);
  const [alert, setAlert] = React.useState({ show: false, message: "", type: "error" });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [deviceToDelete, setDeviceToDelete] = React.useState(null);
  const [deviceToAdd, setDeviceToAdd] = React.useState(null);
  const [deviceErrors, setDeviceErrors] = React.useState({});
  const [showDays, setShowDays] = React.useState("month");
  const [tabValue, setTabValue] = React.useState(0);

  const { lastJsonMessage, readyState } = useWebSocket(
    `${process.env.REACT_APP_WS_URL}/ws/updates/`,
    {
      share: false,
      shouldReconnect: () => true,
    },
  );

  // Run when the connection state (readyState) changes
  React.useEffect(() => {
    console.log("WS: Connection state changed", readyState);
  }, [readyState]);

  // Run when a new WebSocket message is received (lastJsonMessage)
  React.useEffect(() => {
    if (lastJsonMessage) {
      if (lastJsonMessage.type === "sync:devices") {
        console.log("WS: Syncing devices");
        setDevices(lastJsonMessage.devices);
      }
    }
  }, [lastJsonMessage]);

  React.useEffect(() => {
    fetchUnknownDevices();
    fetchDevices();
  }, []);

  // Ensure that the selected device data changes when the selected device mac changes
  React.useEffect(() => {
    for (let device of devices) {
      if (device.mac === selectedDeviceMac) {
        setSelectedDevice(device);
        break;
      }
    }
  }, [devices, selectedDeviceMac]);

  const handleDeleteClick = (device) => {
    setDeviceToDelete(device);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    setOpenDeleteDialog(false);
    if (deviceToDelete) {
      deleteDevice(deviceToDelete);
    }
  };

  const handleAddClick = (event, device) => {
    setDeviceToAdd(device);
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddDevice = (newDevice) => {
    fetchAPI("/monitoring/devices/", "POST", newDevice)
      .then((data) => {
        setOpenAddDialog(false);
        setAlert({ show: true, message: `Added device ${newDevice.mac}`, type: "success" });
        fetchUnknownDevices();
        fetchDevices();
      })
      .catch((error) => {
        setDeviceErrors(error);
      });
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

  const fetchUnknownDevices = () => {
    fetchAPI("/monitoring/unknown_nodes/")
      .then((data) => {
        setUnknownDevices(data);
      })
      .catch((error) => {
        console.log("Error fetching unknown devices: " + error);
      });
  };

  const deleteDevice = async (deviceMac) => {
    fetchAPI(`/monitoring/devices/${deviceMac}/`, "DELETE")
      .then(() => {
        fetchDevices();
      })
      .catch((error) => {
        console.log("Error deleting device: " + error);
      });
  };

  /**
   * Device has been updated in the device detail component, sync the parent
   * device list. Note this will likely trigger an update to the selected device.
   * @param {Object} newDevice
   */
  const onDeviceUpdated = (newDevice) => {
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
            onChange={(e, v) => setShowDays(v)}
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
        {unknownDevices.map((device) => (
          <Alert
            key={device.mac}
            variant="outlined"
            severity="info"
            action={
              <Button color="inherit" onClick={(e) => handleAddClick(e, device)}>
                Register
              </Button>
            }
            sx={{ marginBottom: 2 }}
          >
            <AlertTitle>New device {device.mac}</AlertTitle>
            Last contacted at {new Date(device.last_contact).toLocaleString()} from {device.from_ip}
          </Alert>
        ))}
        <DeviceList
          sx={{
            marginRight: 2,
            marginLeft: 2,
          }}
          isLoading={loading}
          devices={devices}
          onSelect={setSelectedDeviceMac}
          selectedDevice={selectedDeviceMac}
          onAdd={(e) => handleAddClick(e, null)}
          onDelete={handleDeleteClick}
        />
      </Grid>
      {selectedDeviceMac ? (
        <Grid xs={12} lg={4} xl={3} id="detail-cell">
          <DeviceDetailCard
            device={selectedDevice}
            deviceUpdated={onDeviceUpdated}
            sx={{
              margin: 1,
            }}
          />
        </Grid>
      ) : null}
      <ConfirmDeleteDialogue
        open={openDeleteDialog}
        handleClose={handleCloseDeleteDialog}
        handleConfirm={handleConfirmDelete}
        type={"device"}
      />
      <AddDeviceDialogue
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onAdd={handleAddDevice}
        defaults={deviceToAdd}
        errors={deviceErrors}
      />
    </Grid>
  );
}

export default DevicePage;
