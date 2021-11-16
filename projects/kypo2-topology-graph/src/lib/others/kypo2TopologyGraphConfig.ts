/**
 * Configuration of the library
 */
import { GuacamoleConfig } from './guacamole-config';

export class Kypo2TopologyGraphConfig {
  /**
   * Configuration of the Apache's Guacamole
   */
  guacamoleConfig: GuacamoleConfig;

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
