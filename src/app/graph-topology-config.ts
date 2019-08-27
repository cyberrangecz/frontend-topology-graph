import {Kypo2TopologyGraphConfig} from '../../projects/kypo2-topology-graph/src/public_api';

export const CustomTopologyConfig: Kypo2TopologyGraphConfig = {
  decoratorsRestUrl: '',
  defaultDecoratorRefreshPeriodInSeconds: 3,
  topologyRestUrl: 'http://localhost:3000/',
  sandboxRestUrl: 'http://localhost:3001/',
  useRealTime: false,
  useDecorators: false
};
