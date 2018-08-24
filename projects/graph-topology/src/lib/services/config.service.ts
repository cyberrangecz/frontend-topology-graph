import {Injectable} from '@angular/core';
import {TopologyConfig} from '../others/topology.config';

@Injectable()
export class ConfigService {

  config: TopologyConfig;

  constructor(configurationFile: TopologyConfig ) {
    this.config = configurationFile;
  }
}
