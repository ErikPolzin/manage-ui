import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

const DataUsageGraph = ({ nodeName, dataset }) => {
  const [maxDays, setMaxDays] = React.useState(31);

  function data() {
    return dataset
      .filter(
        (item) =>
          maxDays === -1 || Math.abs(new Date() - new Date(item.created)) / 36e5 / 24 < maxDays,
      )
      .map((item) => ({ ...item, rx_bytes: item.rx_bytes / 1048576, tx_bytes: item.tx_bytes / 1048576 }));
  }

  const changeMaxDays = (event, newMaxDays) => {
    setMaxDays(newMaxDays);
  };

  const valueFormatter = (value) => `${Math.round(value)}Mb`;
  const keyFormatter = (key) => {
    switch(maxDays) {
      case 1:
        return new Date(key).toLocaleTimeString()
      default:
        return new Date(key).toLocaleDateString()
    }
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2
      }}
    >
      <BarChart
        title="Data Usage"
        dataset={data()}
        xAxis={[
          {
            id: "Time",
            scaleType: "band",
            dataKey: "created",
            valueFormatter: keyFormatter,
          },
        ]}
        yAxis={[
          {
            label: "Data (Mb)",
          },
        ]}
        height={300}
        margin={{ top: 5, right: 5, bottom: 30, left: 100 }}
        series={[
          { dataKey: "tx_bytes", stack: 'A', label: "Sent Data", valueFormatter },
          { dataKey: "rx_bytes", stack: 'A', label: "Received Data", valueFormatter },
        ]}
        sx={{
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: "translateX(-50px)",
          },
        }}
      />
      <ToggleButtonGroup
        color="primary"
        value={maxDays}
        exclusive
        onChange={changeMaxDays}
        size="small"
        aria-label="Date Range"
      >
        <ToggleButton value={1}>24 Hours</ToggleButton>
        <ToggleButton value={7}>Week</ToggleButton>
        <ToggleButton value={31}>Month</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default DataUsageGraph;
