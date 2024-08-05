import * as React from "react";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { filteredData, histogram, BUCKET_SIZES, LABEL_FUNCS, MS_IN, GRANULARITY } from "./utils";
import { fetchAPI } from "../../keycloak";
import { useTheme } from "@mui/material";
import { MeshContext } from "../../context";

const DataUsageGraph = ({ showDays, selectedDevice }) => {
  const [metrics, setMetrics] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { mesh } = React.useContext(MeshContext);
  const theme = useTheme();

  React.useEffect(() => {
    setLoading(true);
    let minTimeStamp = Math.round((new Date() - new Date(MS_IN[showDays])) / 1000);
    let granularity = GRANULARITY[showDays];
    fetchAPI(`/metrics/data_usage/?min_time=${minTimeStamp}&granularity=${granularity}`)
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
        console.error("Error fetching data usage: " + error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showDays]);

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
          // Slight clarification here - from the perspective of the router, it
          // has 'transmitted' bytes, but from the perspective of the user they
          // have 'received' bytes, so to keep things consistent I color it
          // with the 'received' color.
          color: theme.palette.graphs.dataRecv,
          type: "bar",
          stack: "A",
          label: "Sent Data",
          valueFormatter: (v) => `${Math.round(v)}Mb`,
        },
        {
          dataKey: "rx_bytes",
          color: theme.palette.graphs.dataSent,
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
      {mesh &&
        ((showDays === "week" || showDays === "month") && mesh.settings.check_daily_data_usage ? (
          <ChartsReferenceLine
            y={mesh.settings.check_daily_data_usage}
            label="Daily Warning Level"
            labelAlign="end"
          />
        ) : showDays === "day" && mesh.settings.check_hourly_data_usage ? (
          <ChartsReferenceLine
            y={mesh.settings.check_hourly_data_usage}
            label="Hourly Warning Level"
            labelAlign="end"
          />
        ) : null)}
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
