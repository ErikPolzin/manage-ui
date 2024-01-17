import React, {useEffect, useState} from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

function EditDeviceDialogue({ open, handleClose, device, handleUpdate }) {
    const [editedDevice, setEditedDevice] = useState({ name: '', ip_address: '', device_type: '' });

    useEffect(() => {
        if (device) {
            setEditedDevice(device);
        }
    }, [device]);

    const handleFieldChange = (e) => {
        setEditedDevice({ ...editedDevice, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        handleUpdate(device.ip_address, editedDevice); // Passing old IP and new device data
    };

    if (!device) {
        return null; // Or render some placeholder if you prefer
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Device Name"
                    type="text"
                    fullWidth
                    value={editedDevice.name}
                    onChange={handleFieldChange}
                />
                <TextField
                    margin="dense"
                    name="ip_address"
                    label="IP Address"
                    type="text"
                    fullWidth
                    value={editedDevice.ip_address}
                    onChange={handleFieldChange}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="button_red">Cancel</Button>
                <Button onClick={handleSubmit} color="button">Update</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditDeviceDialogue;