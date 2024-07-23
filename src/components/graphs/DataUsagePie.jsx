import React from "react";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { PieChart } from "@mui/x-charts/PieChart";

function DataUsagePie({ users, selectedIndex }) {
  const [dataType, setDataType] = React.useState("recv");

  const sendData = () =>
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

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyItems: "center",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <PieChart
        highlightedItem={
          selectedIndex !== -1 ? { seriesId: "send-recv", dataIndex: selectedIndex } : null
        }
        height={300}
        series={[
          {
            data: dataType === "recv" ? recvData() : sendData(),
            id: "send-recv",
            innerRadius: 70,
            cornerRadius: 3,
            paddingAngle: 1,
            highlightScope: { faded: "series", highlighted: "item" },
            faded: { additionalRadius: -10, color: "gray" },
          },
        ]}
        margin={{ top: 20, bottom: 10 }}
      />
      <ToggleButtonGroup
        color="primary"
        value={dataType}
        onChange={(e, v) => v !== null && setDataType(v)}
        exclusive
        size="small"
      >
        <ToggleButton value={"recv"}>Received</ToggleButton>
        <ToggleButton value={"send"}>Sent</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default DataUsagePie;
