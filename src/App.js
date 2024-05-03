import React, { useState, useEffect } from "react";
import { ThemeProvider, styled } from "@mui/material/styles";
import { Dashboard, Router, Public, Map } from "@mui/icons-material";
import {
  Avatar,
  Typography,
  ListItemIcon,
  Box,
  Drawer,
  CssBaseline,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import DevicePage from "./pages/DevicePage";
import ServicesPage from "./pages/ServicesPage";
import NavBar from "./components/NavBar";
import theme from "./theme";

const drawerWidth = 240;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
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
  const location = useLocation();

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

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login();
    }
  }, [initialized, keycloak]);

  return (
    <ThemeProvider theme={theme}>
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
            <ListItemButton
              key="0"
              component={Link}
              to="/"
              selected={location.pathname === "/"}
            >
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton
              key="1"
              component={Link}
              to="/map"
              selected={location.pathname === "/map"}
            >
              <ListItemIcon>
                <Map />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
            <ListItemButton
              key="2"
              component={Link}
              to="/devices"
              selected={location.pathname === "/devices"}
            >
              <ListItemIcon>
                <Router />
              </ListItemIcon>
              <ListItemText primary="Devices" />
            </ListItemButton>
            <ListItemButton
              key="3"
              component={Link}
              to="/services"
              selected={location.pathname === "/services"}
            >
              <ListItemIcon>
                <Public />
              </ListItemIcon>
              <ListItemText primary="Services" />
            </ListItemButton>
          </List>
        </Drawer>
        <Main
          open={open}
          sx={{
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <DrawerHeader />
          {!initialized ? (
            <CircularProgress />
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/devices" element={<DevicePage />} />
              <Route path="/services" element={<ServicesPage />} />
            </Routes>
          )}
        </Main>
      </Box>
    </ThemeProvider>
  );
}

export default App;
