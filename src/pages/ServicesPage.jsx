import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ServicesList from "../components/ServicesList";
import ServiceDialog from "../components/dialogs/ServiceDialog";
import { fetchAPI } from "../keycloak";

function ServicesPage() {
  const [openAddServiceDialog, setOpenAddServiceDialog] = useState(false);
  const [services, setServices] = useState([]);
  const [successAlert, setSuccessAlert] = useState({ show: false, message: "" });
  const [alert, setAlert] = useState({ show: false, message: "" });

  const fetchServices = () => {
    fetchAPI("/monitoring/services/")
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setAlert({ show: true, message: `Failed to fetch services: ${error}` });
      });
  };

  useEffect(() => {
    fetchServices();
  }, []); // Dependencies array is empty to indicate this effect runs once on mount.

  const handleCloseAlert = () => {
    setAlert({ show: false, message: "" });
  };
  const handleCloseSuccessAlert = () => {
    setSuccessAlert({ show: false, message: "" });
  };

  const onDeleteService = (service) => {
    setServices(services.filter((d) => d.id !== service.id));
    setSuccessAlert({ show: true, message: "Service successfully deleted." });
  };

  const onAddService = (service) => {
    setServices(services.concat([service]));
    setSuccessAlert({ show: true, message: "Device successfully added." });
  };

  const onUpdateService = (service) => {
    setServices(services.map((s) => (s.id === service.id ? service : s)));
    setSuccessAlert({ show: true, message: "Service successfully updated." });
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
      <ServicesList services={services} onDelete={onDeleteService} onUpdate={onUpdateService} />
      <ServiceDialog
        open={openAddServiceDialog}
        service={null}
        onClose={() => setOpenAddServiceDialog(false)}
        onAdd={onAddService}
      />
      <Fab
        onClick={() => setOpenAddServiceDialog(true)}
        aria-label="add"
        color="secondary"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default ServicesPage;
