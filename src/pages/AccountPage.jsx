import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import MuiPhoneNumber from "mui-phone-number";
import { fetchAPI } from "../keycloak";

export default function AccountPage() {
  const [loading, setLoading] = React.useState(false);
  const [savingChanges, setSavingChanges] = React.useState(false);
  const [account, setAccount] = React.useState(null);
  const [accountCopy, setAccountCopy] = React.useState(null);
  const [meshes, setMeshes] = React.useState([]);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setLoading(true);
    fetchAPI("/accounts/users/current/")
      .then((data) => {
        setAccount(data);
      })
      .catch((error) => {
        console.error("Error fetching account:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    fetchAPI("/monitoring/meshes/")
      .then((data) => {
        setMeshes(data);
      })
      .catch((error) => {
        console.error("Error fetching meshes:", error);
      });
  }, []);

  React.useEffect(() => {
    setAccountCopy(JSON.parse(JSON.stringify(account)));
  }, [account]);

  const handleChange = (e) => {
    let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (e.target.name.startsWith("profile.")) {
      let fieldName = e.target.name.substring(8); // length of 'profile.'
      let newProfile = { ...(accountCopy.profile || {}), [fieldName]: value };
      setAccountCopy({ ...accountCopy, profile: newProfile });
      setErrors({ ...errors, [fieldName]: null});
    } else {
      setAccountCopy({ ...accountCopy, [e.target.name]: value });
      setErrors({ ...errors, [e.target.name]: null});
    }
  };

  const isModified = () => {
    return JSON.stringify(account) !== JSON.stringify(accountCopy);
  };

  const saveChanges = () => {
    setSavingChanges(true);
    fetchAPI("/accounts/users/current/", "PUT", accountCopy)
      .then((data) => {
        setAccount(data);
      })
      .catch((error) => {
        console.error("Error updating account:", error);
        setErrors(error);
      })
      .finally(() => {
        setSavingChanges(false);
      });
  };

  const addOrRemoveMesh = (meshName) => {
    const index = accountCopy.profile.alert_meshes.indexOf(meshName);
    if (index === -1) {
      accountCopy.profile.alert_meshes.push(meshName);
    } else {
      accountCopy.profile.alert_meshes.splice(index, 1);
    }
    setAccountCopy({ ...accountCopy });
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 3 }}>
      {loading || !accountCopy ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <CircularProgress />
          <Typography>Loading account...</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Typography variant="h5">Account for {accountCopy.username}</Typography>
          <Grid item xs={12}>
            <TextField
              type="text"
              label="Username"
              name="username"
              value={accountCopy.username}
              error={Boolean(errors.username)}
              helperText={errors.username ? errors.username.join("\n") : null}
              disabled
              fullWidth
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              label="Email"
              name="email"
              value={accountCopy.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={
                errors.email
                  ? errors.email.join("\n")
                  : null
              }
              fullWidth
            ></TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              label="First Name"
              name="first_name"
              value={accountCopy.first_name}
              onChange={handleChange}
              error={Boolean(errors.first_name)}
              helperText={errors.first_name ? errors.first_name.join("\n") : null}
              size="small"
              fullWidth
            ></TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              label="Last Name"
              name="last_name"
              value={accountCopy.last_name}
              error={Boolean(errors.last_name)}
              helperText={errors.last_name ? errors.last_name.join("\n") : null}
              onChange={handleChange}
              size="small"
              fullWidth
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <MuiPhoneNumber
              defaultCountry="za"
              onChange={(v) => handleChange({ target: { name: "profile.phone_number", value: v } })}
              value={accountCopy.profile.phone_number}
              name="profile.phone_number"
              error={Boolean(errors.phone_number)}
              helperText={
                errors.phone_number
                  ? errors.phone_number.join("\n")
                  : "Alerts will be sent to this number."
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="profile.alert_notifications_enabled"
                  checked={accountCopy.profile?.alert_notifications_enabled}
                  onChange={handleChange}
                />
              }
              label="Alert Notifications"
            />
            <List subheader={<ListSubheader>Alert Sources</ListSubheader>} dense>
              <Divider />
              {meshes.map((mesh) => [
                <ListItem
                  key={mesh.name}
                  disabled={!accountCopy.profile.alert_notifications_enabled}
                >
                  <ListItemIcon>
                    <Checkbox
                      disabled={!accountCopy.profile.alert_notifications_enabled}
                      onClick={(e) => addOrRemoveMesh(mesh.name)}
                      edge="start"
                      checked={accountCopy.profile.alert_meshes.indexOf(mesh.name) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={mesh.name} />
                </ListItem>,
                <Divider key={`${mesh.name}-divider`} />,
              ])}
            </List>
          </Grid>
          <Grid item xs={12}>
            <List subheader={<ListSubheader>Groups</ListSubheader>} dense>
              <Divider />
              {accountCopy.groups.map((group) => [
                <ListItem key={group}>
                  <ListItemText primary={group} />
                </ListItem>,
                <Divider key={`${group}-divider`} />,
              ])}
            </List>
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
