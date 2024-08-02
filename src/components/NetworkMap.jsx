import React, { useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { MapContainer, TileLayer, Marker, useMap, Polyline } from "react-leaflet";
import Box from "@mui/material/Box";
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

const NetworkMap = ({ nodes, center, handlePositionChange, style, handleMarkerClick, id }) => {
  const mapRef = useRef(null);
  const theme = useTheme();
  const [zoom, setZoom] = React.useState(13);

  /**
   * Generate polyline geometry based on neighbouring nodes
   * @returns 2d array of neighbour connector line lat/lon
   */
  function neighbouringConnections() {
    let latlngs = [];
    let nodeMacs = nodes.map(n => n.mac);
    let seenMacs = new Set();
    for (let node of nodes) {
      for (let n of node.neighbours) {
        // Neighbours may be bi-directional, but we only want to
        // add one line for each direction.
        if (seenMacs.has(n)) continue;
        let nobj = nodes[nodeMacs.indexOf(n)];
        latlngs.push([
          [node.lat, node.lon],
          [nobj.lat, nobj.lon]
        ])
        seenMacs.add(node.mac);
      }
    }
    return latlngs;
  }

  return (
    <Box className={theme.palette.mode}>
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
        <Polyline pathOptions={{color: "red"}} positions={neighbouringConnections()} />
        {nodes.map((node) => (
          <DraggableMarker
            key={node.mac}
            node={node}
            handlePositionChange={handlePositionChange}
            handleMarkerClick={handleMarkerClick}
          />
        ))}
      </MapContainer>
    </Box>
  );
};

export default NetworkMap;
