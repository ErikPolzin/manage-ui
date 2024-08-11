import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Badge from "@mui/material/Badge";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { useLocation, Link } from "react-router-dom";
import { ReadyState } from "react-use-websocket";
import { useKeycloak } from "@react-keycloak/web";
// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import RouterIcon from "@mui/icons-material/Router";
import PublicIcon from "@mui/icons-material/Public";
import ErrorIcon from "@mui/icons-material/Error";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import PowerIcon from "@mui/icons-material/Power";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import SettingsIcon from "@mui/icons-material/Settings";
import QuizIcon from "@mui/icons-material/Quiz";
// Custom components
import MeshDialog from "./dialogs/MeshDialog";
import { usePersistantState } from "../hooks";
import { fetchAPI } from "../keycloak";
import { UserContext, ApiSocketContext, MeshContext } from "../context";

const drawerWidth = 240;

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

// From https://mui.com/material-ui/react-avatar/
function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(first_name, last_name) {
  return {
    sx: {
      bgcolor: stringToColor(`${first_name} ${last_name}`),
    },
    children: `${first_name[0]}${last_name[0]}`,
  };
}

const CONNECTION_STATUSES = {
  [ReadyState.CONNECTING]: "Connecting to API",
  [ReadyState.OPEN]: "Connected to API",
  [ReadyState.CLOSING]: "Closing connection",
  [ReadyState.CLOSED]: "Closed connection",
  [ReadyState.UNINSTANTIATED]: "Uninstantiated",
};

export default function Sidebar({ open }) {
  const [meshName, setMeshName] = usePersistantState("mesh", "");
  const [meshOpen, setMeshOpen] = React.useState(false);
  const [meshes, setMeshes] = React.useState([]);
  const { user } = React.useContext(UserContext);
  const { mesh, setMesh } = React.useContext(MeshContext);
  const { readyState } = React.useContext(ApiSocketContext);
  const [isConnected, setIsConnected] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState("Unknown");
  const location = useLocation();
  const { keycloak, initialized } = useKeycloak();

  React.useEffect(() => {
    setIsConnected(readyState === ReadyState.OPEN);
    setConnectionStatus(CONNECTION_STATUSES[readyState]);
  }, [readyState]);

  // Sync the mesh when the selected mesh name changes
  React.useEffect(() => {
    if (!meshes || !meshName) {
      setMesh(null);
    } else {
      setMesh(meshes[meshes.map((m) => m.name).indexOf(meshName)]);
    }
  }, [meshName, meshes, setMesh]);

  const fetchMeshes = () => {
    fetchAPI("/monitoring/meshes/")
      .then((data) => {
        setMeshes(data);
      })
      .catch((error) => {
        console.error("Error fetching meshes: " + error);
      });
  };

  // Fatch meshes as soon as keycloak sorts its stuff out
  React.useEffect(() => {
    if (initialized && keycloak.authenticated) {
      fetchMeshes();
    }
  }, [initialized, keycloak.authenticated]);

  return (
    <StyledDrawer id="sidebar-styled-drawer" variant="permanent" open={open}>
      <DrawerHeader>
        {user && (
          <ListItemButton dense key="account" component={Link} to="/account">
            {user.family_name && user.given_name && (
              <ListItemAvatar>
                <Avatar {...stringAvatar(user.family_name, user.given_name)} />
              </ListItemAvatar>
            )}
            <ListItemText primary={user.name} secondary={user.email} />
          </ListItemButton>
        )}
      </DrawerHeader>
      <Divider />
      <MeshDialog open={meshOpen} onClose={() => setMeshOpen(false)}></MeshDialog>
      {/* Not sure why setting overflowY seems to reset overflowX as well, manually override */}
      <List sx={{ overflowY: "auto", overflowX: "hidden" }}>
        <ListItemButton
          id="sidebar-dashboard-item"
          key="dashboard"
          component={Link}
          to="/"
          selected={location.pathname === "/"}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton
          id="sidebar-devices-item"
          key="devices"
          component={Link}
          to="/devices"
          selected={location.pathname.startsWith("/devices")}
        >
          <ListItemIcon>
            <RouterIcon />
          </ListItemIcon>
          <ListItemText primary="Devices" />
        </ListItemButton>
        <ListItemButton
          id="sidebar-users-item"
          key="users"
          component={Link}
          to="/users"
          selected={location.pathname.startsWith("/users")}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
        <ListItemButton
          id="sidebar-services-item"
          key="services"
          component={Link}
          to="/services"
          selected={location.pathname.startsWith("/services")}
        >
          <ListItemIcon>
            <PublicIcon />
          </ListItemIcon>
          <ListItemText primary="Services" />
        </ListItemButton>
        <ListItemButton
          id="sidebar-alerts-item"
          key="4"
          component={Link}
          to="/alerts"
          selected={location.pathname.startsWith("/alerts")}
        >
          <ListItemIcon>
            <ErrorIcon />
          </ListItemIcon>
          <ListItemText primary="Alerts" />
        </ListItemButton>
        <ListItemButton
          id="sidebar-resources-item"
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
        <ListItemButton
          id="sidebar-settings-item"
          key="6"
          component={Link}
          to="/settings"
          selected={location.pathname.startsWith("/settings")}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
      <Box sx={{ flexGrow: 1}} />
      <List>
        <ListItem>
          <ListItemIcon>
            <Badge variant="dot" color={isConnected ? "success" : "error"}>
              {isConnected ? <PowerIcon /> : <PowerOffIcon />}
            </Badge>
          </ListItemIcon>
          <ListItemText primary={connectionStatus} />
        </ListItem>
        {/* Only display mesh picker is sidebar is expanded, looks weird otherwise */}
        {open && <ListItem>
          <FormControl fullWidth size="small">
            <InputLabel>Mesh</InputLabel>
            <Select value={meshName} onChange={(e) => setMeshName(e.target.value)} label="Mesh">
              {/* If meshes haven't been fetched yet just have the active mesh available */}
              {(meshes.length > 0 ? meshes : [{ name: meshName }]).map((m) => (
                <MenuItem key={m.name} value={m.name}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>}
        <ListItemButton onClick={() => setMeshOpen(true)}>
          <ListItemIcon>
            <AddIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Add Mesh" />
        </ListItemButton>
      </List>
    </StyledDrawer>
  );
}
