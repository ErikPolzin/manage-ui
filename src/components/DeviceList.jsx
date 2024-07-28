import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import {
  DataGrid,
  gridClasses,
  GridRow,
  GridActionsCellItem,
  useGridApiRef,
} from "@mui/x-data-grid";
import humanizeDuration from "humanize-duration";
import DeviceDialog from "./dialogs/DeviceDialog";
import ConnectedClientsList from "./ConnectedClientsList";

function DeviceList({
  devices,
  isLoading,
  selectedDevice,
  onAdd,
  onUpdate,
  onDelete,
  onSelect,
  ...props
}) {
  const [expandedIds, setExpandedIds] = React.useState([]);
  const [openDeviceDialog, setOpenDeviceDialog] = React.useState(false);
  const [deviceToEdit, setDeviceToEdit] = React.useState(null);
  const apiRef = useGridApiRef();

  function isExpanded(pid) {
    return expandedIds.indexOf(pid) !== -1;
  }

  const refreshEveryXSeconds = React.useCallback(() => {
    apiRef.current?.forceUpdate();
    apiRef.current?.autosizeColumns();
  }, [apiRef]);

  React.useEffect(() => {
    const interval = setInterval(refreshEveryXSeconds, 5000);
    return () => clearInterval(interval);
  }, [refreshEveryXSeconds]);

  // This functionality is available in the MUI pro-plan, but I've
  // jury-rigged it here hehe
  function ExpandableRow(params) {
    if (isExpanded(params.rowId))
      return [
        <GridRow {...params} key={params.rowId} />,
        <Box
          sx={{
            marginTop: "-200px",
            width: "100%",
            height: 200,
          }}
          key={`${params.rowId}-clients`}
        >
          <ConnectedClientsList
            clients={params.row.client_sessions.map((c) => ({
              ...c,
              end_time: new Date(c.end_time),
              start_time: new Date(c.start_time),
            }))}
          />
        </Box>,
      ];
    return <GridRow {...params} />;
  }

  /**
   * Find a device by MAC address.
   * @param {str} mac Device MAC address
   * @returns A device or null
   */
  const findDevice = (mac) => {
    for (let device of devices) {
      if (device.mac === mac) return device;
    }
    return null;
  };

  /**
   * Handle a change to the selected devices, reported by the data table.
   * @param {array[str]} model List of selected devices
   * @returns null
   */
  const handleSelectionChange = (model) => {
    if (onSelect) onSelect(model.length > 0 ? model[0] : null);
  };

  const handleAddClick = () => {
    setDeviceToEdit(null);
    setOpenDeviceDialog(true);
  };

  const handleEditClick = (device) => {
    setDeviceToEdit(device);
    setOpenDeviceDialog(true);
  };

  function DataGridTitle() {
    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            padding: 1,
            paddingLeft: 2,
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Devices</Typography>
          <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "row-reverse" }}>
            <IconButton onClick={() => handleAddClick()}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
        {isLoading ? <LinearProgress /> : <Divider />}
      </Box>
    );
  }
  return (
    <Box {...props}>
      <DataGrid
        slots={{ toolbar: DataGridTitle, row: ExpandableRow }}
        getRowSpacing={(p) => ({ bottom: isExpanded(p.id) ? 200 : 0 })}
        apiRef={apiRef}
        autoHeight
        sx={{
          "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          [`.${gridClasses.cell}.disabled`]: {
            color: "grey",
          },
          [`.${gridClasses.cell}.status`]: {
            fontWeight: "bold",
          },
          [`.${gridClasses.cell}.health-status.critical`]: {
            color: "purple",
          },
          [`.${gridClasses.cell}.health-status.ok`]: {
            color: "green",
          },
          [`.${gridClasses.cell}.health-status.warning`]: {
            color: "red",
          },
          [`.${gridClasses.cell}.health-status.decent`]: {
            color: "orange",
          },
          [`.${gridClasses.cell}.status.unknown`]: {
            color: "grey",
          },
          [`.${gridClasses.cell}.status.offline`]: {
            color: "red",
          },
          [`.${gridClasses.cell}.status.online`]: {
            color: "green",
          },
          [`.${gridClasses.cell}.status.rebooting`]: {
            color: "cyan",
          },
        }}
        rows={devices}
        columns={[
          {
            field: "actions",
            type: "actions",
            width: 40,
            getActions: (params) => [
              <GridActionsCellItem
                icon={isExpanded(params.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                onClick={() => setExpandedIds(isExpanded(params.id) ? [] : [params.id])}
                label="expand"
              />,
            ],
          },

          { field: "name", headerName: "Name", align: "center" },
          {
            field: "status",
            headerName: "Status",
            valueGetter: (value, row) => value.toUpperCase(),
            cellClassName: (params) => [params.value.toLowerCase(), "status"],
          },
          {
            field: "health_status",
            headerName: "Health Status",
            valueGetter: (value, row) => value.toUpperCase(),
            cellClassName: (params) => [params.value.toLowerCase(), "health-status"],
            renderCell: (params) =>
              !params.row.mesh ? (
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  onClick={() => handleEditClick(findDevice(params.row.mac))}
                >
                  Adopt
                </Button>
              ) : (
                <span>{params.value}</span>
              ),
          },
          { field: "mac", headerName: "MAC Address", minWidth: 150, flex: 1 },
          {
            field: "ip",
            headerName: "IP Address",
            valueGetter: (value, row) => (value ? value : "Unknown"),
            cellClassName: (params) => (params.value === "Unknown" ? "disabled" : ""),
            flex: 1,
          },
          {
            field: "last_ping",
            headerName: "Last Ping",
            minWidth: 150,
            valueGetter: (value, row) =>
              value ? humanizeDuration(new Date() - new Date(value), { round: true }) : "Never",
            cellClassName: (params) => (params.value === "Never" ? "disabled" : ""),
          },
          {
            field: "last_contact",
            headerName: "Last Report",
            minWidth: 150,
            valueGetter: (value, row) =>
              value ? humanizeDuration(new Date() - new Date(value), { round: true }) : "Never",
            cellClassName: (params) => (params.value === "Never" ? "disabled" : ""),
          },
          {
            field: "created",
            headerName: "Created",
            minWidth: 200,
            valueGetter: (value, row) => new Date(value).toLocaleString(),
          },
        ]}
        getRowId={(d) => d.mac}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        onRowSelectionModelChange={handleSelectionChange}
        rowSelectionModel={selectedDevice ? [selectedDevice.mac] : []}
        isRowSelectable={(params) => params.row.mesh !== null}
        disableMultipleRowSelection
      />
      <DeviceDialog
        open={openDeviceDialog}
        device={deviceToEdit}
        onClose={() => setOpenDeviceDialog(false)}
        onAdd={onAdd}
        onUpdate={onUpdate}
      />
    </Box>
  );
}

export default DeviceList;
