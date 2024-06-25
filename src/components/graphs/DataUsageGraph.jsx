import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { histogram, filteredData, BUCKET_SIZES, LABEL_FUNCS, MS_IN, mainWidthInPixels } from "./utils";
import { fetchAPI } from "../../keycloak";
import Box from "@mui/material/Box";

const DataUsageGraph = ({ showDays, selectedDevice }) => {
  const [metrics, setMetrics] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchMetrics = () => {
    setLoading(true);
    fetchAPI("/metrics/data_usage/")
      .then((data) => {
        setMetrics(
          data.map((d) => ({
            ...d,
            rx_bytes: Math.abs(d.rx_bytes / 1048576),
            tx_bytes: Math.abs(d.tx_bytes / 1048576),
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
    let hdata = histogram(fdata, minTime, BUCKET_SIZES[showDays], ["rx_bytes", "tx_bytes"], "sum");
    setData(hdata);
  }, [metrics, showDays, selectedDevice]);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <BarChart
        title="Data Usage"
        dataset={data}
        loading={loading}
        xAxis={[
          {
            id: "Time",
            scaleType: "band",
            dataKey: "created",
            valueFormatter: (k) => LABEL_FUNCS[showDays](k),
          },
        ]}
        yAxis={[
          {
            label: "Data (Mb)",
          },
        ]}
        height={300}
        width={mainWidthInPixels(0.8)}
        margin={{ top: 5, right: 5, bottom: 30, left: 100 }}
        series={[
          {
            dataKey: "tx_bytes",
            stack: "A",
            label: "Sent Data",
            valueFormatter: (v) => `${Math.round(v)}Mb`,
          },
          {
            dataKey: "rx_bytes",
            stack: "A",
            label: "Received Data",
            valueFormatter: (v) => `${Math.round(v)}Mb`,
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

export default DataUsageGraph;
