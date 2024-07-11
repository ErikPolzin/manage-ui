import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
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
      dataRecv: "#7025c7",
      dataSent: "#17a1b1",
    }
  },
});

export default theme;
