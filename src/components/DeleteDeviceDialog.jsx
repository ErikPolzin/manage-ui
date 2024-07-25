import React from "react";
import ConfirmDeleteDialogue from "./ConfirmDeleteDialogue";
import { fetchAPI } from "../keycloak";

export default function DeleteDeviceDialog({ open, device, onDelete, onClose }) {
  const deleteDevice = () => {
    if (device) {
      fetchAPI(`/monitoring/devices/${device.mac}/`, "DELETE")
        .then(() => {
          onDelete(device);
          onClose();
        })
        .catch((error) => {
          console.log("Error deleting device: " + error);
        });
    } else {
      onClose();
    }
  };
  return (
    <ConfirmDeleteDialogue
      open={open}
      type="device"
      handleConfirm={deleteDevice}
      handleClose={onClose}
    />
  );
}
