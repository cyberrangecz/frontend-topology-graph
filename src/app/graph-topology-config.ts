import {KypoTopologyGraphConfig} from '../../projects/kypo-topology-graph/src/public_api';

export const CustomTopologyConfig: KypoTopologyGraphConfig = {
  decoratorsRestUrl: '',
  defaultDecoratorRefreshPeriodInSeconds: 3,
  topologyRestUrl: 'http://localhost:3000/',
  useRealTime: false,
  useDecorators: false,
  guacamoleConfig: {
    url: 'https://147.251.83.5:8443/guacamole/',
    username: 'guacuser',
    password: 'guacuser'
  }
};
