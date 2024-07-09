import * as React from "react";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { histogram, filteredData, BUCKET_SIZES, LABEL_FUNCS, MS_IN } from "./utils";
import { fetchAPI } from "../../keycloak";

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
      .catch((error) => {
        console.log("Error fetching data usage: " + error);
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
    <ResponsiveChartContainer
      loading={loading}
      dataset={data}
      xAxis={[
        {
          id: "time",
          scaleType: "band",
          dataKey: "created",
          valueFormatter: (k) => LABEL_FUNCS[showDays](k),
        },
      ]}
      yAxis={[
        {
          id: "data_usage",
        },
      ]}
      height={300}
      series={[
        {
          dataKey: "tx_bytes",
          type: "bar",
          stack: "A",
          label: "Sent Data",
          valueFormatter: (v) => `${Math.round(v)}Mb`,
        },
        {
          dataKey: "rx_bytes",
          type: "bar",
          stack: "A",
          label: "Received Data",
          valueFormatter: (v) => `${Math.round(v)}Mb`,
        },
      ]}
      sx={{
        [`.${axisClasses.left} .${axisClasses.label}`]: {
          transform: "translateX(-10px)",
        },
      }}
    >
      <BarPlot />
      <ChartsReferenceLine y={5000} label="Warning Level" labelAlign="end" />
      <ChartsXAxis
        axisId="time"
        label={selectedDevice ? `Data Usage for ${selectedDevice}` : "Average Data Usage"}
        labelFontSize={18}
      />
      <ChartsYAxis axisId="data_usage" label={"Usage (Mb)"} />
    </ResponsiveChartContainer>
  );
};

export default DataUsageGraph;
