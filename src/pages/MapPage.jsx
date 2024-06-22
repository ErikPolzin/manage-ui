import React from "react";
import NetworkMap from "../components/NetworkMap";
import { fetchAPI } from "../keycloak";

const MapPage = () => {
  const [center, setCenter] = React.useState([-33.9221, 18.4231]);
  const [zoom, changeZoom] = React.useState(13);
  const [nodes, setNodes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchNodes();
  }, []);

  const handleNodePositionChange = (node, lat, lon) => {
    return fetchAPI(`/monitoring/devices/${node.mac}/`, "PATCH", { lat, lon });
  };

  const fetchNodes = async () => {
    setLoading(true);
    fetchAPI("/monitoring/devices/?fields=lat&fields=lon&fields=name&fields=mac")
      .then((data) => {
        setNodes(data);
        let validNodes = data.filter((n) => n.lat && n.lon);
        let avgLat = validNodes.reduce((s, n) => s + n.lat / validNodes.length, 0);
        let avgLon = validNodes.reduce((s, n) => s + n.lon / validNodes.length, 0);
        // Shift the marker if there's only one other, we don't want overlapping nodes
        if (validNodes.length === 1) avgLon += 0.1 / zoom;
        setCenter([avgLat, avgLon]);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <NetworkMap
      center={center}
      zoom={zoom}
      nodes={nodes}
      handlePositionChange={handleNodePositionChange}
    />
  );
};

export default MapPage;
