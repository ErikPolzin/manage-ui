import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
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
import SettingsPage from "./pages/SettingsPage";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Toolbar from "@mui/material/Toolbar";
import makeTheme from "./theme";
import useWebSocket from "react-use-websocket";
import { usePersistantState } from "./hooks";
import ResourcesPage from "./pages/ResourcesPage";
import { MeshContext, UserContext, ApiSocketContext, ColorModeContext } from "./context";
import InteractiveAppTutor from "./components/tutorial/InteractiveAppTutor";

function App() {
  const { keycloak, initialized } = useKeycloak();
  const [open, setOpen] = usePersistantState("drawerOpen", true);
  const [mesh, setMesh] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const apiSocket = useWebSocket(`${process.env.REACT_APP_WS_URL}/ws/updates/`, {
    share: true,
    shouldReconnect: () => true,
  });
  const [mode, setMode] = usePersistantState("colorMode", "light");
  const theme = React.useMemo(() => makeTheme(mode), [mode]);

  const colorMode = {
    toggleColorMode: () => {
      setMode(mode === "light" ? "dark" : "light");
    },
  };

  const [tutorialActive, setTutorialActive] = React.useState(false);
  const [documentationOpen, setDocumentationOpen] = React.useState(false);
  const [documentationSideToolEnabled, setDocumentationSideToolEnabled] = React.useState(false);
  const [resourceCircleEnabled, setResourceCircleEnabled] = React.useState(true);
  const [resourceCirclePos, setResourceCirclePos] = usePersistantState("resourceCirclePosition", {
    positionY: "top",
    positionX: "right",
  });
  let resourceCircleInNavbar =
    resourceCirclePos.positionY === "top" && resourceCirclePos.positionX === "right";

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const toggleDocumentationOpen = () => {
    setDocumentationOpen(!documentationOpen);
  };

  React.useEffect(() => {
    if (keycloak.authenticated) {
      console.log("Loaded credentials for", keycloak.idTokenParsed.preferred_username);
      setUser(keycloak.idTokenParsed);
    }
  }, [keycloak.authenticated, keycloak.idTokenParsed]);

  React.useEffect(() => {
    if (mesh) console.log("Selected mesh", mesh.name);
  }, [mesh]);

  React.useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login();
    }
  }, [initialized, keycloak]);

  const handleExitTutorial = () => {
    setTutorialActive(false);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <ApiSocketContext.Provider value={apiSocket}>
          <UserContext.Provider value={{ user, setUser }}>
            <MeshContext.Provider value={{ mesh, setMesh }}>
              <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <NavBar
                  open={open}
                  onMenuClick={toggleDrawer}
                  toggleResourceCircle={() => setResourceCircleEnabled((prevValue) => !prevValue)}
                  resourceCircleEnabled={resourceCircleEnabled}
                  resourceCircleInNavbar={resourceCircleInNavbar}
                />
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
                      <Typography sx={{ marginTop: 1 }}>
                        Checking Keycloak credentials...
                      </Typography>
                    </Box>
                  ) : (
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/devices" element={<DevicePage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/alerts" element={<AlertsPage />} />
                      <Route path="/users" element={<UsersPage />} />
                      <Route path="/account" element={<AccountPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route
                        path="/resources"
                        element={
                          <ResourcesPage
                            onStartTutorial={() => setTutorialActive(true)}
                            toggleResourceCircle={() =>
                              setResourceCircleEnabled((prevValue) => !prevValue)
                            }
                            resourceCircleEnabled={resourceCircleEnabled}
                            onCircleReposition={(posY, posX) =>
                              setResourceCirclePos({ positionY: posY, positionX: posX })
                            }
                            circlePos={{
                              positionY: resourceCirclePos.positionY,
                              positionX: resourceCirclePos.positionX,
                            }}
                            openDocumentation={() => {
                              setDocumentationOpen(!documentationOpen);
                            }}
                            documentationSideToolEnabled={documentationSideToolEnabled}
                            toggleDocumentationSideTool={() => {
                              setDocumentationSideToolEnabled(!documentationSideToolEnabled);
                            }}
                          />
                        }
                      />
                    </Routes>
                  )}
                </main>
              </Box>
              <InteractiveAppTutor
                tutorialActive={tutorialActive}
                exitTutorial={() => setTutorialActive(false)}
                tutorialLogoSrc="/images/iNethiLogoWhite.png"
                documentationOpen={documentationOpen}
                toggleDocumentationOpen={toggleDocumentationOpen}
                documentationSideToolEnabled={documentationSideToolEnabled}
                resourceCircleEnabled={resourceCircleEnabled}
                resourceCircleIconSrc="/images/iNethiLogoWhite.png"
                resourceCirclePos={resourceCirclePos}
                resourceCircleSize={resourceCircleInNavbar ? 55 : 60}
                resourceCircleDistFromOuter={resourceCircleInNavbar ? 5 : 20}
                resourceCircleBorder={resourceCircleInNavbar ? "2px solid white" : "none"}
                openDocumentation={() => setDocumentationOpen(true)}
                demoMode={false}
              />
            </MeshContext.Provider>
          </UserContext.Provider>
        </ApiSocketContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
