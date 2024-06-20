import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { fetchAPI } from "../keycloak";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function DraggableMarker({ node, defaultPos }) {
  const [position, setPosition] = React.useState({
    lat: node.lat || defaultPos.lat,
    lon: node.lon || defaultPos.lon,
  });
  const markerRef = useRef(null);
  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          let pos = marker.getLatLng();
          setPosition(pos);
          fetchAPI(`/monitoring/devices/${node.mac}/`, "PATCH", { lat: pos.lat, lon: pos.lng });
        }
      },
    }),
    [],
  );
  return (
    <Marker draggable eventHandlers={eventHandlers} position={position} ref={markerRef}>
      <Popup>{node.name}</Popup>
    </Marker>
  );
}

const NetworkMap = ({ latitude, longitude }) => {
  const mapRef = useRef(null);
  const [center, setCenter] = React.useState([latitude, longitude]);
  const [zoom, changeZoom] = React.useState(13);
  const [nodes, setNodes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    setLoading(true);
    fetchAPI("/monitoring/devices/?fields=lat&fields=lon&fields=name&fields=mac")
      .then((data) => {
        setNodes(data);
        let validNodes = data.filter(n => n.lat && n.lon);
        let avgLat = validNodes.reduce((s, n) => s + n.lat / validNodes.length, 0);
        let avgLon = validNodes.reduce((s, n) => s + n.lon / validNodes.length, 0);
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
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      ref={mapRef}
      style={{ height: "100%", width: "100%" }}
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {nodes.map((node) => (
        <DraggableMarker key={node.id} node={node} defaultPos={{lat: latitude, lon: longitude}} />
      ))}
    </MapContainer>
  );
};

export default NetworkMap;
