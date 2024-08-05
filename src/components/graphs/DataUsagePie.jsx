import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { PieChart } from "@mui/x-charts/PieChart";
import { blueberryTwilightPalette } from "@mui/x-charts/colorPalettes";
import { lighten } from "@mui/material/styles";

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
      return Math.min(0.9, indexOfAccount / acctsForUser.length * 0.3);
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
        value: u.acctinputoctets,
        arcLabel: u.username,
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
          .reduce((x, y) => x + y.acctinputoctets, 0),
        arcLabel: u,
        label: u,
        color: colorForUser(u),
      })),
    [accounts, usernames, colorForUser],
  );
  const recvData = React.useMemo(
    () =>
      accounts.map((u) => ({
        id: u.radacctid,
        value: u.acctoutputoctets,
        arcLabel: u.username,
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
          .reduce((x, y) => x + y.acctoutputoctets, 0),
        arcLabel: u,
        color: colorForUser(u),
      })),
    [accounts, usernames, colorForUser],
  );
  React.useEffect(() => setHighlightGroup(true), [selectedGroup]);
  React.useEffect(() => setHighlightGroup(false), [selectedAccount]);

  return (
    <Stack direction={{ xs: "column-reverse", md: "row" }} width="100%" textAlign="center">
      <Box flexGrow={1}>
        <Box sx={{ height: 55, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h6">Received Data</Typography>
        </Box>
        <Divider />
        <PieChart
          height={300}
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
            },
            {
              innerRadius: 90,
              outerRadius: 120,
              id: "recv-items",
              highlightScope: { faded: "series", highlighted: "item" },
              faded: { additionalRadius: -5, color: "gray" },
              data: recvData,
            },
          ]}
          margin={{ top: 20, bottom: 10 }}
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
          series={[
            {
              innerRadius: 0,
              outerRadius: 90,
              id: "send-grouped",
              highlightScope: { faded: "series", highlighted: "item" },
              faded: { color: "gray" },
              data: sendDataGrouped,
            },
            {
              innerRadius: 90,
              outerRadius: 120,
              id: "send-items",
              highlightScope: { faded: "series", highlighted: "item" },
              faded: { additionalRadius: -5, color: "gray" },
              data: sendData,
            },
          ]}
          margin={{ top: 20, bottom: 10 }}
        />
      </Box>
    </Stack>
  );
}

export default DataUsagePie;
