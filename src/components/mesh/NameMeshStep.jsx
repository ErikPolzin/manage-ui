import React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import PasswordField from "../PasswordField";

function NameMeshStep({ mesh, handleChange }) {
  React.useEffect(() => {
    mesh.guest_ssid = `${mesh.name} Guest`;
    mesh.secure_ssid = `${mesh.name} Wireless`;
  }, [mesh.name, handleChange]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Mesh Name"
          type="text"
          fullWidth
          value={mesh.name}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          margin="dense"
          name="secure_ssid"
          label="Secure SSID"
          type="text"
          fullWidth
          value={mesh.secure_ssid}
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
          value={mesh.guest_ssid}
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
          value={mesh.secure_ssid_passphrase}
          onChange={handleChange}
          helperText="The passphrase to log in to the staff wifi"
        />
      </Grid>
    </Grid>
  );
}

export default NameMeshStep;
