import * as React from "react";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { AreaPlot } from "@mui/x-charts/LineChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { histogram, filteredData, BUCKET_SIZES, LABEL_FUNCS, MS_IN } from "./utils";
import { fetchAPI } from "../../keycloak";

const DataRateGraph = ({ showDays, selectedDevice }) => {
  const [metrics, setMetrics] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchMetrics = () => {
    setLoading(true);
    fetchAPI("/metrics/data_rate/")
      .then((data) => {
        setMetrics(
          data.map((d) => ({
            ...d,
            rx_rate: Math.abs(d.rx_rate / 1000000),
            tx_rate: Math.abs(d.tx_rate / 1000000),
          })),
        );
      })
      .catch((error) => {
        console.log("Error fetching data rate: " + error);
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
    let hdata = histogram(fdata, minTime, BUCKET_SIZES[showDays], ["rx_rate", "tx_rate"], "avg");
    setData(hdata);
  }, [metrics, showDays, selectedDevice]);

  return (
    <ResponsiveChartContainer
      loading={loading}
      dataset={data}
      xAxis={[
        {
          id: "time",
          scaleType: "time",
          dataKey: "created",
          valueFormatter: (k) => LABEL_FUNCS[showDays](k),
        },
      ]}
      yAxis={[
        {
          id: "data_rate",
        },
      ]}
      height={300}
      series={[
        {
          dataKey: "tx_rate",
          type: "line",
          area: true,
          label: "Download Speed",
          valueFormatter: (v) => `${v}Mbps`,
        },
        {
          dataKey: "rx_rate",
          type: "line",
          area: true,
          label: "Upload Speed",
          valueFormatter: (v) => `${v}Mbps`,
        },
      ]}
      sx={{
        [`.${axisClasses.left} .${axisClasses.label}`]: {
          transform: "translateX(-10px)",
        },
      }}
    >
      <AreaPlot />
      <ChartsXAxis
        axisId="time"
        label={selectedDevice ? `Speed for ${selectedDevice}` : "Average Speed"}
        labelFontSize={18}
      />
      <ChartsYAxis axisId="data_rate" label={"Speed (Mbps)"} />
    </ResponsiveChartContainer>
  );
};

export default DataRateGraph;
