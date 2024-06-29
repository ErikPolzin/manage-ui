import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./NetworkMap.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

function DraggableMarker({ node, defaultPos, handlePositionChange }) {
  const markerRef = useRef(null);

  const isPositioned = React.useCallback(() => node.lat && node.lon, [node]);
  const position = React.useCallback(
    () => (isPositioned() ? [node.lat, node.lon] : defaultPos),
    [node, defaultPos, isPositioned],
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
    }),
    [],
  );
  return (
    <Marker draggable eventHandlers={eventHandlers} position={position()} ref={markerRef}>
      <Popup>{node.name}</Popup>
    </Marker>
  );
}

const NetworkMap = ({ nodes, handlePositionChange, style }) => {
  const mapRef = useRef(null);
  const [center, setCenter] = React.useState([-33.9221, 18.4231]);
  const [zoom, setZoom] = React.useState(13);

  React.useEffect(() => {
    let validNodes = nodes.filter((n) => n.lat && n.lon);
    let avgLat = validNodes.reduce((s, n) => s + n.lat / validNodes.length, 0);
    let avgLon = validNodes.reduce((s, n) => s + n.lon / validNodes.length, 0);
    // Shift the marker if there's only one other, we don't want overlapping nodes
    if (validNodes.length === 1) avgLon += 0.1 / zoom;
    setCenter([avgLat, avgLon]);
  }, [nodes, zoom]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      ref={mapRef}
      style={{ height: "100%", width: "100%", ...style }}
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
          defaultPos={center}
          handlePositionChange={handlePositionChange}
        />
      ))}
    </MapContainer>
  );
};

export default NetworkMap;
