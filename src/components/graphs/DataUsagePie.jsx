import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { PieChart } from "@mui/x-charts/PieChart";
import { blueberryTwilightPalette } from "@mui/x-charts/colorPalettes";
import { lighten } from "@mui/material/styles";

function DataUsagePie({ accounts }) {
  const theme = useTheme();
  const colors = blueberryTwilightPalette(theme.palette.mode);
  const [userColorTable, setUserColorTable] = React.useState({});
  const [userIndex, setUserIndex] = React.useState(0);

  const usernames = React.useCallback(
    () => Array.from(new Set(accounts.map((ra) => ra.username))),
    [accounts],
  );

  const lightenPercent = React.useCallback(
    (u, acct) => {
      if (!acct) return 0;
      let acctsForUser = accounts.filter((a) => a.username === u);
      if (acctsForUser.length === 0) return 0;
      let indexOfAccount = acctsForUser.map((a) => a.radacctid).indexOf(acct);
      return (indexOfAccount + 1) / acctsForUser.length / 2;
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

  const sendData = React.useCallback(
    () =>
      accounts.map((u) => ({
        id: u.radacctid,
        value: u.acctinputoctets,
        arcLabel: u.username,
        color: colorForUser(u.username, u.radacctid),
      })),
    [accounts, colorForUser],
  );

  const sendDataGrouped = React.useCallback(
    () =>
      usernames().map((u) => ({
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

  const recvData = React.useCallback(
    () =>
      accounts.map((u) => ({
        id: u.radacctid,
        value: u.acctoutputoctets,
        arcLabel: u.username,
        color: colorForUser(u.username, u.radacctid),
      })),
    [accounts, colorForUser],
  );

  const recvDataGrouped = React.useCallback(
    () =>
      usernames().map((u) => ({
        id: u,
        value: accounts
          .filter((ra) => ra.username === u)
          .reduce((x, y) => x + y.acctoutputoctets, 0),
        arcLabel: u,
        color: colorForUser(u),
      })),
    [accounts, usernames, colorForUser],
  );

  return (
    <Stack direction={{ xs: "column-reverse", md: "row" }} width="100%" textAlign="center" spacing={2}>
      <Box flexGrow={1}>
        <Typography variant="h6">Received Data</Typography>
        <Divider />
        <PieChart
          // highlightedItem={{ seriesId: "recv-grouped", dataIndex: selectedRecvIndex() }}
          height={300}
          series={[
            {
              innerRadius: 0,
              outerRadius: 90,
              id: "recv-grouped",
              highlightScope: { faded: "series", highlighted: "item" },
              faded: { additionalRadius: -10, color: "gray" },
              data: recvDataGrouped(),
            },
            {
              innerRadius: 95,
              outerRadius: 120,
              id: "recv-items",
              highlightScope: { faded: "series", highlighted: "item" },
              faded: { additionalRadius: -10, color: "gray" },
              data: recvData(),
            },
          ]}
          margin={{ top: 20, bottom: 10 }}
        />
      </Box>
      <Box flexGrow={1}>
        <Typography variant="h6">Sent Data</Typography>
        <Divider />
        <PieChart
          // highlightedItem={{ seriesId: "send-grouped", dataIndex: selectedSendIndex() }}
          height={300}
          series={[
            {
              innerRadius: 0,
              outerRadius: 90,
              id: "send-grouped",
              highlightScope: { faded: "series", highlighted: "item" },
              faded: { additionalRadius: -10, color: "gray" },
              data: sendDataGrouped(),
            },
            {
              innerRadius: 95,
              outerRadius: 120,
              id: "send-items",
              highlightScope: { faded: "series", highlighted: "item" },
              faded: { additionalRadius: -10, color: "gray" },
              data: sendData(),
            },
          ]}
          margin={{ top: 20, bottom: 10 }}
        />
      </Box>
    </Stack>
  );
}

export default DataUsagePie;
