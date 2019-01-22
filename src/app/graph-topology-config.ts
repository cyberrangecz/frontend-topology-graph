import {TopologyConfig} from '../../projects/graph-topology/src/public_api';

export class CustomTopologyConfig extends TopologyConfig {

  decoratorsRestUrl = '';
  defaultDecoratorRefreshPeriodInSeconds = 3;
  topologyRestUrl = 'http://localhost:8082/kypo2-rest-topology/api/v1/';
  scenarioRestUrl = 'http://kypo2.ics.muni.cz:5000/scenario/';
  sandboxName = 'sandbox1';
  useRealTime = false;
  useDecorators = false;
  authorizationToken? = "Bearer eyJqa3UiOiJodHRwczpcL1wvb2lkYy5pY3MubXVuaS5jelwvb2lkY1wvandrIiwia2lkIjoicnNhMSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0NDU3MjBAbXVuaS5jeiIsImF6cCI6IjE4Y2Q2NzY1LWJlMWEtNGRlNC1hNmMwLTZhZGY5Yjk4ODJkMSIsImlzcyI6Imh0dHBzOlwvXC9vaWRjLmljcy5tdW5pLmN6XC9vaWRjXC8iLCJleHAiOjE1NDgxNjgzMTMsImlhdCI6MTU0ODE2NDcxMywianRpIjoiNDZkYTMyOGUtN2VkNy00N2ViLWFhYjMtMGY5MmExOGE1NTdlIn0.SQrId79P3R5Et0vUYRtEeLYuBh8kDy-kUYX_w3YrT25n-XCZ9ja1Ut1OHbvwXRzoCMJ9aje1FXKK7X_hFtWut8T4N2Gdx1rGMJ7HXeE-YeWiafni5pSRdGQdTD6Ud0oTVolVh-q3oCXYwLEfUHgIpnzzcVMpnejQ5VpcTbIPVd4kFiIo4btIk9Qjx9Ia8obWaTbfD38TMidlmzF6uWEIyIWoCUuh0SBldCPfAV6YtrwFudfosD09JSVria4WohBARHcDaPizgnKVqnYS_KCtynUuHFnWmR3SS-f3W6DVdOo3HXXEI6-jPU3QeynEpKBYQ24cyMULYVKiFgRPthUxYQ";
}
