import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import NavBar from "../components/NavBar";
import Alert from "@mui/material/Alert";
import AddServiceDialogue from "../components/AddServiceDialogue";
import {Fab} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Footer from "../components/Footer";
import ServiceList from "../components/ServiceList";
import EditServiceDialogue from "../components/EditServiceDialogue";

function ServicesPage(){
    const [services, setServices] = useState([]);
    const [successAlert, setSuccessAlert] = useState({ show: false, message: '' });
    const [openAddDialogue, setOpenAddDialogue] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '' });
    const apiUrl = `${process.env.REACT_APP_API_URL}`
    const [originalName, setOriginalName] = useState('')
    const fetchServices = () => {
        fetch(`${apiUrl}/service/list/`, {})
            .then(response => response.json())
            .then(data => {
                setServices(data.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetchServices();
    }, []); // Dependencies array is empty to indicate this effect runs once on mount.

    const [openEditDialogue, setOpenEditDialogue] = useState(false);
    const [editingService, setEditingService] = useState(null);


    const handleCloseAlert = () => {
        setAlert({ show: false, message: '' });
    };
    const handleCloseSuccessAlert = () => {
        setSuccessAlert({ show: false, message: '' });
    };

    const handleEditClick = (service) => {
        setEditingService(service);
        setOriginalName(service.name);
        setOpenEditDialogue(true);
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
                    fetchServices()
                } else {
                    setAlert({show: true, message: `Failed to add service: ${data.message}`});
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setAlert({show: true, message: "An error occurred while adding the service."});
            });
    };

    const handleUpdateService = (updatedService) => {
        fetch(`${apiUrl}/service/edit/${originalName}/`, { // Assuming your service has an 'id' field
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedService),
        })
            .then(response => response.json())
            .then(data => {
                if(data.status === "success") {
                    setSuccessAlert({ show: true, message: "Service successfully updated." });
                    setOpenEditDialogue(false);
                    // Refresh the service list
                    fetchServices()
                } else {
                    setAlert({show: true, message: `Failed to update service: ${data.message}`});
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setAlert({show: true, message: "An error occurred while updating the service."});
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
            <EditServiceDialogue
                open={openEditDialogue}
                handleClose={() => setOpenEditDialogue(false)}
                service={editingService}
                handleUpdate={handleUpdateService}
            />

            <Footer />
        </Box>

    );
}

export default ServicesPage;