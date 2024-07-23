import React from "react";
import Box from "@mui/material/Box";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import LocationPicker from "../LocationPicker";
import "leaflet/dist/leaflet.css";

function ChangeView({ center }) {
  useMap().setView(center);
  return null;
}

function PositionMeshStep({ mesh, handleChange }) {
  const [center, setCenter] = React.useState([-33.9221, 18.4231]);

  const onSelectLocation = (loc) => {
    let lat = loc.lat();
    let lon = loc.lng();
    handleChange({
      target: {
        name: "lat",
        value: lat,
      },
    });
    handleChange({
      target: {
        name: "lon",
        value: lon,
      },
    });
    setCenter([lat, lon]);
  };

  return (
    <Box>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "300px", width: "100%" }}
      >
        <ChangeView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
      <LocationPicker sx={{ py: 1 }} fullWidth handleChange={onSelectLocation} />
    </Box>
  );
}

export default PositionMeshStep;
