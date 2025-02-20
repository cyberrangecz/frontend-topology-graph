// OIDC url
const OIDC_URL = 'https://172.19.0.22';
// backend url
const API_URL = 'https://172.19.0.22';
// frontend home url
const HOME_URL = 'https://localhost:4200';

export const environment = {
    production: true,
    topologyConfig: {
        decoratorsRestUrl: '',
        defaultDecoratorRefreshPeriodInSeconds: 3,
        topologyRestUrl: API_URL,
        useRealTime: false,
        useDecorators: false,
        pollingPeriod: 5000,
        retryAttempts: 3,
        guacamoleConfig: {
            url: API_URL + '/guacamole/',
            username: 'guacuser',
            password: 'guacuser'
        }
    },
    authConfig: {
        guardMainPageRedirect: 'visualizations',
        guardLoginPageRedirect: 'login',
        interceptorAllowedUrls: [API_URL, OIDC_URL],
        authorizationStrategyConfig: {
            authorizationUrl: API_URL + '/user-and-group/api/v1/users/info'
        },
        providers: [
            {
                label: 'Login with local Keycloak',
                textColor: 'white',
                backgroundColor: '#1e2173',
                oidcConfig: {
                    requireHttps: true,
                    clearHashAfterLogin: true,
                    issuer: OIDC_URL + '/keycloak/realms/CRCZP',
                    clientId: 'CRCZP-client',
                    redirectUri: HOME_URL,
                    scope: 'openid email profile offline_access',
                    logoutUrl: OIDC_URL + '/keycloak/realms/CRCZP/protocol/openid-connect/logout',
                    silentRefreshRedirectUri: HOME_URL + '/silent-refresh.html',
                    postLogoutRedirectUri: HOME_URL + '/logout-confirmed'
                }
            }
        ]
    }
};
