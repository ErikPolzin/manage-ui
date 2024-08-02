import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./NetworkMap.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import apIconUrl from "../images/ap.png";
import meshIconUrl from "../images/meshnode.png";

// Map Icons
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;
const createNodeIcon = (type, isOnline) => {
  return (
    new L.Icon({
      iconUrl: type === "AP" ? apIconUrl : meshIconUrl,
      iconSize: [41, 41],
      className: isOnline ? `${type.toLowerCase()}-online` : `${type.toLowerCase()}-offline`,
    }) || DefaultIcon
  );
};

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

function DraggableMarker({ node, handlePositionChange, handleMarkerClick }) {
  const markerRef = useRef(null);

  const isPositioned = React.useCallback(() => node.lat && node.lon, [node]);
  const position = React.useCallback(
    () => [node.lat || node.mesh_lat, node.lon || node.mesh_lon],
    [node.lat, node.lon, node.mesh_lat, node.mesh_lon],
  );
  const updateMarkerClass = React.useCallback(() => {
    const marker = markerRef.current;
    if (marker != null) {
      marker._icon.classList.remove("dirty");
      if (isPositioned()) {
        marker._icon.classList.remove("unpositioned");
        marker._icon.classList.add("positioned");
      } else {
        marker._icon.classList.remove("positioned");
        marker._icon.classList.add("unpositioned");
      }
    }
  }, [isPositioned]);

  React.useEffect(() => {
    updateMarkerClass();
  }, [updateMarkerClass]);

  const eventHandlers = React.useMemo(
    () => ({
      dragstart() {
        const marker = markerRef.current;
        if (marker != null) {
          marker._icon.classList.remove("unpositioned");
          marker._icon.classList.remove("positioned");
          marker._icon.classList.add("dirty");
        }
      },
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          let pos = marker.getLatLng();
          handlePositionChange(node, pos.lat, pos.lng);
        }
      },
      click() {
        handleMarkerClick(node);
      },
    }),
    [node, handlePositionChange, handleMarkerClick],
  );

  const icon = createNodeIcon(node.is_ap ? "AP" : "Node", node.status === "online");

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position()}
      ref={markerRef}
      icon={icon}
    ></Marker>
  );
}

const NetworkMap = ({ nodes, handlePositionChange, style, handleMarkerClick, id }) => {
  const mapRef = useRef(null);
  const [center, setCenter] = React.useState([0, 0]);
  const [zoom, setZoom] = React.useState(13);

  React.useEffect(() => {
    // We want to center the screen at the average position of the nodes.
    // If none of the nodes have positions, we center at the average mesh position, or 0.
    let avgMeshLat = nodes.reduce((s, n) => s + n.mesh_lat / nodes.length, 0);
    let avgMeshLon = nodes.reduce((s, n) => s + n.mesh_lon / nodes.length, 0);
    let validNodes = nodes.filter((n) => n.lat && n.lon);
    let avgLat = validNodes.reduce((s, n) => s + n.lat / validNodes.length, 0);
    let avgLon = validNodes.reduce((s, n) => s + n.lon / validNodes.length, 0);
    setCenter([avgLat !== 0 ? avgLat : avgMeshLat, avgLon !== 0 ? avgLon : avgMeshLon]);
  }, [nodes, zoom]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      ref={mapRef}
      style={{ height: "100%", width: "100%", ...style }}
      id={id}
    >
      <ChangeView center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {nodes.map((node) => (
        <DraggableMarker
          key={node.mac}
          node={node}
          handlePositionChange={handlePositionChange}
          handleMarkerClick={handleMarkerClick}
        />
      ))}
    </MapContainer>
  );
};

export default NetworkMap;
