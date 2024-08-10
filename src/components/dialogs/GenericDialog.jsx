// GenericDialog.js
import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import { fetchAPI } from "../../keycloak";

export default function GenericDialog({
  children,
  open,
  data,
  originalData,
  baseUrl,
  onError,
  onUpdate,
  onClose,
  onReset,
  onAdd,
  typeName = "Item",
  addVerb = "Add",
  editVerb = "Edit",
  idField = "id",
}) {
  const [loading, setLoading] = React.useState(false);

  const isModified = React.useCallback(() => {
    return JSON.stringify(originalData) !== JSON.stringify(data);
  }, [originalData, data]);

  const submit = () => {
    setLoading(true);
    let url = originalData ? `${baseUrl}${data[idField]}/` : baseUrl;
    (originalData
      ? fetchAPI(url, "PUT", data).then((response) => onUpdate(response) || onClose())
      : fetchAPI(url, "POST", data).then((response) => onAdd(response) || onClose())
    )
      .catch((error) => onError(error))
      .finally(() => setLoading(false));
  };

  const resetAndClose = () => onReset() || onClose();

  return (
    <Dialog open={open} onClose={resetAndClose} maxWidth={"sm"} fullWidth>
      <DialogTitle>
        {originalData ? `${editVerb} ${typeName}` : `${addVerb} New ${typeName}`}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={resetAndClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions sx={{ display: "flex", flexDirection: "row", pt: 1 }}>
        <Box sx={{ flex: "1 1 auto" }} />
        <LoadingButton
          loading={loading}
          variant="contained"
          disabled={!isModified()}
          onClick={submit}
        >
          {originalData ? editVerb : addVerb} {typeName}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
