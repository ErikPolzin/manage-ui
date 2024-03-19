import React, {useEffect} from 'react';
import NavBar from "../components/NavBar";
import Box from "@mui/material/Box";
import Footer from "../components/Footer";
import {Typography, Card, CardContent, CardActions, Button, Grid, List} from "@mui/material";
import {Link} from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
const HomePage = () => {
    const { keycloak } = useKeycloak();
    const handleFirstButtonClick = () => {
        // Navigate to the devices page
        window.location.href = '/devices'; // Adjust the URL as needed
    };
    const refreshTokenIfNeeded = async () => {
        if (keycloak.isTokenExpired()) {
            try {
                const refreshed = await keycloak.updateToken(5);
                if (refreshed) {
                    console.log('Token refreshed');
                } else {
                    console.log('Token not refreshed, still valid');
                }
            } catch (error) {
                console.error('Failed to refresh the token, or the session has expired');
                keycloak.login()
            }
        }
        else {
            console.log('not expired');
        }
        const refreshed = await keycloak.updateToken(3);
        if (refreshed) {
            console.log(`refreshed ${keycloak.token}`)
        }
    };

    useEffect(() => {
        refreshTokenIfNeeded();
    }, [keycloak]);

    const handleSecondButtonClick = () => {
        // Open Grafana dashboard in a new tab
        window.open('https://grafana.inethilocal.net', '_blank');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#26282d',
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
                <List>

                    {/*FIRST CARD*/}
                    <Grid container spacing={2} padding={2}>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ bgcolor: '#1e2022', boxShadow: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h1" sx={{ marginBottom: 2 }} >
                                        DEVICES
                                    </Typography>
                                    <Typography variant='body'>
                                        Edit your networking devices.
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
                                    <Button variant='contained' component={Link} to="/devices" color="secondary">
                                        VISIT
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>

                        {/* SECOND CARD*/}
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ bgcolor: '#1e2022', boxShadow: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h1" sx={{ marginBottom: 2 }}>
                                        MONITOR
                                    </Typography>
                                    <Typography variant='body'>
                                        Open the iNethi monitoring system to view device online status and uptime statistics.
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
                                    <Button variant='contained' onClick={handleSecondButtonClick} color="secondary">
                                        VISIT
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>

                    {/*SECOND ROW*/}
                    <Grid container spacing={2} padding={2}>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ bgcolor: '#1e2022', boxShadow: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h1" sx={{ marginBottom: 2 }} >
                                        SERVICES
                                    </Typography>
                                    <Typography variant='body'>
                                        Edit your available services.
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
                                    <Button variant='contained' component={Link} to="/services" color="secondary">
                                        VISIT
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>

                        {/* SECOND CARD*/}
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ bgcolor: '#1e2022', boxShadow: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h1" sx={{ marginBottom: 2 }}>
                                        LOREM IPSUM
                                    </Typography>
                                    <Typography variant='body'>
                                        Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', padding: 2 }}>
                                    <Button variant='contained' onClick={handleSecondButtonClick} color="secondary">
                                        VISIT
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </List>
            </Box>
            <Footer />
        </Box>
    );
}

export default HomePage;
