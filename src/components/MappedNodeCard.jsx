import React from 'react';
import {Card, CardContent, Typography, Divider, Box, Link} from '@mui/material';

const MappedNodeCard = ({node}) => {
    return (
        <Card sx={{ width: 300, backgroundColor: '#1c1c1e', color: 'white', p: 2 }}>
            <CardContent>
                <Typography variant="overline" display="block" gutterBottom>
                    Access Point
                </Typography>
                <Typography variant="h4">
                    {node.name}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: node.isOnline ? "green" : "red" }}>
                    Status: {node.isOnline ? "online" : "offline"}
                </Typography>
                <Divider sx={{ my: 2, borderColor: 'grey' }} />
                <Box>
                    <Typography variant="body2">MAC address: {node.macAddress}</Typography>
                    <Typography variant="body2">Memory usage: {node.memoryUsage}</Typography>
                    <Typography variant="body2">CPU usage: {node.cpuUsage}</Typography>
                    <Typography variant="body2">Connected devices: {node.connectedDevices}</Typography>
                </Box>
                <Box sx={{mt: 2}}>
                    <Link href="#" underline="hover" sx={{color: 'white'}}>
                        More details `{'>>'}`
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
};

export default MappedNodeCard;