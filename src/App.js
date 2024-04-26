import React, { useState, useEffect } from "react";
import { ThemeProvider, styled } from "@mui/material/styles";
import { Avatar, Typography, ListItemIcon } from "@mui/material";
import { Dashboard, Router, Public } from "@mui/icons-material";
import {
  Box,
  Drawer,
  CssBaseline,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import theme from "./theme";
import DevicePage from "./pages/DevicePage";
import { useKeycloak } from "@react-keycloak/web";
import ServicesPage from "./pages/ServicesPage";
import NavBar from "./components/NavBar";

const drawerWidth = 240;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function App() {
  const { keycloak, initialized } = useKeycloak();
  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState("");
  const [initials, setInitials] = useState("");
  const toggleDrawer = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (keycloak.authenticated) {
      let userData = keycloak.idTokenParsed;
      setUsername(userData.preferred_username);
      setInitials(userData.given_name[0] + userData.family_name[0]);
    }
  }, [keycloak, keycloak.idTokenParsed]);

  if (!initialized) {
    return <div>Loading...</div>;
  }
  if (!keycloak.authenticated) {
    keycloak.login();
  }
  if (keycloak.authenticated) {
    console.log("Authenticated");
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <NavBar open={open} onMenuClick={toggleDrawer} />
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              ".MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <Avatar>{initials}</Avatar>
              <Typography mx={2}>{username}</Typography>
            </DrawerHeader>
            <Divider />
            <List>
              <ListItem key="0" disablePadding component={Link} to="/">
                <ListItemButton>
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem key="1" disablePadding component={Link} to="/devices">
                <ListItemButton>
                  <ListItemIcon>
                    <Router />
                  </ListItemIcon>
                  <ListItemText primary="Devices" />
                </ListItemButton>
              </ListItem>
              <ListItem key="2" disablePadding component={Link} to="/services">
                <ListItemButton>
                  <ListItemIcon>
                    <Public />
                  </ListItemIcon>
                  <ListItemText primary="Services" />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
          <Main
            open={open}
            sx={{
              minHeight: "calc(100vh - 64px)",
            }}
          >
            <DrawerHeader />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/devices" element={<DevicePage />} />
              <Route path="/services" element={<ServicesPage />} />
            </Routes>
          </Main>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
