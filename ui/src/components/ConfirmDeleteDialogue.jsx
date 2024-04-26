import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

function ConfirmDeleteDialogue({ open, handleClose, handleConfirm, type }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{"Confirm Deletion"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Are you sure you want to delete this ${type}? This action is permanent.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteDialogue;
