import {TopologyConfig} from '../../projects/graph-topology/src/public_api';

export class CustomTopologyConfig extends TopologyConfig {

  decoratorsRestUrl = '';
  defaultDecoratorRefreshPeriodInSeconds = 3;
  topologyRestUrl = '/assets/sample-data/graph-test-data.json';
  useRealTime = false;
  useDecorators = false;
}
