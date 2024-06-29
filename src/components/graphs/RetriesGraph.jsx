import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchAPI } from "../../keycloak";

const RETRIES_BRACKETS = [1000, 2000, 5000, 10000];
const BRACKET_COLORS = ["#28b550", "#57a334", "#80a334", "#a38234", "#a35034"];
const GREY_COLOR = "#adadad";
const H24 = 1000 * 60 * 60 * 24;

function bracketIndex(retries) {
  for (let i = 0; i < RETRIES_BRACKETS.length; i++) {
    if (retries < RETRIES_BRACKETS[i]) return i;
  }
  return RETRIES_BRACKETS.length;
}

const RetriesGraph = ({ deviceMac }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchFailuresMetrics = React.useCallback(() => {
    if (!deviceMac) return;
    let minTime = Math.round((new Date().getTime() - H24) / 1000);
    setLoading(true);
    fetchAPI(`/metrics/failures/?mac=${deviceMac}&min_time=${minTime}`)
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

  const generateSeries = React.useCallback(() => {
    let series = [];
    let currentBracket = null;
    let currentTime = 0;
    if (data.length > 0) {
      // Add an initial bar from 0 until the first measurement
      // to indicate that no measurements were taken before this time.
      let d0 = data[0];
      currentTime = new Date(d0.created).getTime();
      currentBracket = bracketIndex(d0.tx_retries);
      series.push({
        data: [currentTime],
        stack: "A",
        type: "bar",
        color: GREY_COLOR,
      });
      // Add the bulk of the measurements between the first and last item,
      // segments will appear either greenish or reddish depending on how
      // many TX retries took place
      for (let i = 1; i < data.length; i++) {
        let bracket = bracketIndex(data[i].tx_retries);
        if (bracket !== currentBracket || i === data.length - 1) {
          series.push({
            data: [new Date(data[i].created).getTime() - currentTime],
            stack: "A",
            type: "bar",
            color: BRACKET_COLORS[currentBracket],
          });
          currentTime = new Date(data[i].created).getTime();
          currentBracket = bracket;
        }
      }
    }
    // Add a final bar from the last measurement until the current time
    // to indicate that no measurements have been taken after this time.
    series.push({
      data: [new Date() - new Date(currentTime)],
      stack: "A",
      type: "bar",
      color: GREY_COLOR,
    });
    return series;
  }, [data]);

  React.useEffect(() => {
    setError(null);
    fetchFailuresMetrics();
  }, [fetchFailuresMetrics]);

  return (
    <BarChart
      loading={loading}
      tooltip={{
        trigger: "none",
      }}
      xAxis={[
        {
          id: "retries",
          valueFormatter: (k) =>
            new Date(k).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          min: new Date() - H24,
          max: new Date(),
          scaleType: "linear",
        },
      ]}
      yAxis={[
        {
          id: "time",
          scaleType: "band",
          data: ["Retries"],
        },
      ]}
      leftAxis={null}
      height={110}
      layout="horizontal"
      series={generateSeries()}
    />
  );
};

export default RetriesGraph;
