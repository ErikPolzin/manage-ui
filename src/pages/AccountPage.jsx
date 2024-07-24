import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import { fetchAPI } from "../keycloak";

export default function AccountPage() {
  const [loading, setLoading] = React.useState(false);
  const [savingChanges, setSavingChanges] = React.useState(false);
  const [account, setAccount] = React.useState(null);
  const [accountCopy, setAccountCopy] = React.useState(null);

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
    setAccountCopy(account);
  }, [account]);

  const handleChange = (e) => {
    setAccountCopy({ ...accountCopy, [e.target.name]: e.target.value });
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
        console.error("Error fetching account:", error);
      })
      .finally(() => {
        setSavingChanges(false);
      });
  };

  if (!accountCopy) return <div></div>;

  return (
    <Container maxWidth="sm" sx={{ pt: 3 }}>
      {loading || !accountCopy ? (
        <Box sx={{ display: 'flex', alignItems: "center" }}>
            <CircularProgress />
            <Typography>Loading account...</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="text"
              label="Username"
              name="username"
              value={accountCopy.username}
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
              onChange={handleChange}
              size="small"
              fullWidth
            ></TextField>
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
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox name="is_staff" checked={accountCopy.is_staff} onChange={handleChange} />
              }
              label="Staff Account"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="is_active"
                  checked={accountCopy.is_active}
                  onChange={handleChange}
                />
              }
              label="Active"
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
