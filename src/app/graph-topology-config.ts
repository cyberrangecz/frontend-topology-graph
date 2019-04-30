import {TopologyConfig} from '../../projects/graph-topology/src/public_api';

export const CustomTopologyConfig: TopologyConfig = {
  decoratorsRestUrl: '',
  defaultDecoratorRefreshPeriodInSeconds: 3,
  topologyRestUrl: 'http://localhost:3000/sandboxes/',
  useRealTime: false,
  useDecorators: false
};
