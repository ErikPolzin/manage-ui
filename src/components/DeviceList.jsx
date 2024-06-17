import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

import ConfirmDeleteDialogue from "../components/ConfirmDeleteDialogue";

function DeviceList({ title, devices, isLoading, columns, onDelete, onAdd, onSelect }) {
  const [selectedDevices, setSelectedDevices] = React.useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deviceToDelete, setDeviceToDelete] = React.useState(null);

  const handleDeleteClick = (device) => {
    setDeviceToDelete(device);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    setOpenDeleteDialog(false);
    if (deviceToDelete) {
      onDelete(deviceToDelete);
    }
  };

  const handleSelectionChange = (model) => {
    setSelectedDevices(model);
    if (onSelect) onSelect(model[0]);
  }

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
          <Typography variant="h6" sx={{ flex: "1 1 100%" }}>
            {title}
          </Typography>
          {selectedDevices.length > 0 ? (
            <IconButton onClick={handleDeleteClick}>
              <DeleteIcon />
            </IconButton>
          ) : (
            <IconButton onClick={onAdd}>
              <AddIcon />
            </IconButton>
          )}
        </Box>
        {isLoading ? <LinearProgress /> : null}
      </Box>
    );
  }
  return (
    <Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <DataGrid
          slots={{ toolbar: DataGridTitle }}
          rows={devices}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          onRowSelectionModelChange={handleSelectionChange}
          disableMultipleRowSelection
        />
      </Paper>
      <ConfirmDeleteDialogue
        open={openDeleteDialog}
        handleClose={handleCloseDeleteDialog}
        handleConfirm={handleConfirmDelete}
        type={"device"}
      />
    </Box>
  );
}

export default DeviceList;
