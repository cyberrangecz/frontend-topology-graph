import { Injectable } from '@angular/core';
import { KypoTopologyGraphConfig } from '../others/kypoTopologyGraphConfig';

/**
 * Global service for storing and accessing configuration of the topology
 */
@Injectable()
export class ConfigService {
  config: KypoTopologyGraphConfig;

  constructor(configurationFile: KypoTopologyGraphConfig) {
    this.config = configurationFile;
  }
}
