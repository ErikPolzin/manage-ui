import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { blueberryTwilightPalette } from "@mui/x-charts/colorPalettes";
import { lighten } from "@mui/material/styles";
import { formatDataSize } from "../../units";

function DataUsagePie({ accounts, selectedAccount, selectedGroup }) {
  const theme = useTheme();
  const colors = blueberryTwilightPalette(theme.palette.mode);
  const [userColorTable, setUserColorTable] = React.useState({});
  const [userIndex, setUserIndex] = React.useState(0);
  const [highlightGroup, setHighlightGroup] = React.useState(true);
  const usernames = React.useMemo(
    () => [...new Set(accounts.map((ra) => ra.username))],
    [accounts],
  );
  const ids = React.useMemo(() => accounts.map((a) => a.radacctid), [accounts]);
  const selectedGroupIndex = React.useMemo(
    () => usernames.indexOf(selectedGroup),
    [selectedGroup, usernames],
  );
  const selectedAccountIndex = React.useMemo(
    () => ids.indexOf(selectedAccount),
    [selectedAccount, ids],
  );
  const lightenPercent = React.useCallback(
    (u, acct) => {
      if (!acct) return 0;
      let acctsForUser = accounts.filter((a) => a.username === u);
      if (acctsForUser.length === 0) return 0;
      let indexOfAccount = acctsForUser.map((a) => a.radacctid).indexOf(acct);
      // Don't want to brighten more than 90%
      return Math.min(0.9, (indexOfAccount / acctsForUser.length) * 0.3);
    },
    [accounts],
  );
  const colorForUser = React.useCallback(
    (u, acct) => {
      let userColor;
      if (!userColorTable[u]) {
        userColor = colors[userIndex % colors.length];
        setUserColorTable({ ...userColorTable, [u]: userColor });
        setUserIndex(userIndex + 1);
      } else {
        userColor = userColorTable[u];
      }
      return lighten(userColor, lightenPercent(u, acct));
    },
    [colors, lightenPercent, userColorTable, userIndex],
  );
  const sendData = React.useMemo(
    () =>
      accounts.map((u) => ({
        id: u.radacctid,
        value: u.acctoutputoctets,
        label: u.username,
        color: colorForUser(u.username, u.radacctid),
      })),
    [accounts, colorForUser],
  );
  const sendDataGrouped = React.useMemo(
    () =>
      usernames.map((u) => ({
        id: u,
        value: accounts
          .filter((ra) => ra.username === u)
          .reduce((x, y) => x + y.acctoutputoctets, 0),
        label: u,
        color: colorForUser(u),
      })),
    [accounts, usernames, colorForUser],
  );
  const recvData = React.useMemo(
    () =>
      accounts.map((u) => ({
        id: u.radacctid,
        value: u.acctinputoctets,
        label: u.username,
        color: colorForUser(u.username, u.radacctid),
      })),
    [accounts, colorForUser],
  );
  const recvDataGrouped = React.useMemo(
    () =>
      usernames.map((u) => ({
        id: u,
        value: accounts
          .filter((ra) => ra.username === u)
          .reduce((x, y) => x + y.acctinputoctets, 0),
        label: u,
        color: colorForUser(u),
      })),
    [accounts, usernames, colorForUser],
  );
  const dataUsageFor = React.useCallback((username) => {
    let recvIdx = recvDataGrouped.map(d => d.id).indexOf(username);
    let sendIdx = sendDataGrouped.map(d => d.id).indexOf(username);
    let recvData = recvIdx > -1 ? formatDataSize(recvDataGrouped[recvIdx].value) : "--";
    let sendData = sendIdx > -1 ? formatDataSize(sendDataGrouped[sendIdx].value) : "--";
    return `${recvData}↓  / ${sendData}↑`
  }, [recvDataGrouped, sendDataGrouped])

  React.useEffect(() => setHighlightGroup(true), [selectedGroup]);
  React.useEffect(() => setHighlightGroup(false), [selectedAccount]);

  return (
    <Stack direction={{ xs: "column", md: "row" }} width="100%" textAlign="center">
      <Box flexGrow={1}>
        <Box sx={{ height: 55, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h6">Received Data</Typography>
        </Box>
        <Divider />
        <PieChart
          height={300}
          // I have no idea why this centers the chart, but it does
          margin={{ right: 5 }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
          highlightedItem={
            highlightGroup
              ? selectedGroupIndex !== -1
                ? {
                    seriesId: "recv-grouped",
                    dataIndex: selectedGroupIndex,
                  }
                : null
              : selectedAccountIndex !== -1
              ? {
                  seriesId: "recv-items",
                  dataIndex: selectedAccountIndex,
                }
              : null
          }
          series={[
            {
              innerRadius: 0,
              outerRadius: 90,
              id: "recv-grouped",
              highlightScope: { faded: "series", highlighted: "item" },
              faded: { color: "gray" },
              data: recvDataGrouped,
              valueFormatter: (d) => formatDataSize(d.value),
            },
            {
              innerRadius: 90,
              outerRadius: 120,
              id: "recv-items",
              highlightScope: { faded: "series", highlighted: "item" },
              faded: { additionalRadius: -5, color: "gray" },
              data: recvData,
              valueFormatter: (d) => formatDataSize(d.value),
            },
          ]}
        />
      </Box>
      <Box flexGrow={1}>
        <Box sx={{ height: 55, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h6">Sent Data</Typography>
        </Box>
        <Divider />
        <PieChart
          highlightedItem={
            highlightGroup
              ? selectedGroupIndex !== -1
                ? {
                    seriesId: "send-grouped",
                    dataIndex: selectedGroupIndex,
                  }
                : null
              : selectedAccountIndex !== -1
              ? {
                  seriesId: "send-items",
                  dataIndex: selectedAccountIndex,
                }
              : null
          }
          height={300}
          margin={{ right: 5 }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
          series={[
            {
              innerRadius: 0,
              outerRadius: 90,
              id: "send-grouped",
              highlightScope: { faded: "series", highlighted: "item" },
              faded: { color: "gray" },
              data: sendDataGrouped,
              valueFormatter: (d) => formatDataSize(d.value),
            },
            {
              innerRadius: 90,
              outerRadius: 120,
              id: "send-items",
              highlightScope: { faded: "series", highlighted: "item" },
              faded: { additionalRadius: -5, color: "gray" },
              data: sendData,
              valueFormatter: (d) => formatDataSize(d.value),
            },
          ]}
        />
      </Box>
      <Box flexGrow={1}>
        <Box
          sx={{ height: 55, display: "flex", alignItems: "center", justifyContent: "center" }}
        ></Box>
        <Divider />
        <List sx={{ maxHeight: 300, overflowY: "auto" }}>
          {usernames.map((u) => (
            <ListItem key={u} dense>
              <ListItemIcon>
                <Box
                  sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: colorForUser(u) }}
                />
              </ListItemIcon>
              <ListItemText primary={u} secondary={dataUsageFor(u)} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Stack>
  );
}

export default DataUsagePie;
