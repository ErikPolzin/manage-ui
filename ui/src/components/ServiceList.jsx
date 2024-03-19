import React from 'react';
import {Grid, List} from '@mui/material';
import ServiceItem from "./ServiceItem";

function ServiceList({ services, onDelete,  onEdit}) {
    return (
        <List>
            <Grid container>
                <Grid item>
                    {services.map(service => (
                        <ServiceItem key={service.url} service={service} onDelete={onDelete} onEdit={onEdit} />
                    ))}
                </Grid>
            </Grid>
        </List>
    );
}

export default ServiceList;