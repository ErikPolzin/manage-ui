import * as React from "react";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { histogram, filteredData, BUCKET_SIZES, LABEL_FUNCS, MS_IN } from "./utils";

const RTTGraph = ({ dataset, loading, showDays }) => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    let showMs = MS_IN[showDays];
    let minTime = new Date() - new Date(showMs);
    let sdata = dataset.map((d) => ({ ...d, uptime: d.reachable ? 100 : 0 }));
    let fdata = filteredData(sdata, minTime);
    let hdata = histogram(fdata, minTime, BUCKET_SIZES[showDays], ["rtt_max", "rtt_min", "rtt_avg"], "avg");
    setData(hdata);
  }, [dataset, showDays]);

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
