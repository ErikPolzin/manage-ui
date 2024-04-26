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

export { keycloak, refreshTokenIfNeeded };