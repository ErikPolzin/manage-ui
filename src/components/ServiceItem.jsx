import React from "react";
import { ListItem, ListItemText, ListItemIcon, IconButton, CardContent, Card } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import cloud from "../images/cloud.png";
import local from "../images/local.png";

const serviceIconMap = { local, cloud };

function ServiceItem({ service, onDelete, onEdit }) {
  let serviceIcon = serviceIconMap[service.api_location] || cloud;
  return (
    <Card
      sx={{
        margin: 2,
        maxWidth: 600,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <ListItem>
          <ListItemIcon>
            <img
              src={serviceIcon}
              alt={service.service_type}
              style={{ width: "48px", height: "48px" }}
            />
          </ListItemIcon>
          <ListItemText primary={service.name} secondary={service.url} />
          <IconButton onClick={() => onEdit(service)} aria-label="edit" sx={{ mx: "4px" }}>
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => onDelete(service)}
            color="error"
            sx={{ mx: "4px" }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItem>
      </CardContent>
    </Card>
  );
}

export default ServiceItem;
