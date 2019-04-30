import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable, of} from 'rxjs';
import {SpiceClientService} from 'spice-client-lib';

@Injectable()
export class HostService {

  constructor(private http: HttpClient,
              private spice: SpiceClientService,
              private configService: ConfigService) {
  }

  /**
   * Establishes remote connection with a node through spice client
   * @param nodeName name of the node
   */
  establishRemoteConnection(consoleUrl: string) {
/*    this.spice.openClient({
    });*/
  }

  /**
   * Calls REST API to restart host
   * @param hostName name of a host which should be started
   */
  start(hostName: string): Observable<any> {
    return of(false)
    //return this.http.get(this.configService.config.scenarioRestUrl + this.configService.config.sandboxName + '/sandbox/host/' + hostName + '/start')
  }

  /**
   * Calls REST API to restart host
   * @param hostName name of a host which should be restarted
   */
  restart(hostName: string): Observable<any> {
    return of(false)
    //return this.http.get(this.configService.config.scenarioRestUrl + this.configService.config.sandboxName + '/sandbox/host/' + hostName + '/restart')
  }

  /**
   * Calls REST API to create running snapshot of a host
   * @param hostName name of a host for which should be created running snapshot
   */
  createRunningSnapshot(hostName: string): Observable<any> {
    return of(false)
    // return this.http.get(this.configService.config.scenarioRestUrl + this.configService.config.sandboxName + '/host/createRunningSnapshot/' + hostName);
  }

  /**
   * Calls REST API to revert running snapshot of a host
   * @param hostName name of a host for which should be reverted running snapshot
   */
  revertRunningSnapshot(hostName: string): Observable<any> {
    return of(false)
    //return this.http.get(this.configService.config.scenarioRestUrl + this.configService.config.sandboxName + '/host/revertRunningSnapshot/' + hostName);
  }
}
