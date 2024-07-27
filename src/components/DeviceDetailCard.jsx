import React from "react";
import ResourcesGraph from "./graphs/ResourcesGraph";
import RetriesGraph from "./graphs/RetriesGraph";
import AlertList from "./AlertList";
import { formatBitsPerSecond } from "../units";
import { useSizeOf } from "../hooks";
import { fetchAPI } from "../keycloak";
// MUI components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import AppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material";
// Experimental MUI components
import LoadingButton from "@mui/lab/LoadingButton";
// Icons
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SignalWifiStatusbarConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BarChartIcon from "@mui/icons-material/BarChart";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CloseIcon from "@mui/icons-material/Close";

function DeviceTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`device-tabpanel-${index}`}
      aria-labelledby={`device-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `device-tab-${index}`,
    "aria-controls": `device-tabpanel-${index}`,
  };
}

function StatusCheck({ passed, title, feedback }) {
  return (
    <ListItem>
      <ListItemIcon>
        {passed === true ? (
          <CheckCircleOutlineIcon color="success" />
        ) : (
          <CancelOutlinedIcon color="warning" />
        )}
      </ListItemIcon>
      <ListItemText primary={title} secondary={feedback} />
    </ListItem>
  );
}

function DeviceDetailCard({ device, onUpdate, onClose, ...props }) {
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);
  const [puttingData, setPuttingData] = React.useState(false);
  const [sendingRebootRequest, setSendingRebootRequest] = React.useState(false);
  const [cellWidth, cellHeight] = useSizeOf("detail-cell");
  const [deviceCopy, setDeviceCopy] = React.useState(device);

  React.useEffect(() => {
    setDeviceCopy(device);
  }, [device]);

  const handleChange = (e) => {
    setDeviceCopy({ ...deviceCopy, [e.target.name]: e.target.value });
  };

  const compareObjs = (o1, o2) => {
    return JSON.stringify(o1) === JSON.stringify(o2);
  };

  const putChanges = () => {
    setPuttingData(true);
    fetchAPI(`/monitoring/devices/${device.mac}/`, "PUT", deviceCopy)
      .then((response) => {
        if (onUpdate) onUpdate(response);
      })
      .finally(() => {
        setPuttingData(false);
      });
  };

  const sendRebootRequest = () => {
    setSendingRebootRequest(true);
    fetchAPI(`/monitoring/devices/${device.mac}/`, "PATCH", { reboot_flag: true })
      .then((response) => {
        if (onUpdate) onUpdate(response);
      })
      .finally(() => {
        setSendingRebootRequest(false);
      });
  };

  return (
    <Card
      {...props}
      sx={{
        backgroundColor: theme.palette.action.selected,
        // Device details remain fixed when the rest of the page is scrollable
        [theme.breakpoints.up("lg")]: {
          position: "fixed",
          top: "70px",
          right: "8px",
          width: `${cellWidth - 16}px`,
        },
      }}
    >
      <AppBar position="static" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {"Device: " + device?.name}
          </Typography>
          <IconButton color="inherit" aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Tabs
          centered
          sx={{ bgcolor: "primary.light" }}
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          indicatorColor="secondary"
          textColor="inherit"
        >
          <Tab icon={<VisibilityIcon />} aria-label="Overview" {...a11yProps(0)} />
          <Tab icon={<BarChartIcon />} aria-label="Graphs" {...a11yProps(1)} />
          <Tab icon={<ErrorIcon />} aria-label="Alerts" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      {device ? (
        <CardContent
          sx={{
            padding: 1,
            [theme.breakpoints.up("lg")]: {
              // window - navbar - card header - padding - some extra padding
              maxHeight: "calc(100vh - 112px - 64px - 16px - 10px)",
              overflowY: "auto",
            },
          }}
        >
          <DeviceTabPanel value={tabValue} index={0}>
            {deviceCopy && (
              <Card variant="outlined" sx={{ marginBottom: 1 }}>
                <CardHeader subheader="Overview" avatar={<InfoIcon />} />
                <CardContent sx={{ paddingY: 0 }}>
                  <Box component="form" noValidate autoComplete="off" sx={{ marginBottom: 2 }}>
                    <TextField
                      id="device-name"
                      label="Name"
                      name="name"
                      value={deviceCopy.name || ""}
                      onChange={handleChange}
                      margin="dense"
                      fullWidth
                    />
                    <TextField
                      id="device-description"
                      label="Description"
                      name="description"
                      value={deviceCopy.description || ""}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      margin="dense"
                      fullWidth
                    />
                    <TextField
                      id="device-hardware"
                      label="Model"
                      name="hardware"
                      value={deviceCopy.hardware || ""}
                      onChange={handleChange}
                      margin="dense"
                      select
                      fullWidth
                    >
                      <MenuItem value={"tl_eap225_3_o"}>TPLink EAP</MenuItem>
                      <MenuItem value={"ubnt_ac_mesh"}>Ubiquiti AC Mesh</MenuItem>
                      <MenuItem value={"U7MSH"}>U7MSH</MenuItem>
                    </TextField>
                    <TextField
                      id="device-mac"
                      disabled
                      label="MAC Address"
                      name="mac"
                      value={deviceCopy.mac || ""}
                      variant="filled"
                      size="small"
                      margin="dense"
                      fullWidth
                    />
                    <TextField
                      id="device-ip"
                      disabled
                      label="IP Address"
                      name="ip"
                      value={deviceCopy.ip || ""}
                      variant="filled"
                      size="small"
                      margin="dense"
                      fullWidth
                    />
                  </Box>
                  <LoadingButton
                    loading={puttingData}
                    variant="contained"
                    fullWidth
                    disabled={compareObjs(device, deviceCopy)}
                    onClick={putChanges}
                  >
                    Save
                  </LoadingButton>
                </CardContent>
              </Card>
            )}
            <Card variant="outlined" sx={{ marginBottom: 1 }}>
              <CardHeader
                subheader={`Status: ${device.health_status}`}
                avatar={<QuestionMarkIcon />}
              />
              <CardContent sx={{ paddingY: 0 }}>
                <List dense>
                  {device.checks.map((check) => (
                    <StatusCheck key={check.title} {...check} />
                  ))}
                </List>
              </CardContent>
            </Card>
          </DeviceTabPanel>
          <DeviceTabPanel value={tabValue} index={1}>
            <Card variant="outlined" sx={{ marginBottom: 1 }}>
              <CardHeader
                subheader="TX Retries"
                avatar={<SignalWifiStatusbarConnectedNoInternet4Icon />}
              />
              <CardContent sx={{ paddingY: 0 }}>
                <RetriesGraph deviceMac={device.mac} />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginX: 1,
                    marginY: 2,
                    fontSize: "0.9rem",
                  }}
                >
                  <Box
                    component={"span"}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 1,
                      color: theme.palette.graphs.dataRecv,
                    }}
                  >
                    <ArrowDownwardIcon />{" "}
                    {device.download_speed !== null
                      ? formatBitsPerSecond(device.download_speed)
                      : "??"}
                  </Box>
                  <Box
                    component={"span"}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: theme.palette.graphs.dataSent,
                    }}
                  >
                    <ArrowUpwardIcon />{" "}
                    {device.upload_speed !== null ? formatBitsPerSecond(device.upload_speed) : "??"}
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardHeader subheader="Resources" avatar={<MonitorHeartIcon />} />
              <CardContent sx={{ paddingY: 0 }}>
                <ResourcesGraph deviceMac={device.mac} />
              </CardContent>
            </Card>
          </DeviceTabPanel>
          <DeviceTabPanel value={tabValue} index={2}>
            <Card variant="outlined">
              <CardHeader subheader="Alert History" avatar={<ErrorIcon />} />
              <CardContent sx={{ paddingY: 0 }}>
                <AlertList alerts={device.latest_alerts} />
              </CardContent>
            </Card>
          </DeviceTabPanel>
          <CardActions sx={{ flexDirection: "column" }}>
            <LoadingButton
              fullWidth
              variant="contained"
              disabled={device.reboot_flag || device.status === "offline"}
              onClick={sendRebootRequest}
              loading={sendingRebootRequest}
            >
              Reboot
            </LoadingButton>
            {device.reboot_flag && (
              <Typography variant="caption" color="red" sx={{ alignSelf: "start" }}>
                Device flagged for reboot
              </Typography>
            )}
          </CardActions>
        </CardContent>
      ) : null}
    </Card>
  );
}

export default DeviceDetailCard;
