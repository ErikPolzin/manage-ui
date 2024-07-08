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
import MapNodePopup from "../components/MapNodePopup";
import { useNavigate } from "react-router-dom";
import qs from "qs";

const HomePage = () => {
  const [nodes, setNodes] = React.useState([]);
  const [loading, setLoading] = React.useState(0);
  const [nNodes, setNNodes] = React.useState(0);
  const [nPositionedNodes, setNPositionedNodes] = React.useState(0);
  const [nUnknownNodes, setNUnknownNodes] = React.useState(0);
  const [nOkNodes, setNOkNodes] = React.useState(0);
  const [clickedNode, setClickedNode] = React.useState(null);
  const [nodeCardPosition, setNodeCardPosition] = React.useState({ x: null, y: null });
  //const [mousePosition, setMousePosition] = React.useState({ x: null, y: null });
  const [nodeInfoCardHeight, setNodeInfoCardHeight] = React.useState({ height: 200, set: false });
  let mousePosition = { x: null, y: null };

  React.useEffect(() => {
    fetchOverview();
    fetchNodes();
  }, []);

  React.useEffect(() => {
    //
    if (!clickedNode) {
      setNodeCardPosition(calculateNodePosition());
    } else if (nodeInfoCardHeight.set === false) {
      try {
        let height = document.getElementById("node-info-card").offsetHeight;
        setNodeInfoCardHeight({
          height: height,
          set: true,
        });
        console.log("Node info card height found. Set to: " + height);
      } catch (e) {}
    }
  }, [clickedNode]);

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

  const calculateNodePosition = () => {
    let mapHeight = document.getElementById("dashboard-map").offsetHeight;
    let navbarHeight = 64;
    let navbarMapHeight = mapHeight + navbarHeight;
    let nodeInfoCardWidth = 160;

    let nodeCardX =
      mousePosition.x + nodeInfoCardWidth + 10 > window.innerWidth
        ? window.innerWidth - nodeInfoCardWidth - 10
        : mousePosition.x + 20;
    let nodeCardY =
      mousePosition.y + nodeInfoCardHeight + 10 > navbarMapHeight
        ? navbarMapHeight - nodeInfoCardHeight - 10
        : mousePosition.y;

    return { x: nodeCardX, y: nodeCardY };
  };

  const handleMouseMove = (event) => {
    // This must not update if the mouse is being held in
    mousePosition = { x: event.pageX, y: event.pageY };
  };

  const fetchNodes = () => {
    console.log("setting the nodes");
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

  const handleClickedNode = (node) => {
    if (node === null) {
      console.log("Closing node info");
      setClickedNode(null);
    } else if (node !== clickedNode) {
      console.log("Showing node info");
      setNodeCardPosition(calculateNodePosition());
      setClickedNode(node);
    } else {
      console.log("Closing node info");
      setNodeCardPosition(calculateNodePosition());
      setClickedNode(null);
    }
  };

  const navigate = useNavigate();

  const handleMoreDetailsClick = () => {
    navigate(`/devices/?${qs.stringify({ selected: clickedNode.mac })}`);
  };

  return (
    <Box>
      <Box onMouseMove={handleMouseMove}>
        <NetworkMap
          handlePositionChange={handleNodePositionChange}
          nodes={nodes}
          style={{ position: "sticky", top: "-150px", height: "60vh" }}
          handleMarkerClick={handleClickedNode}
          id="dashboard-map"
        />
        {clickedNode && (
          <Box
            position="absolute"
            top={`${nodeCardPosition.y}px`}
            left={`${nodeCardPosition.x}px`}
            zIndex={1000}
          >
            <MapNodePopup
              id="node-info-card"
              node={clickedNode}
              handleCloseMarkerClick={handleClickedNode}
              onMoreDetailsClick={handleMoreDetailsClick}
            ></MapNodePopup>
          </Box>
        )}
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
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "10vw",
                height: "10vw",
                mx: "auto",
              }}
            >
              <Gauge
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
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "20vw",
                height: "15vw",
                mx: "auto",
              }}
            >
              <Gauge
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
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "10vw",
                height: "10vw",
                mx: "auto",
              }}
            >
              <Gauge
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
