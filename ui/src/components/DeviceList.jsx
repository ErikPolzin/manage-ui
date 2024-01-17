import React from 'react';
import DeviceItem from './DeviceItem';
import {Grid, List} from '@mui/material';

function DeviceList({ devices, onDelete,  onEdit}) {
    // You can sort and separate devices here based on type and IP

    return (
        <List>
            <Grid container>
                <Grid item>
                    {devices.map(device => (
                        <DeviceItem key={device.ip_address} device={device} onDelete={onDelete} onEdit={onEdit} />
                    ))}
                </Grid>

            </Grid>
        </List>
    );
}

export default DeviceList;