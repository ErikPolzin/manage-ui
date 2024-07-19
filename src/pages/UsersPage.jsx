import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material";

import DataUsagePie from "../components/graphs/DataUsagePie";
import { fetchAPI } from "../keycloak";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchAPI("/wallet/users/")
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []); // Fetch users on page load

  const selectedIndex = () => {
    return users.map((u) => u.id).indexOf(selectedUser);
  };

  return (
    <Stack direction={{ xs: "column", md: "row-reverse" }}>
      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        <DataUsagePie users={users} selectedIndex={selectedIndex()} />
      </Box>
      <Box
        sx={{
          [theme.breakpoints.up("md")]: {
            borderRight: `1px solid ${theme.palette.divider}`,
            height: "calc(100vh - 64px)",
          },
        }}
      >
        <List>
          {users.map((user, i) => [
            <ListItemButton
              key={user.id}
              selected={selectedUser === user.id}
              onClick={(e) => setSelectedUser(selectedUser !== user.id ? user.id : null)}
            >
              <ListItemAvatar>
                <Avatar sx={{ width: 24, height: 24 }} />
              </ListItemAvatar>
              <ListItemText primary={user.username} />
            </ListItemButton>,
            <Divider key={`${user.id}-divider`}></Divider>,
          ])}
        </List>
      </Box>
    </Stack>
  );
}

export default UsersPage;
