import {TopologyConfig} from '../../projects/graph-topology/src/public_api';

export class CustomTopologyConfig extends TopologyConfig {

  decoratorsRestUrl = '';
  defaultDecoratorRefreshPeriodInSeconds = 3;
  topologyRestUrl = '/assets/sample-data/graph-test-data.json';
  sandboxRestUrl = 'http://kypo2.ics.muni.cz:5000/scenario/sandbox';
  useRealTime = false;
  useDecorators = false;
}
