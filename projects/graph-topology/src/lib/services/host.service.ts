import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Observable} from 'rxjs';

@Injectable()
export class HostService {

  constructor(private http: HttpClient,
              private configService: ConfigService) {

  }

  start(scenarioName: string, hostName: string): Observable<any> {
    return this.http.get(this.configService.config.scenarioRestUrl + scenarioName + '/sandbox/host/' + hostName + '/start')
  }

  restart(scenarioName: string, hostName: string): Observable<any> {
    return this.http.get(this.configService.config.scenarioRestUrl + scenarioName + '/sandbox/host/' + hostName + '/restart')
  }
}
