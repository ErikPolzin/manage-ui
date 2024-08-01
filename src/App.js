import React, { useState, useEffect } from "react";
import { ThemeProvider, styled } from "@mui/material/styles";
import { Dashboard, Router, Public, Error, Person } from "@mui/icons-material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import QuizIcon from "@mui/icons-material/Quiz";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import MeshDialog from "./components/dialogs/MeshDialog";
import HomePage from "./pages/HomePage";
import DevicePage from "./pages/DevicePage";
import ServicesPage from "./pages/ServicesPage";
import AlertsPage from "./pages/AlertsPage";
import UsersPage from "./pages/UsersPage";
import AccountPage from "./pages/AccountPage";
import NavBar from "./components/NavBar";
import theme from "./theme";
import { usePersistantState } from "./hooks";
import { fetchAPI } from "./keycloak";
import ResourcesPage from "./pages/ResourcesPage";
import Tutorial from "./components/tutorial/Tutorial";
import tutorialData from "./tutorialData/tutorialData";
import zIndex from "@mui/material/styles/zIndex";

const drawerWidth = 240;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  minHeight: "calc(100vh - 64px)",
  maxWidth: open ? `calc(100vw - ${drawerWidth}px)` : "calc(100vw - 65px)",
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }),
);

export const MeshContext = React.createContext(null);

function App() {
  const { keycloak, initialized } = useKeycloak();
  const [open, setOpen] = usePersistantState("drawerOpen", true);
  const [meshOpen, setMeshOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [initials, setInitials] = useState("");
  const [mesh, setMesh] = usePersistantState("mesh", "");
  // Special null state for meshes so that the mesh select doesn't have
  // an undefined value before meshes are loaded.
  const [meshes, setMeshes] = useState(null);
  const location = useLocation();

  const [tutorialActive, setTutorialActive] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (keycloak.authenticated) {
      let userData = keycloak.idTokenParsed;
      setUsername(userData.preferred_username);
      if (userData.given_name && userData.family_name)
        setInitials(userData.given_name[0] + userData.family_name[0]);
    }
  }, [keycloak, keycloak.idTokenParsed]);

  const fetchMeshes = () => {
    fetchAPI("/monitoring/meshes/")
      .then((data) => {
        setMeshes(data);
      })
      .catch((error) => {
        console.log("Error fetching meshes: " + error);
        setMeshes(null);
      });
  };

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login();
    }
    if (initialized && keycloak.authenticated) {
      fetchMeshes();
    }
  }, [initialized, keycloak]);

  const handleExitTutorial = () => {
    setTutorialActive(false);
  };

  return (
    <ThemeProvider theme={theme}>
      {/* {tutorialActive && <div style={{ height: "29.5px" }}></div>} */}
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <NavBar open={open} onMenuClick={toggleDrawer} />
        <StyledDrawer variant="permanent" open={open} sx={{ zIndex: 901 }}>
          <DrawerHeader>
            <ListItemButton key="account" component={Link} to="/account">
              <ListItemAvatar>
                <Avatar>{initials}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={username} />
            </ListItemButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItemButton
              key="dashboard"
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
              key="devices"
              component={Link}
              to="/devices"
              selected={location.pathname.startsWith("/devices")}
            >
              <ListItemIcon>
                <Router />
              </ListItemIcon>
              <ListItemText primary="Devices" />
            </ListItemButton>
            <ListItemButton
              key="users"
              component={Link}
              to="/users"
              selected={location.pathname.startsWith("/users")}
            >
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
            <ListItemButton
              key="services"
              component={Link}
              to="/services"
              selected={location.pathname.startsWith("/services")}
            >
              <ListItemIcon>
                <Public />
              </ListItemIcon>
              <ListItemText primary="Services" />
            </ListItemButton>
            <ListItemButton
              key="4"
              component={Link}
              to="/alerts"
              selected={location.pathname.startsWith("/alerts")}
            >
              <ListItemIcon>
                <Error />
              </ListItemIcon>
              <ListItemText primary="Alerts" />
            </ListItemButton>
            <ListItemButton
              key="5"
              component={Link}
              to="/resources"
              selected={location.pathname.startsWith("/resources")}
            >
              <ListItemIcon>
                <QuizIcon />
              </ListItemIcon>
              <ListItemText primary="Resources" />
            </ListItemButton>
          </List>
          {open && meshes !== null ? (
            <List sx={{ position: "absolute", bottom: 0 }}>
              <ListItem>
                <FormControl sx={{ m: 0, width: 200 }} size="small">
                  <InputLabel>Mesh</InputLabel>
                  <Select value={mesh} onChange={(e) => setMesh(e.target.value)} label="Mesh">
                    {meshes.map((m) => (
                      <MenuItem key={m.name} value={m.name}>
                        {m.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ListItem>
              <ListItem>
                <Button variant="outlined" onClick={() => setMeshOpen(true)} fullWidth>
                  Add Mesh
                </Button>
              </ListItem>
            </List>
          ) : null}
        </StyledDrawer>
        <MeshContext.Provider value={{ mesh, setMesh }}>
          <Main open={open}>
            <DrawerHeader />
            {!initialized ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
                <Typography sx={{ marginTop: 1 }}>Checking Keycloak credentials...</Typography>
              </Box>
            ) : (
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/devices" element={<DevicePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route
                  path="/resources"
                  element={<ResourcesPage onActivate={() => setTutorialActive(true)} />}
                />
              </Routes>
            )}
          </Main>
          <MeshDialog open={meshOpen} onClose={() => setMeshOpen(false)}></MeshDialog>
        </MeshContext.Provider>
      </Box>
      {tutorialActive && (
        <Tutorial tutorialContent={tutorialData} onExit={handleExitTutorial}></Tutorial>
      )}
    </ThemeProvider>
  );
}

export default App;
