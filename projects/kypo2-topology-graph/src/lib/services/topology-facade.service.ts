import { Injectable } from '@angular/core';
import { Link } from 'kypo2-topology-graph-model';
import {HttpClient} from '@angular/common/http';
import {Node} from 'kypo2-topology-graph-model';
import {Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {ConfigService} from './config.service';
import {TopologyMapper} from './topology-mapper.service';
import {TopologyDTO} from '../model/DTO/topology-dto.model';
import {Kypo2TopologyLoadingService} from './kypo2-topology-loading.service';
import {Kypo2TopologyErrorService} from './kypo2-topology-error.service';
import {ConsoleDTO} from '../model/DTO/console-dto.model';

/**
 * Service for getting JSON data about topology of network and parsing them to model suitable for visualization
 * Creates hierarchical model inside nodes elements but returns it as flat array because hierarchical graph-visual are not supported
 * by D3 and it would cause problems. This way we can remain hierarchical structure inside model and
 * implement functions needed for visualization  in our own way.
 */

@Injectable()
export class TopologyFacade {

  constructor(private http: HttpClient,
              private topologySerializer: TopologyMapper,
              private loadingService: Kypo2TopologyLoadingService,
              private errorService: Kypo2TopologyErrorService,
              private configService: ConfigService) {
  }

  /**
   * Sends HTTP request and parses data for topology model
   * @returns {Observable<{nodes: Node[], links: Link[]}>} Observable of topology model
   * Caller needs to subscribe for it.
   */
  getTopology(sandboxId: number): Observable<{nodes: Node[], links: Link[]}> {
    this.loadingService.setIsLoading(true);
    return this.http.get<TopologyDTO>(this.configService.config.topologyRestUrl + 'sandboxes/' + sandboxId + '/topologies')
      .pipe(
        map(response => this.topologySerializer.mapTopologyFromDTO(response)),
        tap(
          _ => this.loadingService.setIsLoading(false),
            err => {
            this.errorService.emitError(err);
            this.loadingService.setIsLoading(false)
            }
        ),
      );
   }

   getVMConsole(sandboxId: number, vmName: string): Observable<string> {
     this.loadingService.setIsLoading(true);
     return this.http.get<ConsoleDTO>(`${this.configService.config.sandboxRestUrl}sandboxes/${sandboxId}/vms/${vmName}/console`)
      .pipe(
        map(resp => resp.url),
        tap(
          _ => this.loadingService.setIsLoading(false),
          err =>  {
            this.errorService.emitError(err);
            this.loadingService.setIsLoading(false);
          }
        ),
      );
   }

   performVMAction(sandboxId: number, vmName: string, action: string): Observable<any> {
     return this.http.patch(`${this.configService.config.sandboxRestUrl}sandboxes/${sandboxId}/vms/${vmName}`,
       { action: action});
   }
}
