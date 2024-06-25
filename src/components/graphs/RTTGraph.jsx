import * as React from "react";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
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
    fetchMetrics()
  }, []);

  React.useEffect(() => {
    let minTime = new Date() - new Date(MS_IN[showDays]);
    let fdata = filteredData(metrics, minTime, selectedDevice);
    let hdata = histogram(fdata, minTime, BUCKET_SIZES[showDays], ["rtt_max", "rtt_min", "rtt_avg"], "avg");
    setData(hdata);
  }, [metrics, showDays, selectedDevice]);

  return (
    <LineChart
      title="Round Trip Time"
      loading={loading}
      xAxis={[
        {
          id: "Time",
          scaleType: "band",
          data: data.map(d => d.created),
          valueFormatter: (k) => LABEL_FUNCS[showDays](k),
        },
      ]}
      yAxis={[
        {
          label: "RTT (ms)",
        },
      ]}
      height={300}
      margin={{ top: 5, right: 5, bottom: 30, left: 100 }}
      series={[
        {
          data: data.map(d => d.rtt_min),
          stack: "A",
          label: "RTT Min",
          valueFormatter: (v) => `${Math.round(v)}ms`,
          area: true,
          showMark: false,
        },
        {
          data: data.map(d => d.rtt_avg),
          stack: "A",
          label: "RTT Avg",
          valueFormatter: (v) => `${Math.round(v)}ms`,
          area: true,
          showMark: false,
        },
        {
          data: data.map(d => d.rtt_max),
          stack: "A",
          label: "RTT Max",
          valueFormatter: (v) => `${Math.round(v)}ms`,
          area: true,
          showMark: false,
        },
      ]}
      sx={{
        [`& .${lineElementClasses.root}`]: {
          display: "none",
        },
        [`.${axisClasses.left} .${axisClasses.label}`]: {
          transform: "translateX(-50px)",
        },
      }}
    />
  );
};

export default RTTGraph;
