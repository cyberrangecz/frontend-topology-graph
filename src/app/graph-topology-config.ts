import { TopologyGraphConfig } from '../../projects/topology-graph/src/public_api';

export const CustomTopologyConfig: TopologyGraphConfig = {
    decoratorsRestUrl: '',
    defaultDecoratorRefreshPeriodInSeconds: 3,
    topologyRestUrl: 'http://localhost:3000/',
    useRealTime: false,
    useDecorators: false,
    pollingPeriod: 5000,
    retryAttempts: 3,
    guacamoleConfig: {
        url: 'https://147.251.83.5:8443/guacamole/',
        username: 'guacuser',
        password: 'guacuser'
    }
};
