import * as React from "react";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { AreaPlot } from "@mui/x-charts/LineChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { histogram, filteredData, BUCKET_SIZES, LABEL_FUNCS, MS_IN } from "./utils";
import { fetchAPI } from "../../keycloak";

const RTTGraph = ({ showDays, selectedDevice }) => {
  const [metrics, setMetrics] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchMetrics = () => {
    setLoading(true);
    fetchAPI("/metrics/rtt/")
      .then((data) => {
        setMetrics(data);
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
    let hdata = histogram(
      fdata,
      minTime,
      BUCKET_SIZES[showDays],
      ["rtt_max", "rtt_min", "rtt_avg"],
      "avg",
    );
    setData(hdata);
  }, [metrics, showDays, selectedDevice]);

  return (
    <ResponsiveChartContainer
      loading={loading}
      xAxis={[
        {
          id: "time",
          scaleType: "time",
          data: data.map((d) => d.created),
          valueFormatter: (k) => LABEL_FUNCS[showDays](k),
        },
      ]}
      yAxis={[
        {
          id: "rtt",
        },
      ]}
      height={300}
      series={[
        {
          data: data.map((d) => d.rtt_min),
          stack: "A",
          type: "line",
          label: "RTT Min",
          valueFormatter: (v) => `${Math.round(v)}ms`,
          area: true,
          showMark: false,
        },
        {
          data: data.map((d) => d.rtt_avg),
          stack: "A",
          type: "line",
          label: "RTT Avg",
          valueFormatter: (v) => `${Math.round(v)}ms`,
          area: true,
          showMark: false,
        },
        {
          data: data.map((d) => d.rtt_max),
          stack: "A",
          type: "line",
          label: "RTT Max",
          valueFormatter: (v) => `${Math.round(v)}ms`,
          area: true,
          showMark: false,
        },
      ]}
    >
      <AreaPlot />
      <ChartsReferenceLine y={40} label="Warning Level" labelAlign="end" />
      <ChartsXAxis
        axisId="time"
        label={selectedDevice ? `Round Trip Time for ${selectedDevice}` : "Average Round Trip Time"}
        labelFontSize={18}
      />
      <ChartsYAxis axisId="rtt" label={"RTT (ms)"} />
    </ResponsiveChartContainer>
  );
};

export default RTTGraph;
