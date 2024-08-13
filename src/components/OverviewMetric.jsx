import React from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";


export default function OverviewMetric({ value, total, title, ...props }) {
  return (
    <Card {...props}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "10vw",
          height: "10vw",
          mx: "auto",
        }}
      >
        <Gauge
          value={(value / total) * 100}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 20,
              transform: "translate(0px, 0px)",
            },
          }}
          cornerRadius="30%"
          text={() => `${value} / ${total}`}
        />
      </CardContent>
      <Divider></Divider>
      <CardHeader subheader={title} sx={{ textAlign: "center" }} />
    </Card>
  );
}
