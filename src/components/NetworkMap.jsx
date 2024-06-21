import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
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

function DraggableMarker({ node, defaultPos, handlePositionChange }) {
  const [position, setPosition] = React.useState([
    node.lat || defaultPos[0],
    node.lon || defaultPos[1],
  ]);
  const markerRef = useRef(null);
  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          let pos = marker.getLatLng();
          setPosition(pos);
          handlePositionChange(node, pos.lat, pos.lng);
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

const NetworkMap = ({ center, zoom, nodes, handlePositionChange }) => {
  const mapRef = useRef(null);

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
        <DraggableMarker
          key={node.id}
          node={node}
          defaultPos={center}
          handlePositionChange={handlePositionChange}
        />
      ))}
    </MapContainer>
  );
};

export default NetworkMap;
