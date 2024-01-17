import React from 'react';
import {ListItem, ListItemText, ListItemIcon, IconButton, CardContent, Card} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import apIcon from '../images/wifi.png';  // Adjust the path according to your file structure
import switchIcon from '../images/hub.png';  // Adjust the path as well
import firewallIcon from '../images/firewall.png'
import localServerIcon from '../images/local_server.png'
import globalServerIcon from '../images/cloud_server.png'
import dnsIcon from '../images/dns.png'

function DeviceItem({ device, onDelete, onEdit}) {
    let deviceIcon;
    switch (device.device_type) {
        case 'access_point':
            deviceIcon = apIcon;
            break;
        case 'switch':
            deviceIcon = switchIcon;
            break;
        case 'firewall':
            deviceIcon = firewallIcon;
            break;
        case 'local_server':
            deviceIcon = localServerIcon;
            break;
        case 'dns_server':
            deviceIcon = dnsIcon;
            break;
        case 'global_server':
            deviceIcon = globalServerIcon;
            break;
        default:
            deviceIcon = switchIcon;  // default icon if type is not recognized
            break;
    }

    return (
        <Card sx={{
            margin: 2,
            maxWidth: 600,
            bgcolor: '#1e2022',
            boxShadow: 3,
        }}>
            <CardContent>
                <ListItem>
                    <ListItemIcon  sx={{
                        padding: 2,
                    }}>
                        <img src={deviceIcon} alt={device.device_type} style={{ width: '48px', height: '48px' }} />
                    </ListItemIcon>
                    <ListItemText primary={device.name} secondary={device.ip_address} />
                    <IconButton edge="end" onClick={() => onEdit(device)} aria-label="edit" sx={{
                        color: '#FFFFFF',
                        padding: 1,
                    }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete"  onClick={() => onDelete(device)} sx={{
                        color: '#bf0000',
                        padding: 2,
                    }} >
                        <DeleteIcon />
                    </IconButton>
                </ListItem>
            </CardContent>
        </Card>
    );
}

export default DeviceItem;