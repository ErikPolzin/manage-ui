import React from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { fetchAPI } from "../keycloak";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import NetworkMap from "../components/NetworkMap";

const HomePage = () => {
  const [nodes, setNodes] = React.useState([]);
  const [loading, setLoading] = React.useState(0);
  const [nNodes, setNNodes] = React.useState(0);
  const [nPositionedNodes, setNPositionedNodes] = React.useState(0);
  const [nUnknownNodes, setNUnknownNodes] = React.useState(0);
  const [nOkNodes, setNOkNodes] = React.useState(0);

  React.useEffect(() => {
    fetchOverview();
    fetchNodes();
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
  const overviewOffset = () => {
    let overviewElement = document.getElementById("overview-stack");
    let navbarHeight = 64;
    let mapHeight = document.documentElement.clientHeight * 0.6;
    let overviewHeight = overviewElement ? overviewElement.offsetHeight : 0;
    return window.innerHeight - navbarHeight - mapHeight - overviewHeight - 2;
  };
  const fetchNodes = () => {
    fetchAPI("/monitoring/devices/?fields=lat&fields=lon&fields=name&fields=mac").then((data) => {
      setNodes(data);
    });
  };
  const handleNodePositionChange = (node, lat, lon) => {
    return fetchAPI(`/monitoring/devices/${node.mac}/`, "PATCH", { lat, lon }).then(() => {
      fetchOverview(); // refresh the overview stats, may have changed
      fetchNodes();
    });
  };
  return (
    <Box>
      <Box>
        <NetworkMap
          handlePositionChange={handleNodePositionChange}
          nodes={nodes}
          style={{ position: "sticky", top: "-150px", height: "60vh" }}
        />
        <Divider />
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 6 }}
          alignItems="center"
          justifyContent="center"
          sx={{ flexGrow: 1, marginTop: `${overviewOffset()}px`, paddingBottom: 3 }}
          id="overview-stack"
        >
          <Card variant="outlined" style={{ zIndex: 1000 }}>
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
                text={() => `${nPositionedNodes} / ${nNodes}`}
              />
            </CardContent>
            <Divider></Divider>
            <CardHeader subheader={"Geopositioned Nodes"} sx={{ textAlign: "center" }} />
          </Card>
          <Card sx={{ borderRadius: 3, zIndex: 1000 }}>
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
                text={() => `${nOkNodes} / ${nNodes}`}
              />
            </CardContent>
            <Divider></Divider>
            <CardHeader title={"OK Nodes"} sx={{ textAlign: "center" }} />
          </Card>
          <Card variant="outlined" style={{ zIndex: 1000 }}>
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
                text={() => `${nNodes} / ${nNodes + nUnknownNodes}`}
              />
            </CardContent>
            <Divider></Divider>
            <CardHeader subheader={"Registered Nodes"} sx={{ textAlign: "center" }} />
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};

export default HomePage;
