import React, { useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { MapContainer, TileLayer, Marker, useMap, Polyline } from "react-leaflet";
import Box from "@mui/material/Box";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./NetworkMap.css";
import { MeshContext } from "../context";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import apOnlineIconUrl from "../images/ap_online.png";
import apOfflineIconUrl from "../images/ap_offline.png";
import nodeOnlineIconUrl from "../images/node_online.png";
import nodeOfflineIconUrl from "../images/node_offline.png";

// Map Icons
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
// Set the default icon
L.Marker.prototype.options.icon = DefaultIcon;
const MARKER_URLS = {
  AP: {
    online: apOnlineIconUrl,
    offline: apOfflineIconUrl,
    unknown: apOfflineIconUrl,
  },
  Node: {
    online: nodeOnlineIconUrl,
    offline: nodeOfflineIconUrl,
    unknown: nodeOfflineIconUrl,
  },
};

const createNodeIcon = (type, status) => {
  return (
    new L.Icon({
      iconUrl: MARKER_URLS[type][status || "offline"],
      iconSize: [41, 41],
      className: `${type.toLowerCase()}-${status}`,
    }) || DefaultIcon
  );
};
let lastSetCenter = null;

function ChangeView({ center }) {
  const map = useMap();
  // This is a bit hacky, but we only want to force a pan if the center has actually
  // changed - otherwise the viewer is unexpectedly panned back to the center
  // when react refreshed the component with the old props (such as just after dragging a node)
  if (!lastSetCenter || (center[0] !== lastSetCenter[0] && center[1] !== lastSetCenter[1])) {
    map.setView(center);
    lastSetCenter = center;
  }
  return null;
}

function DraggableMarker({ node, handlePositionChange, handleMarkerClick }) {
  const markerRef = useRef(null);
  const { mesh } = React.useContext(MeshContext);

  const isPositioned = React.useCallback(() => node.lat && node.lon, [node]);
  const position = React.useCallback(
    () => [node.lat || mesh?.lat || 0, node.lon || mesh?.lon || 0],
    [node.lat, node.lon, mesh],
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

  const icon = createNodeIcon(node.is_ap ? "AP" : "Node", node.status);

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
  const { mesh } = React.useContext(MeshContext);
  const [zoom, setZoom] = React.useState(13);

  /**
   * Generate polyline geometry based on neighbouring nodes
   * @returns 2d array of neighbour connector line lat/lon
   */
  function neighbouringConnections() {
    let latlngs = [];
    let nodeMacs = nodes.map((n) => n.mac);
    let seenMacs = new Set();
    for (let node of nodes) {
      for (let n of node.neighbours) {
        // Neighbours may be bi-directional, but we only want to
        // add one line for each direction.
        if (seenMacs.has(n)) continue;
        let nobj = nodes[nodeMacs.indexOf(n)];
        latlngs.push([
          [node.lat || mesh?.lat, node.lon || mesh?.lon],
          [nobj.lat || mesh?.lat, nobj.lon || mesh?.lon],
        ]);
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
        <Polyline pathOptions={{ color: "#1d7cdb" }} positions={neighbouringConnections()} />
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
