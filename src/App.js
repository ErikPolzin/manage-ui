import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { Avatar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
      setInitials(userData.given_name[0]+userData.family_name[0]);
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
            <ListItem key="0" disablePadding>
              <ListItemButton href="/">
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem key="1" disablePadding>
              <ListItemButton href="/devices">
                <ListItemText primary="Devices" />
              </ListItemButton>
            </ListItem>
            <ListItem key="2" disablePadding>
              <ListItemButton href="/services">
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
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/devices" element={<DevicePage />} />
              <Route path="/services" element={<ServicesPage />} />
            </Routes>
          </BrowserRouter>
        </Main>
      </Box>
    </ThemeProvider>
  );
}

export default App;
