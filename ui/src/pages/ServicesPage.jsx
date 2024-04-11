import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import NavBar from "../components/NavBar";
import Alert from "@mui/material/Alert";
import AddServiceDialogue from "../components/AddServiceDialogue";
import {Card, CardContent, Fab, ListItemText} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Footer from "../components/Footer";
import ServiceList from "../components/ServiceList";
import EditServiceDialogue from "../components/EditServiceDialogue";

import { useKeycloak } from "@react-keycloak/web";
import ConfirmDeleteDialogue from "../components/ConfirmDeleteDialogue";
function ServicesPage(){
    const { keycloak } = useKeycloak();
    const [services, setServices] = useState([]);
    const [successAlert, setSuccessAlert] = useState({ show: false, message: '' });
    const [openAddDialogue, setOpenAddDialogue] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '' });
    const apiUrl = `${process.env.REACT_APP_API_URL}`
    const [originalName, setOriginalName] = useState('')
    const [error, setError] = useState(null);
    const [openDeleteDialogue, setOpenDeleteDialogue] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [openEditDialogue, setOpenEditDialogue] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const fetchServices = () => {
        fetch(`${apiUrl}/service/list/`, {
            headers: {
                'Authorization': `Bearer ${keycloak.token}`,
            },
        })
            .then(async response => {
                if (!response.ok) {

                    const errorBody = await response.json();
                    throw new Error(errorBody.detail || "An unknown error occurred");
                }
                return response.json();
            })
            .then(data => {
                setServices(data.data);
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error.message);
            });
    };

    useEffect(() => {
        setError(null); // Clear any existing errors
        fetchServices();
    }, []); // Dependencies array is empty to indicate this effect runs once on mount.



    const handleDeleteClick = (service) => {
        setServiceToDelete(service);
        setOpenDeleteDialogue(true);
    };

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
    const handleConfirmDelete = () => {
        if (!serviceToDelete) return;

        fetch(`${apiUrl}/service/delete/${serviceToDelete.name}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${keycloak.token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete the service');
                }
                // Directly proceed if response is 204, as there's no content to parse
                if (response.status === 204) {
                    setSuccessAlert({ show: true, message: "Service successfully deleted." });
                    setOpenDeleteDialogue(false);
                    fetchServices();
                    return;
                }
                return response.json(); // return if not 204
            })
            .then(data => {

            })
            .catch(error => {
                console.error('Error:', error);
                setAlert({ show: true, message: "Failed to delete the service." });
            });
    };


    const handleAddService = (newService) => {
        fetch(`${apiUrl}/service/add/`, {

            method: 'POST',
            headers: {
                'Authorization': `Bearer ${keycloak.token}`,
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
                'Authorization': `Bearer ${keycloak.token}`,
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

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!services.length) {
        return (
            <Box sx={{ minHeight: '100vh', backgroundColor: '#26282d', display: 'flex', flexDirection: 'column' }}>
                <NavBar />
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2, margin: 2 }}>
                    <Card sx={{
                        margin: 2,
                        maxWidth: 600,
                        bgcolor: '#1e2022',
                        boxShadow: 3,
                    }}>
                        <CardContent>
                            <ListItemText primary={'There are no services registered.'} />
                        </CardContent>
                    </Card>
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
            <ConfirmDeleteDialogue
                open={openDeleteDialogue}
                handleClose={() => setOpenDeleteDialogue(false)}
                handleConfirm={handleConfirmDelete}
                type="service"
            />

            <Footer />
        </Box>

    );
}

export default ServicesPage;