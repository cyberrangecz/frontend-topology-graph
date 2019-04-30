import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable, of} from 'rxjs';

@Injectable()
export class HostService {

  constructor(private http: HttpClient,
              private configService: ConfigService) {
  }

  establishRemoteConnection(consoleUrl: string) {
    window.open(consoleUrl, "_blank");
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
