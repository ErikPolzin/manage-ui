import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AddServiceDialogue from "../components/AddServiceDialogue";
import { Card, CardContent, Fab, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ServiceGrid from "../components/ServiceGrid";
import EditServiceDialogue from "../components/EditServiceDialogue";
import ConfirmDeleteDialogue from "../components/ConfirmDeleteDialogue";
import { fetchAPI } from "../keycloak";

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [successAlert, setSuccessAlert] = useState({ show: false, message: "" });
  const [openAddDialogue, setOpenAddDialogue] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [openEditDialogue, setOpenEditDialogue] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const fetchServices = () => {
    fetchAPI("/monitoring/services/")
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert({ show: true, message: `Failed to fetch services: ${error}` });
      });
  };

  useEffect(() => {
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

    fetchAPI(`/monitoring/services/${serviceToDelete.id}/`, "DELETE")
      .then(() => {
        setSuccessAlert({ show: true, message: "Service successfully deleted." });
        setOpenDeleteDialogue(false);
        fetchServices();
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert({ show: true, message: "Failed to delete the service." });
      });
  };

  const handleAddService = (newService) => {
    fetchAPI("/monitoring/services/", "POST", newService)
      .then(() => {
        setSuccessAlert({ show: true, message: "Device successfully added." });
        setOpenAddDialogue(false);
        fetchServices();
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert({ show: true, message: `Failed to add service: ${error}` });
      });
  };

  const handleUpdateService = (updatedService) => {
    fetchAPI(`/monitoring/services/${updatedService.id}/`, "PUT", updatedService)
      .then(() => {
        setSuccessAlert({ show: true, message: "Service successfully updated." });
        setOpenEditDialogue(false);
        // Refresh the service list
        fetchServices();
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert({ show: true, message: `Failed to update service: ${error}` });
      });
  };

  return (
    <Box sx={{ padding: 2 }}>
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
      {services && services.length > 0 ? (
        <ServiceGrid services={services} onDelete={handleDeleteClick} onEdit={handleEditClick} />
      ) : (
        <Card
          sx={{
            margin: 2,
            maxWidth: 600,
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Typography>There are no services registered.</Typography>
          </CardContent>
        </Card>
      )}
      <Fab
        onClick={() => setOpenAddDialogue(true)}
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
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
