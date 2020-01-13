/**
 * Configuration of the library
 */
export class Kypo2TopologyGraphConfig {

  /**
   * URL of endpoint from where topology should be retrieved
   */
  topologyRestUrl: string;

  /**
   * URL of endpoint from where decorators should be retrieved
   */
  decoratorsRestUrl: string;

  /**
   * Refresh period of decorators
   */
  defaultDecoratorRefreshPeriodInSeconds: number;

  /**
   * True if decorators should be displayed in real time, false otherwise
   */
  useRealTime: boolean;

  /**
   * True if decorators should be user, false otherwise
   */
  useDecorators: boolean;

}
