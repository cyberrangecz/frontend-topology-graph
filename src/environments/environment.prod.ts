const BASE_URL = 'https://172.19.0.22';
const HOME_URL = 'https://localhost:4200';

export const environment = {
  production: true,
  silentRefreshRedirectUri: HOME_URL,
  sessionChecksEnabled: false,
  authConfig: {
    guardMainPageRedirect: 'visualizations',
    guardLoginPageRedirect: 'login',
    interceptorAllowedUrls: [BASE_URL,'https://localhost'],
    authorizationStrategyConfig: {
      authorizationUrl: BASE_URL + '/kypo-rest-user-and-group/api/v1/users/info',
    },
    providers: [
      {
        label: 'Login with local issuer',
        textColor: 'white',
        backgroundColor: '#002776',
        oidcConfig: {
          requireHttps: true,
          issuer: BASE_URL + '/keycloak/realms/KYPO',
          clientId: 'KYPO-client',
          redirectUri: HOME_URL,
          scope: 'openid email profile offline_access',
          logoutUrl: BASE_URL + '/keycloak/realms/KYPO/protocol/openid-connect/logout',
          silentRefreshRedirectUri: BASE_URL + '/silent-refresh.html',
          postLogoutRedirectUri: HOME_URL + '/logout-confirmed',
          clearHashAfterLogin: true
        },
      },
    ],
  },
};
