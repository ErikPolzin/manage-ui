import * as React from "react";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

const RTTGraph = ({ dataset, loading, showDays }) => {
  function filteredData() {
    return dataset
      .filter((item) => Math.abs(new Date() - new Date(item.created)) / 36e5 / 24 < showDays)
      .filter((item) => item.rtt_max && item.rtt_avg && item.rtt_min)
      .map((item) => ({
        rtt_max: item.rtt_max,
        rtt_min: item.rtt_min,
        rtt_avg: item.rtt_avg,
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
        rtt_max: 0,
        rtt_min: 0,
        rtt_avg: 0,
        created: bucketStart,
      };
      let numInBucket = 0;
      while (
        data[i] &&
        bucketStart <= data[i].created &&
        data[i].created < bucketStart + bucketWidth
      ) {
        avgOverBucket.rtt_max += data[i].rtt_max;
        avgOverBucket.rtt_min += data[i].rtt_min;
        avgOverBucket.rtt_avg += data[i].rtt_avg;
        i++; numInBucket++;
      }
      if (numInBucket > 1) {
        avgOverBucket.rtt_max /= numInBucket;
        avgOverBucket.rtt_min /= numInBucket;
        avgOverBucket.rtt_avg /= numInBucket;
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

  const valueFormatter = (value) => `${Math.round(value)}ms`;
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
    <LineChart
      title="Round Trip Time"
      dataset={histogram(filteredData())}
      loading={loading}
      xAxis={[
        {
          id: "Time",
          scaleType: "point",
          dataKey: "created",
          valueFormatter: keyFormatter,
          min: new Date(new Date() - new Date(1000 * 60 * 60 * 24 * 7)).getTime(),
          max: new Date().getTime(),
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
          dataKey: "rtt_min",
          stack: "A",
          label: "RTT Min",
          valueFormatter,
          area: true,
          showMark: false,
        },
        {
          dataKey: "rtt_avg",
          stack: "A",
          label: "RTT Avg",
          valueFormatter,
          area: true,
          showMark: false,
        },
        {
          dataKey: "rtt_max",
          stack: "A",
          label: "RTT Max",
          valueFormatter,
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
