import {Injectable} from '@angular/core';
import {SpiceClientService} from 'spice-client-lib';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ConfigService} from './config.service';

@Injectable()
export class RemoteConnectionService {

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
  establishConnection(nodeName: string, ipAddress: string) {
    this.getSandboxNameByIp(ipAddress)
      .subscribe((response => {
        this.spice.openClient({
          sandboxName: response.name,
          machineName: nodeName
        });
      }));
  }

  private getSandboxNameByIp(ipAddress: string): Observable<any> {
   return this.http.get(this.configService.config.sandboxRestUrl + '/name/ + ' + ipAddress);
  }
}
