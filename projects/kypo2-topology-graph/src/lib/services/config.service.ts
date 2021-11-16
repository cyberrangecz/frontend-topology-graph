import { Injectable } from '@angular/core';
import { Kypo2TopologyGraphConfig } from '../others/kypo2TopologyGraphConfig';

/**
 * Global service for storing and accessing configuration of the topology
 */
@Injectable()
export class ConfigService {
  config: Kypo2TopologyGraphConfig;

  constructor(configurationFile: Kypo2TopologyGraphConfig) {
    this.config = configurationFile;
  }
}
