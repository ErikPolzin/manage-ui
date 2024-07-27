// MeshDialog.js
import React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LocationPicker from "../LocationPicker";
import PasswordField from "../PasswordField";
import GenericDialog from "./GenericDialog";

const defaultMesh = {
  name: "",
  location: "",
  lat: null,
  lon: null,
};

export default function MeshDialog({ open, mesh, onClose, onAdd, onUpdate }) {
  const [data, setData] = React.useState(defaultMesh);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setData(mesh || defaultMesh);
  }, [mesh]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (loc) => {
    setData({ ...data, lat: loc.lat, lon: loc.lng });
  };

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      data={data}
      baseUrl="/monitoring/meshes/"
      originalData={mesh}
      typeName="Mesh"
      onAdd={onAdd}
      onUpdate={onUpdate}
      onError={setErrors}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Mesh Name"
            type="text"
            fullWidth
            value={data.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name ? errors.name.join("\n") : null}
          />
        </Grid>
        <Grid item xs={12}>
          <LocationPicker
            sx={{ py: 1 }}
            fullWidth
            text={data.location}
            onChange={handleChange}
            onChangeLatLon={handleLocationChange}
            name="location"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="dense"
            name="secure_ssid"
            label="Secure SSID"
            type="text"
            fullWidth
            value={data.secure_ssid}
            onChange={handleChange}
            helperText="The name of the staff wifi radio"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="dense"
            name="guest_ssid"
            label="Guest SSID"
            type="text"
            fullWidth
            value={data.guest_ssid}
            onChange={handleChange}
            helperText="The name of the guest wifi radio"
          />
        </Grid>
        <Grid item xs={12}>
          <PasswordField
            margin="dense"
            name="secure_ssid_passphrase"
            label="Secure SSID Passphrase"
            fullWidth
            value={data.secure_ssid_passphrase}
            onChange={handleChange}
            helperText="The passphrase to log in to the staff wifi"
          />
        </Grid>
      </Grid>
    </GenericDialog>
  );
}
