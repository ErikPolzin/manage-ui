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

function ServiceItem({ service, onDelete, onEdit}) {
    let serviceIcon;
    switch (service.service_type) {
        case 'utility':
            serviceIcon = apIcon;
            break;
        case 'entertainment':
            serviceIcon = switchIcon;
            break;
        case 'games':
            serviceIcon = firewallIcon;
            break;
        case 'education':
            serviceIcon = localServerIcon;
            break;
        default:
            serviceIcon = switchIcon;  // default icon if type is not recognized
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
                        <img src={serviceIcon} alt={service.service_type} style={{ width: '48px', height: '48px' }} />
                    </ListItemIcon>
                    <ListItemText primary={service.name} secondary={service.url} />
                    <IconButton edge="end" onClick={() => onEdit(service)} aria-label="edit" sx={{
                        color: '#FFFFFF',
                        padding: 1,
                    }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete"  onClick={() => onDelete(service)} sx={{
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

export default ServiceItem;