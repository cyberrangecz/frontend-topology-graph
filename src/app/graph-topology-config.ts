import {TopologyConfig} from '../../projects/graph-topology/src/public_api';

export class CustomTopologyConfig extends TopologyConfig {

  decoratorsRestUrl = '';
  defaultDecoratorRefreshPeriodInSeconds = 3;
  //topologyRestUrl = '/assets/sample-data/graph-test-data.json';
  scenarioRestUrl = 'http://kypo2.ics.muni.cz:5000/scenario/';
  sandboxName = 'sandbox1';
  topologyRestUrl = 'http://localhost:8080/kypo2-rest-sandbox/api/v1/' + this.sandboxName + '/topology';
  useRealTime = false;
  useDecorators = false;
}
