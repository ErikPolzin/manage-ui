import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const LogoutDialogue = ({ open, handleClose, handleLogout }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogContent>
                Are you sure you want to log out?
            </DialogContent>
            <DialogActions>
                <Button color="button_red" onClick={handleClose}>Cancel</Button>
                <Button color="button_green" onClick={handleLogout}>Logout</Button>
            </DialogActions>
        </Dialog>
    );
}

export default LogoutDialogue;
