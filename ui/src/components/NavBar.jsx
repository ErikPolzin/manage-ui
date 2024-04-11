import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Grid } from '@mui/material';
import LogoutDialogue from "./LogoutDialogue";
import {useKeycloak} from "@react-keycloak/web";

const NavBar = () => {
      const { keycloak } = useKeycloak();
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const handleLogout = () => {
        // Call Keycloak logout logic here
        keycloak.logout();
        console.log('Logging out...');
    };
     const toggleLogoutDialog = () => {
        setOpenLogoutDialog(!openLogoutDialog);
    };
    const handleButtonClick = () => {
        window.open('https://grafana.inethilocal.net', '_blank', 'noopener,noreferrer');
    };
    return (
        <AppBar position="static" sx={{

        }}>
            <Toolbar>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ padding: '0 20px' }} // Add padding here
                >
                    <Grid item>
                        <Link to="/">
                            <img src="./logo192.png" alt="Logo" style={{height: '50px' }}/>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/devices">Devices</Button>
                        <Button color="inherit" component={Link} to="/services">Services</Button>
                        {/*<Button color="inherit" component={Link} to="/">Options</Button>*/}
                        <Button color="inherit" onClick={handleButtonClick}>Monitor</Button>
                        <Button color="inherit" onClick={toggleLogoutDialog}>Sign Out</Button>
                    </Grid>

                </Grid>
            </Toolbar>
            <LogoutDialogue
                open={openLogoutDialog}
                handleClose={toggleLogoutDialog}
                handleLogout={handleLogout}
            />
        </AppBar>
    );
};


export default NavBar;