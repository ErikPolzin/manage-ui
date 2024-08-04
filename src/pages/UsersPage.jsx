import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { useTheme } from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PersonIcon from "@mui/icons-material/Person";

import DataUsagePie from "../components/graphs/DataUsagePie";
import { fetchAPI } from "../keycloak";
import ConnectedClientsList from "../components/ConnectedClientsList";
import { MS_IN } from "../components/graphs/utils";

function AccountsGroup({ groupName, accounts, onClick, selected, isVoucher, ...props }) {
  return [
    <ListItemButton {...props} selected={selected} onClick={onClick} key={`${groupName}-item`}>
      <ListItemAvatar>
        <Avatar sx={{ width: 24, height: 24 }}>
          {!isVoucher ? (
            <PersonIcon fontSize="small" />
          ) : (
            <ConfirmationNumberIcon fontSize="small" />
          )}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={groupName}
        secondary={accounts.length === 1 ? "1 session" : `${accounts.length} sessions`}
      />
    </ListItemButton>,
    <Divider key={`${groupName}-divider`}></Divider>,
  ];
}

function UsersPage() {
  const [allAccounts, setAllAccounts] = React.useState([]);
  const [selectedAccount, setSelectedAccount] = React.useState(null);
  const [minTime, setMinTime] = React.useState(null);
  const [showDays, setShowDays] = React.useState("all");
  const theme = useTheme();
  // Sync min time when the user changes the toggle button
  React.useEffect(() => {
    if (showDays === "all") {
      setMinTime(null);
    } else {
      setMinTime(new Date() - MS_IN[showDays]);
    }
  }, [showDays]);
  // Fetch account info on page load
  React.useEffect(() => {
    fetchAPI("/radius/accounts/")
      .then((data) => {
        setAllAccounts(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []); // Fetch users on page load
  /**
   * The clients that take place (at least partially) in the current time range.
   */
  const accounts = React.useCallback(
    () => allAccounts.filter((acc) => new Date(acc.acctstoptime || new Date()) > (minTime || 0)),
    [allAccounts, minTime],
  );
  /**
   * If an account group is selected, only show data from that account.
   */
  const visibleAccounts = React.useCallback(
    () => accounts().filter((acc) => acc.username === selectedAccount || !selectedAccount),
    [accounts, selectedAccount],
  );
  /**
   * All the accounts that are associated with a user (e.g. username/password login)
   */
  const userAccounts = React.useCallback(
    () => accounts().filter((ra) => !ra.is_voucher),
    [accounts],
  );
  /**
   * All the accounts that are associated with a voucher (e.g. voucher code login)
   */
  const voucherAccounts = React.useCallback(
    () => accounts().filter((ra) => ra.is_voucher),
    [accounts],
  );
  /** The names of the user accounts */
  const usernames = React.useCallback(
    () => Array.from(new Set(userAccounts().map((ra) => ra.username))),
    [userAccounts],
  );
  /** The names of the voucher accounts */
  const vouchernames = React.useCallback(
    () => Array.from(new Set(voucherAccounts().map((ra) => ra.username))),
    [voucherAccounts],
  );

  return (
    <Stack direction={{ xs: "column", md: "row-reverse" }}>
      <Stack sx={{ width: "100%" }}>
        <Box>
          <DataUsagePie
            accounts={visibleAccounts()}
            usernames={usernames()}
            vouchernames={vouchernames()}
            selectedAccount={selectedAccount}
          />
        </Box>
        <Box>
          <ConnectedClientsList
            clients={visibleAccounts()}
            minTimeOverride={minTime}
            maxTimeOverride={new Date()}
          />
        </Box>
      </Stack>
      <Box
        sx={{
          [theme.breakpoints.up("md")]: {
            borderRight: `1px solid ${theme.palette.divider}`,
            height: "calc(100vh - 64px)",
          },
          minWidth: 300,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingY: 1,
          }}
        >
          <ToggleButtonGroup
            color="primary"
            value={showDays}
            onChange={(e, v) => v !== null && setShowDays(v)}
            exclusive
            size="small"
            aria-label="Date Range"
          >
            <ToggleButton value={"day"}>24 Hours</ToggleButton>
            <ToggleButton value={"week"}>Week</ToggleButton>
            <ToggleButton value={"month"}>Month</ToggleButton>
            <ToggleButton value={"all"}>All</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Divider />
        <List subheader={<ListSubheader>Users</ListSubheader>}>
          {usernames().map((username) => (
            <AccountsGroup
              groupName={username}
              isVoucher={false}
              accounts={accounts().filter((ra) => ra.username === username)}
              key={username}
              selected={selectedAccount === username}
              onClick={(e) => setSelectedAccount(selectedAccount !== username ? username : null)}
            />
          ))}
        </List>
        <List subheader={<ListSubheader>Vouchers</ListSubheader>}>
          {vouchernames().map((vouchername) => (
            <AccountsGroup
              groupName={vouchername}
              isVoucher={true}
              accounts={accounts().filter((ra) => ra.username === vouchername)}
              key={vouchername}
              selected={selectedAccount === vouchername}
              onClick={(e) =>
                setSelectedAccount(selectedAccount !== vouchername ? vouchername : null)
              }
            />
          ))}
        </List>
      </Box>
    </Stack>
  );
}

export default UsersPage;
