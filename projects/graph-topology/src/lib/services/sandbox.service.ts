import {Injectable} from '@angular/core';
import {SpiceClientService} from 'spice-client-lib';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ConfigService} from './config.service';

@Injectable()
export class SandboxService {

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private spice: SpiceClientService) {
  }

  /**
   * Establishes remote connection with a node through spice client
   * @param nodeName name of the node
   * @param ipAddress ip address of a node with which should the connection be established
   */
  establishRemoteConnection(nodeName: string, ipAddress: string) {
    this.getSandboxNameByIp(ipAddress)
      .subscribe((response => {
        this.spice.openClient({
          sandboxName: response.name,
          machineName: nodeName
        });
      }));
  }

  getSandboxNameByIp(ipAddress: string): Observable<any> {
   return this.http.get(this.configService.config.scenarioRestUrl + 'sandbox/name/ + ' + ipAddress);
  }

  createRunningSnapshot(scenarioName: string): Observable<any> {
    return this.http.get(this.configService.config.scenarioRestUrl + 'sandbox/createRunningSnapshotName/' + scenarioName)
  }

  revertRunningSnapshot(scenarioName: string): Observable<any> {
    return this.http.get(this.configService.config.scenarioRestUrl + 'sandbox/revertRunningSnapshot/' + scenarioName)
  }

}
