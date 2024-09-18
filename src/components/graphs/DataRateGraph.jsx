import * as React from "react";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { AreaPlot } from "@mui/x-charts/LineChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { histogram, GRANULARITY, LABEL_FUNCS, MS_IN } from "./utils";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { fetchAPI } from "../../keycloak";
import { useTheme } from "@mui/material";
import { MeshContext } from "../../context";
import qs from "qs";

const DataRateGraph = ({ showDays, selectedDevice }) => {
  const theme = useTheme();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { mesh } = React.useContext(MeshContext);

  React.useEffect(() => {
    setLoading(true);
    let params = {
      min_time: Math.round((new Date() - new Date(MS_IN[showDays])) / 1000),
      granularity: GRANULARITY[showDays],
      mac: selectedDevice,
      mesh: mesh?.name,
    };
    fetchAPI(`/metrics/data_rate/?${qs.stringify(params)}`)
      .then((data) => {
        setData(
          histogram(
            data.map((d) => ({
              created: new Date(d.created).getTime(),
              rx_rate: Math.abs(d.rx_rate / 1000),
              tx_rate: Math.abs(d.tx_rate / 1000),
            })),
            showDays,
            ["rx_rate", "tx_rate"],
            "avg"
          ),
        );
      })
      .catch((error) => {
        console.error("Error fetching data rate: " + error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showDays, selectedDevice, mesh]);

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
