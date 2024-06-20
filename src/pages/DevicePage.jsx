import React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import humanizeDuration from "humanize-duration";

import DeviceList from "../components/DeviceList";
import DataUsageGraph from "../components/DataUsageGraph";
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

  React.useEffect(() => {
    fetchUnknownDevices();
    fetchDevices();
  }, []);

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

  const handleAddClick = (device) => {
    setDeviceToAdd(device);
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddDevice = () => {};

  const handleCloseAlert = () => {
    setAlert({ show: false, message: "", type: "success" });
  };

  const currentStationData = () => {
    let data = [];
    for (let d of devices) {
      if (!selectedDevice || d.mac === selectedDevice)
        data = data.concat(d.stations);
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

  const deleteDevice = async (device) => {
    fetchAPI(`/monitoring/devices/${device.mac}/`, "DELETE").then(() => {
      setDevices(devices.map((d) => d.mac !== device.mac));
    });
  };

  return (
    <Box sx={{ padding: 3 }}>
      {alert.show && (
        <Alert severity={alert.type} onClose={handleCloseAlert}>
          {alert.message}
        </Alert>
      )}
      {unknownDevices.map((device) => (
        <Alert
          key={device.id}
          variant="outlined"
          severity="info"
          action={
            <Button color="inherit" onClick={() => handleAddClick(device)}>
              Register
            </Button>
          }
          sx={{ marginBottom: 2 }}
        >
          <AlertTitle>New device {device.mac}</AlertTitle>
          Last contacted at {new Date(device.last_contact).toLocaleString()} from {device.from_ip}
        </Alert>
      ))}
      <DataUsageGraph dataset={currentStationData()} loading={loading} />
      <DeviceList
        title="Nodes"
        isLoading={loading}
        devices={devices}
        columns={AP_COLUMNS}
        onSelect={setSelectedDevice}
        onAdd={handleAddClick}
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
        handleClose={handleCloseAddDialog}
        handleAdd={handleAddDevice}
        device={deviceToAdd}
      />
    </Box>
  );
}

export default DevicePage;
