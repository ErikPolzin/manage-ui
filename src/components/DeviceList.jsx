import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import { DataGrid, gridClasses, GridRow, GridActionsCellItem } from "@mui/x-data-grid";
import humanizeDuration from "humanize-duration";
import DeviceDialog from "./dialogs/DeviceDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
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
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openDeviceDialog, setOpenDeviceDialog] = React.useState(false);
  const [deviceToDelete, setDeviceToDelete] = React.useState(null);
  const [deviceToEdit, setDeviceToEdit] = React.useState(null);

  function isExpanded(pid) {
    return expandedIds.indexOf(pid) !== -1;
  }

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

  const handleDeleteClick = (device) => {
    setDeviceToDelete(device);
    setOpenDeleteDialog(true);
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
      <Box
        sx={{
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }}
      >
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
            {selectedDevice ? (
              <Box sx={{ display: "inline-flex", flexDirection: "row" }}>
                <IconButton onClick={() => handleDeleteClick(selectedDevice)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              <IconButton onClick={() => handleAddClick()}>
                <AddIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        {isLoading ? <LinearProgress /> : null}
      </Box>
    );
  }
  return (
    <Box {...props}>
      <DataGrid
        slots={{ toolbar: DataGridTitle, row: ExpandableRow }}
        getRowSpacing={(p) => ({ bottom: isExpanded(p.id) ? 200 : 0 })}
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
          [`.${gridClasses.cell}.status.critical`]: {
            color: "purple",
          },
          [`.${gridClasses.cell}.status.ok`]: {
            color: "green",
          },
          [`.${gridClasses.cell}.status.warning`]: {
            color: "red",
          },
          [`.${gridClasses.cell}.status.decent`]: {
            color: "orange",
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
                <strong>{params.value}</strong>
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
            field: "last_contact",
            headerName: "Last Seen",
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
      <ConfirmDeleteDialog
        open={openDeleteDialog}
        model={deviceToDelete}
        idField="mac"
        itemType="device"
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={onDelete}
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
