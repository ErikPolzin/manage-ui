import React from "react";
import { fetchAPI } from "../keycloak";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import NetworkMap from "../components/NetworkMap";
import MapNodePopup from "../components/MapNodePopup";
import OverviewMetric from "../components/OverviewMetric";
import { MeshContext } from "../App";
import { useNavigate } from "react-router-dom";
import qs from "qs";

const HomePage = () => {
  const [nodes, setNodes] = React.useState([]);
  const [center, setCenter] = React.useState([0, 0]);
  const [loading, setLoading] = React.useState(0);
  const [nNodes, setNNodes] = React.useState(0);
  const [nPositionedNodes, setNPositionedNodes] = React.useState(0);
  const [nUnknownNodes, setNUnknownNodes] = React.useState(0);
  const [nOkNodes, setNOkNodes] = React.useState(0);
  const [nOnlineNodes, setNOnlineNodes] = React.useState(0);
  const [clickedNode, setClickedNode] = React.useState(null);
  const [nodeCardPosition, setNodeCardPosition] = React.useState({ x: null, y: null });
  //const [mousePosition, setMousePosition] = React.useState({ x: null, y: null });
  const [nodeInfoCardHeight, setNodeInfoCardHeight] = React.useState({ height: 200, set: false });
  const { mesh } = React.useContext(MeshContext);

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
        setNOnlineNodes(data.n_online_nodes);
      })
      .catch((error) => {
        console.log("Error fetching overview: " + error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const overviewOffset = () => {
    let overviewElement = document.getElementById("overview-stack");
    let navbarHeight = 64;
    let mapHeight = document.documentElement.clientHeight * 0.7;
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
    const fields = ["lat", "lon", "mac", "is_ap", "status", "neighbours"];
    fetchAPI(`/monitoring/devices/?${qs.stringify({ fields })}`)
      .then((data) => {
        setNodes(data);
        // We want to center the screen at the average position of the nodes.
        // If none of the nodes have positions, we center at the average mesh position, or 0.
        let avgMeshLat = data.reduce((s, n) => s + (mesh?.lat || 0) / data.length, 0);
        let avgMeshLon = data.reduce((s, n) => s + (mesh?.lon || 0) / data.length, 0);
        let validNodes = data.filter((n) => n.lat && n.lon);
        let avgLat = validNodes.reduce((s, n) => s + n.lat / validNodes.length, 0);
        let avgLon = validNodes.reduce((s, n) => s + n.lon / validNodes.length, 0);
        setCenter([avgLat !== 0 ? avgLat : avgMeshLat, avgLon !== 0 ? avgLon : avgMeshLon]);
      })
      .catch((error) => {
        console.log("Error fetching device locations: " + error);
      });
  };
  const handleNodePositionChange = (node, lat, lon) => {
    node.lat = lat;
    node.lon = lon;
    return fetchAPI(`/monitoring/devices/${node.mac}/`, "PATCH", { lat, lon })
      .then(() => {
        fetchOverview(); // refresh the overview stats, may have changed
      })
      .catch((error) => {
        console.log("Error updating device position: " + error);
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
          center={center}
          style={{ position: "sticky", top: "-150px", height: "70vh" }}
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
          <OverviewMetric
            value={nPositionedNodes}
            total={nNodes}
            title="Geopositioned Nodes"
            sx={{ zIndex: 1000 }}
          />
          <OverviewMetric value={nOkNodes} total={nNodes} title="OK Nodes" sx={{ zIndex: 1000 }} />
          <OverviewMetric
            value={nOnlineNodes}
            total={nNodes}
            title="Online Nodes"
            sx={{ zIndex: 1000 }}
          />
          <OverviewMetric
            value={nNodes}
            total={nNodes + nUnknownNodes}
            title="Registered Nodes"
            sx={{ zIndex: 1000 }}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default HomePage;
