import {Kypo2TopologyGraphConfig} from '../../projects/kypo2-topology-graph/src/public_api';

export const CustomTopologyConfig: Kypo2TopologyGraphConfig = {
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
