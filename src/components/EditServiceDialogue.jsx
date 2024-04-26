import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

function EditServiceDialogue({ open, handleClose, service, handleUpdate }) {
  const [editedService, setEditedService] = useState({
    name: "",
    url: "",
    service_type: "",
    api_location: "",
  });

  useEffect(() => {
    // Pre-fill the dialog with the current service details when opened
    if (service) {
      setEditedService(service);
    }
  }, [service]);

  const handleFieldChange = (e) => {
    setEditedService({ ...editedService, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    handleUpdate(editedService);
  };

  if (!service) {
    return null; // Or render some placeholder
  }

  const serviceTypes = [
    { label: "Utility", value: "utility" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Games", value: "games" },
    { label: "Education", value: "education" },
  ];

  const apiLocations = [
    { label: "Cloud", value: "cloud" },
    { label: "Local", value: "local" },
  ];

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Service</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Service Name"
          type="text"
          fullWidth
          value={editedService.name}
          onChange={handleFieldChange}
        />
        <TextField
          margin="dense"
          name="url"
          label="URL"
          type="text"
          fullWidth
          value={editedService.url}
          onChange={handleFieldChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Service Type</InputLabel>
          <Select
            name="service_type"
            value={editedService.service_type}
            label="Service Type"
            onChange={handleFieldChange}
          >
            {serviceTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>API Location</InputLabel>
          <Select
            name="api_location"
            value={editedService.api_location}
            label="API Location"
            onChange={handleFieldChange}
          >
            {apiLocations.map((location) => (
              <MenuItem key={location.value} value={location.value}>
                {location.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditServiceDialogue;
