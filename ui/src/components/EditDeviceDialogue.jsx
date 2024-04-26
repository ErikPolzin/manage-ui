import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

function EditDeviceDialogue({ open, handleClose, device, handleUpdate }) {
  const [editedDevice, setEditedDevice] = useState({
    name: "",
    ip_address: "",
    device_type: "",
    id: -1,
  });

  useEffect(() => {
    if (device) {
      setEditedDevice(device);
    }
  }, [device]);

  const handleFieldChange = (e) => {
    setEditedDevice({ ...editedDevice, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    handleUpdate(editedDevice); // Passing new device data
  };

  if (!device) {
    return null; // Or render some placeholder if you prefer
  }
  const deviceTypes = [
    { label: "Switch", value: "switch" },
    { label: "Access Point", value: "access_point" },
    { label: "Firewall", value: "firewall" },
    { label: "Local Server", value: "local_server" },
    { label: "DNS", value: "dns_server" },
    { label: "Cloud Server", value: "global_server" },
  ];

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Device</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Device Name"
          type="text"
          fullWidth
          value={editedDevice.name}
          onChange={handleFieldChange}
        />
        <TextField
          margin="dense"
          name="ip_address"
          label="IP Address"
          type="text"
          fullWidth
          value={editedDevice.ip_address}
          onChange={handleFieldChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="device-type-label">Device Type</InputLabel>
          <Select
            labelId="device-type-label"
            name="device_type"
            value={editedDevice.device_type}
            label="Device Type"
            onChange={handleFieldChange}
          >
            {deviceTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
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

export default EditDeviceDialogue;
