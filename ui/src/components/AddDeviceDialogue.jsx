import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function AddDeviceDialog({ open, handleClose, handleAdd }) {
    const [newDevice, setNewDevice] = useState({ name: '', ip_address: '', device_type: '' });

    const handleChange = (e) => {
        setNewDevice({ ...newDevice, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        handleAdd(newDevice);
        setNewDevice({ name: '', ip_address: '', device_type: '' }); // Reset form
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Device Name"
                    type="text"
                    fullWidth
                    value={newDevice.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="ip_address"
                    label="IP Address"
                    type="text"
                    fullWidth
                    value={newDevice.ip_address}
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Device Type</InputLabel>
                    <Select
                        name="device_type"
                        value={newDevice.device_type}
                        label="Device Type"
                        onChange={handleChange}
                    >
                        <MenuItem value="switch">Switch</MenuItem>
                        <MenuItem value="access_point">Access Point</MenuItem>
                        <MenuItem value="firewall">Firewall</MenuItem>
                        <MenuItem value="dns_server">DNS</MenuItem>
                        <MenuItem value="global_server">Cloud Server</MenuItem>
                        <MenuItem value="local_server">Local Server</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button color="button_red" onClick={handleClose}>Cancel</Button>
                <Button color="button_green" onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddDeviceDialog;