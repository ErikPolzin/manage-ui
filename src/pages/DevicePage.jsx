import React, { useState, useEffect } from "react";
import { Fab, CardContent, Card, ListItemText } from "@mui/material";
import DeviceList from "../components/DeviceList";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDeleteDialogue from "../components/ConfirmDeleteDialogue";
import Alert from "@mui/material/Alert";
import EditDeviceDialogue from "../components/EditDeviceDialogue";
import AddDeviceDialogue from "../components/AddDeviceDialogue";
import { useKeycloak } from "@react-keycloak/web";
import { refreshTokenIfNeeded } from "../keycloak";

function DevicePage() {
  const { keycloak } = useKeycloak();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [devices, setDevices] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({ show: false, message: "" });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState({
    name: "",
    ip_address: "",
    device_type: "",
    id: -1,
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = `${process.env.REACT_APP_API_URL}`;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Indicate that loading has started
      setError(null); // Clear any existing errors
      await refreshTokenIfNeeded();
      fetch(`${apiUrl}/monitoring/devices/`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.detail || "An unknown error occurred");
          }
          return response.json();
        })
        .then((data) => {
          setDevices(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(error.message);
          setIsLoading(false);
        });
    };
    fetchData();
  }, []);

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddDevice = (newDevice) => {
    setOpenAddDialog(false);

    fetch(`${apiUrl}/monitoring/devices/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDevice),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        setSuccessAlert({ show: true, message: "Device successfully added." });
        fetchDevices(); // Re-fetch devices
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert({ show: true, message: "Failed to add the device." });
      });
  };

  const fetchDevices = async () => {
    console.log("----keycloak token----");
    console.log(`${keycloak.token}`);
    await refreshTokenIfNeeded();
    fetch(`${apiUrl}/monitoring/devices/`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error("Error:", error));
  };

  const handleEditClick = (device) => {
    setDeviceToEdit(device);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleUpdateDevice = (updatedDevice) => {
    setOpenEditDialog(false);
    fetch(`${apiUrl}/monitoring/devices/${updatedDevice.id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDevice),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        setSuccessAlert({ show: true, message: "Device successfully updated." });
        fetchDevices();
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert({ show: true, message: "Failed to update the device." });
      });
  };

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
      // Perform API call to delete the device
      fetch(`${apiUrl}/monitoring/devices/${deviceToDelete.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
        .then((response) => {
          // Remove the deleted device from the state
          setDevices(devices.filter((device) => device.id !== deviceToDelete.id));
          setSuccessAlert({ show: true, message: "Device successfully deleted." });
        })
        .catch((error) => {
          console.error("Error:", error);
          setAlert({ show: true, message: "Failed to remove the device. Please contact support." });
        });
    }
  };
  const handleCloseAlert = () => {
    setAlert({ show: false, message: "" });
  };
  const handleCloseSuccessAlert = () => {
    setSuccessAlert({ show: false, message: "" });
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!devices || !devices.length) {
    return (
      <Box>
        <Card
          sx={{
            maxWidth: 600,
            boxShadow: 3,
          }}
        >
          <CardContent>
            <ListItemText primary={"There are no devices registered."} />
          </CardContent>
        </Card>
        <Fab
          onClick={handleAddClick}
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
          handleClose={handleCloseAddDialog}
          handleAdd={handleAddDevice}
        />
      </Box>
    );
  }
  return (
    <Box>
      {alert.show && (
        <Alert severity="error" onClose={handleCloseAlert}>
          {alert.message}
        </Alert>
      )}
      {successAlert.show && (
        <Alert severity="success" onClose={handleCloseSuccessAlert}>
          {successAlert.message}
        </Alert>
      )}
      <Box>
        <DeviceList devices={devices} onDelete={handleDeleteClick} onEdit={handleEditClick} />
        <ConfirmDeleteDialogue
          open={openDeleteDialog}
          handleClose={handleCloseDeleteDialog}
          handleConfirm={handleConfirmDelete}
          type={"device"}
        />
        <EditDeviceDialogue
          open={openEditDialog}
          handleClose={handleCloseEditDialog}
          device={deviceToEdit}
          handleUpdate={handleUpdateDevice}
        />
      </Box>
      <Fab
        onClick={handleAddClick}
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
        handleClose={handleCloseAddDialog}
        handleAdd={handleAddDevice}
      />
    </Box>
  );
}

export default DevicePage;
