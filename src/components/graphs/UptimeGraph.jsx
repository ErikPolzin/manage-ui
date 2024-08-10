import * as React from "react";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { histogram, GRANULARITY, LABEL_FUNCS, MS_IN } from "./utils";
import { fetchAPI } from "../../keycloak";
import { MeshContext } from "../../context";
import qs from "qs";

const COLOR_MAP = [
  [10, "#FF0000"],
  [20, "#c02600"],
  [30, "#d45500"],
  [40, "#e28800"],
  [50, "#d6ae0d"],
  [60, "#a8a81c"],
  [70, "#a7c726"],
  [80, "#67971f"],
  [90, "#42910d"],
  [100, "#28970c"],
];

const colorForUptime = (uptime) => {
  for (const [maxValue, color] of COLOR_MAP) {
    if (uptime <= maxValue) return color;
  }
  return COLOR_MAP.slice(-1)[1]; // Last color
};

const UptimeGraph = ({ showDays, selectedDevice }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { mesh } = React.useContext(MeshContext);

  React.useEffect(() => {
    setLoading(true);
    let params = {
      min_time: Math.round((new Date() - new Date(MS_IN[showDays])) / 1000),
      granularity: GRANULARITY[showDays],
      mac: selectedDevice,
    };
    fetchAPI(`/metrics/uptime/?${qs.stringify(params)}`)
      .then((data) => {
        setData(
          histogram(
            data.map((d) => ({
              created: new Date(d.created).getTime(),
              uptime: 100 - d.loss,
            })),
            showDays,
            ["uptime"],
            "avg"
          ),
        );
      })
      .catch((error) => {
        console.error("Error fetching uptime: " + error);
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
          colorMap: {
            type: "ordinal",
            colors: data.map((d) => d.uptime).map(colorForUptime),
          },
        },
      ]}
      yAxis={[
        {
          id: "uptime",
        },
      ]}
      height={300}
      series={[
        {
          dataKey: "uptime",
          label: "Uptime",
          area: true,
          type: "bar",
          valueFormatter: (v) => `${Math.round(v)}%`,
        },
      ]}
    >
      <BarPlot />
      {mesh &&
        ((showDays === "week" || showDays === "month") && mesh.settings.check_daily_uptime ? (
          <ChartsReferenceLine
            y={mesh.settings.check_daily_uptime}
            label="Daily Warning Level"
            labelAlign="end"
          />
        ) : showDays === "day" && mesh.settings.check_hourly_uptime ? (
          <ChartsReferenceLine
            y={mesh.settings.check_hourly_uptime}
            label="Hourly Warning Level"
            labelAlign="end"
          />
        ) : null)}
      <ChartsXAxis
        axisId="time"
        label={selectedDevice ? `Uptime for ${selectedDevice}` : "Average Uptime"}
        labelFontSize={18}
      />
      <ChartsYAxis axisId="uptime" label={"Uptime (%)"} />
    </ResponsiveChartContainer>
  );
};

export default UptimeGraph;
