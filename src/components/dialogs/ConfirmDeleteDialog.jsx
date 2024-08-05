import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { fetchAPI } from "../../keycloak";

export default function ConfirmDeleteDialog({
  open,
  model,
  baseUrl,
  onClose,
  onDelete = null,
  idField = "id",
  itemType = "item",
}) {
  const deleteModel = () => {
    if (model) {
      fetchAPI(`${baseUrl}/${model[idField]}/`, "DELETE")
        .then(() => {
          onDelete && onDelete(model);
          onClose();
        })
        .catch((error) => {
          console.error("Error deleting object: " + error);
        });
    } else {
      onClose();
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{"Confirm Deletion"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Are you sure you want to delete this ${itemType}? This action is permanent.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={deleteModel} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
