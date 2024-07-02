import * as React from "react";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { AreaPlot } from "@mui/x-charts/LineChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { fetchAPI } from "../../keycloak";

const H24 = 1000 * 60 * 60 * 24;


const ResourcesGraph = ({ deviceMac }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchResourcesMetrics = React.useCallback(() => {
    if (!deviceMac) return;
    let minTime = Math.round((new Date().getTime() - H24) / 1000);
    setLoading(true);
    fetchAPI(`/metrics/resources/?mac=${deviceMac}&min_time=${minTime}`)
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [deviceMac]);

  React.useEffect(() => {
    setError(null);
    fetchResourcesMetrics();
  }, [fetchResourcesMetrics]);

  return (
    <ResponsiveChartContainer
        loading={loading}
        xAxis={[
          {
            id: "time",
            scaleType: "time",
            data: data.map((d) => new Date(d.created)),
          },
        ]}
        yAxis={[
          {
            id: "usage",
          },
        ]}
        height={300}
        series={[
          {
            data: data.map((d) => d.cpu === -1 ? null : d.cpu),
            stack: "A",
            type: "line",
            label: "CPU",
            area: true,
            valueFormatter: (v) => `${Math.round(v)}%`,
          },
          {
            data: data.map((d) => d.memory),
            stack: "A",
            type: "line",
            label: "Memory",
            area: true,
            valueFormatter: (v) => `${Math.round(v)}%`,
          },
        ]}
      >
        <AreaPlot />
        <ChartsXAxis axisId="time" />
        <ChartsYAxis axisId="usage" label={"Usage (%)"} />
      </ResponsiveChartContainer>
  );
};

export default ResourcesGraph;
