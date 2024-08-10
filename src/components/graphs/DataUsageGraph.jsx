import * as React from "react";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { histogram, LABEL_FUNCS, MS_IN, GRANULARITY } from "./utils";
import { fetchAPI } from "../../keycloak";
import { useTheme } from "@mui/material";
import { MeshContext } from "../../context";
import qs from "qs";

const DataUsageGraph = ({ showDays, selectedDevice }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { mesh } = React.useContext(MeshContext);
  const theme = useTheme();

  React.useEffect(() => {
    setLoading(true);
    let params = {
      min_time: Math.round((new Date() - new Date(MS_IN[showDays])) / 1000),
      granularity: GRANULARITY[showDays],
      mac: selectedDevice,
    };
    fetchAPI(`/metrics/data_usage/?${qs.stringify(params)}`)
      .then((data) => {
        setData(
          histogram(
            data.map((d) => ({
              created: new Date(d.created).getTime(),
              rx_bytes: Math.abs(d.rx_bytes / 1048576),
              tx_bytes: Math.abs(d.tx_bytes / 1048576),
            })),
            showDays,
            ["rx_bytes", "tx_bytes"],
          ),
        );
      })
      .catch((error) => {
        console.error("Error fetching data usage: " + error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showDays, selectedDevice]);

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
