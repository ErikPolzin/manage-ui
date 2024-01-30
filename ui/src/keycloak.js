import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  onLoad: 'login-required',
  url: 'https://keycloak.inethilocal.net/auth',
  realm: 'master',
  clientId: 'manage',
});

export default keycloak;