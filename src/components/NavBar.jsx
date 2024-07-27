import React, { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { AppBar, Toolbar, Button, Avatar, IconButton, Typography } from "@mui/material";
import { Menu, ChevronLeft } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

import LogoutDialog from "./dialogs/LogoutDialog";

const StyledNavBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: "240px",
    width: `calc(100% - 240px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const NavBar = ({ open, onMenuClick }) => {
  const { keycloak } = useKeycloak();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
    keycloak.logout();
  };
  const toggleLogoutDialog = () => {
    setOpenLogoutDialog(!openLogoutDialog);
  };
  return (
    <StyledNavBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          {open ? <ChevronLeft /> : <Menu />}
        </IconButton>
        <Link to="/">
          <IconButton sx={{ p: 0 }}>
            <Avatar alt="Logo" src="./logo192.png" sx={{ width: 56, height: 56 }} />
          </IconButton>
        </Link>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: 2 }}>
          CommuNethi
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Log Out
        </Button>
      </Toolbar>
      <LogoutDialog
        open={openLogoutDialog}
        handleClose={toggleLogoutDialog}
        handleLogout={handleLogout}
      />
    </StyledNavBar>
  );
};

export default NavBar;
