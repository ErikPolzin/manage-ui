import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  onLoad: 'login-required',
  url: 'https://keycloak.inethilocal.net',
  realm: 'inethi-global-services',
  clientId: 'manage-ui',
});

export default keycloak;