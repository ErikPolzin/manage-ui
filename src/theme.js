import { createTheme } from "@mui/material/styles";

export default function makeTheme(mode) {
  console.log("Setting theme to", mode, "mode");
  return createTheme({
    palette: {
      mode: mode || "light",
      primary: {
        light: "#6573c3",
        main: "#3f51b5",
        dark: "#2c387e",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff4569",
        main: "#ff1744",
        dark: "#b2102f",
        contrastText: "#fff",
      },
      graphs: {
        dataRecv: "#02d5d1",
        dataSent: "#37b3ff",
        sessionTime: "#1f8127",
      },
    },
  });
}