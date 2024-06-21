import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

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

const UptimeGraph = ({ dataset, loading, showDays }) => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    setData(histogram(filteredData(dataset)));
  }, [dataset]);

  function filteredData(dset) {
    return dset
      .filter((item) => Math.abs(new Date() - new Date(item.created)) / 36e5 / 24 < showDays)
      .map((item) => ({
        uptime: item.reachable ? 100 : 0,
        created: new Date(item.created).getTime(),
      }))
      .sort((a, b) => a.created - b.created);
  }

  function histogram(data) {
    let output = [];
    let maxTime = new Date().getTime();
    let minTime = maxTime - 36e5 * 24 * showDays;
    let bucketWidth = bucketSize();
    let bucketStart = roundDownTo(minTime, bucketWidth);
    let i = 0;
    while (bucketStart < maxTime) {
      let avgOverBucket = {
        uptime: 0,
        created: bucketStart,
      };
      let numInBucket = 0;
      while (
        data[i] &&
        bucketStart <= data[i].created &&
        data[i].created < bucketStart + bucketWidth
      ) {
        avgOverBucket.uptime += data[i].uptime;
        i++;
        numInBucket++;
      }
      if (numInBucket > 1) {
        avgOverBucket.uptime /= numInBucket;
      }
      output.push(avgOverBucket);
      bucketStart += bucketWidth;
    }
    return output;
  }

  const bucketSize = () => {
    switch (showDays) {
      case 1:
        return 36e5; // 1 hour
      case 7:
        return 36e5 * 12; // 12 hours
      default:
        return 36e5 * 24; // 24 hours
    }
  };

  const roundDownTo = function (n, multiple) {
    return multiple * Math.floor(n / multiple);
  };

  const valueFormatter = (value) => `${Math.round(value)}%`;
  const keyFormatter = (key) => {
    switch (showDays) {
      case 1:
        return new Date(key).toLocaleTimeString();
      case 7:
        return new Date(key).toLocaleDateString("en-GB", { weekday: "short" });
      default:
        return new Date(key).toLocaleDateString();
    }
  };
  return (
    <BarChart
      title="Uptime"
      dataset={data}
      loading={loading}
      xAxis={[
        {
          id: "Time",
          scaleType: "band",
          dataKey: "created",
          valueFormatter: keyFormatter,
          colorMap: {
            type: "ordinal",
            colors: data.map((d) => d.uptime).map(colorForUptime),
          },
        },
      ]}
      yAxis={[
        {
          label: "Uptime (%)",
        },
      ]}
      height={300}
      margin={{ top: 5, right: 5, bottom: 30, left: 100 }}
      series={[{ dataKey: "uptime", label: "Uptime", area: true, valueFormatter }]}
      sx={{
        [`.${axisClasses.left} .${axisClasses.label}`]: {
          transform: "translateX(-50px)",
        },
      }}
    />
  );
};

export default UptimeGraph;
