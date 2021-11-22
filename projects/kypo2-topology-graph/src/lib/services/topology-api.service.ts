import { Injectable } from '@angular/core';
import { Link, Node } from '@muni-kypo-crp/topology-model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, zip } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { TopologyMapper } from './topology-mapper.service';
import { TopologyDTO } from '../model/DTO/topology-dto.model';
import { Kypo2TopologyLoadingService } from './kypo2-topology-loading.service';
import { Kypo2TopologyErrorService } from './kypo2-topology-error.service';
import { ConsoleDTO } from '../model/DTO/console-dto.model';
import { TopologyError } from '../model/others/topology-error.model';
import { GuacamoleTokenDTO } from '../model/DTO/guacamole-token-dto.model';
import { GuacamoleIdentifierDTO } from '../model/DTO/guacamole-identifier-dto.model';
import { UserInterface } from '../model/enums/user-interface-enum';
import { HostDTO } from '../model/DTO/host-dto.model';
import { ManDTO } from '../model/DTO/man-dto.model';
import { ConsoleUrlMapper } from '../mappers/console-url-mapper';
import { ConsoleUrl } from '../model/others/console-url';

/**
 * Service for getting JSON data about topology of network and parsing them to model suitable for visualization
 * Creates hierarchical model inside nodes elements but returns it as flat array because hierarchical graph-visual are not supported
 * by D3 and it would cause problems. This way we can remain hierarchical structure inside model and
 * implement functions needed for visualization  in our own way.
 */

@Injectable()
export class TopologyApi {
  private readonly GUAC_AUTH = 'GUAC_AUTH';

  constructor(
    private http: HttpClient,
    private topologySerializer: TopologyMapper,
    private loadingService: Kypo2TopologyLoadingService,
    private errorService: Kypo2TopologyErrorService,
    private configService: ConfigService
  ) {}

  /**
   * Sends HTTP request and parses data for topology model
   * @returns {Observable<{nodes: Node[], links: Link[]}>} Observable of topology model
   * Caller needs to subscribe for it.
   */
  getTopology(sandboxId: number): Observable<{ nodes: Node[]; links: Link[] }> {
    this.loadingService.setIsLoading(true);
    return this.http
      .get<TopologyDTO>(`${this.configService.config.topologyRestUrl}sandboxes/${sandboxId}/topology`)
      .pipe(
        map((response) => this.topologySerializer.mapTopologyFromDTO(response)),
        tap(
          (_) => this.loadingService.setIsLoading(false),
          (err) => {
            const errorMessage = new TopologyError(err, 'Loading topology');
            this.errorService.emitError(errorMessage);
            this.loadingService.setIsLoading(false);
          }
        )
      );
  }

  /**
   * Sends http request to get url of virtual machine console (terminal) for remote access
   * @param sandboxId id of sandbox in which the vm exists
   * @param vmName name of the vm to remotely access
   */
  getVMConsoleUrl(sandboxId: number, vmName: string): Observable<string> {
    return this.http
      .get<ConsoleDTO>(`${this.configService.config.topologyRestUrl}sandboxes/${sandboxId}/vms/${vmName}/console`)
      .pipe(
        map((resp) => resp.url),
        tap({
          error: (err) => {
            const errorMessage = new TopologyError(err, 'Loading VM console');
            this.errorService.emitError(errorMessage);
          },
        })
      );
  }

  /**
   * Retrieves urls for spice consoles for all hosts and routers in a topology.
   * @param sandboxId id of sandbox in which hosts and routers exist
   */
  getVMConsolesUrl(sandboxId: number): Observable<ConsoleUrl[]> {
    return this.http.get(`${this.configService.config.topologyRestUrl}sandboxes/${sandboxId}/consoles`).pipe(
      map((resp) => ConsoleUrlMapper.fromJSON(resp)),
      tap({
        error: (err) => this.errorService.emitError(new TopologyError(err, 'Loading URLs for VM consoles')),
      })
    );
  }

