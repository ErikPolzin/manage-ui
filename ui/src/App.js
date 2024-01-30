import logo from './logo.svg';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import {Routes, Route, HashRouter} from "react-router-dom";
import HomePage from "./pages/HomePage";
import theme from "./theme";
import DevicePage from "./pages/DevicePage";
import { useKeycloak } from "@react-keycloak/web";
import LoginPage from "./pages/LoginPage";

function App() {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return <div>Loading...</div>;
    }

    if (!keycloak.authenticated) {
        keycloak.login();
    }
  return (
      <ThemeProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/devices" element={<DevicePage/>}/>

          </Routes>
        </HashRouter>
      </ThemeProvider>
  );
}

export default App;