// AddServiceDialog.js
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import NameMeshStep from "./mesh/NameMeshStep";
import PositionMeshStep from "./mesh/PositionMeshStep";
import { fetchAPI } from "../keycloak";

const steps = [
  { label: "Name mesh", component: NameMeshStep },
  { label: "Geoposition", component: PositionMeshStep },
];

function AddMeshDialog({ open, handleClose }) {
  const [newMesh, setNewMesh] = React.useState({
    name: "",
    guest_ssid: "",
    secure_ssid: "",
    secure_ssid_passphrase: "",
    lat: null,
    lon: null,
  });
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const handleChange = (e) => {
    setNewMesh({ ...newMesh, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    fetchAPI("/monitoring/meshes/", "POST", newMesh)
      .then((response) => {
        handleClose();
      })
      .catch((error) => {
        console.error("Error creating mesh", error);
      });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"sm"} fullWidth>
      <DialogTitle>Add Mesh</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box sx={{ height: "400px" }}>
          <Box component={steps[activeStep].component} mesh={newMesh} handleChange={handleChange} />
        </Box>
        <Box sx={{ width: "100%", pt: 2 }}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((step, index) => (
              <Step key={step.label} completed={completed[index]}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 1 }}>
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {activeStep === steps.length - 1 ? (
            <Button onClick={handleSubmit} sx={{ mr: 1 }}>
              Finish
            </Button>
          ) : (
            <Button onClick={handleNext} sx={{ mr: 1 }}>
              Next
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AddMeshDialog;
