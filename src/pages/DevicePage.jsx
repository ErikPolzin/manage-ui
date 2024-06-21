import React from "react";
import PropTypes from 'prop-types';
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import humanizeDuration from "humanize-duration";

import DeviceList from "../components/DeviceList";
import DataUsageGraph from "../components/DataUsageGraph";
import RTTGraph from "../components/RTTGraph";
import ConfirmDeleteDialogue from "../components/ConfirmDeleteDialogue";
import AddDeviceDialogue from "../components/AddDeviceDialogue";
import { fetchAPI } from "../keycloak";

const AP_COLUMNS = [
  { field: "name", headerName: "Name" },
  { field: "mac", headerName: "MAC Address", width: 150 },
  { field: "last_contact_from_ip", headerName: "IP Address", width: 150 },
  {
    field: "last_contact",
    headerName: "Last Seen",
    valueGetter: (value, row) => humanizeDuration(new Date() - new Date(value), { round: true }),
  },
  {
    field: "memory_usage",
    headerName: "Memory Usage",
    valueGetter: (value, row) => `${Math.round(value * 100)}%`,
  },
];

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function DevicePage() {
  const [devices, setDevices] = React.useState([]);
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
  const [showDays, setShowDays] = React.useState(31);
  const [tabValue, setTabValue] = React.useState(0);

  React.useEffect(() => {
    fetchUnknownDevices();
    fetchDevices();
  }, []);

  const handleDeleteClick = (devices) => {
    setDeviceToDelete(devices[0]);
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

  const currentStationData = () => {
    let data = [];
    for (let d of devices) {
      if (!selectedDevice || d.mac === selectedDevice) data = data.concat(d.stations);
    }
    return data;
  };

  const currentUptimeData = () => {
    let data = [];
    for (let d of devices) {
      if (!selectedDevice || d.mac === selectedDevice) data = data.concat(d.uptime_metrics);
    }
    return data;
  };

  const fetchDevices = async () => {
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

  const fetchUnknownDevices = async () => {
    fetchAPI("/monitoring/unknown_nodes/")
      .then((data) => {
        setUnknownDevices(data);
      })
      .catch((error) => {
        console.log("Error fetching unknown devices: " + error);
      });
  };

  const deleteDevice = async (deviceMac) => {
    fetchAPI(`/monitoring/devices/${deviceMac}/`, "DELETE").then(() => {
      fetchDevices();
    });
  };

  return (
    <Box sx={{ padding: 3, marginTop: -3 }}>
      {alert.show && (
        <Alert severity={alert.type} onClose={handleCloseAlert}>
          {alert.message}
        </Alert>
      )}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="basic tabs example">
          <Tab label="Data Usage" {...a11yProps(0)} />
          <Tab label="RTT" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
      <DataUsageGraph dataset={currentStationData()} loading={loading} showDays={showDays} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
      <RTTGraph dataset={currentUptimeData()} loading={loading} showDays={showDays} />
      </CustomTabPanel>
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
          <ToggleButton value={1}>24 Hours</ToggleButton>
          <ToggleButton value={7}>Week</ToggleButton>
          <ToggleButton value={31}>Month</ToggleButton>
        </ToggleButtonGroup>
      </Box>
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
        title="Nodes"
        isLoading={loading}
        devices={devices}
        columns={AP_COLUMNS}
        onSelect={setSelectedDevice}
        onAdd={(e) => handleAddClick(e, null)}
        onDelete={handleDeleteClick}
      />
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
    </Box>
  );
}

export default DevicePage;
