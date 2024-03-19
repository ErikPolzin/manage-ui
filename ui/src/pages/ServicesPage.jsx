import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import NavBar from "../components/NavBar";
import Alert from "@mui/material/Alert";
import DeviceList from "../components/DeviceList";
import ConfirmDeleteDialogue from "../components/ConfirmDeleteDialogue";
import EditDeviceDialogue from "../components/EditDeviceDialogue";
import {Fab} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddDeviceDialogue from "../components/AddDeviceDialogue";
import Footer from "../components/Footer";
import ServiceList from "../components/ServiceList";
import HomePage from "./HomePage";

function ServicesPage(){
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            fetch('http://127.0.0.1:8000/service/list/', {
            })
                .then(response => response.json())
                .then(data => setServices(data.data))
                .catch(error => console.error('Error:', error));
        };
        fetchData();
    }, []);

    const handleEditClick = (service) => {
        console.log('edit clicked')
    };

    const handleDeleteClick = (service) => {
        console.log('Delete clicked')
    };

    const handleAddClick = (service) => {
        console.log('Add clicked')
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
                onClick={handleAddClick}
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
            <Footer />
        </Box>
    );
}

export default ServicesPage;