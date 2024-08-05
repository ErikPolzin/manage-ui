import * as React from "react";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { AreaPlot } from "@mui/x-charts/LineChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { histogram, filteredData, GRANULARITY, BUCKET_SIZES, LABEL_FUNCS, MS_IN } from "./utils";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { fetchAPI } from "../../keycloak";
import { useTheme } from "@mui/material";
import { MeshContext } from "../../context";

const DataRateGraph = ({ showDays, selectedDevice }) => {
  const theme = useTheme();
  const [metrics, setMetrics] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { mesh } = React.useContext(MeshContext);

  React.useEffect(() => {
    setLoading(true);
    let minTimeStamp = Math.round((new Date() - new Date(MS_IN[showDays])) / 1000);
    let granularity = GRANULARITY[showDays];
    fetchAPI(`/metrics/data_rate/?min_time=${minTimeStamp}&granularity=${granularity}`)
      .then((data) => {
        setMetrics(
          data.map((d) => ({
            ...d,
            rx_rate: Math.abs(d.rx_rate / 1000),
            tx_rate: Math.abs(d.tx_rate / 1000),
          })),
        );
      })
      .catch((error) => {
        console.error("Error fetching data rate: " + error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showDays]);

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
          color: theme.palette.graphs.dataRecv,
          valueFormatter: (v) => `${v}KiB/s`,
        },
        {
          dataKey: "rx_rate",
          type: "line",
          area: true,
          label: "Upload Speed",
          color: theme.palette.graphs.dataSent,
          valueFormatter: (v) => `${v}KiB/s`,
        },
      ]}
      sx={{
        [`.${axisClasses.left} .${axisClasses.label}`]: {
          transform: "translateX(-10px)",
        },
      }}
    >
      <AreaPlot />
      {mesh &&
        (mesh.settings.check_download_speed ? (
          <ChartsReferenceLine
            y={mesh.settings.check_download_speed/1000}
            label="Minimum Download Speed"
            labelAlign="end"
          />
        ) : mesh.settings.check_download_speed ? (
          <ChartsReferenceLine
            y={mesh.settings.check_download_speed/1000}
            label="Minimum Upload Speed"
            labelAlign="end"
          />
        ) : null)}
      <ChartsXAxis
        axisId="time"
        label={selectedDevice ? `Speed for ${selectedDevice}` : "Average Speed"}
        labelFontSize={18}
      />
      <ChartsYAxis axisId="data_rate" label={"Speed (KiB/s)"} />
    </ResponsiveChartContainer>
  );
};

export default DataRateGraph;
