import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { fetchAPI } from "../keycloak";
import { MeshContext } from "../context";

export default function AccountPage() {
  const [savingChanges, setSavingChanges] = React.useState(false);
  const { mesh, setMesh } = React.useContext(MeshContext);
  const [settings, setSettings] = React.useState(null);
  const [settingsCopy, setSettingsCopy] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setSettings(mesh?.settings);
  }, [mesh?.settings]);

  React.useEffect(() => {
    setSettingsCopy(settings);
  }, [settings]);

  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.name]: null });
    setSettingsCopy({ ...settingsCopy, [e.target.name]: e.target.value });
  };

  const handleCheckChange = (e) => {
    setSettingsCopy({ ...settingsCopy, [e.target.name]: e.target.checked });
  };

  const isModified = () => {
    return JSON.stringify(settings) !== JSON.stringify(settingsCopy);
  };

  const saveChanges = () => {
    setSavingChanges(true);
    fetchAPI(`/monitoring/meshes/${mesh.name}/update_settings/`, "PUT", settingsCopy)
      .then((data) => {
        setMesh({ ...mesh, settings: data });
        setErrors({});
      })
      .catch((error) => {
        console.error("Error saving settings:", error);
        setErrors(error);
      })
      .finally(() => {
        setSavingChanges(false);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 3 }}>
      {!settingsCopy ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Typography>No settings found!</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Typography variant="h5">Settings for {mesh.name}</Typography>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="alerts_enabled"
                  checked={settingsCopy.alerts_enabled}
                  onChange={handleCheckChange}
                />
              }
              label="Enable Alerts"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="number"
              label="CPU Warning Level"
              name="check_cpu"
              value={settingsCopy.check_cpu || ""}
              onChange={handleChange}
              disabled={!settingsCopy.alerts_enabled}
              InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
              error={Boolean(errors.check_cpu)}
              helperText={errors.check_cpu ? errors.check_cpu.join("\n") : null}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="number"
              label="Memory Warning Level"
              name="check_mem"
              value={settingsCopy.check_mem || ""}
              onChange={handleChange}
              disabled={!settingsCopy.alerts_enabled}
              InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
              error={Boolean(errors.check_mem)}
              helperText={errors.check_mem ? errors.check_mem.join("\n") : null}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              label="Report Timeout"
              name="check_active"
              value={settingsCopy.check_active || ""}
              onChange={handleChange}
              disabled={!settingsCopy.alerts_enabled}
              error={Boolean(errors.check_active)}
              helperText={
                errors.check_active
                  ? errors.check_active.join("\n")
                  : "If the server doesn't receive a report in this time, a node is considered inactive"
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              label="Maximum RTT"
              name="check_rtt"
              value={settingsCopy.check_rtt || ""}
              onChange={handleChange}
              InputProps={{ endAdornment: <InputAdornment position="end">ms</InputAdornment> }}
              disabled={!settingsCopy.alerts_enabled}
              error={Boolean(errors.check_rtt)}
              helperText={
                errors.check_rtt
                  ? errors.check_rtt.join("\n")
                  : "If pings take longer than this to get back to the server, generate a warning"
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              loading={savingChanges}
              variant="contained"
              fullWidth
              disabled={!isModified()}
              onClick={saveChanges}
            >
              Save Changes
            </LoadingButton>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
