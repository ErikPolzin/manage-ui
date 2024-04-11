import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import NavBar from "../components/NavBar";
import Alert from "@mui/material/Alert";
import DeviceList from "../components/DeviceList";
import ConfirmDeleteDialogue from "../components/ConfirmDeleteDialogue";
import EditDeviceDialogue from "../components/EditDeviceDialogue";
import AddServiceDialogue from "../components/AddServiceDialogue";
import {Fab} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddDeviceDialogue from "../components/AddDeviceDialogue";
import Footer from "../components/Footer";
import ServiceList from "../components/ServiceList";
import HomePage from "./HomePage";

function ServicesPage(){
    const [services, setServices] = useState([]);
    const [successAlert, setSuccessAlert] = useState({ show: false, message: '' });
    const [openAddDialogue, setOpenAddDialogue] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '' });
    const apiUrl = `${process.env.REACT_APP_API_URL}`
    useEffect(() => {
        const fetchData = async () => {
            fetch(`${apiUrl}/service/list/`, {
            })
                .then(response => response.json())
                .then(data => setServices(data.data))
                .catch(error => console.error('Error:', error));
        };
        fetchData();
    }, []);
    const handleCloseAlert = () => {
        setAlert({ show: false, message: '' });
    };
    const handleCloseSuccessAlert = () => {
        setSuccessAlert({ show: false, message: '' });
    };

    const handleEditClick = (service) => {
        console.log('edit clicked')
    };

    const handleDeleteClick = (service) => {
        console.log('Delete clicked')
    };

    const handleAddClick = (service) => {
        console.log('Add clicked')
    };
    const handleAddService = (newService) => {
        fetch(`${apiUrl}/service/add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newService),
        })
            .then(response => response.json())
            .then(data => {
                if(data.status === "success") {
                    setSuccessAlert({ show: true, message: "Device successfully added." });
                    setOpenAddDialogue(false);
                    // Optionally, fetch services list again to refresh the UI
                } else {
                    setAlert({show: true, message: `Failed to add service: ${data.message}`});
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setAlert({show: true, message: "An error occurred while adding the service."});
            });
    };


    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#26282d',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <NavBar />
            {alert.show && (
                <Alert severity="error" onClose={handleCloseAlert}>
                    {alert.message}
                </Alert>
            )}
            {successAlert.show && (
                <Alert severity="success" onClose={handleCloseSuccessAlert}>
                    {successAlert.message}
                </Alert>
            )}

            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'start',
                    padding: 2,
                    margin: 2,
                }}
            >

                <ServiceList services={services} onDelete={handleDeleteClick} onEdit={handleEditClick}/>
            </Box>
            <Fab
                onClick={() => setOpenAddDialogue(true)}
                color="button_green"
                aria-label="add"
                sx={{
                    position: 'fixed',
                    bottom: '95px',
                    right: 10,
                }}
            >
                <AddIcon />
            </Fab>
            <AddServiceDialogue
                open={openAddDialogue}
                handleClose={() => setOpenAddDialogue(false)}
                handleAdd={handleAddService}
            />
            <Footer />
        </Box>
    );
}

export default ServicesPage;