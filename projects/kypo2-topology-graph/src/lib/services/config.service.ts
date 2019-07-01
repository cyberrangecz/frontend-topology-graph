import {Injectable} from '@angular/core';
import {Kypo2TopologyGraphConfig} from '../others/kypo2TopologyGraphConfig';

@Injectable()
export class ConfigService {

  config: Kypo2TopologyGraphConfig;

  constructor(configurationFile: Kypo2TopologyGraphConfig ) {
    this.config = configurationFile;
  }
}
