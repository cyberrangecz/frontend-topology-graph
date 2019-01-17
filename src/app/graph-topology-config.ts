import {TopologyConfig} from '../../projects/graph-topology/src/public_api';

export class CustomTopologyConfig extends TopologyConfig {

  decoratorsRestUrl = '';
  defaultDecoratorRefreshPeriodInSeconds = 3;
  topologyRestUrl = '/assets/sample-data/graph-test-data.json';
  authorizationToken = 'Bearer eyJqa3UiOiJodHRwczpcL1wvb2lkYy5pY3MubXVuaS5jelwvb2lkY1wvandrIiwia2lkIjoicnNhMSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0NDU3MjBAbXVuaS5jeiIsImF6cCI6IjE4Y2Q2NzY1LWJlMWEtNGRlNC1hNmMwLTZhZGY5Yjk4ODJkMSIsImlzcyI6Imh0dHBzOlwvXC9vaWRjLmljcy5tdW5pLmN6XC9vaWRjXC8iLCJleHAiOjE1NDc1NjcyOTIsImlhdCI6MTU0NzU2MzY5MiwianRpIjoiYjM0NjJkZDMtNTQ1ZS00NDg4LWIzNmMtYzVmNTE1NDFjNzUzIn0.bTaoIRn_yeCJb9u8zmRJJGCtemtUVuvINqoexh2ybgh0OrKbFMVFZ_ITb_GGLyoj7HL2MLA_sbRCbkaT7TSYU1Io9mZPqYhZwXxcT5hIRE5AI-rBl148idrWeGSMCFp3aXlATPnI59haEzHg7cAYpTCeL-QNc8aClDX_C5LAEvFWUleQo_xqtR78wJZVOboJyyKrNEwDQodPOoKIuZn-7pJC6KtRvxEjkFjJ-sxeLJYzCCsqs0bQOmttszFTwJ8AZjPliUUbtLH2sgs71WEukBHA-9PvqoboS2zr3nAJbQ3NXasn0Bz8iDel86G--cmt5LjoQF3p0wwZ0UAsCyfmmA';
  scenarioRestUrl = 'http://kypo2.ics.muni.cz:5000/scenario/';
  sandboxName = 'sandbox1';
  useRealTime = false;
  useDecorators = false;
}
