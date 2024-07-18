import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import { PieChart } from "@mui/x-charts/PieChart";
import { blueberryTwilightPalette } from "@mui/x-charts/colorPalettes";
import { fetchAPI } from "../keycloak";

const COLOURS = blueberryTwilightPalette();

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = () => {
    fetchAPI("/wallet/users/")
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const sentData = () =>
    users.map((u) => ({
      id: u.id,
      value: u.bytes_sent,
      label: u.username,
    }));

  const recvData = () =>
    users.map((u) => ({
      id: u.id,
      value: u.bytes_recv,
      label: u.username,
    }));

  const selectedIndex = () => {
    return users.map((u) => u.id).indexOf(selectedUser);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Stack direction={{ xs: "column", md: "row-reverse" }}>
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyItems: "center" }}>
        <PieChart
          highlightedItem={selectedIndex() !== -1 && { seriesId: "recv", dataIndex: selectedIndex() }}
          height={300}
          width={400}
          slotProps={{
            legend: { hidden: true },
          }}
          series={[
            {
              data: sentData(),
              id: "sent",
              outerRadius: 60,
              cornerRadius: 3,
              paddingAngle: 1,
            },
            {
              data: recvData(),
              id: "recv",
              innerRadius: 70,
              cornerRadius: 3,
              paddingAngle: 1,
              highlightScope: { faded: "series", highlighted: "item" },
              faded: { additionalRadius: -20, color: "gray" },
            },
          ]}
        />
      </Box>
      <Box sx={{ flexGrow: 2 }}>
        <List>
          {users.map((user, i) => [
            <ListItemButton
              key={user.id}
              selected={selectedUser === user.id}
              onClick={(e) => setSelectedUser(selectedUser !== user.id ? user.id : null)}
            >
              <ListItemAvatar>
                <Box sx={{ bgcolor: COLOURS[i], width: 25, height: 25, borderRadius: "50%" }} />
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
