import React from "react";
import { MeshContext } from "../../context";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import GenericDialog from "./GenericDialog";

const defaultDevice = {
  name: "",
  mac: "",
  ip: "",
  mesh: null,
  hardware: "tl_eap225_3_o",
  description: "",
  last_contact_from_ip: "",
  created: new Date().toISOString(),
};

export default function DeviceDialog({ open, device, onClose, onAdd, onUpdate }) {
  const { mesh } = React.useContext(MeshContext);
  const [data, setData] = React.useState(defaultDevice);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setData({ ...(device || defaultDevice), mesh: mesh?.name });
  }, [device, mesh]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      data={data}
      baseUrl="/monitoring/devices/"
      originalData={device}
      typeName="Device"
      onAdd={onAdd}
      onUpdate={onUpdate}
      onError={setErrors}
      idField="mac"
      editVerb="Adopt"
    >
      <TextField
        margin="dense"
        name="mesh"
        label="Mesh"
        type="text"
        fullWidth
        disabled
        variant="outlined"
        inputProps={{ readOnly: true }}
        value={data.mesh || ""}
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
        value={data.name || ""}
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
        value={data.mac || ""}
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
        value={data.ip || ""}
        onChange={handleChange}
        error={Boolean(errors.ip)}
        helperText={errors.ip ? errors.ip.join("\n") : null}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Device Type</InputLabel>
        <Select name="hardware" value={data.hardware} label="Hardware" onChange={handleChange}>
          <MenuItem value="tl_eap225_3_o">TPLink EAP</MenuItem>
          <MenuItem value="ubnt_ac_mesh">Ubiquiti AC Mesh</MenuItem>
        </Select>
      </FormControl>
    </GenericDialog>
  );
}
