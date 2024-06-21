import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { histogram, filteredData, BUCKET_SIZES, LABEL_FUNCS, MS_IN } from "./utils";

const DataUsageGraph = ({ dataset, loading, showDays }) => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    let showMs = MS_IN[showDays];
    let minTime = new Date() - new Date(showMs);
    let sdata = dataset.map((d) => ({
      ...d,
      rx_bytes: Math.abs(d.rx_bytes / 1048576),
      tx_bytes: Math.abs(d.tx_bytes / 1048576),
    }));
    let fdata = filteredData(sdata, minTime);
    let hdata = histogram(fdata, minTime, BUCKET_SIZES[showDays], ["rx_bytes", "tx_bytes"], "sum");
    setData(hdata);
  }, [dataset, showDays]);

  return (
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
  );
};

export default DataUsageGraph;
