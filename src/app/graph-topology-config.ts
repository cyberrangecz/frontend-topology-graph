import {TopologyConfig} from '../../projects/graph-topology/src/public_api';

export class CustomTopologyConfig extends TopologyConfig {

  decoratorsRestUrl = '';
  defaultDecoratorRefreshPeriodInSeconds = 3;
  topologyRestUrl = 'http://localhost:8085/kypo2-rest-topology/api/v1/sandboxes/';
  scenarioRestUrl = 'http://kypo2.ics.muni.cz:5000/scenario/';
  sandboxName = 'sandbox1';
  useRealTime = false;
  useDecorators = false;
  authorizationToken? = null;
}
