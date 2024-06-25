import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { histogram, filteredData, BUCKET_SIZES, LABEL_FUNCS, MS_IN, mainWidthInPixels } from "./utils";
import { fetchAPI } from "../../keycloak";
import Box from "@mui/material/Box";

const COLOR_MAP = [
  [10, "#FF0000"],
  [20, "#c02600"],
  [30, "#d45500"],
  [40, "#e28800"],
  [50, "#d6ae0d"],
  [60, "#a8a81c"],
  [70, "#a7c726"],
  [80, "#67971f"],
  [90, "#42910d"],
  [100, "#28970c"],
];

const colorForUptime = (uptime) => {
  for (const [maxValue, color] of COLOR_MAP) {
    if (uptime <= maxValue) return color;
  }
  return COLOR_MAP.slice(-1)[1]; // Last color
};

const UptimeGraph = ({ showDays, selectedDevice }) => {
  const [metrics, setMetrics] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchMetrics = () => {
    setLoading(true);
    fetchAPI("/metrics/uptime/")
      .then((data) => {
        setMetrics(
          data.map((d) => ({
            ...d,
            uptime: d.reachable ? 100 : 0,
          })),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchMetrics();
  }, []);

  React.useEffect(() => {
    let minTime = new Date() - new Date(MS_IN[showDays]);
    let fdata = filteredData(metrics, minTime, selectedDevice);
    let hdata = histogram(fdata, minTime, BUCKET_SIZES[showDays], ["uptime"], "avg");
    setData(hdata);
  }, [metrics, showDays, selectedDevice]);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <BarChart
        title="Uptime"
        dataset={data}
        loading={loading}
        xAxis={[
          {
            id: "Time",
            scaleType: "band",
            dataKey: "created",
            valueFormatter: (k) => LABEL_FUNCS[showDays](k),
            colorMap: {
              type: "ordinal",
              colors: data.map((d) => d.uptime).map(colorForUptime),
            },
          },
        ]}
        yAxis={[
          {
            label: "Uptime (%)",
          },
        ]}
        height={300}
        width={mainWidthInPixels(0.8)}
        margin={{ top: 5, right: 5, bottom: 30, left: 100 }}
        series={[
          {
            dataKey: "uptime",
            label: "Uptime",
            area: true,
            valueFormatter: (v) => `${Math.round(v)}%`,
          },
        ]}
        sx={{
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: "translateX(-50px)",
          },
        }}
      />
    </Box>
  );
};

export default UptimeGraph;
