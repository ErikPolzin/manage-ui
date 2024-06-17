import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { keycloak } from "./keycloak";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: "check-sso",
      checkLoginIframe: false,
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReactKeycloakProvider>,
);

reportWebVitals();
