import React from "react";
import { MeshContext } from "../App";
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
import { fetchAPI } from "../keycloak";

export default function AddDeviceDialog({ open, device, onClose, onAdd, onAdopt }) {
  const { mesh } = React.useContext(MeshContext);
  const [defaultDevice, setDefaultDevice] = React.useState({
    name: "",
    mac: "",
    ip: "",
    mesh: mesh,
    hardware: "tl_eap225_3_o",
    description: "",
    last_contact_from_ip: "",
    created: new Date().toISOString(),
  });
  const [newDevice, setNewDevice] = React.useState(defaultDevice);
  const [errors, setErrors] = React.useState([]);

  React.useEffect(() => {
    setNewDevice(device || defaultDevice);
  }, [device, defaultDevice]);

  const handleChange = (e) => {
    setNewDevice({ ...newDevice, [e.target.name]: e.target.value });
  };

  const addOrAdoptDevice = () => {
    if (device) {
      let data = {...newDevice, mesh: mesh};
      fetchAPI(`/monitoring/devices/${device.mac}/`, "PUT", data)
        .then((response) => {
          onAdopt(response);
          onClose();
        })
        .catch((error) => {
          setErrors(error);
        });
    } else {
      fetchAPI("/monitoring/devices/", "POST", newDevice)
        .then((response) => {
          onAdd(response);
          onClose();
        })
        .catch((error) => {
          setErrors(error);
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} onAbort={onClose}>
      <DialogTitle>Add New Device</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="mesh"
          label="Mesh"
          type="text"
          fullWidth
          disabled
          variant="outlined"
          inputProps={{ readOnly: true }}
          value={newDevice.mesh || mesh}
          onChange={handleChange}
          error={Boolean(errors.mesh)}
          helperText={errors.mesh ? errors.mesh.join("\n") : null}
        />
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={addOrAdoptDevice}>{device ? "Adopt" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
}
