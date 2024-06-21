import React from "react";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
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

function ServiceGrid({ services, onDelete, onEdit }) {
  return (
    <Grid container>
      <Grid item>
        {services.map((service) => (
          <ServiceItem key={service.url} service={service} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </Grid>
    </Grid>
  );
}

export default ServiceGrid;