  /**
   * Sends http request to authenticate user in guacamole and create Guacamole quick connection to the remote host
   * @param sandboxId id of sandbox in which the vm exists
   * @param vmIp ip address of the vm to remotely access
   * @param vmOsType vm's OS type of the host node
   * @param userInterface type of the user interface which should be used to open remote connection
   */
  establishGuacamoleRemoteConnection(
    sandboxId: number,
    vmIp: string,
    vmOsType: string,
    userInterface: UserInterface
  ): Observable<string> {
    return zip(this.getGuacamoleToken(), this.getManIp(sandboxId)).pipe(
      switchMap((resp) => {
        if (window.localStorage.getItem(this.GUAC_AUTH) !== null) {
          window.localStorage.removeItem(this.GUAC_AUTH);
        }
        window.localStorage.setItem(this.GUAC_AUTH, JSON.stringify(resp[0]));
        return this.createGuacamoleQuickConnection(resp[0].authToken, vmIp, vmOsType, resp[1].ip, userInterface);
      }),
      tap({
        error: (err) => {
          const errorMessage = new TopologyError(err, "Authenticate Apache's Guacamole user.");
          this.errorService.emitError(errorMessage);
        },
      })
    );
  }

  private getGuacamoleToken() {
    const body = new URLSearchParams();
    body.set('username', this.configService.config.guacamoleConfig.username);
    body.set('password', this.configService.config.guacamoleConfig.password);
    return this.http.post<GuacamoleTokenDTO>(
      `${this.configService.config.guacamoleConfig.url}api/tokens`,
      body.toString(),
      {
        headers: new HttpHeaders({ 'Content-Type': ' application/x-www-form-urlencoded' }),
      }
    );
  }

  private getVmInfo(sandboxId: number, vmName: string): Observable<HostDTO> {
    return this.http
      .get<HostDTO>(`${this.configService.config.topologyRestUrl}sandboxes/${sandboxId}/vms/${vmName}`)
      .pipe(
        tap({
          error: (err) => {
            const errorMessage = new TopologyError(err, 'Get VMs info.');
            this.errorService.emitError(errorMessage);
          },
        })
      );
  }

  private getManIp(sandboxId: number): Observable<ManDTO> {
    return this.http
      .get<ManDTO>(`${this.configService.config.topologyRestUrl}sandboxes/${sandboxId}/man-out-port-ip`)
      .pipe(
        tap({
          error: (err) => {
            const errorMessage = new TopologyError(err, 'Get VMs info.');
            this.errorService.emitError(errorMessage);
          },
        })
      );
  }

  private getQuickConnectURI(
    vmIp: string,
    vmOsType: string,
    manIp: string,
    userInterface: UserInterface
  ): Observable<URLSearchParams> {
    const body = new URLSearchParams();
    switch (userInterface) {
      case UserInterface.CLI:
        body.set('uri', `ssh://${vmIp}/?guacd-hostname=${manIp}&guacd-port=4822`);
        break;
      case UserInterface.GUI:
        if (vmOsType === 'linux') {
          body.set('uri', `vnc://${vmIp}:5900/?guacd-hostname=${manIp}&guacd-port=4822`);
        } else {
          body.set('uri', `rdp://${vmIp}:3389/?guacd-hostname=${manIp}&guacd-port=4822`);
        }
    }
    return of(body);
  }

  private createGuacamoleQuickConnection(
    token: string,
    vmIp: string,
    vmOsType: string,
    manIp: string,
    userInterface: UserInterface
  ) {
    return this.getQuickConnectURI(vmIp, vmOsType, manIp, userInterface).pipe(
      switchMap((urlSearchParams) => {
        // eslint-disable-next-line max-len
        return this.http
          .post<GuacamoleIdentifierDTO>(
            `${this.configService.config.guacamoleConfig.url}api/session/ext/quickconnect/create`,
            urlSearchParams.toString(),
            {
              headers: new HttpHeaders({ 'Content-Type': ' application/x-www-form-urlencoded' }),
              params: new HttpParams().set('token', token),
            }
          )
          .pipe(map((resp) => resp.identifier));
      }),
      tap({
        error: (err) => {
          const errorMessage = new TopologyError(err, 'Creating Guacamole quick connection.');
          this.errorService.emitError(errorMessage);
        },
      })
    );
  }

  /**
   * Sends http request to perform an action on a virtual machine
   * @param sandboxId id of sandbox in which the vm exists
   * @param vmName name of the vm on which to perform the action
   * @param action action to be performed
   */
  performVMAction(sandboxId: number, vmName: string, action: string): Observable<any> {
    return this.http
      .patch(`${this.configService.config.topologyRestUrl}sandboxes/${sandboxId}/vms/${vmName}`, { action: action })
      .pipe(
        tap({
          error: (err) => {
            const errorMessage = new TopologyError(err, 'Performing VM action: ' + action);
            this.errorService.emitError(errorMessage);
          },
        })
      );
  }
}
