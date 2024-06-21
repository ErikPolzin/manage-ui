import React, { useState } from "react";
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

const DEFAULT_DEVICE = {
  name: "",
  mac: "",
  ip: "",
  hardware: "tl_eap225_3_o",
  description: "",
  last_contact_from_ip: "",
  created: (new Date()).toISOString(),
};

function AddDeviceDialogue({ open, defaults, onClose, onAdd, errors }) {
  const [newDevice, setNewDevice] = useState(Object.assign({}, DEFAULT_DEVICE));

  React.useEffect(() => {
    if (defaults) {
      setNewDevice({
        ...DEFAULT_DEVICE,
        name: defaults.name,
        mac: defaults.mac,
        ip: defaults.from_ip,
      });
    }
  }, [defaults]);

  const handleChange = (e) => {
    setNewDevice({ ...newDevice, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onAdd(newDevice);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const resetForm = () => {
    setNewDevice(Object.assign({}, DEFAULT_DEVICE));
  }

  return (
    <Dialog open={open} onClose={handleClose} onAbort={resetForm}>
      <DialogTitle>Add New Device</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Device Name"
          type="text"
          fullWidth
          value={newDevice.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name ? errors.name.join("\n") : null}
        />
        <TextField
          margin="dense"
          name="mac"
          label="MAC Address"
          type="text"
          fullWidth
          value={newDevice.mac}
          onChange={handleChange}
          error={Boolean(errors.mac)}
          helperText={errors.mac ? errors.mac.join("\n") : null}
        />
        <TextField
          margin="dense"
          name="ip"
          label="IP Address"
          type="text"
          fullWidth
          value={newDevice.ip}
          onChange={handleChange}
          error={Boolean(errors.ip)}
          helperText={errors.ip ? errors.ip.join("\n") : null}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Device Type</InputLabel>
          <Select
            name="hardware"
            value={newDevice.hardware}
            label="Hardware"
            onChange={handleChange}
          >
            <MenuItem value="tl_eap225_3_o">TPLink EAP</MenuItem>
            <MenuItem value="ubnt_ac_mesh">Ubiquiti AC Mesh</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddDeviceDialogue;
