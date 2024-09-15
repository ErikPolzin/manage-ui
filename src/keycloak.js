import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  onLoad: 'login-required',
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT,
});

const refreshTokenIfNeeded = async () => {
  if (keycloak.isTokenExpired()) {
    try {
      const refreshed = await keycloak.updateToken(5);
      if (refreshed) {
          console.log('Token refreshed');
      } else {
          console.debug('Token not refreshed, still valid');
      }
    } catch (error) {
      console.error('Failed to refresh the token, or the session has expired');
      keycloak.login();
    }
  }
};

const fetchAPI = async (url, method="GET", data=null) => {
  await refreshTokenIfNeeded();
  return fetch(`${process.env.REACT_APP_API_URL}${url}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${keycloak.token}`,
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : null
  }).then(async (response) => {
    if (method === "DELETE") return;
    if (!response.ok) {
      let errorBody = await response.json();
      return Promise.reject(errorBody.detail || errorBody || "An unknown error occurred");
    }
    return response.json();
  });
};

export { keycloak, refreshTokenIfNeeded, fetchAPI };