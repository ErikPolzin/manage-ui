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

function DeviceList({ title, devices, isLoading, columns, onDelete, onAdd, onSelect }) {
  const [selectedDevices, setSelectedDevices] = React.useState([]);

  const handleSelectionChange = (model) => {
    setSelectedDevices(model);
    if (onSelect) onSelect(model[0]);
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
          <Typography variant="h6">{title}</Typography>
          <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "row-reverse" }}>
            {selectedDevices.length > 0 ? (
              <Box sx={{ display: "inline-flex", flexDirection: "row" }}>
                <Button onClick={() => setSelectedDevices([])}>Clear Selection</Button>
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
    <Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <DataGrid
          slots={{ toolbar: DataGridTitle }}
          sx={{
            [`.${gridClasses.cell}.disabled`]: {
              color: 'grey',
            },
          }}
          rows={devices}
          columns={columns}
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
      </Paper>
    </Box>
  );
}

export default DeviceList;
