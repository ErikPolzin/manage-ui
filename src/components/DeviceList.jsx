import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import humanizeDuration from "humanize-duration";

function DeviceList({ devices, isLoading, onDelete, onAdd, selectedDevice, onSelect, ...props }) {

  const handleSelectionChange = (model) => {
    if (onSelect) onSelect(model.length > 0 ? model[0] : null);
  };

  const clearSelection = () => {
    handleSelectionChange([]);
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
                <Button onClick={clearSelection}>Clear Selection</Button>
                <IconButton onClick={() => onDelete(selectedDevice)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              <IconButton onClick={onAdd}>
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
        slots={{ toolbar: DataGridTitle }}
        sx={{
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
          { field: "name", headerName: "Name", align: "center" },
          {
            field: "status",
            headerName: "Status",
            valueGetter: (value, row) => value.toUpperCase(),
            cellClassName: (params) => [params.value.toLowerCase(), "status"],
            width: 150,
          },
          { field: "mac", headerName: "MAC Address", width: 150 },
          {
            field: "ip",
            headerName: "IP Address",
            valueGetter: (value, row) => (value ? value : "Unknown"),
            cellClassName: (params) => (params.value === "Unknown" ? "disabled" : ""),
            width: 150,
          },
          {
            field: "last_contact",
            headerName: "Last Seen",
            valueGetter: (value, row) =>
              value ? humanizeDuration(new Date() - new Date(value), { round: true }) : "Never",
            cellClassName: (params) => (params.value === "Never" ? "disabled" : ""),
          },
          {
            field: "created",
            headerName: "Created",
            valueGetter: (value, row) => new Date(value).toLocaleString(),
            flex: 1,
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
        rowSelectionModel={selectedDevice ? [selectedDevice] : []}
        disableMultipleRowSelection
      />
    </Box>
  );
}

export default DeviceList;
