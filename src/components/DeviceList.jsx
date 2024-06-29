import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import humanizeDuration from "humanize-duration";

function DeviceList({ devices, isLoading, onDelete, onAdd, onSelect, ...props }) {
  const [selectedDevices, setSelectedDevices] = React.useState([]);

  const handleSelectionChange = (model) => {
    setSelectedDevices(model);
    if (onSelect) onSelect(model[0] || null);
  };

  const clearSelection = () => {
    setSelectedDevices([]);
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
            {selectedDevices.length > 0 ? (
              <Box sx={{ display: "inline-flex", flexDirection: "row" }}>
                <Button onClick={clearSelection}>Clear Selection</Button>
                <IconButton onClick={() => onDelete(selectedDevices)}>
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
          [`.${gridClasses.cell}.status.Unreachable`]: {
            color: "red",
          },
          [`.${gridClasses.cell}.status.Ok`]: {
            color: "green",
          },
          [`.${gridClasses.cell}.status.Inactive`]: {
            color: "orange",
          },
          [`.${gridClasses.cell}.status.Unknown`]: {
            color: "grey",
          },
        }}
        rows={devices}
        columns={[
          { field: "name", headerName: "Name", align: "center" },
          {
            field: "status",
            headerName: "Status",
            cellClassName: (params) => [params.value, "status"],
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
        rowSelectionModel={selectedDevices}
        disableMultipleRowSelection
      />
    </Box>
  );
}

export default DeviceList;
