import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { fetchAPI } from "../keycloak";
import { Divider } from "@mui/material";
import ResourcesGraph from "./graphs/ResourcesGraph";
import RetriesGraph from "./graphs/RetriesGraph";

function DeviceDetailCard({ deviceMac, ...props }) {
  const [deviceDetails, setDeviceDetails] = useState(null);
  const [error, setError] = useState(null);

  const fetchDetails = React.useCallback(() => {
    if (!deviceMac) return;
    fetchAPI(`/monitoring/devices/${deviceMac}/`)
      .then((data) => {
        setDeviceDetails(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [deviceMac]);

  

  useEffect(() => {
    setError(null);
    fetchDetails();
  }, [deviceMac, fetchDetails]);

  return (
    <Card {...props}>
      <CardHeader title={'Device: '+(deviceDetails?.name || deviceMac)} />
      <Divider></Divider>
      <CardContent>
        <RetriesGraph deviceMac={deviceMac} />
        <ResourcesGraph deviceMac={deviceMac} />
      </CardContent>
    </Card>
  );
}

export default DeviceDetailCard;
