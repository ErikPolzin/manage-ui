import React from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { fetchAPI } from "../keycloak";
import { Divider, Typography, Card, CardContent, CardHeader } from "@mui/material";
import Stack from "@mui/material/Stack";

const HomePage = () => {
  const [loading, setLoading] = React.useState(0);
  const [nNodes, setNNodes] = React.useState(0);
  const [nPositionedNodes, setNPositionedNodes] = React.useState(0);
  const [nUnknownNodes, setNUnknownNodes] = React.useState(0);
  const [nOkNodes, setNOkNodes] = React.useState(0);

  React.useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = () => {
    setLoading(true);
    fetchAPI("/monitoring/overview/")
      .then((data) => {
        setNNodes(data.n_nodes);
        setNPositionedNodes(data.n_positioned_nodes);
        setNUnknownNodes(data.n_unknown_nodes);
        setNOkNodes(data.n_ok_nodes);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 3, md: 6 }}
      alignItems="center"
      justifyContent="center"
      sx={{ flexGrow: 1, marginTop: 3 }}
    >
      <Card variant="outlined">
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Gauge
            width={200}
            height={200}
            value={(nPositionedNodes / nNodes) * 100}
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 20,
                transform: "translate(0px, 0px)",
              },
            }}
            text={({ value, valueMax }) => `${nPositionedNodes} / ${nNodes}`}
          />
        </CardContent>
        <Divider></Divider>
        <CardHeader subheader={"Geopositioned Nodes"} sx={{ textAlign: "center" }} />
      </Card>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Gauge
            width={300}
            height={250}
            value={(nOkNodes / nNodes) * 100}
            startAngle={-110}
            endAngle={110}
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 30,
                transform: "translate(0px, 0px)",
              },
            }}
            text={({ value, valueMax }) => `${nOkNodes} / ${nNodes}`}
          />
          
        </CardContent>
        <Divider></Divider>
        <CardHeader title={"OK Nodes"} sx={{ textAlign: "center" }} />
      </Card>
      <Card variant="outlined">
        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Gauge
            width={200}
            height={200}
            value={(nNodes / (nNodes + nUnknownNodes)) * 100}
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 20,
                transform: "translate(0px, 0px)",
              },
            }}
            text={({ value, valueMax }) => `${nNodes} / ${nNodes + nUnknownNodes}`}
          />
        </CardContent>
        <Divider></Divider>
        <CardHeader subheader={"Registered Nodes"} sx={{ textAlign: "center" }} />
      </Card>
    </Stack>
  );
};

export default HomePage;
