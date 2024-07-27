import React from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ServiceDialog from "./dialogs/ServiceDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import cloud from "../images/cloud.png";
import local from "../images/local.png";

const serviceIconMap = { local, cloud };

export default function ServicesList({ services, onAdd, onUpdate, onDelete }) {
  const [openServiceDialog, setOpenServiceDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] = React.useState(null);
  const [serviceToEdit, setServiceToEdit] = React.useState(null);

  return (
    <List sx={{ maxWidth: 600 }}>
      <ServiceDialog
        open={openServiceDialog}
        service={serviceToEdit}
        onClose={() => setOpenServiceDialog(false)}
        onAdd={onAdd}
        onUpdate={onUpdate}
      />
      <ConfirmDeleteDialog
        open={openDeleteDialog}
        model={serviceToDelete}
        onDelete={onDelete}
        itemType="service"
        baseUrl={"/monitoring/services"}
        onClose={() => setOpenDeleteDialog(false)}
      />
      {services.map((service) => [
        <ListItem key={service.id}>
          <ListItemIcon>
            <img
              src={serviceIconMap[service.api_location] || cloud}
              alt={service.service_type}
              style={{ width: "48px", height: "48px" }}
            />
          </ListItemIcon>
          <ListItemText primary={service.name} secondary={service.url} />
          <IconButton
            onClick={() => setOpenServiceDialog(true) || setServiceToEdit(service)}
            aria-label="edit"
            sx={{ mx: "4px" }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => setOpenDeleteDialog(true) || setServiceToDelete(service)}
            color="error"
            sx={{ mx: "4px" }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItem>,
        <Divider key={`${service.id}-divider`} />,
      ])}
      {services.length === 0 && (
        <ListItem>
          <ListItemText>No Services</ListItemText>
        </ListItem>
      )}
    </List>
  );
}
