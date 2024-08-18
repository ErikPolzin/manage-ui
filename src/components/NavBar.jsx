import React, { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { AppBar, Toolbar, Button, Avatar, IconButton, Typography, useTheme } from "@mui/material";
import { Menu, ChevronLeft } from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import HelpIcon from "@mui/icons-material/Help";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

import { ColorModeContext } from "../context";
import LogoutDialog from "./dialogs/LogoutDialog";

const StyledNavBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: "240px",
    width: `calc(100% - 240px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const NavBar = ({
  open,
  onMenuClick,
  toggleResourceCircle,
  resourceCircleEnabled,
  resourceCircleInNavbar,
}) => {
  const { keycloak } = useKeycloak();
  const theme = useTheme();
  const { toggleColorMode } = React.useContext(ColorModeContext);
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
          id="open-drawer-button"
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
        <IconButton onClick={toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        {/* <IconButton
          onClick={toggleResourceCircle}
          color={resourceCircleEnabled ? "inherit" : "#9E9E9E"}
        >
          {resourceCircleEnabled ? <HelpIcon /> : <HelpIcon />}
        </IconButton> */}
        <Button
          color="inherit"
          onClick={handleLogout}
          sx={{ marginRight: resourceCircleEnabled && resourceCircleInNavbar ? "60px" : 0 }}
        >
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
