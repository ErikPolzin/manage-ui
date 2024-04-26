import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AddServiceDialogue from "../components/AddServiceDialogue";
import { Card, CardContent, Fab, ListItemText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ServiceList from "../components/ServiceList";
import EditServiceDialogue from "../components/EditServiceDialogue";
import { useKeycloak } from "@react-keycloak/web";
import ConfirmDeleteDialogue from "../components/ConfirmDeleteDialogue";

function ServicesPage() {
  const { keycloak } = useKeycloak();
  const [services, setServices] = useState([]);
  const [successAlert, setSuccessAlert] = useState({ show: false, message: "" });
  const [openAddDialogue, setOpenAddDialogue] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [error, setError] = useState(null);
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [openEditDialogue, setOpenEditDialogue] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const apiUrl = `${process.env.REACT_APP_API_URL}`;

  const fetchServices = () => {
    fetch(`${apiUrl}/monitoring/services/`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message);
      });
  };

  useEffect(() => {
    setError(null); // Clear any existing errors
    fetchServices();
  }, []); // Dependencies array is empty to indicate this effect runs once on mount.

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setOpenDeleteDialogue(true);
  };

  const handleCloseAlert = () => {
    setAlert({ show: false, message: "" });
  };
  const handleCloseSuccessAlert = () => {
    setSuccessAlert({ show: false, message: "" });
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setOpenEditDialogue(true);
  };
  const handleConfirmDelete = () => {
    if (!serviceToDelete) return;

    fetch(`${apiUrl}/monitoring/services/${serviceToDelete.id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the service");
        }
        // Directly proceed if response is 204, as there's no content to parse
        if (response.status === 204) {
          setSuccessAlert({ show: true, message: "Service successfully deleted." });
          setOpenDeleteDialogue(false);
          fetchServices();
          return;
        }
        return response.json(); // return if not 204
      })
      .then((data) => {})
      .catch((error) => {
        console.error("Error:", error);
        setAlert({ show: true, message: "Failed to delete the service." });
      });
  };

  const handleAddService = (newService) => {
    fetch(`${apiUrl}/monitoring/services/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newService),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          setSuccessAlert({ show: true, message: "Device successfully added." });
          setOpenAddDialogue(false);
          fetchServices();
        } else {
          setAlert({ show: true, message: `Failed to add service: ${data.message}` });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert({ show: true, message: "An error occurred while adding the service." });
      });
  };

  const handleUpdateService = (updatedService) => {
    fetch(`${apiUrl}/monitoring/services/${updatedService.id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedService),
    })
      .then((response) => response.json())
      .then((data) => {
        setSuccessAlert({ show: true, message: "Service successfully updated." });
        setOpenEditDialogue(false);
        // Refresh the service list
        fetchServices();
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert({ show: true, message: "An error occurred while updating the service." });
      });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!services || !services.length) {
    return (
      <Box>
        <Card
          sx={{
            margin: 2,
            maxWidth: 600,
            boxShadow: 3,
          }}
        >
          <CardContent>
            <ListItemText primary={"There are no services registered."} />
          </CardContent>
        </Card>
        <Fab
          onClick={() => setOpenAddDialogue(true)}
          aria-label="add"
          sx={{
            position: "fixed",
            top: "36px",
            right: 16,
            zIndex: 1200,
          }}
        >
          <AddIcon />
        </Fab>
        <AddServiceDialogue
          open={openAddDialogue}
          handleClose={() => setOpenAddDialogue(false)}
          handleAdd={handleAddService}
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
      <ServiceList services={services} onDelete={handleDeleteClick} onEdit={handleEditClick} />
      <Fab
        onClick={() => setOpenAddDialogue(true)}
        aria-label="add"
        sx={{
          position: "fixed",
          top: "36px",
          right: 16,
          zIndex: 1200,
        }}
      >
        <AddIcon />
      </Fab>
      <AddServiceDialogue
        open={openAddDialogue}
        handleClose={() => setOpenAddDialogue(false)}
        handleAdd={handleAddService}
      />
      <EditServiceDialogue
        open={openEditDialogue}
        handleClose={() => setOpenEditDialogue(false)}
        service={editingService}
        handleUpdate={handleUpdateService}
      />
      <ConfirmDeleteDialogue
        open={openDeleteDialogue}
        handleClose={() => setOpenDeleteDialogue(false)}
        handleConfirm={handleConfirmDelete}
        type="service"
      />
    </Box>
  );
}

export default ServicesPage;
