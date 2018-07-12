import {Inject, Injectable, InjectionToken} from '@angular/core';
import {TopologyConfig} from '../others/topology.config';

@Injectable()
export class ConfigService {

  conf: TopologyConfig;

  constructor(@Inject(new InjectionToken<string>('config')) private config: TopologyConfig ) {
    this.conf = config;
  }
}
