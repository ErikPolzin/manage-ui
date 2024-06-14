import React from "react";
import Fab from "@mui/material/Fab";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import humanizeDuration from "humanize-duration";

import DeviceList from "../components/DeviceList";
import AddDeviceDialogue from "../components/AddDeviceDialogue";
import { fetchAPI } from "../keycloak";

const AP_COLUMNS = [
  { field: "name", headerName: "Name" },
  { field: "type", headerName: "Type" },
  { field: "mac", headerName: "MAC Address", width: 150 },
  { field: "last_contact_from_ip", headerName: "Last IP", width: 150 },
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
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [devices, setDevices] = React.useState([]);
  const [unknownDevices, setUnknownDevices] = React.useState([]);
  const [alert, setAlert] = React.useState({ show: false, message: "", type: "error" });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchUnknownDevices();
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setError(null); // Clear any existing errors
    // Fetch list of mesh nodes
    setLoading(true);
    fetchAPI("/rd/nodes")
      .then((nodes) => {
        nodes = nodes.map((n) => ({ ...n, type: "MESH" }));
        // Fetch list of access points
        fetchAPI("/rd/aps").then((aps) => {
          aps = aps.map((n) => ({ ...n, type: "AP" }));
          setDevices(aps.concat(nodes));
        });
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUnknownDevices = async () => {
    fetchAPI("/rd/unknown_nodes/")
      .then((data) => {
        setUnknownDevices(data);
      })
      .catch((error) => {
        console.log("Error fetching unknown devices: " + error);
      });
  };

  const handleCloseAlert = () => {
    setAlert({ show: false, message: "", type: "success" });
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
          variant="outlined"
          severity="info"
          action={
            <Button color="inherit">
              Register
            </Button>
          }
          sx={{ marginBottom: 2 }}
        >
          <AlertTitle>New device {device.mac}</AlertTitle>
          Last contacted at {new Date(device.last_contact).toLocaleString()} from {device.from_ip}
        </Alert>
      ))}
      <DeviceList title="Nodes" isLoading={loading} devices={devices} columns={AP_COLUMNS} />
      <Fab
        // onClick={handleAddClick}
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
      <AddDeviceDialogue
        open={openAddDialog}
        // handleClose={handleCloseAddDialog}
        // handleAdd={handleAddDevice}
      />
    </Box>
  );
}

export default DevicePage;
