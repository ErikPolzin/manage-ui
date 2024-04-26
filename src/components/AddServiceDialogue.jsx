// AddServiceDialog.js
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function AddServiceDialogue({ open, handleClose, handleAdd }) {
    const [newService, setNewService] = useState({
        name: '',
        url: '',
        service_type: '',
        api_location: ''
    });

    const handleChange = (e) => {
        setNewService({ ...newService, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        handleAdd(newService);
        setNewService({ name: '', url: '', service_type: '', api_location: '' }); // Reset form
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Service Name"
                    type="text"
                    fullWidth
                    value={newService.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="url"
                    label="URL"
                    type="text"
                    fullWidth
                    value={newService.url}
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Location</InputLabel>
                    <Select
                        name="api_location"
                        value={newService.api_location}
                        label="api_location"
                        onChange={handleChange}
                    >
                        <MenuItem value="cloud">Cloud</MenuItem>
                        <MenuItem value="local">Local</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Service Type</InputLabel>
                    <Select
                        name="service_type"
                        value={newService.service_type}
                        label="Service Type"
                        onChange={handleChange}
                    >
                        <MenuItem value="utility">Utility</MenuItem>
                        <MenuItem value="entertainment">Entertainment</MenuItem>
                        <MenuItem value="games">Games</MenuItem>
                        <MenuItem value="education">Education</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddServiceDialogue;
