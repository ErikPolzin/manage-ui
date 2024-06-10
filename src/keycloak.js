import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  onLoad: 'login-required',
  url: 'http://localhost:8080/',
  realm: 'inethi-global-services',
  clientId: 'manage-ui',
});

const refreshTokenIfNeeded = async () => {
  if (keycloak.isTokenExpired()) {
    try {
      const refreshed = await keycloak.updateToken(5);
      if (refreshed) {
          console.log('Token refreshed');
      } else {
          console.log('Token not refreshed, still valid');
      }
    } catch (error) {
      console.error('Failed to refresh the token, or the session has expired');
      keycloak.login()
    }
  }
  else {
    console.log('Token not expired');
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
    body: JSON.stringify(data) ? data : null
  }).then(async (response) => {
    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.detail || "An unknown error occurred");
    }
    return response.json();
  });
};

export { keycloak, refreshTokenIfNeeded, fetchAPI };