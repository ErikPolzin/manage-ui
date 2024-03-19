import logo from './logo.svg';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import {Routes, Route, HashRouter} from "react-router-dom";
import HomePage from "./pages/HomePage";
import theme from "./theme";
import DevicePage from "./pages/DevicePage";
import { useKeycloak } from "@react-keycloak/web";
import LoginPage from "./pages/LoginPage";
import ServicesPage from "./pages/ServicesPage";

function App() {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return <div>Loading...</div>;
    }

    if (!keycloak.authenticated) {
        keycloak.login();
    }
    if (keycloak.authenticated) {
        console.log('Authenticated');

        console.log(keycloak.token);
        // Log the token
    }
  return (
      <ThemeProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/devices" element={<DevicePage/>}/>
              <Route path="/services" element={<ServicesPage/>}/>

          </Routes>
        </HashRouter>
      </ThemeProvider>
  );
}

export default App;