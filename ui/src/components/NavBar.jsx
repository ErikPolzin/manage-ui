import React, { useState } from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import LogoutDialogue from "./LogoutDialogue";
import { useKeycloak } from "@react-keycloak/web";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const StyledNavBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ open, theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - 240px)`,
    marginLeft: `240px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
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
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <a href="/">
            <img href="/" src="./logo192.png" alt="Logo" style={{ height: "50px" }} />
          </a>
        </Box>
        <Button color="inherit" onClick={handleLogout}>
          Log Out
        </Button>
      </Toolbar>
      <LogoutDialogue
        open={openLogoutDialog}
        handleClose={toggleLogoutDialog}
        handleLogout={handleLogout}
      />
    </StyledNavBar>
  );
};

export default NavBar;
