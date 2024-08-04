import React from "react";
import { ThemeProvider, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from "@mui/material/CircularProgress";
import { Routes, Route } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import HomePage from "./pages/HomePage";
import DevicePage from "./pages/DevicePage";
import ServicesPage from "./pages/ServicesPage";
import AlertsPage from "./pages/AlertsPage";
import UsersPage from "./pages/UsersPage";
import AccountPage from "./pages/AccountPage";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Toolbar from "@mui/material/Toolbar";
import theme from "./theme";
import useWebSocket from "react-use-websocket";
import { usePersistantState } from "./hooks";
import { MeshContext, UserContext, ApiSocketContext } from "./context";

function App() {
  const { keycloak, initialized } = useKeycloak();
  const [open, setOpen] = usePersistantState("drawerOpen", true);
  const [mesh, setMesh] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const apiSocket = useWebSocket(`${process.env.REACT_APP_WS_URL}/ws/updates/`, {
    share: true,
    shouldReconnect: () => true,
  });

  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    if (keycloak.authenticated) {
      console.log("User set to: ", keycloak.idTokenParsed);
      setUser(keycloak.idTokenParsed);
    }
  }, [keycloak.authenticated, keycloak.idTokenParsed]);

  React.useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login();
    }
  }, [initialized, keycloak]);

  return (
    <ThemeProvider theme={theme}>
      <ApiSocketContext.Provider value={apiSocket}>
        <UserContext.Provider value={{ user, setUser }}>
          <MeshContext.Provider value={{ mesh, setMesh }}>
            <Box sx={{ display: "flex" }}>
              <CssBaseline />
              <NavBar open={open} onMenuClick={toggleDrawer} />
              <Sidebar open={open} />
              <main
                style={{
                  flexGrow: 1,
                  minHeight: "calc(100vh - 64px)",
                  maxWidth: open ? `calc(100vw - 240px)` : "calc(100vw - 65px)",
                }}
              >
                {/* necessary for content to be below app bar */}
                <Toolbar />
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
                  </Routes>
                )}
              </main>
            </Box>
          </MeshContext.Provider>
        </UserContext.Provider>
      </ApiSocketContext.Provider>
    </ThemeProvider>
  );
}

export default App;
