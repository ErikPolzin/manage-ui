import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

const DataUsageGraph = ({ dataset, loading, showDays }) => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    setData(histogram(filteredData(dataset)));
  }, [dataset]);

  function filteredData(_data) {
    return _data
      .filter((item) => Math.abs(new Date() - new Date(item.created)) / 36e5 / 24 < showDays)
      .map((item) => ({
        rx_bytes: Math.abs(item.rx_bytes / 1048576),
        tx_bytes: Math.abs(item.tx_bytes / 1048576),
        created: new Date(item.created).getTime(),
      }))
      .sort((a, b) => a.created - b.created);
  }

  function histogram(_data) {
    let output = [];
    let maxTime = new Date().getTime();
    let minTime = maxTime - (36e5 * 24 * showDays);
    let bucketWidth = bucketSize();
    let bucketStart = roundDownTo(minTime, bucketWidth);
    let i = 0;
    while (bucketStart < maxTime) {
      let sumOverBucket = {
        rx_bytes: 0,
        tx_bytes: 0,
        created: bucketStart,
      };
      while (
        _data[i] &&
        bucketStart <= _data[i].created &&
        _data[i].created < bucketStart + bucketWidth
      ) {
        sumOverBucket.rx_bytes += _data[i].rx_bytes;
        sumOverBucket.tx_bytes += _data[i].tx_bytes;
        i++;
      }
      output.push(sumOverBucket);
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

  const valueFormatter = (value) => `${Math.round(value)}Mb`;
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
      title="Data Usage"
      dataset={data}
      loading={loading}
      xAxis={[
        {
          id: "Time",
          scaleType: "band",
          dataKey: "created",
          valueFormatter: keyFormatter,
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
        { dataKey: "tx_bytes", stack: "A", label: "Sent Data", valueFormatter },
        { dataKey: "rx_bytes", stack: "A", label: "Received Data", valueFormatter },
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
