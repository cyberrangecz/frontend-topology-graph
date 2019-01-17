import { Injectable } from '@angular/core';
import { Link } from 'graph-topology-model-lib';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Node} from 'graph-topology-model-lib';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ConfigService} from './config.service';
import {TopologySerializer} from './topology-serializer.service';
import {TopologyDTO} from '../model/DTO/topology-dto.model';

/**
 * Service for getting JSON data about topology of network and parsing them to model suitable for visualization
 * Creates hierarchical model inside nodes elements but returns it as flat array because hierarchical graph-visual are not supported
 * by D3 and it would cause problems. This way we can remain hierarchical structure inside model and
 * implement functions needed for visualization  in our own way.
 */

@Injectable()
export class TopologyFacade {

  constructor(private http: HttpClient,
              private topologySerializer: TopologySerializer,
              private configService: ConfigService) {
  }

  /**
   * Sends HTTP request and parses data for topology model
   * @returns {Observable<{nodes: Node[], links: Link[]}>} Observable of topology model
   * Caller needs to subscribe for it.
   */
  getTopology(): Observable<{nodes: Node[], links: Link[]}> {
    return this.http.get<TopologyDTO>(this.configService.config.topologyRestUrl, { headers: this.createAuthorizationHeader() })
      .pipe(map(response => this.topologySerializer.serializeTopology(response)
      ));
   }

   private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', this.configService.config.authorizationToken);
  }
}
