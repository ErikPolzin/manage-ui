// MeshDialog.js
import React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import LocationPicker from "../LocationPicker";
import PasswordField from "../PasswordField";
import GenericDialog from "./GenericDialog";
import { UserContext } from "../../context";
import { fetchAPI } from "../../keycloak";
import { useKeycloak } from "@react-keycloak/web";

const defaultMesh = {
  name: "",
  location: "",
  lat: null,
  lon: null,
  maintainers: [],
};

export default function MeshDialog({ open, mesh, onClose, onAdd, onUpdate }) {
  const { user } = React.useContext(UserContext);
  const [users, setUsers] = React.useState([]);
  const [data, setData] = React.useState(defaultMesh);
  const [errors, setErrors] = React.useState({});
  const { keycloak } = useKeycloak();

  React.useEffect(() => {
    setData({ ...(mesh || defaultMesh), maintainers: [user?.preferred_username] });
  }, [mesh, user]);

  React.useEffect(() => {
    if (keycloak.authenticated) {
      fetchAPI("/accounts/users/").then((data) => {
        setUsers(data);
      });
    }
  }, [keycloak.authenticated]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleLocationChange = (loc) => {
    setData({ ...data, lat: loc.lat(), lon: loc.lng() });
  };

  const handleReset = () => {
    setData(defaultMesh);
    setErrors({});
  };

  const toggleMaintainer = (uid) => {
    if (uid === user?.preferred_username) return;
    let idx = data.maintainers.indexOf(uid);
    if (idx === -1) {
      data.maintainers.push(uid);
    } else {
      data.maintainers.splice(idx, 1);
    }
    setData({...data});
  };

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      onReset={handleReset}
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
        <Grid item xs={12}>
          <List subheader={<ListSubheader>Maintainers</ListSubheader>} dense>
            <Divider />
            {users.map((u) => [
              <ListItem key={u.id}>
                <ListItemIcon>
                  <Checkbox
                    disabled={u.username === user?.preferred_username}
                    onClick={(e) => toggleMaintainer(u.username)}
                    checked={data.maintainers.indexOf(u.username) !== -1}
                  />
                </ListItemIcon>
                <ListItemText primary={u.username} />
              </ListItem>,
              <Divider key={`${u.id}-divider`} />,
            ])}
          </List>
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
