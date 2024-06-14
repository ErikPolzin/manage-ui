import React from "react";
import Grid from "@mui/material/Grid";
import ServiceItem from "./ServiceItem";

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
